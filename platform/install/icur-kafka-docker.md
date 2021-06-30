# kafka-install-docker

---
keys: 
type:
url: <https://www.jianshu.com/p/e642793cd5de>,<https://www.cnblogs.com/gao88/p/10937151.html>
---

## docker安装kafka(单机部署)

### 1. pull 镜像

```shell
# zookeeper镜像
docker pull zookeeper
# kafka镜像
docker pull wurstmeister/kafka
# kafka管理镜像
docker pull sheepkiller/kafka-manager
```

> 当前安装时间是 2021年7月1日.
> `hub.docker.com` 网站上，Star最多的kafka镜像是 `wurstmeister/kafka`.
> 当前使用的镜像信息(均是当前最新版)
> - kafka镜像: `wurstmeister/kafka:2.12-2.5.0`.
> - zookeeper镜像: `zookeeper:3.7.0`.
>
> 网上推荐的zookeeper镜像版本是 `wurstmeister/zookeeper`, 但是我发现 `hub.docker.com` 上面的 `wurstmeister/zookeeper` 已经两年没有更新了, 而 `wurstmeister/kafka` 是十几天前更新的, 于是我就想着是不是新版的 `wurstmeister/kafka` 不再必需要`wurstmeister/zookeeper`了, 于是就用了 `zookeeper:3.7.0` 镜像
> 另外说下, `sheepkiller/kafka-manager` 也已经3年没有更新了

### 2. 启动zookeeper

> 见 zookeeper 安装配置篇

### 3. 启动 kafka

启动命令

   ```shell
   docker run -d --name kafka \
   --env KAFKA_ZOOKEEPER_CONNECT=118.31.6.96:2181 \
   --env KAFKA_ADVERTISED_HOST_NAME=118.31.6.96 \
   --env KAFKA_ADVERTISED_PORT=9092 \
   --publish 9092:9092 \
   --volume /etc/localtime:/etc/localtime \
   --env KAFKA_HEAP_OPTS="-Xmx256M -Xms128M" \
   wurstmeister/kafka:latest
   ```

   > --net=host 表示使用与宿主机网络模式
   > KAFKA_ZOOKEEPER_CONNECT 需要填zookeeper的ip:port, 
   >> 也有见到这样写的 --link zookeeper --env KAFKA_ZOOKEEPER_CONNECT=zookeeper:2181
   >> --link=[]: 添加链接到另一个容器；
   > KAFKA_ADVERTISED_HOST_NAME 值最好是宿主ip, 如果不这么设置, 可能会导致在别的机器上访问不到kafka
   > --volume /etc/localtime:/etc/localtime: 让docker容器使用主机系统时间（挂入/etc/localtime）

### 4. 查看启动日志

   ```shell
   > docker logs -f kafka

   # 开始启动
   Excluding KAFKA_HOME from broker config
   [Configuring] 'advertised.host.name' in '/opt/kafka/config/server.properties'
   [Configuring] 'port' in '/opt/kafka/config/server.properties'
   ...
   ...
   [2019-04-29 04:09:49,156] INFO Kafka version: 2.2.0 (org.apache.kafka.common.utils.AppInfoParser)
   [2019-04-29 04:09:49,156] INFO Kafka commitId: 05fcfde8f69b0349 (org.apache.kafka.common.utils.AppInfoParser)
   [2019-04-29 04:09:49,157] INFO [KafkaServer id=1001] started (kafka.server.KafkaServer)
   # 启动成功
   ```

### 5. 验证

1. 进入kafka容器的`/opt/kafka_2.12-2.2.0/bin/`目录, 并创建一个主题

   ```shell
   > docker exec -it kafka /bin/bash
   # 进入kafka的bin目录
   > cd /opt/kafka_2.13-2.7.0/bin/
   # 创建一个 test 主题
   > ./kafka-topics.sh --create --zookeeper 118.31.6.96:2181 --replication-factor 1 --partitions 1 --topic test
   Created topic test.
   ```

2. 在kafka容器的`/opt/kafka_2.12-2.2.0/bin/`目录执行命令，以生产者身份进行消息生产

   ```shell
   > ./kafka-console-producer.sh --broker-list 118.31.6.96:9092 --topic test
   >hello cpf
   >are you ok!
   ```

3. 另外打开一个新的ssh连接，同样进入kafka容器的`/opt/kafka_2.12-2.2.0/bin/`目录，模拟消费者接收消息

   ```shell
   > ./kafka-console-consumer.sh --bootstrap-server 118.31.6.96:9092 --topic test --from-beginning
   hello cpf
   are you ok!
   ```

4. 不断在生产者端发送消息，消费者端可以不断的接收到消息。kafka安装成功！

   同样，在zookeeper可视化工具，刷新后可以看到kafka的相关数据节点：

   ![zookeeper数据发生改变](https://gitee.com/cpfree/picture-warehouse/raw/master/pic1/20210701001112.png)

### 6. kafka-manager安装

```shell
docker run -d --name kafka-manager -e ZK_HOSTS="118.31.6.96:2181" --net=host sheepkiller/kafka-manager
```

2. 使用 `netstat -lntp`, 看下有没有 9000端口正在被监听.

> 记得把 9000 的防火墙打开.

3. 访问：<http://118.31.6.96:9000>，并添加一个cluster即可。
