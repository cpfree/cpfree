### java 中多线程使用

### 1. 继承Thread

### 2. 使用Runnable

### 3. 使用Callable

使用 ExecuteService, Callable, Future 实现带有返回结果和可以抛出异常的多线程.

```java
   public class CallableDemo implements Callable<String> {

      @Override
      public String call() throws Exception {
         Thread.sleep(2000);
         return "END";
      }

      public static void main(String[] args) throws ExecutionException, InterruptedException {
         ExecutorService executorService = Executors.newFixedThreadPool(1);
         CallableDemo callableDemo = new CallableDemo();
         Future<String> future = executorService.submit(callableDemo);
        // submit::get 方法是阻塞方法, 此处会停止2秒左右
         System.out.println(future.get());
         executorService.shutdown();
      }

   }
```
