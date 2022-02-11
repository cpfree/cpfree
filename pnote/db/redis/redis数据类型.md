---
keys: 
type: copy
url: <>
id: 220206-120712
---

# redis数据结构

> <https://blog.csdn.net/liqingtx/article/details/60330555>

## key

涉及到方法

1. 判断key是否存在
2. 从当前数据库随即返回一个key
3. 修改key的名称
4. 移出key
5. 返回key所存储的值的类型
6. 为key设置过期时间
7. 查看key的剩余的过期时间
8. 移除过期时间
9. 查找所有符合正则表达式的key
10. 移动当前数据库的key到指定的数据库中

## String

太简单, 就是key-value类型

## hash

hashes存的是字符串和字符串值之间的映射，比如一个用户要存储其全名、姓氏、年龄等等，就很适合使用哈希。

Redis hash 是一个 string 类型的 field（字段） 和 value（值） 的映射表，hash 特别适合用于存储对象。

Redis 中每个 hash 可以存储 232 - 1 键值对（40多亿）。

## lists

**redis中的lists在底层实现上并不是数组，而是链表**

因此

   在头部和尾部插入一个新元素，其时间复杂度是常数级别的，比如用LPUSH在10个元素的lists头部插入新元素，和在上千万元素的lists头部插入新元素的速度应该是相同的。

   链表型lists的元素定位会比较慢，而数组型lists的元素定位就会快得多。

lists的常用操作包括LPUSH、RPUSH、LRANGE等。我们可以用LPUSH在lists的左侧插入一个新元素，用RPUSH在lists的右侧插入一个新元素，用LRANGE命令从lists中指定一个范围来提取元素。

tip: 

   1. range 范围数字, 0代表第一个元素, 负数代表倒数, 例如 `-1` 代表最后一个元素, 如果只有`start`, 则表示从start 开始, 提取到最后.

```shell
//新建一个list叫做mylist，并在列表头部插入元素"1"
127.0.0.1:6379> lpush mylist "1" 
//返回当前mylist中的元素个数
(integer) 1 
//在mylist右侧插入元素"2"
127.0.0.1:6379> rpush mylist "2" 
(integer) 2
//在mylist左侧插入元素"0"
127.0.0.1:6379> lpush mylist "0" 
(integer) 3
//列出mylist中从编号0到编号1的元素
127.0.0.1:6379> lrange mylist 0 1 
1) "0"
2) "1"
//列出mylist中从编号0到倒数第一个元素
127.0.0.1:6379> lrange mylist 0 -1 
1) "0"
2) "1"
3) "2"
```

### list 使用实例

1. 可以利用lists来实现一个消息队列，而且可以确保先后顺序，不必像MySQL那样还需要通过ORDER BY来进行排序。
2. 利用LRANGE还可以很方便的实现分页的功能。

## SET

redis的SET，是一种无序的集合，集合中的元素没有先后顺序, 集合中不能出现重复的数据。

Redis 中集合是通过`哈希表`实现的，所以添加，删除，查找的复杂度都是 O(1)。

集合中最大的成员数为 232 - 1 (4294967295, 每个集合可存储40多亿个成员)。

集合相关的操作也很丰富，如添加新元素、删除已有元素、取交集、取并集、取差集等。我们来看例子：

```shell
//向集合myset中加入一个新元素"one"
127.0.0.1:6379> sadd myset "one" 
(integer) 1
127.0.0.1:6379> sadd myset "two"
(integer) 1
//列出集合myset中的所有元素
127.0.0.1:6379> smembers myset 
1) "one"
2) "two"
//判断元素1是否在集合myset中，返回1表示存在
127.0.0.1:6379> sismember myset "one" 
(integer) 1
//判断元素3是否在集合myset中，返回0表示不存在
127.0.0.1:6379> sismember myset "three" 
(integer) 0
//新建一个新的集合yourset
127.0.0.1:6379> sadd yourset "1" 
(integer) 1
127.0.0.1:6379> sadd yourset "2"
(integer) 1
127.0.0.1:6379> smembers yourset
1) "1"
2) "2"
//对两个集合求并集
127.0.0.1:6379> sunion myset yourset 
1) "1"
2) "one"
3) "2"
4) "two"
```

## 有序集合(sorted set)

Redis 有序集合和集合一样也是 string 类型元素的集合,且不允许重复的成员。

不同的是每个元素都会关联一个 double 类型的分数。redis 正是通过分数来为集合中的成员进行从小到大的排序。

有序集合的成员是唯一的,但分数(score)却可以重复。

集合是通过`哈希表`实现的，所以添加，删除，查找的复杂度都是 O(1)。 集合中最大的成员数为 232 - 1 (4294967295, 每个集合可存储40多亿个成员)。

```shell
redis 127.0.0.1:6379> ZADD runoobkey 1 redis
(integer) 1
redis 127.0.0.1:6379> ZADD runoobkey 2 mongodb
(integer) 1
redis 127.0.0.1:6379> ZADD runoobkey 3 mysql
(integer) 1
redis 127.0.0.1:6379> ZADD runoobkey 3 mysql
(integer) 0
redis 127.0.0.1:6379> ZADD runoobkey 4 mysql
(integer) 0
redis 127.0.0.1:6379> ZRANGE runoobkey 0 10 WITHSCORES

1) "redis"
2) "1"
3) "mongodb"
4) "2"
5) "mysql"
6) "4"
```

## hyperLogLog

布隆过滤器







