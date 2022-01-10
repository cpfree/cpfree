# 线程中断与停止

1. 线程设计方式
   JVM里面是没有直接实现线程的. jvm新建线程调用的是系统底层的新建线程的方法.

## 线程终止设计

### 实际线程终止方案设计

   ![](https://gitee.com/cpfree/picture-warehouse/raw/master/pic1/1638185057868.png)

   在hotspot虚拟机里面, 由于启动线程调用的是本地方法, 因此这部分代码很大程度上是在JVM的实现里面.

1. 每个线程里面有一个整形 `_interrupt` 变量, 它用来作为线程终止状态标记的判断依据.

2. 线程A在运行过程中, 可以在代码的某处, 通过判断 `_interrupt` 变量是否被设置为了true, 来判断是否受到了终止消息, 若是收到了终止消息, 可以决定接下来的操作, 或许是自己终止自己, 也可以是继续运行下去.

   > 在hotspot的linux版本的JVM里面有set_interrupted()方法, _interrupt变量就是JVM对线程变量的定义, 因为线程调用的是Os系统底层的Thread, 因此 _interrupt变量也需要设置在JVM里面
   > ![](https://gitee.com/cpfree/picture-warehouse/raw/master/pic1/1638185653353.png)
   
3. 线程A在阻塞状态下被唤醒的时候, 会有一步判断`_interrupt` 变量是否被设置为了true, 如果被设置为了ture, 会抛出 interrupttedException 异常, 而此时, 程序员只需要处理这个异常就可以了.

   > 线程从睡眠状态被唤醒之后, 会有一步判断当前线程是否是 interrupt状态, 如果是的话, 那么将会抛出InterruptedException异常.
   > ![img](https://gitee.com/cpfree/picture-warehouse/raw/master/pic1/1638186336121.png)

4. 如果线程 B 想要终止线程A , 那么线程B可以将线程A里面的 `_interrupt` 变量 设置为 ture, 通知一下线程A需要停止了. 当然具体要不要停止, 还是线程A决定. 如果此时线程A在睡眠的时候怎么办呢? 那么就唤醒线程.

   > 调用Thread类的 interrupt方法, 还会起到唤醒线程的作用, 看下面的代码可知, JVM底层实现除了设置_interrupt变量之外, 如果线程在睡眠的情况下, 还会调用unpark方法去唤醒线程.
   >![](https://gitee.com/cpfree/picture-warehouse/raw/master/pic1/1638185844968.png)

5. 线程的复位

   线程在调用 isInterrupted() 方法之后, 还会将`_interrupt`复位.

   > ![](https://gitee.com/cpfree/picture-warehouse/raw/master/pic1/1638187180501.png)

   > `os:isInterrupted()` 这个地方看方法名字只是做了一下判断, 但是如果第二个参数是true, 它还可以复位了 `_interrupt` 标记.

   ![](https://gitee.com/cpfree/picture-warehouse/raw/master/pic1/20211201164332.png)

   这就导致了以下两个问题.

   1. 线程B在调用了 interrupt 方法, 线程A抛出异常后, 如果我们没有在异常处理方法去停止掉线程, 那么, 这个线程跳出catch()方法后会继续正常执行, 因为此时线程已经被复位.

   2. 我们在调用了 `Thread.interrupted()` 获取了线程 `_interrupt` 标记后, 如果再次判断的话会发现, 线程已经被复位.

### 线程终止设计问题

- 为什么不建议线程直接终止一个线程

   一般来说, 强行终止线程A, 都是通过另一个线程B来终止线程A, 而线程B是不知道线程A代码运行在了什么地方. 如果强行终止的话, 很容易造成数据不完整的情况.

   因此最好是**让线程能够停在程序员规定的地方**, 而让线程本身控制自己控制自己终止自己是一个非常不错的解决方案.

- **如何让线程能够停在程序员规定的地方**

   让线程终止的情况一般有以下几种

   1. 线程运行完成自动终止
   2. 线程正在运行, 此时另外一个线程终止这个线程.
   3. 线程正在阻塞(sleep), 此时另外一个线程终止这个线程.

   在线程内部可以很好的**让线程能够停在程序员规定的地方**.

   假如说线程B终止正在运行或者是阻塞的线程A, 可以给线程 A 发送一个信号, 线程A运行到代码的某个地方(这个地方是线程终止的好地方), 然后去处理这个信号, 然后决定是否终止.

- 如果interrupt标记写在java里面会怎么样. 如下面的代码

   ```java
   public class Demo implements Runnable {
      static volatile boolean interrupt = false;

      @Override
      public void run(){
         while(!interrupt) {
               // 相关逻辑操作
         }
      }

   }
   ```
   
   很明显, 我们可以看出, 这样做的话, 假如线程在**睡眠的时候是没有办法响应中断的**.
