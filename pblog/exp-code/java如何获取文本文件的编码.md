---
keys: 
type: copy,blog,trim
url: <https://stackoverflow.com/questions/499010/java-how-to-determine-the-correct-charset-encoding-of-a-stream>
---

# java-获取文本的编码

您无法确定任意字节流的编码。这就是编码的本质。编码是指字节值与其表示之间的映射。因此，每个编码"可能"都是正确的。‎

`getEncode()`方法将返回为流设置的编码（读‎‎取 JavaDoc）。‎‎它不会猜到你的编码。‎
‎某些流会告诉您用于创建它们的编码：XML、HTML。但不是任意的分节流。‎

‎无论如何，你可以尝试猜测自己编码，如果你必须。每种语言都有每个字符的常见频率。在英语中，字符 e 经常出现，但很少出现。在ISO-8859-1流中，通常没有0x00字符。但 Utf - 16 流有很多。‎

‎或者：您可以询问用户。我已经看到以不同的编码向您呈现文件片段的应用程序，并要求您选择"正确"的应用程序。‎

1. juniversalchardet

   > github: <https://github.com/albfernandez/juniversalchardet>

   ```xml
   <dependency>
      <groupId>com.github.albfernandez</groupId>
      <artifactId>juniversalchardet</artifactId>
      <version>2.4.0</version>
   </dependency>
   ```

   Detecting encoding of a File (simple way)

   ```java
   import org.mozilla.universalchardet.UniversalDetector;

   public class TestDetectorFile {

      public static void main (String[] args) throws java.io.IOException {
         if (args.length != 1) {
            System.err.println("Usage: java TestDetectorFile FILENAME");
            System.exit(1);
         }
         java.io.File file = new java.io.File(args[0]);
         String encoding = UniversalDetector.detectCharset(file);
         if (encoding != null) {
            System.out.println("Detected encoding = " + encoding);
         } else {
            System.out.println("No encoding detected.");
         }
      }
   }
   ```

   Creating a reader with correct encoding

   ```java
   import org.mozilla.universalchardet.ReaderFactory;

   public class TestCreateReaderFromFile {
      
      public static void main (String[] args) throws java.io.IOException {
         if (args.length != 1) {
            System.err.println("Usage: java TestCreateReaderFromFile FILENAME");
            System.exit(1);
         }
      
         java.io.Reader reader = null;
         try {
            java.io.File file = new java.io.File(args[0]);
            reader = ReaderFactory.createBufferedReader(file);
            
            // Do whatever you want with the reader
         }
         finally {
            if (reader != null) {
               reader.close();
            }
         }
      }
   }
   ```


2. icu4j

   > 功能相当强大, 识别编码最多, 更新快, 维护多, IDEA, apache识别编码都是使用的这个
   > 缺点是大, 最新的 69.1 版本的jar包, 13.044M, 
   > ![](https://gitee.com/cpfree/picture-warehouse/raw/master/pic/20210811183100.png)

   ```xml
   <!-- https://mvnrepository.com/artifact/com.ibm.icu/icu4j -->
   <dependency>
      <groupId>com.ibm.icu</groupId>
      <artifactId>icu4j</artifactId>
      <version>69.1</version>
   </dependency>
   ```

   Sample

   ```java
   public static void test() {
      BufferedInputStream bis = new BufferedInputStream(new FileInputStream(file));
      CharsetDetector cd = new CharsetDetector();
      cd.setText(bis);
      CharsetMatch cm = cd.detect();
      if (cm == null) {
         throw new UnsupportedCharsetException();
      }
      Reader reader = cm.getReader();
      // 编码
      String charset = cm.getName();
      // 内容
      String text = cm.getString();
   }
   ```

3. apache.any23

   apache.any23 基于 ICU4J 搭建

   > apache.any23 引得包特别特别多, 大到难以想象, 不建议使用

   ```xml
   <dependency>
      <groupId>org.apache.any23</groupId>
      <artifactId>apache-any23-encoding</artifactId>
      <version>2.4</version>
   </dependency>
   ```

   Sample:

   ```java
   public static Charset guessCharset(InputStream is) throws IOException {
      return Charset.forName(new TikaEncodingDetector().guessEncoding(is));    
   }
   ```

