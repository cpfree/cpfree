---
keys: sql,join,on,where,distinction
type:
url: <https://www.cnblogs.com/wanglu/p/4390612.html>
---

## join中

join 语句流程, 先通过where条件筛掉左右表中的数据, 之后再进行join链接, 通过on的条件去连接和筛选.

LEFT JOIN 查询，对于ON的单独表条件始终只会影响条件表的右表（如，a.value=1会影响b表关联的a表value字段值为1的行，并不会限制a表的数据只显示value=1的行）,RIGHT JOIN 影响效果恰恰相反
INNER JOIN 的ON条件和WHERE条件影响的都是一个效果，影响整体的查询结果。

## TODO

TODO 全外连接
TODO 和 `group by`结合起来用的时候, join 中 on 和 where 是否有什么区别
