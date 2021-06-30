# zookeeper-install

[toc]

> [zookeeper 安装](https://m.w3cschool.cn/zookeeper/zookeeper_installation.html)

## 环境

1. jdk

    > `java -version`

2. 注意防火墙相应端口是否打开, 防火墙相关链接

    ```shell
    firewall-cmd --zone=public --add-port=2181/tcp --permanent
    firewall-cmd --zone=public --add-port=2888/tcp --permanent
    firewall-cmd --zone=public --add-port=3888/tcp --permanent
    firewall-cmd --reload
    ```

---

## zookeeper 单机

> 相对于集群部署, 不配置`serve.id`同时不创建`myid`文件, 运行起来即为单机部署.
> 集群部署后仅仅保留当前的 `serve.id`, 启动后运行即为单机部署. Mode: `standalone`

```shell
> zkServer.sh status
ZooKeeper JMX enabled by default
Using config: /usr/local/app/apache-zookeeper-3.5.7-bin/bin/../conf/zoo.cfg
Client port found: 2181. Client address: localhost.
Mode: standalone
```

---

## zookeeper 集群(CentOs)

> 在三台虚拟机(CentOs7)上部署zookeeper
> ip端口分别是 `192.168.164.131`, `192.168.164.132`, `192.168.164.133`

1. jdk
2. 资源拷贝, 下载zookeeper并解压至指定目录,

    在此使用的是 `apache-zookeeper-3.5.7-bin`, 解压文件到 `/usr/local/app/apache-zookeeper-3.5.7-bin` 目录

    注意 `apache-zookeeper-3.5.5` 版本之后的 `apache-zookeeper-3.5.x-bin` 才是可执行文件, `apache-zookeeper-3.5.x` 是源码文件, 而且在window下解压可能会出现异常.

3. 修改配置文件 `zoo.cfg`

    ```shell
    # 0. 定位到 安装文件夹
    > pwd
    /usr/local/app/apache-zookeeper-3.5.7-bin
    # 1. 新建 dataDir, 和 dataLogDir
    > mkdir data
    > mkdir datalog
    # 拷贝 zoo_sample.cfg 文件
    > cp zoo_sample.cfg zoo.cfg
    > vim zoo.cfg
    ```

    修改示例

    ```conf
    # The number of milliseconds of each tick
    # 基本事件单元，这个时间是作为Zookeeper服务器之间或客户端与服务器之间维持心跳的时间间隔，每隔tickTime时间就会发送一个心跳；最小的session过期时间为2倍tickTime
    tickTime=2000
    # The number of ticks that the initial
    # synchronization phase can take
    # 允许follower连接并同步到Leader的初始化连接时间，以tickTime为单位。当初始化连接时间超过该值，则表示连接失败。
    initLimit=10
    # The number of ticks that can pass between
    # sending a request and getting an acknowledgement
    # 表示Leader与Follower之间发送消息时，请求和应答时间长度。如果follower在设置时间内不能与leader通信，那么此follower将会被丢弃。
    syncLimit=5
    # the directory where the snapshot is stored.
    # do not use /tmp for storage, /tmp here is just
    # example sakes.
    # 存储内存中数据库快照的位置，除非另有说明，否则指向数据库更新的事务日志。注意：应该谨慎的选择日志存放的位置，使用专用的日志存储设备能够大大提高系统的性能，如果将日志存储在比较繁忙的存储设备上，那么将会很大程度上影像系统性能。
    dataDir=/usr/local/app/apache-zookeeper-3.5.7-bin/data

    # the port at which the clients will connect
    # 监听客户端连接的端口。
    clientPort=2181
    # the maximum number of client connections.
    # increase this if you need to handle more clients
    #maxClientCnxns=60
    #
    # Be sure to read the maintenance section of the administrator guide before turning on autopurge.
    #
    # http://zookeeper.apache.org/doc/current/zookeeperAdmin.html#sc_maintenance
    #
    # The number of snapshots to retain in dataDir autopurge.snapRetainCount=3
    # Purge task interval in hours
    # Set to "0" to disable auto purge feature
    #autopurge.purgeInterval=1

    dataLogDir=/usr/local/app/apache-zookeeper-3.5.7-bin/datalog

    # server.A=B:C:D
    # A：其中 A 是一个数字，表示这个是服务器的编号
    # B：是这个服务器的 ip 地址
    # C：Leader选举的端口
    # D：Zookeeper服务器之间的通信端口
    server.1=192.168.164.131:2888:3888
    server.2=192.168.164.132:2888:3888
    server.3=192.168.164.133:2888:3888
    ```

4. 在 `dataDir` 所指目录下创建 `myid` 文件.

    myid文件中只需要有一个整数, 代表但钱服务器编号.

    ```shell
    > cat /usr/local/app/apache-zookeeper-3.5.7-bin/data/myid
    x
    ```

5. 配置环境变量(可选)

    1. `vim /etc/profile`
    2. 添加zookeeper配置信息.

        ```conf
        # zookeeper
        export ZK_HOME=/usr/local/app/apache-zookeeper-3.5.7-bin
        export PATH=$PATH:${ZK_HOME}/bin
        ```

    3. 重载环境配置: `source /etc/profle`

6. 启动zookeeper, 看下是否成功

    启动命令：`zkServer.sh start`
    停止命令：`zkServer.sh stop`
    重启命令：`zkServer.sh restart`
    查看集群节点状态：`zkServer.sh status`

    > 启动后, 查看状态, 服务器编号最大的应该成功的通过了选举称为了leader,而剩下的两台成为了 follower。

7. 客户端连接验证

    `./bin/zkCli.sh`

## 启动错误

如果没有出现上面的状态，说明搭建过程出了问题，那么解决问题的首先就是查看日志文件：

zookeeper 日志文件目录在 dataDir 配置的目录下，文件名称为：zookeeper.out。通过查看日志来解决相应的问题。下面是两种常见的问题：

1. 防火墙打开

   ```shell
   # 查看防火墙状态
   service iptables status

   # 关闭防火墙
   chkconfig iptables off
   ```

2. dataDir 配置的目录没有创建

　　在 zoo.cfg 文件中，会有对 dataDir 的一项配置，需要创建该目录，并且注意要在该目录下创建 myid 文件，里面的配置和 zoo.cfg 的server.x 配置保持一致。
