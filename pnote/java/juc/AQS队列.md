# AQS 队列

> https://blog.csdn.net/qq_45827239/article/details/106753122

AQS 主要通过维护了两个变量来实现同步机制的

1. state

   jdk 中源码

   ```java
   /**
    * The synchronization state.
    */
   // state 大于0表示 获得了锁, 等于0则表示没有获取到锁.
   private volatile int state;

   protected final int getState() {
      return state;
   }
   protected final void setState(int newState) {
      state = newState;
   }
   protected final boolean compareAndSetState(int expect, int update) {
      // See below for intrinsics setup to support this
      return unsafe.compareAndSwapInt(this, stateOffset, expect, update);
   }
   ```

2. FIFO同步队列

   AQS通过内置的FIFO同步队列，来实现线程的排队工作。

   如果线程获取当前同步状态失败，AQS会将当前线程的信息封装成一个Node节点，加入同步队列中，并且阻塞该线程，当同步状态释放，则会将队列中的线程唤醒，重新尝试获取同步状态。

   ```java
   static final class Node {
      /** Marker to indicate a node is waiting in shared mode */
      static final Node SHARED = new Node();
      /** Marker to indicate a node is waiting in exclusive mode */
      static final Node EXCLUSIVE = null;

      /** waitStatus value to indicate thread has cancelled */
      // 因为超时或中断，状态位倍设置为取消，该线程不能去竞争锁，也不能转换为其他状态；被检测到之后会被踢出同步队列，被GC回收。
      static final int CANCELLED =  1;
      /** waitStatus value to indicate successor's thread needs unparking */
      // 该节点的后继节点被阻塞，到时需要唤醒
      static final int SIGNAL    = -1;
      /** waitStatus value to indicate thread is waiting on condition */
      // 该节点在条件队列中（condition），因为等待条件而阻塞。
      static final int CONDITION = -2;
      /**
      * waitStatus value to indicate the next acquireShared should
      * unconditionally propagate
      * 使用在共享模式的头节点可能处于此状态，表示锁的下一次获取可以无条件传播。
      */
      static final int PROPAGATE = -3;

      volatile int waitStatus;

      volatile Node prev;

      volatile Node next;

      volatile Thread thread;

      Node nextWaiter;

      /**
      * Returns true if node is waiting in shared mode.
      */
      final boolean isShared() {
         return nextWaiter == SHARED;
      }

      /**
      * Returns previous node, or throws NullPointerException if null.
      * Use when predecessor cannot be null.  The null check could
      * be elided, but is present to help the VM.
      *
      * @return the predecessor of this node
      */
      final Node predecessor() throws NullPointerException {
         Node p = prev;
         if (p == null)
               throw new NullPointerException();
         else
               return p;
      }

      Node() {    // Used to establish initial head or SHARED marker
      }

      Node(Thread thread, Node mode) {     // Used by addWaiter
         this.nextWaiter = mode;
         this.thread = thread;
      }

      Node(Thread thread, int waitStatus) { // Used by Condition
         this.waitStatus = waitStatus;
         this.thread = thread;
      }
   }

   ```

## AQS 继承

1. AQS实现的独占锁有ReentrantLock，共享锁有Semaphore，CountDownlatch,CycleBarrier。

---

1. 要实现一个独占锁，需要重写tryAcquire，tryRelease方法

   Acquire: tryAcquire(尝试获取锁）、addWaiter(入队)、acquireQueued(队列中的线程循环获取锁，失败则挂起shouldParkAfterFailedAcquire)。

   Release：tryRelease(尝试释放锁)、unparkSuccessor(唤醒后继节点)。

2. 要实现共享锁，需要重写tryAcquireShared、tryReleaseShared
   
   AcquireShared：tryAcquireShared，doAcquireShared。

   RealseShared：tryRealseShared、doReleaseShared。
