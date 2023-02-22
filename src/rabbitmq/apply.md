### 如何确保消息正确地发送至RabbitMQ？如何确保消息接收方消费了消息？

**发送方确认模式**

将信道设置成confirm模式(发送方确认模式)，则所有在信道上发布的消息都会被指派一个唯一的ID。

一旦消息被投递到目的队列后，或者消息被写入磁盘后(可持久化的消息)，信道会发送一个确认给生产者(包含消息唯一ID)。

如果 RabbitMQ 发生内部错误从而导致消息丢失，会发送一条nack(notacknowledged，未确认)消息。发送方确认模式是异步的，生产者应用程序在等待确认的同时，可以继续发送消息。当确认消息到达生产者应用程序，生产者应用程序的回调方法就会被触发来处理确认消息。

消息不可靠的情况可能是消息丢失，劫持等原因；丢失又分为：生产者丢失消息、消息列表丢失消息、消费者丢失消息；

- **生产者丢失消息**：从生产者弄丢数据这个角度来看，RabbitMQ提供transaction和confirm模式来确保生产者不丢消息；transaction机制就是说：发送消息前，开启事务(channel.txSelect())，然后发送消息，如果发送过程中出现什么异常，事务就会回滚(channel.txRollback())，如果发送成功则提交事务(channel.txCommit())。然而，这种方式有个缺点：吞吐量下降。confirm模式用的居多：一旦channel进入confirm模式，所有在该信道上发布的消息都将会被指派一个唯一的ID(从1开始)，一旦消息被投递到所有匹配的队列之后；rabbitMQ就会发送一个ACK给生产者(包含消息的唯一ID)，这就使得生产者知道消息已经正确到达目的队列了；如果rabbitMQ没能处理该消息，则会发送一个Nack消息给你，你可以进行重试操作。
- **消息队列丢数据**：消息持久化。处理消息队列丢数据的情况，一般是开启持久化磁盘的配置。这个持久化配置可以和confirm机制配合使用，你可以在消息持久化磁盘后，再给生产者发送一个Ack信号。这样，如果消息持久化磁盘之前，rabbitMQ阵亡了，那么生产者收不到Ack信号，生产者会自动重发。

::: tip 如何持久化？

1. 将queue的持久化标识durable设置为true，则代表是一个持久的队列
2. 发送消息的时候将deliveryMode=2

这样设置以后，即使rabbitMQ挂了，重启后也能恢复数据.

:::

- **消费者丢失消息**：消费者丢数据一般是因为采用了自动确认消息模式，改为手动确认消息即可。消费者在收到消息之后，处理消息之前，会自动回复RabbitMQ已收到消息；如果这时处理消息失败，就会丢失该消息；解决方案：处理消息成功后，手动回复确认消息。



### 如何避免消息重复投递或重复消费？

在消息生产时，MQ 内部针对每条生产者发送的消息生成一个 inner-msg-id，作为去重的依据(消息投递失败并重传)，避免重复的消息进入队列；在消息消费时，要求消息体中必须要有一个 bizId(对于同一业务全局唯一，如支付 ID、订单 ID、帖子 ID 等)作为去重的依据，避免同一条消息被重复消费。



### 如何保证消息持久化？

消息持久化，当然前提是队列必须持久化。

RabbitMQ确保持久性消息能从服务器重启中恢复的方式是，将它们写入磁盘上的一个持久化日志文件，当发布一条持久性消息到持久交换器上时，Rabbit 会在消息提交到日志文件后才发送响应。一旦消费者从持久队列中消费了一条持久化消息；RabbitMQ 会在持久化日志中把这条消息标记为等待垃圾收集。如果持久化消息在被消费之前 RabbitMQ 重启，那么 Rabbit 会自动重建交换器和队列(以及绑定)，并重新发布持久化日志文件中的消息到合适的队列。



### 消息如何路由？

消息提供方->路由->一至多个队列消息发布到交换器时，消息将拥有一个路由键(routing key)，在消息创建时设定。通过队列路由键，可以把队列绑定到交换器上。消息到达交换器后，RabbitMQ会将消息的路由键与队列的路由键进行匹配(针对不同的交换器有不同的路由规则)。常用的交换器主要分为一下三种：

- fanout：如果交换器收到消息，将会广播到所有绑定的队列上

- direct：如果路由键完全匹配，消息就被投递到相应的队列

- topic：可以使来自不同源头的消息能够到达同一个队列。使用topic交换器时，可以使用通配符



### RabbitMQ的消息确认过程？

- 消费者收到的每一条消息都必须进行确认(自动确认和自行确认)

- 消费者在声明队列时，可以置顶autoAck参数，当autoAck = false时，RabbitMQ会等待消费者显式发送回ack信号后才从内存(和磁盘，如果是持久化消息的话)中删除肖息，否则RabbitMQ会在队列中消息被消费后立即删除。
- 采用消息确认机制后，只要使autoAck = false，消费者就有足够的时间处理消息(任务)，不用担心处理消息过程中消费者进才挂掉后消息丢失的问题，因为 RabbitMQ会一直持有消息直到消费者显式调用basicAck为止。
- 当autoAck = false时，对于RabbitMQ服务器端而言，队列中的消息分成了两部分：一部分是等待投递给消费者的消息；一部分是已经投递给消费者，但是还没有收到消费者ack信号的消息。如果服务器端一直没有收到消费者的ack信号，并且消费此消息的消费者已经断开连接，则服务器端会安排该消息重新进入队列，等待投递给下一个消费者(也可能还是原来的那个消费者)
- RabbitMQ不会为ack消息设置超时时间，它判断此消息是否需要重新投递给消费者的依据是消费该消息的消费者连接是否已经断开。这么设计的原因是 RabbitMQ允许消费者消费一条消息的时间可以很久很久。



### 消息基于什么传输？

由于 TCP 连接的创建和销毁开销较大，且并发数受系统资源限制，会造成性能瓶颈。RabbitMQ 使用信道的方式来传输数据。信道是建立在真实的 TCP 连接内的虚拟连接，且每条 TCP 连接上的信道数量没有限制。



### 为什么不应该对所有的 message 都使用持久化机制？

首先，必然导致性能的下降，因为写磁盘比写 RAM 慢的多，message 的吞吐量可能有 10 倍的差距。

其次，message 的持久化机制用在 RabbitMQ 的内置 cluster 方案时会出现“坑爹”问题。矛盾点在于，若 message 设置了 persistent 属性，但 queue 未设置 durable 属性，那么当该 queue 的 owner node 出现异常后，在未重建该 queue 前，发往该 queue 的 message 将被 blackholed ；若 message 设置了 persistent 属性，同时 queue 也设置了 durable 属性，那么当 queue 的 owner node 异常且无法重启的情况下，则该 queue 无法在其他 node 上重建，只能等待其 owner node 重启后，才能恢复该 queue 的使用，而在这段时间内发送给该 queue 的 message 将被 blackholed 。

所以，是否要对 message 进行持久化，需要综合考虑性能需要，以及可能遇到的问题。若想达到 100,000 条/秒以上的消息吞吐量（单 RabbitMQ 服务器），则要么使用其他的方式来确保 message 的可靠 delivery ，要么使用非常快速的存储系统以支持全持久化（例如使用 SSD）。另外一种处理原则是：仅对关键消息作持久化处理（根据业务重要程度），且应该保证关键消息的量不会导致性能瓶颈。

### 如何保证高可用的？RabbitMQ 的集群？

RabbitMQ 是比较有代表性的，因为是基于主从（非分布式）做高可用性的，我们就以 RabbitMQ 为例子讲解第一种 MQ 的高可用性怎么实现。RabbitMQ 有三种模式：单机模式、普通集群模式、镜像集群模式。

**单机模式**，就是 Demo 级别的，一般就是你本地启动了玩玩儿的?，没人生产用单机模式

**普通集群模式**，意思就是在多台机器上启动多个 RabbitMQ 实例，每个机器启动一个。你创建的 queue，只会放在一个 RabbitMQ 实例上，但是每个实例都同步 queue 的元数据（元数据可以认为是 queue 的一些配置信息，通过元数据，可以找到 queue 所在实例）。你消费的时候，实际上如果连接到了另外一个实例，那么那个实例会从 queue 所在实例上拉取数据过来。这方案主要是提高吞吐量的，就是说让集群中多个节点来服务某个 queue 的读写操作。

**镜像集群模式**：这种模式，才是所谓的 RabbitMQ 的高可用模式。跟普通集群模式不一样的是，在镜像集群模式下，你创建的 queue，无论元数据还是 queue 里的消息都会存在于多个实例上，就是说，每个 RabbitMQ 节点都有这个 queue 的一个完整镜像，包含 queue 的全部数据的意思。然后每次你写消息到 queue 的时候，都会自动把消息同步到多个实例的 queue 上。RabbitMQ 有很好的管理控制台，就是在后台新增一个策略，这个策略是镜像集群模式的策略，指定的时候是可以要求数据同步到所有节点的，也可以要求同步到指定数量的节点，再次创建 queue 的时候，应用这个策略，就会自动将数据同步到其他的节点上去了。这样的话，好处在于，你任何一个机器宕机了，没事儿，其它机器（节点）还包含了这个 queue 的完整数据，别的 consumer 都可以到其它节点上去消费数据。坏处在于，第一，这个性能开销也太大了吧，消息需要同步到所有机器上，导致网络带宽压力和消耗很重！RabbitMQ 一个 queue 的数据都是放在一个节点里的，镜像集群下，也是每个节点都放这个 queue 的完整数据。

### RabbitMQ上的一个queue中存放的message是否有数量限制？

无。限制取决于机器内存。

### 在单node系统和多node构成的cluster系统中声明queue, exchange ,以及进行binding会有什么不同？

当你在单node上声明queue时，只要该node上相关元数据进行了变更， 你就会得到Queue.Declare-ok回应；而在cluster上声明queue，则要求 cluster上的全部node都要进行元数据成功更新，才会得到Queue.Declare-ok 回应。另外，若node类型为RAM node则变更的数据仅保存在内存中，若类型为 disk node则还要变更保存在磁盘上的数据。

### 客户端连接到duster中的任意node上是否都能正常工作？

是的，客户端感觉不到不同。

### 若cluster中拥有某个queue的owner node失效了，且该queue 被声明具有durable属性，是否能够成功从其他node上重新声明该queue ? 

不能，在这种情况下，将得到404 NOT FOUND错误。只能等queue所属的 node恢夏后才能使用该queue 。但若该queue本身不具有durable属性， 则可在其他node上重新声明。

### cluster中node的失效会对consumer产生什么影响？若是在cluster中创建了 mirrored queue ，这时node失效会对consumer产生什么影响？

若是consumer所连接的那个node失效（无论该node是否为consumer所订阅queue的owner node），则会在发现TCP连接断开时， 按标准行为执行重连逻辑，并根据"Assume Nothing"原则重建相应的fabric即可。

若是失效的 node 为 consumer 订阅 queue 的 owner node，则 consumer 只能通过Consumer CancellationNotification机制来检测与该queue订阅关系的终止，否则会出现傻等却没有任何消息来到的问题。

### 能够在地理上分开的不同数据中心使用RabbitMQ cluster吗？

不能。第一，你无法控制所创建的queue实际分布在cluster里的哪个node 上（一般使用 HAProxy + cluster 访问时的常见问题；第二，Erlang的OTP通信框架对延迟的容忍度有限，这可能会触发各种超时，导致业务疲于处理；第三，在广域网上的连接失效问题将导致经典的"脑裂"问题，而RabbitMQ目前无法处理（该问题主要是说Mnesia）。

### 为什么heavy RPC的使用场景下不建议采用disk node ?

heavy RPC是指在业务逻辑中高频调用RabbitMQ提供的RPC机制，导致不断创建、销毁reply queue ，进而造成disk node的性能问题（因为会针对元数据不断写盘）。所以在使用RPC机制时需要考虑自身的业务场景。

### 向不存在的exchange发publish消息会发生什么？向不存在的queue执行consume动作会发生什么？

都会收到Channel.Close信令告之不存在（内含原因404 NOT FOUND） 

### 为什么说保证message被可靠持久化的条件是queue和 exchange具有durable属性，同时message具有 persistent属性才行？

binding关系可以表示为exchange - binding - queue。从文档中我们知道, 若要求投递的message能够不丟失，要求message本身设置persistent属性，要求exchange和queue都设置durable属性。其实这问题可以这么想，若exchange或queue未设置durable属性，则在其crash之后就会无法恢复，那么即使message设置了 persistent属性，仍然存在message虽然能恢复但却无处容身的问题；同理，若message本身未设置persistent属性，则message的持久化更无从谈起。

### Consumer Cancellation Notification 机制用于什么场景？

用于保证当镜像queue中master挂掉时，连接到slave上的consumer可以收到自身consume被取消的通知，进而可以重新执行consume动作从新选出的master出获得消息。若不采用该机制，连接到slave上的consumer将不会感知master挂掉这个事情，导致后续无法再收到新master广播出来的 message。另外，因为在镜像queue模式下，存在将message进行 requeue 的可能，所以实现consumer的逻辑时需要能够正确处理出现重夏message的 情况。

### Basic.Reject的用法是什么？

该信令可用于consumer对收到的message进行reject。若该信令设置requeue=true，则当RabbitMQ server收到该拒绝信令后，会将该 message 重新发送到下一个处于consume状态的consumer处（理论上仍可能将该消息发送给当前consumer）。若设置 requeue=false ，则RabbitMQ server 在收到拒绝信令后，将直接将该message从queue中移除。另外一种移除queue中message的小技巧是，consumer回复Basic.Ack 但不对获取到的message做任何处理。而Basic.Nack是对Basic的扩展，以支持一次拒绝多条message的能力。

### 死信队列和延迟队列的使用？

死信消息：消息被拒绝(Basic.Reject或Basic.Nack)并且设置requeue参数的值为false，消息过期了队列达到最大的长度。
过期消息：在rabbitmq中存在2种方可设置消息的过期时间，第一种通 对队列进行设置，这种设置后，该队列中所有的消息都存在相同的过期时间，第二种通过对消息本身进行设置，那么每条消息的过期时间都不一样。如果同时使用这2种方法，那么以过期时间小的那个数值为准。当消息达到过期时间还没有被消费，那么那个消息就成为了一个死信消息。
队列设置：在队列申明的时候使用x-message-ttl参数，单位毫秒
单个消息设置：是设置消息属性的expiration参数的值，单位为毫秒
延时队列：在rabbitmq中不存在延时队列，但是我们可以通过设置消息的过期时间和死信队列来模拟出延时队列。

### 什么情况下producer不主动创建queue是安全的？

message是允许丟失的；实现了针对未处理消息的republish功能。

### 如何保证消息的顺序性？

一个队列只有一个消费者的情况下才能保证顺序，否则只能通过全局ID实现(每条消息都一个msgld，关联的消息拥有一个parentMsgld。可以在消费端实现前一条消息未消费，不处理下一条消息；也可以在生产端实现前一条消息未处理完不发下一条信息。

### 无法被路由的消息去了哪里？

mandatory: true返回消息给生产者。

mandatory: false 直接丟弃。

### RabbitMQ的集群？

镜像集群模式

创建的 queue，无论元数据还是 queue 里的消息都会存在于多个实例上，然后每次写消息到 queue 的时候，都会自动把消息到多个实例的 queue 里进行消息同步。

好处在于，任何一个机器宕机了，别的机器都可以用。坏处在于，第一，开销很大，消息同步所有机器，导致网络带宽压力和消耗很重。第二，没有扩展性，如果某个 queue 负载很重，你加机器新增的机器也包含了这个 queue 的所有数据，并没有办法线性扩展 queue。

### 消息什么时候会变成死信？

消息拒绝并且没有设置重新入队；消息过期；消息堆积，并且队列达到最大长度，先入队的消息会变成DL。

### RabbitMQ事务机制？

- channel.txSelect用于将当前的信道设置成事务模式

- channel.txCommit 用于提交事务 
- channel.txRollback用于事务回滚，如果在事务提交执行之前由于RabbitMQ异常崩溃或者其他原因抛出异常，通过txRollback来回滚