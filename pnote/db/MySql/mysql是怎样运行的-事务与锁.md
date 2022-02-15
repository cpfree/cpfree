---
keys: 
type: trim
url: <>
id: 220215-171256
---

# 事务与锁

> 参考书籍: <mysql是怎样运行的>

## 事务

### 事务四个特性(ACID)

原子性: 要么全做, 要么全不做.
隔离性: 两个事务执行互不影响.
一致性: 数据与事实保持一致.
现实中一致性需求很多, 但是未必必须强一致性, 很多情况下弱一致性或最终一致性就可以了.
持久性: 一个状态转换后, 结果将永久保留, 数据的持久性, 简单来说就是存盘.

### MYSQL 执行事务的状态

活动的(active): 事务处于正在执行中
部分提交的(partially committed): 事务最后一个操作完成, 但是数据还在内存中, 没有持久化存盘.
提交的(committed): 整个事务执行完成并最终存盘之后.
失败的(failed): 活动状态, 或部分提交状态时发生错误.
中止的(aborted): 事务执行半截, 变成失败状态后, 进行回滚, 回滚完成后, 就可以说该事务处于终止状态.

![事务状态转换示意图](https://gitee.com/cpfree/picture-warehouse/raw/master/pic1/1644840908432.png)

### MYSQL 事务语法

1. 开启事务

   `BEGIN [WORK]`

   `START TRANSACTION`

   ```SQL
   -- 开启一个普通事务(默认读写事务)
   START TRANSACTION;
   -- 开启一个只读事务
   START TRANSACTION READ ONLY;
   -- 开启一个读写事务
   START TRANSACTION READ WRITE;
   -- 开启一个读写事务
   START TRANSACTION READ ONLY, WITH CONSTISTENT SNAPSHOT;
   -- 开启一个读写事务
   START TRANSACTION READ WRITE, WITH CONSTISTENT SNAPSHOT;
   ```

2. 提交事务

   `COMMIT [WORK]`

3. 回滚事务

   `ROLLBACK [WORK]`

### MYSQL 事务

1. mysql 里面只有 innodb 和 NDB 支持事务.

2. mysql 里面有一个系统变量, `autocommit`, 该变量默认为 `ON`, 表示自动提交事务.

   当这个变量为 `ON`, 的时候, 每执行一条写入语句就会自动提交事务.

   若是想要关闭或自动提交的功能, 可以使用以下两种方式

   1. 使用`BEGIN [WORK]`或`START TRANSACTION`手动开启事务
   2. 修改系统变量 `autocommit`为`OFF`
      `SET autocommit = off`

### 事务隐式提交

如果 `autocommit` 为 OFF, 或者开启了事务没有提交, 则以下情况下会自动提交

1. 修改或定义 DDL 数据库对象自定义语言.

2. 隐式使用或修改 `mysql` 数据库中的表
   使用 `ALERT USER`, `CREATE USER`, `GRANT`, `REVOKE`...

3. 在此使用使用`BEGIN [WORK]`或`START TRANSACTION`手动开启事务

4. 加载数据语句

   如使用 `LOAD`, `START SLAVE` 等

### 保存点

事务中可以创立保存点

`SAVEPOINT [保存点名称]`

回滚

`ROLLBACK [WORK] TO [SAVEPOINT] [保存点名称]`

## 事务隔离级别

### 事务并发一致性问题

1. 脏写

   A 事务修改了数据, 并且没有提交, B 事务写入了该数据

2. 脏读

   A 事务修改了数据, 并且没有提交, B 事务读取了该数据

3. 不可重复读

   A 事务读取了数据, A 事务没有执行完成, B 事务**修改或删除** 了该数据项并提交

   - 若 A 事务之后再次读取就会**读取到与上一次不一致的数据**.

4. 幻读

   A 事务根据搜索条件查询出了一些记录, A 事务没有执行完成, B 事务对该相关的记录进行了写入(增删改).

   - 若 A 事务再次搜索会导致**与上次搜索到的记录不一致**.

   > 注意：上面是后来 Jim Gray 等人发表了论文 [A Critique of ANSI SQL Isolation Levels](https://link.zhihu.com/?target=https%3A//www.microsoft.com/en-us/research/wp-content/uploads/2016/02/tr-95-51.pdf), 论文中重新对`不可重复读`和`幻读`进行了定义.
   >
   > 而原来 SQL 标准里面对幻读的定义只有`B事务对该相关的记录进行了插入`, 没有删除和修改, 但是产生一致性问题的各种现象描述不清晰
   >
   > - 不可重复读: 事务 T1 读取数据项。然后事务 T2 **修改或删除** 该数据项并提交。如果 T1 随后尝试重新读取数据项，它将收到修改后的值或发现该数据项已被删除.
   > - 幻读: A 事务根据搜索条件查询出了一些记录, B 事务对满足条件的数据进行了 insert 操作, 如果此时 A 事务再次读取, 那么将会读取不同的记录.
   >
   > 论文引用的 SQL 标准里面的话
   >
   > ![](https://gitee.com/cpfree/picture-warehouse/raw/master/pic1/Snipaste_2022-02-14_21-44-00.jpg)

事务并发一致性问题严重性排序

`脏写 > 脏读 > 不可重复读 > 幻读`

#### 关于幻读和不可重复读的理解

不可重复读针对的是二次读取的时候发现`行里面的数据`不一致, 幻读针对的是二次读取`搜索到的记录`不一致.

两者有部分相互交合, 但是两者解决的难度不一致.

1. 解决问题的难度不同

   解决不可重复读只需要在读取到的数据里面加入共享锁, 那么其它事务就改不了读取到的数据, 但是却阻止不了其他事务插入新数据, 也就是无法阻止幻读.

   MYSQL `可重复读的`事务里 select 会加共享锁的, 因此可以解决不可重复读的问题, 但是解决不了幻读.

#### SQL 标准里面的隔离级别

| 隔离级别           | 脏读   | 幻读   | 不可重复读 |
| ------------------ | ------ | ------ | ---------- |
| `READ UNCOMMITTED` | 可能   | 可能   | 可能       |
| `READ COMMITTED`   | 不可能 | 可能   | 可能       |
| `REPEATABLE READ`  | 不可能 | 不可能 | 可能       |
| `SERIALIZABLE`     | 不可能 | 不可能 | 不可能     |

> 脏写的情况太严重了, 无论哪种情况都不允许脏写.
