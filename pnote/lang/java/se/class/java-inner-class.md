# 内部类

简介 : 放在一个类的内部的类我们就叫内部类。

##  作用

1. 内部类可以很好的实现隐藏 :
   一般的非内部类，是不允许有  private  与 protected 权限的，但内部类可以.
   外部类无法看到一个类中的 private 内部类, 所以说它可以很好的实现隐藏。
2. 内部类拥有外围类的所有元素的访问权限
3. 可是实现多重继承
   使得 Java 的继承机制更加完善。大家都知道 Java 只能继承一个类，它的多重继承在我们没有学习内部类之前是用接口来实现的。但使用接口有时候有很多不方便的地方。比如我们实现一个接口就必须实现它里面的所有方法。而有了内部类就不一样了。它可以使我们的类继承多个具体类或抽象类。
4. 可以避免修改接口而实现同一个类中两种同名方法的调用。
   如果，你的类要继承一个类，还要实现一个接口，可是你发觉你继承的类和接口里面有两个同名的方法怎么办？你怎么区分它们？？这就需要我们的内部类了。
   可以用内部类来实现接口，这样就不会与外围类的方法冲突了

## 示例

### 使用内部类变相实现多继承

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

### 内部类的私有属性可以在外部类中调用

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
