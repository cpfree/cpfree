# Elasticsearch-install

> 参考URL
> <https://www.cnblogs.com/Alandre/p/11386178.html>

## 安装示例(elasticsearch-7.13.2-windows-x86_64)

### 版本须知

> ES 7.0 是 2019 年 4 月份发布的，底层是 Lucene 8.0。
> ES 7.x 不需要本地 JDK 环境支持, 内置了 JDK 12

Elasticsearch 7.2.1 目录结构如下：

文件目录结构

├── bin ：脚本文件，包括 ES 启动 & 安装插件等等
├── config ： elasticsearch.yml（ES 配置文件）、jvm.options（JVM 配置文件）、日志配置文件等等
├── JDK ： 内置的 JDK，JAVA_VERSION="12.0.1"
├── lib ： 类库
├── logs ： 日志文件
├── modules ： ES 所有模块，包括 X-pack 等
├── plugins ： ES 已经安装的插件。默认没有插件
└── data ： ES 启动的时候，会有该目录，用来存储文档数据。该目录可以设置

### 内存配置

具体看看关键的 jvm.options JVM 配置文件，默认配置如下：

    ```conf
    -Xms1g
    -Xmx1g
    ```

ES 默认安装后设置的堆内存是 1 GB，对于任何业务来说这个设置肯定是少了。那设置多少？

推荐：如果足够的内存，也尽量不要 超过 32 GB。即每个节点内存分配不超过 32 GB。 因为它浪费了内存，降低了 CPU 的性能，还要让 GC 应对大内存。如果你想保证其安全可靠，设置堆内存为 31 GB 是一个安全的选择。

上述推荐，理由来自《堆内存:大小和交换编辑》：https://www.elastic.co/guide/cn/elasticsearch/guide/current/heap-sizing.html

### 启动 Elasticsearch 7.x

在 ES 根目录下面，执行启动脚本文件：

    ```shell
    cd elasticsearch-7.x.x
    bin/elasticsearch
    ```

运行完后，会出现下面的日志：

future versions of Elasticsearch will require Java 11; your Java version from [/Library/Java/JavaVirtualMachines/jdk1.8.0_152.jdk/Contents/Home/jre] does not meet this requirement

... 省略

[2019-08-16T16:29:53,069][INFO ][o.e.n.Node               ] [BYSocketdeMacBook-Pro-2.local] started
[2019-08-16T16:29:53,478][INFO ][o.e.l.LicenseService     ] [BYSocketdeMacBook-Pro-2.local] license [ef60f54d-4964-4cb6-98ac-aafdc0f2a4c0] mode [basic] - valid
[2019-08-16T16:29:53,491][INFO ][o.e.g.GatewayService     ] [BYSocketdeMacBook-Pro-2.local] recovered [0] indices into cluster_state
[2019-08-16T16:30:23,057][INFO ][o.e.c.r.a.DiskThresholdMonitor] [BYSocketdeMacBook-Pro-2.local] low disk watermark [85%] exceeded on [DRs4DZO0SzCaYz3n3vA3Fg][BYSocketdeMacBook-Pro-2.local][/javaee/es/elasticsearch-7.2.1/data/nodes/0] free: 49.2gb[10.6%], replicas will not be assigned to this node
日志中有两个信息需要注意：

本机环境是 JDK 8 ，它会提醒后面版本需要 JDK 11 支持。但它是向下兼容的
表示本机 ES 启动成功 [BYSocketdeMacBook-Pro-2.local] started
### 验证是否启动成功

file

打开浏览器，输入 http://localhost:9200/ 地址，然后可以得到下面的信息：

```json
{
    "name": "BYSocketdeMacBook-Pro-2.local",
    "cluster_name": "elasticsearch",
    "cluster_uuid": "tc9h17oqSHKvGJb3qK2tPg",
    "version": {
        "number": "7.2.1",
        "build_flavor": "default",
        "build_type": "tar",
        "build_hash": "fe6cb20",
        "build_date": "2019-07-24T17:58:29.979462Z",
        "build_snapshot": false,
        "lucene_version": "8.0.0",
        "minimum_wire_compatibility_version": "6.8.0",
        "minimum_index_compatibility_version": "6.0.0-beta1"
    },
    "tagline": "You Know, for Search"
}
```

重点几个关注下即可：

> name ： 默认启动的时候指定了 ES 实例名称，name 为 BYSocketdeMacBook-Pro-2.local
> cluster_name ： 默认名为 elasticsearch
> version ：版本信息
> 同样通过 http://localhost:9200/_cat/nodes?v 地址，可以看到当前节点信息，如下：

127.0.0.1 30 100 22 2.87   mdi * BYSocketdeMacBook-Pro-2.local

### 单机集群多个 ES 实例安装
单机多个 ES 实例，形成一个 ES 单机伪集群，启动脚本如下：

bin/elasticsearch -E node.name=node01 -E cluster.name=bysocket_es_cluster -E path.data=node01_data -d

bin/elasticsearch -E node.name=node02 -E cluster.name=bysocket_es_cluster -E path.data=node02_data -d

bin/elasticsearch -E node.name=node03 -E cluster.name=bysocket_es_cluster -E path.data=node03_data -d

bin/elasticsearch -E node.name=node04 -E cluster.name=bysocket_es_cluster -E path.data=node04_data -d
命令简单解释如下：

node.name ： ES 节点名称，即实例名
cluster.name ： ES 集群名称
path.data ： 指定了存储文档数据目录
执行完脚本后，需要等一会 ES 启动，也可以查看 logs 看看执行情况。

file

打开浏览器，输入 http://localhost:9200/_cat/nodes?v 地址，可以看到启动情况：node01 为当前 master 节点

如何关闭集群中的 ES 实例，可以使用简单的命令实现：

ps | grep elasticsearch
kill -9 pid
三、Elasticsearch 7.x 插件概述
插件是用来增强 Elasticsearch 功能的方法，分为 核心插件（官方） & 社区插件。

安装 analysis-icu ICU 分析插件，命令如下：

sudo bin/elasticsearch-plugin install analysis-icu
查看已安装的插件，命令如下：

bin/elasticsearch-plugin list 
删除已安装的插件，命令如下：

sudo bin/elasticsearch-plugin remove analysis-icu
四、小结
本文介绍了两种安装以及插件安装，因为方便学习集群相关的知识点。另外注意 JVM 配置相关的优化即可。后续继续 Elasticsearch 7.x 操作学习 ~

（完）原创不易，帮转 ~

资料：




简单安装与配置
 2020-07-26   |    0 评论   |    494 浏览
官网下载安装包到本地，解压缩，略。


bin:脚本文件，包括启动elasticsearch ,安装插件。运行统计数据等。
config: 配置文件 elasticsearch.yml 集群配置文件，user,role base 相关配置
JDK： Java运行环境
data：path.data 数据文件 （可以定义data路径）
lib: Java类库
logs: path.log 日志文件
modules:包含所有ES模块
plugins:包含所有已安装插件

JVM 配置
位于 config/jvm.options
配置建议:
Xmx 和 Xms 的值一致；
Xmx 不要超过集群内存的50%
不要超过30GB （https://www.elastic.co/blog/a-heap-of-trouble ）

启动
安装目录 执行 bin/elasticsearch
浏览器访问 localhost:9200
看到类似如下信息，启动成功

{
  "name" : "chxxxMac.local",
  "cluster_name" : "elasticsearch",
  "cluster_uuid" : "tINdUYmUQUOYQ7-_UIiEwA",
  "version" : {
    "number" : "7.8.0",
    "build_flavor" : "default",
    "build_type" : "tar",
    "build_hash" : "757314695644ea9a1dc2fecd26d1a43856725e65",
    "build_date" : "2020-06-14T19:35:50.234439Z",
    "build_snapshot" : false,
    "lucene_version" : "8.5.1",
    "minimum_wire_compatibility_version" : "6.8.0",
    "minimum_index_compatibility_version" : "6.0.0-beta1"
  },
  "tagline" : "You Know, for Search"
}

安装插件
查看插件命令: bin/elasticsearch-plugin list
安装插件：bin/elasticsearch-plugin install pluginname
如：
bin/elasticsearch-plugin install analysis-icu 安装国际化分词插件

~/elasticsearch-7.8.0 » bin/elasticsearch-plugin install analysis-icu                        
-> Installing analysis-icu
-> Downloading analysis-icu from elastic
[=================================================] 100%
-> Installed analysis-icu
查看已经安装插件：

~/elasticsearch-7.8.0 » bin/elasticsearch-plugin list                                        
analysis-icu
启动elasticsearch,浏览器访问http://localhost:9200/_cat/plugins
可以看到返回已安装的插件列表：
chxxxMac.local analysis-icu 7.8.0

单机多实例运行
本地开发通常在单台开发机器上运行多个Elasticsearch实例：

bin/elasticsearch -E node.name=node1 -E cluster.name=bookstore -E path.data=node1_data -d
bin/elasticsearch -E node.name=node2 -E cluster.name=bookstore -E path.data=node2_data -d
bin/elasticsearch -E node.name=node3 -E cluster.name=bookstore -E path.data=node3_data -d

node.name 节点名称 不同
cluster.name 集群名称 相同
path.data 数据保存路径
-d 表示后台运行
查看运行集群
浏览器输入：http://localhost:9200/_cat/nodes

127.0.0.1 15 100 59 4.71   dilmrt * node1
127.0.0.1 28 100 51 4.71   dilmrt - node3
127.0.0.1 27 100 54 4.71   dilmrt - node2
删除进程
ps | grep elasticsearch
kill pid

