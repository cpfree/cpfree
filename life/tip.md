# tip

## bog

1. 扫描包下类文件的方法文档

## 知识

1. threadLocal可能引起内存泄漏原因

根据上一节的内存模型图我们可以知道，由于ThreadLocalMap是以弱引用的方式引用着ThreadLocal，换句话说，就是ThreadLocal是被ThreadLocalMap以弱引用的方式关联着，因此如果ThreadLocal没有被ThreadLocalMap以外的对象引用，则在下一次GC的时候，ThreadLocal实例就会被回收，那么此时ThreadLocalMap里的一组KV的K就是null了，因此在没有额外操作的情况下，此处的V便不会被外部访问到，而且只要Thread实例一直存在，Thread实例就强引用着ThreadLocalMap，因此ThreadLocalMap就不会被回收，那么这里K为null的V就一直占用着内存。

综上，发生内存泄露的条件是

1. ThreadLocal实例没有被外部强引用，比如我们假设在提交到线程池的task中实例化的ThreadLocal对象，当task结束时，ThreadLocal的强引用也就结束了
2. ThreadLocal实例被回收，但是在ThreadLocalMap中的V没有被任何清理机制有效清理
3. 当前Thread实例一直存在，则会一直强引用着ThreadLocalMap，也就是说ThreadLocalMap也不会被GC

## 懂技术体系, 还要懂业务体系

## 预生产环境的必要性和重要性

## 敬畏心

一个大型的项目, 任何一行代码其背后都有存在的价值, 正所谓存在即合理, 别人不会无缘无故这么写, 如果你觉得不合理, 那么就通过充分的调研和了解, 确定每一个参数背后存在的意义和设计变更, 以尽可能降低犯错的概率.

## 责任

自己的事情自己做, 不是自己的事情自己最好不要做, 否则一旦出现了问题, 背锅的可能就是你

## 一个简单的场景

## 内存泄露

一般而言, 内存泄露就是, 父类对象中有个内部对象, 之后, 父类对象被回收了, 子类对象却被其它对象强引用者, 导致回收不掉, 而且, 这个子类对象也一直没有用, 就造成了内存泄露.

## mysql 分页查询limit中偏移量offset过大导致性能问题

推荐分页

> select * form table limit 10000, 10
> 偏移量offset越大, 性能越低

推荐

1. 如果id是自增长序列, 那么可以

LIMIT分页查询时，索引是从0开始的，不是从1开始的
`select * from table where id >= 10000 limit 0, 10`

`select * from table where id > (select id from table limit 10000, 1) limit 10`

  从人正常的逻辑去考虑limit 偏移量去取数据的话大家可能会考虑到从100开始取，取三条数据，那我就直接跳过前一百条数据，然后取出后面三条数据。但实际上MySQL并不是这么做的，查看上面两图中可以看到当偏移量增大时，Sending data是耗时的主要原因，这是因为MySQL并没有那么智能，并非是跳过偏移量取后面的数据而是先把偏移量+要取得条数，然后再把偏移量这一段的数据抛弃掉再返回。关于优化的解决方案的话大致可以分为几条：

       1> 在业务允许的情况下限制页数：

        可以看看百度和谷歌的做法，百度搜索出来的结果集的话最大的分页数是76页，可以想到76页已经是一个足够大的页数了，哪里会有人在那里一直翻页翻到76页，而谷歌更狠，我所查到的谷歌搜索结果集最大页数是28页，而且谷歌搜索出来的页数和百度不一样的是谷歌并非将页数定死的。

在大的数据量面前使用where id>offset 来代替使用limit offset：

假如说如果真的要物理删除，那解决方法的话就只能先取出前offset条数据的ID，再去做偏移取数据

## 多线程并发代码

```java
ExecutorService executor = Executors.newFixedThreadPool(threadNum);

log.info("开启了 {} 线程", threadNum);
for (RicTypeMapping typeMapping : ricTypeMappings) {
   executor.submit(new MultiThreadCall(typeMapping, cnt));
}
executor.shutdown();
log.info("executor.shutdown");
while (true) {
   try {
         if (executor.awaitTermination(1, TimeUnit.SECONDS)) {
            // 线程池结束时调用
            break;
         }
   } catch (InterruptedException e) {
         e.printStackTrace();
   }
}
```

## @FunctionalInterface

@FunctionalInterface 就是用来指定某个接口必须是函数式接口，所以 @FunInterface 只能修饰接口，不能修饰其它程序元素。
@FunctionalInterface 注解主要是帮助程序员避免一些低级错误，例如，在上面的 FunInterface 接口中再增加一个抽象方法 abc()，编译程序时将出现如下错误提示：
"@FunctionInterface"批注无效；FunInterface不是functional接口

 Java8提倡函数式变成，因而新增了一个函数式接口。函数式接口保证了函数式编程，同时也保证了能够兼容以前的java版本。

     函数式接口的定义

     在java8中，满足下面任意一个条件的接口都是函数式接口：

1、被@FunctionalInterface注释的接口，满足@FunctionalInterface注释的约束。

2、没有被@FunctionalInterface注释的接口，但是满足@FunctionalInterface注释的约束

     @FunctionalInterface注释的约束：

1、接口有且只能有个一个抽象方法，只有方法定义，没有方法体

2、在接口中覆写Object类中的public方法，不算是函数式接口的方法。

## 目前有个表，专门记录日志的，假定我的表id为int类型，现在不考虑表查询新能和能存储多少数据。id自增到了int类型所能表达的最大值的时候，id还会自增吗？

当自增值已经达到最大值的时候，InnoDB存储的AUTO_INCREMENT值不再增加，下次获取的值还是4294967295，出现主键冲突。

## static类、static变量会不会被GC回收

1)静态变量本身不会被回收

2)静态变量所引用的对象是可以回收的。
static final 对象不会被回收

1、不要毫无计划地写代码，思考、调研、计划、编码、测试、修改，一个都不能少；

4、使用实现功能的最简单方案，作为专业的程序员，你的职责不是找出问题的一个解决方案，而是找出问题的最简单的解决方案；

12、一定要写好测试，如果可能的话，甚至在开始写代码实现需求之前，你就应该开始预估和设计需要测试校验的情况了。测试驱动开发 （Testing-driven development, TDD）不是什么花俏的炒作，它是会实实在在会对你思考功能特性、寻找更好的设计方案产生积极影响的。

16、不要过度迷恋性能优化，如果你在运行代码之前就在优化它了，那很可能你就是在过早优化代码了，也很可能你正在费时费力做的优化是完全没必要的。

17、以用户体验为目标，要站在最终用户的角度看问题。专业的开发者要考虑这个特定功能的用户需要什么、怎样使用，要想方设法使得这个功能容易让用户发现和使用，而不是想方设法在应用中用最便捷添加这个功能，毫不考虑这个功能的可发现性和可用性。

20、切勿重复造轮子，使用好现有的轮子和各种开源库，会让你事半功倍。当然，不要仅仅为了使用一两个函数就引入一整个代码库，在 JavaScript 中的典型例子就是 lodash 代码库；

22、用好版本控制工具和系统，新手往往低估了一个好的版本控制系统的威力，我这里所说的好的版本控制系统其实就是指 Git；


## 关于配置

> 之前一个超时设置, 找了好久没有找到, 最后发现写死在代码里面了, 类似于超时设置一定要写在最外面配置里面, 统一配置, 如果在最外面觉得麻烦可以找点其他方法. 但是一定要统一管理和简单配置.
