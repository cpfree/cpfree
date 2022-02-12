# 先行发生原则(happens-before)

> Happens 本质上是对多线程之间可见性原则的描述, 而不是有序性, 
> 通过happens我们可以知道哪些场景下不会出现可见性问题.

### As-If-Serial

intro : 不管怎么重排序（编译器和处理器为了提高并行度），（单线程）程序的执行结果不能被改变。编译器，runtime 和处理器都必须遵守as-if-serial语义。

### happens-before 初始定义

happens-before的概念最初由Leslie Lamport在其一篇影响深远的论文（《Time，Clocks and the Ordering of Events in a Distributed System》）中提出.

1. **如果一个操作happens-before另一个操作，那么第一个操作的执行结果将对第二个操作可见，而且第一个操作的执行顺序排在第二个操作之前**。
2. **两个操作之间存在happens-before关系，并不意味实际运行必须要按照happens-before关系指定的顺序来执行。如果重排序之后的执行结果，与按happens-before关系来执行的结果一致，那么这种重排序并不非法.**

happens-before 具体的一共有六项规则：

- 程序顺序规则：一个线程中的每个操作，happens-before于该线程中的任意后续操作。
- 监视器锁规则：对一个锁的解锁，happens-before于随后对这个锁的加锁。
- volatile变量规则：对一个volatile域的写，happens-before于任意后续对这个volatile域的读。
- 传递性：如果A happens-before B，且B happens-before C，那么A happens-before C。
- start()规则：如果线程A执行操作ThreadB.start()（启动线程B），那么A线程的ThreadB.start()操作happens-before于线程B中的任意操作。
- join()规则：如果线程A执行操作ThreadB.join()并成功返回，那么线程B中的任意操作happens-before于线程A从ThreadB.join()操作成功返回。

> 这几条是happens-before通用的原有的规则, 不是JVM具体实现的规则.

**程序需要正确的运行, 而重排序可以使程序更快的运行**. happens-before原则可以理解为一个契约, 这个契约的目的是为了在不改变程序执行结果的前提下，尽可能地提高程序执行的效率
   对于程序员来说, 关心的是程序执行时的语义不能被改变（即执行结果不能被改变）, 将程序员关心的事物抽取成6项规则, 作为happens-before的6项规则.
   对于编译器，runtime 和处理器来说, 只要能够满足了`程序关心的语义不被改变`的需求, 那么具体是不是真正按照happens-before的规则进行指令重排序则并不重要.

一个happens-before规则对应于一个或多个编译器和处理器重排序规则。对于Java程序员来说，happens-before规则简单易懂，它避免Java程序员为了理解JMM提供的内存可见性保证而去学习复杂的重排序规则以及这些规则的具体实现方法

> 相对于as-if-serial来说, happens-before关系保证正确同步的多线程程序的执行结果不被改变。

### JVM 的 Happens-Before 实现

如果JMM中所有的有序性都只靠volatile和synchronized，那么有一些操作将会变得很繁琐，但我们在编写Java并发代码时并没有感到这一点，这是因为Java语言中有一个 `先行发生(Happen-Before)`原则

这个原则非常重要，**它是判断数据是否存在竞争，线程是否安全的主要依赖原则**。

下面是Java内存模型下一些“天然的”先行发生关系，这些先行发生关系无须任何同步器协助就已经存在，可以在编码中直接使用。如果两个操作之间的关系不在此列，并且无法从下列规则推导出来，则它们就没有顺序性保障，虚拟机可以对它们随意地进行重排序。

- **程序次序规则（Program Order Rule）**：在一个线程内，按照控制流顺序，书写在前面的操作先行发生于书写在后面的操作。注意，这里说的是控制流顺序而不是程序代码顺序，因为要考虑分支、循环等结构。
- **管程锁定规则（Monitor Lock Rule）**：一个unlock操作先行发生于后面对同一个锁的lock操作。这里必须强调的是“同一个锁”，而“后面”是指时间上的先后。
- **volatile变量规则（Volatile Variable Rule）**：对一个volatile变量的写操作先行发生于后面对这个变量的读操作，这里的“后面”同样是指时间上的先后。
- **线程启动规则（Thread Start Rule）**：Thread对象的start()方法先行发生于此线程的每一个动作。
- **线程终止规则（Thread Termination Rule）**：线程中的所有操作都先行发生于对此线程的**终止检测**，我们可以通过Thread::join()方法是否结束、Thread::isAlive()的返回值等手段检测线程是否已经终止执行。
- **线程中断规则（Thread Interruption Rule）**：对线程interrupt()方法的调用先行发生于被中断线程的代码检测到中断事件的发生，可以通过Thread::interrupted()方法检测到是否有中断发生。
- **对象终结规则（Finalizer Rule）**：一个对象的初始化完成（构造函数执行结束）先行发生于它的finalize()方法的开始。
- **传递性（Transitivity）**：如果操作A先行发生于操作B，操作B先行发生于操作C，那就可以得出操作A先行发生于操作C的结论。

Java语言无须任何同步手段保障就能成立的先行发生规则**有且只有**上面这些!

但是通过实现上面的基础规则, 产生了下面的一些扩张的规则

1. join()规则：如果线程A执行操作ThreadB.join()并成功返回，那么线程B中的任意操作happens-before于线程A从ThreadB.join()操作成功返回。
2. 将一个元素放入一个线程安全的队列的操作Happens-Before从队列中取出这个元素的操作
3. 将一个元素放入一个线程安全容器的操作Happens-Before从容器中取出这个元素的操作
4. 在CountDownLatch上的倒数操作Happens-Before CountDownLatch#await()操作
5. Semaphore：release许可的操作Happens-Before acquire许可 的操作
6. CyclicBarrier：线程中调用 await() 之前的操作 happen-before 那些是屏障操作的一部份的操作，后者依次 happen-before 紧跟在从另一个线程中对应 await() 成功返回的操作。
7. Future表示的任务的所有操作Happens-Before Future#get()操作
8. 向Executor提交一个Runnable或Callable的操作Happens-Before任务开始执行操作

一个操作”时间上的先发生“不代表这个操作会是”先行发生“，那如果一个操作”先行发生“是否就能推导出这个操作必定是”时间上的先发生“呢？也是不成立的，一个典型的例子就是指令重排序
所以时间上的先后顺序与先行发生原则之间基本没有什么关系，所以衡量并发安全问题一切必须以先行发生原则为准。

上面八条是原生Java满足Happens-before关系的规则，但是我们可以对他们进行推导出

## 附加JVM的一些证明

### 1. 时间先后顺序与先行发生原则之间基本没有因果关系

> 以下内容参考至《深入理解Java虚拟机：JVM高级特性与最佳实践（第三版）》 --> 章节：

```java
private int value = 0;

pubilc void setValue(int value){
   this.value = value;
}

public int getValue(){
   return value;
}
```

代码清单12-9中显示的是一组再普通不过的getter/setter方法，假设存在线程A和B，线程A先（时间上的先后）调用了setValue(1)，然后线程B调用了同一个对象的getValue()，那么线程B收到的返回值是什么？

我们依次分析一下先行发生原则中的各项规则。

1. 由于两个方法分别由线程A和B调用，不在一个线程中，所以程序次序规则在这里不适用；
2. 由于没有同步块，自然就不会发生lock和unlock操作，所以管程锁定规则不适用；
3. 由于value变量没有被volatile关键字修饰，所以volatile变量规则不适用；
4. 后面的线程启动、终止、中断规则和对象终结规则也和这里完全没有关系。
5. 因为没有一个适用的先行发生规则，所以最后一条传递性也无从谈起.

因此我们可以判定，尽管线程A在操作时间上先于线程B，但是无法确定线程B中getValue()方法的返回结果，换句话说，这里面的操作不是线程安全的。

那怎么修复这个问题呢？我们至少有两种比较简单的方案可以选择：

- 把getter/setter方法都定义为synchronized方法，这样就可以套用管程锁定规则；
- 把value定义为volatile变量，由于setter方法对value的修改不依赖value的原值，满足volatile关键字使用场景，这样就可以套用volatile变量规则来实现先行发生关系。

通过上面的例子，我们可以得出结论：**一个操作“时间上的先发生”不代表这个操作会是“先行发生”**。

那如果一个操作“先行发生”，是否就能推导出这个操作必定是“时间上的先发生”呢？很遗憾，这个推论也是不成立的。一个典型的例子就是多次提到的“指令重排序”，演示例子如代码清单12-10所示。

代码清单12-10　先行发生原则示例3
// 以下操作在同一个线程中执行

```java
int i = 1;
int j = 2;
```

代码清单12-10所示的两条赋值语句在同一个线程之中，**根据程序次序规则，“int i=1”的操作先行发生于“int j=2”，但是“int j=2”的代码完全可能先被处理器执行，这并不影响先行发生原则的正确性**，因为我们在这条线程之中没有办法感知到这一点。

上面两个例子综合起来证明了一个结论：时间先后顺序与先行发生原则之间基本没有因果关系，所以我们衡量并发安全问题的时候不要受时间顺序的干扰，一切必须以先行发生原则为准。


### happens-before 8大原则示例

> 内容参考自<https://cloud.tencent.com/developer/article/1734515>

在正式介绍Happens-Before原则之前，我们先来看一段代码。
**【示例一】**

```javascript
class VolatileExample {
  int x = 0;
  volatile boolean v = false;

  public void writer() {
    x = 42;
    v = true;
  }

  public void reader() {
    if (v == true) {
      //x的值是多少呢？
    }
  }
}
```

以上示例来源于：http://www.cs.umd.edu/~pugh/java/memoryModel/jsr-133-faq.html#finalWrong

这里，假设线程A执行writer()方法，按照volatile会将v=true写入内存；线程B执行reader()方法，按照volatile，线程B会从内存中读取变量v，如果线程B读取到的变量v为true，那么，此时的变量x的值是多少呢？？

这个示例程序给人的直觉就是x的值为42，其实，x的值具体是多少和JDK的版本有关，如果使用的JDK版本低于1.5，则x的值可能为42，也可能为0。如果使用1.5及1.5以上版本的JDK，则x的值就是42。

看到这个，就会有人提出问题了？这是为什么呢？其实，答案就是在JDK1.5版本中的Java内存模型中引入了Happens-Before原则。

接下来，我们就结合案例程序来说明Java内存模型中的Happens-Before原则。

#### **【原则一】程序次序规则**

**在一个线程中，按照代码的顺序，前面的操作Happens-Before于后面的任意操作。**

例如【示例一】中的程序x=42会在v=true之前执行。这个规则比较符合单线程的思维：在同一个线程中，程序在前面对某个变量的修改一定是对后续操作可见的。

#### **【原则二】volatile变量规则**

**对一个volatile变量的写操作，Happens-Before于后续对这个变量的读操作。**

也就是说，对一个使用了volatile变量的写操作，先行发生于后面对这个变量的读操作。这个需要大家重点理解。

#### **【原则三】传递规则**

**如果A Happens-Before B，并且B Happens-Before C，则A Happens-Before C。**

我们结合【原则一】、【原则二】和【原则三】再来看【示例一】程序，此时，我们可以得出如下结论：

（1）x = 42 Happens-Before 写变量v = true，符合【原则一】程序次序规则。

（2）写变量v = true Happens-Before 读变量v = true，符合【原则二】volatile变量规则。

再根据【原则三】传递规则，我们可以得出结论：x = 42 Happens-Before 读变量v=true。

也就是说，如果线程B读取到了v=true，那么，线程A设置的x = 42对线程B就是可见的。换句话说，就是此时的线程B能够访问到x=42。

其实，Java 1.5版本的 java.util.concurrent并发工具就是靠volatile语义来实现可见性的。

#### **【原则四】锁定规则**

**对一个锁的解锁操作 Happens-Before于后续对这个锁的加锁操作。**

例如，下面的代码，在进入synchronized代码块之前，会自动加锁，在代码块执行完毕后，会自动释放锁。

**【示例二】**

```javascript
public class Test{
    private int x = 0;
    public void initX{
        synchronized(this){ //自动加锁
            if(this.x < 10){
                this.x = 10;
            }
        } //自动释放锁
    }
}
```

我们可以这样理解这段程序：假设变量x的值为10，线程A执行完synchronized代码块之后将x变量的值修改为10，并释放synchronized锁。当线程B进入synchronized代码块时，能够获取到线程A对x变量的写操作，也就是说，线程B访问到的x变量的值为10。

#### **【原则五】线程启动规则**

**如果线程A调用线程B的start()方法来启动线程B，则start()操作Happens-Before于线程B中的任意操作。**

我们也可以这样理解线程启动规则：线程A启动线程B之后，线程B能够看到线程A在启动线程B之前的操作。

我们来看下面的代码。

**【示例三】**

```javascript
//在线程A中初始化线程B
Thread threadB = new Thread(()->{
    //此处的变量x的值是多少呢？答案是100
});
//线程A在启动线程B之前将共享变量x的值修改为100
x = 100;
//启动线程B
threadB.start();
```

上述代码是在线程A中执行的一个代码片段，根据【原则五】线程的启动规则，线程A启动线程B之后，线程B能够看到线程A在启动线程B之前的操作，在线程B中访问到的x变量的值为100。

#### **【原则六】线程终结规则**

**线程A等待线程B完成（在线程A中调用线程B的join()方法实现），当线程B完成后（线程A调用线程B的join()方法返回），则线程A能够访问到线程B对共享变量的操作。**

例如，在线程A中进行的如下操作。

**【示例四】**

```
Thread threadB = new Thread(()-{
    //在线程B中，将共享变量x的值修改为100
    x = 100;
});
//在线程A中启动线程B
threadB.start();
//在线程A中等待线程B执行完成
threadB.join();
//此处访问共享变量x的值为100
```

#### **【原则七】线程中断规则**

**对线程interrupt()方法的调用Happens-Before于被中断线程的代码检测到中断事件的发生。**

例如，下面的程序代码。在线程A中中断线程B之前，将共享变量x的值修改为100，则当线程B检测到中断事件时，访问到的x变量的值为100。

**【示例五】**

```
    //在线程A中将x变量的值初始化为0
    private int x = 0;

    public void execute(){
        //在线程A中初始化线程B
        Thread threadB = new Thread(()->{
            //线程B检测自己是否被中断
            if (Thread.currentThread().isInterrupted()){
                //如果线程B被中断，则此时X的值为100
                System.out.println(x);
            }
        });
        //在线程A中启动线程B
        threadB.start();
        //在线程A中将共享变量X的值修改为100
        x = 100;
        //在线程A中中断线程B
        threadB.interrupt();
    }
```

#### **【原则八】对象终结原则**

**一个对象的初始化完成Happens-Before于它的finalize()方法的开始。**

例如，下面的程序代码。

**【示例六】**

```javascript
public class TestThread {

   public TestThread(){
       System.out.println("构造方法");
   }

    @Override
    protected void finalize() throws Throwable {
        System.out.println("对象销毁");
    }

    public static void main(String[] args){
        new TestThread();
        System.gc();
    }
}
```

运行结果如下所示。

```
构造方法
对象销毁
```

## **后记：**

**记住：你比别人强的地方，不是你做过多少年的CRUD工作，而是你比别人掌握了更多深入的技能。不要总停留在CRUD的表面工作，理解并掌握底层原理并熟悉源码实现，并形成自己的抽象思维能力，做到灵活运用，才是你突破瓶颈，脱颖而出的重要方向！**
