---
keys: 
type: copy,blog,trim
url: <>
id: 220100-100020
---

# Elasticsearch-install

> 参考URL
> <https://www.cnblogs.com/Alandre/p/11386178.html>

## 安装示例(elasticsearch-7.13.2-windows-x86_64)

### 版本须知

> ES 7.0 是 2019 年 4 月份发布的，底层是 Lucene 8.0。
> ES 7.x 不需要本地 JDK 环境支持, 内置了 JDK 12

Elasticsearch 7.13.2 目录结构如下：

文件目录结构

├── bin ：脚本文件，包括 ES 启动 & 安装插件等等
├── config ： elasticsearch.yml（ES 配置文件）、jvm.options（JVM 配置文件）、日志配置文件等等
├── jdk ： 内置的 JDK，JAVA_VERSION="12.0.1"
├── lib ： 类库
├── logs ： 日志文件
├── modules ： ES 所有模块，包括 X-pack 等
├── plugins ： ES 已经安装的插件。默认没有插件
└── data ： ES 启动的时候，会有该目录，用来存储文档数据。该目录可以设置

![文件目录结构](https://gitee.com/cpfree/picture-warehouse/raw/master/pic1/Snipaste_2021-06-21_23-58-56.png)

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

在 ES 根目录下面，执行启动脚本文件 `elasticsearch-7.x.x/bin/elasticsearch`

运行完会输出一大堆日志日志

![Elasticsearch启动日志](https://gitee.com/cpfree/picture-warehouse/raw/master/pic1/20210622232206.png)

> 红框中的日志代表已经启动成功

### 验证是否启动成功

1. 打开浏览器，输入 http://localhost:9200/ 地址，然后可以得到下面的信息：

   ```json
   {
   "name" : "LAPTOP-CPFLY",
   "cluster_name" : "elasticsearch",
   "cluster_uuid" : "vuUvxw7WRKye4UX5GKfM8g",
   "version" : {
      "number" : "7.13.2",
      "build_flavor" : "default",
      "build_type" : "zip",
      "build_hash" : "4d960a0733be83dd2543ca018aa4ddc42e956800",
      "build_date" : "2021-06-10T21:01:55.251515791Z",
      "build_snapshot" : false,
      "lucene_version" : "8.8.2",
      "minimum_wire_compatibility_version" : "6.8.0",
      "minimum_index_compatibility_version" : "6.0.0-beta1"
   },
   "tagline" : "You Know, for Search"
   }
   ```
   
   重点几个关注下即可：
   
   > name ： 默认启动的时候指定了 ES 实例名称，name 为 LAPTOP-CPFLY
   > cluster_name ： 默认名为 elasticsearch
   > version ：版本信息

2. 同样通过 http://localhost:9200/_cat/nodes?v 地址，可以看到当前节点信息，如下：

   ```info
   ip        heap.percent ram.percent cpu load_1m load_5m load_15m node.role   master name
   127.0.0.1            8          88   1                          cdfhilmrstw *      LAPTOP-CPFLY
   ```

### 单机集群多个 ES 实例安装

单机集群多个 ES 实例，形成一个 ES 单机伪集群，启动脚本如下：

   ```shell
   # 参数含义
   # node.name ： ES 节点名称，即实例名
   # cluster.name ： ES 集群名称
   # path.data ： 指定了存储文档数据目录
   # -d : 表示后台运行
   bin/elasticsearch -E node.name=node01 -E cluster.name=bysocket_es_cluster -E path.data=node01_data -d

   bin/elasticsearch -E node.name=node02 -E cluster.name=bysocket_es_cluster -E path.data=node02_data -d

   bin/elasticsearch -E node.name=node03 -E cluster.name=bysocket_es_cluster -E path.data=node03_data -d

   bin/elasticsearch -E node.name=node04 -E cluster.name=bysocket_es_cluster -E path.data=node04_data -d
   ```

查看运行集群

   浏览器打开 <http://localhost:9200/_cat/nodes?v> 地址，可以看到启动情况

   > node01 为当前 master 节点

关闭集群中的 ES 实例，可以使用简单的命令实现：

   ```shell
   ps | grep elasticsearch
   kill -9 pid
   ```

## Elasticsearch 7.x 插件概述

插件是用来增强 Elasticsearch 功能的方法，分为 核心插件（官方） & 社区插件。

   ```shell
   # 查看已安装插件命令
   > bin/elasticsearch-plugin list

   # 安装插件命令(以 analysis-icu ICU 分析插件为例)
   > sudo bin/elasticsearch-plugin install analysis-icu

   # 卸载已安装的插件(以 analysis-icu ICU 分析插件为例)
   > sudo bin/elasticsearch-plugin remove analysis-icu
   ```

> 启动elasticsearch,浏览器访问http://localhost:9200/_cat/plugins
> 可以看到返回已安装的插件列表：
> chxxxMac.local analysis-icu 7.8.0
