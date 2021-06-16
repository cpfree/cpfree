# sql 执行脚本

## 表信息查询

### 查询占用空间过大的表

   ```sql
   SELECT
      t.TABLE_NAME,
      t.TABLE_ROWS,
      CONCAT( round(t.DATA_LENGTH /1024/1024, 0), 'M') AS size
   FROM
      information_schema. TABLES t
   WHERE
      TABLE_schema = 'xir_trd'
   ORDER BY
      t.TABLE_ROWS DESC;
   ```

   ```sql
   SELECT table_schema,TABLE_NAME, concat(round(data_length/1024/1024, 2),"M") data_free_M, concat(round(data_length/1024/1024,2),'MB') data_length_M 
   FROM information_schema.tables 
   WHERE
   -- data_free >810241024 AND
   table_name in ('fpp_a0541t109', 'fpp_a0541t124') and
   ENGINE ='innodb'  ORDER BY data_free DESC;
   ```

#### 数据空洞过大的表-mysql

Mysql 数据空洞过大，会影响SQL的执行速度.

1. 查询空洞过大的表, SQL如下：

   ```sql
   SELECT table_schema,TABLE_NAME, concat(data_free/1024/1024,"M") 
   FROM information_schema.tables 
   WHERE data_free >810241024 AND ENGINE ='innodb' ORDER BY data_free DESC;
   ```

   ```sql
   SELECT table_schema,TABLE_NAME, concat(round(data_free/1024/1024, 2),"M") data_free_M, concat(round(data_length/1024/1024,2),'MB') data_length_M 
   FROM information_schema.tables 
   WHERE
   -- data_free >810241024 AND
   table_name in ('fpp_a0541t109', 'fpp_a0541t124') and
   ENGINE ='innodb'  ORDER BY data_free DESC;
   ```

要彻底解决空洞问题需要从 update 语句入手，确定更新是否有意义， 此外通过重置存储引擎, 可以回收表空间.

   ```sql
   ALTER TABLE table_name ENGINE = Innodb; 回收表空间
   ```
