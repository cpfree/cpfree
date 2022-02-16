---
keys: 
type: blog
url: <>
id: 220216-184819
---

### 双重检验锁：double-checked locking

```java
public class SingleDemo {

    private static volatile SingleDemo singleton;

    private final Object lock = new Object();

    private SingleDemo() {}

    public static SingleDemo getInstance() {
        if (singleton == null) {
            synchronized (lock) {
                if (singleton == null) {
                    singleton = new SingleDemo();
                }
            }
        }
        return singleton;
    }
}
```

为什么双重检查锁要加 volatile 关键字

   `singleton = new SingleDemo();` 这段代码其实是分为三步执行：

   1. 为 singleton 分配内存空间
   2. 初始化 singleton 
   3. 将 singleton 指向分配的内存地址

   但是由于 **JVM 具有指令重排的特性**，执行顺序有可能变成 1>3>2。

   指令重排在单线程环境下不会出现问题，但是在多线程环境下会导致一个线程获得还没有初始化的实例。

   例如，线程 T1 执行了 1 和 3，此时 T2 调用 `getInstance()` 后发现 singleton 不为空，因此返回 singleton ，但此时 singleton 还未被初始化。

   使用 volatile 可以禁止 singleton 在写入之前的指令重排序, 确保在第3步在前两部之后执行.
