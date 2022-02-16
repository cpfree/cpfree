---
keys: 
type: copy,blog,trim
url: <>
id: 200216-185429
---

# clone

clone 函数是java中原型模式的直接实现, 只有调用`Object.clone()`, 才能真正实现基于对象内存的复制.

## 深克隆 & 浅克隆

浅复制的对象中所有值都包含着与原来对象变量相同的值, 换言之, 浅复制仅仅当前复制对象的值, 而不复制它所引用的对象.
深复制: 基本类型保持与原来一至, 引用对象同时进行拷贝. 换言之, 深复制出来的对象的变量与原来对象中的变量无关

### 深复制的几种方式

### 1. 重写 clone 函数

通过 重写对象的 clone函数, 可以自定义拷贝内容, 这样就可以避免`浅拷贝`问题

#### 2. 序列化 和 反序列化

将对象序列化进内存, 之后再反序列化

   ```java
      public Object deepClone() throws IOException, ClassNotFoundException {
         Object object;
         ByteArrayOutputStream bios = new ByteArrayOutputStream();
         try (ObjectOutputStream oos = new ObjectOutputStream(bios)) {
               oos.writeObject(this);
         }
         ByteArrayInputStream bais = new ByteArrayInputStream(bios.toByteArray());
         try (ObjectInputStream bis = new ObjectInputStream(bais)) {
               object = bis.readObject();
         }
         return object;
      }
   ```

> 先将对象转换为json, 再将json转换为对象, 也是一种方式, 不过这种方式就更慢了, 而且还会容易损失数据.

#### 3. 数组深拷贝

java 数组深拷贝代码

   ```java
   package com.github.cosycode.common.util.common;

   /**
   * <b>Description : </b> 数组工具类
   * <p>
   * <b>created in </b> 2020/3/27
   *
   * @author CPF
   * @since 1.0
   */
   public class ArrUtils {
      /**
      * 全层数组深拷贝,
      *
      * @param arr 拷贝后的数组
      * @param <T> 数据模板
      * @return 拷贝后的数组
      */
      @SuppressWarnings("unchecked")
      public static <T> T[] fullClone(final T[] arr) {
         int len = arr.length;
         T[] copy = arr.clone();
         for (int i = 0; i < len; i++) {
               T t = copy[i];
               if (t != null && t.getClass().isArray()) {
                  copy[i] = (T) fullClone((Object[]) t);
               }
         }
         return copy;
      }
   }
   ```

### 4. 基于反射和递归

设计方法 `DeepClone`

1. 先调用对象的`clone()`方法
伪代码

```java
public <T> T deepClone(@T t) {
   非空判断
   if (是数组) {
      1. 调用数组的 clone()
      遍历数组, 对数组的每个对象递归调用 deepClone(), 并将结果反射赋值.
   } else {
      反射调用获取成员变量 {
         1. 跳过 static
         2. 跳过基本变量, String
      }
      对其中的每一个变量递归调用deepClone(), 并将结果反射赋值.
   }
}
```
