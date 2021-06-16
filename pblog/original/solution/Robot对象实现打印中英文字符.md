# Java: 利用Robot模拟键盘输出汉字

## 字符存储

## Alt码（Alt code）

![图 2](https://gitee.com/cpfree/picture-warehouse/raw/master/images/common/324ab372cc0420979ecdf29602743aa83184bbd8643ff3457ccb3a44b53e56d4.gif)

### 尝试 `Alt + 数字` 输出汉字

> Alt码（Alt code）即在IBM兼容个人电脑上，许多字符没有直接对应的按键，此时就可通过`Alt-数字键盘输入法`（Alt码）输入，方法是按住Alt键再通过数字键区输入字符代码。DOS、Microsoft Windows等许多操作系统也有类似或增强的功能。

启动你的 `windows`, 打开 `记事本`, 之后按住 `Alt` 不放, 同时依次点击 `数字键盘` 中的 `1、2、3、4、5、6`, 再松开 `Alt`, 看下能不能打印出汉字 `釦` 来.

> 注意事项:
>
> - `Alt + 数字` 是 `windows` 中的方法, 不知道其它系统支不支持, 有兴趣的话可以试一下.
> - 最好是`记事本`, 当然也可以是其它`简单的编辑器`, 甚至任何能够输出字符的`文本框`, 但是不能是`vscode`等集成编译器, 因为这些编译器, 会将 `Alt + 数字` 映射成其它功能, 例如在`vscode`中, `alt + ?` 是光标移至尾行, `alt + 4` 是切换到左边的标签页.
> - 一定要是 `数字键盘` 上面的 `数字按键`, 别搞错了.

如果记事本上成功输出了 `釦` 说明你的电脑是支持 `Alt + 数字` 形式的输入方法的.

### Alt 后面数字代表的意思

> 首先先说明我们中国大多数电脑默认编码都是GBK, 底层区位码使用的大多都是《国家标准信息交换用的字符编码GB2312-80》（以下简称**国标区位码**）.
>
> 注意: 网上很多文章说 ~~Alt+【Unicode编码】对应的十进制数字即可打出该【Unicode编码】对应的字符~~, 事实上这个是机内码, 不是 Unicode编码

1. Alt 后面的数字如果在(0-255), 则输出的是数字对应的 ASCII 代码表中对应的字符.
2. Alt 后面的数字如果大于(255), 则查询的是**国标区位码**里的字符了，包括我们常用的个汉字也在里面.
3. 如果 Alt 后面的数字 >= 65536, 则会先将数字除以65536, 得到余数, 打印出余数数字对应的**国标区位码**中的字符.

> `Alt + 123456` 输出汉字 `釦` 的执行过程:
> 将 `123456` 转为16进制 `1E240`, 取后四位`E240`到国标区位码中查到汉字 `釦`输出.
> 用人话来说就是, 首先因为 `123456 >= 65536`, 那么对 `123456➗65536=1……57920`, 取得 `57920` 后到国标区位码中查到汉字 `釦`输出.
>
> alt + 188992(2E240H), alt + 57920(E240H), 同样能输出汉字`釦`

### 使用java获取一个符号的区位码

1. java 中的字符默认是Unicode标准中utf-16编码, 标准的utf-16占用二或四个字节, java中的一个char占2个字节, 因此java中一个utf-16字占1或2个char, (例如大多数汉字, 字符都是一个char, 像😀等utf-16中排序较后的占两个char)

2. 想要获取符号的国标区位码, 首先这个符号得先有国标区位码才行, 类似于`😀🆒`等符号使用两个char表示的符号, 就别想有国标区位码了.

   例如一个😀, 在java中就是用两个char表示的, 这两个char单独一个无法表示一个字符, 它们是Unicode中的补充字符单元, java 中判断一个符号是否是补充字符单元的方法是

   ```java
   public final class Character implements java.io.Serializable, Comparable<Character> {
      public static boolean isSurrogate(char ch) {
         return ch >= MIN_SURROGATE && ch < (MAX_SURROGATE + 1);
      }
   }
   ```

3. 假如一个符号有国标区位码, 那么在java里你需要先把编码由 `utf-16` 转换成 `GB2312-80` 才行.

   我们直接转换成GBK就行了, 直接使用 `String.getByte(string str, "GBK")`

4. 转换之后的两个byte就是符号的国标区位码了, 但要想转成10进制, 还需要小小的转换.

   ```java
   Byte.toUnsignedInt(array[0]) << 8 | Byte.toUnsignedInt(array[1])
   ```

### 使用java Robot利用键盘输出String的完整代码如下

   ```java
   public class MainTest {

      /**
      * 使用 Robot 利用键盘 alt 码输出字符
      * @param r      Robot 对象
      * @param gbkCode 待打印的字符的国标区位码
      * @param time   每个字符等待的时间
      */
      public static void keyPressWithAltCode(Robot r, int gbkCode, int time){
         r.keyPress(KeyEvent.VK_ALT);
         String s = Integer.toString(gbkCode);
         for (char c : s.toCharArray()) {
               // 由 ASCII 码 0(48) 转为  VK_NUMPAD0(0x60)
               int k = c + 48;
               r.keyPress(k);
               r.keyRelease(k);
         }
         r.keyRelease(KeyEvent.VK_ALT);
         if (time > 0) {
               r.delay(time);
         }
      }

      /**
      * 使用 Robot 利用键盘 alt 码输出字符
      * @param r      Robot 对象
      * @param string 待打印的字符
      * @param time   每个字符等待的时间
      */
      public static void keyPressWithAltCode(Robot r, String string, int time) throws CharacterCodingException {
         CharsetEncoder ce = Charset.forName("GBK").newEncoder();
         for (char c : string.toCharArray()) {
               if (Character.isSurrogate(c)) {
                  // 跳过补充字符
                  continue;
               }
               if (c >>> 8 == 0) {
                  keyPressWithAltCode(r, c, time);
                  continue;
               }
               CharBuffer cb = CharBuffer.wrap(new char[]{c});
               final byte[] array = ce.encode(cb).array();
               assert array.length == 2;
               int code = Byte.toUnsignedInt(array[0]) << 8 | Byte.toUnsignedInt(array[1]);
               keyPressWithAltCode(r, code, time);
         }
      }


      public static void main(String[] args) throws AWTException, CharacterCodingException {
         // 每隔5毫秒输出一个字符
         keyPressWithAltCode(new Robot(), "1a键舣ß→_😀🆒", 5);
      }
   }
   ```

运行上面的代码就能利用键盘输出 `1a键舣ß→_`.

## 附

### Unicode标准

Unicode（统一码、万国码、单一码）是一种在计算机上使用的字符编码。它为每种语言中的每个字符设定了统一并且唯一的二进制编码，以满足跨语言、跨平台进行文本转换、处理的要求。

Unicode 的实现方式不同于编码方式。一个字符的 Unicode 编码是确定的。但是在实际传输过程中，由于不同系统平台的设计不一定一致，以及出于节省空间的目的，对 Unicode 编码的实现方式有所不同。

Unicode 的实现方式称为Unicode转换格式（Unicode Translation Format，简称为 UTF）。

现阶段 Unicode 编码共有三种具体实现，分别为utf-8,utf-16,utf-32，其中utf-8占用一到四个字节，utf-16占用二或四个字节，utf-32占用四个字节。

Unicode标准12.0版发布，字符总数达137929个

### 国标码，区位码和机内码

计算机内常用的编码有国标码，区位码和机内码。

   > - 国标码是一个四位十六进制数，它将一个汉字用两个字节表示，每个字节只有7位，与ASCII码相似。
   > - 区位码一个四位的十进制数，它将GB 2312—80的全部字符集组成一个94×94的方阵，每一行称为一个“区”，编号为01～94；每一列称为一个“位”，编号为01～94，这样得到GB 2312—80的区位图，用区位图的位置来表示的汉字编码，称为区位码。
   > - 机内码：为了避免ASCII码和国标码同时使用时产生二义性问题，大部分汉字系统都采用将国标码每个字节高位置1作为汉字机内码。这样既解决了汉字机内码与西文机内码之间的二义性，又使汉字机内码与国标码具有极简单的对应关系。

汉字机内码、国标码和区位码三者之间的关系为：区位码（十进制）的两个字节分别转换为十六进制后加20H得到对应的国标码；机内码是汉字交换码（国标码）两个字节的最高位分别加1，即汉字交换码（国标码）的两个字节分别加80H得到对应的机内码；区位码（十进制）的两个字节分别转换为十六进制后加A0H得到对应的机内码。

再回到用Alt键输入的问题。实际上，按住Alt键，然后用小键盘敲入一串数字，就是输入了某个字的“机内码”。比如，“喆”这个字的机内码为86B4（16进制），转换为10进制就是34484，因此大家按住Alt键，然后用小键盘输入34484，就可以出来“喆”字了。

最后，由于汉字和机内码是一一对应的，所以只要知道了机内码，任意一个汉字都可以用这种方式输入的。除此之外，还有大量的符号，比如论坛里已经发了N次的心形符号
