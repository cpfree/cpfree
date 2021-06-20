# Elasticsearch-install

> 参考URL
> <https://www.chendalei.com/articles/2020/07/22/1595348982713.html>



简单安装与配置
 2020-07-26   |    0 评论   |    494 浏览
官网下载安装包到本地，解压缩，略。

文件目录结构
.
├── bin
├── config
├── data
├── jdk.app
├── lib
├── logs
├── modules
└── plugins

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

