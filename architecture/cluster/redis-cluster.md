# redis 集群

Redis支持三种集群方案

- 主从复制模式
- Sentinel（哨兵）模式
- Cluster模式

## 主从模式(读写分离)

主从复制模式中包含一个主数据库实例（master）与一个或多个从数据库实例（slave），如下图

![](image/redis-cluster/1644396843707.png)

1. 客户端可对主数据库进行读写操作，对从数据库进行读操作.
2. 主数据库写入的数据会实时自动同步给从数据库。

主从复制优点

   1. 从数据库分担主数据库的读压力
   2. master、slave之间的同步是以非阻塞的方式进行的，同步期间，客户端仍然可以提交查询或更新请求

缺点

   1. 不具备自动容错与恢复功能，master或slave的宕机都可能导致客户端请求失败，需要等待机器重启或手动切换客户端IP才能恢复.
   2. master宕机，如果宕机前数据没有同步完，则切换IP后会存在数据不一致的问题
   3. 难以支持在线扩容，Redis的容量受限于单机配置

### redis 主从

1. slave启动后，向master发送SYNC命令

2. master接收到SYNC命令后
   - 通过bgsave保存快照（即上文所介绍的RDB持久化）.
   - 使用缓冲区记录保存快照这段时间内执行的写命令.

3. master将保存的快照文件发送给slave，并继续记录执行的写命令.

4. slave接收到快照文件后，加载快照文件，载入数据

5. master快照发送完后开始向slave发送缓冲区的写命令，slave接收命令并执行，完成复制初始化
   此后master每次执行一个写命令都会同步发送给slave，保持master与slave之间数据的一致性

### Sentinel（哨兵）模式

在redis2.4之前的故障转移，是需要人为干预才能实现的，redis2.4之后引入了Sentinel。主服务器一段时间内无法正常工作时，sentinel将自主发现、自动执行故障转移。sentinel的引入，最大程度的保证了redis的高可用。

哨兵模式基于主从复制模式，只是引入了哨兵来监控与自动处理故障

![](image/redis-cluster/1644401877205.png)

哨兵功能包括

   1. 监控master、slave是否正常运行
   2. 当master出现故障时，能自动将一个slave转换为master（大哥挂了，选一个小弟上位）
   3. 多个哨兵可以监控同一个Redis，哨兵之间也会自动监控

#### 哨兵工作原理

> <https://mp.weixin.qq.com/s/IRwv7o17pZQ4pOTEHlc2pw>
> <https://www.cnblogs.com/kevingrace/p/9004460.html>

### 两个连接

每个sentinel都会创建两个异步的网络连接，是因为sentinel不仅要向master发送命令，而且还要接收master发布的消息。

   命令连接: 用于向master服务发送命令，并接收命令回复；
   订阅连接: 用于订阅、接收master服务的`__sentinel__:hello`频道；

#### 定时任务

Sentinel与master建立异步的订阅和命令连接后, 执行几个定时任务

1. Sentinel 每10秒 对 master 和 slave 执行 info 命令:该命令第一个是用来发现slave节点,第二个是确定主从关系.

   master收到后回复自己的RUNID、IP、端口、对应的master信息及master下的slave信息

   sentinel 收到后根据返回的信息更新自身维护的master结构和对应的slave字典列表

2. Sentinel 每2秒 通过命令连接向master或slave的`_sentinel:hello`频道发送信息.

   参数是本身的RUNID、配置纪元和正在监控的master信息。如果监控的是slave，发送的就是slave对应的master信息。

   同时又通过_sentinel:hello接收命令回复，目的就是用于发现多个监控同一master的sentinel。因此还会创建master对应的sentinel的数据结构，在接收到其他sentinel发送的频道信息后，会根据信息更新master对应的sentinel。

   与master数据结构绑定后，会建立sentinel与sentinel的命令连接，为后续通讯做准备。

   二. 每2秒每个 sentinel 通过 master 节点的 channel(名称为_sentinel_:hello) 交换信息(pub/sub):用来交互对节点的看法(后面会介绍的节点主观下线和客观下线)以及自身信息.
   

3. 默认每1秒每个 sentinel 对其他 sentinel 和 redis 执行 ping 命令,用于心跳检测,作为节点存活的判断依据.

   有效回复：包括运行正常（+PONG）、正在加载（-LOADING）、和主机下线（-MASTERDOWN）；
   无效回复：不在有效回复内的都是无效回复；


#### 配置参数

1. `sentinel monitor <masterName> <ip> <port> <quorum>`

   四个参数含义：
   masterName这个是对某个master+slave组合的一个区分标识（一套sentinel是可以监听多套master+slave这样的组合的）。
   ip 和 port 就是master节点的 ip 和 端口号。
   quorum这个参数是进行客观下线的一个依据，意思是至少有 quorum 个sentinel主观的认为这个master有故障，才会对这个master进行下线以及故障转移。因为有的时候，某个sentinel节点可能因为自身网络原因，导致无法连接master，而此时master并没有出现故障，所以这就需要多个sentinel都一致认为该master有问题，才可以进行下一步操作，这就保证了公平性和高可用。

   quorum的值一般设置为sentinel个数的二分之一加1(防脑裂)，例如3个sentinel就设置2

2. `sentinel down-after-milliseconds <masterName> <timeout>`

   这个配置其实就是进行主观下线的一个依据，masterName这个参数不用说了，timeout是一个毫秒值，表示：如果这台sentinel超过timeout这个时间都无法连通master包括slave（slave不需要客观下线，因为不需要故障转移）的话，就会主观认为该master已经下线（实际下线需要客观下线的判断通过才会下线）

#### 动态监控

1. 主观下线

　　SDOWN:subjectively down,直接翻译的为”主观”失效,即当前sentinel实例认为某个redis服务为”不可用”状态.

　　ODOWN:objectively down,直接翻译为”客观”失效,即多个sentinel实例都认为master处于”SDOWN”状态,那么此时master将处于ODOWN,ODOWN可以简单理解为master已经被集群确定为”不可用”,将会开启故障转移机制.

sentinel 配置文件中的 `down-after-milliseconds` 设置了判断主观下线的时间长度，如果实例距离最后一次有效回复PING命令的时间超过`down-after-milliseconds`选项所指定的值, 则这个实例会被Sentinel标记为主观下线。修改其flags状态为SRI_S_DOWN。如果多个sentinel监视一个服务，有可能存在多个sentinel的down-after-milliseconds配置不同，这个在实际生产中要注意。


2. 客观下线

   客观下线（Objectively Down， 简称 ODOWN）指的是多个 Sentinel 实例在对同一个服务器做出 SDOWN 判断， 并且通过 SENTINEL is-master-down-by-addr 命令互相交流之后， 得出的服务器下线判断，然后开启failover。

   **客观下线条件只适用于主服务器**： 对于任何其他类型的 Redis 实例， Sentinel 在将它们判断为下线前不需要进行协商.

   判定master为主观下线的首个sentinel，通过命令询问其他sentinel.
   
      目标sentinel收到命令后，会根据参数检查master是否下线，如果收到的也是无效回复，会将结果发送给源sentinel

   源sentinel会统计包括自己在内的所有认为master已进入主观下线的sentinel数量，统计数量如果达到了当前sentinel配置的阈值，会将sentinel的master对应的flags属性值更改为SRI_O_DOWN，master进入客观下线状态

   > 不同的sentinel可以配置不同的客观下线阈值。

#### 故障转移

###### sentinel leader 选取

   故障转移是由 sentinel 领导者节点来完成的(只需要一个sentinel节点), 关于 sentinel 领导者节点的选取也是每个 sentinel 向其他 sentinel 节点发送我要成为领导者的命令,超过半数sentinel 节点同意,并且也大于quorum ,那么他将成为领导者,如果有多个sentinel都成为了领导者,则会过段时间在进行选举.

   选举是有条件和规则设定的，条件比较多，以下汇总后的列表：

   - 每个sentinel都有被选择领头sentinel的资格；

   - 同一个配置纪元内（配置计数器，即选举后自增），每个sentinel只能选举一次，并且选举成功后，不会再改变；

   - 最先判定master为客观下线的sentinel都会要求其他Sentinel将自己设置为局部领头Sentinel；

   - 当被半数以上的sentinel支持后，局部领头sentinel就变成了领头sentinel，同一个配置纪元内可能会出现多个局部领头sentinel，但是领头sentinel只会产生一个；

###### 故障转移

故障转移是由 sentinel 领导者节点来完成的(只需要一个sentinel节点),关于 sentinel 领导者节点的选取也是每个 sentinel 向其他 sentinel 节点发送我要成为领导者的命令,超过半数sentinel 节点同意,并且也大于quorum ,那么他将成为领导者,如果有多个sentinel都成为了领导者,则会过段时间在进行选举.

1. **选择**: 从 slave 节点中选出一个合适的 节点作为新的master节点

   1. 排除掉状态较差的
      - 排除断线或者下线的;
      - 排除5秒内没有收到info回复的;
      - 排除与原master断开超过down-after-millisecond*10毫秒的slave。在down-after-millisecond设置的时长内没有收到有效回复，可以判定master已下线，增加此过滤规则是用于排除slave与原master过早断开连接，保证备选slave的数据是最新的（不理解的同学可以一起讨论）。

   1. 选择 slave-priority(slave节点优先级)最高的slave节点,如果存在则返回,不存在则继续下一步判断.
   2. 选择复制偏移量最大的 slave 节点(复制的最完整),如果存在则返回,不存在则继续.
   3. 选择runId最小的slave节点(启动最早的节点)

2. 重置

   对上面选出来的 slave 节点执行 slaveof no one 命令让其成为新的 master 节点.
   向剩余的 slave 节点发送命令,让他们成为新master 节点的 slave 节点,复制规则和前面设置的 parallel-syncs 参数有关.

3. 切换
   
   更新原来master 节点配置为 slave 节点,并保持对其进行关注, 一旦这个节点重新恢复正常后, 会命令它去复制新的master节点信息.(注意:原来的master节点恢复后是作为slave的角色)

可以从 sentinel 日志中出现的几个消息来进行查看故障转移:

1. `+switch-master`: 表示切换主节点(从节点晋升为主节点)
2. `+sdown`: 主观下线
3. `+odown`: 客观下线
4. `+convert-to-slave`: 切换从节点(原主节点降为从节点)



## other

1. 主服务器和从服务器选取



   上述规则可以决定领头sentinel，可以看出，投票、选举的过程其实是先到先得的。

