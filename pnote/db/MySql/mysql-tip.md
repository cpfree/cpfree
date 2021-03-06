# mysql

1. 客户端连接mysql后, mysql会等待客户端发送命令, mysql接收到的命令格式是一个文本消息, 之后在对这个文本消息进行解析.

2. 查询缓存

   查询缓存会将查询的请求和结果缓存起来, 但是命中率并不高, mysql8.0已经删除了查询缓存.

3. mysql 服务器处理请求的过程可以分为服务层和存储引擎层.

4. mysql 命令行选项有长形式和短形式.

   `--host` 就是长形式, `-h`就是短形式
   短形式选项时, 选项名和选项值之间可以没有空格 如 `-P3306`, `-uroot`等
   但是注意 `-p`, 小写的p代表密码, `-p` 后面加密码的话, 则参数和密码之间不能用空格.

5. mysql 目录里面有 `mysqld` 和 `mysql`, mysqld 用于启动服务器, mysql 用于启动客户端.

## mysql 系统变量

1. mysql 配置文件的优先级

   mysql 启动后会到好几个地方去搜索和加载配置文件, 最终的配置文件中, 同一个属性以最后加载到的配置文件为准.

   如果mysql启动的时候在命令行里面配置了启动参数, 则启动后, 以命令行里的启动选项为准.

2. mysql 变量分为 global, 和session

   mysql 默认变量为session级别的变量.

## mysql 字符集和比较规则

   mysql 定义了两种utf-8

   - utf-8mb3: 阉割版的utf-8, 每个字符使用 1-3 个字符
   - utf-8mb4: 正宗的utf-8, 每个字符使用 1-4 个字符

   mysql 里面设置的utf-8 指的是utf-8mb3;


## mysql 数据目录

`表名.frm` : 存放表中的结构数据.

innodb 的每个表都有两个文件, 一个 `表名.frm`, 存放表结构信息, 另一个 `表名idb`, 存放表数据和索引
myisam 的每个表有三个文件, 一个 `表名.frm`, 还有`表名.MYI` 存放索引数据, `表名.MYD` 存放数据.


## innodb 表空间

1. 页信息内, 行数据以单链表的形式连接成一个单向链表, 并且每个单向链表还按照一定大小分成了多个组.

2. 页信息之间通过双向链表从小到大进行排列成了一个双向链表, 每个页是16kb.

3. 由于一个page只有16k, 实在太小, 因此innodb引入了一个区的概念, 每64个页组成一个区, 每个区为1MB大小.

4. 区还是小, 因此每256个区形成一个组, 每个组占空间大小 `256M`


## mysql 慢日志

 可以设置一个时间，那么所有执行时间超过这个时间的SQL都会被记录下来。这样就可以通过慢日志快速的找到网站中SQL的瓶颈来进行优化。
