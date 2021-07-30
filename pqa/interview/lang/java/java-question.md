# java-question

[toc]

## 数组的最大长度是多少

1. 在建立数组的时候, 数组的size是一个int类型

   ```java
   int size = 129;
   Object object[] = new Object[size];
   ```

2. ArrayList中部分源码

   ```java
      /**
      * The maximum size of array to allocate.
      * Some VMs reserve some header words in an array.
      * Attempts to allocate larger arrays may result in
      * OutOfMemoryError: Requested array size exceeds VM limit
      */
      private static final int MAX_ARRAY_SIZE = Integer.MAX_VALUE - 8;
   ```

**从上可知, 由于一些虚拟机在数组里面保留了一些标题字, 因此java规定数组可分配的最大长度应该是`Integer.MAX_VALUE - 8`;**

## java中一个String可以有多大

1. 当.java文件编译成.class文件时，其类中的静态String数据是以以下数据结构去存储的, u2是一个2字节数据, 因此静态String最大长度限制为 `65535`.

   ```c++
      CONSTANT_Utf8_info {
         u1 tag;
         u2 length;   // 0 ~ 65535
         u1 bytes[length];
      }
   ```

   > `String a = "hello world";` 方式定义的字符串是会放到常量池里面的. 大小超过65535会报错.

2. String里面是由一个char[]数组来存放的.

3. java规定数组可分配的最大长度应该是`Integer.MAX_VALUE - 8`.

**从上可知, 常量池里面的最大长度为 `65535`, 通过io流读取或内存中直接生成的String大小可以突破常量池的限制, 但也最大只能是`Integer.MAX_VALUE - 8`**

   > 常量池里面的数据不是new出来的, 是事先写在代码里面的静态数据, 因此最大也不超过`65535`
