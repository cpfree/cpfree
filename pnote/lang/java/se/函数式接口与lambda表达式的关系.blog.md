
# 函数式接口 与 lambda 表达式 的关系

## 概念简述

1. Lambda 表达式（lambda expression）是一种`表达式语法`, **注意在java里面, 它不是对象**.  以下均是lambda表达式

   ```java
      () -> "haha"
      a -> "hehe"
    ```

   > java 中, `类名::方法名` 和 `对象::方法名` 也都是 lambda 表达式

2. 函数式接口(Functional Interface)就是一个有且仅有一个抽象方法,但是可以有多个非抽象方法的接口。

---

## 函数式接口 与 lambda 表达式的关系

1. `lambda表达式`不能直接使用,在使用之前必须`初始化`.
2. `lambda表达式`必须借助`函数式接口`来初始化.
3. `lambda表达式`初始化之前什么都不是,初始化之后是一个`函数式接口`的实例对象.

### 1. lambda表达式不能直接使用,在使用之前必须初始化

下面三个lambda表达式 只是一种语法, 你无法确定它们到底是个什么东西.

   ```java
      () -> {}
      () -> "gaga";
      String::new;
   ```

### 2. `lambda表达式`必须借助`函数式接口`来初始化

以 `() -> "gaga"` 为例, 它是一个lambda表达式, 必须初始化才能使用, 要想初始化, 必须要借助具体的函数式接口.

下面是这个lambda表达式的初始化.

   ```java
      // 被 Supplier 初始化之后, 变成一个 Supplier 实例对象
      Supplier<String> supplier = () -> "gaga";

      // 被 Runnable 初始化之后, 变成一个 Runnable 实例对象
      Runnable supplier = () -> "gaga";
      // 当然你也可以自定义一个韩式式
   ```

甚至你可以自定义一个函数式接口, 如下

   ```java
      @FunctionalInterface
      interface Haha {
         Object hehe();
      }

      // 被 Haha 初始化之后, 变成一个 Haha 实例对象
      Haha supplier = () -> "gaga";
   ```

### 3. `lambda表达式`初始化之前什么都不是,初始化之后是一个`函数式接口`的实例对象

1. 函数式接口实例对象是一个对象, 因此是一个Object, 拥有 Object 的一切特性.
2. lambda 表达式 在初始化之前只是一种语法, 它不是对象, 也不能被引用.

   ```java
      // 被 Supplier 初始化之后, 变成一个 Supplier 实例对象
      Supplier<String> supplier = () -> "gaga";

      // 初始化之后是一个函数式接口实例对象, 因此可以被 Object 引用
      Object o = arr;

      // 但是 你不能直接使用 Object 引用它, 因为它还未经过初始化, 此时还不是对象.
      Object f = () -> "gaga"; // ERROR
   ```

## 此外函数式接口还有一些有趣的地方

`lambda表达式` 在被函数式接口初始化后成为一个对象.
在java 中, `类名::方法名` 和 `对象::方法名` 也都是 `lambda 表达式`.
因此, `对象::方法名` 还能被函数式接口初始化.

   示例

   ```java
   // supplier1 是一个函数式接口实例对象
   Supplier<String> supplier1 = () -> "gaga"

   // supplier1 是一个对象, 因此 supplier1::get 是一个lambda表达式, 既然是 lambda 表达式 那么能被函数式接口初始化
   Supplier<String> supplier2 = supplier1::get;

   // 我要连续初始化 100次, 每次初始化都相当于创建了一个新的实例对象
   for (int i = 0; i < 100; i ++) {
      supplier2 = supplier2::get
   }
   ```

那么, 这个有什么用呢?

   例如, 下面是一个函数式接口`Haha`和一个实例`Supplier`, 它们的结构大同小异.

   ```java
      @FunctionalInterface
      interface Haha {
         Object hehe();
      }

      Supplier<String> supplier = () -> "gaga"
   ```

   你需要一个 Haha 接口实例, 但是现在你只有一个 `Supplier<String>` 实例, 此时你就可以这样转换

   ```java
   Haha haha = supplier::get;
   ```

---

## 数组的初始化(对比lambda表达式初始化)

> 如果你对lambda的初始化还不了解, 那就请参照下数组的初始化, lambda表达式和数组的初始化很像.

1. `{3, 4, 5, 6}` 是一种表达数组的语法. 它不能直接使用,在使用之前必须`初始化`.
2. `{3, 4, 5, 6}`必须借助`具体的类型`来初始化.
3. `{3, 4, 5, 6}` 初始化之后是一个`数组`的实例对象.

> `int[]` 是一种具体的类型, `int[].class` 是有意义的

```java
   // 1. 这个是数组的初始化. 初始化可不仅仅是一个赋值引用的操作.
   int[] arr = {3, 4, 5, 6};

   // 被 byte[] 初始化后是一个byte数组, 被 Integer[] 初始化之后是一个 Integer 数组
   byte[] arr2 = {3, 4, 5, 6};
   Integer[] arr3 = {3, 4, 5, 6};

   // arr 初始化之后是一个对象, 因此 arr 在初始化之后可以被 Object 引用
   Object o = arr;

   // 但是 你不能直接使用 Object 引用它, 因为它还未经过初始化, 此时还不是对象.
   Object f = {3, 4, 5, 6}; // ERROR
```
