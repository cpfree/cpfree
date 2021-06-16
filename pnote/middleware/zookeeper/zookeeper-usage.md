
# Zookeeper 使用

[toc]

> 参考文章【易百教程】，商业转载请联系作者获得授权，非商业请保留原文链接：https://www.yiibai.com/zookeeper/zookeeper_cli.html

## 操作

客户端连接 zookeeper 服务器后可以做以下操作

1. 增删改查 节点
2. 监视 znode 变化
3. 创建 znode 的子 znode
4. 列出一个 znode 的子 znode
5. 检查状态

> 父节点不存在则无法创建子结点

## zkCli(命令行界面)

zookeeper的基本特性

1. create

   > 创建节点时,必须要带上全路径
   > 同意级别的节点不能够存在重复

   1. 创建一个节点: `create {/path} {data}`

      ```shell
      > create /FirstZnode "haha"
      Created /FirstZnode
      ```

   2. 创建一个顺序节点: `create -s {/path} {data}`

      ```shell
      > create -s /FirstZnode "haha"
      Created /FirstZnode0000000003
      > create -s /FirstZnode "haha"
      Created /FirstZnode0000000004
      > create -s /FirstZnode "haha"
      Created /FirstZnode0000000005
      ```

   3. 创建一个临时节点: `create -e {/path} {data}`

      ```shell
      > create -e /FirstZnode "haha"
      Created /FirstZnode
      ```

      > 临时节点特性(会话结束后一段时间后会被删除, 删除机制, 心跳机制).

   4. 创建子节点 `create /parent/path/subnode/path /data`

      ```shell
      [zk: localhost:2181(CONNECTED) 16] create /FirstZnode/Child1 "firstchildren"
      created /FirstZnode/Child1
      [zk: localhost:2181(CONNECTED) 17] create /FirstZnode/Child2 "secondchildren"
      created /FirstZnode/Child2
      ```

2. delete & deleteall

   删除指定znode和递归删除所有的子znode。这只有在znode可用时发生。

   1. 节点只能一层一层删除, 不能删除有子结点的节点.
   2. 通过 deleteall 可以递归删除.

   ```shell
   rmr /path
   delete /path
   deleteall /path
   ```

3. set 命令

   设置指定znode的数据

   `set /path /data`

4. get 命令

   1. 获取数据 `get /path`

      它返回 znode 的相关数据和指定 znode 元数据。这里将得到信息，例如当数据最后一次修改，在那里它被修改和有关数据的信息。此外 CLI 还用于分配监视显示通知有关的数据。

      ```shell
      [zk: localhost:2181(CONNECTED) 1] get /FirstZnode
      "Myfirstzookeeper-app"
      cZxid = 0x7f
      ctime = Tue Sep 29 16:15:47 IST 2015
      mZxid = 0x7f
      mtime = Tue Sep 29 16:15:47 IST 2015
      pZxid = 0x7f
      cversion = 0
      dataVersion = 0
      aclVersion = 0
      ephemeralOwner = 0x0
      dataLength = 22
      numChildren = 0
      ```

   2. 监听 get /path [watch] 1

      输出类似于正常get命令，但它会在后台等待节点改变。

      ```shell
      [zk: localhost:2181(CONNECTED) 1] get /FirstZnode 1
      "Myfirstzookeeper-app"
      cZxid = 0x7f
      ctime = Tue Sep 29 16:15:47 IST 2015
      mZxid = 0x7f
      mtime = Tue Sep 29 16:15:47 IST 2015
      pZxid = 0x7f
      cversion = 0
      dataVersion = 0
      aclVersion = 0
      ephemeralOwner = 0x0
      dataLength = 22
      numChildren = 0
      ```

5. ls 命令

   列出路径下子znode

   ```shell
   [zk: localhost:2181(CONNECTED) 2] ls /MyFirstZnode
   [mysecondsubnode, myfirstsubnode]
   ```

6. 检查状态 stat

   状态描述了指定znode的元数据。它包含详细信息，如时间戳，版本号，访问控制列表，数据长度和子znode。

   语法: `stat /path`

   ```shell
   [zk: localhost:2181(CONNECTED) 1] stat /FirstZnode
   cZxid = 0x7f
   ctime = Tue Sep 29 16:15:47 IST 2015
   mZxid = 0x7f
   mtime = Tue Sep 29 17:14:24 IST 2015
   pZxid = 0x7f
   cversion = 0
   dataVersion = 1
   aclVersion = 0
   ephemeralOwner = 0x0
   dataLength = 23
   numChildren = 0
   ```

### 使用 Java API 操作 zookeeper

使用 Java API 操作 zookeeper, 首先引入相关jar包

下面我们来实现上面说的分布式配置中心：
1、在 zookeeper 里增加一个目录节点，并且把配置信息存储在里面
![img](https://img-blog.csdn.net/20180712143937411?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2phdmFfNjY2NjY=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)
2、启动两个 zookeeper 客户端程序，代码如下所示

```java
import java.util.concurrent.CountDownLatch;
import org.apache.zookeeper.WatchedEvent;
import org.apache.zookeeper.Watcher;
import org.apache.zookeeper.Watcher.Event.EventType;
import org.apache.zookeeper.Watcher.Event.KeeperState;
import org.apache.zookeeper.ZooKeeper;
import org.apache.zookeeper.data.Stat;

/**
 * 分布式配置中心demo
 * @author
 *
 */
public class ZooKeeperProSync implements Watcher {

    private static CountDownLatch connectedSemaphore = new CountDownLatch(1);
    private static ZooKeeper zk = null;
    private static Stat stat = new Stat();

    public static void main(String[] args) throws Exception {
        //zookeeper配置数据存放路径
        String path = "/username";
        //连接zookeeper并且注册一个默认的监听器
        zk = new ZooKeeper("192.168.31.100:2181", 5000, //
                new ZooKeeperProSync());
        //等待zk连接成功的通知
        connectedSemaphore.await();
        //获取path目录节点的配置数据，并注册默认的监听器
        System.out.println(new String(zk.getData(path, true, stat)));

        Thread.sleep(Integer.MAX_VALUE);
    }

    public void process(WatchedEvent event) {
        if (KeeperState.SyncConnected == event.getState()) {  //zk连接成功通知事件
            if (EventType.None == event.getType() && null == event.getPath()) {
                connectedSemaphore.countDown();
            } else if (event.getType() == EventType.NodeDataChanged) {  //zk目录节点数据变化通知事件
                try {
                    System.out.println("配置已修改，新值为：" + new String(zk.getData(event.getPath(), true, stat)));
                } catch (Exception e) {
                }
            }
        }
    }
}
```

两个程序启动后都正确的读取到了 zookeeper 的/username 目录节点下的数据'qingfeng'
3、我们在 zookeeper 里修改下目录节点/username 下的数据
![img](https://img-blog.csdn.net/20180712144020208?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2phdmFfNjY2NjY=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)
修改完成后，我们看见两个程序后台都及时收到了他们监听的目录节点数据变更后的值，如下所示
![img](https://img-blog.csdn.net/20180712144042598?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2phdmFfNjY2NjY=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

### Zookeeper 伪集群模式

即一台机器上启动三个 zookeeper 实例组成集群，真正的集群模式无非就是实例 IP 地址不同，搭建方法没有区别

**Step7**：检测集群状态，也可以直接用命令"zkCli.sh -server IP:PORT"连接 zookeeper 服务端检测
![img](https://img-blog.csdn.net/20180712144336907?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2phdmFfNjY2NjY=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)
至此，我们对 zookeeper 就算有了一个入门的了解，当然 zookeeper 远比我们这里描述的功能多，比如用 zookeeper 实现集群管理，分布式锁，分布式队列，zookeeper 集群 leader 选举等等
推荐阅读：https://www.roncoo.com/course/view/255bac222b1b4300b42838b58fea3a2e
文章来源：https://my.oschina.net/u/3796575/blog/1845035
