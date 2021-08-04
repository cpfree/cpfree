# 嵌套类

嵌套类是其封闭类的成员, 嵌套类可以分为静态嵌套类(还可以成为静态内部类)和非静态嵌套类(内部类), 所以说`静态内部类 不是 内部类`, 它们两个是互斥的.

‎嵌套类是其封闭类的成员。非静态嵌套类（内部类）可以访问封闭类的其他成员，即使它们被宣布为私有。静态嵌套类无法访问封闭类的其他成员。作为成员，一个嵌套类可以宣布，或‎‎包私人‎‎。（回想一下，外部类只能申报或‎‎包装为私人‎‎。‎OuterClassprivatepublicprotectedpublic

## 内部类

## info

1. 一个java源文件里面最多只能有一个public顶层类, 且public顶层类的类名需要和java文件名相同.
2. 能修饰顶层类的只有public和默认关键字(不写修饰).
3. 多个顶层类可以写进一个 java 源文件里面, 这样写的效果和将这些 class 文件单独写在同包里的效果相同,
4. private 在同一个顶层类中没有任何效果.其效果只作用于顶层类之外.

---

###  作用

1. 内部类可以很好的实现隐藏 :
   一般的非内部类，是不允许有  private  与 protected 权限的，但内部类可以.
   外部类无法看到一个类中的 private 内部类, 所以说它可以很好的实现隐藏。
2. 内部类拥有外围类的所有元素的访问权限
3. 可是实现多重继承
   使得 Java 的继承机制更加完善。大家都知道 Java 只能继承一个类，它的多重继承在我们没有学习内部类之前是用接口来实现的。但使用接口有时候有很多不方便的地方。比如我们实现一个接口就必须实现它里面的所有方法。而有了内部类就不一样了。它可以使我们的类继承多个具体类或抽象类。
4. 可以避免修改接口而实现同一个类中两种同名方法的调用。
   如果，你的类要继承一个类，还要实现一个接口，可是你发觉你继承的类和接口里面有两个同名的方法怎么办？你怎么区分它们？？这就需要我们的内部类了。
   可以用内部类来实现接口，这样就不会与外围类的方法冲突了

### 研究

#### 1. 内部类的创建

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
   
   // 但是在外部创建内部类会变得十分怪异
   public static void main(String[] args) {
      // 内部类实例化
      Outer outer = new Outer();
      Outer.A a = outer.new A();
      a.test();
   }
}
```


### 示例

#### 1. 使用内部类变相实现多继承

   ```java
   class Example1 {

      public String name()
      {
         return "liutao";
      }
   }
   class Example2 {

      public int age()
      {
         return 25;
      }
   }

   class MainExample
   {
      private class test1 extends Example1
      {
         public String name()
         {
               return super.name();
         }
      }
      private class test2 extends Example2
      {
         public int age()
         {
               return super.age();
         }
      }
      public String name()
      {
         return new test1().name();
      }
      public int age()
      {
         return new test2().age();
      }
      public static void main(String args[])
      {
         MainExample mi = new MainExample();
         System.out.println("姓名:" + mi.name());
         System.out.println("年龄:" + mi.age());
      }
   }
   ```

#### 2. 内部类的私有属性可以在外部类中调用

   ```java
   public class Technique {

      public static void main(String[] args) {
         new Technique().stream();
      }

      public void stream() {
         haha hh = new haha();
         hh.p1 = 5;
         System.out.println(hh.p1);
         new Technique.Hehe().test();
      }

      class Hehe{
         public void test() {
               haha hh = new haha();
               System.out.println(hh.p2);
         }
      }

      class haha {
         private int p1 = 1;
         private int p2 = 2;
      }

   }
   ```
