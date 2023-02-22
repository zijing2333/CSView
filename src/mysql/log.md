### MySQL三种日志？<Badge text="重要" type="danger" />

#### undo log(回滚日志)

undo log是Innodb存储引擎层生成的日志，实现了事务中的**原子性**，主要**用于事务回滚和MVCC**。

在事务没提交之前，Innodb会先记录更新前的数据到undo log中，回滚时利用 undo log 来进行回滚。每当进行一条记录进行操作(修改、删除、新增)时，要把回滚时需要的信息都记录到 undo log 里：原理是执行一条相反的操作。undo log 有两个参数：roll_pointer 指针和一个 trx_id 事务id，通过 trx_id 可以知道该记录是被哪个事务修改的；通过 roll_pointer 指针可以将这些 undo log 串成一个链表，形成版本链。

innodb存储引擎也通过ReadView + undo log实现 MVCC(多版本并发控制)。

::: tip undo log的作用是什么?

**实现事务回滚，保障事务的原子性**：如果出现了错误或者用户执行了 ROLLBACK 语句，可以利用 undo log 中的历史数据将数据恢复到事务开始之前的状态。

**实现 MVCC关键因素之一**：MVCC 是通过 ReadView + undo log 实现的。undo log 为每条记录保存多份历史数据，在执行快照读的时候，会根据事务的 Read View 里的信息，顺着 undo log 的版本链找到满足其可见性的记录。

:::

#### redo log(重做日志)

redo log是物理日志，记录了某个数据页做了什么修改，每当执行一个事务就会产生一条或者多条物理日志。在事务提交时，先将redo log持久化到磁盘即可，不需要等到将缓存在Buffer Pool里的脏页数据持久化到磁盘。当系统崩溃时，虽然脏页数据没有持久化但是redo log已经持久化，可以根据 redo log 的内容，将所有数据恢复到最新的状态。

redo log实现了事务中的持久性，主要用于掉电等故障恢复。发生更新的时候，InnoDB会先更新内存，同时标记为脏页，然后将本次对这个页的修改以redo log的形式记录下来。InnoDB引擎会在适当的时候，由后台线程将缓存在Buffer Pool的脏页刷新到磁盘里，实现**WAL技术**。



::: tip 什么是WAL技术？

WAL技术指的是，MySQL的写操作并不是立刻写到磁盘上，而是先写日志，然后在合适的时间再写到磁盘上。

:::



::: tip 什么是crash-safe？

redo log+WAL 技术，InnoDB 就可以保证即使数据库发生异常重启，之前已提交的记录都不会丢失。

:::

#### binlog(归档日志）

Server 层生成的日志，主要**用于数据备份和主从复制**。

在完成一条更新操作后，Server 层会生成一条 binlog，等之后事务提交的时候，会将该事物执行过程中产生的所有 binlog 统一写入 binlog 文件。binlog 文件是记录了所有数据库表结构变更和表数据修改的日志，不会记录查询类的操作。



### redo log与bin log的区别？<Badge text="掌握" type="tip" />

- **适用对象不同**：binlog 是 MySQL 的 Server 层实现的，所有存储引擎都可以使用；redo log 是 Innodb 存储引擎实现的日志。
- **文件格式不同**：redo log 是物理日志，记录的是在某个数据页做了什么修改，比如对 XXX 表空间中的 YYY 数据页 ZZZ 偏移量的地方做了AAA 更新。
- **写入方式不同**：binlog 是追加写，写满一个文件，就创建一个新的文件继续写，不会覆盖以前的日志，保存的是全量的日志。redo log是循环写，日志空间大小是固定，全部写满就从头开始，保存未被刷入磁盘的脏页日志。
- **用途不同**：binlog 用于备份恢复、主从复制；redo log 用于掉电等故障恢复。



### redo log和undo log区别？<Badge text="掌握" type="tip" />

redo log 记录了此次事务**完成后**的数据状态，undo log 记录了此次事务**开始前**的数据状态。



### undo log是如何实现MVCC的？<Badge text="了解" type="info" />

对于读提交和可重复读隔离级别，快照读是通过 Read View + undo log 来实现的，区别在于创建 Read View 的时机不同：

- 读提交在每个 select 都会生成一个新的 Read View，事务期间的多次读取同一条数据，前后两次读的数据可能会出现不一致，因为可能这期间另外一个事务修改了该记录，并提交了事务。
- 可重复读隔离级别是启动事务时生成一个 Read View，然后整个事务期间都在用这个 Read View，这样就保证了在事务期间读到的数据都是事务启动前的记录。

通过**事务的 Read View 里的字段和记录中的两个隐藏列(trx_id 和 roll_pointer)**的比对，如果不满足可见行，就会顺着 undo log 版本链里找到满足其可见性的记录，从而控制并发事务访问同一个记录时的行为。



### 为什么有了binlog，还要有redo log？<Badge text="了解" type="info" />

早期版本 MySQL 里没有 InnoDB 引擎，MySQL 自带的 MyISAM引擎没有 crash-safe 的能力，binlog 日志只能用于归档。InnoDB 是另一个公司以插件形式引入 MySQL 的，所以 InnoDB 使用 redo log 来实现 crash-safe 能力。





### 被修改 Undo 页面，需要记录对应 redo log 吗？<Badge text="了解" type="info" />

需要。开启事务后，InnoDB 更新记录前，首先要记录相应的 undo log，如果是更新操作，也就是要生成一条 undo log，undo log 会写入 Buffer Pool 中的 Undo 页面。**在内存修改该 Undo 页面后，需要记录对应的 redo log**。



### binlog的三种格式？<Badge text="掌握" type="tip" />

STATEMENT(默认格式)、ROW、 MIXED：

- **STATEMENT**：每一条修改数据的 SQL 都会被记录到 binlog 中，主从复制中 slave 端再根据 SQL 语句重现。

::: warning 缺陷

 STATEMENT 有动态函数的问题，比如用了 uuid 或者 now 这些函数，在主库上执行的结果并不是你在从库执行的结果，这种随时在变的函数会导致复制的数据不一致

:::

- **ROW**：记录行数据最终被修改成什么样了，不会出现 STATEMENT 下动态函数的问题。

::: warning 缺陷

但 ROW 的缺点是每行数据的变化结果都会被记录，比如执行批量 update 语句，更新多少行数据就会产生多少条记录，使 binlog 文件过大，而在 STATEMENT 格式下只会记录一个 update 语句。

:::

- **MIXED**：包含了 STATEMENT 和 ROW 模式，它会根据不同的情况自动使用 ROW 模式和 STATEMENT 模式。





### redo log容灾恢复过程？<Badge text="了解" type="info" />

如果 redo log 是完整(commit 状态)的，直接用 redo log 恢复；

如果 redo log 是预提交 prepare 但不是 commit 状态，此时要去判断 binlog 是否完整，如果完整那就提交 redo log，再用 redo log 恢复，不完整就回滚事务。



### redo log是直接写入磁盘的吗？<Badge text="了解" type="info" />

不是。直接写入磁盘会产生大量的 I/O 操作，redo log会写入redo log buffer，每当产生一条 redo log 时，会先写入到 redo log buffer，后续在持久化到磁盘。



### redo log比直接落盘的优点？<Badge text="了解" type="info" />

redo log 的写方式使用了追加，日志操作是**顺序写**，磁盘操作是**随机写**，MySQL 的写操作从磁盘的**随机写**变成了**顺序写**，提升语句的执行性能。

- **实现事务的持久性，让 MySQL 有 crash-safe 的能力**，能够保证 MySQL 在任何时间段突然崩溃，重启后之前已提交的记录都不会丢失；
- **将写操作从随机写变成了顺序写**，提升 MySQL 写入磁盘的性能。



### redo log buffer什么时候刷盘？<Badge text="了解" type="info" />

- MySQL 正常关闭时，会触发落盘
- 当 redo log buffer 中记录的写入量大于 redo log buffer 内存空间的一半时，会触发落盘
- InnoDB 的后台线程每隔 1 秒，将 redo log buffer 持久化到磁盘
- 每次事务提交时都将缓存在 redo log buffer 里的 redo log 直接持久化到磁盘



### redo log文件文件格式和写入过程？<Badge text="掌握" type="tip" />

InnoDB有 1 个redo log组，由有 2 个 redo log 文件组成：logfile0 和 logfile1。

![重做日志文件组](https://cdn.xiaolincoding.com/gh/xiaolincoder/mysql/how_update/%E9%87%8D%E5%81%9A%E6%97%A5%E5%BF%97%E6%96%87%E4%BB%B6%E7%BB%84.drawio.png)

redo log组中每个 redo log的大小是固定且相同的，redo log组是以**循环写**的方式工作的，从头开始写，写到末尾就又回到开头，相当于一个环形。

先写 logfile0 文件，当 logfile0 文件被写满的时候，会切换至 logfile1 文件，当 logfile1 文件也被写满时，会切换回 ib_logfile0 文件。随着系统运行，Buffer Pool 的脏页刷新到了磁盘中， redo log 对应的记录没用了，会腾出空间记录新的更新操作。redo log 是循环写的方式相当于一个环形，用 write pos 表示 redo log 当前记录写到的位置，用 checkpoint 表示当前要擦除的位置。

write pos 追上了 checkpoint，说明 redo log 文件满了， MySQL 会被阻塞，会停下来将 Buffer Pool 中的脏页刷新到磁盘中，然后标记 redo log 哪些记录可以被擦除，接着对旧的 redo log 记录进行擦除，等擦除完旧记录腾出了空间，checkpoint 就会往后移动，然后 MySQL 恢复正常运行，继续执行新的更新操作。



### binlog什么时候刷盘？<Badge text="了解" type="info" />

事务执行过程中，先把日志写到 binlog cache(Server 层的 cache)，事务提交的时候，再把 binlog cache 写到 binlog 文件中。

::: tip 提示

binlog 是不能被拆开的，无论这个事务有多大，也要保证一次性写入。这是因为有一个线程只能同时有一个事务在执行的设定，所以每当执行一个 begin/start transaction 的时候，就会默认提交上一个事务，这样如果一个事务的 binlog 被拆开的时候，在备库执行就会被当做多个事务分段自行，这样破坏了原子性，是有问题的。

:::



### binlog什么时候刷盘频率？<Badge text="了解" type="info" />

MySQL提供一个 sync_binlog 参数来控制数据库的 binlog 刷到磁盘上的频率：

- sync_binlog = 0 的时候，表示每次提交事务都只 write，不 fsync，后续交由操作系统决定何时将数据持久化到磁盘；
- sync_binlog = 1 的时候，表示每次提交事务都会 write，然后马上执行 fsync；
- sync_binlog = N(N>1) 的时候，表示每次提交事务都 write，但累积 N 个事务后才 fsync。

系统默认的设置是 sync_binlog = 0，也就是不做任何强制性的磁盘刷新指令，这时候的性能是最好的，但是风险也是最大的，因为一旦主机发生异常重启，还没持久化到磁盘的数据就会丢失。

当 sync_binlog 设置为 1 的时候，是最安全但是性能损耗最大的设置。因为当设置为 1 的时候，即使主机发生异常重启，最多丢失一个事务的 binlog，而已经持久化到磁盘的数据就不会有影响，不过就是对写入性能影响太大。

**如果能容少量事务的 binlog 日志丢失的风险，为了提高写入的性能，一般会 sync_binlog 设置为 100~1000 中的某个数值**。



### 主从复制是怎么实现？<Badge text="了解" type="info" />

binlog记录 MySQL 上的所有变化并以二进制形式保存在磁盘上。复制的过程就是将 binlog 中的数据从主库传输到从库上。

- 主库在收到提交事务的请求之后，会先写入 binlog，再提交事务，更新存储引擎中的数据，事务提交完成后，返回“操作成功”的响应。
- 从库会创建一个专门的 I/O 线程，连接主库的 log dump 线程，来接收主库的 binlog 日志，再把 binlog 信息写入 relay log 的中继日志里，再返回给主库“复制成功”的响应。
- 从库会创建一个用于回放 binlog 的线程，去读 relay log 中继日志，然后回放 binlog 更新存储引擎中的数据，最终实现主从的数据一致性。



### MySQL主从复制模型？<Badge text="了解" type="info" />

- **同步复制**：MySQL 主库提交事务的线程要等待所有从库的复制成功响应，才返回客户端结果。这种方式在实际项目中，基本上没法用，原因有两个：一是性能很差，因为要复制到所有节点才返回响应；二是可用性也很差，主库和所有从库任何一个数据库出问题，都会影响业务。
- **异步复制**(默认)：MySQL 主库提交事务的线程并不会等待 binlog 同步到各从库，就返回客户端结果。这种模式一旦主库宕机，数据就会发生丢失。
- **半同步复制**：介于两者之间，事务线程不用等待所有的从库复制成功响应，只要一部分复制成功响应回来就行，比如一主二从的集群，只要数据成功复制到任意一个从库上，主库的事务线程就可以返回给客户端。这种**半同步复制的方式，兼顾了异步复制和同步复制的优点，即使出现主库宕机，至少还有一个从库有最新的数据，不存在数据丢失的风险**。



### 为什么需要两阶段提交？<Badge text="掌握" type="tip" />

事务提交后，redo log 和 binlog 都要持久化到磁盘，但是这两个是独立的逻辑，可能出现半成功的状态，造成两份日志之间的逻辑不一致。

- **如果在将 redo log 刷入到磁盘之后， MySQL 突然宕机了，而 binlog 还没有来得及写入**。MySQL 重启后，通过 redo log 能将 Buffer Pool 恢复到新值，但是 binlog 里面没有记录这条更新语句，在主从架构中，binlog 会被复制到从库，由于 binlog 丢失了这条更新语句，从库的这一行是旧值，主从不一致。
- **如果在将 binlog 刷入到磁盘之后， MySQL 突然宕机了，而 redo log 还没有来得及写入**。由于 redo log 还没写，崩溃恢复以后这个事务无效，数据是旧值，而 binlog 里面记录了这条更新语句，在主从架构中，binlog 会被复制到从库，从库执行了这条更新语句，这一行字段是新值，与主库的值不一致性。

所以会造成主从环境的数据不一致性。因为 redo log 影响主库的数据，binlog 影响从库的数据，redo log 和 binlog 必须保持一致。

**两阶段提交把单个事务的提交拆分成了 2 个阶段，分别是准备(Prepare)阶段和提交(Commit)阶段**，每个阶段都由协调者(Coordinator)和参与者(Participant)共同完成。



### 两阶段提交的过程是怎样的？<Badge text="掌握" type="tip" />

在 MySQL 的 InnoDB 存储引擎中，开启 binlog 的情况下，MySQL 会同时维护 binlog 日志与 InnoDB 的 redo log，为了保证这两个日志的一致性，MySQL 使用了**内部 XA 事务**，内部 XA 事务由 binlog 作为协调者，存储引擎是参与者。

当客户端执行 commit 语句或者在自动提交的情况下，MySQL 内部开启一个 XA 事务，**分两阶段来完成 XA 事务的提交**。

事务的提交过程有两个阶段，**将 redo log 的写入拆成了两个步骤：prepare 和 commit，中间再穿插写入binlog**：

- **prepare 阶段**：将 内部 XA 事务的 ID写入到 redo log，同时将 redo log 对应的事务状态设置为 prepare，然后将 redo log 持久化到磁盘。
- **commit 阶段**：把 内部 XA 事务的 ID写入到 binlog，然后将 binlog 持久化到磁盘，接着调用引擎的提交事务接口，将 redo log 状态设置为 commit，此时该状态并不需要持久化到磁盘，只需要 write 到文件系统的 page cache 成功，只要 binlog 写磁盘成功，redo log 的状态还是 prepare 也没有关系，一样会被认为事务已经执行成功。



### 异常重启会出现什么现象？<Badge text="了解" type="info" />

在 MySQL 重启后会按顺序扫描 redo log 文件，碰到处于 prepare 状态的 redo log，就拿着 redo log 中的 XID 去 binlog 查看是否存在此 XID：

- **如果 binlog 中没有当前内部 XA 事务的 XID，说明 redolog 完成刷盘，但是 binlog 还没有刷盘，则回滚事务**。对应时刻 A 崩溃恢复的情况。
- **如果 binlog 中有当前内部 XA 事务的 XID，说明 redolog 和 binlog 都已经完成了刷盘，则提交事务**。对应时刻 B 崩溃恢复的情况。

**对于处于 prepare 阶段的 redo log，即可以提交事务，也可以回滚事务，这取决于是否能在 binlog 中查找到与 redo log 相同的 XID**，如果有就提交事务，如果没有就回滚事务。这样就可以保证 redo log 和 binlog 这两份日志的一致性了。



### 事务没提交redo log 会被持久化到磁盘吗？<Badge text="了解" type="info" />

会。事务执行中间过程的 redo log 也是直接写在 redo log buffer 中的，这些缓存在 redo log buffer 里的 redo log 也会被后台线程每隔一秒一起持久化到磁盘。



### 两阶段提交有什么问题？<Badge text="了解" type="info" />

**磁盘 I/O 次数高**：每个事务提交都会进行两次 fsync(刷盘)，一次是 redo log 刷盘，另一次是 binlog 刷盘。

**锁竞争激烈**：两阶段提交虽然能够保证单事务两个日志的内容一致，但在多事务的情况下，却不能保证两者的提交顺序一致。在两阶段提交的流程基础上，还需要加一个锁来保证提交的原子性，从而保证多事务的情况下，两个日志的提交顺序一致。

::: tip 为什么两阶段提交的磁盘 I/O 次数会很高？

binlog 和 redo log 在内存中都对应的缓存空间，binlog 会缓存在 binlog cache，redo log 会缓存在 redo log buffer，它们持久化到磁盘的时机分别由下面这两个参数控制。一般为了避免日志丢失的风险，会将这两个参数设置为 1：

- 当 sync_binlog = 1 的时候，表示每次提交事务都会将 binlog cache 里的 binlog 直接持久到磁盘；
- 当 innodb_flush_log_at_trx_commit = 1 时，表示每次事务提交时，都将缓存在 redo log buffer 里的 redo log 直接持久化到磁盘；

如果 sync_binlog 和 当 innodb_flush_log_at_trx_commit 都设置为 1，那么在每个事务提交过程中， 都会**至少调用 2 次刷盘操作**，一次是 redo log 刷盘，一次是 binlog 落盘，所以这会成为性能瓶颈。

:::

::: tip 为什么锁竞争激烈？

在早期的 MySQL 版本中，通过使用 prepare_commit_mutex 锁来保证事务提交的顺序，在一个事务获取到锁时才能进入 prepare 阶段，一直到 commit 阶段结束才能释放锁，下个事务才可以继续进行 prepare 操作。

通过加锁虽然完美地解决了顺序一致性的问题，但在并发量较大的时候，就会导致对锁的争用，性能不佳。

:::



### 组提交是什么意思？<Badge text="了解" type="info" />

有多个事务提交的时候，会将多个 binlog 刷盘操作合并成一个，从而减少磁盘 I/O 的次数。组提交机制后，prepare 阶段不变，将 commit 阶段拆分为三个过程：

- **flush 阶段**：多个事务按进入的顺序将 binlog 从 cache 写入文件(不刷盘)；
- **sync 阶段**：对 binlog 文件做 fsync 操作(多个事务的 binlog 合并一次刷盘)；
- **commit 阶段**：各个事务按顺序做 InnoDB commit 操作；

上面的**每个阶段都有一个队列**，每个阶段有锁进行保护，因此保证了事务写入的顺序，第一个进入队列的事务会成为 leader，leader领导所在队列的所有事务，全权负责整队的操作，完成后通知队内其他事务操作结束。对每个阶段引入了队列后，锁就只针对每个队列进行保护，不再锁住提交事务的整个过程，锁粒度减小了，这样就使得多个阶段可以并发执行，从而提升效率。



### Buffer Pool有什么作用？<Badge text="了解" type="info" />

主要的作用是实现缓存：

- 当读取数据时，如果数据存在于 Buffer Pool 中，会直接读取 Buffer Pool 中的数据。
- 当修改数据时，如果数据存在于 Buffer Pool 中，那直接修改 Buffer Pool 中数据所在的页，然后将其页设置为脏页(该页的内存数据和磁盘上的数据已经不一致)；不会立即将脏页写入磁盘，后续由后台线程选择一个合适的时机将脏页写入到磁盘。



### Buffer Pool缓存内容？<Badge text="了解" type="info" />

**InnoDB 会为 Buffer Pool 申请一片连续的内存空间，然后按照默认的大小划分出一个个的页， Buffer Pool 中的页就叫做缓存页**。此时这些缓存页都是空闲的，之后随着程序的运行，才会有磁盘上的页被缓存到 Buffer Pool 中。

Buffer Pool 除了缓存索引页和数据页，还包括了 Undo 页，插入缓存、自适应哈希索引、锁信息等等。

开启事务后，InnoDB 层更新记录前，首先要记录相应的 undo log，undo log 会写入 Buffer Pool 中的 Undo 页面。