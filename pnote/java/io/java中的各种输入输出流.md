---
keys: 
type: blog
url: <>
id: 220216-184850
---

# 输入输出流

1. 文件流

2. 字符流和字节流

   字符流以char为输入，java中String正确的字符编码为UTF-16，有些汉字和符号可以使用一个char来表示，但是一些汉字和符号需要使用两个char。

   字节流也就是 byte[], 

## 读取不知道大小的文件, 应该使用 ByteArrayOutputStream

是的, 没错, 读取使用 `OutputStream`, 简单来说就是, 从输入流里面读取数据到 `ByteArrayOutputStream` 内部的动态数组, 再通过 `ByteArrayOutputStream.toByteArray()` 转换为 `byte[]`.

> 一般来说, 输入流是将数据输入到流里面, 流是个抽象的感念, 一般这个流是在内存中运行的, 因此大多数输入流就是将数据转到内存里面, 输出流就是从内存往外传.
> 
> 如文件输入流是将文件转到内存里面, 文件输出流是将内存的数据转移到文件里面.
> 
> 但是对于 byteArray来说, 字节数组, 一般也是放在内存里面, 因此 ByteArrayInputStream 是读取 `byte[]` 里面的数据到流里面, 也就是从外部的 `byte[]` 到输入流对象内部的 `byte[]`,

1. ByteArrayInputStream & ByteArrayOutputStream

   ```java
   public static void byteArrayInputStreamExam(byte[] buf) {
      //  输入流, 建立一个从外部数组的 buf 里面去读取字节数据的输入流.
      ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(buf);
      ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
      byte[] getbuf = new byte[128];
      int len = 0;
      try {
         while ((len = byteArrayInputStream.read(getbuf)) != -1) {
               byteArrayOutputStream.write(getbuf, 0, len);
         }
         byte[] result = byteArrayOutputStream.toByteArray();
         //将得到的字节转换为unicode编码的字符串
         String s = new String(result, "unicode");
         System.out.println(s);
      } catch (IOException e) {
         e.printStackTrace();
      }
   }
   ```

   - `new ByteArrayInputStream(buf)`: 建立一个从 buf 里面去读取字节数据的输入流.
   - `byteArrayInputStream.read(getbuf)`, 从 buf 里面读取数据到 `getbuf` 里面
   - `byteArrayOutputStream.write(getbuf, 0, len);`: 这个方法是将 `getbuf`这个数组中的字节写入到 byteArrayOutputStream 里面的动态字节数组里面
   - `byteArrayOutputStream.toByteArray()`: 获取byteArrayOutputStream中的数组.

   > ByteArrayOutputStream 里面维护了一个`动态字节数组`, 实际上就是存储的数组动态扩容而已, 这样的话就非常适合读取不确定大小的文件或输入流.

2. ByteArrayOutputStream 用作从输入流中读取数据.

   ```java
   /**
   * 从输入流里读取 动态字节流 文件(适用于无法获取文件大小)
   *
   * @param inputStream 输入流
   * @throws IOException 文件写入异常
   * @return 字节流文件的字节数组
   */
   public static byte[] readByteArrayFromResource(@NonNull InputStream inputStream) throws IOException {
      byte[] buf = new byte[8 * 1024];
      // 动态字节流
      ByteArrayOutputStream arrayOutputStream = new ByteArrayOutputStream();
      int len;
      while ((len = inputStream.read(buf)) != -1) {
         arrayOutputStream.write(buf, 0, len);
      }
      return arrayOutputStream.toByteArray();
   }
   ```
