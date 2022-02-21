# 类分享: 可控制的循环线程

> `CtrlLoopThreadComp` 是我在处理异步信息的时候封装的一个线程类, 简单来说就是对一个方法进行循环调用.

## 普通线程里面加 while 循环

我在开发的时候遇到一些在线程里面加while循环的例子, 如下

   ```java
   @Test
   public void baseWhileTest() {
      Runnable runnable =  () -> {
         while (!Thread.currentThread().isInterrupted()) {
               // 执行相关逻辑
               log.info("执行相关逻辑");
               try {
                  // 防止 CPU 被打满
                  Thread.sleep(500);
               } catch (InterruptedException e) {
                  Thread.currentThread().interrupt();
                  log.info("线程从睡眠中唤醒");
               }
         }
         log.info("线程结束");
      };

      // 启动线程
      final Thread thread = new Thread(runnable, "while 循环线程");
      thread.start();

      // 一段时间后(5000毫秒后)暂停
      Throws.con(5000, Thread::sleep).logThrowable();
      thread.interrupt();
   }
   ```

   运行结果

   ```log
   [INFO] 2022-02-20 22:02:20.260 [while 循环线程] (CtrlLoopThreadCompTest.java:168) 执行相关逻辑
   [INFO] 2022-02-20 22:02:20.769 [while 循环线程] (CtrlLoopThreadCompTest.java:168) 执行相关逻辑
   [INFO] 2022-02-20 22:02:21.284 [while 循环线程] (CtrlLoopThreadCompTest.java:168) 执行相关逻辑
   [INFO] 2022-02-20 22:02:21.803 [while 循环线程] (CtrlLoopThreadCompTest.java:168) 执行相关逻辑
   [INFO] 2022-02-20 22:02:22.314 [while 循环线程] (CtrlLoopThreadCompTest.java:168) 执行相关逻辑
   [INFO] 2022-02-20 22:02:22.828 [while 循环线程] (CtrlLoopThreadCompTest.java:168) 执行相关逻辑
   [INFO] 2022-02-20 22:02:23.330 [while 循环线程] (CtrlLoopThreadCompTest.java:168) 执行相关逻辑
   [INFO] 2022-02-20 22:02:23.837 [while 循环线程] (CtrlLoopThreadCompTest.java:168) 执行相关逻辑
   [INFO] 2022-02-20 22:02:24.338 [while 循环线程] (CtrlLoopThreadCompTest.java:168) 执行相关逻辑
   [INFO] 2022-02-20 22:02:24.839 [while 循环线程] (CtrlLoopThreadCompTest.java:168) 执行相关逻辑
   [INFO] 2022-02-20 22:02:25.267 [while 循环线程] (CtrlLoopThreadCompTest.java:174) 线程从睡眠中唤醒
   [INFO] 2022-02-20 22:02:25.267 [while 循环线程] (CtrlLoopThreadCompTest.java:177) 线程结束
   ```

上面是一个相当简单的例子，但事实上遇到的并没有这么简单，尤其是业余进行swing开发的时候，循环对消息事件进行处理的时候，就需要这个线程一会正常循环运行，一会暂停处理相关消息。还有的需要执行几次循环后暂停等等各种操作。

于是便封装了一个 `CtrlLoopThreadComp` 类，专门处理这种使用一个异步线程，额外去循环调用方法的操作。

### `CtrlLoopThreadComp` 的循环调用代码

如下，就是使用 `CtrlLoopThreadComp` 类对上面的`线程里面加while循环`的代码的转译.


   ```java
   @Test
   public void CoBaseTest1() {
      final CtrlLoopThreadComp threadComp = CtrlLoopThreadComp.ofRunnable(() -> {
            log.info("执行相关逻辑");
         })
         // 执行出现异常则继续下一次执行
         .catchFun(CtrlLoopThreadComp.CATCH_FUNCTION_CONTINUE)
         // 每 500 毫秒执行一次
         .setMillisecond(500)
         // 线程名称名为 COM-RUN
         .setName("可循环控制线程");

      // 启动线程
      log.info(" ======> 启动线程");
      threadComp.start();

      // 一段时间后(5000毫秒后)暂停
      Throws.con(5000, Thread::sleep).logThrowable();
      thread.interrupt();
   }
   ```

   运行结果

   ```log
   [INFO] 2022-02-20 21:59:56.414 [main] (CtrlLoopThreadCompTest.java:204)  ======> 启动线程
   [DEBUG] 2022-02-20 21:59:56.414 [可循环控制线程] (CtrlLoopThreadComp.java:425) CtrlLoopThread [可循环控制线程] start!!!
   [INFO] 2022-02-20 21:59:56.414 [可循环控制线程] (CtrlLoopThreadCompTest.java:194) 执行相关逻辑
   [INFO] 2022-02-20 21:59:56.928 [可循环控制线程] (CtrlLoopThreadCompTest.java:194) 执行相关逻辑
   [INFO] 2022-02-20 21:59:57.443 [可循环控制线程] (CtrlLoopThreadCompTest.java:194) 执行相关逻辑
   [INFO] 2022-02-20 21:59:57.944 [可循环控制线程] (CtrlLoopThreadCompTest.java:194) 执行相关逻辑
   [INFO] 2022-02-20 21:59:58.450 [可循环控制线程] (CtrlLoopThreadCompTest.java:194) 执行相关逻辑
   [INFO] 2022-02-20 21:59:58.960 [可循环控制线程] (CtrlLoopThreadCompTest.java:194) 执行相关逻辑
   [INFO] 2022-02-20 21:59:59.466 [可循环控制线程] (CtrlLoopThreadCompTest.java:194) 执行相关逻辑
   [INFO] 2022-02-20 21:59:59.976 [可循环控制线程] (CtrlLoopThreadCompTest.java:194) 执行相关逻辑
   [INFO] 2022-02-20 22:00:00.490 [可循环控制线程] (CtrlLoopThreadCompTest.java:194) 执行相关逻辑
   [INFO] 2022-02-20 22:00:00.991 [可循环控制线程] (CtrlLoopThreadCompTest.java:194) 执行相关逻辑
   [DEBUG] 2022-02-20 22:00:01.424 [可循环控制线程] (CtrlLoopThreadComp.java:501) CtrlLoopThread [可循环控制线程] was interrupted during sleep
   [DEBUG] 2022-02-20 22:00:01.424 [可循环控制线程] (CtrlLoopThreadComp.java:506) CtrlLoopThread [可循环控制线程] end!!!
   ```

当然它的功能也不可能这么简单, 它的一个好用的地方就是下面的控制的过程

### `CtrlLoopThreadComp` 线程控制方法

| 方法                      | 描述                                                                                     |
| :------------------------ | :--------------------------------------------------------------------------------------- |
| `pause()`                 | 线程在调用完当前 loop 循环后, 暂停                                                       |
| `pause(long)`             | 线程在调用完当前 loop 循环后, 暂停`long`毫秒后自动恢复, 其中使用的是 `wait(long)`        |
| `pauseAfterLoopTime(int)` | 线程接下来执行`int`次 loop 循环后, 暂停.                                                 |
| `wake()`                  | 线程在暂停的状态下恢复 `loop` 循环调用                                                   |
| `startOrWake()`           | 线程启动或恢复, 若是内置线程没有启动的情况下启动内置线程, 若是暂停状态下则对线程进行唤醒 |
| `close()`                 | 线程结束当前 loop 循环之后, 线程关闭                                                     |
| `start()`                 | 内置线程启动, 直接调用的`thread.start()` 方法, 二次调用会抛出异常.                       |
| `startIfNotStart()`       | 如果内置线程没有启动的时候启动, 可以多次调用, 但是只有第一次生效.                        |

### 线程控制方法测试

   ```java
   /**
   * 基础功能测试
   */
   @Test
   public void baseTest() {
      final CtrlLoopThreadComp threadComp = CtrlLoopThreadComp.ofRunnable(() -> {
                  final String s = UUID.randomUUID().toString();
                  log.info("-----------------------开始执行线程方法 : {}", s);
                  // 睡眠 200 毫秒, 睡眠期间有异常则直接转换为 RuntimeException 抛出
                  Throws.con(200, Thread::sleep).runtimeExp();
                  log.info("-----------------------结束执行线程方法 : {}", s);
               })
               // 执行出现异常则继续下一次执行
               .catchFun(CtrlLoopThreadComp.CATCH_FUNCTION_CONTINUE)
               // 每 100 毫秒执行一次
               .setMillisecond(300)
               // 线程名称名为 COM-RUN
               .setName("可循环控制线程 1");
      // 启动线程
      log.info(" ======> 启动循环线程");
      threadComp.start();
      Throws.con(2000, Thread::sleep).runtimeExp();

      log.info(" ======> 暂停循环线程");
      threadComp.pause();
      Throws.con(2000, Thread::sleep).runtimeExp();

      log.info(" ======> 启动或唤醒循环线程, 1秒后再次暂停");
      threadComp.startOrWake();
      threadComp.pause(1000);
      Throws.con(2000, Thread::sleep).runtimeExp();

      log.info(" ======> 启动循环线程, 再执行 5 次循环后自动暂停");
      threadComp.pauseAfterLoopTime(5);
      Throws.con(5000, Thread::sleep).runtimeExp();

      log.info(" ======> 启动或唤醒循环线程, 2秒后 线程关闭");
      threadComp.startOrWake();
      Throws.con(2000, Thread::sleep).runtimeExp();
      threadComp.close();
   }
   ```

   运行结果

   ```log
   [INFO] 2022-02-20 22:09:39.257 [main] (CtrlLoopThreadCompTest.java:45)  ======> 启动循环线程
   [DEBUG] 2022-02-20 22:09:39.267 [可循环控制线程 1] (CtrlLoopThreadComp.java:425) CtrlLoopThread [可循环控制线程 1] start!!!
   [INFO] 2022-02-20 22:09:39.366 [可循环控制线程 1] (CtrlLoopThreadCompTest.java:33) -----------------------开始执行线程方法 : 17947299-b4e2-4c76-a25d-bdab500cde0a
   [INFO] 2022-02-20 22:09:39.582 [可循环控制线程 1] (CtrlLoopThreadCompTest.java:36) -----------------------结束执行线程方法 : 17947299-b4e2-4c76-a25d-bdab500cde0a
   [INFO] 2022-02-20 22:09:39.883 [可循环控制线程 1] (CtrlLoopThreadCompTest.java:33) -----------------------开始执行线程方法 : b1f9853e-d560-4430-8a1f-b2ab22f2891c
   [INFO] 2022-02-20 22:09:40.098 [可循环控制线程 1] (CtrlLoopThreadCompTest.java:36) -----------------------结束执行线程方法 : b1f9853e-d560-4430-8a1f-b2ab22f2891c
   [INFO] 2022-02-20 22:09:40.403 [可循环控制线程 1] (CtrlLoopThreadCompTest.java:33) -----------------------开始执行线程方法 : ca4b0fb6-863e-45e2-90e5-71960bdd24cf
   [INFO] 2022-02-20 22:09:40.619 [可循环控制线程 1] (CtrlLoopThreadCompTest.java:36) -----------------------结束执行线程方法 : ca4b0fb6-863e-45e2-90e5-71960bdd24cf
   [INFO] 2022-02-20 22:09:40.920 [可循环控制线程 1] (CtrlLoopThreadCompTest.java:33) -----------------------开始执行线程方法 : 3778424d-5ad2-44c3-b93b-7fda3657b964
   [INFO] 2022-02-20 22:09:41.136 [可循环控制线程 1] (CtrlLoopThreadCompTest.java:36) -----------------------结束执行线程方法 : 3778424d-5ad2-44c3-b93b-7fda3657b964
   [INFO] 2022-02-20 22:09:41.278 [main] (CtrlLoopThreadCompTest.java:49)  ======> 暂停循环线程
   [DEBUG] 2022-02-20 22:09:41.441 [可循环控制线程 1] (CtrlLoopThreadComp.java:448) CtrlLoopThread [可循环控制线程 1] pause!!!
   [INFO] 2022-02-20 22:09:43.293 [main] (CtrlLoopThreadCompTest.java:53)  ======> 启动或唤醒循环线程, 1秒后再次暂停
   [DEBUG] 2022-02-20 22:09:43.293 [可循环控制线程 1] (CtrlLoopThreadComp.java:466) CtrlLoopThread [可循环控制线程 1] wake!!!
   [DEBUG] 2022-02-20 22:09:43.293 [可循环控制线程 1] (CtrlLoopThreadComp.java:448) CtrlLoopThread [可循环控制线程 1] pause!!!
   [DEBUG] 2022-02-20 22:09:44.308 [可循环控制线程 1] (CtrlLoopThreadComp.java:466) CtrlLoopThread [可循环控制线程 1] wake!!!
   [INFO] 2022-02-20 22:09:44.308 [可循环控制线程 1] (CtrlLoopThreadCompTest.java:33) -----------------------开始执行线程方法 : ef85de83-f102-44b1-bc99-01b7a30962c6
   [INFO] 2022-02-20 22:09:44.511 [可循环控制线程 1] (CtrlLoopThreadCompTest.java:36) -----------------------结束执行线程方法 : ef85de83-f102-44b1-bc99-01b7a30962c6
   [INFO] 2022-02-20 22:09:44.828 [可循环控制线程 1] (CtrlLoopThreadCompTest.java:33) -----------------------开始执行线程方法 : f8b60de6-d2ab-43b5-9510-4a22bd1646c4
   [INFO] 2022-02-20 22:09:45.028 [可循环控制线程 1] (CtrlLoopThreadCompTest.java:36) -----------------------结束执行线程方法 : f8b60de6-d2ab-43b5-9510-4a22bd1646c4
   [INFO] 2022-02-20 22:09:45.307 [main] (CtrlLoopThreadCompTest.java:58)  ======> 启动循环线程, 再执行 5 次循环后自动暂停
   [INFO] 2022-02-20 22:09:45.348 [可循环控制线程 1] (CtrlLoopThreadCompTest.java:33) -----------------------开始执行线程方法 : 7c55f307-1725-417a-a882-e2fd7f9ff6c2
   [INFO] 2022-02-20 22:09:45.551 [可循环控制线程 1] (CtrlLoopThreadCompTest.java:36) -----------------------结束执行线程方法 : 7c55f307-1725-417a-a882-e2fd7f9ff6c2
   [INFO] 2022-02-20 22:09:45.852 [可循环控制线程 1] (CtrlLoopThreadCompTest.java:33) -----------------------开始执行线程方法 : d1267012-930e-4d62-aac1-656ec014cbb7
   [INFO] 2022-02-20 22:09:46.052 [可循环控制线程 1] (CtrlLoopThreadCompTest.java:36) -----------------------结束执行线程方法 : d1267012-930e-4d62-aac1-656ec014cbb7
   [INFO] 2022-02-20 22:09:46.356 [可循环控制线程 1] (CtrlLoopThreadCompTest.java:33) -----------------------开始执行线程方法 : fdce9373-cb38-4fc7-8aef-9aa513147411
   [INFO] 2022-02-20 22:09:46.563 [可循环控制线程 1] (CtrlLoopThreadCompTest.java:36) -----------------------结束执行线程方法 : fdce9373-cb38-4fc7-8aef-9aa513147411
   [INFO] 2022-02-20 22:09:46.864 [可循环控制线程 1] (CtrlLoopThreadCompTest.java:33) -----------------------开始执行线程方法 : 7f13ee60-8415-4a40-ad88-217145561956
   [INFO] 2022-02-20 22:09:47.064 [可循环控制线程 1] (CtrlLoopThreadCompTest.java:36) -----------------------结束执行线程方法 : 7f13ee60-8415-4a40-ad88-217145561956
   [INFO] 2022-02-20 22:09:47.384 [可循环控制线程 1] (CtrlLoopThreadCompTest.java:33) -----------------------开始执行线程方法 : 24033216-67bd-43b7-ad96-7d602f90b87e
   [INFO] 2022-02-20 22:09:47.591 [可循环控制线程 1] (CtrlLoopThreadCompTest.java:36) -----------------------结束执行线程方法 : 24033216-67bd-43b7-ad96-7d602f90b87e
   [DEBUG] 2022-02-20 22:09:47.892 [可循环控制线程 1] (CtrlLoopThreadComp.java:448) CtrlLoopThread [可循环控制线程 1] pause!!!
   [INFO] 2022-02-20 22:09:50.321 [main] (CtrlLoopThreadCompTest.java:62)  ======> 启动或唤醒循环线程, 2秒后 线程关闭
   [DEBUG] 2022-02-20 22:09:50.321 [可循环控制线程 1] (CtrlLoopThreadComp.java:466) CtrlLoopThread [可循环控制线程 1] wake!!!
   [INFO] 2022-02-20 22:09:50.321 [可循环控制线程 1] (CtrlLoopThreadCompTest.java:33) -----------------------开始执行线程方法 : f70f0969-a240-4208-abac-2a0dfd1fed8d
   [INFO] 2022-02-20 22:09:50.521 [可循环控制线程 1] (CtrlLoopThreadCompTest.java:36) -----------------------结束执行线程方法 : f70f0969-a240-4208-abac-2a0dfd1fed8d
   [INFO] 2022-02-20 22:09:50.822 [可循环控制线程 1] (CtrlLoopThreadCompTest.java:33) -----------------------开始执行线程方法 : f4908c34-f773-46f4-b56b-d451bb0afe3a
   [INFO] 2022-02-20 22:09:51.023 [可循环控制线程 1] (CtrlLoopThreadCompTest.java:36) -----------------------结束执行线程方法 : f4908c34-f773-46f4-b56b-d451bb0afe3a
   [INFO] 2022-02-20 22:09:51.341 [可循环控制线程 1] (CtrlLoopThreadCompTest.java:33) -----------------------开始执行线程方法 : bda3e0fc-f40b-4241-bc5d-6c578011956b
   [INFO] 2022-02-20 22:09:51.548 [可循环控制线程 1] (CtrlLoopThreadCompTest.java:36) -----------------------结束执行线程方法 : bda3e0fc-f40b-4241-bc5d-6c578011956b
   [INFO] 2022-02-20 22:09:51.849 [可循环控制线程 1] (CtrlLoopThreadCompTest.java:33) -----------------------开始执行线程方法 : 02d70f5c-be3e-446d-b61f-9bce3313275f
   [INFO] 2022-02-20 22:09:52.049 [可循环控制线程 1] (CtrlLoopThreadCompTest.java:36) -----------------------结束执行线程方法 : 02d70f5c-be3e-446d-b61f-9bce3313275f
   [DEBUG] 2022-02-20 22:09:52.326 [可循环控制线程 1] (CtrlLoopThreadComp.java:501) CtrlLoopThread [可循环控制线程 1] was interrupted during sleep
   [DEBUG] 2022-02-20 22:09:52.326 [可循环控制线程 1] (CtrlLoopThreadComp.java:506) CtrlLoopThread [可循环控制线程 1] end!!!
   ```

### `CtrlLoopThreadComp` 实现异步消息队列处理1

   简单的异步处理队列

   ```java
   // 异步消息队列
   private final BlockingQueue<String> blockingQueue = new LinkedBlockingQueue<>(1000);

   /**
   * 异步消息处理测试
   */
   @Test
   public void asynchronousQueueTest() {
      // 异步处理器
      final CtrlLoopThreadComp threadComp = CtrlLoopThreadComp.ofRunnable(() -> {
                  try {
                     String str = blockingQueue.take();
                     log.info("异步线程打印信息 : {}", str);
                  } catch (InterruptedException e) {
                     e.printStackTrace();
                  }
               })
               // 执行出现异常则继续下一次执行
               .catchFun(CtrlLoopThreadComp.CATCH_FUNCTION_CONTINUE)
               .setMillisecond(0)
               .setName("异步处理线程");
      threadComp.start();

      // 即时往队列里面添加消息, 异步处理线程即时处理
      blockingQueue.add("消息1");
      blockingQueue.add("消息2");
      blockingQueue.add("消息3");
      blockingQueue.add("消息4");
      blockingQueue.add("消息5");

      // 主线程睡眠 10 毫秒, 方便队列消息能够处理完成
      Throws.con(10, Thread::sleep).logThrowable();
   }
   ```

   打印日志

   ```log
   [INFO] 2022-02-20 22:17:55.424 [异步处理线程] (CtrlLoopThreadCompTest.java:189) 异步线程打印信息 : 消息1
   [INFO] 2022-02-20 22:17:55.424 [异步处理线程] (CtrlLoopThreadCompTest.java:189) 异步线程打印信息 : 消息2
   [INFO] 2022-02-20 22:17:55.424 [异步处理线程] (CtrlLoopThreadCompTest.java:189) 异步线程打印信息 : 消息3
   [INFO] 2022-02-20 22:17:55.424 [异步处理线程] (CtrlLoopThreadCompTest.java:189) 异步线程打印信息 : 消息4
   [INFO] 2022-02-20 22:17:55.424 [异步处理线程] (CtrlLoopThreadCompTest.java:189) 异步线程打印信息 : 消息5
   ```

### `CtrlLoopThreadComp` 实现异步消息队列处理2

   实现先异步处理6条消息, 之后暂停, 再唤醒

   ```java
   // 异步消息队列
   private final BlockingQueue<String> blockingQueue = new LinkedBlockingQueue<>(1000);

   /**
   * 异步消息处理测试2
   */
   @Test
   public void asynchronousQueueTest2() {
      // 异步处理器
      final CtrlLoopThreadComp threadComp = CtrlLoopThreadComp.ofRunnable(() -> {
                  try {
                     String str = blockingQueue.take();
                     log.info("异步线程打印信息 : {}", str);
                  } catch (InterruptedException e) {
                     e.printStackTrace();
                  }
               })
               // 执行出现异常则继续下一次执行
               .catchFun(CtrlLoopThreadComp.CATCH_FUNCTION_CONTINUE)
               .setMillisecond(0)
               .setName("异步处理线程");

      // 处理 6 条消息后暂停
      threadComp.pauseAfterLoopTime(6);
      threadComp.start();

      // 即时往队列里面添加消息, 异步处理线程即时处理
      blockingQueue.add("消息1");
      blockingQueue.add("消息2");
      blockingQueue.add("消息3");
      blockingQueue.add("消息4");
      blockingQueue.add("消息5");
      blockingQueue.add("消息6");
      blockingQueue.add("消息7");
      blockingQueue.add("消息8");
      blockingQueue.add("消息9");
      blockingQueue.add("消息10");

      Throws.con(2000, Thread::sleep).logThrowable();
      log.info("发现继续添加消息，不再进行处理");

      log.info("启动线程后继续处理消息");
      threadComp.wake();

      Throws.con(10, Thread::sleep).logThrowable();
   }
   ```

   打印日志

   ```log
   [INFO] 2022-02-20 22:21:45.235 [异步处理线程] (CtrlLoopThreadCompTest.java:221) 异步线程打印信息 : 消息1
   [INFO] 2022-02-20 22:21:45.235 [异步处理线程] (CtrlLoopThreadCompTest.java:221) 异步线程打印信息 : 消息2
   [INFO] 2022-02-20 22:21:45.235 [异步处理线程] (CtrlLoopThreadCompTest.java:221) 异步线程打印信息 : 消息3
   [INFO] 2022-02-20 22:21:45.235 [异步处理线程] (CtrlLoopThreadCompTest.java:221) 异步线程打印信息 : 消息4
   [INFO] 2022-02-20 22:21:45.235 [异步处理线程] (CtrlLoopThreadCompTest.java:221) 异步线程打印信息 : 消息5
   [INFO] 2022-02-20 22:21:45.235 [异步处理线程] (CtrlLoopThreadCompTest.java:221) 异步线程打印信息 : 消息6
   [DEBUG] 2022-02-20 22:21:45.235 [异步处理线程] (CtrlLoopThreadComp.java:448) CtrlLoopThread [异步处理线程] pause!!!
   [INFO] 2022-02-20 22:21:47.239 [main] (CtrlLoopThreadCompTest.java:248) 发现继续添加消息，不再进行处理
   [INFO] 2022-02-20 22:21:47.239 [main] (CtrlLoopThreadCompTest.java:250) 启动线程后继续处理消息
   [DEBUG] 2022-02-20 22:21:47.239 [异步处理线程] (CtrlLoopThreadComp.java:466) CtrlLoopThread [异步处理线程] wake!!!
   [INFO] 2022-02-20 22:21:47.239 [异步处理线程] (CtrlLoopThreadCompTest.java:221) 异步线程打印信息 : 消息7
   [INFO] 2022-02-20 22:21:47.239 [异步处理线程] (CtrlLoopThreadCompTest.java:221) 异步线程打印信息 : 消息8
   [INFO] 2022-02-20 22:21:47.239 [异步处理线程] (CtrlLoopThreadCompTest.java:221) 异步线程打印信息 : 消息9
   [INFO] 2022-02-20 22:21:47.239 [异步处理线程] (CtrlLoopThreadCompTest.java:221) 异步线程打印信息 : 消息10
   ```

### 并发测试

   `pause()`, `startOrWake()`, `.wake()`等方法都是可以在多线程之中重复调用的.

   并发调用 `pause()`, `startOrWake()`, `.wake()`, 看下执行逻辑是否出错

   代码如下

   ```java
   /**
   * 并发调用几个方法, 看下执行逻辑是否出错
   */
   @Test
   public void ConcurrentTest() throws InterruptedException {
      final CtrlLoopThreadComp threadComp = CtrlLoopThreadComp.ofRunnable(() -> {
                  final String s = UUID.randomUUID().toString();
                  log.info("-----------------------开始执行线程方法 : {}", s);
                  // 睡眠 200 毫秒, 睡眠期间有异常则直接转换为 RuntimeException 抛出
                  Throws.con(RandomUtils.nextInt(0, 3), Thread::sleep).runtimeExp();
                  log.info("-----------------------结束执行线程方法 : {}", s);
               })
               // 执行出现异常则继续下一次执行
               .catchFun(CtrlLoopThreadComp.CATCH_FUNCTION_CONTINUE)
               // 每 100 毫秒执行一次
               .setMillisecond(100)
               // 线程名称名为 COM-RUN
               .setName("可循环控制线程 2");
      // 启动线程
      log.info(" ======> 启动线程");
      threadComp.start();

      final int loop = 100000;
      CountDownLatch countDownLatch = new CountDownLatch(loop);
      IntStream.range(0, loop).parallel().forEach(num -> {
         final int i = RandomUtils.nextInt(0, 5);
         switch (i) {
               case 0:
                  threadComp.pause();
                  break;
               case 1:
                  threadComp.startOrWake();
                  break;
               case 2:
                  threadComp.pause(1);
                  break;
               case 3:
                  threadComp.pause();
                  Throws.con(1, Thread::sleep).runtimeExp();
                  threadComp.wake();
                  break;
               case 4:
                  threadComp.startIfNotStart();
                  break;
               default:
         }
         countDownLatch.countDown();
      });

      countDownLatch.await();
      log.info(" ======> 执行完毕关闭线程");
      threadComp.close();
      threadComp.close();
   }
   ```

   执行日志如下

   > - 100000 次并发, 执行逻辑并没有出错
   > - 注意: 由于日志较多, 删除了一些日志.

   ```log
   [INFO] 2022-02-20 22:26:35.150 [main] (CtrlLoopThreadCompTest.java:87)  ======> 启动线程
   [DEBUG] 2022-02-20 22:26:35.150 [可循环控制线程 2] (CtrlLoopThreadComp.java:425) CtrlLoopThread [可循环控制线程 2] start!!!
   [INFO] 2022-02-20 22:26:35.273 [可循环控制线程 2] (CtrlLoopThreadCompTest.java:75) -----------------------开始执行线程方法 : 480d8b3c-80ba-4a8e-bce3-17debf5401d7
   [INFO] 2022-02-20 22:26:35.276 [可循环控制线程 2] (CtrlLoopThreadCompTest.java:78) -----------------------结束执行线程方法 : 480d8b3c-80ba-4a8e-bce3-17debf5401d7
   [DEBUG] 2022-02-20 22:26:35.377 [可循环控制线程 2] (CtrlLoopThreadComp.java:448) CtrlLoopThread [可循环控制线程 2] pause!!!
   [DEBUG] 2022-02-20 22:26:35.378 [可循环控制线程 2] (CtrlLoopThreadComp.java:466) CtrlLoopThread [可循环控制线程 2] wake!!!
   [INFO] 2022-02-20 22:26:35.378 [可循环控制线程 2] (CtrlLoopThreadCompTest.java:75) -----------------------开始执行线程方法 : 3d4e9b6b-6812-4ac0-b860-a4bb373b1769
   [INFO] 2022-02-20 22:26:35.381 [可循环控制线程 2] (CtrlLoopThreadCompTest.java:78) -----------------------结束执行线程方法 : 3d4e9b6b-6812-4ac0-b860-a4bb373b1769
   [DEBUG] 2022-02-20 22:26:35.481 [可循环控制线程 2] (CtrlLoopThreadComp.java:448) CtrlLoopThread [可循环控制线程 2] pause!!!
   [DEBUG] 2022-02-20 22:26:35.482 [可循环控制线程 2] (CtrlLoopThreadComp.java:466) CtrlLoopThread [可循环控制线程 2] wake!!!
   [INFO] 2022-02-20 22:26:35.587 [可循环控制线程 2] (CtrlLoopThreadCompTest.java:75) -----------------------开始执行线程方法 : a0eaf9dd-3c38-492d-9651-969395572a03
   [INFO] 2022-02-20 22:26:35.590 [可循环控制线程 2] (CtrlLoopThreadCompTest.java:78) -----------------------结束执行线程方法 : a0eaf9dd-3c38-492d-9651-969395572a03
   [DEBUG] 2022-02-20 22:26:35.691 [可循环控制线程 2] (CtrlLoopThreadComp.java:448) CtrlLoopThread [可循环控制线程 2] pause!!!
   [DEBUG] 2022-02-20 22:26:35.692 [可循环控制线程 2] (CtrlLoopThreadComp.java:466) CtrlLoopThread [可循环控制线程 2] wake!!!
   [INFO] 2022-02-20 22:26:35.696 [可循环控制线程 2] (CtrlLoopThreadCompTest.java:75) -----------------------开始执行线程方法 : 98a8e1c2-c666-489e-a1a3-77081be2fc97
   [INFO] 2022-02-20 22:26:35.696 [可循环控制线程 2] (CtrlLoopThreadCompTest.java:78) -----------------------结束执行线程方法 : 98a8e1c2-c666-489e-a1a3-77081be2fc97
   [INFO] 2022-02-20 22:26:36.106 [可循环控制线程 2] (CtrlLoopThreadCompTest.java:75) -----------------------开始执行线程方法 : c578f927-4b28-4623-80ae-414fafcf3fab
   [INFO] 2022-02-20 22:26:36.108 [可循环控制线程 2] (CtrlLoopThreadCompTest.java:78) -----------------------结束执行线程方法 : c578f927-4b28-4623-80ae-414fafcf3fab
   [DEBUG] 2022-02-20 22:26:36.209 [可循环控制线程 2] (CtrlLoopThreadComp.java:448) CtrlLoopThread [可循环控制线程 2] pause!!!
   [DEBUG] 2022-02-20 22:26:36.210 [可循环控制线程 2] (CtrlLoopThreadComp.java:466) CtrlLoopThread [可循环控制线程 2] wake!!!
   [DEBUG] 2022-02-20 22:26:36.210 [可循环控制线程 2] (CtrlLoopThreadComp.java:448) CtrlLoopThread [可循环控制线程 2] pause!!!
   [DEBUG] 2022-02-20 22:26:36.210 [可循环控制线程 2] (CtrlLoopThreadComp.java:466) CtrlLoopThread [可循环控制线程 2] wake!!!
   [DEBUG] 2022-02-20 22:26:36.210 [可循环控制线程 2] (CtrlLoopThreadComp.java:448) CtrlLoopThread [可循环控制线程 2] pause!!!
   [DEBUG] 2022-02-20 22:26:36.212 [可循环控制线程 2] (CtrlLoopThreadComp.java:466) CtrlLoopThread [可循环控制线程 2] wake!!!
   [INFO] 2022-02-20 22:26:36.212 [可循环控制线程 2] (CtrlLoopThreadCompTest.java:75) -----------------------开始执行线程方法 : fafbbd4b-398b-4531-986e-95fd665def07
   [INFO] 2022-02-20 22:26:36.215 [可循环控制线程 2] (CtrlLoopThreadCompTest.java:78) -----------------------结束执行线程方法 : fafbbd4b-398b-4531-986e-95fd665def07
   [DEBUG] 2022-02-20 22:26:36.316 [可循环控制线程 2] (CtrlLoopThreadComp.java:448) CtrlLoopThread [可循环控制线程 2] pause!!!
   [DEBUG] 2022-02-20 22:26:36.317 [可循环控制线程 2] (CtrlLoopThreadComp.java:466) CtrlLoopThread [可循环控制线程 2] wake!!!
   [INFO] 2022-02-20 22:26:36.317 [可循环控制线程 2] (CtrlLoopThreadCompTest.java:75) -----------------------开始执行线程方法 : af5269ce-a1d0-4c3b-961e-432f9a5b2579
   [INFO] 2022-02-20 22:26:36.319 [可循环控制线程 2] (CtrlLoopThreadCompTest.java:78) -----------------------结束执行线程方法 : af5269ce-a1d0-4c3b-961e-432f9a5b2579
   [DEBUG] 2022-02-20 22:26:36.419 [可循环控制线程 2] (CtrlLoopThreadComp.java:448) CtrlLoopThread [可循环控制线程 2] pause!!!
   [DEBUG] 2022-02-20 22:26:36.420 [可循环控制线程 2] (CtrlLoopThreadComp.java:466) CtrlLoopThread [可循环控制线程 2] wake!!!
   [INFO] 2022-02-20 22:26:36.420 [可循环控制线程 2] (CtrlLoopThreadCompTest.java:75) -----------------------开始执行线程方法 : 7bfbd960-7693-40d9-9786-f63a5bdc8bd5
   [INFO] 2022-02-20 22:26:36.423 [可循环控制线程 2] (CtrlLoopThreadCompTest.java:78) -----------------------结束执行线程方法 : 7bfbd960-7693-40d9-9786-f63a5bdc8bd5
   [DEBUG] 2022-02-20 22:26:36.524 [可循环控制线程 2] (CtrlLoopThreadComp.java:448) CtrlLoopThread [可循环控制线程 2] pause!!!
   [DEBUG] 2022-02-20 22:26:36.525 [可循环控制线程 2] (CtrlLoopThreadComp.java:466) CtrlLoopThread [可循环控制线程 2] wake!!!
   [DEBUG] 2022-02-20 22:26:37.059 [可循环控制线程 2] (CtrlLoopThreadComp.java:448) CtrlLoopThread [可循环控制线程 2] pause!!!
   [DEBUG] 2022-02-20 22:26:37.060 [可循环控制线程 2] (CtrlLoopThreadComp.java:466) CtrlLoopThread [可循环控制线程 2] wake!!!
   [INFO] 2022-02-20 22:26:37.066 [可循环控制线程 2] (CtrlLoopThreadCompTest.java:75) -----------------------开始执行线程方法 : 40a19c65-5eda-4387-95cf-6b6c1fc65d32
   [INFO] 2022-02-20 22:26:37.068 [可循环控制线程 2] (CtrlLoopThreadCompTest.java:78) -----------------------结束执行线程方法 : 40a19c65-5eda-4387-95cf-6b6c1fc65d32
   [DEBUG] 2022-02-20 22:26:37.169 [可循环控制线程 2] (CtrlLoopThreadComp.java:448) CtrlLoopThread [可循环控制线程 2] pause!!!
   [DEBUG] 2022-02-20 22:26:37.170 [可循环控制线程 2] (CtrlLoopThreadComp.java:466) CtrlLoopThread [可循环控制线程 2] wake!!!
   [INFO] 2022-02-20 22:26:37.172 [可循环控制线程 2] (CtrlLoopThreadCompTest.java:75) -----------------------开始执行线程方法 : c4882072-43a9-4c4a-8c28-16b05a04ad33
   [INFO] 2022-02-20 22:26:37.174 [可循环控制线程 2] (CtrlLoopThreadCompTest.java:78) -----------------------结束执行线程方法 : c4882072-43a9-4c4a-8c28-16b05a04ad33
   [DEBUG] 2022-02-20 22:26:37.274 [可循环控制线程 2] (CtrlLoopThreadComp.java:448) CtrlLoopThread [可循环控制线程 2] pause!!!
   [DEBUG] 2022-02-20 22:26:37.275 [可循环控制线程 2] (CtrlLoopThreadComp.java:466) CtrlLoopThread [可循环控制线程 2] wake!!!
   [INFO] 2022-02-20 22:26:37.277 [可循环控制线程 2] (CtrlLoopThreadCompTest.java:75) -----------------------开始执行线程方法 : e3ae9eae-8f88-4834-9e3a-fad9708a80d0
   [INFO] 2022-02-20 22:26:37.279 [可循环控制线程 2] (CtrlLoopThreadCompTest.java:78) -----------------------结束执行线程方法 : e3ae9eae-8f88-4834-9e3a-fad9708a80d0
   [DEBUG] 2022-02-20 22:26:37.380 [可循环控制线程 2] (CtrlLoopThreadComp.java:448) CtrlLoopThread [可循环控制线程 2] pause!!!
   [DEBUG] 2022-02-20 22:26:37.595 [可循环控制线程 2] (CtrlLoopThreadComp.java:466) CtrlLoopThread [可循环控制线程 2] wake!!!
   [DEBUG] 2022-02-20 22:26:37.595 [可循环控制线程 2] (CtrlLoopThreadComp.java:448) CtrlLoopThread [可循环控制线程 2] pause!!!
   [DEBUG] 2022-02-20 22:26:37.595 [可循环控制线程 2] (CtrlLoopThreadComp.java:466) CtrlLoopThread [可循环控制线程 2] wake!!!
   [INFO] 2022-02-20 22:26:37.595 [可循环控制线程 2] (CtrlLoopThreadCompTest.java:75) -----------------------开始执行线程方法 : 7a12ef36-3a99-450d-a370-e9b00ff9bf70
   [INFO] 2022-02-20 22:26:37.596 [可循环控制线程 2] (CtrlLoopThreadCompTest.java:78) -----------------------结束执行线程方法 : 7a12ef36-3a99-450d-a370-e9b00ff9bf70
   [INFO] 2022-02-20 22:26:37.625 [main] (CtrlLoopThreadCompTest.java:118)  ======> 执行完毕关闭线程
   [DEBUG] 2022-02-20 22:26:37.625 [可循环控制线程 2] (CtrlLoopThreadComp.java:501) CtrlLoopThread [可循环控制线程 2] was interrupted during sleep
   [DEBUG] 2022-02-20 22:26:37.625 [可循环控制线程 2] (CtrlLoopThreadComp.java:506) CtrlLoopThread [可循环控制线程 2] end!!!
   ```

### 除此之外, 还有一些功能

首先，`CtrlLoopThreadComp.ofSupplier()` 方法可以传入一个 `Supplier` 作为loop循环.

在循环中, 若是 `Supplier` 返回true, 则表示正常执行, 若是返回 false, 则会调用 `falseFun` 传入的 `Consumer<CtrlComp> falseConsumer` 方法.

若是在循环中执行报错, 则会调用 `catchFun()` 传入的`BiConsumer<CtrlComp, RuntimeException> catchConsumer`方法.

在这两个方法里面, 均有一个 `CtrlComp` 对象用于控制内置线程的相关状态.

使用方式如下.

   ```java
   @Test
   public void asynchronousQueueTest3() {
      // 异步处理器
      final CtrlLoopThreadComp threadComp = CtrlLoopThreadComp.ofSupplier(() -> {
                  String str = "";
                  try {
                        str = blockingQueue.take();
                  } catch (InterruptedException e) {
                     e.printStackTrace();
                  }
                  log.info("成功接收到了字符串 ==> {}", str);
                  // 字符串转数字，转换不成功会抛出异常
                  final int i = Integer.parseInt(str);
                  // 偶数返回 true，奇数返回false
                  return i % 2 == 0;
               })
               .setMillisecond(0)
               .setName("异步处理线程")
               // 执行出现异常则继续下一次执行
               .catchFun((ctrlComp, e) -> {
                  log.error("执行异常的时候发生了错误 : {}", e.getMessage());
                  // 执行错误后，暂停 300 毫秒
                  ctrlComp.pause(300);
                  // 执行错误后，结束循环线程
                  // ctrlComp.endCtrlLoopThread();
               })
               .falseFun(ctrlComp -> {
                  log.warn("执行 loop 循环的之后返回了 false");
                  // 继续执行
                  ctrlComp.continueNextLoop();
               });

      threadComp.start();

      // 即时往队列里面添加消息, 异步处理线程即时处理
      blockingQueue.add("23");
      blockingQueue.add("11");
      blockingQueue.add("32");
      blockingQueue.add("0");
      blockingQueue.add("哈哈");

      Throws.con(10, Thread::sleep).logThrowable();
   }
   ```

   执行日志

   ```log
   [INFO] 2022-02-20 22:48:59.137 [异步处理线程] (CtrlLoopThreadCompTest.java:272) 成功接收到了字符串 ==> 23
   [WARN] 2022-02-20 22:48:59.137 [异步处理线程] (CtrlLoopThreadCompTest.java:289) 执行 loop 循环的之后返回了 false
   [INFO] 2022-02-20 22:48:59.137 [异步处理线程] (CtrlLoopThreadCompTest.java:272) 成功接收到了字符串 ==> 11
   [WARN] 2022-02-20 22:48:59.137 [异步处理线程] (CtrlLoopThreadCompTest.java:289) 执行 loop 循环的之后返回了 false
   [INFO] 2022-02-20 22:48:59.137 [异步处理线程] (CtrlLoopThreadCompTest.java:272) 成功接收到了字符串 ==> 32
   [INFO] 2022-02-20 22:48:59.137 [异步处理线程] (CtrlLoopThreadCompTest.java:272) 成功接收到了字符串 ==> 0
   [INFO] 2022-02-20 22:48:59.137 [异步处理线程] (CtrlLoopThreadCompTest.java:272) 成功接收到了字符串 ==> 哈哈
   [ERROR] 2022-02-20 22:48:59.137 [异步处理线程] (CtrlLoopThreadCompTest.java:282) 执行异常的时候发生了错误 : For input string: "哈哈"
   [DEBUG] 2022-02-20 22:48:59.137 [异步处理线程] (CtrlLoopThreadComp.java:448) CtrlLoopThread [异步处理线程] pause!!!
   ```

## CtrlLoopThreadComp 源码

> 就这一个类, 在开发的时候逐渐加入功能, 前前后后真的是更改了好久.

```java
package com.github.cosycode.common.thread;

import lombok.Setter;
import lombok.experimental.Accessors;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;

import java.util.function.BiConsumer;
import java.util.function.BooleanSupplier;
import java.util.function.Consumer;

/**
 * <b>Description : </b>  可控制的单循环线程, 和 CtrlLoopThread 的区别是对 Thread 采用了组合方式, 而不是继承方式
 * <p>
 * <b>设计如下: </b>
 * <br> <b>线程终止: </b> 只要内置线程调用 interrupt() 方法即视为线程需要终止.
 * <br> <b>线程等待和唤醒机制: </b> 因为线程调用 interrupt() 方法视为线程需要终止, 因此此处使用 wait + notify 来管理线程等待和唤醒.
 * </p>
 * <b>created in </b> 2020/8/13
 *
 * @author CPF
 * @since 1.0
 */
@Slf4j
@Accessors(chain = true)
public class CtrlLoopThreadComp implements AutoCloseable {

    /**
     * 抛出异常调用方法: 打印现场后继续下一次循环
     */
    public static final BiConsumer<CtrlComp, RuntimeException> CATCH_FUNCTION_CONTINUE = CtrlComp::logException;
    /**
     * 参照 Thread 中为每个线程生成一个 Id 的方法, 简单移植过来的.
     * 如果该类, 没有赋值 name, 则根据当前 Number 生成一个 name
     */
    private static int threadInitNumber;
    /**
     * 内置线程对象
     */
    protected final Thread thread;
    /**
     * 线程每次执行的函数, 如果函数返回false, 则线程循环结束
     */
    private final BooleanSupplier booleanSupplier;
    /**
     * 多长时间运行一次(while true 中的一个执行sleep多久)
     */
    @Setter
    private int millisecond;
    /**
     * 运行类
     */
    private final CtrlLoopRunnable ctrlLoopRunnable;
    /**
     * 处理函数对象, 此处使用 volatile 仅仅保证该引用的可见性
     */
    @SuppressWarnings("java:S3077")
    private volatile CtrlComp ctrlComp;
    /**
     * 返回 false 时调用方法
     */
    private Consumer<CtrlComp> falseConsumer;
    /**
     * 出错时的消费函数接口
     */
    private BiConsumer<CtrlComp, RuntimeException> catchConsumer;

    /**
     * @param booleanSupplier     运行函数, 如果运行中返回 false, 则暂停运行.
     * @param name                线程名称, 若为 empty, 则会自动取一个名字(以 CtrlLoopThreadComp- 开头)
     * @param continueIfException 发生异常时是否继续.
     * @param millisecond         两次循环之间间隔多久(毫秒)
     */
    protected CtrlLoopThreadComp(BooleanSupplier booleanSupplier, String name, boolean continueIfException, int millisecond) {
        this(booleanSupplier, null, continueIfException ? CATCH_FUNCTION_CONTINUE : null, name, millisecond);
    }

    /**
     * CtrlLoopThreadComp 主要构造方法
     * <p>
     * <br> CtrlLoopThreadComp 里面内置了一个线程, 线程会 每隔 millisecond 毫秒 循环调用 booleanSupplier 方法, 若 millisecond <= 0, 则表示不进行暂停.
     * <br> 当调用 booleanSupplier 结果返回 true, 则隔 millisecond 毫秒后继续调用 booleanSupplier 方法
     * <br> 当调用 booleanSupplier 结果返回 false, 则调用 falseConsumer 方法, 若 falseConsumer 为 null, 则不对返回值做任何处理, 继续下一次循环
     * <br> 当调用 booleanSupplier 时抛出运行时异常, 则调用 catchConsumer 方法, 若 catchConsumer 为 null, 则不对异常做任何处理, 等于将异常抛给虚拟机.
     * </p>
     *
     * @param booleanSupplier 运行函数(不可为 null)
     * @param falseConsumer   booleanSupplier 运行后返回 false 时调用函数
     * @param catchConsumer   booleanSupplier 运行后抛出 异常时 调用该函数
     * @param name            线程名称, 若为 empty, 则会自动取一个名字(以 CtrlLoopThreadComp- 开头)
     * @param millisecond     两次循环之间间隔多久(毫秒), 如果为 0 则表示不暂停.
     */
    protected CtrlLoopThreadComp(BooleanSupplier booleanSupplier, Consumer<CtrlComp> falseConsumer, BiConsumer<CtrlComp, RuntimeException> catchConsumer, String name, int millisecond) {
        this.booleanSupplier = booleanSupplier;
        this.falseConsumer = falseConsumer;
        this.catchConsumer = catchConsumer;
        this.millisecond = millisecond;
        this.ctrlLoopRunnable = new CtrlLoopRunnable();
        this.thread = new Thread(this.ctrlLoopRunnable, StringUtils.isBlank(name) ? "CtrlLoopThreadComp-" + nextThreadNum() : name);
    }

    /**
     * 参照 Thread 中为每个线程生成一个 Id 的方法, 简单移植过来的.
     *
     * @return 一个 Id 编号
     */
    private static synchronized int nextThreadNum() {
        return threadInitNumber++;
    }

    /**
     * @param runnable            运行函数
     * @param continueIfException 发生异常时是否继续.
     * @param millisecond         两次循环之间间隔多久(毫秒)
     * @return 创建的线程
     */
    public static CtrlLoopThreadComp ofRunnable(Runnable runnable, boolean continueIfException, int millisecond) {
        return new CtrlLoopThreadComp(() -> {
            runnable.run();
            return true;
        }, null, continueIfException, millisecond);
    }

    /**
     * @param runnable 运行函数
     * @return 创建的线程
     */
    public static CtrlLoopThreadComp ofRunnable(Runnable runnable) {
        return new CtrlLoopThreadComp(() -> {
            runnable.run();
            return true;
        }, null, false, 0);
    }

    /**
     * @param booleanSupplier     运行函数, 如果运行中返回 false, 则暂停运行.
     * @param continueIfException 发生异常时是否继续.
     * @param millisecond         两次循环之间间隔多久(毫秒)
     * @return 创建的线程
     */
    public static CtrlLoopThreadComp ofSupplier(BooleanSupplier booleanSupplier, boolean continueIfException, int millisecond) {
        return new CtrlLoopThreadComp(booleanSupplier, null, continueIfException, millisecond);
    }

    /**
     * @param booleanSupplier 运行函数, 如果运行中返回 false, 则暂停运行.
     * @return 创建的线程
     */
    public static CtrlLoopThreadComp ofSupplier(BooleanSupplier booleanSupplier) {
        return new CtrlLoopThreadComp(booleanSupplier, null, false, 0);
    }

    /**
     * loop函数, 添加一个函数, 方便子类继承
     *
     * @return 当前函数是否运行成功
     */
    protected boolean loop() {
        return booleanSupplier != null && booleanSupplier.getAsBoolean();
    }

    /**
     * 线程暂停
     */
    public void pause() {
        ctrlLoopRunnable.changeState(3, 0, 0);
    }

    /**
     * 线程暂停指定毫秒, 同Object.wait()一样, 若等待时间为0，则表示永久暂停。
     * 当线程正在暂停中时, 再次调用该方法, 线程在自动结束等待情况下, 将继续 wait 指定的时间
     *
     * @param waitTime 暂停的时间(毫秒), 若为0，则表示永久暂停。
     */
    public void pause(long waitTime) {
        ctrlLoopRunnable.changeState(3, waitTime, 0);
    }

    /**
     * 多少次运行之后暂停.
     *
     * @param loopTime 次数
     */
    public void pauseAfterLoopTime(int loopTime) {
        ctrlLoopRunnable.changeState(2, 0, loopTime);
    }

    /**
     * 线程恢复
     */
    public void wake() {
        ctrlLoopRunnable.changeState(1, 0, 0);
    }

    /**
     * 内置线程启动
     */
    public void start() {
        thread.start();
    }

    /**
     * 若没有启动的话, 则启动
     */
    public synchronized void startIfNotStart() {
        if (Thread.State.NEW == thread.getState()) {
            thread.start();
        }
    }

    /**
     * @return 内置线程状态
     */
    public Thread.State getThreadState() {
        return thread.getState();
    }

    /**
     * 线程启动或恢复
     */
    public void startOrWake() {
        final Thread.State state = thread.getState();
        switch (state) {
            case NEW:
                startIfNotStart();
                break;
            case BLOCKED:
            case RUNNABLE:
            case WAITING:
            case TIMED_WAITING:
                wake();
                break;
            case TERMINATED:
                log.warn("wrong invocation! CtrlLoopThread [{}] has ended!!!", thread.getName());
                break;
            default:
        }
    }

    /**
     * 通过 interrupt 停止循环线程, 线程将会在执行完当前循环之后, 自动停止
     */
    @Override
    public void close() {
        ctrlLoopRunnable.closeWhenThisLoopEnd();
    }

    /**
     * 当 loop 循环返回 false 时调用该线程.
     *
     * @param falseConsumer 返回 false 消费线程
     * @return 当前对象本身
     */
    public CtrlLoopThreadComp falseFun(Consumer<CtrlComp> falseConsumer) {
        this.falseConsumer = falseConsumer;
        return this;
    }

    /**
     * 设置出错线程, 如果发生异常, 则会调用该方法
     *
     * @param catchConsumer 出错消费线程
     * @return 当前对象本身
     */
    public CtrlLoopThreadComp catchFun(BiConsumer<CtrlComp, RuntimeException> catchConsumer) {
        this.catchConsumer = catchConsumer;
        return this;
    }

    /**
     * 获取线程名称
     *
     * @return 当前对象内线程名称
     */
    public String getName() {
        return thread.getName();
    }

    /**
     * 设置线程名称
     *
     * @param name 线程名称
     * @return 当前对象本身
     */
    public CtrlLoopThreadComp setName(String name) {
        thread.setName(name);
        return this;
    }

    /**
     * @return 返回唯一的控制器
     */
    public CtrlComp getCtrlComp() {
        if (ctrlComp == null) {
            synchronized (this) {
                if (ctrlComp == null) {
                    ctrlComp = new CtrlComp();
                }
            }
        }
        return ctrlComp;
    }

    /**
     * @param continueIfException 发生异常后是否继续下一次循环
     * @return 对象本身
     */
    public CtrlLoopThreadComp setContinueIfException(boolean continueIfException) {
        this.catchConsumer = CATCH_FUNCTION_CONTINUE;
        return this;
    }

    /**
     * <b>Description : </b> 可控制的循环线程的runnable内部类, 控制CtrlLoopThreadComp的执行方式
     * <p>
     * <b>created in </b> 2020/8/13
     *
     * @author CPF
     * @since 1.0
     **/
    private class CtrlLoopRunnable implements Runnable {
        /**
         * 用于线程启停的锁
         */
        private final Object lock = new Object();
        /**
         * 添加了线程状态 state
         * <p>
         * <br>添加 state 的好处是 使得更改 state 状态时变得容易理解, 最主要的目的就是方法 {@link CtrlLoopRunnable#changeState(int, long, int)}
         * <br>
         * <br> <b>0: </b>初始状态, 表示 state 还未被修改
         * <br> <b>1: </b>持续运行状态
         * <br> <b>2: </b>临时运行状态, 指定次数后转换为暂停状态, 此时 waitAfterLoopCount 有意义; 若 waitAfterLoopCount > 0, 则指定次数后转换为永久暂停状态, 否则马上转为永久暂停状态
         * <br> <b>3: </b>临时运行状态, 即将被暂停, 此时 waitTime 有意义; 若 waitTime>0, 则转为临时暂停状态, 否则转为永久暂停状态.
         * <br> <b>4: </b>临时暂停状态, 指定时间后被唤醒
         * <br> <b>5: </b>永久暂停状态, 需要使用 notify 唤醒
         * <br> <b>-1: </b>终止状态, 此时修改 state 已经没有意义
         */
        private volatile int state;
        /**
         * 线程结束标记, 若该标记为 true, 则运行完当前 loop 则直接结束线程.
         */
        private volatile boolean endFlag;
        /**
         * 线程正处在 loop 方法循环里面
         */
        private volatile int codeRunLocation;
        /**
         * 等待时间, 这里使用 wait 和 notify 对线程进行唤醒
         */
        private long waitTime;
        /**
         * 在多少次循环后暂停标记
         * <br> <b>-1: </b> 持续运行标记
         * <br> <b>0: </b> 运行至检查点, 触发暂停事件, 该值转为 -1
         * <br> <b>n(>0): </b> 运行至检查点, 该值减1
         */
        @Setter
        private int waitAfterLoopCount;

        /**
         * 执行当前 loop 结束后, 关闭线程.
         * <p>
         * 如果在 loop 中, 则通过更改标记位, 结束线程.
         * 如果不在 loop 中, 而是在线程循环控制处理逻辑内, 则直接调用 interrupt 关闭线程.
         */
        protected void closeWhenThisLoopEnd() {
            synchronized (lock) {
                this.endFlag = true;
                // 如果不是在 loop 的处理中, 则直接使用 interrupt 关闭线程
                if (codeRunLocation < 3 || codeRunLocation >= 5) {
                    thread.interrupt();
                }
            }
        }

        /**
         * <br> <b>-2: </b> 运行完这一次直接关闭线程
         * <br> <b>1: </b>持续运行状态
         * <br> <b>2: </b>临时运行状态, 指定次数后转换为暂停状态, 此时 waitAfterLoopCount 有意义
         * <br> <b>3: </b>临时运行状态, 即将被暂停, 此时 waitTime 有意义
         *
         * @param state             {@link CtrlLoopRunnable#state}
         * @param waitTime          等待时间, state=3时有意义, 若 waitTime>0, 则转为临时暂停状态, 否则转为永久暂停状态.
         * @param waitAfterLoopTime 循环指定次数后暂停, state=2时有意义, 若 waitAfterLoopCount > 0, 则指定次数后转换为永久暂停状态, 否则马上转为永久暂停状态
         */
        protected void changeState(final int state, final long waitTime, final int waitAfterLoopTime) {
            synchronized (lock) {
                switch (state) {
                    case 1:
                        this.waitTime = 0;
                        this.waitAfterLoopCount = 0;
                        lock.notifyAll();
                        break;
                    case 2:
                        this.waitTime = 0;
                        if (codeRunLocation == 2) {
                            // 此时运行在执行自定义函数之前, 次数判定之后, 因此此时需要将次数 - 1
                            this.waitAfterLoopCount = waitAfterLoopTime - 1;
                        } else {
                            this.waitAfterLoopCount = waitAfterLoopTime;
                        }
                        lock.notifyAll();
                        break;
                    case 3:
                        this.waitTime = waitTime;
                        this.waitAfterLoopCount = 0;
                        lock.notifyAll();
                        break;
                    default:
                }
                this.state = state;
            }
        }

        @Override
        @SuppressWarnings({"java:S1119", "java:S112"})
        public void run() {
            // 线程在启动之前, 可以不是0
            if (state == 0) {
                state = 1;
            }
            final String name = thread.getName();
            log.debug("CtrlLoopThread [{}] start!!!", name);
            outer:
            while (!thread.isInterrupted()) {
                // 临时运行状态, 指定次数后转换为暂停状态, 此时 waitAfterLoopCount 有意义
                if (state == 2) {
                    synchronized (lock) {
                        if (state == 2) {
                            if (waitAfterLoopCount > 0) {
                                waitAfterLoopCount--;
                            } else {
                                state = 3;
                                waitTime = 0;
                            }
                        }
                    }
                }
                codeRunLocation = 2;
                /* 这个地方使用额外的对象锁停止线程, 而不是使用线程本身的停滞机制, 保证一次循环执行完毕后执行停止操作, 而不是一次循环正在执行 booleanSupplier 的时候停止*/
                // 临时运行状态, 即将被暂停, 此时 waitTime 有意义, waitTime=0, 则转为永久暂停状态, waitTime>0, 则转为临时暂停状态
                if (state == 3) {
                    synchronized (lock) {
                        // 此处之所以使用 while 而不是 if 是因为想要在线程等待过程中或者结束后, 依然可以通过控制 state 使得线程可以再次陷入等待, 以及可以最佳等待时间.
                        while (state == 3) {
                            log.debug("CtrlLoopThread [{}] pause!!!", name);
                            try {
                                // 添加添加临时变量防止幻读
                                final long waitTmp = waitTime;
                                if (waitTmp > 0) {
                                    waitTime = 0;
                                    state = 4;
                                    lock.wait(waitTmp);
                                } else {
                                    state = 5;
                                    lock.wait();
                                }
                            } catch (InterruptedException e) {
                                log.debug("CtrlLoopThread [{}] was interrupted during waiting!!!", name);
                                thread.interrupt();
                                /* 线程中断即意味着线程结束, 此时跳出最外层循环 */
                                break outer;
                            }
                            log.debug("CtrlLoopThread [{}] wake!!!", name);
                        }
                    }
                }
                codeRunLocation = 3;
                // 线程关闭标记为true, 则关闭线程
                if (endFlag) {
                    break;
                }
                /* 这个地方是正式执行线程的代码 */
                try {
                    final boolean cont = loop();
                    codeRunLocation = 4;
                    // 当结果返回 false 同时 falseConsumer 不为 null 时, 调用 falseConsumer 方法, 否则不做任何处理, 继续下一次循环
                    if (!cont && falseConsumer != null) {
                        falseConsumer.accept(getCtrlComp());
                    }
                } catch (RuntimeException e) {
                    /* 如果发生异常则调用 catchConsumer, 若 catchConsumer 为 null, 则封装现场并抛出异常 */
                    if (catchConsumer != null) {
                        catchConsumer.accept(getCtrlComp(), e);
                    } else {
                        throw new RuntimeException(String.format("CtrlLoopThread [%s] processing exception, the thread stop!", name), e);
                    }
                }
                codeRunLocation = 5;
                // 线程关闭标记为true, 则关闭线程
                if (endFlag) {
                    break;
                }
                // 控制loop多久循环一次, 防止 CPU 过高占用
                if (millisecond > 0) {
                    try {
                        Thread.sleep(millisecond);
                    } catch (InterruptedException e) {
                        log.debug("CtrlLoopThread [{}] was interrupted during sleep", name);
                        thread.interrupt();
                    }
                }
            }
            log.debug("CtrlLoopThread [{}] end!!!", name);
            state = -1;
        }
    }

    /**
     * 当前类的控制器
     */
    public class CtrlComp {

        /**
         * 线程暂停指定毫秒, 同Object.wait()一样, 若等待时间为0，则表示永久暂停。
         * 当线程正在暂停中时, 再次调用该方法, 线程在自动结束等待情况下, 将继续 wait 指定的时间
         *
         * @param waitTime 暂停的时间(毫秒)
         */
        public void pause(long waitTime) {
            CtrlLoopThreadComp.this.pause(waitTime);
        }

        /**
         * 线程暂停
         */
        public void pause() {
            CtrlLoopThreadComp.this.pause();
        }

        /**
         * 继续下一次循环
         */
        public void continueNextLoop() {
        }

        /**
         * 终止内置线程
         */
        public void endCtrlLoopThread() {
            close();
        }

        /**
         * 打印异常
         *
         * @param e 发生异常
         */
        public void logException(RuntimeException e) {
            final String msg = String.format("CtrlLoopThread [%s] processing exception, continue to the next round", getName());
            log.error(msg, e);
        }

    }

}
```

---

### git

   相关源码在 github 和 gitee 上, 上面有最新的代码.

   - github: `https://github.com/cosycode/common-lang`
   - gitee: `https://gitee.com/cosycode/common-lang`

### repo

   同时我也将代码打包成 jar, 发布到 maven 仓库

   Apache Maven

   ```xml
   <dependency>
      <groupId>com.github.cosycode</groupId>
      <artifactId>common-lang</artifactId>
      <version>1.6</version>
   </dependency>
   ```

   gradle

   ```yml
   implementation 'com.github.cosycode:common-lang:1.6'
   ```

该类完整类路径是 `com.github.cosycode.common.thread.CtrlLoopThreadComp`

---

若是有什么错误或者是有什么使用建议, 欢迎大家留言
