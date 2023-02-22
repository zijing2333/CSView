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

更新中......



### Linux进程调度的算法？<Badge text="重点" type="danger" />

- **先到先服务(FCFS)调度**:从就绪队列中选择一个最先进入该队列的进程为之分配资源，使它立即执行并一直执行到完成或发生某事件而被阻塞放弃占用 CPU 时再重新调度。
- **短作业优先(SJF)的调度**:从就绪队列中选出一个估计运行时间最短的进程为之分配资源，使它立即执行并一直执行到完成或发生某事件而被阻塞放弃占用 CPU 时再重新调度。
- **时间片轮转调度**:时间片轮转调度又称 RR(Round robin)调度。每个进程被分配一个时间段，称作它的时间片，即该进程允许运行的时间。
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

更新中......



### 信号量是如何实现的？<Badge text="了解" type="info" />

更新中......



### 什么情况下，进程会进行切换？<Badge text="掌握" type="tip" />

进程切换一定发生在中断/异常/系统调用处理过程中，常见的有以下情况：

- 时间片中断、IO中断后或更改优先级进程；(导致被中断进程进入就绪态)；
- 阻塞式系统调用、虚拟地址异常；(导致被中断进程进入阻塞态)
- 终止用系统调用、不能继续执行的异常；(导致被中断进程进入终止态)



### 创建进程的流程？<Badge text="掌握" type="tip" />

更新中......



### 共享内存是如何实现的？<Badge text="了解" type="info" />

更新中......



### 创建线程有多少种方式？<Badge text="了解" type="info" />

更新中......



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

两个方法

1. lsof -i:端口号
2. netstat -tunlp|grep 端口号



### 为什么进程切换慢，线程切换快？<Badge text="了解" type="info" />

更新中......

