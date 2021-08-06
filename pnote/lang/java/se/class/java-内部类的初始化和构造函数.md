# java class

1. 内层类的创建必须获得其外层类的引用, 非静态内部类只能在主类中的非静态方法体中被创建, 除非通过反射

2. 类的实例里面不包含内部类信息, 因此无法通过类的实例直接创建或获取内部类. 但是可以通过类的class对象反射获取和创建内部类.

3. 一个非静态外内部类A的内层类B在创建的时候必须要有一个A的实例a, 因此其默认构造方法里面是有参构造方法(jdk1.8+)

4. 一个非静态外内部类A的内层类B的java代码中是没有参数的, 但是这只是 java 的语法糖罢了, 它其实是有参数的, 而且参数会根据内部类B方法`方法体是否被外部引用`等信息生成不同的构造方法和默认构造方法来.

> 若 A 是 B 的内部类, 那么创建 A 的时候, 必须要有 B 的实例.
> 若 A 是 B 的静态内部类, 那么 创建 A 的时候, 只需要 B 的引用.

## 1. 内部类的实例化

```java
public class Outer {
   // 一个内部类
   class A {
      private void test() {
         System.out.println("调用了A的test方法");
      }
   }

   // 在内部类中创建内部类很容易
   public A createInnerA() {
      return new A();
   }
   
   // 在外部或main方法中创建内部类方式
   public static void main(String[] args) {
      // 内部类实例化
      Outer outer = new Outer();
      Outer.A a = outer.new A();
      a.test();
   }
}
```

## 2. 内部类的构造方法

关于构造函数内容, 1.7及之前官方相关说明是

[java se7 jls 8.8.9](https://docs.oracle.com/javase/specs/jls/se7/html/jls-8.html#jls-8.8.9)

> 如果一个类不包含构造函数声明，那么隐式声明一个没有形式参数且没有throws子句的默认构造函数。
>
> Default Constructor
>
>> If a class contains no constructor declarations, then a default constructor with no formal parameters and no throws clause is implicitly declared.

但是到了1.8的时候, 就变成了

[java se8 jls 8.8.9](https://docs.oracle.com/javase/specs/jls/se8/html/jls-8.html#jls-8.8.9)

> Default Constructor
>
>> If a class contains no constructor declarations, then a default constructor is implicitly declared. The form of the default constructor for a top level class, member class, or local class is as follows:
>> The default constructor has the same accessibility as the class (§6.6).
>> The default constructor has no formal parameters, except in a non-private inner member class, where the default constructor implicitly declares one formal parameter representing the immediately enclosing instance of the class (§8.8.1, §15.9.2, §15.9.3).
>> The default constructor has no throws clauses.
>> If the class being declared is the primordial class Object, then the default constructor has an empty body. Otherwise, the default constructor simply invokes the superclass constructor with no arguments.
>> The form of the default constructor for an anonymous class is specified in §15.9.5.1.
>> It is a compile-time error if a default constructor is implicitly declared but the superclass does not have an accessible constructor that takes no arguments and has no throws clause.
>>
>>
>> 如果一个类不包含构造函数声明，那么一个缺省构造函数就会被隐式声明。 对于顶级类、成员类或局部类，缺省构造函数类的形式如下:
>> 缺省构造函数的可达性和这个class一样(6.6)。
>> 缺省构造函数没有形式参数，除了在非私有的内部成员类中，其中缺省构造函数隐式声明了一个形式参数，表示类的直接封闭实例(8.8.1,15.9.2,15.9.3)。
>> 缺省构造函数没有抛出。
>> 如果声明的类是原始类 Object，那么缺省构造函数就是一个空体。 否则，缺省构造函数只是简单地调用超类构造函数，没有参数。
>> 匿名类的缺省构造函数表格在15.9.5.1中指定。

接下来测试一下内部类的构造函数

```java
public class Top{
   class A {
      class B {
         class C {
         }
      }
   }

   /**
    * 通过反射打印其所有的构造方法
    */
   static void printAllConstructors(@NotNull Class clazz) {
      System.out.println(String.format("%s : [\n\t\t%s\n\t]", clazz.getName(), StringUtils.join(clazz.getDeclaredConstructors(), "\n\t\t")));
   }

   public static void main(String[] args) {
      printAllConstructors(A.class);
      printAllConstructors(A.B.class);
      printAllConstructors(A.B.C.class);
   }
}
```

> 如上面的一个java文件代码, Top是外部类, A, B, C 是非静态内部类, A是Top的内层类,  B是A的内层类,  C是B的内层类.

因为A, B, C都不是静态的, 此时如果想要创建一个A, 必须要有一个Top的实例存在, 创建一个B, 则必须要有A的实例存在, 创建一个C则需要有B的实例存在.

而此时A, B, C的默认构造方法也不是所谓的无参构造方法, 它们其实都是有参的, 如果运行上面的main方法, 则输出以下内容:

```ts
cn.cpf.se.thread.Top$A : [
      cn.cpf.se.thread.Top$A(cn.cpf.se.thread.Top)
   ]
cn.cpf.se.thread.Top$A$B : [
      cn.cpf.se.thread.Top$A$B(cn.cpf.se.thread.Top$A)
   ]
cn.cpf.se.thread.Top$A$B$C : [
      cn.cpf.se.thread.Top$A$B$C(cn.cpf.se.thread.Top$A$B)
   ]
```

---

> 这些类在平时编码的时候由于java语言的特性, 我们一般不用管内部类的构造方法到底如何, 但是如果使用反射创建这些内部类的实例的话, 就需要在构造方法前面加外部类实例.

```java
class Top{

    private static class Outer1 {
        private static class Outer1_1 {
        }
    }

    private static class Outer2 {
      //   public void create() {
      //       new Outer2_1();
      //   }
        private class Outer2_1 {
        }
    }

    private class Outer3 {
      //   public void create() {
      //       new Outer3_1();
      //   }
        private class Outer3_1 {
        }
    }

    private class Outer4 {
    }

    private class Outer5 {
        public Outer5() {
        }
    }

    private class Outer6 {
        public Outer6(String arg) {
        }
    }

    private class Outer7 {
        public Outer7() {
        }
        public Outer7(String arg) {
        }
    }

    private static class StaticOuter4 {
    }

    private static class StaticOuter5 {
        public StaticOuter5() {
        }
    }

    private static class StaticOuter6 {
        public StaticOuter6(String arg) {
        }
    }

    private static class StaticOuter7 {
        public StaticOuter7() {
        }
        public StaticOuter7(String arg) {
        }
    }

   //  public void create() {
   //      new Outer1();
   //      new Outer1.Outer1_1();
   //      new Outer2();
   //      new Outer3();

   //      new Outer4();
   //      new Outer5();
   //      new Outer6("");
   //      new Outer7();

   //      new StaticOuter4();
   //      new StaticOuter5();
   //      new StaticOuter6("");
   //      new StaticOuter7();
   //  }

    public static void printAllConstructors(@NotNull Class clazz) {
        System.out.println(String.format("%s : [\n\t\t%s\n\t]", clazz.getName(), StringUtils.join(clazz.getDeclaredConstructors(), "\n\t\t")));
    }

    public static void main(String[] args) {
        printAllConstructors(Outer1.class);
        printAllConstructors(Outer1.Outer1_1.class);

        printAllConstructors(Outer2.class);
        printAllConstructors(Outer2.Outer2_1.class);

        printAllConstructors(Outer3.class);
        printAllConstructors(Outer3.class.getDeclaredClasses()[0]);

        printAllConstructors(Outer4.class);
        printAllConstructors(Outer5.class);
        printAllConstructors(Outer6.class);
        printAllConstructors(Outer7.class);

        printAllConstructors(StaticOuter4.class);
        printAllConstructors(StaticOuter5.class);
        printAllConstructors(StaticOuter6.class);
        printAllConstructors(StaticOuter7.class);
    }
}
```

上面代码的执行结果

```ts
cn.cpf.se.thread.Top$Outer1 : [
      private cn.cpf.se.thread.Top$Outer1()
   ]
cn.cpf.se.thread.Top$Outer1$Outer1_1 : [
      private cn.cpf.se.thread.Top$Outer1$Outer1_1()
   ]
cn.cpf.se.thread.Top$Outer2 : [
      private cn.cpf.se.thread.Top$Outer2()
   ]
cn.cpf.se.thread.Top$Outer2$Outer2_1 : [
      private cn.cpf.se.thread.Top$Outer2$Outer2_1(cn.cpf.se.thread.Top$Outer2)
   ]
cn.cpf.se.thread.Top$Outer3 : [
      private cn.cpf.se.thread.Top$Outer3(cn.cpf.se.thread.Top)
   ]
cn.cpf.se.thread.Top$Outer3$Outer3_1 : [
      private cn.cpf.se.thread.Top$Outer3$Outer3_1(cn.cpf.se.thread.Top$Outer3)
   ]
cn.cpf.se.thread.Top$Outer4 : [
      private cn.cpf.se.thread.Top$Outer4(cn.cpf.se.thread.Top)
   ]
cn.cpf.se.thread.Top$Outer5 : [
      public cn.cpf.se.thread.Top$Outer5(cn.cpf.se.thread.Top)
   ]
cn.cpf.se.thread.Top$Outer6 : [
      public cn.cpf.se.thread.Top$Outer6(cn.cpf.se.thread.Top,java.lang.String)
   ]
cn.cpf.se.thread.Top$Outer7 : [
      public cn.cpf.se.thread.Top$Outer7(cn.cpf.se.thread.Top)
      public cn.cpf.se.thread.Top$Outer7(cn.cpf.se.thread.Top,java.lang.String)
   ]
cn.cpf.se.thread.Top$StaticOuter4 : [
      private cn.cpf.se.thread.Top$StaticOuter4()
   ]
cn.cpf.se.thread.Top$StaticOuter5 : [
      public cn.cpf.se.thread.Top$StaticOuter5()
   ]
cn.cpf.se.thread.Top$StaticOuter6 : [
      public cn.cpf.se.thread.Top$StaticOuter6(java.lang.String)
   ]
cn.cpf.se.thread.Top$StaticOuter7 : [
      public cn.cpf.se.thread.Top$StaticOuter7()
      public cn.cpf.se.thread.Top$StaticOuter7(java.lang.String)
   ]

Process finished with exit code 0
```

注意上面的内部类都没有被直接调用到其构造方法, 如果上面的内部类都被调用到其构造方法的话会怎么样呢?

如果去掉上面的一些被注释的代码, 那么输出的结果如下

```ts
cn.cpf.se.thread.Top$Outer1 : [
      private cn.cpf.se.thread.Top$Outer1()
      cn.cpf.se.thread.Top$Outer1(cn.cpf.se.thread.Top$1)
   ]
cn.cpf.se.thread.Top$Outer1$Outer1_1 : [
      private cn.cpf.se.thread.Top$Outer1$Outer1_1()
      cn.cpf.se.thread.Top$Outer1$Outer1_1(cn.cpf.se.thread.Top$1)
   ]
cn.cpf.se.thread.Top$Outer2 : [
      private cn.cpf.se.thread.Top$Outer2()
      cn.cpf.se.thread.Top$Outer2(cn.cpf.se.thread.Top$1)
   ]
cn.cpf.se.thread.Top$Outer2$Outer2_1 : [
      private cn.cpf.se.thread.Top$Outer2$Outer2_1(cn.cpf.se.thread.Top$Outer2)
      cn.cpf.se.thread.Top$Outer2$Outer2_1(cn.cpf.se.thread.Top$Outer2,cn.cpf.se.thread.Top$1)
   ]
cn.cpf.se.thread.Top$Outer3 : [
      private cn.cpf.se.thread.Top$Outer3(cn.cpf.se.thread.Top)
      cn.cpf.se.thread.Top$Outer3(cn.cpf.se.thread.Top,cn.cpf.se.thread.Top$1)
   ]
cn.cpf.se.thread.Top$Outer3$Outer3_1 : [
      private cn.cpf.se.thread.Top$Outer3$Outer3_1(cn.cpf.se.thread.Top$Outer3)
      cn.cpf.se.thread.Top$Outer3$Outer3_1(cn.cpf.se.thread.Top$Outer3,cn.cpf.se.thread.Top$1)
   ]
cn.cpf.se.thread.Top$Outer4 : [
      private cn.cpf.se.thread.Top$Outer4(cn.cpf.se.thread.Top)
      cn.cpf.se.thread.Top$Outer4(cn.cpf.se.thread.Top,cn.cpf.se.thread.Top$1)
   ]
cn.cpf.se.thread.Top$Outer5 : [
      public cn.cpf.se.thread.Top$Outer5(cn.cpf.se.thread.Top)
   ]
cn.cpf.se.thread.Top$Outer6 : [
      public cn.cpf.se.thread.Top$Outer6(cn.cpf.se.thread.Top,java.lang.String)
   ]
cn.cpf.se.thread.Top$Outer7 : [
      public cn.cpf.se.thread.Top$Outer7(cn.cpf.se.thread.Top)
      public cn.cpf.se.thread.Top$Outer7(cn.cpf.se.thread.Top,java.lang.String)
   ]
cn.cpf.se.thread.Top$StaticOuter4 : [
      private cn.cpf.se.thread.Top$StaticOuter4()
      cn.cpf.se.thread.Top$StaticOuter4(cn.cpf.se.thread.Top$1)
   ]
cn.cpf.se.thread.Top$StaticOuter5 : [
      public cn.cpf.se.thread.Top$StaticOuter5()
   ]
cn.cpf.se.thread.Top$StaticOuter6 : [
      public cn.cpf.se.thread.Top$StaticOuter6(java.lang.String)
   ]
cn.cpf.se.thread.Top$StaticOuter7 : [
      public cn.cpf.se.thread.Top$StaticOuter7()
      public cn.cpf.se.thread.Top$StaticOuter7(java.lang.String)
   ]

Process finished with exit code 0

```
