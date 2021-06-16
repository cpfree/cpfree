# ExecutorService

## ExecutorService 中 submit 和 execute 的区别

因为之前一直是用的 execute 方法，最近有个情况需要用到 submit 方法，所以研究了下。

三个区别：

1、接收的参数不一样

2、submit 有返回值，而 execute 没有

Method submit extends base method Executor.execute by creating and returning a Future that can be used to cancel execution and/or wait for completion.

用到返回值的例子，比如说我有很多个做 validation 的 task，我希望所有的 task 执行完，然后每个 task 告诉我它的执行结果，是成功还是失败，如果是失败，原因是什么。然后我就可以把所有失败的原因综合起来发给调用者。

个人觉得 cancel execution 这个用处不大，很少有需要去取消执行的。

而最大的用处应该是第二点。

3、submit 方便 Exception 处理

There is a difference when looking at exception handling. If your tasks throws an exception and if it was submitted with execute this exception will go to the uncaught exception handler (when you don't have provided one explicitly, the default one will just print the stack trace to System.err). If you submitted the task with submit any thrown exception, checked or not, is then part of the task's return status. For a task that was submitted with submit and that terminates with an exception, the Future.get will rethrow this exception, wrapped in an ExecutionException.

意思就是如果你在你的 task 里会抛出 checked 或者 unchecked exception，而你又希望外面的调用者能够感知这些 exception 并做出及时的处理，那么就需要用到 submit，通过捕获 Future.get 抛出的异常。

比如说，我有很多更新各种数据的 task，我希望如果其中一个 task 失败，其它的 task 就不需要执行了。那我就需要 catch Future.get 抛出的异常，然后终止其它 task 的执行，代码如下：
