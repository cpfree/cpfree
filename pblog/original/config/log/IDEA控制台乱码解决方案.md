# IDEA 控制台乱码问题

@[TOC]

> 关于这个乱码问题网上的解决方法大同小异, 但是即便你照着网上配置完之后, 也未必能够解决控制台乱码问题.
>
> 接下来由我从乱码角度来分析乱码问题, 让大家确保能够解决乱码问题.

## 为了节省大家时间, <font color="#ff8c00">直接展示下我的编码配置方案</font>

### <font color="blue">我的编码配置原则</font>

1. 源码文件用于项目组之间进行版本控制, 一般用`UTF-8`
2. 日志文件可能会用于在各个平台上查看, 一般用`UTF-8`
3. 控制台编码对接你的电脑系统编码, 一般电脑默认是`GBK`

   > 因为我的电脑是 Window10 默认编码是 GBK, 所以我控制台配置主打 GBK

### <font color="blue">我的编码配置</font>

1. IDEA 中 idea64.exe.vmoptions 中的 -Dfile.encoding 和 -Dconsole.encoding 的相关配置<font color="red">**全部去除掉**</font>, 使用系统默认 GBK 即可.

   > ![在这里插入图片描述](https://gitee.com/cpfree/picture-warehouse/raw/master/pic/20210610121229.png)
   > 这个使用系统默认即可, 没必要一乱码就改这个, 你的乱码往往不是这个原因.
   > 顺便说一下, 这个不应该是安装目录下的idea64.exe.vmoptions文件, 新版本IDEA应该是你的用户目录下(windows一般是`‪C:\Users\CPF\.IntelliJIdea2019.3\config\idea64.exe.vmoptions`)
   > ![图 2](https://gitee.com/cpfree/picture-warehouse/raw/master/pic/20210610121238.png)

2. `Run/Debug Configurations` 中的 -Dfile.encoding <font color="red">**全部去除掉**</font>, 使用系统默认 GBK 即可.

   > 这个地方和上面 idea64.exe.vmoptions 配置的都是 VM 这个参数, 这个比上面那个优先级更高,和上面的原因一样, JDK 默认的已经很好了, 不需要配置这个 ![在这里插入图片描述](https://gitee.com/cpfree/picture-warehouse/raw/master/pic/20210610121250.png)
   > 这个地方会影响到控制台 log 日志, 以及文件日志编码, 但是**未必一定要配置为 UTF-8 编码, 使用默认即可**, 具体原因下面会讲
   > 上面两步确保你的JVM参数`file.encoding`的值是你的默认系统编码GBK
   > 你可以在启动位置输出 `System.out.println(System.getProperty("file.encoding"))`, 看下输出的字符是否是系统默认编码GBK

3. tomcat 路径下, `\conf\logging.properties`配置, 注意和控制台有关的`Handler`:`java.util.logging.ConsoleHandler.encoding` 改为<font color="red">**默认的 GBK**</font>即可, 其它和文件有关的`Handler`全部`UTF-8`

   > ![图 1](https://gitee.com/cpfree/picture-warehouse/raw/master/pic/20210610121257.png)
   > 因为一般 web 项目都是用到了 tomcat, 因此 tomcat 也需要配置, 但实际上这个配置影响的只是 tomcat 相关的 log 文件
   > 至于这个地方为什么网上大多都是 GBK? 请往下看, 下面有解释

4. 正确配置 log 配置文件编码(重要)

   - <font color="red">终于到了我们最重要的环节, 我想说的是 99%的乱码问题都是我们 log 配置文件没有配置好导致的, 结果大家不去改 log 配置文件, 偏偏盯上 VM 配置, 和 tomcat 配置.</font>
   - <font color="green">我想告诉大家的是, 人家 IDEA, tomcat, JDK 的默认配置明明已经很好了, 我们应该去适应人家, 而不是修改人家的默认配置来适应我们**五花八门**的 log 配置文件, </font>

     > 例如:
     > A 的 log 配置的有问题, 导致 IDEA 控制台乱码了, 他修改了 IDEA, tomcat, JDK 配置, 成功强迫 IDEA, tomcat, JDK 配置适应它的他配置, 最终成功正确输出日志,
     > 之后 B 的 log 配置的也有问题, 日志也乱码了, 然后他参照 A 的配置配置之后, 发现乱码问题依然没有解决,

   - 要知道这个项目一个 log 配置, 那个项目一个 log 配置, 还有的 log 框架都不一样, 就算要强迫 IDEA, tomcat, JDK 适应我们的 log 配置文件, 由于我们的 log 配置文件不一样, 对应的被强迫的 IDEA, tomcat, JDK 配置也是不一样的

   - 因此为了统一配置方式, IDEA, tomcat, JDK 配置使用默认即可, 由我们的 log 配置来适应它们.

   下面是我的 log4j2.xml 部分示例配置, 如果你用的是 log4j 或 logback 或其它, 就参照相对的 log 框架的 Appenders 配置方法

   **这里我为每个`Appender` 配置一下输出编码, 和控制台有关的:`Console`:`charset` 改为 GBK, 其它和文件有关的`RollingFile`全部设置为`UTF-8`**

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <Configuration status="DEBUG">
       <Appenders>
           <!--这个输出控制台的配置，这里输出除了warn和error级别的信息到System.out -->
           <Console name="Console" target="SYSTEM_OUT" follow="true">
               <ThresholdFilter level="INFO" onMatch="ACCEPT" onMismatch="DENY" />
               <!-- 输出日志的格式 -->
               <PatternLayout charset="GBK" pattern="%m%n" />
           </Console>
   
           <!-- 同一来源的Appender可以定义多个RollingFile，定义按天存储日志 -->
           <RollingFile name="rolling_file" fileName="${logDir}/dust-server.log" filePattern="${logDir}/dust-server_%d{yyyy-MM-dd}.log">
               <ThresholdFilter level="INFO" onMatch="ACCEPT" onMismatch="DENY" />
               <!-- 输出日志的格式 -->
               <PatternLayout charset="UTF-8" pattern="%m%n" />
           </RollingFile>
       </Appenders>
   
       <Loggers>
           <Root level="all">
               <AppenderRef ref="Console"/>
               <AppenderRef ref="rolling_file"/>
           </Root>
       </Loggers>
   </Configuration>
   ```

## 另外说一下几个重要但是和乱码无关的配置

1. 项目配置
   > 这个地方挺重要的, 它控制着你整个项目 java 文件编码, 配置文件编码, 新建文件编码.
   > <font color="blue">**但是它和你的控制台乱码是毫无关系的, 就算你将这里的编码配置改成 UTF-3.1415926, 它也管不到你的日志乱码** </font>![在这里插入图片描述](https://gitee.com/cpfree/picture-warehouse/raw/master/pic/20210610121309.png)

---

## <h4><font color="red">可能有很多人对上面的配置不理解 请继续往下看.</font></h4>

## 乱码原因

首先我们要知道什么是乱码, 简而言之**乱码就是文件打开的编码方式和文件本身编码方式不对**, 注意这个地方有**两个编码**, 一个是**文件本身的编码**, 一个是**用什么编码打开文件**, 两个编码不对应, 就会出现乱码.

例如以下图片(控制台乱码)

![在这里插入图片描述](https://gitee.com/cpfree/picture-warehouse/raw/master/pic/20210610121315.png)

> 关于这个 `淇℃伅`, 我可以明确告诉你们这个是 UTF-8 编码`信息`,, 那为什么会显示成`淇℃伅`呢, 是因为控制台以 GBK 的方式显示 UTF-8 编码.

图片中的**控制台乱码中的日志一般有两种, 一个是 tomcat 输出日志到控制台, 另一个是 jvm 输出日志到控制台.**, 网上关于解决控制台乱码的方法大都是 _修改 jvm 输出日志编码_ 和 _tomcat 输出日志编码_, 但是却忽视了一个重要的编码, 那就是 **控制台是以什么编码方式显示信息的呢?**.

关于这点我可以告诉你们, **一般来说, 中国电脑系统默认编码是 GBK, IDEA 控制台显示的编码也是 GBK**.

现在是不是已经明白了, 也就是说控制台以 GBK 的方式打开了 tomcat 和 JVM 输出的 UTF-8 编码, 那不乱码才怪.

## 解决方式

既然如此, 那么解决方案就很明确了, 无非两种

1. (不推荐)修改 IDEA 控制台显示编码为 UTF-8, 以及 tomcat, jvm 输出的日志编码也修改为 UTF-8;

   - toncat 安装路径下的 `conf/logging.properties` 配置文件中的 `java.util.logging.ConsoleHandler.encoding` 改成 `UTF-8`;
   - jvm 启动参数 `VM options` 加个配置 `-Dfile.encoding=UTF-8`

2. (推荐)直接使用 IDEA 控制台显示的 GBK 编码, 把 tomcat, jvm 输出的日志编码也全部改为 GBK;

   - toncat 安装路径下的 `conf/logging.properties` 配置文件中的 `java.util.logging.ConsoleHandler.encoding` 改成 `GBK`;
   - jvm 启动参数 `VM options` 加个配置 `-Dfile.encoding=GBK`.

     > 如果你没有加乱七八糟的配置的话, 这个 jvm -Dfile.encoding 启动参数直接置空, 就会自动使用系统默认编码 GBK

## 我为什么推荐控制台使用 GBK

上面解决方式中, 第二种反而是我比较推荐的一种方式, 那有人就会问了, 全部改成 UTF-8 编码不好吗?

首先看下面的我的编码对接思想.

### 我的编码设置思想

| 输出位置            | 编码方式         | 原因                                                                                                                                                     |
| ------------------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 源码文件            | UTF-8            | 为了和其它同事共同开发代码, 防止出现编码问题.                                                                                                            |
| 日志文件             | UTF-8            | 为了便于和其它电脑对接, 和其它系统对接, 以及文件传输                                                                                                     |
| 控制台              | 系统默认编码 GBK | 仅仅在自己电脑控制台显示, 说白了, 对接本地电脑, 而且本地的 JVM 使用的实际上也是你系统的默认编码, 你电脑是 GBK, 你就将输出到控制台的编码改成 JDK, 就行了. |

第二种方法只要明白原理后, 实际上配置起来非常简单, 只要注意下控制台的编码是你电脑的默认编码即可.

### 第一种解决方案的弊端

**第一种解决方案有什么弊端呢?**

首先即便你更改了 IDEA 的控制台编码, tomcat 什么的也全部改成 UTF-8, 那么当你单独运行 tomcat 的时候, tomcat 会使用系统控制台打印日志, 那么系统控制台使用的编码是什么呢, 如果你用的是中国的 window, 那么编码格式 9 成 9 是 GBK, 因为这是你的系统默认编码, 无论是 tomcat, jvm, IDEA, 或者是其它开发软件或者是非开发软件, 编码对标的首先是你的电脑系统编码格式.

**那么干脆点, 把整台电脑的编码全部改成 `UTF-8` 编码怎么样呢?**

这绝对是个大工程量, 这不是随随便便就改的完的, 其次这会遇到很多问题, 听我一步步分析.

假如你在中国, 使用的是 window, 系统默认编码是 GBK.

1. **首先你过去的文件, 软件使用的是 GBK 编码**. 你之前写的文档, 写的笔记, 以及使用其它软件保存的文件大多都是 GBK, 改起来很麻烦.
2. **其次网上的资源大多是 GBK**, 或是一本小说, 一首歌的歌词, 或是游戏中文翻译包, 或者是视频字幕大多也都是 GBK, 这时候你碰到一个垃圾阅读器, 音乐视频播放器, 游戏软体, 它们不去识别文件 GBK 编码, 直接通过系统默认编码 UTF-8 打开, 然后就会出现乱码情况.
3. **然后因为你的同事, 你的朋友它们电脑上大多都是 GBK 编码格式**, 假如你们使用 git 或 svn 管理文档, 你使用 UTF-8 格式, 你同事大多不修改配置默认使用 GBK, 然后你觉得这样好吗? 哪怕你的编辑器能自动识别编码, 你拉娶个 gbk 编码文件, 改动保存后, 再以 utf-8 格式推送出去... 然后一个文档项目就出现了两种编码. 甚至你做个设计流程图, 建个带中文注释的数据表, 同步到你朋友的电脑上, 打开, 卧槽, 乱码了.
4. **最后, GBK 存储汉字占用空间更小**, 非开发工作没有必要使用 UTF-8.

### end

那么一个公司全部将电脑编码改成 UTF-8 不行吗?

> 可以啊, 只要你们公司要求这样就可以, 只要电脑是公司统一发放的就可以, 只要你们公司同事都愿意改系统编码就可以, 只要整个电脑全部用来做开发, 不干其它事情就可以.
>
> 至于为了开发让我去更改个人电脑系统编码改成 UTF-8, 那还是算了吧, 我个人的电脑难道仅仅是为了开发吗? 我还要做其它事情呢.
>
> 而且就为了个控制台乱码更改系统编码至于吗? 第二种方式不香吗, GBK 不香吗?

当然具体怎么选择, 视个人情况而定

---

## 附加技巧

### 如何找出具体乱码原因

想要知道你的乱码为什么乱码成那样, 请先在你的程序里面打印输出 `0信1息2信息3`,之后看下乱码情况是以下解码后显示的哪一种乱码, 应该就能找到你的乱码是如何乱码成你看到的样子的.

> 如下第 6 行, 原信息是`0信1息2信息3`, 编码格式是 UTF-8 编码, 但是以 GBK 的方式对其进行解码后就变成了`0淇�1鎭�2淇℃伅3`.

| 原信息             | 原信息编码格式                | 解码方式           | 解码后显示              |
| ------------------ | ----------------------------- | ------------------ | ----------------------- |
| 0 信 1 息 2 信息 3 | _ASCII,**UTF_8,**UTF_16, GBK_ | 同编码方式一样     | 0 信 1 息 2 信息 3      |
| 0 信 1 息 2 信息 3 | US-ASCII                      | US-ASCII,UTF-8,GBK | 0?1?2??3                |
| 0 信 1 息 2 信息 3 | US-ASCII                      | UTF-16             | 〿ㄿ㈿㼳                 |
| 0 信 1 息 2 信息 3 | UTF-8                         | US-ASCII           | 0���1���2������3        |
| 0 信 1 息 2 信息 3 | UTF-8                         | UTF-16             | ヤ뾡㇦ 膯㋤뾡꼳        |
| 0 信 1 息 2 信息 3 | UTF-8                         | GBK                | 0 淇 �1 鎭 �2 淇 ℃ 伅 3 |
| 0 信 1 息 2 信息 3 | UTF-16                        | US-ASCII,UTF-8     | �� 0O� 1`o 2O�`o 3      |
| 0 信 1 息 2 信息 3 | UTF-16                        | GBK                | � 0O� 1`o 2O 醏 o 3     |
| 0 信 1 息 2 信息 3 | GBK                           | US-ASCII           | 0��1��2����3            |
| 0 信 1 息 2 信息 3 | GBK                           | UTF-8              | 0��1Ϣ2��Ϣ3              |
| 0 信 1 息 2 信息 3 | GBK                           | UTF-16             | バ씱쾢㋐엏ꈳ            |

> 上面的表格只是列举了我们绝大多数情况下涉及到的编码 US-ASCII,UTF-8,GBK,UTF-16, 可能你用了之外的其它编码,
> 另外上面也仅仅是展示了一层转换而已, 可能有以错误编码解码后再次被引用之后再次解码的多次错误转换的情况, 例如 UTF 编码的信息 f 以 GBK 的方式解码后变成了淇 ℃ 伅之后再以 UTF-8 的形式存储后, 再以 GBK 方式打开, 就变成了娣団剝浼 �😀.

---

<h4><font color="green">如果上面的改完之后还乱码的话, 可以在下面回复我, 或私信@我.<font></h4>
<h4><font color="blue">如果想要深入了解乱码原因的话, 就请看下我另一篇文章.<font></h4>
> [IDEA控制台乱码原理性深入研究分析与解决方案](https://blog.csdn.net/u011511756/article/details/110942841)
