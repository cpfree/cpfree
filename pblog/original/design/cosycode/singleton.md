# 单例模式工具类`LazySingleton`

## 单例模式简介

> 本篇内容只是对单例模式简单介绍概念, 因为本篇文章着重不在此!

1. 普通饿汉式(一般用 `static final` 修饰)

   > 初始化其外部类时即创建, 优点: 简单, 方便, 缺点: 如果遇到那些初始化比较耗损时空间, 或建立一些连接之类的时成本比较高, 这个时候可以考虑使用饿汉式.

2. 懒汉式(双重锁判断)

   >  即懒加载形式的单例, 即用即加载. 双重锁判断是大多初学者的常用单例模式,

3. 懒汉式(静态内部类)

   > 这个是我之前一直使用的一种方式, 但是每次使用都还是挺麻烦的, 还要建立一个内部类, 不够简单

4. 饿汉式(枚举式)

   > 这个我也经常用, 例如数据字典用这种方式再合适不过.

5. 注册登记式

   > 相当于一个单例模式的大集合, Spring中单例的实现方式, 在不使用Spring的时候我都会单独用一个类来实现注册登记式.

## 我的单例模式历程

初学单例模式的时候, 我了解到的是`普通饿汉式`和`懒汉式(双重锁判断)`, 并常常使用`懒汉式(双重锁判断)`, 毕竟相对于`饿汉式`来说高端大气上档次, 但是写的时候挺麻烦, 一般都会为每个`单例实例`单独新建一个类, 有的时候还忘记加 `volatile` 关键字, 导致线程不安全.

后来我了解到`懒汉式(静态内部类)`, 突然感到这种写法相对于`懒汉式(双重锁判断)`更加简单, 而且很容易可以将多个懒汉式实例写在一个java文件中, 维护和管理起来比较方便, 之后我很长一段事件使用的就是这种模式.

但是顺着经验的增加, 我明白了, 绝大多数单例类实际上都没有必要使用饿汉式, 有的直接使用最简单的饿汉式就可以很好的满足需求, 除了遇到那些初始化比较耗损时空间, 或建立一些连接之类的情况, 其它的情况直接使用`普通的饿汉式`就可以了, 尤其是和一些应届生共同开发的时候, `保持代码的简单更容易降低出错机率`, 至于初始化浪费的那点空间, 根本微不足道.

但是本着强迫症程序员的倔强, 我又不想放弃`懒汉式`, 直到有一天, 我看到一种语言仅仅调用一个类的函数便很好的将一个对象变成了单例懒汉式(那种语言我忘记是什么了, .net, C#还是什么来着, 太久远记不清了), 于是我便想能不能用java实现一个单例懒汉式工具类, 于是便有了下面的类.

## 工具类`LazySingleton.java`

```java
package com.github.cosycode.common.ext.hub;

import java.util.Objects;
import java.util.function.Supplier;

/**
 * <b>Description : </b> 单例懒加载工具类
 *
 * @author CPF
 * @since 1.0
 * @date 2020/6/15
 */
public class LazySingleton<T> {

    /**
     * 单例模式仅仅保证引用可见性即可
     */
    @SuppressWarnings("java:S3077")
    private volatile T t;

    private final Supplier<T> supplier;

    public static <R> LazySingleton<R> of(Supplier<R> supplier) {
        return new LazySingleton<>(supplier);
    }

    private LazySingleton(Supplier<T> supplier) {
        Objects.requireNonNull(supplier, "构造器不能为空");
        this.supplier = supplier;
    }

    /**
     * 双重锁单例
     *
     * @return 值
     */
    public T instance() {
        if (t == null) {
            synchronized (this) {
                if (t == null) {
                    t = supplier.get();
                }
            }
        }
        return t;
    }

    /**
     * 破环当前实例(适用于想要重新生成实例的情况)
     *
     * @return 原来有实例为 true, 没有则返回 false
     */
    public boolean destroy() {
        if (t != null) {
            synchronized (this) {
                t = null;
                return true;
            }
        }
        return false;
    }

}
```

## 使用方式

1. 创建一个 Object 的懒加载, 只有调用 singleton1.instance() 的时候, 才会真正新建 Object 对象

   ```java
   // 创建一个 Object 的懒加载, 只有调用 singleton1.instance() 的时候, 才会真正新建 Object 对象
   LazySingleton<Object> singleton1 = LazySingleton.of(Object::new);
   ```

2. 具体类测试

   ```java
   package cn.cpf.test;

   import com.github.cosycode.common.ext.hub.LazySingleton;
   import lombok.extern.slf4j.Slf4j;

   import java.awt.*;
   import java.util.ArrayList;
   import java.util.HashMap;
   import java.util.List;
   import java.util.Map;
   import java.util.concurrent.ArrayBlockingQueue;
   import java.util.concurrent.BlockingQueue;

   /**
   * <b>Description : </b>
   *
   * @author CPF
   * @date 2020/12/17 16:51
   **/
   @Slf4j
   public class SingleTonTest {

      public static final LazySingleton<Object> singleton1 = LazySingleton.of(Object::new);

      public static final LazySingleton<BlockingQueue<String>> singleton2 = LazySingleton.of(() -> {
         log.info("创建一个ArrayBlockingQueue, 大小为10000");
         return new ArrayBlockingQueue<>(10000);
      });

      public static final LazySingleton<Map<String, Object>> singleton3 = LazySingleton.of(() -> {
         log.info("创建一个ArrayBlockingQueue, 大小为10000");
         return new HashMap<>(100);
      });

      public static final LazySingleton<Robot> robotLazySingleton = LazySingleton.of(() -> {
         log.info("创建一个Robot 实例对象, 大小为10000");
         try {
               return new Robot();
         } catch (AWTException e) {
               log.info("创建一个Robot 实例对象, 创建失败");
               return null;
         }
      });


      public static void main(String[] args) {
        log.debug("singleton1: {}", singleton1.instance());
        log.debug("singleton1: {}", singleton1.instance());
        log.debug("singleton1: {}\n", singleton1.instance());

        log.debug("singleton2: {}", singleton2.instance().hashCode());
        log.debug("singleton2: {}", singleton2.instance().hashCode());
        log.debug("singleton2: {}\n", singleton2.instance().hashCode());

        log.debug("singleton3: {}", singleton3.instance().hashCode());
        log.debug("singleton3: {}", singleton3.instance().hashCode());
        log.debug("singleton3: {}\n", singleton3.instance().hashCode());

        log.debug("robotLazySingleton: {}", robotLazySingleton.instance().hashCode());
        log.debug("robotLazySingleton: {}", robotLazySingleton.instance().hashCode());
        log.debug("robotLazySingleton: {}\n", robotLazySingleton.instance().hashCode());
      }

   }
   ```

控制台输出

   ```plain
   [DEBUG] 18:34:16 (SingleTonTest.java:49) singleton1: java.lang.Object@28c4711c
   [DEBUG] 18:34:16 (SingleTonTest.java:50) singleton1: java.lang.Object@28c4711c
   [DEBUG] 18:34:16 (SingleTonTest.java:51) singleton1: java.lang.Object@28c4711c

   [INFO] 18:34:16 (SingleTonTest.java:28) 创建一个ArrayBlockingQueue, 大小为10000
   [DEBUG] 18:34:16 (SingleTonTest.java:53) singleton2: 1427889191
   [DEBUG] 18:34:16 (SingleTonTest.java:54) singleton2: 1427889191
   [DEBUG] 18:34:16 (SingleTonTest.java:55) singleton2: 1427889191

   [INFO] 18:34:16 (SingleTonTest.java:33) 创建一个ArrayBlockingQueue, 大小为10000
   [DEBUG] 18:34:16 (SingleTonTest.java:57) singleton3: 0
   [DEBUG] 18:34:16 (SingleTonTest.java:58) singleton3: 0
   [DEBUG] 18:34:16 (SingleTonTest.java:59) singleton3: 0

   [INFO] 18:34:16 (SingleTonTest.java:38) 创建一个Robot 实例对象, 大小为10000
   [DEBUG] 18:34:16 (SingleTonTest.java:61) robotLazySingleton: 1381713434
   [DEBUG] 18:34:16 (SingleTonTest.java:62) robotLazySingleton: 1381713434
   [DEBUG] 18:34:16 (SingleTonTest.java:63) robotLazySingleton: 1381713434

   Process finished with exit code 0
   ```

## 后记

上面的`LazySingleton`对象只有在调用`instance()`方法的时候才会初始化其中的单例对象, 而在初始化的时候虽然创建了一个LazySingleton对象本身, 但是这个对象对初始化的影响很小, 占用内存也小, 微不足道, 完全具备 **`使用方便`, `安全`, `方便集中管理`, `集中改造`** 等各个方面优点, 因此完全推荐大家在项目中愉快使用.

若想测试或使用我上面的类, 可直接将上面的`LazySingleton.java`复制到你的工程下即可,

相关源码我已放到了github和gitee上管理, 上面有最新的代码, 以及一些开发中的功能, 欢迎大家查看交流

同时我也将代码打包成jar, 发布到 maven 仓库, 欢迎大家直接使用和交流

### git

github: `https://github.com/cosycode/common-lang`

### repo

Apache Maven

   ```xml
   <dependency>
      <groupId>com.github.cosycode</groupId>
      <artifactId>common-lang</artifactId>
      <version>1.0</version>
   </dependency>
   ```

gradle

   ```yml
   implementation 'com.github.cosycode:common-lang:1.0'
   ```

---

觉得这篇文章好的, 请点个赞, 有兴趣也可以翻翻我其它的文章.

如今网上资源太多, 很多情况下搜遍全网找不到想要的文章, 或者是找不到正确有效的内容, 简直不要太浪费时间, 我深暗其痛苦.

因此一般我个人的笔记, 尤其是那些在网上`容易搜到`的`且有效`的内容, 我是不会再重复发布出来污染网络环境的.

我发出来的一般都是个人比较重要的心得, 原创内容, 或在网上难以找到的内容.

如无必要, 勿增数据. 清洁环境, 宁缺毋滥!
