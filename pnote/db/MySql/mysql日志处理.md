---
keys: 
type: copy,blog,trim
url: <>
id: 210515-173509
---

# mysql 日志处理

## 1. 日志配置

## 1.1 MySQL会话级别禁止产生binlog的参数

sql_log_bin

SET sql_log_bin = {0|1}

官网相关地址: <https://dev.mysql.com/doc/refman/8.0/en/set-sql-log-bin.html>

## 1.2 关闭mysql日志

1. 登录 mysql, 打入命令 RESET MASTER（把之前生成的bin-log日志文件全部重置，释放控件）。

2. 进入mysql的配置文件 cd /etc/my.cnf  注释掉2行：

   ```conf
   #log-bin=mysql-bin
   #binlog_format=mixed
   ```

3. 重启mysql   ， service mysql restart就OK了

## 1.3 查看 Mysql 日志

1. SQL查询: 查看 Mysql 二进制日志是否开启, 看`log_bin`是否为 `ON`

   `show variables like '%log_bin%'`

2. SQL查询: 查看 MYSQL 二进制日志文件位置

   `show BINARY LOGS`

3. linux: 找到日志文件位置以及日志处理工具位置.

   查找二进制日志处理工具
   `find / -name mysqlbinlog`

4. 使用`mysqlbinlog` 转换二进制文件至文本文件.

   如果找到的日志文件位置 `/var/lib/mysql/log.000015`,  `mysqlbinlog` 在 `/usr/local/mysqlbinlog`, 则linux命令

   `> /usr/local/mysqlbinlog /var/lib/mysql/log.000015 -v --result-file=./log.txt`
   > 查看二进制文件还有其他的语句, 并不一定需要转换成文本文件.

### 1.4 配置自动删除

永久生效：修改mysql的配置文件my.cnf，添加binlog过期时间的配置项：expire_logs_days=30，然后重启mysql，这个有个致命的缺点就是需要重启mysql。

临时生效：进入mysql，用以下命令设置全局的参数：set global expire_logs_days=30;

（上面的数字30是保留30天的意思。）

## 2. 删除log日志方法

### 2.1 标准的做法应该是在MySQL下命令清理：

   - 登录mysql 执行 reset 命令

      ```shell
      /usr/local/mysql/bin/mysql -u root -p
      reset master;
      ```

   - 使用远程root用户连接

      ```sql
      reset master
      ```

   > reset master 删除需要多长时间

### 2.2 直接删除日志

1. 找出日志文件
   - `mysql> show binary logs;` 可以显示日志文件
   - 通过`du -sh *` 命令可以一步步查询出文件大小占比, 找到占用较大内存的目录.
2. 在mysql日志文件夹通过 `ls -lst` 按时间倒序排出文件, 直接使用 `rm` 命令删除掉旧的log日志文件.
3. 最后务必再使用`purge`命令清除日志.

### 2.3 binlog目录满导致mysql hang住处理

> 参考自: <https://blog.csdn.net/weixin_42942173/article/details/103643395>

此时mysql hang住执行命令, 连清理日志的操作都无法执行, 执行命令一直呈现挂起(执行中)状态

此时需要先手动清出一定的空间, 然后再执行上面删除日志的命令

> 1. 优先使用mysql purge清理日志，因为通过purge清理了binlog日志文件同时也更新了binlog索引文件mysql-bin.index.
> 2. 用系统命令清理binlog但不会更新mysql-bin.index.
> 3. 如果遇到磁盘满了, 导致mysql无法执行`purge`命令, 可以先删除掉部分磁盘空间, 最后务必再使用`purge`命令清除日志，清除的范围包括使用系统命令移除的日志。

## 命令

### purge

> purge会更新mysql-bin.index中的条目，而直接删除mysql日志文件的话，mysql-bin.index文件不会更新。mysql-bin.index的作用是加快查找binlog文件的速度。

purge的用法：`help purge`

删除举例：

RESET MASTER; -- 删除所有binlog日志，新日志编号从头开始

PURGE MASTER LOGS TO 'mysql-bin.010';  --  删除 mysql-bin.010 之前的所有日志

PURGE MASTER LOGS BEFORE '2020-04-14 22:46:26'; --  删除2020-04-14 22:46:26之前产生的所有日志

PURGE MASTER LOGS BEFORE DATE_SUB( NOW( ), INTERVAL 3 DAY); -- 清除3天前的 binlog

### reset master

> 参考自: <https://www.dazhuanlan.com/youmin/topics/1746957>

删除 index file 中记录的所有 binlog 文件，将日志索引文件清空，创建一个新的日志文件，这个命令通常用于第一次搭建主从关系的主库。

1. reset master 和 purge binary log 的区别
   - reset master 删除日志索引文件中记录的所有 binlog 文件，重新建立一个新的日志文件，起始值从 000001 开始，purge binary log 命令不会修改记录 binlog 顺序的数值
   - reset master 不能用于有任何 slave 正在运行的主从关系的主库。因为在 slave 运行时刻 reset master 命令不被支持。从库此时会报错。
   - In MySQL 5.6.5 and later, RESET MASTER also clears the values of the gtid_purged system variable (known as gtid_lost in MySQL 5.6.8 and earlier) as well as the global value of the gtid_executed (gtid_done, prior to MySQL 5.6.9) system variable (but not its session value); that is, executing this statement sets each of these values to an empty string ('')

### reset slave

reset slave 将使 slave 忘记主从复制关系的位置信息。该语句用于干净的启动，它删除 master.info 文件和 relay-log.info 文件以及所有的 relay log 文件并重新启用一个新的 relay-log 文件。

### reset slave all

在 5.6 版本中 reset slave 并不会清理存储于内存中的复制信息比如 master host, master port, master user, or master password,也就是说如果没有使用 change master 命令做重新定向，执行 start slave 还是会指向旧的 master 上面。

当从库执行 reset slave 之后,将 mysqld shutdown 复制参数将被重置。

在 5.6.3 版本以及以后 使用使用 RESET SLAVE ALL 来完全的清理复制连接参数信息。(Bug #11809016)

RESET SLAVE ALL does not clear the IGNORE_SERVER_IDS list set by CHANGE MASTER TO. This issue is fixed in MySQL 5.7. (Bug #18816897)

In MySQL 5.6.7 and later, RESET SLAVE causes an implicit commit of an ongoing transaction. See Section 13.3.3, “Statements That Cause an Implicit Commit”.
