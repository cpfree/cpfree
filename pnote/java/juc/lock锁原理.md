# lock 锁原理

> https://blog.csdn.net/qq_45827239/article/details/106753122

![](https://gitee.com/cpfree/picture-warehouse/raw/master/pic1/20211201171433.png)

## lock方法

1. 公平锁代码

   ```java
   final void lock() {
      acquire(1); //抢占1把锁.
   }
   public final void acquire(int arg) { // AQS里面的方法
      if (!tryAcquire(arg) && acquireQueued(addWaiter(Node.EXCLUSIVE), arg))
         selfInterrupt();
   }
   // 试图占有 acquires 把锁, 占有成功返回true, 否则返回false
   protected final boolean tryAcquire(int acquires) {
      final Thread current = Thread.currentThread();
      int c = getState();
      if (c == 0) { //表示无锁状态
         if (!hasQueuedPredecessors() && compareAndSetState(0, acquires)) { //CAS（#Lock） -> 原子操作| 实现互斥的判断
            setExclusiveOwnerThread(current); //把获得锁的线程保存到
            exclusiveOwnerThread中
            return true;
         }
      }
      //如果当前获得锁的线程和当前抢占锁的线程是同一个，表示重入
      else if (current == getExclusiveOwnerThread()) {
         int nextc = c + acquires; //增加重入次数.
         if (nextc < 0)
            throw new Error("Maximum lock count exceeded");
         setState(nextc); //保存state
         return true;
      }
      return false;
   }
   ```

2. 非公平锁代码

   ```java
   final void lock() {
      //不管当前AQS队列中是否有排队的情况，先去插队
      if (compareAndSetState(0, 1)) //返回false表示抢占锁失败
         setExclusiveOwnerThread(Thread.currentThread());
      else
         acquire(1);
   }

   public final void acquire(int arg) { // AQS里面的方法
      if (!tryAcquire(arg) && acquireQueued(addWaiter(Node.EXCLUSIVE), arg))
         // 加入队列并进行自旋等待
         acquireQueued(addWaiter(Node.EXCLUSIVE), arg)
      addWaiter(Node.EXCLUSIVE) // 添加一个互斥锁的节点
      acquireQueued() // 自旋锁和阻塞的操作
      selfInterrupt();
   }

   protected final boolean tryAcquire(int acquires) {
      return nonfairTryAcquire(acquires);
   }

   final boolean nonfairTryAcquire(int acquires) {
      final Thread current = Thread.currentThread();
      int c = getState();
      if (c == 0) { //表示无锁状态
         // 没有判断 hasQueuedPredecessors
         if (compareAndSetState(0, acquires)) {
            setExclusiveOwnerThread(current);
            return true;
         }
      }
      //如果当前获得锁的线程和当前抢占锁的线程是同一个，表示重入
      else if (current == getExclusiveOwnerThread()) {
         int nextc = c + acquires; //增加重入次数.
         if (nextc < 0)
            throw new Error("Maximum lock count exceeded");
         setState(nextc); //保存state
         return true;
      }
      return false;
   }
   ```

## 假如队列并进行自旋等待

```java
   public final void acquire(int arg) {
      // addWaiter 添加一个互斥锁的节点
      // acquireQueued() -> 自旋锁和阻塞的操作
      if (!tryAcquire(arg) &&
         acquireQueued(addWaiter(Node.EXCLUSIVE), arg))
         selfInterrupt();
   }

   // 添加一个互斥锁的节点, 之后将节点添加到队列尾部.
   // 把线程要包装为Node对象的主要原因，除了用Node构造供虚拟队列外，还用Node包装了各种线程状态。
   private Node addWaiter(Node mode) {
      // 将当前线程封装成一个node节点
      Node node = new Node(Thread.currentThread(), mode);
      // Try the fast path of enq; backup to full enq on failure
      Node pred = tail;
      // 如果当前队尾已经存在(tail!=null)，则使用CAS把当前线程更新为Tail。
      if (pred != null) { // 先设置 prev, 后设置 next, 这样, 当另外的线程在调用 next 的时候, prev一定已经设置好了.
         node.prev = pred;
         if (compareAndSetTail(pred, node)) {
               pred.next = node;
               return node;
         }
      }
      // 如果当前Tail为null或则线程调用CAS设置队尾失败，则通过enq方法通过自旋来设置Tail
      enq(node);
      return node;
   }

   // 将节点插入到队列, 如果必要的话, 则进行初始化
   // 该方法就是循环调用CAS，即使有高并发的场景，无限循环将会最终成功把当前线程追加到队尾（或设置队头）。
   private Node enq(final Node node) {
      for (;;) { // 自旋
         Node t = tail;
         if (t == null) { // Must initialize
            // 如果尾节点为空, 则初始化头节点和尾节点.
            if (compareAndSetHead(new Node()))
               tail = head;
         } else {
            node.prev = t;
            if (compareAndSetTail(t, node)) {
               t.next = node;
               return t;
            }
         }
      }
   }

   // acquireQueued的主要作用是把已经追加到队列的线程节点（addWaiter方法返回值）进行阻塞，但阻塞前又通过tryAccquire重试是否能获得锁，如果重试成功能则无需阻塞，这里是非公平锁的由来之二
   // node 是插入节点后的线程, 插入进来之后, 试图先进行一次获取锁操作, 获取失败的话, 则线程阻塞.
   final boolean acquireQueued(final Node node, int arg) {
      boolean failed = true;
      try {
         boolean interrupted = false;
         for (;;) {
            // 尝试去获得🔒
            final Node p = node.predecessor();
            if (p == head && tryAcquire(arg)) {
               // 如果获取成功, 则将
               setHead(node);
               p.next = null; // help GC
               failed = false;
               return interrupted;
            }
            // 如果没有获取到锁, 则将线程阻塞
            if (shouldParkAfterFailedAcquire(p, node) &&
               parkAndCheckInterrupt())
               interrupted = true;
         }
      } finally {
         if (failed)
               cancelAcquire(node);
      }
   }


   /**
   * 总体看来，shouldParkAfterFailedAcquire就是靠前继节点判断当前线程是否应该被阻塞，如果前继节点处于CANCELLED状态，则顺便删除这些节点重新构造队列。
   *
   * Checks and updates status for a node that failed to acquire.
   * Returns true if thread should block. This is the main signal
   * control in all acquire loops.  Requires that pred == node.prev.
   *
   * @param pred node's predecessor holding status
   * @param node the node
   * @return {@code true} if thread should block
   */
   private static boolean shouldParkAfterFailedAcquire(Node pred, Node node) {
      int ws = pred.waitStatus;
      if (ws == Node.SIGNAL)
         /*
            * This node has already set status asking a release
            * to signal it, so it can safely park.
            */
         return true;
      if (ws > 0) {
         // Predecessor was cancelled. Skip over predecessors and indicate retry.
         // 如果前继节点状态为CANCELLED(ws>0)，说明前置节点已经被放弃，则回溯到一个非取消的前继节点，返回false，acquireQueued方法的无限循环将递归调用该方法，直至规则1返回true，导致线程阻塞
         do {
               node.prev = pred = pred.prev;
         } while (pred.waitStatus > 0);
         pred.next = node;
      } else {
         /*
            * waitStatus must be 0 or PROPAGATE.  Indicate that we
            * need a signal, but don't park yet.  Caller will need to
            * retry to make sure it cannot acquire before parking.
            */
         // 如果前继节点状态为非SIGNAL、非CANCELLED，则设置前继的状态为SIGNAL，返回false后进入acquireQueued的无限循环，与规则2同
         compareAndSetWaitStatus(pred, ws, Node.SIGNAL);
      }
      return false;
   }


   //ThreadB、 ThreadC、ThreadD、ThreadE -> 都会阻塞在下面这个代码的位置.
   private final boolean parkAndCheckInterrupt() {
      LockSupport.park(this); //被唤醒. (interrupt()->)
      return Thread.interrupted(); //中断状态（是否因为中断被唤醒的.）
   }
```

## unlock方法

```java
   // ReentrantLock
   public void unlock() {
      sync.release(1);
   }

   // AbstractQueuedSynchronizer.java
   public final boolean release(int arg) {
      if (tryRelease(arg)) {
         //得到当前AQS队列中的head节点。
         Node h = head;
         if (h != null && h.waitStatus != 0)
               unparkSuccessor(h);
         return true;
      }
      return false;
   }

   /**
   * Wakes up node's successor, if one exists.
   *
   * @param node the node
   */
   private void unparkSuccessor(Node node) {
      int ws = node.waitStatus;
      // 表示可以唤醒状态
      if (ws < 0)
         //恢复成0
         compareAndSetWaitStatus(node, ws, 0);

      Node s = node.next;
      // 说明ThreadB这个线程可能已经被销毁，或者出现异常...
      if (s == null || s.waitStatus > 0) {
         s = null;
         // 从tail -> head进行遍历.
         for (Node t = tail; t != null && t != node; t = t.prev)
               // 查找到小于等于0的节点
               if (t.waitStatus <= 0)
                  s = t;
      }
      if (s != null)
         // 封装在Node中的被阻塞的线程
         LockSupport.unpark(s.thread);
   }
```
