### 进程和线程之间有什么区别？<Badge text="重点" type="danger" />

- **根本区别**： 进程是操作系统进行资源分配的最小单元，线程是操作系统进行运算调度的最小单元。
- **从属关系不同**：进程中包含线程，线程属于进程。
- **开销不同**：进程的创建、销毁和切换开销远大于线程。
- **拥有资源不同**：每个进程有独立的内存和资源，一个进程中的线程会共享本进程的地址空间和资源如内存、I/O等。
- **控制和影响力不同**：子进程无法影响父进程，子线程可以影响父线程，如果主线程发生异常会影响所在进程和子线程。
- **CPU利用率不同**：进程的CPU利用率较低，上下文切换开销大，线程CPU利用率较高，上下文切换速度快。



### 进程间有哪些通信方式？<Badge text="重点" type="danger" />

- **管道**：管道是一种半双工通信方式，数据单向流动。分为匿名管道和命名管道。匿名管道只能在具有亲缘关系的进程间使用，通常是父子进程关系，命名管道相比于匿名管道提供了一个路径名来关联，以FIFO的文件形式存在于文件系统中。只要访问该路径，就可以通过FIFO通信。缺点在于需要等待接收消息方接受完毕发送消息方才能返回。
- **消息队列**：消息队列是消息链表，存放内核中并由消息队列标识符标识，发送消息方将消息放入队列，接收消息方通过队列获取消息。缺点在于如果发送数据较大，会产生拷贝开销。
- **共享内存**：将两个进程的不同的虚拟地址空间映射到同一块物理内存从而实现共享内存，避免消息拷贝开销。缺点是需要处理多线程竞争线程安全问题。
- **信号量**：本质为一个计数器，实现进程互斥与同步。
- **信号**：用于通知接收进程某个事件已经发生。
- **Socket(套接字)**：本地套接字用于本地进程间通讯，也可以创建网络套接字用于不同机器间的进程通信。



### 线程间有哪些通信方式？<Badge text="重点" type="danger" />

同一进程的线程共享地址空间，通信通过共享内存，一般来说只需要做好同步/互斥，保护共享的全局变量。

- **锁机制**：包括互斥锁，读写锁，自旋锁，条件变量。互斥锁提供排他方式防止数据结构被修改的方法，读写锁允许多个线程同时读共享变量，对写操作互斥，自旋锁循环检测是否释放锁，条件变量以原子方式阻塞进程，直到条件为真，与互斥锁一起使用。
- **信号量机制**：包括无名线程信号量和命名线程信号量。
- **信号机制**：类似进程信号处理。



### 进程有多少种状态？<Badge text="掌握" type="tip" />

**五种状态：创建态、就绪态、运行态、阻塞态、终止态**

创建态：进程正在被创建，系统初始化PCB，分配资源

就绪态：具备运行条件，还没有被调度

运行态：占用CPU，在CPU上执行

阻塞态：等待某件事不能运行

终止态：进程从系统撤销，回收资源，撤销PCB



### 进程空间从高位到低位都有些什么？<Badge text="掌握" type="tip" />

![](https://img-blog.csdnimg.cn/15841202b5214418bddfeeace9132446.png)

从高地址到低地址，一个程序由内核空间、命令行参数和环境变量、栈、文件映射区、堆、BSS段、数据段、代码段组成。

  - **内核空间**：存放内核代码和数据，权限较高。
  - **栈区**：存储局部变量、函数参数值。栈从高地址向低地址增长。是一块连续的空间。
  - **文件映射区**，位于堆和栈之间。
  - **堆区**：动态申请内存用。堆从低地址向高地址增长。
  - **BSS 段**：存放程序中未初始化的全局变量和静态变量的一块内存区域。
  - **数据段**：存放程序中已初始化的全局变量和静态变量的一块内存区域。
  - **代码段**：存放程序执行代码的一块内存区域。只读，代码段的头部还会包含一些只读的常数变量。



### Linux进程调度的算法？<Badge text="重点" type="danger" />

- **先到先服务(FCFS)调度**：从就绪队列中选择一个最先进入该队列的进程为之分配资源，使它立即执行并一直执行到完成或发生某事件而被阻塞放弃占用 CPU 时再重新调度。
- **短作业优先(SJF)的调度**：从就绪队列中选出一个估计运行时间最短的进程为之分配资源，使它立即执行并一直执行到完成或发生某事件而被阻塞放弃占用 CPU 时再重新调度。
- **时间片轮转调度**：时间片轮转调度又称 RR(Round robin)调度。每个进程被分配一个时间段，称作它的时间片，即该进程允许运行的时间。
- **多级反馈队列调度**：多级反馈队列调度算法既能使高优先级的作业得到响应又能使短作业(进程)迅速完成。，因而它是目前被公认的一种较好的进程调度算法，UNIX 操作系统采取的便是这种调度算法。
- **优先级调度**：为每个流程分配优先级，首先执行具有最高优先级的进程，依此类推。具有相同优先级的进程以FCFS方式执行。可以根据内存要求，时间要求或任何其他资源要求来确定优先级。



### 线程有多少种状态，状态之间如何转换？<Badge text="掌握" type="tip" />

**五种状态：创建态、就绪态、运行态、阻塞态、终止态**

创建态：创建一个新的线程对象

就绪态：线程创建后，被调用变为可运行，除了CPU资源其他资源都已经获得

运行态：获得CPU资源，在CPU上执行

阻塞态：线程放弃CPU使用权，暂时停止运行

终止态：线程执行完毕或因异常退出，线程结束生命周期



### 系统调用的过程是怎样的？操作系统是通过什么机制触发系统调用的？<Badge text="了解" type="info" />

用户程序调用系统 API 函数称为系统调用（System Call），系统调用的过程为：

- 硬件接收到信号立刻保存现场，并查找中断向量表，将CPU控制权交给系统调用总入口程序
- 对于系统调用总入口程序，先保存现场，将参数保存在内核的堆栈中，然后查找系统调用库，将CPU控制权交给对应的系统调用处理程序或者内核程序
- 执行系统调用处理程序
- 恢复现场，返回用户程序

![](https://img-blog.csdnimg.cn/a41dd32fe46f4ea496eec46128119dc6.png)

系统调用是一种特殊的中断，操作系统通过中断机制触发系统调用。

Linux下的系统调用是通过INT0x80实现的，Linux中每个系统调用都有相应的系统调用号作为唯一的标识，内核维护一张系统调用表，sys_call_table，表中的元素是系统调用函数的起始地址，而系统调用号就是系统调用在调用表的偏移量。

在x86上，系统调用号是通过eax寄存器传递给内核的。通知内核的机制是靠软件中断实现的。首先，用户程序为系统调用设置参数。其中一个参数是系统调用编号。参数设置完成后，程序执行“系统调用”指令。x86系统上的软中断由int产生。这个指令会导致一个异常：产生一个事件，这个事件会致使处理器切换到内核态并跳转到一个新的地址，并开始执行那里的异常处理程序。此时的异常处理程序实际上就是系统调用处理程序。




### 信号量是如何实现的？<Badge text="了解" type="info" />

一个信号量 S 是个整型变量，它除了初始化外只能通过两个标准原子操作，wait () 和 signal() 来访问：

  - 操作 wait() 最初称为 P（荷兰语proberen，测试）
  - 操作 signal() 最初称为 V（荷兰语verhogen，增加）

按如下定义信号量：

```c
typedef struct {
    int value;
    struct process *list;
} semaphore;
```

每个信号量都有一个整数 value 和一个进程链表 list。当一个进程必须等待信号量时，就被添加到进程链表。操作 signal() 从等待、进程链表上取走一个进程，并加以唤醒。

现在，信号量操作 wait() 可以定义如下：

```c
wait(semaphore *S) {
    S->value--;
    if (S->value < 0) {
        add this process to S->list;
        block();
    }
}
```

而信号量操作 signal() 可定义如下：

```c
signal(semaphore *S) {
    S->value++;
    if (S->value <= 0) {
        remove a process P from S->list;
        wakeup(P);
    }
}
```

操作 block() 挂起调用它的进程。操作 wakeup(P) 重新启动阻塞进程 P 的执行。这两个操作都是由操作系统作为基本系统调用来提供的。



### 什么情况下，进程会进行切换？<Badge text="掌握" type="tip" />

进程切换一定发生在中断/异常/系统调用处理过程中，常见的有以下情况：

- 时间片中断、IO中断后或更改优先级进程(导致被中断进程进入就绪态)
- 阻塞式系统调用、虚拟地址异常(导致被中断进程进入阻塞态)
- 终止用系统调用、不能继续执行的异常；(导致被中断进程进入终止态)



### 创建进程的流程？<Badge text="掌握" type="tip" />

分为两步，第一步通过fork()创建子进程，第二部通过exec()加载执行程序代码。bash会调用一个名为fork()系统调用，然后陷入内核，CPU执行内核态的sys_fork()函数，而sys_fork()函数中调用了do_fork()，其中do_fork()会创建一个task_struct，然后将该task_struct加入到内核维护的进程的双向链表中。然后，子进程调用exec()族函数，继续陷入内核，执行sys_execve(),调用load_elf_binary()将main的存放在磁盘的数据和指令加载到内存中。

**系统调用sys_fork()过程**

1. 用户态调用fork(),出发系统调用，CPU转向内核，执行内核态的代码；

2. 通过查询系统调用表，找到内核的sys_fork()函数，进行调用；

3. sys_fork()实际上调用的是do_fork()，该函数做的事情较多：

- 从slab分配器中分配一个task_struct实例
- 分配创建内核栈，并拷贝父进程内核栈，设置thread_info,特别的，父进程在陷入内核前，保存了的上下文也会被子进程进行拷贝，也就是说，如果系统调用结束，父进程和子进程返回用户态时，返回的位置，以及执行的指令是一样
- opy_creds,拷贝父进程的权限
- 设置进程运行统计信息
- sched_fork,设置进程调度相关信息，如将状态设置为TASK_NEW
- 复制父进程打开文件的信息
- 复制父进程文件目录信息
- 复制父进程信号相关信息
- copy_mm 复制父进程内存管理信息
- 配置PID
- 建立进程间的亲缘关系
- 将上述task_struct进入到进程的双向链表中

4. 唤醒新进程，将进程状态设置为TASK_RUNNING,将task_struct放入到调度队列，等待CPU的调度执行；

5. 系统调用结束，将返回用户空间。

**系统调用sys_execevp()过程**

1. 用户态调用库函数execevp()方法

2. 发生系统调用，陷入内核，查找系统调用表，调用sys_execevp()方法

3. sys_execevp()中会调用load_elf_binary()方法，该过程主要分为以下几个过程:
- 设置mmap_base的值
- 设置函数栈的 vm_area_struct
- 将ELF文件中的代码部分映射到内存中
- 设置堆的brk以及堆 vm_area_struct
- 将依赖的so映射到内存中的内存映射区域
- 设置mm_struct其他属性，如end_code,start_code,start_data,end_data等



### 共享内存是如何实现的？<Badge text="了解" type="info" />

同一块物理内存被映射到进程A、B各自的进程地址空间。进程A可以即时看到进程B对共享内存中数据的更新，反之亦然。由于多个进程共享同一块内存区域，必然需要某种同步机制，互斥锁和信号量都可以。原理就是同一块物理内存被映射到进程A，B各自的进程地址空间。



### 创建线程有多少种方式？<Badge text="了解" type="info" />

**C++**：

**函数指针**

   ```cpp
    void A() {
        cout << "this is A thread" << endl;
    }
 
    int main()
    {
        thread t(A);
        t.join();
        cout << "this is main thread" << endl;
        return 0;
    }
   ```

**类和结构体**：不带参数,需要对()进行运算符重载，使其变为一个仿函数，从而再去通过这个入口去创建线程

   ```cpp
   class A {
    public:
        void operator()() const{
            cout << "this is A thread" << endl;
        }
    };
 
    int main()
    {
        thread t1{A{}};
        t1.join();
    
        A a;
        thread t2(a);
        t2.join();
    
        thread t3 = thread(A());
        t3.join();
    
        cout << "this is main thread" << endl;
        return 0;
    }
   ```

**普通函数(带参数)**

   ```cpp
class A {
 public:
     A(int a, int b) : m_iA(a), m_iB(b) {}
     void work(int a, int b){
         cout << a + b << endl;
         cout << m_iA + m_iB << endl;
         cout << "this is A thread" << endl;
     }
 private:
     int m_iA;
     int m_iB;
 };
 
 int main()
 {
     // 输出均为5 3
     A a(1, 2);
     thread t(&A::work, &a, 2, 3);
     t.join();
     cout << "this is main thread" << endl;
     return 0;
 }
   ```

**lambda表达式(带参数)**
       

   ```cpp
 int main()
 {
     int a = 1;
     thread t = thread([a](int b,int c){
         cout << a + b + c << endl;              // 输出为6
         cout << "This is f thread" << endl;
     }, 2, 3);
     t.join();
     cout << "this is main thread" << endl;
     return 0;
 }
   ```

**Java**：

  - 继承 Thread 类;
  - 实现 Runnable 接口;
  - 实现 Callable 接口;
  - 使用 Executors 工具类创建线程池


### 进程通信中的管道实现原理是什么？<Badge text="了解" type="info" />

管道是由内核管理的一个缓冲区。管道的一端连接一个进程的输出。这个进程会向管道中放入信息。管道的另一端连接一个进程的输入，这个进程取出被放入管道的信息。一个缓冲区被设计成为环形的数据结构，以便管道可以被循环利用。当管道中没有信息的话，从管道中读取的进程会等待，直到另一端的进程放入信息。当管道被放满信息的时候，尝试放入信息的进程会等待，直到另一端的进程取出信息。当两个进程都终结的时候，管道也自动消失。



### 多线程和多进程的区别是什么？<Badge text="掌握" type="tip" />

- **数据共享**：多进程资源与内存相互独立，共享复杂，同步简单，多线程共享同一个进程的数据，共享简单，同步复杂。
- **占用内存**：多进程占用内存多，切换复杂，CPU利用率低，多线程占用内存少，切换简单，CPU利用率高。
- **开销**：多进程创建销毁和切换复杂，多线程创建销毁和切换简单。
- **互相之间影响**：进程间不会相互影响，线程会互相影响，一个线程挂掉将导致整个进程结束



### 两个线程交替打印一个共享变量？<Badge text="掌握" type="tip" />

以两个线程交替打印0-100奇偶数为例

**方法一**：令两个线程分别只负责打印奇数偶数，令两个线程争抢一个锁，缺点为如果一个线程一直抢锁，另一个线程拿不到锁就会导致空转

```java
public class Test {

    // 全局变量 count
    private int count = 0;

    // 锁
    private final Object lock = new Object();

    public static void main(String[] args) {
        Test test = new Test();
        test.turning();
    }

    public void turning() {
        Thread even = new Thread(() -> {
            while (count < 100) {
                // 获取锁
                synchronized (lock) {
                    // 只处理偶数
                    if ((count & 1) == 0) {
                        System.out.println(Thread.currentThread().getName() + ": " + count++);
                    }
                }
            }
        }, "偶数");
        Thread odd = new Thread(() -> {
            while (count < 100) {
                // 获取锁
                synchronized (lock) {
                    // 只处理奇数
                    if ((count & 1) == 1) {
                        System.out.println(Thread.currentThread().getName() + ": " + count++);
                    }
                }
            }
        }, "奇数");
        even.start();
        odd.start();
    }
}

```

**方法二**：线程1打印之后唤醒其他线程，然后让出锁，自己进入休眠状态，线程2同理

```java
public class Test {

    // 全局变量 count
    private int count = 0;

    // 锁
    private final Object lock = new Object();

    public static void main(String[] args) throws InterruptedException {
        Test test = new Test();
        test.turning();
    }

    public void turning() throws InterruptedException {
        new Thread(new TurningRunner(), "偶数").start();
        // 确保偶数线程线先获取到锁
        Thread.sleep(1);
        new Thread(new TurningRunner(), "奇数").start();
    }

    class TurningRunner implements Runnable {
        @Override
        public void run() {
            while (count <= 100) {
                // 获取锁
                synchronized (lock) {
                    // 拿到锁就打印
                    System.out.println(Thread.currentThread().getName() + ": " + count++);
                    // 唤醒其他线程
                    lock.notifyAll();
                    try {
                        if (count <= 100) {
                            // 如果任务还没有结束，则让出当前的锁并休眠
                            lock.wait();
                        }
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            }
        }
    }
}
```

**方法三**：利用信号量 Semaphore 实现

```java
public class PrintNum {
    private int n;
    private Semaphore odd = new Semaphore(1);
    private Semaphore even = new Semaphore(0);

    public PrintNum(int n) {
        this.n = n;
    }

    public void printOdd() {
        for (int i=1; i<=n; i+=2) {
            try {
                odd.acquire();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println("奇数" + i);
            even.release();
        }
    }

    public void printEven() {
        for(int i=2; i<=n; i+=2) {
            try {
                even.acquire();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println("偶数" + i);
            odd.release();
        }
    }

    public static void main(String[] args){
        PrintNum printNum = new PrintNum(100);
        ExecutorService executorService = Executors.newFixedThreadPool(2);
        executorService.submit(() -> {
            printNum.printOdd();
        });
        executorService.submit(() -> {
            printNum.printEven();
        });
        executorService.shutdown();
    }
}
```





### Linux下如何查到端口被哪个进程占用？<Badge text="了解" type="info" />


- lsof -i:端口号
- netstat -tunlp|grep 端口号



### 为什么进程切换慢，线程切换快？<Badge text="了解" type="info" />

因为每个进程都拥有一个自己的虚拟地址空间，并且独立于其他进程的地址空间。进程切换会涉及到虚拟地址空间的切换，而线程共享地址资源，因此进程切换比线程要慢。

由于进程切换会涉及到虚拟地址空间的切换，这就导致内存中的页表也需要进行切换，页表切换后导致 TLB 失效。这样，TLB 在一段时间内肯定是无法被命中的，操作系统就必须去访问内存，那么虚拟地址转换为物理地址就会变慢，表现出来的就是程序运行会变慢。

