# 知识目标

## common

1. 了解索引相关知识.
2. 聚集索引, 覆盖索引

## mysql

1. 了解Mysql为什么使用B+树
2. 了解Mysql的两大存储引擎Myisam, innodb.

## MYSQL 重命名表

RENAME TABLE old_table_name TO new_table_name;
旧表( old_table_name)必须存在，而新表( new_table_name)一定不存在。如果新表  new_table_name 确实存在，该语句将失败。 

除了表，我们可以使用 RENAME TABLE 语句重新命名视图。

我们执行RENAME TABLE语句之前，必须确保不存在活跃事务或锁定表。请注意，不能使用 RENAME TABLE 语句重命名一个临时表，但可以使用 ALTER TABLE 语句来重命名一个临时表。从安全性角度，我们给予旧表的任何权限必须手动迁移到新表上。

重命名表之前，应彻底评估的影响。例如，应该调查哪些应用程序正在使用这个旧表。如果确实需要进行更改表的名称，那么也要更改对应引用表名的名称，以及在应用程序代码中修改表的名称。此外，还要手动调整其他数据库对象，如：视图，存储过程，触发器，外键约束等，即参照表。我们将在下面的实例中进行更详细讨论。

## MYSQL 复制表

1. 查看建表语句

   ```sql
   -- 查询表的建表语句
   show CREATE table 表名
   ```

2. 完全复制表

   `create table 新表 select * from 源表;`

3. 复制表结构到新表，但不复制数据

   `create table 新表 select * from 源表 where 1 = 2;`

4. 只复制表的数据

　　insert into 目标表 select * from 源表;
