
### 顺便说下, `System.out.println()`实际上是很难输出乱码的

`System.out.println()`和 jdk 的适配很好, 而且无需考虑文件问题, 一般情况下你很难看到`System.out.println()`输出乱码
下面是一些测试, 测试下 `file.encoding` 对 System.out.println()的影响
java 代码

```java
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;

/**
 * <b>Description : </b>
 *
 * @author CPF
 * @date 2020/12/3 10:59
 **/
public class cn.cpf.se.thread.LogPrintTest {

    public static void main(String[] args) {
        System.out.println("args" + Arrays.toString(args));
        System.out.println("console: " + System.getProperty("console"));
        System.out.println();

        final String s = "信息";
        final byte[] bytes = s.getBytes();
        System.out.println("信息 : " + s);
        System.out.println("信息.toCharArray(): " + Arrays.toString(s.toCharArray()));
        System.out.println("信息.getBytes(): " + Arrays.toString(s.getBytes()));
        System.out.println();

        System.out.println("new String(信息.getBytes()) ==> " + new String(bytes));
        System.out.println("new String(信息.getBytes(), GBK) ==> " + new String(bytes, Charset.forName("GBK")));
        System.out.println("new String(信息.getBytes(), UTF_8) ==> " + new String(bytes, StandardCharsets.UTF_8));
    }

}

```

#### file.encoding:GBK | console 编码:GBK

```dos
args[0信息1信2息3]
Charset.defaultCharset().name()  GBK

信息 : 信息
信息.toCharArray(): [信, 息]
信息.getBytes(): [-48, -59, -49, -94]

new String(信息.getBytes()) ==> 信息
new String(信息.getBytes(), GBK) ==> 信息
new String(信息.getBytes(), UTF_8) ==> ???
```

#### file.encoding:GBK | console 编码:UTF-8

```dos
P:\git\java-exercise\exercise-se\src\main\java>java  cn.cpf.se.thread.LogPrintTest 0信息1信2息3
args[0Ϣ12Ϣ3]
Charset.defaultCharset().name()  GBK

Ϣ : Ϣ
Ϣ.toCharArray(): [, Ϣ]
Ϣ.getBytes(): [-48, -59, -49, -94]

new String(Ϣ.getBytes()) ==> Ϣ
new String(Ϣ.getBytes(), GBK) ==> Ϣ
new String(Ϣ.getBytes(), UTF_8) ==> ???
```

#### file.encoding:UTF-8 | console 编码:GBK

```dos
>java -Dfile.encoding=UTF-8 cn.cpf.se.thread.LogPrintTest 0信息1信2息3
args[0信息1信2息3]
Charset.defaultCharset().name()  UTF-8

信息 : 信息
信息.toCharArray(): [信, 息]
信息.getBytes(): [-28, -65, -95, -26, -127, -81]

new String(信息.getBytes()) ==> 信息
new String(信息.getBytes(), GBK) ==> 淇℃伅
new String(信息.getBytes(), UTF_8) ==> 信息
```

#### file.encoding:UTF-8 | console 编码:UTF-8

```dos
P:\git\java-exercise\exercise-se\src\main\java>java -Dfile.encoding=UTF-8 cn.cpf.se.thread.LogPrintTest 0信息1信2息3
args[0信息1信2息3]
Charset.defaultCharset().name()  UTF-8

信息 : 信息
信息.toCharArray(): [信, 息]
信息.getBytes(): [-28, -65, -95, -26, -127, -81]

new String(信息.getBytes()) ==> 信息
new String(信息.getBytes(), GBK) ==> 淇℃伅
new String(信息.getBytes(), UTF_8) ==> 信息
```

> 这里面的逻辑还是远比上面的测试复杂的, 可能大家听不懂, 但真要解释起来估计又是一篇长文章, 所以这里我长话短说

经过上面的测试, 控制台还是最好选用你的系统编码默认格式 GBK 输出,

> 上面的测试测试的是`System.out.print()`, 如果你想测试 log 的话, 可以将上面的`System.out.print()`换成`log.info()`,
> 然后你就会立刻感受到 System.out.print()和 log 框架的差距, 你将会看到各种面目全非的日志.
> 不过这也难怪, 毕竟 System.out.print()主打的是控制台输出, log 日志主打的是文件输出.
