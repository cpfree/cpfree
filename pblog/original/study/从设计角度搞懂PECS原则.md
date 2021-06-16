# 从设计角度搞懂PECS原则

[TOC]

## 场景还原

一个java开发者在其开发的生涯中, 难免会写这样的代码

   ```java
   List<Son> ss = new ArrayList<>();
   // 父类对象的集合引用子类对象的集合
   List<Father> fs = ss;
   ```

   > 也许你更多的遇到的是一个方法参数是`List<Father>`, 但是你传入了一个`List<Son>`进去, 但是无所谓了, 上面只是一个示例

然后编辑器就会爆红, 编译的时候也会抛出异常.

但是如果我们将代码写成下面的样子

   ```java
   List<? extends Son> ss = new ArrayList<>();
   // 父类对象的集合引用子类对象的集合
   List<? extends Father> fs = ss;
   ```

然后就发现, 编译正常通过, 运行也正常, 但是在我们在调用`add()` 方法, 往里面加对象时却发现, 编译器再次爆红

   ```java
   List<? extends Son> ss = new ArrayList<>();
   // 父类对象的集合引用子类对象的集合
   List<? extends Father> fs = ss;
   // 编译不通过, 爆红
   fs.add(new Father())
   ```

然后我们就特别不理解为什么会这样!

## 查找找原因

当我们上网查找原因时, 无非就是搜到

1. `向上转型是安全的，向下转型是不安全的，除非你知道List中的真实类型，否则向下转型就会报错`
2. `T` 和 `? extends T` 和 `? super T` 的区别.
3. 上界, 下界之类的概念
4. 或是PECS之类的概念

   ```txt
   PECS
   Remember PECS: “Producer Extends, Consumer Super”.

   “Producer Extends” - If you need a List to produce T values (you want to read Ts from the list), you need to declare it with ? extends T, e.g. List<? extends Integer>. But you cannot add to this list.

   “Consumer Super” - If you need a List to consume T values (you want to write Ts into the list), you need to declare it with ? super T, e.g. List<? super Integer>. But there are no guarantees what type of object you may read from this list.

   If you need to both read from and write to a list, you need to declare it exactly with no wildcards, e.g. List.
   ```

---

老实说, 看了上面的乱起八糟的东西, 我是一脸懵逼, 最终捣鼓研究之后才明白, 哦! 原来是这种情况.

虽然这个设计理念很合理, 但是对于开发者学习来讲, 特别不友好, 我觉得很多人初学这些概念的时候也和我一样都是一脸懵逼的状态.

为了方便大家的理解, 我们站在设计者的角度上去考虑这样设计的缘由.

## 从设计角度分析`T`和`? extends T`

先来一个接口`Fruit`, 两个类 `Apple` 和 `Pair` 都是 `Fruit` 的实现类.

   ```java
   interface Fruit { }

   class Apple implements Fruit { }

   class Pair implements Fruit { }
   ```

我们都知道苹果是一个水果, 那么一箱苹果也是一箱水果

那么我们可以很自然的在java中这样设计;

因为苹果是一个水果

   ```java
   Apple apple = new Apple();
   Fruit fruit = apple;
   ```

所以一箱苹果也是一箱水果

   ```java
   List<Apple> apples = new ArrayList<Apple>();
   List<Fruit> fruits = (List<Fruit>) apples; // 假设这个是对的
   ```

可是这里就出现了一个问题

`List<Apple> apples = new ArrayList<Apple>();`我们需要把它看成两部分.
等号后面`new ArrayList<Apple>()` 这是一个苹果篮子的实例对象, 它只能够放苹果, 不能够往里面加梨.
等号前面是它的引用, 当这个苹果篮子的实例对象被`List<Apple>`类型引用时, 我们可以正常使用它, 我们可以通过add()方法往里面加苹果, 不能够往里面加梨.
但是当这个苹果篮子的实例对象被`List<Fruit>`类型引用时, 我们就可以往里面放`Fruit`, 那么我们既可以往里面放苹果, 也可以放梨.
然后就造成了一个设计上的bug, **我们往一个只能够放苹果的篮子里面放入了梨**.

   ```java
      public void test1() {
         // 水果篮子, 不仅可以放苹果, 还可以放梨
         List<Fruit> fruits = new ArrayList<>();
         // 一篮水果, 只能放苹果
         List<Apple> apples = new ArrayList<>();
         // 苹果是一个水果, 但是一箱苹果不是一箱水果
         // 当你把一篮苹果看成一篮水果, 那么这篮子水果里面岂不是可以放梨
         List<Fruit> fruitList = (List<Fruit>) apples;  // 编译错误
      }
   ```

**那么这样设计肯定是不行的, 它有一个冲突**

   1. `苹果是一个水果, 那么一箱苹果也是一箱水果`, 这个是我们的生活常识, 但是java的语言特性让我们不能够将`List<Apple>`看成是`List<Fruit>`.
   2. 但是在很多情况下, 我们的确需要将`一箱苹果看作是一箱水果`.

为了解决上面的冲突, 单凭一个`List<T>` 肯定是不够的, 那么我们引入一个`List<? extend T>`.

我们可以这样
   我们不能直接将`List<Apple>`看成是`List<Fruit>`,
   但是我们可以将`List<Apple>`看作是`List<? extend Apple>`,
   然后再将`List<? extend Apple>`看成是`List<? extend Fruit>`.

   ```java
   List<Apple> apples = new ArrayList<Apple>();
   List<Fruit> fruits = apples; // error

   List<? extend Apple> appleTs = apples;
   List<? extend Fruit> fruitTs = appleTs;
   ```

我们将 `List<Fruit>` 看作是一个引用, 它引用的就是一箱水果(`new ArrayList<Fruit>()`), 没有其他的可能, 因此它里面可以放苹果, 可以放梨, 放桃子.
我们将 `List<? extend Fruit>` 看作是一个引用, 它引用的可能是一箱只能放苹果的篮子, 也可能是一个只能放水果的篮子,
   - 我们不能够确定它里面能够放什么东西, 因此我们干脆在设计的时候就**禁止往它里面放东西**.
   - 但是这里面却可以取东西, 因为不管这里面是一箱只能放苹果的篮子或是一个只能放水果的篮子, 从它里面取出来的必定是水果.

## 同理扩展分析`T`和`? super T`

   ```java
   interface Fruit {
      default void fun1();
   }

   class Vegetable { 
      void fun2(){}
   }

   class Tomato extends Vegetable implements Fruit {
   }
   ```

   对于一个`Fruit`实例对象来讲, 其中只有 `fun1()` 方法.
   但是如果 `List<? super Tomato>` 中存入的可以看作是 `Tomato`, `Tomato` 既有 `fun1()` 方法, 也有`fun2()`.
   但是如果`List<? super Tomato>` 实际引用的对象是一个`List<Vegetable>`, 那么`List<? super Tomato>`通过`get()`获取到的`"Tomato"`对象实际上是一个`Vegetable`的实体类, 那么调用`"Tomato"`的fun1(), 实际上调用的是`Vegetable`中的 `fun1()`, 但是 `Vegetable`中没有`fun1()`, 因此会出现冲突.
   `List<? super Tomato>` 中的实例我们不知道是什么, 但是只要是实例, 那么就是一个Object

   因此<? super T>，set()方法正常，但get()只能存放Object对象里

   ```java
   List<Fruit> fruits = new ArrayList<>();
   List<? super Tomato> list = fruits;

   list.get(0).fun2(); // 获取到的是Fruit实例, 但是Fruit里面没有fun2()函数
   ```

## 结论

`List<T>` 之间是不能相互引用转换的(`List<Fruit>` 和 `List<Apple>` 不能相互转换).
为了使集合模板相互转换, 我们可以先将 `List<T>` 变成 `List<? extends T>` 或 `List<? super T>`, 然后进行引用转换.

实际上无论是方法传参还是引用赋值, 你会发现无非就是引用之间的关系转换.

我们抛开对象, 只看引用关系, 用代码表示那么就是下面的样子

```java

    interface Fruit { }

    static class Apple implements Fruit { }

    public static void extendsTest(String[] args) {
        List<Apple> apples = null;
        List<Fruit> fruits = null;
        
        List<? extends Apple> appleExtends = null;
        List<? extends Fruit> fruitExtends = null;
        
        // List<Apple> 可以转化为 List<? extends Apple>
        appleExtends = apples;
        // List<Apple> 可以转化为 List<? extends Fruit>
        fruitExtends = apples;
        // List<? extends Apple> 可以转化为 List<? extends Fruit>
        fruitExtends = appleExtends;

        // 可以正常 get
        final Apple apple = appleExtends.get(0);
        // 添加对象特爆红, 编译不通过
        appleExtends.add(new Apple());  // error
    }


    public static void superTest(String[] args) {
        List<Apple> apples = null;
        List<Fruit> fruits = null;
        List<? super Fruit> fruitSupers = null;
        List<? super Apple> appleSupers = null;

        // List<Apple> 可以转化为 List<? extends Apple>
        appleSupers = apples;
        // List<Apple> 可以转化为 List<? extends Fruit>
        fruitSupers = fruits;
        // List<? extends Apple> 可以转化为 List<? extends Fruit>
        appleSupers = fruitSupers;

        // 添加对象正常
        appleSupers.add(new Apple());
        // 获取对象必须使用 Object 引用
        final Object object = appleSupers.get(0);
    }

```

转换为图片就是下面的关系

![图 1](https://gitee.com/cpfree/picture-warehouse/raw/master/images/common/892e40650d39a96368616ea740834393b0c0cb5ec7c3c6b92799e1f1fe24739c.png)  

接下来看PECS是不是就很清晰了呢?

   ```txt
   Remember PECS: “Producer Extends, Consumer Super”.

   “Producer Extends” - If you need a List to produce T values (you want to read Ts from the list), you need to declare it with ? extends T, e.g. List<? extends Integer>. But you cannot add to this list.

   “Consumer Super” - If you need a List to consume T values (you want to write Ts into the list), you need to declare it with ? super T, e.g. List<? super Integer>. But there are no guarantees what type of object you may read from this list.

   If you need to both read from and write to a list, you need to declare it exactly with no wildcards, e.g. List.
   ```
