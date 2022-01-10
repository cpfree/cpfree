# final 关键字

1. final 关键字基本用法

   在 Java 中可以修饰类、方法、变量。

   被 final 修饰的类，表示这个类不可被继承.

   final 类中的成员变量可以根据需要设为 final.

   final 修饰的类中的所有成员方法都被隐式指定为 final 方法.

final 修饰的基本数据类型常量不能被修改.

final 修饰的引用类型的变量，初始化之后便不能再让其指向另一个对象。

## 反射破坏 final 规则

基于上述 final 关键字的基本使用描述，可以知道 final 修饰的属性是不可变的。

但是，通过反射机制，可以破坏 final 的规则，代码如下

   ```java
   public class TCCClass {
      private final String name = "name";

      public static void main(String[] args) throws Exception {
         TCCClass tcc = new TCCClass();
         System.out.println(tcc.name);

         Field name = tcc.getClass().getDeclaredField("name");
         name.setAccessible(true);
         name.set(tcc, "mic");
         System.out.println(name.get(tcc));
      }
   }
   ```

打印结果如下：

   ```log
   name
   mic
   ```


知识点扩展

```java
public static void main(String[] args) throws Exception {
    TCCClass tcc=new TCCClass(); 
    System.out.println(tcc.name); 
    Field name=tcc.getClass().getDeclaredField("name"); 
    name.setAccessible(true); 
    name.set(tcc,"mic"); 
    System.out.println(tcc.name); //here
}
```

但是实际输出结果后，发现 tcc.name 打印的结果没有变化？

原因是：JVM 在编译时期做的深度优化机制, 就把 final 类型的 String 进行了优化, 在编译时期就会把 String 处理成常量，导致打印结果不会发生变化。

为了避免这种深度优化带来的影响，我们还可以把上述代码修改成下面这种形式

```java
public class TCCClass {
    private final String name = ((null == null) ? "name" : "");

    public static void main(String[] args) throws Exception {
        TCCClass tcc = new TCCClass();
        System.out.println(tcc.name);

        Field name = tcc.getClass().getDeclaredField("name");
        name.setAccessible(true);
        name.set(tcc, "mic");
        System.out.println(tcc.name);
    }
}
```

打印结果如下:

   ```log
   name
   mic
   ```

### 反射如何修改被 final 和 static 同时修饰的变量

把上面的代码修改如下。

   ```java
   public class TCCClass {
      private static final String name = ((null == null) ? "name" : "");

      public static void main(String[] args) throws Exception {
         TCCClass tcc = new TCCClass();
         System.out.println(tcc.name);

         Field name = tcc.getClass().getDeclaredField("name");
         name.setAccessible(true);
         name.set(tcc, "mic");
         System.out.println(tcc.name);
      }
   }
   ```

执行结果,执行之后会报出如下异常, 因为反射无法修改同时被 static final 修饰的变量:

那么该如何修改呢? 修改代码如下：

   ```java
   public class TCCClass {
      private static final String name = ((null == null) ? "name" : "");

      public static void main(String[] args) throws Exception {
         TCCClass tcc = new TCCClass();
         System.out.println(tcc.name);

         Field name = tcc.getClass().getDeclaredField("name");
         name.setAccessible(true);

         // 把被修饰了 final 关键字的 name 属性，通过反射的方式去掉 final 关键字，代码实现
         Field modifiers = name.getClass().getDeclaredField("modifiers");
         modifiers.setAccessible(true);
         modifiers.setInt(name, name.getModifiers() & ~Modifier.FINAL);

         name.set(tcc, "mic");

         // 接着通过反射修改 name 属性，修改成功后，再使用下面代码把 final 关键字加回来
         modifiers.setInt(name, name.getModifiers() & ~Modifier.FINAL);

         // 之后发现可以被修改了
         System.out.println(tcc.name);
      }
   }
   ```

### 为什么局部内部类和匿名内部类只能访问 final 变量

```java
public void test(final int b) {
   final int a = 10;
   new Thread() {
      public void run() {
         System.out.println(a);
         System.out.println(b);
      };
   }.start();
}
```

如上面的代码, 若是 a 或 b 不使用final修饰, 那么编译就通不过.

正常情况下, 当 test 方法执行完成后, 变量 a, b 就会被会回收掉, 这个时候若是新建的线程还没有执行完, 那么就有问题了.

而使用final的话, 相当于是JVM在创建一个新的线程的时候, 还为这个线程创建了一个a, b的副本, 使得即便变量 a, b 回收掉之后, 新建的线程依然能够正常使用变量a, b的副本.

### final 防止指令重排

final 关键字，还能防止指令重排序带来的可见性问题；

对于 final 变量，编译器和处理器都要遵守两个重排序规则：

1. 构造函数内，对一个 final 变量的写入，与随后把这个被构造对象的引用赋值给一个变量，这两个操作之间不可重排序。
2. 首次读一个包含 final 变量的对象，与随后首次读这个 final 变量，这两个操作之间不可以重排序。

实际上这两个规则也正是针对 final 变量的写与读。

1. 写的重排序规则可以保证，在对象引用对任意线程可见之前，对象的 final 变量已经正确初始化了，而普通变量则不具有这个保障；

2. 读的重排序规则可以保证，在读一个对象的 final 变量之前，一定会先读这个对象的引用。如果读取到的引用不为空，根据上面的写规则，说明对象的 final 变量一定以及初始化完毕，从而可以读到正确的变量值。

如果 final 变量的类型是引用型，那么构造函数内，对一个 final 引用的对象的成员域的写入，与随后在构造函数外把这个被构造对象的引用赋值给一个引用变量，这两个操作之间不能重排序。

实际上这也是**为了保证 final 变量在对其他线程可见之前，能够正确的初始化完成。**

### final 关键字的其它好处

1. final 关键字提高了性能，JVM 和 Java 应用都会缓存 final 变量（实际就是常量池）
2. final 变量可以安全的在多线程环境下进行共享，而不需要额外的同步开销

问题解答
面试题：用过 final 关键字吗？它有什么作用

回答： final 关键字表示不可变，它可以修饰在类、方法、成员变量中。

如果修饰在类上，则表示该类不允许被继承
修饰在方法上，表示该方法无法被重写
修饰在变量上，表示该变量无法被修改，而且 JVM 会隐性定义为一个常量。

另外，final 修饰的关键字，还可以避免因为指令重排序带来的可见性问题，原因是，final 遵循两个重排序规则

构造函数内，对一个 final 变量的写入，与随后把这个被构造对象的引用赋值给一个变量，这两个操作之间不可重排序。

首次读一个包含 final 变量的对象，与随后首次读这个 final 变量，这两个操作之间不可以重排序。

问题总结
恰恰是平时经常使用的一些工具或者技术，所涉及到的知识点越多。

就这个问题来说，在面试时的考察点太多了，比如：

如何破坏 final 规则
带 static 和 final 修饰的属性，可以被修改吗？
final 是否可以解决可见性问题，以及它是如何解决的？
