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
   class Outer {
      
      private int num = 8;

      class Father {
         protected int a = 9;
      }

      /**
      * 可以访问 b, 但是不能访问 a
      */
      class Son extends Father {

         public void test1() {
            // FIXME 爆红, 编译的话会失败, 
            System.out.println(a);
         }

         public void test() {
               System.out.println(super.a);
               super.a = 91;
               System.out.println(super.a);
               System.out.println(num);
         }
      }

   }

   ```

> 在嵌套类里面, 使用super关键字, 是可以调到 a 的, 但是不使用super关键字的话, 就无法调用到a, 但是若`Son` 和`Father` 不在嵌套类里面的话是可以直接调用到`a`的
