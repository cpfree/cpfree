# 查询是否存在-ISEXIST

根据某一条件从数据库表中查询是否存在数据, 很多程序员都是写 `SELECT count(*)`.

   ```sql
   SELECT count(*) FROM table WHERE a = 1 AND b = 2
   ```

但是推荐的写法是, 不必查找符合条件的数量, 应该**直接查询出一条符合条件的就返回**.

   ```sql
   SELECT 1 FROM table WHERE a = 1 AND b = 2 LIMIT 1
   ```
