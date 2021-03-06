
1. git 使用 stage 可以将文件储汇到文件夹里面, 弹出储汇的时候分支之间是公用的





总结一下，当我们遇到了要快速判断一个元素是否出现集合里的时候，就要考虑哈希法。

但是哈希法也是牺牲了空间换取了时间，因为我们要使用额外的数组，set或者是map来存放数据，才能实现快速的查找。

如果在做面试题目的时候遇到需要判断一个元素是否出现过的场景也应该第一时间想到哈希法！





1. 以下关于子类和父类的到底是几个对象，也就是影响到父类和子类获取的是否是同一个锁（以下解释来自博客 http://blog.csdn.net/aitangyong/article/details/22695399）

 * 使用A a = new A()这种方式创建对象的时候，JVM会在后台给我们分配内存空间，然后调用构造函数执行初始化操作，
 * 最后返回内存空间的引用。
 * 即构造函数只是进行初始化，并不负责分配内存空间（创建对象）。
 * 所以呢其实创建子类对象的时候，JVM会为子类对象分配内存空间，
 * 并调用父类的构造函数。
 * 我们可以这样理解：创建了一个子类对象的时候，在子类对象内存中，
 * 有两份数据，一份继承自父类，一份来自子类，但是他们属于同一个对象（子类对象），
 * 只不过是java语法提供了this和super关键字来让我们能够按照需要访问这2份数据而已。
 * 这样就产生了子类和父类的概念，但实际上只有子类对象，没有父类对象。


2. Sync中的nonfairTryAcquire()方法实现

 3 * 这个跟公平类中的实现主要区别在于不会判断当前线程是否是等待时间最长的线程

 如果该锁被获取n次，则前（n-1）次tryRelease(int releases)方法必须返回false，而只有同步状态完全释放了，才返回true，该方法将同步状态是否为0作为最终释放的条件，当同步状态为0时，将占有线程设置为null，并返回true，表示释放成功。

 但是非公平锁是默认实现：非公平性锁可能使线程"饥饿"，但是极少的线程切换，可以保证其更大的吞吐量。而公平性锁，保证了锁的获取按照FIFO原则，代价是进行大量的线程切换。



![fdfd](./knowledge/svg_JavaArchitectsKnowledgeSystem.svg)

## 闭包是什么
## 如何保证 java 程序仅仅执行一次






4.1 计算机基础知识
这里所说的计算机基础知识包括（但不局限）以下几门课程：

计算机网络
操作系统
计算机组成原理
数据结构

不要觉得计算机基础学科在工作中用到的不多，就不作为重点，在面试环节这些都有可能被问到，尤其是大公司！

4.2 某一个方向深入学习
举 Java 后端方向为例：

Java 基础知识
Java 并发编程
MySQL 关系型数据库、Redis 非关系型数据库
Java 后端框架，eg：Spring 家族，Mybatis 等等
微服务，Spring Boot 、Spring Cloud、Dubbo等等
消息中间、ES 、Nginx 等等
这些范围的课程在 B 站 和 CSDN 博客社区基本上都可以找到教程和博客学习，但是切记，不要一味的堆积技术栈的使用而快餐式学习。即，一味的学框架，却不重视基础，这样在校招面试环节非常被动，甚至是很大缺陷。





快餐式堆积学习: 比如学了 RabbitMQ 消息中间件，然后就又去学 RocketMQ ，Kafka 等，只是在堆积技术栈宽度，却没有在某一个 MQ 上下足功夫去研究。

基础和技术栈宽度哪个重要？

大厂更重视基础，小公司更在意技术栈宽度，小孩才做选择，成年人我都要！





所说的重视基础，到底是那部分呢？

举个例子，你熟悉 Java 语言，那么你是否了解过 HashMap 的实现原理呢？（当然，这种被问烂的问题，很多小伙伴会觉得简单的一批）。

或者说，Java 锁大家都用过，那么 Java 锁锁住的是什么呢？ JVM 虚拟机是怎样区分不同的持锁对象呢？Java 8 大基本类型的内存占用空间和取值范围了解过吗？（诸如此类，如果不相信面试会问的这么细节，可以去看看牛客网大厂面经，和我的面试题打卡系列文章）。

4.3 算法
大厂面试算法一个槛，相信很多小伙伴和我一样，都怕笔试算法题，但是啊，算法这东西，多刷题就行，leetcode 或者 oj，100道题不够就200道题，200不够就300，只要花时间肯定能克服！
 







插入排序
插入排序的优化: 二分插入排序
希尔排序

插入排序优化: 批量插入排序, 将大的插入排序分为小的排序方式, 之后对每个进行分别排序, 之后进行两个顺序序列的插入合并


lombok里面的toString注解只会输出当前类的字段, 不会输出父类的字段


咕泡五岁，聆听未来。8月8日下午13:00-20:00，邀请各行业大咖对话未来，此次VIP课程免费。点击链接获取课程详情。课程链接：https://study.gupaoedu.cn/course/opennessCourseDetail/1304




面向对象编程, 很多人都是只了解皮毛, B/S架构的设计基本上已经成型了, 如果不从0开始做一个C/S架构的设计的话, 是很难真正理解面向对象编程思想的.

面向对象, 你要理解的不是面向对象, 你真正该理解的是封装, 抽象, 继承, 多态. 

首先是封装, 封装可以说是面向对象编程最最最最最重要的特性了, 假如面向对象编程没了抽象, 继承, 多态, 那么面向对象编程依然是面向对象编程, 但是如果没有了封装, 那面向对象编程就不是面向对象编程了

   封装这个概念, 容易理解, 但是非常难以掌握, 你以为你了解了, 也许那只是你的幻觉, 我只能说没有从零开始的C/S项目开发设计经验, 真的很难理解封装到底有什么好处.




变长参数和数组, java中的参数写成 `String... str`, 在编译的时候会自动将变长参数转译成数组.

5. 变长参数和数组，如何变通？
变长参数特性带来了一个强大的概念，可以帮助开发者简化代码。不过变长参数的背后是什么呢？Basically，就是一个数组。

public void calc(int... myInts) {} 
calc(1, 2, 3);
编译器会将前面的代码翻译成类似这样：

int[] ints = {1, 2, 3};
calc(ints);
不过这里有两点需要注意：

当心空调用语句，这相当于传递了一个null作为参数。
calc();
等价于
int[] ints = null;
calc(ints);
当然，下面的代码会导致编译错误，因为两条语句是等价的：
public void m1(int[] myInts) { ... }
public void m1(int... myInts) { ... }





有界队列 无界队列







