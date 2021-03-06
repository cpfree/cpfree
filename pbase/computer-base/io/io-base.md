# netty 基础

## 概念

### IO

- IO: 数据在传输过程中以二进制的形式进行传输, 我们称传输的数据为流, 对流的操作就是IO操作.

   > 面向流 的 I/O 系统一次一个字节地处理数据。一个输入流产生数据，一个输出流消费数据。为流式数据创建过滤器非常容易。链接几个过滤器，以便每个过滤器只负责单个复杂处理机制的一部分，这样也是相对简单的。缺点是面向流的 I/O 通常相当慢。

- AIO: (async IO), 异步非阻塞IO.

   > AIO异步非阻塞I/O模型。无需一个线程去轮询所有IO操作的状态改变，在相应的状态改变后，系统会通知对应的线程来处理。对应到烧开水中就是，为每个水壶上面装了一个开关，水烧开之后，水壶会自动通知我水烧开了。
   > 适用于连接数目多且连接比较长（重操作）的架构，比如相册服务器，充分调用OS参与并发操作，编程比较复杂，JDK7开始支持。

- BIO: (Block I/O), 同步阻塞IO.

    > 数据的读取写入必须阻塞在一个线程内等待其完成。一个线程只处理一个IO, 如果发生阻塞, 则线程等待, 直到阻塞结束才再次运行。
    > 适用于连接数目比较小且固定的架构，优点是**简单**, **延迟低**, 缺点是对**服务器资源要求比较高**，且**并发量差**.

- 异步IO: 数据请求和数据处理都是异步的，数据请求一次返回一次，适用于长连接的业务场景。

- 多路复用IO: 数据请求和数据处理都是分开的，也就是说，一个连接可能他的数据接收是线程a完成的，数据处理是线程b完成的，他比BIO能处理更多请求。

- NIO: (non-blocking IO), 非阻塞IO.

    > NIO 与原来的 I/O 最重要的区别是数据打包和传输的方式。原来的 I/O 以流的方式处理数据，而 NIO 以块的方式处理数据。
    > 一个 面向块 的 I/O 系统以块的形式处理数据。每一个操作都在一步中产生或者消费一个数据块。按块处理数据比按(流式的)字节处理数据要快得多。但是面向块的 I/O 缺少一些面向流的 I/O 所具有的优雅性和简单性。
    > 同时支持阻塞与非阻塞模式，还拿烧开水来说, 其同步非阻塞模式如果，NIO的做法是叫一个线程不断的轮询每个水壶的状态，看看是否有水壶的状态发生了改变，从而进行下一步的操作。
    > 适用于连接数目多且连接比较短（轻操作）的架构，比如聊天服务器，并发局限于应用中，编程比较复杂，JDK1.4开始支持。

(3)select 与 epoll,poll区别

二、

NIO，同步非阻塞IO，阻塞业务处理但不阻塞数据接收，适用于高并发且处理简单的场景，比如聊天软件。

