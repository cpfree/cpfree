# 缓存

## 相关问题

### 缓存穿透、缓存击穿、缓存雪崩概念及解决方案

1. 缓存穿透
   访问一个不存在的key，缓存不起作用，请求会穿透到DB，流量大时DB会挂掉。
   解决方案
   采用布隆过滤器，使用一个足够大的bitmap，用于存储可能访问的key，不存在的key直接被过滤；
   访问key未在DB查询到值，也将空值写进缓存，但可以设置较短过期时间。

2. 缓存雪崩
   大量的key设置了相同的过期时间，导致在缓存在同一时刻全部失效，造成瞬时DB请求量大、压力骤增，引起雪崩。
   解决方案
   可以给缓存设置过期时间时加上一个随机值时间，使得每个key的过期时间分布开来，不会集中在同一时刻失效。

3. 缓存击穿
   一个存在的key，在缓存过期的一刻，同时有大量的请求，这些请求都会击穿到DB，造成瞬时DB请求量大、压力骤增。
   解决方案
   在访问key之前，采用SETNX（set if not exists）来设置另一个短期key来锁住当前key的访问，访问结束再删除该短期key。