### 如何确保消息正确地发送至RabbitMQ？如何确保消息接收方消费了消息？

- **消息确认机制**：生产者在发送消息后，可以通过消息确认机制（Confirm）确保消息被正确地发送至 RabbitMQ。消息确认机制分为批量确认和单个确认两种方式，生产者可以选择适合自己业务场景的确认方式。

- **消息持久化**：通过将消息设置为持久化的方式，可以确保消息在发送至 RabbitMQ 后即使 RabbitMQ 崩溃或者重启，消息仍然可以得到保留。在发送消息时，可以将消息的 delivery mode 设置为 2，表示消息需要被持久化。

- **连接超时设置**：在发送消息时，可以设置连接超时时间，当超过指定时间后仍未能成功发送消息时，可以通过重试等方式确保消息正确地发送至 RabbitMQ。

- **消息序列化和反序列化**：在发送和接收消息时，需要将消息对象序列化为二进制数据，再在接收方反序列化为消息对象。因此，需要确保消息对象的序列化和反序列化过程正确无误，可以采用 JSON、Protobuf 等常用的序列化和反序列化工具。


### 如何避免消息重复投递或重复消费？

- **消息确认机制**：在消费者处理消息后，通过发送消息确认（ACK）给 RabbitMQ，告知消息已被正确处理。如果消费者没有发送确认消息，RabbitMQ 会将消息重新投递到队列中，导致重复消费。

- **消息去重机制**：可以在应用程序中实现一个消息去重的机制，例如使用分布式缓存、数据库等存储系统，记录已经处理过的消息标识，以便下次处理时进行判断。如果消息已经被处理过，则可以直接忽略，避免重复处理。

- **消息幂等性处理**：可以将消费者的处理逻辑设计为幂等操作，即重复执行多次仍然具有相同的效果，避免因为消息重复消费导致业务数据错误。

- **设置消息过期时间**：可以在消息发送时设置过期时间，在消息过期后不再投递给消费者，避免重复消费。

- **使用消息唯一标识符**：可以在消息中添加唯一标识符，例如 UUID，保证每个消息都有独一无二的标识符，避免重复消费和重复投递。



### 如何保证消息持久化？


- 将消息的 delivery mode 设置为 2：在发送消息时，可以将消息的 delivery mode 属性设置为 2，表示消息需要被持久化。持久化的消息将会被写入磁盘，即使 RabbitMQ 重启或者崩溃，消息仍然可以得到保留。

- 将队列的 durable 属性设置为 true：在创建队列时，可以将队列的 durable 属性设置为 true，表示队列是持久化的。持久化的队列将会在 RabbitMQ 重启或者崩溃后得到保留。

- 将交换器的 durable 属性设置为 true：在创建交换器时，可以将交换器的 durable 属性设置为 true，表示交换器是持久化的。持久化的交换器将会在 RabbitMQ 重启或者崩溃后得到保留。

- 使用事务机制：在发送消息时，可以使用事务机制来确保消息的持久化。通过开启事务，发送者可以将消息发送到 RabbitMQ，然后等待 RabbitMQ 的确认，确认后再提交事务。使用事务机制可以确保消息的可靠性，但是会影响系统的性能。

### 消息如何路由？

消息的路由过程是通过交换器（Exchange）来实现的。当消息被发送到 RabbitMQ 时，生产者将消息发布到交换器中，然后根据交换器的类型和绑定规则将消息路由到一个或多个队列中。

下面是消息路由的基本流程：

- 生产者将消息发送到指定的交换器中。

- 交换器根据路由键（Routing Key）和绑定键（Binding Key）将消息发送到一个或多个队列中。路由键和绑定键可以是任意字符串，根据交换器的类型和绑定规则进行匹配。

- 如果交换器类型为 direct，会根据路由键进行精确匹配，将消息发送到所有匹配的队列中。

- 如果交换器类型为 fanout，会将消息发送到所有绑定到该交换器的队列中。

- 如果交换器类型为 topic，会根据通配符匹配规则将消息发送到匹配的队列中。例如，路由键为 "foo.bar" 的消息可以匹配绑定键为 "*.bar" 或 "foo.#" 的队列。

- 如果交换器类型为 headers，会根据消息的属性（headers）进行匹配，将消息发送到匹配的队列中。

- 如果没有匹配的队列，消息将被丢弃或返回给生产者，根据生产者的配置。

需要注意的是，交换器和队列都需要进行绑定，否则消息将无法路由到队列中。另外，可以根据需要在交换器和队列中配置各种属性，例如持久化、自动删除等，以满足不同的业务需求。


### RabbitMQ的消息确认过程？

RabbitMQ 的消息确认机制是指消费者在消费一条消息后，向 RabbitMQ 发送确认消息（ACK）的过程，以告知 RabbitMQ 消息已被正确处理。消息确认机制的作用是确保 RabbitMQ 可以正确地将消息从队列中删除，避免重复投递和重复消费。

消息确认机制的过程如下：

- 消费者从 RabbitMQ 中获取消息，处理消息。

- 处理完成后，向 RabbitMQ 发送确认消息（ACK）。确认消息通常是一个简单的 AMQP 基本确认帧，带有消息的标识符（delivery tag）和是否批量确认的标记。

- RabbitMQ 收到确认消息后，将该消息从队列中删除。

- 如果消费者在一定时间内没有发送确认消息，RabbitMQ 将认为消息未被正确处理，将会重新将消息投递到队列中，等待下一次消费。

需要注意的是，在某些情况下，消费者可能无法正确处理消息，例如消费者崩溃或出现异常等。为避免这种情况导致消息丢失，RabbitMQ 还提供了 Nack（Negative Acknowledge）和 Reject 机制，可以将消息标记为无法处理或无法路由的状态，使其重新回到队列中等待下一次投递。此外，可以通过设置重试次数和重试时间间隔等参数，进行消息重试和延迟投递的配置，以满足不同的业务需求。



### 消息基于什么传输？

由于 TCP 连接的创建和销毁开销较大，且并发数受系统资源限制，会造成性能瓶颈。RabbitMQ 使用信道的方式来传输数据。信道是建立在真实的 TCP 连接内的虚拟连接，且每条 TCP 连接上的信道数量没有限制。



### 为什么不应该对所有的 message 都使用持久化机制？

使用持久化机制会增加磁盘的负担，特别是在高并发场景下，持久化的成本会更高。如果所有的消息都使用持久化机制，会导致 RabbitMQ 的性能下降，从而影响整个系统的性能。因此，应该根据业务需求和消息的重要性，选择是否使用持久化机制。对于一些重要的消息，应该使用持久化机制，以确保消息的可靠性。而对于一些临时的消息，可以不使用持久化机制，减轻服务器的负担，提高系统的性能。

若 message 设置了 persistent 属性，但 queue 未设置 durable 属性，那么当该 queue 的 owner node 出现异常后，在未重建该 queue 前，发往该 queue 的 message 将被 blackholed ；若 message 设置了 persistent 属性，同时 queue 也设置了 durable 属性，那么当 queue 的 owner node 异常且无法重启的情况下，则该 queue 无法在其他 node 上重建，只能等待其 owner node 重启后，才能恢复该 queue 的使用，而在这段时间内发送给该 queue 的 message 将被 blackholed 。

所以，是否要对 message 进行持久化，需要综合考虑性能需要，以及可能遇到的问题。若想达到 100000 条/秒以上的消息吞吐量(单 RabbitMQ 服务器)，则要么使用其他的方式来确保 message 的可靠 delivery ，要么使用非常快速的存储系统以支持全持久化(例如使用SSD)。另外一种处理原则是：仅对关键消息作持久化处理(根据业务重要程度)，且应该保证关键消息的量不会导致性能瓶颈。

### 如何保证高可用的？RabbitMQ 的集群？

**普通集群模式**：普通集群模式是 RabbitMQ 最常见的集群模式，也是最简单的一种模式。在普通集群模式下，多台 RabbitMQ 服务器通过网络连接组成一个集群，共同管理消息队列，并通过节点之间的通信进行消息的传递和路由。普通集群模式适用于大多数应用场景，提供了高可用性和可靠性。

**镜像集群模式**：镜像集群模式是一种高可用性的集群模式，可以提高 RabbitMQ 集群的可靠性和容错能力。在镜像集群模式下，每个节点都有多个镜像节点，镜像节点会自动复制主节点的消息队列，并在主节点出现故障时接管消息队列的处理。镜像集群模式适用于对消息可靠性要求较高的场景，但是会增加网络带宽和存储成本。

**Federated集群模式**：Federated 集群模式是 RabbitMQ 的一种特殊的集群模式，可以将多个 RabbitMQ 集群组成一个逻辑上的整体，并通过 Federation 插件实现集群之间的消息传递和路由。Federated 集群模式适用于需要跨多个数据中心或地理位置分布的场景，但是会增加网络延迟和复杂度。


### RabbitMQ上的一个queue中存放的message是否有数量限制？

**队列的大小限制**：队列可以通过配置参数限制队列的大小，当队列的大小达到限制时，新的消息将无法入队。队列大小的限制可以通过 RabbitMQ 的管理界面或者 AMQP 协议进行设置。

**内存限制**：RabbitMQ 中的消息队列是保存在内存中的，当队列中的消息数量过多时，会占用大量的内存空间，可能会导致系统性能下降或者崩溃。因此，系统的内存大小也是队列中存放消息数量的限制因素之一。

**磁盘限制**：当 RabbitMQ 的磁盘空间不足时，也会限制队列中存放消息的数量。


### 在单node系统和多node构成的cluster系统中声明queue, exchange ,以及进行binding会有什么不同？

当你在单node上声明queue时，只要该node上相关元数据进行了变更，你就会得到Queue.Declare-ok回应；而在cluster上声明queue，则要求 cluster上的全部node都要进行元数据成功更新，才会得到Queue.Declare-ok 回应。另外，若node类型为RAM node则变更的数据仅保存在内存中，若类型为 disk node则还要变更保存在磁盘上的数据。



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

死信队列：当消息无法被正确处理时，可以将该消息转发到死信队列中，以便进行进一步的处理。通过使用死信队列，可以将无法处理的消息统一存储和管理，并通过设置合适的 TTL 和 DLX 等参数，灵活控制消息的转发和重新处理。

使用死信队列的主要步骤如下：

- 创建一个普通队列和一个死信交换器；
- 将普通队列绑定到死信交换器，并指定死信队列的路由键；
- 在发送消息时，可以将消息的 TTL 设置为一个较小的值，当消息未被消费者处理时，该消息会被转发到死信队列中。

延迟队列：当需要在一定时间后才能处理某个消息时，可以使用延迟队列。通过设置消息的 TTL 和 DLX 等参数，可以将消息转发到一个指定的队列中，以便在一定的时间后再进行处理。使用延迟队列可以灵活地控制消息的发送和处理时间，适用于很多场景，如订单超时处理、提醒任务等。

使用延迟队列的主要步骤如下：

- 创建一个普通队列和一个交换器；
- 在交换器中设置消息的 TTL 和 DLX 等参数，将消息转发到指定的队列中；
- 在指定的队列中处理消息。

### 什么情况下producer不主动创建queue是安全的？

message是允许丟失的；实现了针对未处理消息的republish功能。


### 如何保证消息的顺序性？

一个队列只有一个消费者的情况下才能保证顺序，否则只能通过全局ID实现(每条消息都一个msgld，关联的消息拥有一个parentMsgld。可以在消费端实现前一条消息未消费，不处理下一条消息；也可以在生产端实现前一条消息未处理完不发下一条信息。


### 无法被路由的消息去了哪里？

mandatory: true返回消息给生产者。

mandatory: false 直接丟弃。



### 消息什么时候会变成死信？

消息拒绝并且没有设置重新入队；消息过期；消息堆积，并且队列达到最大长度，先入队的消息会变成DL。

### RabbitMQ事务机制？

RabbitMQ 支持事务机制，用于在发送消息时保证事务的原子性。事务机制允许在多个 RabbitMQ 操作中声明事务，并在最终确认消息被完全处理之前，将多个操作打包为一个原子操作。

在 RabbitMQ 中，事务机制的使用流程如下：

- 开启事务：在发送消息之前，使用 txSelect 方法开启事务；

- 发送消息：使用 basicPublish 方法发送消息；

- 提交事务：使用 txCommit 方法提交事务，如果提交成功，则消息会被 RabbitMQ 确认，否则消息会被回滚；

- 回滚事务：使用 txRollback 方法回滚事务，如果回滚成功，则之前发送的消息会被撤销，否则消息会被继续处理。

需要注意的是，使用事务机制会对 RabbitMQ 的性能产生一定的影响，因此建议在必要的情况下使用，例如在消息的可靠性要求非常高的场景下。在消息量较大的场景下，可以使用事务机制的替代方案，如消息确认机制（ACK机制）等，以保证系统的高性能和可靠性