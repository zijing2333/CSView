import{_ as t,X as l,Y as o,Z as n,$ as a,a0 as e,a2 as i,H as c}from"./framework-edbf9e3c.js";const p={},u={id:"gmp模型",tabindex:"-1"},r=n("a",{class:"header-anchor",href:"#gmp模型","aria-hidden":"true"},"#",-1),d=i(`<p>G(goroutine)</p><p>go 语言中的协程 goroutine 的缩写，相当于操作系统中的进程控制块。其中存着 goroutine 的运行时栈信息，CPU 的一些寄存器的值以及执行的函数指令等。sched字段保存了 goroutine 的上下文。goroutine 切换的时候不同于线程有 OS 来负责这部分数据，而是由一个 gobuf 结构体来保存。</p><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code><span class="token keyword">type</span> g <span class="token keyword">struct</span> <span class="token punctuation">{</span>
  stack       stack   		<span class="token comment">// 描述真实的栈内存，包括上下界</span>

  m              <span class="token operator">*</span>m     	<span class="token comment">// 当前的 m</span>
  sched          gobuf   	<span class="token comment">// goroutine 切换时，用于保存 g 的上下文      </span>
  param          unsafe<span class="token punctuation">.</span>Pointer <span class="token comment">// 用于传递参数，睡眠时其他 goroutine 可以设置 param，唤醒时该goroutine可以获取</span>
  atomicstatus   <span class="token builtin">uint32</span>
  stackLock      <span class="token builtin">uint32</span> 
  goid           <span class="token builtin">int64</span>  	<span class="token comment">// goroutine 的 ID</span>
  waitsince      <span class="token builtin">int64</span> 		<span class="token comment">// g 被阻塞的大体时间</span>
  lockedm        <span class="token operator">*</span>m     	<span class="token comment">// G 被锁定只在这个 m 上运行</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>gobuf 保存了当前的栈指针，计数器，还有 g 自身，这里记录自身 g 的指针的目的是为了<strong>能快速的访问到 goroutine 中的信息</strong>。gobuf 的结构如下：</p><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code><span class="token keyword">type</span> gobuf <span class="token keyword">struct</span> <span class="token punctuation">{</span>
    sp   <span class="token builtin">uintptr</span>
    pc   <span class="token builtin">uintptr</span>
    g    guintptr
    ctxt unsafe<span class="token punctuation">.</span>Pointer
    ret  sys<span class="token punctuation">.</span>Uintreg
    lr   <span class="token builtin">uintptr</span>
    bp   <span class="token builtin">uintptr</span> <span class="token comment">// for goEXPERIMENT=framepointer</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>M(Machine)</p><p>M代表一个操作系统的主线程，对内核级线程的封装，数量对应真实的 CPU 数。一个 M 直接关联一个 os 内核线程，用于执行 G。M 会优先从关联的 P 的本地队列中直接获取待执行的 G。M 保存了 M 自身使用的栈信息、当前正在 M上执行的 G 信息、与之绑定的 P 信息。</p><p>结构体 M 中，curg代表结构体M当前绑定的结构体 G ；g0 是带有调度栈的 goroutine，普通的 goroutine 的栈是在<strong>堆上</strong>分配的可增长的栈，但是 g0 的栈是 <strong>M 对应的线程</strong>的栈。与调度相关的代码，会先切换到该 goroutine 的栈中再执行。</p><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code><span class="token keyword">type</span> m <span class="token keyword">struct</span> <span class="token punctuation">{</span>
    g0      <span class="token operator">*</span>g     				<span class="token comment">// 带有调度栈的goroutine</span>

    gsignal       <span class="token operator">*</span>g         	<span class="token comment">// 处理信号的goroutine</span>
    tls           <span class="token punctuation">[</span><span class="token number">6</span><span class="token punctuation">]</span><span class="token builtin">uintptr</span> 	<span class="token comment">// thread-local storage</span>
    mstartfn      <span class="token keyword">func</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    curg          <span class="token operator">*</span>g       		<span class="token comment">// 当前运行的goroutine</span>
    caughtsig     guintptr 
    p             puintptr 		<span class="token comment">// 关联p和执行的go代码</span>
    nextp         puintptr
    id            <span class="token builtin">int32</span>
    mallocing     <span class="token builtin">int32</span> 		<span class="token comment">// 状态</span>

    spinning      <span class="token builtin">bool</span> 			<span class="token comment">// m是否out of work</span>
    blocked       <span class="token builtin">bool</span> 			<span class="token comment">// m是否被阻塞</span>
    inwb          <span class="token builtin">bool</span> 			<span class="token comment">// m是否在执行写屏蔽</span>

    printlock     <span class="token builtin">int8</span>
    incgo         <span class="token builtin">bool</span>
    fastrand      <span class="token builtin">uint32</span>
    ncgocall      <span class="token builtin">uint64</span>      	<span class="token comment">// cgo调用的总数</span>
    ncgo          <span class="token builtin">int32</span>       	<span class="token comment">// 当前cgo调用的数目</span>
    park          note
    alllink       <span class="token operator">*</span>m 			<span class="token comment">// 用于链接allm</span>
    schedlink     muintptr
    mcache        <span class="token operator">*</span>mcache 		<span class="token comment">// 当前m的内存缓存</span>
    lockedg       <span class="token operator">*</span>g 			<span class="token comment">// 锁定g在当前m上执行，而不会切换到其他m</span>
    createstack   <span class="token punctuation">[</span><span class="token number">32</span><span class="token punctuation">]</span><span class="token builtin">uintptr</span> 	<span class="token comment">// thread创建的栈</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>P(Processor)</p><p>Processor 代表了 M 所需的上下文环境，代表 M 运行 G 所需要的资源。是处理用户级代码逻辑的处理器，可以将其看作一个局部调度器使 go 代码在一个线程上跑。当 P 有任务时，就需要创建或者唤醒一个系统线程来执行它队列里的任务，所以 P 和 M 是相互绑定的。P 可以根据实际情况开启协程去工作，它包含了运行 goroutine 的资源，如果线程想运行 goroutine，必须先获取 P，P 中还包含了可运行的 G 队列。</p><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code><span class="token keyword">type</span> p <span class="token keyword">struct</span> <span class="token punctuation">{</span>
    lock mutex

    id          <span class="token builtin">int32</span>
    status      <span class="token builtin">uint32</span> 		<span class="token comment">// 状态，可以为pidle/prunning/...</span>
    link        puintptr
    schedtick   <span class="token builtin">uint32</span>     <span class="token comment">// 每调度一次加1</span>
    syscalltick <span class="token builtin">uint32</span>     <span class="token comment">// 每一次系统调用加1</span>
    sysmontick  sysmontick 
    m           muintptr   <span class="token comment">// 回链到关联的m</span>
    mcache      <span class="token operator">*</span>mcache
    racectx     <span class="token builtin">uintptr</span>

    goidcache    <span class="token builtin">uint64</span> 	<span class="token comment">// goroutine的ID的缓存</span>
    goidcacheend <span class="token builtin">uint64</span>

    <span class="token comment">// 可运行的goroutine的队列</span>
    runqhead <span class="token builtin">uint32</span>
    runqtail <span class="token builtin">uint32</span>
    runq     <span class="token punctuation">[</span><span class="token number">256</span><span class="token punctuation">]</span>guintptr

    runnext guintptr 		<span class="token comment">// 下一个运行的g</span>

    sudogcache <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token operator">*</span>sudog
    sudogbuf   <span class="token punctuation">[</span><span class="token number">128</span><span class="token punctuation">]</span><span class="token operator">*</span>sudog

    palloc persistentAlloc <span class="token comment">// per-P to avoid mutex</span>

    pad <span class="token punctuation">[</span>sys<span class="token punctuation">.</span>CacheLineSize<span class="token punctuation">]</span><span class="token builtin">byte</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,12),m={id:"gmp的调度流程",tabindex:"-1"},v=n("a",{class:"header-anchor",href:"#gmp的调度流程","aria-hidden":"true"},"#",-1),g=i('<figure><img src="https://pic.imgdb.cn/item/63e223e84757feff33526e36.jpg" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><ul><li>每个 P 有个局部队列，局部队列保存待执行的goroutine（流程 2），当 M 绑定的 P 的的局部队列已经满了之后就会把 goroutine 放到全局队列（流 程 2-1）</li><li>每个 P 和一个 M 绑定，M 是真正的执行 P 中 goroutine 的实体（流程 3）， M 从绑定的 P 中的局部队列获取 G 来执行</li><li>当 M 绑定的 P 的局部队列为空时，M 会从全局队列获取到本地队列来执行 G （流程 3.1），当从全局队列中没有获取到可执行的 G 时候，M 会从其他 P 的局部队列中偷取 G 来执行（流程 3.2），这种从其他 P 偷的方式称为 work stealing</li><li>当 G 因系统调用（syscall）阻塞时会阻塞 M，此时 P 会和 M 解绑即 hand off，并寻找新的 idle 的 M，若没有 idle 的 M 就会新建一个 M（流程 5.1）</li><li>当 G 因 channel 或者 network I/O 阻塞时，不会阻塞 M，M 会寻找其他 runnable 的 G；当阻塞的 G 恢复后会重新进入 runnable 进入 P 队列等待执 行（流程 5.3）</li></ul><h3 id="p和m的个数" tabindex="-1"><a class="header-anchor" href="#p和m的个数" aria-hidden="true">#</a> P和M的个数？</h3><ul><li>P: 由启动时环境变量 <code>$GOMAXPROCS</code> 或者是由 <code>runtime</code>的方法<code>GOMAXPROCS()</code>决定。这意味着在程序执行的任意时刻都只有<code>$GOMAXPROCS</code>个goroutine在同时运行。</li><li>M: <ul><li>Go 语言本身的限制：Go 程序启动时，会设置 M 的最大数量，默认 10000，但是内核很难支持这么多的线程数，所以这个限制可以忽略。</li><li>runtime/debug 中的 SetMaxThreads 函数，设置 M 的最大数量。</li><li>一个 M 阻塞了，会创建新的 M。</li></ul></li></ul><p>M 与 P 的数量没有绝对关系，一个 M 阻塞，P 就会去创建或者切换另一个 M，所以，即使 P 的默认数量是 1，也有可能会创建很多个 M 出来。</p><h3 id="p和m何时会被创建" tabindex="-1"><a class="header-anchor" href="#p和m何时会被创建" aria-hidden="true">#</a> <strong>P和M何时会被创建</strong>？</h3><p>P: 在确定了 P 的最大数量 n 后，运行时系统会根据这个数量创建 n 个 P。</p><p>M: 没有足够的 M 来关联 P 并运行其中的可运行的 G 时创建。比如所有的 M 此时都阻塞住了，而 P 中还有很多就绪任务，就会去寻找空闲的 M，而没有空闲的，就会去创建新的 M。</p>',8),b={id:"goroutine创建流程",tabindex:"-1"},k=n("a",{class:"header-anchor",href:"#goroutine创建流程","aria-hidden":"true"},"#",-1),h=n("p",null,"在调用go func()的时候，会调用runtime.newproc来创建一个goroutine，这个goroutine会新建一个自己的栈空间，同时在G的sched中维护栈地址与程序计数器这些信息（备注：这些数据在goroutine被调度的时候会被用到。准确的说该goroutine在放弃cpu之后，下一次在重新获取cpu的时候，这些信息会被重新加载到cpu的寄存器中。）",-1),M=n("p",null,"创建好的这个goroutine会被放到它所对应的内核线程M所使用的上下文P中的run_queue中，等待调度器来决定何时取出该goroutine并执行，通常调度是按时间顺序被调度的，这个队列是一个先进先出的队列。",-1),P={id:"goroutine什么时候会被挂起",tabindex:"-1"},G=n("a",{class:"header-anchor",href:"#goroutine什么时候会被挂起","aria-hidden":"true"},"#",-1),_=i("<ul><li>waitReasonChanReceiveNilChan：对未初始化的 channel 进行读操作</li><li>waitReasonChanSendNilChan：对未初始化的 channel 进行写操作</li><li>在 main goroutine 发生 panic 时，会触发</li><li>在调用关键字 select 时会触发</li><li>在调用关键字 select 时，若一个 case 都没有，会直接触发</li><li>在 channel 进行读操作，会触发</li><li>在 channel 进行写操作，会触发</li><li>sleep 行为，会触发</li><li>IO 阻塞等待时，例如：网络请求等</li><li>在垃圾回收时，主要场景是 GC 标记终止和标记阶段时触发</li><li>GC 清扫阶段中的结束行为，会触发</li><li>信号量处理结束时，会触发</li></ul>",1),f={id:"同时启动了一万个goroutine-会如何调度",tabindex:"-1"},x=n("a",{class:"header-anchor",href:"#同时启动了一万个goroutine-会如何调度","aria-hidden":"true"},"#",-1),y=i('<p>一万个G会按照P的设定个数，尽量平均地分配到每个P的本地队列中。如果所有本地队列都满了，那么剩余的G则会分配到GMP的全局队列上。接下来便开始执行GMP模型的调度策略：</p><ul><li><strong>本地队列轮转</strong>：每个P维护着一个包含G的队列，不考虑G进入系统调用或IO操作的情况下，P周期性的将G调度到M中执行，执行一小段时间，将上下文保存下来，然后将G放到队列尾部，然后从队首中重新取出一个G进行调度。</li><li><strong>系统调用</strong>：P的个数默认等于CPU核数，每个M必须持有一个P才可以执行G，一般情况下M的个数会略大于P的个数，这多出来的M将会在G产生系统调用时发挥作用。当该G即将进入系统调用时，对应的M由于陷入系统调用而进被阻塞，将释放P，进而某个空闲的M1获取P，继续执行P队列中剩下的G。</li><li><strong>工作量窃取</strong>：多个P中维护的G队列有可能是不均衡的，当某个P已经将G全部执行完，然后去查询全局队列，全局队列中也没有新的G，而另一个M中队列中还有3很多G待运行。此时，空闲的P会将其他P中的G偷取一部分过来，一般每次偷取一半。</li></ul><h3 id="goroutine内存泄漏和处理" tabindex="-1"><a class="header-anchor" href="#goroutine内存泄漏和处理" aria-hidden="true">#</a> goroutine内存泄漏和处理？</h3><p><strong>原因</strong>：</p><p>Goroutine 是轻量级线程，需要维护执行用户代码的上下文信息。在运行过程中也需要消耗一定的内存来保存这类信息，而这些内存在目前版本的 Go 中是不会被释放的。因此，如果一个程序持续不断地产生新的 goroutine、且不结束已经创建的 goroutine 并复用这部分内存，就会造成内存泄漏的现象。造成泄露的大多数原因有以下三种：</p><ul><li>Goroutine 内正在进行 channel/mutex 等读写操作，但由于逻辑问题，某些情况下会被一直阻塞。</li><li>Goroutine 内的业务逻辑进入死循环，资源一直无法释放。</li><li>Goroutine 内的业务逻辑进入长时间等待，有不断新增的 Goroutine 进入等待。</li></ul><p><strong>解决方法</strong>：</p><ul><li><p>使用channel</p><ul><li><p>1、使用channel接收业务完成的通知</p></li><li><p>2、业务执行阻塞超过设定的超时时间，就会触发超时退出</p></li></ul></li><li><p>使用pprof排查</p><ul><li>pprof是由 Go 官方提供的可用于收集程序运行时报告的工具，其中包含 CPU、内存等信息。当然，也可以获取运行时 goroutine 堆栈信息。</li></ul></li></ul>',8);function w(C,O){const s=c("Badge");return l(),o("div",null,[n("h3",u,[r,a(" GMP模型？"),e(s,{text:"重要",type:"danger"})]),d,n("h3",m,[v,a(" GMP的调度流程？"),e(s,{text:"重要",type:"danger"})]),g,n("h3",b,[k,a(" goroutine创建流程？"),e(s,{text:"重要",type:"danger"})]),h,M,n("h3",P,[G,a(" goroutine什么时候会被挂起？"),e(s,{text:"重要",type:"danger"})]),_,n("h3",f,[x,a(" 同时启动了一万个goroutine，会如何调度？"),e(s,{text:"掌握",type:"tip"})]),y])}const N=t(p,[["render",w],["__file","gmp.html.vue"]]);export{N as default};
