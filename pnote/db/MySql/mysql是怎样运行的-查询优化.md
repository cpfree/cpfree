---
keys:
type: trim
url: <>
id: 220215-171246
---

# 查询优化

> 参考书籍: <mysql是怎样运行的>

## 单表访问方法

| 类型        | 描述                                                                                                       |
| ----------- | ---------------------------------------------------------------------------------------------------------- |
| const       | 通过主键定位一条记录                                                                                       |
| ref         | 通过普通的二级索引列与参数进行等值比较.                                                                    |
| ref_or_null | 普通的二级索引等值比较, 同时把 null 数据找出来.                                                            |
| range       | 通过索引查询最终形成了扫描居间.                                                                            |
| index       | 联合索引中没有使用最左边的列进行查询, 使用了第二个列, 虽然是全表范围扫描, 但是在二级范围里面确实用到了索引 |
| all         | 全表扫描, 不解释.                                                                                          |

### 单表单索引列索引合并

1. Intersection 索引合并
2. Union 索引合并
3. Sort-Union 索引合并

> mysql 没有 Sort-Intersection 索引合并, 但是 MariaDb 里面实现了交集排序索引合并.

mysql 支持 交集索引合并, 并集索引合并, 以及排序并集索引合并

## 连接原理

驱动表: join 连接确定的第一个查询的表
被驱动表: 从驱动表里面查询出数据后, 用查询出的数据, 都要到被驱动表里面去查询数据.

> 两表 join 连接, 驱动表只需要访问一次, 但是被驱动表需要访问多次.

### 内外链接

`WHERE` 过滤条件: 方式不匹配的都不会添加到结果中.

`ON` 过滤条件

1. 内连接中, `ON` 和 `WHERE` 过滤条件等同.
2. 外连接中, `ON`: 即便驱动表里面的数据被`ON`过滤掉了, 但是结果还是需要添加匹配不到的驱动表数据, 另外一张表的数据填充为 NULL
   - > 内连接中 `ON` 和 `WHERE` 是等价的, 因此在内连接中, JOIN 后面即便不使用 `ON`, 将原来`ON`里面条件移动到 WHERE 里面依然是可以查询出来的, 并且查询结果甚至 EXPLAIN 都和原来使用 ON 的时候一样, 但是为了 SQL 的可读性最好用一下.

### 嵌套循环连接

1. 之后从多个表中找寻两张表, 进行两张表连接, 得出临时表结果
2. 之后临时表和剩下的表再去判断谁是驱动表, 之后再连接, 重复该步骤, 知道最终查询出结果.

### 基于块的循环嵌套结构

假如说驱动表和被驱动表都很大, 数据量很多, 查询一次不容易

则可以:

1. 对驱动表做一次查询, 一次查询出驱动表里面的数据结果集.
2. 以块的形式 IO 出部分被驱动表, 之后每一条被驱动表里面的数据同时和多条驱动表里面的数据进行匹配.
   > 相当于对被驱动表进行一次全表扫描, 之后每一条记录和第一次查询出的驱动表里面的结果集进行比对.
3. 继续以块的形式读取, 重复 2 的步骤, 直到被驱动表 IO 一次.

## 查询优化-基于成本的优化.

1. IO 成本
2. CPU 成本

成本常数

读取一个页面的成本是 `1.0`, 检测一条记录是否符合条件的成本是`0.2`

单表优化步骤

1.  根据搜索条件, 找出所有可能用到的索引
2.  计算全表扫描的代价
3.  计算使用不同搜索引擎指定查询的代价
4.  对比代价, 选出一个查询方案.

连接优化

1.  选择最优的表连接顺序
2.  为驱动表和被驱动表选择最优的访问方法.

## 查询优化-基于规则的优化.

1. 条件化简

   1. 移除不必要的括号
   2. 常量传递
      `a = 5 and b > a` 转换为 `a = 5 and b > 5`
   3. 移除没用的条件
   4. 表达式计算: 如果表达式只包含常量, 则直接计算出来.
   5. having 子句和 where 子句的合并
      如果查询语句中没有出现如 `SUM`, `MAX` 以及`GROUP BY`子句, 查询优化器就将 having 子句和 where 子句合并起来.
   6. 常量表检测
      - 查询的表里面只有一条记录, 或者一条记录都没有.
      - 使用主键查询到语句
        > 这些查询很快, 可以忽略不记, 因此被称为常量表.

2. 外连接消除
3. 子查询优化

## EXPLAIN

#### EXPLAIN 示例

![Mysql执行计划示例图](https://gitee.com/cpfree/picture-warehouse/raw/master/pic/20210616094301.png)

```shell
           id: 1
  select_type: SIMPLE
        table: student
   partitions: NULL
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 62
     filtered: 100.00
        Extra: NULL
```

### 执行计划属性

#### select_type

查询的类型，主要是用于区分普通查询、联合查询、子查询等

| select Type  | means                                               |
| ------------ | --------------------------------------------------- |
| SIMPLE       | 简单的 select 查询，查询中不包含子查询或者 union    |
| PRIMARY      | 查询中包含子部分，最外层查询则被标记为 primary      |
| SUBQUERY     | SUBQUERY 表示在 select 或 where 列表中包含了子查询  |
| MATERIALIZED | 表示 where 后面 in 条件的子查询                     |
| UNION        | 若第二个 select 出现在 union 之后，则被标记为 union |
| UNION RESULT | 从 union 表获取结果的 select                        |

#### type

访问类型，sql 查询优化中一个很重要的指标，结果值从好到坏依次是：
`system > const > eq_ref > ref > range > index > ALL`

| type            | means                                                                                                                       |
| --------------- | --------------------------------------------------------------------------------------------------------------------------- |
| system          | 表中只有一条记录并且该表使用的存储引擎的统计数据是精确的                                                                    |
| const           | 根据主键或者唯一二级索引与常数进行等值匹配                                                                                  |
| eq_ref          | 执行连接查询时, 如果被驱动表是通过`主键`或者`不允许存储为 NULL 值的唯一二级索引列`以`等值匹配`的方式进行访问时.             |
| ref             | 当通过普通的二级索引列与常量进行等值匹配的方式查询某个表时.                                                                 |
| range           | 索引获取某些单点扫描居间的记录                                                                                              |
| index           | 当可以使用索引覆盖, 但是需要扫描全部的索引记录的时候.                                                                       |
| ALL             | 全表扫描.                                                                                                                   |
| fulltext        | 全文索引                                                                                                                    |
| ref_or_null     | 普通的二级索引等值比较, 同时把 null 数据找出来.                                                                             |
| index_merge     | 一般情况下会为单个索引生成扫描居间, 但是某些场景下使用 intersection, union, Sort-Union 合并索引时.                          |
| unique_subquery | 针对 IN 子查询, 决定将 IN 转换为 EXISTS 语句, 是的最后由`不允许存储为 NULL 值的唯一二级索引列`以`等值匹配`的方式进行访问时. |
| index_subquery  | 与 unique_subquery 类似, 只不过, 最后不是唯一二级索引列, 而是普通索引.                                                      |

1. const 示例

   ```sql
   SELECT * FROM tbl_name WHERE primary_key=1;

   SELECT * FROM tbl_name WHERE primary_key_part1=1 AND primary_key_part2=2;
   ```

2. eq_ref 示例
   读取本表中和关联表表中的每行组合成的一行。除 了 system 和 const 类型之外, 这是最好的联接类型。当连接使用索引的所有部分时, 索引是主键或唯一非 NULL 索引时, 将使用该值。
   eq_ref 可用于使用 = 运算符比较的索引列。比较值可以是常量或使用此表之前读取的表中的列的表达式。在下面的示例中, MySQL 可以使用 eq_ref 连接(join)ref_table 来处理:

   ```sql
   SELECT * FROM ref_table,other_table WHERE ref_table.key_column=other_table.column;

   SELECT * FROM ref_table,other_table WHERE ref_table.key_column_part1=other_table.column AND ref_table.key_column_part2=1;
   ```

3. ref
   对于每个来自于前面的表的行组合，所有有匹配索引值的行将从这张表中读取。如果联接只使用键的最左边的前缀，或如果键不是 UNIQUE 或 PRIMARY KEY（换句话说，如果联接不能基于关键字选择单个行的话），则使用 ref。如果使用的键仅仅匹配少量行，该联接类型是不错的。

4. ref_or_null
   该联接类型如同 ref，但是添加了 MySQL 可以专门搜索包含 NULL 值的行。在解决子查询中经常使用该联接类型的优化。

#### TYPE

#### Id

select 查询的序列号，标识执行的顺序

1.  id 相同，执行顺序由上至下
2.  id 不同，如果是子查询，id 的序号会递增，id 值越大优先级越高，越先被执行
3.  id 相同又不同即两种情况同时存在，id 如果相同，可以认为是一组，从上往下顺序执行；在所有组中，id 值越大，优先级越高，越先执行

#### table

查询涉及到的表

1.  直接显示表名或者表的别名
2.  \<unionM,N\> : 由 ID 为 M,N 查询 union 产生的结果
3.  \<subqueryN\> : 由 ID 为 N 查询生产的结果

#### possible_keys

查询过程中有可能用到的索引

#### key

实际使用的索引，如果为 NULL，则没有使用索引 rows, 根据表统计信息或者索引选用情况，大致估算出找到所需的记录所需要读取的行数

#### filtered

它指返回结果的行占需要读到的行(rows 列的值)的百分比, 表示返回结果的行数占需读取行数的百分比，filtered 的值越大越好

十分重要的额外信息

1. Using filesort ：
   mysql 对数据使用一个外部的文件内容进行了排序，而不是按照表内的索引进行排序读取
2. Using temporary：
   使用临时表保存中间结果，也就是说 mysql 在对查询结果排序时使用了临时表，常见于 order by 或 group by
3. Using index：
   表示相应的 select 操作中使用了覆盖索引（Covering Index），避免了访问表的数据行，效率高
4. Using where ：
   使用了 where 过滤条件
5. select tables optimized away：
   基于索引优化 MIN/MAX 操作或者 MyISAM 存储引擎优化 COUNT(\*)操作，不必等到执行阶段在进行计算，查询执行
   计划生成的阶段即可完成优化
