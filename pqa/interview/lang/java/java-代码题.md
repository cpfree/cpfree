# java code question

## 编程知识

1. 下面输出结果是什么

   ```java
   public void test() {
      String s1 = new StringBuilder("12").append("ab").toString();
      System.out.println(s1.intern() == s1);
      String s2 = new StringBuilder().append("1234").toString();
      System.out.println(s2.intern() == s2);
      String s3 = new StringBuilder("ja").append("va").toString();
      System.out.println(s3.intern() == s3);
   }
   ```

   输出 : <span style="color: transparent"> true, false, false </span>

2. 下面输出结果是什么

   ```java
   import java.lang.reflect.Field;

   public class SwapTwoRefValueByReflect {

      public static void main(String[] args) throws NoSuchFieldException, IllegalAccessException {
         Object obj1 = 2;
         Object obj2 = 5;
         new SwapTwoRefValueByReflect().SwapTwoRefValueByReflect(obj1, obj2);
         System.out.println(obj1);
         System.out.println(obj2);
      }

      public void SwapTwoRefValueByReflect(Object obj1, Object obj2) throws NoSuchFieldException, IllegalAccessException {
         Field field = obj1.getClass().getDeclaredField("value");
         field.setAccessible(true);
         System.out.println("inner : obj1 " + obj1);
         System.out.println("inner : obj2 " + obj2);

         field.set(obj1, obj2);
         field.set(obj2, 8);
         System.out.println("inner : obj1 " + obj1);
         System.out.println("inner : obj2 " + obj2);
      }
   }
   ```

3. `String str = "a" + new String("b");` 创建了几个对象

   <details>
   <summary>answer3</summary>

   字符串常量池: "a", "b"
   堆: "b", "ab"
   再加上一个StringBuilder()对象.

   共5个对象.

      > tip
      >
      > 1. StringBuilder和SpringBuffer的toString()方法最终都是return一个new String()对象
      > 2. 字符串连接符可以看作 `new StringBuilder().append()` 方式的语法糖.

   </details>

4. 下面代码编译后再反编译会变成什么?

   ```java
   public static void main(String[] args) {
      String uuid = UUID.randomUUID().toString();
      String s1 = "hello" + "world";
      String s2 = "a" + new String("b");
      String s3 = "a" + uuid + "b";
      int i1 = 5 + 6;
      int i2 = Integer.MAX_VALUE + 6;
      double d1 = 5 + 6;
   }
   ```

   <details>
   <summary>answer4</summary>

      ```java
      public static void main(String[] args) {
         String uuid = UUID.randomUUID().toString();
         String s1 = "helloworld";
         String s2 = "a" + new String("b");
         String s3 = "a" + uuid + "b";
         int i1 = true;
         int i2 = -2147483643;
         double d1 = 11.0D;
      }
      ```
   
   </details>

## answer

<details>
<summary>answer1</summary>

true, false, false

   > tip
   >
   > 1. StringBuilder和SpringBuffer的toString()方法最终都是return一个new String()对象
   > 2. String的intern()方法是查找常量池里面是否有同样的字符串, 若有则返回常量池里面的字符串, 若没有则返回其本身.
   > 3. 使用双引号创建的字符串存在常量池里面, 使用new String()创建的字符串存在堆里面.
   > 4. 类似"java"这类字符串, 虚拟机里在初始化的时候就有的.

   s1指向的是堆里的String对象, 同时常量池里面没有和s1相同的值, 故返回的是s1本身
   s2里面有个`"1234"`, 直接定义出来了, 其intern()方法指向的是常量池里面的字符串对象

</details>

<details>
<summary>answer2</summary>

   ```t
   inner : obj1 2
   inner : obj2 5
   inner : obj1 5
   inner : obj2 8
   5
   8
   ```

</details>


