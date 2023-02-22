### make和new区别？<Badge text="重要" type="danger" />

**make**：make能够**分配并初始化**类型所需的内存空间和结构，返回引用类型的本身；make具有使用范围的局限性，仅支持 channel、map、slice三种类型；make函数会对三种类型的内部数据结构（长度、容量等）赋值。

**new**：new能够**分配**类型所需的内存空间，返回指针引用（指向内存的指针）；new可被替代，能够通过字面值快速初始化。



### struct能不能比较？<Badge text="掌握" type="tip" />

不同类型的结构体，如果成员变量类型、变量名和顺序都相同，而且结构体没有不可比较字段时，那么进行显式类型转换后就可以比较，反之不能比较。

同类型的struct分为两种情况：

- struct的所有成员都是可以比较的，则该strcut的不同实例可以比较
- struct中含有不可比较的成员，则该struct不可以比较

当需要比较两个struct内容时，最好使用reflect.DeepEqual方法进行比较，无论什么类型均可满足比较要求。

::: tip 不可比较的类型

- slice，因为slice是引用类型，除非和nil比较
- map，和slice同理，如果要比较两个map只能通过循环遍历实现
- 函数类型，不能比较

:::



### 为什么slice之间不能直接比较？<Badge text="了解" type="info" />

因为slice的元素是间接引用的，一个slice甚至可以包含自身，slice的变量实际是一个指针，使用 == 其实在判断地址。



### slice的底层实现？<Badge text="重要" type="danger" />

切片的底层是一个结构体，对应三个参数，一个是**unsafe.Pointer指针**，指向一个具体的底层数组，一个是**cap**，切片的容量，一个是**len**，切片的长度。

因为切片是基于数组实现，所以它的底层的内存是连续分配的，效率非常高，可以通过索引获得数据。切片本身并不是动态数组或者数组指针，而是设定相关属性，将数据读写操作限定在指定的区域内。切片本身是一个只读对象，其工作机制类似数组指针的一种封装。

如果make函数初始化了一个太大的切片，该切片就会逃逸到堆区；如果分配了一个比较小的切片，就会被分配到栈区，切片大小的临界值默认为64KB，因此make([]int64, 1023) 和 make([]int64, 1024) 是完全不同的内存布局。

```go
type slice struct {
	array unsafe.Pointer
	len   int
	cap   int
}
```



### slice和数组的区别？<Badge text="重要" type="danger" />

**切片是指针类型，数组是值类型**

传递数组是通过拷贝的方式，传递切片是通过传递引用的方式。

**数组的长度固定，而切片可以进行动态扩容**

数组是一组内存空间连续的数据，一旦初始化长度大小就不会再改变，切片的长度可以进行扩展，当切片底层的数组容量不够时，切片会创建新的底层数组。

**切片比数组多一个属性容量（cap)**



### slice的扩容机制？<Badge text="重要" type="danger" />

扩容主要分为两个过程：第一步是分配新的内存空间，第二步是将原有切片内容进行复制。分配新空间时候需要估计大致容量，然后再确定容量。

根据该切片当前容量选择不同的策略：

- 如果期望容量大于当前容量的两倍，就会使用期望容量
- 如果当前切片的长度小于 1024，容量就会翻倍
- 如果当前切片的长达大于 1024，每次扩容 25% 的容量，直到新容量大于期望容量
- 在进行循环1.25倍计算时，最终容量计算值发生溢出，即超过了int的最大范围，则最终容量就是新申请的容量

对于切片的扩容

- 当切片比较小的，采用较大的扩容倍速进行扩容，避免频繁扩容，从而减少内存分配的次数和数据拷贝的代价
- 当切片较大的时，采用较小的扩容倍速，主要避免空间浪费



### slice是线程安全的吗？<Badge text="了解" type="info" />

不是。slice底层结构并没有使用加锁等方式，不支持并发读写，所以并不是线程安全的，使用多个goroutine对类型为slice的变量进行操作，每次输出的值大概率都不会一样，与预期值不一致; slice在并发执行中不会报错，但是数据会丢失。

**实现线程安全的方法**：

互斥锁，读写锁，原子操作，sync.once，sync.atomic，channel。



### slice之间怎么进行比较？<Badge text="掌握" type="tip" />

```go
func equal(x, y []int) bool {
    if len(x) != len(y) {
        return false
    }
    for i := range x {
        if x[i] != y[i] {
            return false
        }
    }
    return true 
}
```



### map之间如何进行比较？<Badge text="了解" type="info" />

```go
func equal(x, y map[string]int) bool {
    if len(x) != len(y) {
        return false
    }
    for k, xv := range x {
        if yv, ok := y[k]; !ok || yv != xv {
            return false
        }
    }
    return true 
}
```



### map如何实现顺序读取？<Badge text="了解" type="info" />

map不能顺序读取，是因为他是无序的，想要有序读取，需要把key变为有序，所以可以把key放入切片，对切片进行排序，遍历切片，通过key取值。

```go
package main

import (
    "fmt"
    "sort"
)

func main() {
    var m = map[string]int{
        "hello":         0,
        "morning":       1,
        "keke":          2,
        "jame":   		 3,
    }
    var keys []string
    for k := range m {
        keys = append(keys, k)
    }
    sort.Strings(keys)
    for _, k := range keys {
        fmt.Println("Key:", k, "Value:", m[k])
    }
}
```



### map的底层数据结构？<Badge text="掌握" type="tip" />

**结构**：底层是由hmap和bmap两个结构体实现，map在实际存储键值对结构用到了数组和链表。之所以高效，是因为其结合了顺序存储数组和链式存储(链表)两种存储结构。数组是map的主干，在数组下有一个类型为链表的元素。

**hmap**：

```go
type hmap struct {
    count     int    //元素的个数
    flags     uint8  //状态标志
    B         uint8  //可以最多容纳 6.5 * 2 ^ B 个元素，6.5为装载因子
    noverflow uint16 //溢出的个数
    hash0     uint32 //哈希种子

    buckets    unsafe.Pointer //指向一个桶数组
    oldbuckets unsafe.Pointer //指向一个旧桶数组，用于扩容
    nevacuate  uintptr        //搬迁进度，小于nevacuate的已经搬迁
    overflow *[2]*[]*bmap     //指向溢出桶的指针
}
```

hmap是map的最外层的一个数据结构，包括了map的各种基础信息、如大小、bucket。buckets这个参数它存储的是指向buckets数组的一个指针。

**bmap**：

```go
type bmap struct {
    //元素hash值的高8位代表它在桶中的位置，如果tophash[0] < minTopHash，表示这个桶的搬迁状态
    tophash [bucketCnt]uint8
    //接下来是8个key、8个value，但是我们不能直接看到；为了优化对齐，go采用了key放在一起，value放在一起的存储方式，
    keys     [8]keytype   //key单独存储
	values   [8]valuetype //value单独存储
	pad      uintptr
	overflow uintptr	  //指向溢出桶的指针
}
```

bucket(桶)，每一个bucket最多放8个key和value，最后由一个overflow字段指向下一个bmap，key、value、overflow字段都不显示定义，而是通过maptype计算偏移获取的。



::: tip 高位哈希和低位哈希

哈希函数会将传入的key值进行哈希运算，得到一个唯一的值。前半部分就叫做**高位哈希值**，后半部分就叫做**低位哈希值**。**高位哈希值是用来确定当前的bucket有没有所存储的数据的；低位哈希值是用来确定，当前的数据存在了哪个bucket**

:::



### bucket是如何工作的？<Badge text="了解" type="info" />

bucket的tophash存储高八位哈希以加快索引。**把高八位存储起来，不用完整比较key就能过滤掉不符合的key，加快查询速度**。当一个哈希值的高8位和存储的高8位相符合，再去比较完整的key值，进而取出value。当超过8个元素需要存入某个bucket时，`hmap`会拓展该bucket。

存储的key 和value底层排列方式是：key全部放在一起，value全部放在一起。当key大于128字节时，bucket的key和value字段存储的是指针，指向实际内容。这样排列好处是在key和value的长度不同的时候，可以消除padding带来的空间浪费

bucket还存储的溢出时指向的下一个bucket的指针。如果超过就重新创建一个bucket挂在原bucket上，持续挂接形成链表。



### map的查找过程？<Badge text="了解" type="info" />

查找或操作map时，首先key经过hash函数生成hash值，通过哈希值的低8位来判断当前数据属于哪个bucket，找到bucket以后，通过哈希值的高八位与bucket存储的高位哈希值循环比对，如果相同就比较刚才找到的底层数组的key值，如果key相同，取出value。如果高八位hash值在此bucket没有，或者有，但是key不相同，就去链表中下一个溢出bucket中查找，直到查找到链表的末尾。



### map的扩容过程？<Badge text="了解" type="info" />

bmap扩容的加载因数达到6.5(元素个数/bucket)，bmap就会进行扩容，将原来bucket数组数量扩充一倍，产生一个新的bucket数组。这样bmap中的oldbuckets属性指向的就是旧bucket数组。

map的扩容不会立马全部复制，而是渐进式扩容，即首先开辟2倍的内存空间，创建一个新的bucket数组。只有当访问原来就的bucket数组时，才会将就得bucket拷贝到新的bucket数组，进行渐进式的扩容。当然旧的数据不会删除，而是去掉引用，等待gc回收。

::: tip 负载因子

加载因数6.5，这个是经过测试才得出的合理的一个阈值。因为，加载因子越小，空间利用率就小，加载因子越大，产生冲突的几率就大。所以6.5是一个平衡的值。

:::



### 如何实现一个线程安全的map？

三种方式实现：

- 加读写锁
- 分片加锁
- sync.Map

加读写锁、分片加锁，这两种方案都比较常用，后者的性能更好，因为它可以降低锁的粒度，提高访问此 map 对象的吞吐。前者并发性能虽然不如后者，但是加锁的方式更加简单。sync.Map 是 Go 1.9 增加的一个线程安全的 map ，虽然是官方标准，但反而是不常用的，原因是 map 要解决的场景很难描述，很多时候程序员在做抉择是否该用它，不过在一些特殊场景会使用 sync.Map：

- 场景一：只会增长的缓存系统，一个 key 值写入一次而被读很多次
- 场景二：多个 goroutine 为不相交的键读、写和重写键值对

使用场景：https://golang.org/pkg/sync/#Map

加读写锁，扩展 map 来实现线程安全，支持并发读写。使用读写锁 RWMutex，是为了读写性能的考虑。对 map 对象的操作，无非就是常见的增删改查和遍历。我们可以将查询和遍历看作读操作，增加、修改和删除看作写操作。

::: tip 提示

大量并发读写的情况下，锁的竞争会很激烈，导致性能降低。如何解决这个问题？

尽量减少锁的粒度和锁的持有时间，减少锁的粒度，常用方法就是分片Shard，将一把锁分成几把锁，每个锁控制一个分片。

:::







### channel的概念？<Badge text="重要" type="danger" />

channel又称为管道，用于数据传递或数据共享，其本质是一个先进先出的队列，使用goroutine+channel进行数据通讯简单高效，**同时也线程安全**，多个goroutine可同时修改一个channel，不需要加锁。



### channel有哪些状态？<Badge text="重要" type="danger" />

**nil**：未初始化的状态，只进行了声明，或者手动赋值为nil。

**active**：正常的channel，可读或者可写。

**closed**：已关闭，channel的值不是nil，**关闭的状态的channel仍然可以读值（取值），但不能写值（会报panic: send on closed channel）**，nil状态的channel是不能close（panic: close of nil channel）的。如果关闭后的 channel 没有数据可读取时，将得到零值，即对应类型的默认值。

| 操作        | 空channel | 已关闭channel | 活跃中的channel |
| ----------- | --------- | ------------- | --------------- |
| close(ch)   | panic     | panic         | 成功关闭        |
| ch<- v      | 永远阻塞  | panic         | 成功发送或阻塞  |
| v,ok = <-ch | 永远阻塞  | 不阻塞        | 成功接收或阻塞  |



### 如何判断channel已经关闭？<Badge text="重要" type="danger" />



```go
if v, ok := <-ch; !ok {
	fmt.Println("channel 已关闭，读取不到数据")
}
```





### channel的底层实现原理？<Badge text="了解" type="info" />

channel有几个重要的字段：

- buf指向一个底层的循环数组，只有设置为有缓存的channel才会有buf
- sendx和recvx分别指向底层循环数组的发送和接收元素位置的索引
- sendq和recvq分别表示发送数据的被阻塞的goroutine和读取数据的goroutine，这两个都是一个双向链表结构
- sendq和recvq 的结构为等待队列类型，sudog是对goroutine的一种封装

```go
type hchan struct {
    qcount   uint           // channel中的元素个数
    dataqsiz uint           // channel中循环队列的长度
    buf      unsafe.Pointer // channel缓冲区数据指针
    elemsize uint16            // buffer中每个元素的大小
    closed   uint32            // channel是否已经关闭，0未关闭
    elemtype *_type // channel中的元素的类型
    sendx    uint   // channel发送操作处理到的位置
    recvx    uint   // channel接收操作处理到的位置
    recvq    waitq  // 等待接收的sudog（sudog为封装了goroutine和数据的结构）队列由于缓冲区空间不足而阻塞的goroutine列表
    sendq    waitq  // 等待发送的sudog队列，由于缓冲区空间不足而阻塞的goroutine列表

    lock mutex   // 一个轻量级锁
}
```



### channel发送数据和接收数据的过程？<Badge text="了解" type="info" />

**channel发送数据过程：**

- 检查 recvq 是否为空，如果不为空，则从 recvq 头部取一个 goroutine，将数据发送过去，并唤醒对应的 goroutine 
- 如果 recvq 为空，则将数据放入到 buffer 中
- 如果 buffer 已满，则将要发送的数据和当前 goroutine 打包成 sudog 对象放入到 sendq中。并将当前 goroutine 置为 waiting 状态

**channel接收数据过程：**

- 检查sendq是否为空，如果不为空，且没有缓冲区，则从sendq头部取一个goroutine，将数据读取出来，并唤醒对应的goroutine，结束读取过程
- 如果sendq不为空，且有缓冲区，则说明缓冲区已满，则从缓冲区中首部读出数据，把sendq头部的goroutine数据写入缓冲区尾部，并将goroutine唤醒，结束读取过程
- 如果sendq为空，缓冲区有数据，则直接从缓冲区读取数据，结束读取过程
- 如果sendq为空，且缓冲区没数据，则只能将当前的goroutine加入到recvq,并进入waiting状态，等待被写goroutine唤醒



### channel是否线程安全的？<Badge text="掌握" type="tip" />

channel是线程安全的。

不同协程通过channel进行通信，本身的使用场景就是多线程，为了保证数据的一致性必须实现线程安全。



### channel如何实现线程安全的？<Badge text="掌握" type="tip" />

channel的底层实现中， hchan结构体中采用Mutex锁来保证数据读写安全。在对循环数组buf中的数据进行入队和出队操作时，必须先获取互斥锁，才能操作channel数据。



### channel的应用场景？<Badge text="掌握" type="tip" />

**任务定时**

```go
select {
    case <-time.After(time.Second)
}
```

**定时任务**

```go
select {
    case <- time.Tick(time.Second)
}
```

**解耦生产者和消费者**

可以将生产者和消费者解耦出来，生产者只需要往channel发送数据，而消费者只管从channel中获取数据。

**控制并发数**

以爬虫为例，比如需要爬取1w条数据，需要并发爬取以提高效率，但并发量又不能过大，可以通过channel来控制并发规模，比如同时支持5个并发任务：

```go
ch := make(chan int, 5)
for _, url := range urls {
  go func() {
    ch <- 1
    worker(url)
    <- ch
  }
}
```



### select的用途？<Badge text="重要" type="danger" />

select可以理解为是在语言层面实现了和I/O多路复用相似的功能：监听多个描述符的读/写等事件，一旦某个描述符就绪(一般是读或者写事件发生了)，就能够将发生的事件通知给关心的应用程序去处理该事件。

golang的select机制是：监听多个channel，每一个case是一个事件，可以是读事件也可以是写事件，**随机选择一个执行**。可以设置default，它的作用是当监听的多个事件都阻塞住就会执行default的逻辑。

```go
select {
    case <-ch1:
        // 如果从 ch1 信道成功接收数据，则执行该分支代码
    case ch2 <- 1:
        // 如果成功向 ch2 信道成功发送数据，则执行该分支代码
    default:
        // 如果上面都没有成功，则进入 default 分支处理流程
}
```

::: tip 提示

- select语句只能用于信道的读写操作
- select中的case条件(非阻塞)是并发执行的，select会选择先操作成功的那个case条件去执行，如果多个同时返回，则随机选择一个执行，此时将无法保证执行顺序
- 对于case条件语句中，如果存在信道值为nil的读写操作，则该分支将被忽略，可以理解为从select语句中删除了这个case语句
- 如果有超时条件语句，判断逻辑为如果在这个时间段内一直没有满足条件的case，则执行这个超时case。如果此段时间内出现了可操作的case，则直接执行这个case。一般用超时语句代替了default语句
- 对于空的select{}，会引起死锁
- 对于for中的select{}, 可能会引起cpu占用过高的问题

:::

### defer的概述？<Badge text="重要" type="danger" />

defer是go语言提供的一种用于注册延迟调用的机制：让函数或者语句在当前函数执行完毕(**包括return正常结束或者panic导致的异常结束**)之后进行调用。defer具有以下特性：

- **延迟调用**：defer在main函数return之前调用，且defer必须置于函数内部
- **LIFO**：后进先出，压栈式执行
- **作用域**：defer只和defer所在函数绑定在一起，作用域也只在这个函数，如果defer处于匿名函数中，会先调用匿名函数中的defer



### defer的使用场景？<Badge text="重要" type="danger" />

defer关键字通常通常出现在一些成对出现的操作中，比如创建关闭链接、加锁解锁、打开关闭文件等操作。defer在一些资源回收的场景很有用。

**并发处理**

```go
var wg sync.WaitGroup

for i := 0; i < 2; i++ {
    wg.Add(1)
    go func() {
        defer wg.Done()
        // 程序逻辑
    }()
}
wg.Wait()
```

**锁场景**

```go
	mu.RLock()
	defer mu.RUnlock()
```

**资源释放**

```go
    // new 一个客户端 client；
    cli, err := clientv3.New(clientv3.Config{Endpoints: endpoints})
    if err != nil {
        log.Fatal(err)
    }
    // 释放该 client ，也就是说该 client 的声明周期就只在该函数中；
    defer cli.Close()
```

**panic-recover**

```go
	defer func() {
		if v := recover(); v != nil {
			_ = fmt.Errorf("PANIC=%v", v)
		}
	}()
```



### defer的底层原理？<Badge text="掌握" type="tip" />

defer的数据结构如下：主要由siz属性，标识返回值的内存和大小、heap属性，标识是在栈上分配还是在堆上分配、sp是栈指针、pc程序计数器、fn是传入的函数地址、link是defer链表。

```go
type _defer struct {
	siz     int32 // 参数和返回值的内存大小
	started bool
	heap    bool    // 区分该结构是在栈上分配的，还是对上分配的
	sp        uintptr  // sp 计数器值，栈指针；
	pc        uintptr  // pc 计数器值，程序计数器；
	fn        *funcval // defer 传入的函数地址，也就是延后执行的函数;
	_panic    *_panic  // panic that is running defer
	link      *_defer   // 链表
}
```

link属性将defer串成一个链表，表头是挂载在goroutine的_defer属性。defer结构只是一个头结构，后面跟着延迟函数的参数和返回值空间，内存在defer关键字执行的时候填充。

对于go语言版本1.13之前defer关键字处理被分为deferproc和deferreturn两个过程，对应着回调注册函数过程和执行注册函数链的过程。在go1.13起带来了deferprocStatck，也是用来注册回调函数，但是不同的是，**deferproc是在堆上分配内存结构，deferprocStack是在栈上分配struct的结构**，栈上的分配是远快于堆上的分配，所以性能得到了提升。

当 defer 外层出现显式（for）或者隐式（goto）的时候，将会导致 struct _defer 结构体分配在堆上。

**deferprocStack**

当defer结构体在栈上分配时，调用deferprocStack之前编译器就已经把defer结构体初始化好了，heap属性设置为false，保存上下文，把 caller 函数的 rsp，pc（rip） 寄存器的值保存到 _defer结构体，并且将defer结构体挂载到goroutine链表中去。

```go
// 进到这个函数之前，就已经在栈上分配好了内存结构（编译器分配的，rsp 往下伸展即可）
func deferprocStack(d *_defer) {
	gp := getg()

	// siz 和 fn 在进到这个函数之前已经赋值；
	d.started = false
	// 标名是栈的内存
	d.heap = false
	// 获取到 caller 函数的 rsp 寄存器值，并赋值到 _defer 结构 sp 字段中；
	d.sp = getcallersp()
	// 获取到 caller 函数的 pc (rip) 寄存器值，并赋值到 _defer 结构 pc 字段中；
	// 回忆起函数调用的原理，就知道 caller 的压栈的 pc 值就是 deferprocStack 的下一行指令；
	d.pc = getcallerpc()

	// 把这个 _defer 结构作为一个节点，挂到 goroutine 的链表中；
	*(*uintptr)(unsafe.Pointer(&d._panic)) = 0
	*(*uintptr)(unsafe.Pointer(&d.link)) = uintptr(unsafe.Pointer(gp._defer))
	*(*uintptr)(unsafe.Pointer(&gp._defer)) = uintptr(unsafe.Pointer(d))
	// 注意，特殊的返回，不会触发延迟调用的函数
	return0()
}
```

**deferproc**

当defer结构体在堆上分配时，结构体在函数里面初始化，调用newdefer分配结构体，并且去缓冲池中查找，如果有就直接调用，否则使用mallocgc从堆上分配内存，deferproc 接受入参 siz，fn ，这两个参数分别标识延迟函数的参数和返回值的内存大小，延迟函数地址，保存上下文，把 caller 函数的 rsp，pc（rip） 寄存器的值保存到 _defer 结构体，defer作为一个节点挂接到链表。

```go
func deferproc(siz int32, fn *funcval) { // arguments of fn follow fn
	// 获取 caller 函数的 rsp 寄存器值
	sp := getcallersp()
	argp := uintptr(unsafe.Pointer(&fn)) + unsafe.Sizeof(fn)
	// 获取 caller 函数的 pc（rip） 寄存器值
	callerpc := getcallerpc()

	// 分配 struct _defer 内存结构
	d := newdefer(siz)
	if d._panic != nil {
		throw("deferproc: d.panic != nil after newdefer")
	}
	// _defer 结构体初始化
	d.fn = fn
	d.pc = callerpc
	d.sp = sp
	switch siz {
	case 0:
		// Do nothing.
	case sys.PtrSize:
		*(*uintptr)(deferArgs(d)) = *(*uintptr)(unsafe.Pointer(argp))
	default:
		memmove(deferArgs(d), unsafe.Pointer(argp), uintptr(siz))
	}
	// 注意，特殊的返回，不会触发延迟调用的函数
	return0()
}
```

**deferreturn**

遍历defer链表从前往后执行，执行一个就取出一个，直到链表为空。jmpdefer 负责跳转到延迟回调函数执行指令，执行结束之后，跳转回 deferreturn里执行。_defer.sp 的值可以用来判断哪些是当前 caller 函数注册的，这样就能保证只执行自己函数注册的延迟回调函数。

```go
func deferreturn(arg0 uintptr) {
	gp := getg()
	// 获取到最前的 _defer 节点
	d := gp._defer
	// 函数递归终止条件（d 链表遍历完成）
	if d == nil {
		return
	}
	// 获取 caller 函数的 rsp 寄存器值
	sp := getcallersp()
	if d.sp != sp {
		// 如果 _defer.sp 和 caller 的 sp 值不一致，那么直接返回；
		// 因为，就说明这个 _defer 结构不是在该 caller 函数注册的  
		return
	}

	switch d.siz {
	case 0:
		// Do nothing.
	case sys.PtrSize:
		*(*uintptr)(unsafe.Pointer(&arg0)) = *(*uintptr)(deferArgs(d))
	default:
		memmove(unsafe.Pointer(&arg0), deferArgs(d), uintptr(d.siz))
	}
	// 获取到延迟回调函数地址
	fn := d.fn
	d.fn = nil
	// 把当前 _defer 节点从链表中摘除
	gp._defer = d.link
	// 释放 _defer 内存（主要是堆上才会需要处理，栈上的随着函数执行完，栈收缩就回收了）
	freedefer(d)
	// 执行延迟回调函数
	jmpdefer(fn, uintptr(unsafe.Pointer(&arg0)))
}
```

**参数传入**

采用预计算参数，_defer作为头部信息，延迟回调函数和返回值在头部之后放置，参数是在defer执行的时候计算好了，而非函数执行时设置好。



### defer函数和return的执行顺序？<Badge text="了解" type="info" />

go 的一行**函数返回 return**语句对应非原子操作的多行汇编指令，包括 **返回值设置** 和 ret 指令执行。其中 ret 汇编指令的内容是两个，指令pc 寄存器恢复为 rsp 栈顶保存的地址，rsp 往上缩减，rsp+0x8。defer 的函数链调用是在设置了 result parameters 之后，但是在运行指令上下文返回到 caller 函数之前。所以过程如下：

- 设置返回值

- 执行 defered 链表

- ret 指令跳转到 caller 函数



### WaitGroup使用的注意事项？

- **Add一个负数**：如果计数器的值小于0会直接panic。

- **Add在Wait之后调用**：比如一些子协程开头调用Add结束调用Wait，这些 Wait无法阻塞子协程。正确做法是在开启子协程之前先Add特定的值。

- **未置为0就重用**：WaitGroup可以完成一次编排任务，计数值降为0后可以继续被其他任务所用，但是不要在还没使用完的时候就用于其他任务，这样由于带着计数值，很可能出问题。
- **复制waitgroup**：WaitGroup有nocopy字段，不能被复制。也意味着WaitGroup不能作为函数的参数。



