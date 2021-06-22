---
keys: elasticsearch
type:
url: <https://blog.csdn.net/m0_37617778/article/details/102486207>
---

## 倒排索引

倒排索引: 以一些关键字来建立索引, 来找到内容, 通过索引和索引矩阵来减少数据空间, 

Lucene: 可以方便的建立倒排索引，但必须要懂一点搜索引擎原理的人才能用的好.

Elasticsearch: 基于 Lucene 进行封装, 把操作都封装成了 HTTP 的 API，通过 API 操作索引

Elasticsearch 分布式原理

Elasticsearch 也是会对数据进行切分，同时每一个分片会保存多个副本，其原因和 HDFS 是一样的，都是为了保证分布式环境下的高可用。
在 Elasticsearch 中，节点是对等的，节点间会通过自己的一些规则选取集群的 Master，Master 会负责集群状态信息的改变，并同步给其他节点。
注意，只有建立索引和类型需要经过 Master，数据的写入有一个简单的 Routing 规则，可以 Route 到集群中的任意节点，所以数据写入压力是分散在整个集群的。

ELK 系统

很多公司都用 Elasticsearch 搭建 ELK 系统，也就是日志分析系统。其中 E 就是 Elasticsearch，L 是 Logstash，是一个日志收集系统，K 是 Kibana，是一个数据可视化平台。
分析日志的用处可大了，你想，假如一个分布式系统有 1000 台机器，系统出现故障时，我要看下日志，还得一台一台登录上去查看，是不是非常麻烦？
但是如果日志接入了 ELK 系统就不一样。比如系统运行过程中，突然出现了异常，在日志中就能及时反馈，日志进入 ELK 系统中，我们直接在 Kibana 就能看到日志情况。如果再接入一些实时计算模块，还能做实时报警功能。

总结

反向索引又叫倒排索引，是根据文章内容中的关键字建立索引。
搜索引擎原理就是建立反向索引。
Elasticsearch 在 Lucene 的基础上进行封装，实现了分布式搜索引擎。
Elasticsearch 中的索引、类型和文档的概念比较重要，类似于 MySQL 中的数据库、表和行。
Elasticsearch 也是 Master-slave 架构，也实现了数据的分片和备份。
Elasticsearch 一个典型应用就是 ELK 日志分析系统。
写完，又高高兴兴背诗去了。
