# 问题场景

## 从另外一个系统**实时**获取大量数据, 并插入到数据库中, 实时数据量很大(每秒可能有1500条数据)

初始解决方案

   数据库是`innodb`引擎
   采用异步处理的方式, 实时获取到数据后, 把数据放到一个10000的缓存队列中, 另起一个线程将数据一条一条**映射转换**后**插入到数据库**中.
   但是由于数据量非常大, 10000的缓存队列很快就被沾满, 即使再调大缓存队列依然会面临着缓存队列中数据不断堆积的问题.

   分析原因: 映射转换处理耗时较少, 单条插入到数据库耗时较大

   之后数据库改为Myisam引擎, 批量插入数据, 但是后来测试后发现Myisam引擎对批量插入不友好.

最终解决方案

   采用双重异步处理的方式, 实时获取到数据后, 把数据放到一个10000的缓存队列中.
   第二个线程负责从缓存队列中一个个处理数据, 映射数据, 封装成实体后, 将实体送到第二个缓存队列中
   > 第二个缓存队列是自定义的缓存, 可以支持从缓存队列中同时获取多条数据, 例如可以一次性从缓存队列中获取500条数据, 如果缓存队列中没有500条数据, 那么就获取当前缓存队列中所有数据.
   第三个线程另起一个线程将第二个缓存队列中的数据批量获取, 并批量存入到数据库中.

   最终测试结果, 这种方式可以长时间支撑住每秒 6000条/s-10000条/s 级别的实时数据

## 使用 Mybatis 用 delete 删除大量的表数据, 会产生大量的 log 日志, 而且在 innodb 的引擎下, 数据实际上也没有真正删除掉

初始解决方式

   使用MyiSam引擎, 这样的话可以解决删掉数据之后, 删掉的数据依然占用着表空间的问题.
   但是这样在插入的时候非常慢, 而且没有办法批量插入, 导致运行很慢.

最终解决方案1

   同时执行多个SQL, 在删除数据之前, 会话级禁用掉二进制日志 `sql_log_bin`, 在删除掉数据之后, 重新设置表引擎的方式, 释放表空间.
   记得在JDBC连接的URL后面添加 `&allowMultiQueries=true`, 否则多条SQL同时执行可能不生效.

   ```xml
  <update id="deleteAndClearTable">
    set sql_log_bin = 0;
    <if test="(startDate != null and startDate != '') or (endDate != null and endDate != '')">
      delete from ${tableName}
    </if>
    <where>
      <if test="startDate != null and startDate != ''">
        IMP_TIME &gt;= #{startDate}
      </if>
      <if test="endDate != null and endDate != ''">
        IMP_TIME &lt; #{endDate}
      </if>
    </where>;
    set sql_log_bin = 1;
    ALTER TABLE ${tableName} ENGINE = INNODB;
    SELECT ROW_COUNT()
  </update>
   ```
