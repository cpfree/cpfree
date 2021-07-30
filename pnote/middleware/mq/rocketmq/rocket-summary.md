# rocketMq


## rocketmq-install(linux-CentOs)

> 参考自: <https://blog.csdn.net/zhwyj1019/article/details/80264698>

> 安装环境
> - jdk1.8环境
> - centos7
> - rocketMq

步骤

1. 下载 rocketMq
   `wget http://www-us.apache.org/dist/rocketmq/4.2.0/rocketmq-all-4.2.0-bin-release.zip`

2. 解压至 `/usr/local` 路径(路径随便)
   `unzip rocketmq-all-4.2.0-bin-release.zip -d rocketmq-4.2.0`

3. 启动rocktMq-NameServer

   ```shell
   # 进入rocketMq目录
   cd /usr/local/rocketmq-4.2.0/
   # 启动
   nohup sh bin/mqnamesrv &
   ```

4. 启动完成进行验证 `rocktMq-NameServer` 是否启动成功

   ```shell
   > tail -f ~/logs/rocketmqlogs/namesrv.log
   ```

   # 有以下内容则说明启动成功

   ```log
   The Name Server boot success...
   ```
   
   - 若启动过程中可能报错显示内存不足，报错信息如下

   ```log
   # There is insufficient memory for the Java Runtime Environment to continue.
   # Native memory allocation (mmap) failed to map 33554432 bytes for committing reserved memory.
   ```

   此时修改 bin目录下的三个文件

   修改 `runserver.sh` 文件

   ```sh
   ...
   JAVA_OPT="${JAVA_OPT} -server -Xms256m -Xmx256m -Xmn128m -XX:PermSize=128m -XX:MaxPermSize=320m"
   ...
   ```

   修改 `runbroker.sh` 文件

   ```sh
   JAVA_OPT="${JAVA_OPT} -server -Xms256m -Xmx256m -Xmn128m
   ```

   同理修改 tools.sh 文件

   ```sh
   JAVA_OPT="${JAVA_OPT} -server -Xms256m -Xmx256m -Xmn128m -XX:PermSize=128m -XX:MaxPermSize=128m"
   ```

5. 启动rocketMq-Broker