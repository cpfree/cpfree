---
keys: 
type: copy,blog,trim
url: <>
id: 220222-214115
---

# redolog & binlog

> - <https://www.cnblogs.com/wq-blogs/p/11867199.html>
> - <https://www.jianshu.com/p/4bcfffb27ed5>

## redo log

1. **redo log作用**: 

   redolog主要记录未刷盘的日志(每个页的更改的物理情况)，已经刷入磁盘的数据都会从 redo log 这个有限大小的日志文件里删除。

   有了 redo log，InnoDB 就可以保证即使数据库发生异常重启，可通过redo log将未落盘的数据恢复，之前提交的记录都不会丢失，这个能力称为 crash-safe。

2. **redo log文件结构**: 

   InnoDB 的 redo log 是固定大小的，比如可以配置为一组 4 个文件，每个文件的大小是 1GB，那么总共就可以记录 4GB 的操作。从头开始写，**写到末尾就又回到开头循环写**。

   ![](https://gitee.com/cpfree/picture-warehouse/raw/master/pic1/1645515944079.png)

   write pos 是当前记录的位置，一边写一边后移，写到第 3 号文件末尾后就回到 0 号文件开头。checkpoint 是当前要擦除的位置，也是往后推移并且循环的，擦除记录前要把记录更新到数据文件。

   write pos 和 checkpoint 之间的是log上还空着的部分，可以用来记录新的操作。如果 write pos 追上 checkpoint，表示log满了，这时候不能再执行新的更新，得停下来先擦掉一些记录，把 checkpoint 推进一下。

## bin log

1. bin log 作用
   - 历史日志, 做数据同步
   - bin log 只能用于归档

## binlog和redolog区别

   1. redo log 是 InnoDB 引擎特有的；binlog 是 MySQL 的 Server 层实现的，所有引擎都可以使用。
   2. redo log 是物理日志，记录的是“在某个数据页上做了什么修改”；binlog 是逻辑日志，记录的是这个语句的原始逻辑，比如“给 ID=2 这一行的 c 字段加 1 ”。
   3. redo log 是循环写的，空间固定会用完；binlog 是可以追加写入的。“追加写”是指 binlog 文件写到一定大小后会切换到下一个，并不会覆盖以前的日志。

## 两阶段提交

#### 为什么需要两阶段提交

redolog 在和 bin log 一起使用的时候, **需要保证binlog和redo log的数据一致性**, 不允许出现binlog有记录但redolog没有的情况，反之亦然.

   - redolog 代表mysql里面的物理数据, bin log代表逻辑数据, 两个数据需要保持一致.
   - mysql若是有主备, 则 bin log 的写入成功, 即代表着已经将日志传给了从库, 因此此时需要考虑一个**分布式数据一致性**问题. 

由于mysql运行的之后, 有宕机, IO失败等问题, 因此mysql设计了`两阶段提交`的方式来保证`binlog和redo log的数据一致性`

> 以两阶段提交协议来理解mysql的两阶段提交
>
> MySQL两阶段提交是以事务协调器（或者虚函数）作为协调者，以Binlog与InnoDB为参与者，
> 
> 根据prepare与commit顺序，依次调用Binlog层实际处理逻辑与InnoDB层实际处理逻辑。本质为让尽可能多的操作并行执行，而并行执行的这块操作放在准备阶段。
> 
> 由于数据库的日志先写原则，这意味着，**在prepare阶段会让日志先落盘，在commit阶段再进行真正的提交**，以达到更好并发的目的。
>
> <https://zhuanlan.zhihu.com/p/348828585>

#### 官方设计思路：

```log
1. Prepare Innodb:
   a) Write prepare record to Innodb's log buffer
   b) Sync log file to disk
   c) Take prepare_commit_mutex

2. "Prepare" binary log:
   a) Write transaction to binary log
   b) Sync binary log based on sync_binlog

3. Commit Innodb:
   a) Write commit record to log
   b) Release prepare_commit_mutex
   c) Sync log file to disk
   d) Innodb locks are released

4. "Commit" binary log:
   a) Nothing necessary to do here.
```

> 可以看到Redo日志有两次刷盘，一次在prepare（1-b）阶段，一个次在commit（3-c）阶段

## redo log 崩溃恢复判断规则

1. 如果 redo log 里面的事务是完整的，也就是已经有了 commit 标识，则直接提交
2. 如果 redo log 里面的事务处于 prepare 状态，则判断对应的事务 binlog 是否存在并完整
   - 如果 binlog 存在并完整，则提交事务；
   - 否则，回滚事务。

## update 语句时的内部流程：

`update table set val = val + 1 where id = 5;

![](https://gitee.com/cpfree/picture-warehouse/raw/master/pic1/1645537097434.png)

1. 执行器：找存储引擎取到 id = 5 这一行记录

2. 存储引擎：根据主键索引树找到这一行，如果 id = 5 这一行所在的数据页本来就在内存池（Buffer Pool）中，就直接返回给执行器；否则，需要先从磁盘读入内存池，然后再返回

3. 执行器：拿到存储引擎返回的行记录，把 val 字段加上 1，得到一行新的记录，然后再调用存储引擎的接口写入这行新记录

4. 存储引擎：将这行新数据更新到内存中，同时将这个更新操作记录到 redo log 里面，此时 redo log 处于 prepare 状态。然后告知执行器执行完成了，随时可以提交事务(这里的提交指的是最后一步修改 commit 状态)

   > 在此处崩溃, 恢复的时候, 则直接将事务回滚掉.
   > 因为 bin log 还没有写入, 若是有主备同步, 从数据库没有执行这个数据, 因此需要回滚事务.

5. 执行器：生成这个操作的 bin log，并把 bin log 写入磁盘

   > 在此处崩溃, 如果 binlog 存在并完整，则提交事务；
   > 因为 bin log 已经写入, 若是有主备同步, 则此时其它数据库或许已经被同步了数据, 因此不能回滚, 只能提交

6. 执行器：调用存储引擎的提交事务接口
7. 存储引擎：把刚刚写入的 redo log 状态改成提交（commit）状态，更新完成

最后三步，将 redo log 的写入拆成了两个步骤：prepare 和 commit，这就是"两阶段提交"。

#### 未提交事务是否会写 redolog

未提交事务不会写 redolog.

## binlog和redolog联系

MySQL 整体来看，其实就有两块：一块是 Server 层，它主要做的是 MySQL 功能层面的事情；还有一块是引擎层，负责存储相关的具体事宜。redo log 是 InnoDB 引擎特有的日志，而 Server 层也有自己的日志，称为 binlog（归档日志）。

1. redolog 主要记录未刷盘的日志, 在mysql宕机情况下, 数据库可以通过redolog将未落盘的数据恢复，之前提交的记录都不会丢失，这个能力称为 crash-safe。

   所谓crash-safe就是：即使在数据库宕机的情况下，也不会出现操作一半的情况

   也正因为如此, redolog只需要保存未刷盘的日志即可, 已刷盘的日志就没什么用了, 因此只要循环写入即可.

2. binlog是用于数据同步, 日志归档的.

   记录的是全部数据库操作信息, 因此需要追加写.

   binlog只需要记录占空间小的逻辑日志即可, 但是数量特别的多.

## undo log

undo用来回滚行记录到某个版本。undo log一般是逻辑日志，根据每行记录进行记录。

undo日志用于记录事务开始前的状态，用于事务失败时的回滚操作；redo日志记录事务执行后的状态，用来恢复未写入data file的已成功事务更新的数据。例如某一事务的事务序号为T1，其对数据X进行修改，设X的原值是0，修改后的值为1，那么Undo日志为<T1, X, 0>，Redo日志为<T1, X, 1>。
