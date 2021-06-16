
### Java初始化顺序
0. final static成员变量
1. 父类静态成员变量 > 静态代码块。
2. 子类静态成员变量 > 静态代码块。
3. 父类的实例成员 > 实例代码块 > 构造方法。
5. 子类的实例成员 > 实例代码块 > 构造方法。

### Java空接口
Cloneable, Serializable.

### 深复制和浅复制
浅复制的对象所有变量和原有变量相同, 浅复制仅仅考虑对象的变量, 不考虑引用变量的复制.

### 反射机制
得到一个类, 获取类中所有的成员变量和成员方法, 在运行时调用对象和方法.

### package作用
1. 提供多层命名空间，解决命名冲突。
2. 对类进行分类，使组织架构更加清晰。

### 如何实现指针
函数指针 ： 使用接口的方法做指针；
变量指针 ： 使用对象的变量做指针；

### 面向对象的特征
抽象，封装，集成，多态。

### 多态
多态是同一个行为具有多个不同表现形式或形态的能力。
多态就是同一个接口，使用不同的实例而执行不同操作。
多态性是对象多种表现形式的体现。
同一个事件发生在不同的对象上会产生不同的结果。


多态的优点
1. 消除类型之间的耦合关系
2. 可替换性
3. 可扩充性
4. 接口性
5. 灵活性
6. 简化性
多态存在的三个必要条件
继承
重写
父类引用指向子类对象

多态的实现方式
方式一：重写：
这个内容已经在上一章节详细讲过，就不再阐述，详细可访问：Java 重写(Override)与重载(Overload)。
方式二：接口
1. 生活中的接口最具代表性的就是插座，例如一个三接头的插头都能接在三孔插座中，因为这个是每个国家都有各自规定的接口规则，有可能到国外就不行，那是因为国外自己定义的接口类型。

2. java中的接口类似于生活中的接口，就是一些方法特征的集合，但没有方法的实现。具体可以看 java接口 这一章节的内容。

方式三：抽象类和抽象方法


for循环一个list 移除元素报错问题原因


## 选择题

在java中，下列对继承的说法，正确的是（A）

A、子类能继承父类的所有成员
B、子类继承父类的非私有方法和状态
C、子类只能继承父类的public方法和状态
D、子类只能继承父类的方法

使用反射可以看出子类是继承了父类的私有方法的(不管是否是final)，只是直接调用父类的私有方法是不可以的，但是利用反射的方式可以调用。字段同理。

# IO 流从方向上, 数据单位上, 功能上分为哪几种流

1. 方向上 : 输入流,输出流.
2. 数据单位上 : 字节流,字符流.
3. 流数据的包装过程 : 节点流(低级流), 处理流(高级流).




让我们一起来看看吧。

1.Java的HashMap是如何工作的？

HashMap是一个针对数据结构的键值，每个键都会有相应的值，关键是识别这样的值。
HashMap 基于 hashing 原理，我们通过 put ()和 get ()方法储存和获取对象。当我们将键值对传递给 put ()方法时，它调用键对象的 hashCode ()方法来计算 hashcode，让后找到 bucket 位置来储存值对象。
当获取对象时，通过键对象的 equals ()方法找到正确的键值对，然后返回值对象。HashMap 使用 LinkedList 来解决碰撞问题，当发生碰撞了，对象将会储存在 LinkedList 的下一个节点中。HashMap 在每个 LinkedList 节点中储存键值对对象。
2.什么是快速失败的故障安全迭代器？

快速失败的Java迭代器可能会引发ConcurrentModifcationException在底层集合迭代过程中被修改。故障安全作为发生在实例中的一个副本迭代是不会抛出任何异常的。

快速失败的故障安全范例定义了当遭遇故障时系统是如何反应的。例如，用于失败的快速迭代器ArrayList和用于故障安全的迭代器ConcurrentHashMap。

3.Java BlockingQueue是什么？

Java BlockingQueue是一个并发集合util包的一部分。BlockingQueue队列是一种支持操作，它等待元素变得可用时来检索，同样等待空间可用时来存储元素。

4.什么时候使用ConcurrentHashMap？

在问题2中我们看到ConcurrentHashMap被作为故障安全迭代器的一个实例，它允许完整的并发检索和更新。当有大量的并发更新时，ConcurrentHashMap此时可以被使用。

这非常类似于Hashtable，但ConcurrentHashMap不锁定整个表来提供并发，所以从这点上ConcurrentHashMap的性能似乎更好一些。所以当有大量更新时ConcurrentHashMap应该被使用。

5.哪一个List实现了最快插入？

LinkedList和ArrayList是另个不同变量列表的实现。ArrayList的优势在于动态的增长数组，非常适合初始时总长度未知的情况下使用。LinkedList的优势在于在中间位置插入和删除操作，速度是最快的。

LinkedList实现了List接口，允许null元素。此外LinkedList提供额外的get，remove，insert方法在LinkedList的首部或尾部。这些操作使LinkedList可被用作堆栈（stack），队列（queue）或双向队列（deque）。

ArrayList实现了可变大小的数组。它允许所有元素，包括null。每个ArrayList实例都有一个容量（Capacity），即用于存储元素的数组的大小。这个容量可随着不断添加新元素而自动增加，但是增长算法并没有定义。当需要插入大量元素时，在插入前可以调用ensureCapacity方法来增加ArrayList的容量以提高插入效率。

6.Iterator和ListIterator的区别

●ListIterator有add()方法，可以向List中添加对象，而Iterator不能。

●ListIterator和Iterator都有hasNext()和next()方法，可以实现顺序向后遍历，但是ListIterator有hasPrevious()和previous()方法，可以实现逆向（顺序向前）遍历。Iterator就不可以。

●ListIterator可以定位当前的索引位置，nextIndex()和previousIndex()可以实现。Iterator没有此功能。

●都可实现删除对象，但是ListIterator可以实现对象的修改，set()方法可以实现。Iierator仅能遍历，不能修改。

7.什么是CopyOnWriteArrayList，它与ArrayList有何不同？

CopyOnWriteArrayList是ArrayList的一个线程安全的变体，其中所有可变操作（add、set等等）都是通过对底层数组进行一次新的复制来实现的。相比较于ArrayList它的写操作要慢一些，因为它需要实例的快照。

CopyOnWriteArrayList中写操作需要大面积复制数组，所以性能肯定很差，但是读操作因为操作的对象和写操作不是同一个对象，读之间也不需要加锁，读和写之间的同步处理只是在写完后通过一个简单的'='将引用指向新的数组对象上来，这个几乎不需要时间，这样读操作就很快很安全，适合在多线程里使用，绝对不会发生ConcurrentModificationException ，因此CopyOnWriteArrayList适合使用在读操作远远大于写操作的场景里，比如缓存。

8.迭代器和枚举之间的区别

如果面试官问这个问题，那么他的意图一定是让你区分Iterator不同于Enumeration的两个方面：

●Iterator允许移除从底层集合的元素。

●Iterator的方法名是标准化的。

9.Hashmap如何同步?

当我们需要一个同步的HashMap时，有两种选择：

●使用Collections.synchronizedMap（..）来同步HashMap。

●使用ConcurrentHashMap的

这两个选项之间的首选是使用ConcurrentHashMap，这是因为我们不需要锁定整个对象，以及通过ConcurrentHashMap分区地图来获得锁。

10.IdentityHashMap和HashMap的区别

IdentityHashMap是Map接口的实现。不同于HashMap的，这里采用参考平等。

●在HashMap中如果两个元素是相等的，则key1.equals(key2)

●在IdentityHashMap中如果两个元素是相等的，则key1 == key2


## 常量接口模式 为什么java不适用静态接口

> java是动态语言我们在java工程中有时部分内容改变，不用重新编译整个项目，而只需编译改变的部分重新发布就可以


优点

1. 代码简单, 禁止实例化

缺点

1. 接口可以


https://blog.csdn.net/lonelymanontheway/article/details/89430460?utm_medium=distribute.pc_relevant_right.none-task-blog-BlogCommendFromMachineLearnPai2-2.nonecase&depth_1-utm_source=distribute.pc_relevant_right.none-task-blog-BlogCommendFromMachineLearnPai2-2.nonecase


https://www.jianshu.com/p/61f8e6a89ab0


基础:每个线程都有自己的线程栈，栈与线程同时创建，每一个虚拟机线程都有自己的程序计数器PC，在任何时刻，一个虚拟机线程只会执行一个方法的代码，这个方法称为该线程的当前方法，如果这个方法不是native的，程序计数器就保存虚拟机正在执行的字节码指令的地址。线程调用方法的时候会创建栈帧，用于保存局部变量表和操作数栈以及指向该类常量池的引用
静态方法虽然是同一个方法，但是不同线程在调用，程序计数器的值是不一样的，操作这两个线程不会相互影响（假设不存在访问共享变量的情况）
1.保证不依靠其他类、属性、方法等
2.不需要考虑方法同步
3. 如果使用单例类，需要考虑线程同步的情况,这是工具类不使用单例的原因(我认为是这样的)

这里还有一点需要补充:在写工具类时，最好是将其构造方法私有化，避免意外的初始化类，做无意义的工作