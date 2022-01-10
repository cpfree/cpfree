# Java中线程的状态分为6种。

1. NEW：新创建了一个线程对象，但还没有调用start()方法。
2. RUNNABLE：Java线程中将就绪（ready）和运行中（running）两种状态笼统的称为“运行”。
   线程对象创建后，其他线程(比如main线程）调用了该对象的start()方法。该状态的线程位于可运行线程池中，等待被线程调度选中，获取CPU的使用权，此时处于就绪状态（ready）。就绪状态的线程在获得CPU时间片后变为运行中状态（running）。
3. BLOCKED：表示线程阻塞于锁。
4. WAITING：进入该状态的线程需要等待其他线程做出一些特定动作（通知或中断）。
5. TIMED_WAITING：该状态不同于WAITING，它可以在指定的时间后自行返回。
6. TERMINATED：表示该线程已经执行完毕。

这6种状态定义在Thread类的State枚举中，可查看源码进行一一对应。

![](/java/java线程状态切换.svg)

> 注意线程状态改为 `RUNNABLE` 时, 首先都会是处于 `READY` 状态, 需要等到CPU调度才正式运行.

## 线程调度方法

`Object.wait()`, `Object.notify()`, `Object.notifyAll()` 都是Object里面的方法, 调用的时候都需要先获取到锁🔒, 也就是说需要写到 synchronized 作用域里面.


| 进入阻塞方法     | 调用前是否需要锁🔒 | 调用后是否释放资源 |
| ---------------- | ------------------ | ------------------ |
| Thread.sleep     | 否                 | 否                 |
| Thread.join      | 否                 | 否                 |
| Object.wait      | 需要对象A中的锁    | 释放对象A中的锁    |
| LockSupport.park | 否                 | 否                 |


Q: 等待队列里许许多多的线程都wait()在一个对象上，此时某一线程调用了对象的notify()方法，那是如何唤醒现成的,

A: JAVA里面说是任意的, JVM规范没有对其进行限制.
