### GMP模型？<Badge text="重要" type="danger" />

G(goroutine)

go 语言中的协程 goroutine 的缩写，相当于操作系统中的进程控制块。其中存着 goroutine 的运行时栈信息，CPU 的一些寄存器的值以及执行的函数指令等。sched字段保存了 goroutine 的上下文。goroutine 切换的时候不同于线程有 OS 来负责这部分数据，而是由一个 gobuf 结构体来保存。

```go
type g struct {
  stack       stack   		// 描述真实的栈内存，包括上下界

  m              *m     	// 当前的 m
  sched          gobuf   	// goroutine 切换时，用于保存 g 的上下文      
  param          unsafe.Pointer // 用于传递参数，睡眠时其他 goroutine 可以设置 param，唤醒时该goroutine可以获取
  atomicstatus   uint32
  stackLock      uint32 
  goid           int64  	// goroutine 的 ID
  waitsince      int64 		// g 被阻塞的大体时间
  lockedm        *m     	// G 被锁定只在这个 m 上运行
}

```

gobuf 保存了当前的栈指针，计数器，还有 g 自身，这里记录自身 g 的指针的目的是为了**能快速的访问到 goroutine 中的信息**。gobuf 的结构如下：

```go
type gobuf struct {
    sp   uintptr
    pc   uintptr
    g    guintptr
    ctxt unsafe.Pointer
    ret  sys.Uintreg
    lr   uintptr
    bp   uintptr // for goEXPERIMENT=framepointer
}
```

M(Machine)

M代表一个操作系统的主线程，对内核级线程的封装，数量对应真实的 CPU 数。一个 M 直接关联一个 os 内核线程，用于执行 G。M 会优先从关联的 P 的本地队列中直接获取待执行的 G。M 保存了 M 自身使用的栈信息、当前正在 M上执行的 G 信息、与之绑定的 P 信息。

结构体 M 中，curg代表结构体M当前绑定的结构体 G ；g0 是带有调度栈的 goroutine，普通的 goroutine 的栈是在**堆上**分配的可增长的栈，但是 g0 的栈是 **M 对应的线程**的栈。与调度相关的代码，会先切换到该 goroutine 的栈中再执行。

```go
type m struct {
    g0      *g     				// 带有调度栈的goroutine

    gsignal       *g         	// 处理信号的goroutine
    tls           [6]uintptr 	// thread-local storage
    mstartfn      func()
    curg          *g       		// 当前运行的goroutine
    caughtsig     guintptr 
    p             puintptr 		// 关联p和执行的go代码
    nextp         puintptr
    id            int32
    mallocing     int32 		// 状态

    spinning      bool 			// m是否out of work
    blocked       bool 			// m是否被阻塞
    inwb          bool 			// m是否在执行写屏蔽

    printlock     int8
    incgo         bool
    fastrand      uint32
    ncgocall      uint64      	// cgo调用的总数
    ncgo          int32       	// 当前cgo调用的数目
    park          note
    alllink       *m 			// 用于链接allm
    schedlink     muintptr
    mcache        *mcache 		// 当前m的内存缓存
    lockedg       *g 			// 锁定g在当前m上执行，而不会切换到其他m
    createstack   [32]uintptr 	// thread创建的栈
}
```

P(Processor)

Processor 代表了 M 所需的上下文环境，代表 M 运行 G 所需要的资源。是处理用户级代码逻辑的处理器，可以将其看作一个局部调度器使 go 代码在一个线程上跑。当 P 有任务时，就需要创建或者唤醒一个系统线程来执行它队列里的任务，所以 P 和 M 是相互绑定的。P 可以根据实际情况开启协程去工作，它包含了运行 goroutine 的资源，如果线程想运行 goroutine，必须先获取 P，P 中还包含了可运行的 G 队列。

```go
type p struct {
    lock mutex

    id          int32
    status      uint32 		// 状态，可以为pidle/prunning/...
    link        puintptr
    schedtick   uint32     // 每调度一次加1
    syscalltick uint32     // 每一次系统调用加1
    sysmontick  sysmontick 
    m           muintptr   // 回链到关联的m
    mcache      *mcache
    racectx     uintptr

    goidcache    uint64 	// goroutine的ID的缓存
    goidcacheend uint64

    // 可运行的goroutine的队列
    runqhead uint32
    runqtail uint32
    runq     [256]guintptr

    runnext guintptr 		// 下一个运行的g

    sudogcache []*sudog
    sudogbuf   [128]*sudog

    palloc persistentAlloc // per-P to avoid mutex

    pad [sys.CacheLineSize]byte
}
```



### GMP的调度流程？<Badge text="重要" type="danger" />

![](https://pic.imgdb.cn/item/63e223e84757feff33526e36.jpg)

- 每个 P 有个局部队列，局部队列保存待执行的goroutine（流程 2），当 M 绑定的 P 的的局部队列已经满了之后就会把 goroutine 放到全局队列（流 程 2-1）
- 每个 P 和一个 M 绑定，M 是真正的执行 P 中 goroutine 的实体（流程 3）， M 从绑定的 P 中的局部队列获取 G 来执行
- 当 M 绑定的 P 的局部队列为空时，M 会从全局队列获取到本地队列来执行 G （流程 3.1），当从全局队列中没有获取到可执行的 G 时候，M 会从其他 P 的局部队列中偷取 G 来执行（流程 3.2），这种从其他 P 偷的方式称为 work stealing
- 当 G 因系统调用（syscall）阻塞时会阻塞 M，此时 P 会和 M 解绑即 hand off，并寻找新的 idle 的 M，若没有 idle 的 M 就会新建一个 M（流程 5.1）
- 当 G 因 channel 或者 network I/O 阻塞时，不会阻塞 M，M 会寻找其他 runnable 的 G；当阻塞的 G 恢复后会重新进入 runnable 进入 P 队列等待执 行（流程 5.3）



### P和M的个数？

- P: 由启动时环境变量 `$GOMAXPROCS` 或者是由 `runtime`的方法`GOMAXPROCS()`决定。这意味着在程序执行的任意时刻都只有`$GOMAXPROCS`个goroutine在同时运行。
- M:
  - Go 语言本身的限制：Go 程序启动时，会设置 M 的最大数量，默认 10000，但是内核很难支持这么多的线程数，所以这个限制可以忽略。
  - runtime/debug 中的 SetMaxThreads 函数，设置 M 的最大数量。
  - 一个 M 阻塞了，会创建新的 M。

M 与 P 的数量没有绝对关系，一个 M 阻塞，P 就会去创建或者切换另一个 M，所以，即使 P 的默认数量是 1，也有可能会创建很多个 M 出来。



### **P和M何时会被创建**？

P: 在确定了 P 的最大数量 n 后，运行时系统会根据这个数量创建 n 个 P。

M: 没有足够的 M 来关联 P 并运行其中的可运行的 G 时创建。比如所有的 M 此时都阻塞住了，而 P 中还有很多就绪任务，就会去寻找空闲的 M，而没有空闲的，就会去创建新的 M。



### goroutine创建流程？<Badge text="重要" type="danger" />

在调用go func()的时候，会调用runtime.newproc来创建一个goroutine，这个goroutine会新建一个自己的栈空间，同时在G的sched中维护栈地址与程序计数器这些信息（备注：这些数据在goroutine被调度的时候会被用到。准确的说该goroutine在放弃cpu之后，下一次在重新获取cpu的时候，这些信息会被重新加载到cpu的寄存器中。）

创建好的这个goroutine会被放到它所对应的内核线程M所使用的上下文P中的run_queue中，等待调度器来决定何时取出该goroutine并执行，通常调度是按时间顺序被调度的，这个队列是一个先进先出的队列。



### goroutine什么时候会被挂起？<Badge text="重要" type="danger" />

- waitReasonChanReceiveNilChan：对未初始化的 channel 进行读操作
- waitReasonChanSendNilChan：对未初始化的 channel 进行写操作
- 在 main goroutine 发生 panic 时，会触发
- 在调用关键字 select 时会触发
- 在调用关键字 select 时，若一个 case 都没有，会直接触发
- 在 channel 进行读操作，会触发
- 在 channel 进行写操作，会触发
- sleep 行为，会触发
- IO 阻塞等待时，例如：网络请求等
- 在垃圾回收时，主要场景是 GC 标记终止和标记阶段时触发
- GC 清扫阶段中的结束行为，会触发
- 信号量处理结束时，会触发



### 同时启动了一万个goroutine，会如何调度？<Badge text="掌握" type="tip" />

一万个G会按照P的设定个数，尽量平均地分配到每个P的本地队列中。如果所有本地队列都满了，那么剩余的G则会分配到GMP的全局队列上。接下来便开始执行GMP模型的调度策略：

- **本地队列轮转**：每个P维护着一个包含G的队列，不考虑G进入系统调用或IO操作的情况下，P周期性的将G调度到M中执行，执行一小段时间，将上下文保存下来，然后将G放到队列尾部，然后从队首中重新取出一个G进行调度。
- **系统调用**：P的个数默认等于CPU核数，每个M必须持有一个P才可以执行G，一般情况下M的个数会略大于P的个数，这多出来的M将会在G产生系统调用时发挥作用。当该G即将进入系统调用时，对应的M由于陷入系统调用而进被阻塞，将释放P，进而某个空闲的M1获取P，继续执行P队列中剩下的G。
- **工作量窃取**：多个P中维护的G队列有可能是不均衡的，当某个P已经将G全部执行完，然后去查询全局队列，全局队列中也没有新的G，而另一个M中队列中还有3很多G待运行。此时，空闲的P会将其他P中的G偷取一部分过来，一般每次偷取一半。



### goroutine内存泄漏和处理？

**原因**：

Goroutine 是轻量级线程，需要维护执行用户代码的上下文信息。在运行过程中也需要消耗一定的内存来保存这类信息，而这些内存在目前版本的 Go 中是不会被释放的。因此，如果一个程序持续不断地产生新的 goroutine、且不结束已经创建的 goroutine 并复用这部分内存，就会造成内存泄漏的现象。造成泄露的大多数原因有以下三种：

- Goroutine 内正在进行 channel/mutex 等读写操作，但由于逻辑问题，某些情况下会被一直阻塞。
- Goroutine 内的业务逻辑进入死循环，资源一直无法释放。
- Goroutine 内的业务逻辑进入长时间等待，有不断新增的 Goroutine 进入等待。

**解决方法**：

- 使用channel

  - 1、使用channel接收业务完成的通知

  - 2、业务执行阻塞超过设定的超时时间，就会触发超时退出

- 使用pprof排查
  - pprof是由 Go 官方提供的可用于收集程序运行时报告的工具，其中包含 CPU、内存等信息。当然，也可以获取运行时 goroutine 堆栈信息。



