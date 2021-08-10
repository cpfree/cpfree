# 控制台乱码问题

[TOC]

## 网上大多编码问题解决方式

1. IDEA 启动参数

   IDEA 是 使用java做的, IDEA 安装路径下 `\ideaIU-2019.3.3.win\bin\idea64.exe.vmoptions`文件最后加一句jvm参数 `-Dfile.encoding=UTF-8`, 大致如下.

   ```properties
   -Xms128m
   -Xmx750m
   -XX:ReservedCodeCacheSize=240m
   -XX:+UseConcMarkSweepGC
   -XX:SoftRefLRUPolicyMSPerMB=50
   -ea
   -XX:CICompilerCount=2
   -Dsun.io.useCanonPrefixCache=false
   -Djava.net.preferIPv4Stack=true
   -Djdk.http.auth.tunneling.disabledSchemes=""
   -XX:+HeapDumpOnOutOfMemoryError
   -XX:-OmitStackTraceInFastThrow
   -Djdk.attach.allowAttachSelf=true
   -Dkotlinx.coroutines.debug=off
   -Djdk.module.illegalAccess.silent=true
   -Dfile.encoding=UTF-8
   ```

   > 实际上造成乱码的一般不是这个地方, 新版IDEA配不配一般无所谓, 是完全可以忽略的.

2. 项目配置

   ![项目配置](https://gitee.com/cpfree/picture-warehouse/raw/master/pic/20210610121039.png)

   这个地方挺重要的, 它控制着你整个项目java 文件编码, 配置文件编码, 新建文件编码.

3. jvm 启动参数配置

   ![jvm 启动参数配置](https://gitee.com/cpfree/picture-warehouse/raw/master/pic/20210610121052.png)

   > 这个地方会影响到控制台log日志, 以及文件日志编码, 但是**未必一定要配置为UTF-8编码**, 具体原因下面会讲

4. tomcat 配置文件

   ```conf
   # 控制台输出log日志
   java.util.logging.ConsoleHandler.level = FINE
   java.util.logging.ConsoleHandler.formatter = org.apache.juli.OneLineFormatter
   java.util.logging.ConsoleHandler.encoding = GBK
   ```

   > 因为一般web项目都是用到了tomcat, 因此tomcat也需要配置, 但实际上这个配置影响的只是tomcat相关的log文件
   > 至于这个地方为什么网上大多都是 GBK? 请往下看, 下面有解释

---

<h1><font color="red">然而即便修改完上述的配置之后, 但是有的发现还是乱码情况(例如控制台乱码), 那就需要往下看乱码原因了.</font></h1>

---

## 乱码原因

首先我们要知道什么是乱码, 简而言之**乱码就是文件打开的编码方式和文件本身编码方式不对**, 注意这个地方有**两个编码**, 一个是**文件本身的编码**, 一个是**用什么编码打开文件**, 两个编码不对应, 就会出现乱码.

例如以下图片(控制台乱码)

![控制台乱码图片](https://gitee.com/cpfree/picture-warehouse/raw/master/pic/20210610121112.png)

> 关于这个 `淇℃伅`, 我可以明确告诉你们这个是UTF-8编码`信息`,, 那为什么会显示成`淇℃伅`呢, 是因为控制台以 GBK的方式显示UTF-8编码.

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
| 开发文件            | UTF-8            | 为了和其它同事共同开发代码, 防止出现编码问题.                                                                                                            |
| 输出的 log 日志文件 | UTF-8            | 为了便于和其它电脑对接, 和其它系统对接, 以及文件传输                                                                                                     |
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
3. **然后因为你的同事, 你的朋友它们电脑上大多都是 GBK 编码格式**, 假如你们使用 git 或 svn 管理文档, 你使用 UTF-8 格式, 你同事大多不修改配置默认使用 GBK, 然后你觉得这样好吗? 哪怕你的编辑器能自动识别编码, 你拉娶个gbk编码文件, 改动保存后, 再以utf-8格式推送出去... 然后一个文档项目就出现了两种编码. 甚至你做个设计流程图, 建个带中文注释的数据表, 同步到你朋友的电脑上, 打开, 卧槽, 乱码了.
4. **最后, GBK 存储汉字占用空间更小**, 非开发工作没有必要使用UTF-8.

## end

那么一个公司全部将电脑编码改成 UTF-8 不行吗?

> 可以啊, 只要你们公司要求这样就可以, 只要电脑是公司统一发放的就可以, 只要你们公司同事都愿意改系统编码就可以, 只要整个电脑全部用来做开发, 不干其它事情就可以.
>
> 至于为了开发让我去更改个人电脑系统编码改成 UTF-8, 那还是算了吧, 我个人的电脑难道仅仅是为了开发吗? 我还要做其它事情呢.
>
> 而且就为了个控制台乱码更改系统编码至于吗? 第二种方式不香吗, GBK不香吗?

当然具体怎么选择, 视个人情况而定
