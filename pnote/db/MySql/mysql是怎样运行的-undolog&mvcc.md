---
keys: 
type: trim
url: <>
id: 220215-171678
---

## undo log

> 参考书籍: 
> - <mysql是怎样运行的>, 
> - <https://www.cnblogs.com/xuwc/p/13873611.html>, 
> - <https://baijiahao.baidu.com/s?id=1629409989970483292&wfr=spider&for=pc>
> - [MySQL中InnoDB的多版本并发控制(MVCC)](https://www.jianshu.com/p/a3d49f7507ff)

undolog 是为了数据的回滚需求而指定的.

对于读写事务来说, 只有它第一次对某个表进行写入的时候, INNODB 存储引擎才会为其分配一个事务 ID

下面是innodb的隐藏列

| -        | -              | -      | -            | -          |
| -------- | -------------- | ------ | ------------ | ---------- |
| 记录信息 | `row_id(非必须)` | `trx_id` | `roll_pointer` | 用户列信息 |

Innodb通过undo log保存了已更改行的旧版本的信息的快照。

1. insert
   InnoDB 为新插入的每一行保存当前系统版本号作为行版本号.

2. DELETE
   InnoDB 为删除的每一行保存当前的系统版本号作为行删除标识.

3. UPDATE
   插入一行新记录, 保存当前系统版本号作为行版本号, 同时逻辑删除旧的行, 保存当前系统版本号到原来的行删除标识.

4. select

   innodb 读取数据会根据两个条件

   - innoDb 只查找版本 `TRX_ID` 早于当前事务版本的数据行: 这样可以保证查找的数据行要么是`开始之前已经存在`了，要么是`事务自身插入或修改过的`）

   - 行的删除版本号(DB_ROLL_PTR)要么未定义（未更新过），要么大于当前事务版本号（在当前事务开始之后更新的）。这样可以确保事务读取到的行，在事务开始之前未被删除。

每进行一次写操作, 都会有一个 记录添加到 undolog 日志头, 每个记录代表一个版本, 版本之间形成版本链

![](https://gitee.com/cpfree/picture-warehouse/raw/master/pic1/1644916021122.png)

### MVCC(Multi-Version Concurrency Control)

MVCC（Multi-Version Concurrency Control）即多版本并发控制。

最早的数据库系统，只有读读之间可以并发，读写，写读，写写都要阻塞。引入多版本之后，只有`写写`之间相互阻塞，其他三种操作都可以并行，这样大幅度提高了 InnoDB 的并发度。

| -     | 并发问题          | 最早的数据库系统多事务处理方式 | MVCC 多事务处理方式 |
| ----- | ----------------- | ------------------------------ | ------------------- |
| 写-写 | 脏写(严重)        | 阻塞                           | 阻塞                |
| 写-读 | 脏读              | 阻塞                           | 并行                |
| 读-写 | 不可重复读 & 幻读 | 阻塞                           | 并行                |
| 读-读 | -                 | 并行                           | 并行                |

MVCC 可以解决一下两个问题

1. 在并发读写数据库时，可以做到`写-读`, `读-写`并行操作, 提高了数据库并发读写的性能.
2. 解决脏读，幻读，不可重复读等事务隔离问题，但不能解决更新丢失问题.

缺点 : 每行记录都需要额外的存储空间，需要做更多的行维护和检查工作。

> MySQL的大多数事务型（如InnoDB,Falcon等）存储引擎实现的都不是简单的行级锁。基于提升并发性能的考虑，他们一般都同时实现了MVCC。当前不仅仅是MySQL,其它数据库系统（如Oracle, PostgreSQL）也都实现了MVCC。值得注意的是MVCC并没有一个统一的实现标准，所以不同的数据库，不同的存储引擎的实现都不尽相同。

#### MVCC 隐藏列

每行记录除了我们自定义的字段外，还有数据库隐式定义的`DB_TRX_ID`, `DB_ROLL_PTR`, `DB_ROW_ID`三个字段.

列名 | 长度(字节) | 作用
-|-|-
DB_TRX_ID | 6 | 插入或更新行的最后一个事务的事务标识符。（删除视为更新，将其标记为已删除）
DB_ROLL_PTR | 7 | 写入回滚段的撤消日志记录（若行已更新，则撤消日志记录包含在更新行之前重建行内容所需的信息）
DB_ROW_ID | 6 | 行标识（隐藏单调自增id）

MVCC增删改查操作

1. INSERT
   将 新增的数据的 DB_TRX_ID 赋值为当前事务版本号
2. DELETE
   将 删除的数据的 DB_ROLL_PTR 赋值为当前事务版本号
3. UPDATE
   同时执行上面两条, 增加新记录, 标记旧纪录.
   将新记录的 DB_TRX_ID 赋值为 当前事务版本号, 将旧纪录的数据 的 DB_ROLL_PTR 赋值为 当前事务版本号
4. SELECT
   InnoDB 会根据两个条件来检查每行记录：
   InnoDB只查找 DB_TRX_ID 早于当前事务版本的数据行, 以及 DB_ROLL_PTR 为空或大于当前事务版本的数据行

## mysql 的 innodb 引擎对 MVCC 的实现

MVCC 只在 `READ COMMITED` 和 `REPEATABLE READ` 两个隔离级别下工作。`READ UNCOMMITTED`总是读取最新的数据行，而不是符合当前事务版本的数据行。而`SERIALIZABLE` 则会对所有读取的行都加锁

### innodb 隐藏列

在 InnoDB 引擎表中，它的聚簇索引记录中有两个必要的隐藏列：

trx_id : 一个事务在写入的时候, 会获取一个事务 id, 并赋值给修改的数据的该隐藏列字段.
roll_pointer : 每次对聚簇索引进行改动时, 会把旧的版本写入到 undo 日志中, 这个隐藏列就相当于一个指针, 通过它可以找到记录上一个版本的信息

> [mysql 中的隐藏列查询方法](https://www.jb51.net/article/221656.htm)

### ReadView

ReadView 主要包含 4 个重要内容

1. m_ids: 生成 ReadView 时, 数据库`活跃的`(active 状态)读写事务的 Id 列表.
2. min_trx_id: 生成 ReadView 时, 数据库`活跃的`(active 状态)读写事务的最小事务 id, 也就是 m_ids 里面的最小 id
3. max_trx_id: 生成 ReadView 时, 系统应分配的下一次的事务 id.
4. creator_trx_id: 生成 ReadView 时的事务 id

将访问记录的 trx_id 称为 `trx_id`, 则

| 组合                                 | 描述                               | 是否可以访问                                                                                                                                 |
| ------------------------------------ | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `trx_id = creator_trx_id`            | 当前事务访问当前事务中修改过的记录 | 可以                                                                                                                                         |
| `trx_id < min_trx_id`                | 记录在当前事务开始之前已提交       | 可以                                                                                                                                         |
| `trx_id >= max_trx_id`               | 该记录在当前事务开启之后才开启     | 不可以                                                                                                                                       |
| `trx_id in [min_trx_id, max_trx_id)` | -                                  | 如果 trx_id 在`m_ids`中表示在生成 ReadView 时, 处理该记录的事务是活跃的, 不能被访问, 如果不在, 则表示处理该记录的事务已经被提交, 可以被访问. |

MVCC 只在 `READ COMMITED` 和 `REPEATABLE READ` 两个隔离级别下工作。

`READ COMMITED`情况下:

每进行一次 select 查询(读操作), 都会重新生成一个 `ReadView`

`REPEATABLE READ`情况下

第一次读的时候生成一个 ReadView，之后的读都复用之前的 ReadView。
