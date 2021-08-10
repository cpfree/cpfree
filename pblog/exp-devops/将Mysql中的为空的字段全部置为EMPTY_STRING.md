# MYSQL 消灭所有NULL columns

## 来自于MYSQL官方的解释

> NULL columns require additional space in the row to record whether their values are NULL. For MyISAM tables, each NULL columntakes one bit extra, rounded up to the nearest byte.

翻译：Mysql难以优化引用可空列查询，它会使索引、索引统计和值更加复杂。可空列需要更多的存储空间，还需要mysql内部进行特殊处理。可空列被索引后，每条记录都需要一个额外的字节，还能导致MYisam 中固定大小的索引变成可变大小的索引。

不用null的理由：
（1）所有使用NULL值的情况，都可以通过一个有意义的值的表示，这样有利于代码的可读性和可维护性，并能从约束上增强业务数据的规范性。

（2）NULL值到非NULL的更新无法做到原地更新，更容易发生索引分裂，从而影响性能。

注意：但把NULL列改为NOT NULL带来的性能提示很小，除非确定它带来了问题，否则不要把它当成优先的优化措施，最重要的是使用的列的类型的适当性。

（3）NULL值在timestamp类型下容易出问题，特别是没有启用参数 explicit_defaults_for_timestamp

（4）NOT IN、!= 等负向条件查询是无法命中null值的（必须用is null 或 is not null 才能命中），查询容易出错。

Null 列需要更多的存储空间

## 将所有表所有字段中数据为空的数据置为""的 SQL 语句

```sql
-- 生成 将所有表所有字段中数据为空的数据置为""的 SQL语句
SELECT
   -- c.table_schema, c.TABLE_NAME, t.TABLE_TYPE, c.column_name, c.data_type, c.column_type, c.IS_NULLABLE,
   concat( 'update `', c.table_schema, '`.`', c.table_name, '` set `', c.column_name, '` = \'\' where `', c.column_name, '` is null;' )
FROM
   information_schema.COLUMNS c JOIN information_schema.TABLES t on t.TABLE_SCHEMA = c.TABLE_SCHEMA and t.TABLE_NAME = c.TABLE_NAME
WHERE
  t.TABLE_TYPE = 'BASE TABLE' and c.table_schema = 'interest' and c.data_type in ('char', 'varchar');
```

## 将所有表所有字段设置为`NOT NULL DEFAULT ''`

```sql
-- 生成 将所有表所有字段中数据为空的数据置为NOT NULL DEFAULT ''的 SQL语句
SELECT
   -- c.table_schema, c.TABLE_NAME, t.TABLE_TYPE, c.column_name, c.data_type, c.column_type, c.IS_NULLABLE,
   concat( 'ALTER TABLE `', c.table_schema, '`.`', c.table_name, '` MODIFY COLUMN `', c.column_name, '` ', c.column_type, ' NOT NULL DEFAULT \'\';' )
FROM
   information_schema.COLUMNS c JOIN information_schema.TABLES t on t.TABLE_SCHEMA = c.TABLE_SCHEMA and t.TABLE_NAME = c.TABLE_NAME
WHERE
   t.TABLE_TYPE = 'BASE TABLE' and c.table_schema = 'interest' and c.data_type in ('char', 'varchar') and c.IS_NULLABLE = 'YES';
```
