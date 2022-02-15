# Mysql

## destination

[TOC]

## 基础

### MySql 体系结构

![Mysql 体系结构图](https://gitee.com/cpfree/picture-warehouse/raw/master/pic/20210616094230.jpg)

1. Client Connectors
   接入方 支持协议很多
2. Management Serveices & Utilities
   系统管理和控制工具，mysqldump、 mysql复制集群、分区管理等
3. Connection Pool
   连接池：管理缓冲用户连接、用户名、密码、权限校验、线程处理等需要缓存的需求
4. SQL Interface
   SQL接口：接受用户的SQL命令，并且返回用户需要查询的结果
5. Parser
   解析器，SQL命令传递到解析器的时候会被解析器验证和解析。解析器是由Lex和YACC实现的
6. Optimizer
   查询优化器，SQL语句在查询之前会使用查询优化器对查询进行优化
7. Cache和Buffer（高速缓存区）
   查询缓存，如果查询缓存有命中的查询结果，查询语句就可以直接去查询缓存中取数据
8. pluggable storage Engines
   插件式存储引擎。存储引擎是MySql中具体的与文件打交道的子系统
9. file system
   文件系统，数据、日志（redo，undo）、索引、错误日志、查询记录、慢查询等

### Mysql 存储结构B+Tree

1. 为什么选择B+Tree
   1. 平衡二叉查找树(Balanced binary search tree)
      - 太深 : 每个节点只有两个分支导致树的深度太深, 深度决定着他的IO操作次数，IO操作耗时大.
      - 太小 : 每一个磁盘块（节点/页）保存的数据量太小了, 没有很好的利用操作磁盘IO的数据交换特性，也没有利用好磁盘IO的预读能力（空间局部性原理），从而带来频繁的IO操作.
   2. 多路平衡查找树(B-Tree)
   ![Mysql 体系结构图](https://gitee.com/cpfree/picture-warehouse/raw/master/pic/20210616094239.jpg)
2. B+Tree在两大引擎中如何体现
3. 索引知识补充
4. 总结及验证

### Mysql 存储引擎

   1，插拔式的插件方式
   2，存储引擎是指定在表之上的，即一个库中的每一个表都可以指定专用的存储引擎。
   3，不管表采用什么样的存储引擎，都会在数据区，产生对应的一个frm文件（表结构定义描述文件）

## MySQL查询优化详解

### 执行过程

![Mysql查询执行路径](https://gitee.com/cpfree/picture-warehouse/raw/master/pic/20210616094246.png)

1. mysql 客户端/服务端通信
2. 查询缓存
3. 查询优化处理
4. 查询执行引擎
5. 返回客户端

### Mysql半双工通信

特点
   客户端一旦开始发送消息，另一端要接收完整个消息才能响应。
   客户端一旦开始接收数据没法停下来发送指令。

### Mysql 通信状态

![Mysql 通信状态](https://gitee.com/cpfree/picture-warehouse/raw/master/pic/20210616094252.png)

### Mysql 查询缓存

Mysql 查询缓存浪费计算资源, 有很多额外消耗, 缓存建议用外部中间件, redis等取代

当然若是以读为主的业务，数据生成之后就不常改变的业务, 可以考虑Mysql缓存

### Mysql 查询优化

查询优化处理的三个阶段：

1. 解析sql
   通过lex词法分析,yacc语法分析将sql语句解析成解析树
   https://www.ibm.com/developerworks/cn/linux/sdk/lex/
2. 预处理阶段
   根据mysql的语法的规则进一步检查解析树的合法性，如：检查数据的表
   和列是否存在，解析名字和别名的设置。还会进行权限的验证
3. 查询优化器
   优化器的主要作用就是找到最优的执行计划, Mysql的查询优化器是基于成本计算的原则。他会尝试各种执行计划。数据抽样的方式进行试验（随机的读取一个4K的数据块进行分析）

#### 查询优化器优化方式

1. 使用等价变化规则
   5 = 5 and a > 5 改写成 a > 5
   a < b and a = 5 改写成 b > 5 and a = 5
2. 基于联合索引，调整条件位置等
3. 优化count 、min、max等函数
   min函数只需找索引最左边
   max函数只需找索引最右边
   myisam引擎count(*)
4. 覆盖索引扫描
5. 子查询优化
6. 提前终止查询
   用了limit关键字或者使用不存在的条件
7. IN的优化
   先进性排序，再采用二分查找的方式
