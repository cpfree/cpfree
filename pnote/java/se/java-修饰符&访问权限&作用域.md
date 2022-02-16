---
keys: 
type: blog
url: <>
id: 220216-184657
---

# java 作用域

## 访问权限修饰符

1. public
2. protected
3. private
4. 不带任何修饰符

| 访问权限  | 同一个顶级外部类 | 同包 | 不同包, 子类 | 不同包 & 非子类 |
| --------- | ---------------- | ---- | ------------ | --------------- |
| Public    | ✔                | ✔    | ✔            | ✔               |
| Protected | ✔                | ✔    | ✔            | ❌              |
| Default   | ✔                | ✔    | ❌           | ❌              |
| Private   | ✔                | ❌   | ❌           | ❌              |

1. 一个java源文件里面最多只能有一个public顶层类, 且public顶层类的类名需要和java文件名相同.
2. 能修饰顶层类的只有public和默认关键字(不写修饰).
3. 多个顶层类可以写进一个 java 源文件里面, 这样写的效果和将这些 class 文件单独写在同包里的效果相同,
4. private 在同一个顶层类中没有任何效果.其效果只作用于顶层类之外.

## 嵌套类中的private

   ```java
   package cn.cpf.test;

   import org.junit.Test;

   public class NestedClassTest {

      // 可以被子类进行访问
      private int topPrivateVal = 8;

      class Father {
         public int publicVal = 19;
         protected int protectVal = 29;
         int defaultVal = 39;;
         // 在当前顶级外部类中, private 是无效的, 但是若是其子类进行访问的话, 则需要加 super 关键字.
         private int privateVal = 49;
      }

      class Son extends Father {

         public void test1() {
               System.out.println(publicVal);
               System.out.println(protectVal);
               System.out.println(defaultVal);
               // FIXME 爆红, 编译的话会失败,
               // System.out.println(privateVal);
               // FIXME 但是却可以通过 super 关键字访问, 这个是没有问题的.
               System.out.println(super.privateVal);
         }

         public void test() {
               System.out.println(topPrivateVal);
         }
      }

   }
   ```

1. **顶级外部类内部对 `private` 的调用均是可以的**.

   如上面的内部类 `Father` 类, 它其中的 `private int privateVal` 实际上是在 `NestedClassTest` 类中的任何一个地方均可以被调用到的.

2. 但是存在一个问题, 若其子类去访问的时候, 如上面代码中的`Son`, 子类找不到 `privateVal` 属性.

   此时原因是

   java规则: **子类无法调用父类的private字段** 优先生效, 因此`Son`类找不到 `privateVal` 属性, 强行使用会导致编译失败.
   但是又由于 **顶级外部类内部对 `private` 的调用均是可以的**, 因此 可以通过 super 关键字去调用. 如上面的 `super.privateVal`.

### 内部类中调用字段查找顺序

1. 优先从本类里面查找字段.

2. 再从父类里面查找字段.

   `public` 和 `protected` 在此处是可以找到的.
   对于默认字段来说, 若是父类不在当前包里面, 则无法找到 `默认` 访问权限字段.
   对于`private`字段来说, 即便父类和本类同在内部类之中, 但是`private`字段也没有办法直接访问, 但是可以通过 `super` 关键字调用`private`字段.

3. 再从外部类里面去查找字段

**demo**

   ```java
   package cn.cpf.test;

   import org.junit.Test;

   public class NestedClassTest {

      String val1 = "NestedClassTest.val-1";
      String val2 = "NestedClassTest.val-2";
      String val3 = "NestedClassTest.val-3";

      class Father {
         String val1 = "Father.val-1";
         String val2 = "Father.val-2";
      }

      class Son extends Father {

         String val1 = "Son.val-1";

         public void test2() {
               System.out.println(val1);
               System.out.println(val2);
               System.out.println(val3);
         }
      }

      @Test
      public void test() {
         Son son = new Son();
         son.test2();
      }
   }
   ```

运行结果是

   ```log
   Son.val-1
   Father.val-2
   NestedClassTest.val-3
   ```
