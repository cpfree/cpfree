# private 穿透问题

> 之前一直以为 在同一个顶级外部类(top outer Class)中, 所有private标记的对象均可在同一个顶级外部类中被访问.

直到出现以下代码

```java
public class TopOuter {

   class A {
      private int a = 10;
   }

   class B extends A {
      
      // 在B中是可以访问 A 的成员变量 a

   }

   class C extends B {

      // 在 C 中无法访问 A 的成员变量 a
   }

}
```

代码
