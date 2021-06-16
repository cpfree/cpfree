---
words: mmap, 零拷贝, 
---

# 零拷贝的原理及Java实现

> 参考网址
>
> - https://www.jianshu.com/p/497e7640b57c,
> - https://www.jianshu.com/p/9a306e46e105,
> - https://blog.csdn.net/localhost01/article/details/83422888,
> - https://blog.csdn.net/cringkong/article/details/80274148,
> - https://www.cnblogs.com/xiaolincoding/p/13719610.html,
> - https://time.geekbang.org/column/article/118657,
> - https://www.toutiao.com/i6898240850917114380/,
> - https://juejin.cn/post/6844903949359644680#heading-19

---

> RocketMQ为什么快？Kafka为什么快？什么是mmap？
> 这一类的问题都逃不过的一个点就是零拷贝，虽然还有一些其他的原因，但是今天我们的话题主要就是零拷贝。

## 简述

1. 什么是零拷贝

   > “零拷贝”是指计算机操作的过程中，CPU不需要为数据在内存之间的拷贝消耗资源。而它通常是指计算机在网络上发送文件时，不需要将文件内容拷贝到用户空间（User Space）而直接在内核空间（Kernel Space）中传输到网络的方式。

2. 零拷贝好处
   - 减少不必要的拷贝步骤, 腾出CPU空间
   - 减少操作系统用户空间和内核空间的切换

3. 零拷贝的实现

   零拷贝实际的实现并没有真正的标准，取决于操作系统如何实现这一点。零拷贝完全依赖于操作系统。操作系统支持，就有；不支持，就没有。不依赖Java本身。

## 基础概念

### DMA拷贝

因为对于一个IO操作而言，都是通过CPU发出对应的指令来完成，但是相比CPU来说，IO的速度太慢了，CPU有大量的时间处于等待IO的状态。

因此就产生了DMA（Direct Memory Access）直接内存访问技术，本质上来说他就是一块主板上独立的芯片，通过它来进行内存和IO设备的数据传输，从而减少CPU的等待时间。

但是无论谁来拷贝，频繁的拷贝耗时也是对性能的影响。

### 传统IO

传统的IO方式，底层实际上通过调用read()和write()来实现。

   下面是一个从磁盘文件读取并且通过socket写出的过程，对应的系统调用如下：

   ```js
   read(file,tmp_buf,len)
   write(socket,tmp_buf,len)
   ```

在Java中，我们可以通过InputStream从源数据中读取数据流到一个缓冲区里，然后再将它们输入到OutputStream里。我们知道，这种IO方式传输效率是比较低的。那么，当使用上面的代码时操作系统会发生什么情况：

示例图1

   ![传统IO1](https://upload-images.jianshu.io/upload_images/3921795-5b878d95bd0fd57e.jpg?imageMogr2/auto-orient/strip|imageView2/2/w/672/format/webp)

示例图2

   ![传统IO.jpg](https://upload-images.jianshu.io/upload_images/12038882-10d75804b44e2bed.jpg?imageMogr2/auto-orient/strip|imageView2/2/w/631/format/webp)

上面两个图都是从磁盘文件读取并且通过socket写出的过程，对应的系统调用如下：

   1. 程序使用read()系统调用。系统由用户态转换为内核态(第一次上线文切换)，磁盘中的数据有DMA（Direct Memory Access)的方式读取到内核缓冲区(kernel buffer)。DMA过程中CPU不需要参与数据的读写，而是DMA处理器直接将硬盘数据通过总线传输到内存中。
   2. 系统由内核态转换为用户态（第二次上下文切换），当程序要读取的数据已经完成写入内核缓冲区以后，程序会将数据由内核缓存区，写入用户缓存区），这个过程需要CPU参与数据的读写。
   3. 程序使用write()系统调用。系统由用户态切换到内核态(第三次上下文切换)，数据从用户态缓冲区写入到网络缓冲区(Socket Buffer)，这个过程需要CPU参与数据的读写。
   4. 系统由内核态切换到用户态（第四次上下文切换），网络缓冲区的数据通过DMA的方式传输到网卡的驱动(存储缓冲区)中(protocol engine)

可以看到，传统的I/O方式会经过4次用户态和内核态的切换(上下文切换)，两次CPU中内存中进行数据读写的过程。这种拷贝过程相对来说比较消耗资源

---

## 零拷贝的不同实现

### mmap:内存映射方式I/O

这是使用的系统调用方法，这种方式的I/O原理就是将用户缓冲区（user buffer）的内存地址和内核缓冲区（kernel buffer）的内存地址做一个映射，也就是说系统在用户态可以直接读取并操作内核空间的数据。

   ```go
   tmp_buf = mmap(file, len);
   write(socket, tmp_buf, len);
   ```

步骤详情:

   ![mmap](https://upload-images.jianshu.io/upload_images/12038882-5b8a06b4f4f9d96d.jpg?imageMogr2/auto-orient/strip|imageView2/2/w/631/format/webp)

   1. mmap()系统调用首先会使用DMA的方式将磁盘数据读取到内核缓冲区，然后通过内存映射的方式，使用户缓冲区和内核读缓冲区的内存地址为同一内存地址，也就是说不需要CPU再讲数据从内核读缓冲区复制到用户缓冲区。
   2. 当使用write()系统调用的时候，cpu将内核缓冲区（等同于用户缓冲区）的数据直接写入到网络发送缓冲区（socket buffer），然后通过DMA的方式将数据传入到网卡驱动程序中准备发送。

   可以看到这种内存映射的方式减少了CPU的读写次数，但是用户态到内核态的切换（上下文切换）依旧有四次，同时需要注意在进行这种内存映射的时候，有可能会出现并发线程操作同一块内存区域而导致的严重的数据不一致问题，所以需要进行合理的并发编程来解决这些问题。

### 通过sendfile实现的零拷贝I/O

通过sendfile()系统调用，可以做到内核空间内部直接进行I/O传输。

   ```go
   sendfile(socket, file, len);
   ```

步骤详情:

   ![sendfile.jpg](https://upload-images.jianshu.io/upload_images/12038882-8ebd28d6778db210.jpg?imageMogr2/auto-orient/strip|imageView2/2/w/598/format/webp)

   1. sendfile()系统调用也会引起用户态到内核态的切换，与内存映射方式不同的是，用户空间此时是无法看到或修改数据内容，也就是说这是一次完全意义上的数据传输过程。
   2. 从磁盘读取到内存是DMA的方式，从内核读缓冲区读取到网络发送缓冲区，依旧需要CPU参与拷贝，而从网络发送缓冲区到网卡中的缓冲区依旧是DMA方式。

   依旧有一次CPU进行数据拷贝，两次用户态和内核态的切换操作，相比较于内存映射的方式有了很大的进步，但问题是程序不能对数据进行修改，而只是单纯地进行了一次数据的传输过程。

### 理想状态下的零拷贝I/O

真正意义上的零拷贝，指的是CPU已经不参与数据的拷贝过程，也就是说完全通过其他硬件和中断的方式来实现数据的读写过程，但是这样的过程需要硬件的支持才能实现。

借助于硬件上的帮助，我们是可以办到的。之前我们是把页缓存的数据拷贝到socket缓存中，实际上，我们仅仅需要把缓冲区描述符传到socket缓冲区，再把数据长度传过去，这样DMA控制器直接将页缓存中的数据打包发送到网络中就可以了。

   ```go
   sendfile(socket, file, len);
   ```

步骤详情:

   ![sendfile2.jpg](https://upload-images.jianshu.io/upload_images/12038882-66d4978de0c458a5.jpg?imageMogr2/auto-orient/strip|imageView2/2/w/598/format/webp)

   1. 系统调用sendfile()发起后，磁盘数据通过DMA方式读取到内核缓冲区，内核缓冲区中的数据通过DMA聚合网络缓冲区，然后一齐发送到网卡中。

   在这种模式下，是没有一次CPU进行数据拷贝的，所以就做到了真正意义上的零拷贝，虽然和前一种是同一个系统调用，但是这种模式实现起来需要硬件的支持，但对于基于操作系统的用户来讲，操作系统已经屏蔽了这种差异，它会根据不同的硬件平台来实现这个系统调用

### Java的实现: NIO的零拷贝

```cpp
  File file = new File("test.zip");
  RandomAccessFile raf = new RandomAccessFile(file, "rw");
  FileChannel fileChannel = raf.getChannel();
  SocketChannel socketChannel = SocketChannel.open(new InetSocketAddress("", 1234));
  // 直接使用了transferTo()进行通道间的数据传输
  fileChannel.transferTo(0, fileChannel.size(), socketChannel);
```

NIO的零拷贝由transferTo()方法实现。transferTo()方法将数据从FileChannel对象传送到可写的字节通道（如Socket Channel等）。在内部实现中，由native方法transferTo0()来实现，它依赖底层操作系统的支持。在UNIX和Linux系统中，调用这个方法将会引起sendfile()系统调用。

使用场景一般是：

- 较大，读写较慢，追求速度
- M内存不足，不能加载太大数据
- 带宽不够，即存在其他程序或线程存在大量的IO操作，导致带宽本来就小

以上都建立在不需要进行数据文件操作的情况下，如果既需要这样的速度，也需要进行数据操作怎么办？
那么使用NIO的直接内存！

### NIO的直接内存

```cpp
  File file = new File("test.zip");
  RandomAccessFile raf = new RandomAccessFile(file, "rw");
  FileChannel fileChannel = raf.getChannel();
  MappedByteBuffer buffer = fileChannel.map(FileChannel.MapMode.READ_ONLY, 0, fileChannel.size());
```

首先，它的作用位置处于传统IO（BIO）与零拷贝之间，为何这么说？

- IO，可以把磁盘的文件经过内核空间，读到JVM空间，然后进行各种操作，最后再写到磁盘或是发送到网络，效率较慢但支持数据文件操作。
- 零拷贝则是直接在内核空间完成文件读取并转到磁盘（或发送到网络）。由于它没有读取文件数据到JVM这一环，因此程序无法操作该文件数据，尽管效率很高！

而直接内存则介于两者之间，效率一般且可操作文件数据。直接内存（mmap技术）将文件直接映射到内核空间的内存，返回==一个操作地址（address）==，它解决了文件数据需要拷贝到JVM才能进行操作的窘境。而是直接在内核空间直接进行操作，省去了内核空间拷贝到用户空间这一步操作。

NIO的直接内存是由==MappedByteBuffer==实现的。核心即是map()方法，该方法把文件映射到内存中，获得内存地址addr，然后通过这个addr构造MappedByteBuffer类，以暴露各种文件操作API。

由于MappedByteBuffer申请的是堆外内存，因此不受Minor GC控制，只能在发生Full GC时才能被回收。而==DirectByteBuffer==改善了这一情况，它是MappedByteBuffer类的子类，同时它实现了DirectBuffer接口，维护一个Cleaner对象来完成内存回收。因此它既可以通过Full GC来回收内存，也可以调用clean()方法来进行回收。

另外，直接内存的大小可通过jvm参数来设置：-XX:MaxDirectMemorySize。

NIO的MappedByteBuffer还有一个兄弟叫做HeapByteBuffer。顾名思义，它用来在堆中申请内存，本质是一个数组。由于它位于堆中，因此可受GC管控，易于回收。
