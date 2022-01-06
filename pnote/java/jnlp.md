# jnlp 项目示例

[TOC]

## 简介

JNLP(Java Network Launch Protocol)是一种用来在网络中部署应用程序的一种协议;

在客户端只需要安装 `java web start` 就可以使用服务器端的软件，它具有自动更新应用程序版本的功能;

通过 `java web start` 加载`.jnlp`文件, 从中获取可执行jar包的下载地址，执行方法，以及参数等信息, 然后去下载jar包后执行应用程序.

优点: 如果你的java应用程序以jnlp 的方式发布，如果版本升级后，不需要再向所有用户发布版本，只需要更新服务器的版本，这就相当于让java应用程序有了web应用的优了
   Jnlp还是一种基于xml的启动java程序的技术。在100town.com您可以将生成的代码存成一个后缀为**.jnlp的文件,将这个文件发布在自己的网站上,当用户访问这个网站时,就可以启动java程序。

## jnlp项目示例

### 1. 创建一个可执行jar

管你怎么的, 创建一个jar就行了, 为了演示完整点, 先随便来个`frame demo` 吧

   ```java
   package cn.cpf;

   import javax.swing.*;
   import java.awt.*;

   /**
   * @author by CPF
   */
   public class MainFrame extends JFrame {
      private static final long serialVersionUID = -4791222140191948495L;

      /**
      * Launch the application.
      */
      public static void main(String[] args) {
         EventQueue.invokeLater(new Runnable() {
            public void run() {
               try {
                  MainFrame frame = new MainFrame();
                  frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
                  frame.setVisible(true);
               } catch (Exception e) {
                  e.printStackTrace();
               }
            }
         });
      }

      /**
      * Create the frame.
      */
      public MainFrame() {
         setBounds(100, 100, 325, 203);

         final JPanel contentPane = new JPanel();
         contentPane.setLayout(null);
         setContentPane(contentPane);

         final JTextField textField = new JTextField();
         textField.setBounds(10, 20, 200, 30);
         contentPane.add(textField);
         textField.setColumns(50);
         textField.setText("简单的frame, 非常简单了");
      }
   }
   ```

   ![swing-demo-structure](https://gitee.com/cpfree/picture-warehouse/raw/master/images/jnlp.src/swing-demo-structure.png)

   最终项目结构是这样的, 然后达成 `swing-demo.jar` 包, 能不能点击执行无所谓的.

### 2. 为jar添加签名

   ![cmd-storekey](https://gitee.com/cpfree/picture-warehouse/raw/master/images/jnlp.src/cmd-storekey.png)

1. 创建 `keystore`, 命名为 `swing-demo-keys`, alias 为 jdc

   `keytool -genkey -keystore swing-demo-keys -alias jdc`

   > 运行之后输入两次密码, 后面的名字, 组织之类的输入不输入无所谓了.

2. 将创建的 `keystore` 添加到 `swing-demo.jar`

   `jarsigner -keystore swing-demo-keys swing-demo.jar jdc`

### 3. 编写 jnlp 文件

编写 jnlp 文件命名为 `swing-demo.jnlp`

```xml
<?xml version="1.0" encoding="UTF-8"?>

<!--codebase 属性指出搜索应用程序资源的顶级URL,下面的icon/jar元素都是以这个URL为基本, 当然你也可以使用完整的url路径.-->
<!--codebase 据说直接填本地文件夹路径都可以, 具体我也没有试过, 有兴趣的话可以尝试下.-->
<jnlp codebase="http://127.0.0.1:8080/jnlptest" href="./swing-demo.jnlp">
    <!--    blog.bitsCN.com网管博客等你来搏-->
    <information>
        <!-- 在"开始"-"运行"菜单中输入"javaws"或"javaws -viewer"启动Web Start,会看到客户端已经安装的webstart应用程序-->
        <!--title ：应用程序标题 vendor：供应商, title/vendor 元素必须，会显示在用"javaws -viewer"命令, 打开的应用程序缓存查看器（Java Application Cache Viewer）中-->
        <title>HelloWorld</title>
        <vendor>哈哈哈哈</vendor>
        <description>demo</description>

        <!-- homepage ：存放有关应用程序的相关文档的URL，如help文件等，仅仅是description作用
        <homepage href="http://127.0.0.1:8080/jnlptest/index.html"/> -->

        <!--icon 指定图标会显示在应用程序缓存查看器中，在查看器中新建webstart快捷方式到桌面时也会显示为快捷方式图标，只支持GIF/JPEG格式，其它格式无效-->
        <icon href="./img/logo.jpg"/>

        <!--splash 在sun的文档中提到会出现在webstart启动时的闪屏中，如果网络慢, 或启动慢, 可以设置一下了-->
        <icon kind="splash" href="./logo.jpg"/>

        <!-- 允许离线启动，可以使用javaws -offline命令-->
        <offline-allowed/>
    </information>

    <resources>
        <!-- 最好1.5以上, 下面我指定的是1.8, 因为我觉得1.8以前的版本都过时了, 哈哈 -->
        <j2se version="1.8+"/>
        <!-- 指定要下载到本地的jar文件(注意，所有的文件都需要打包才能够下载)，可以包含一些资源文件，如icons/configuration files，可以使用getResource方法取得-->
        <jar href="./swing-demo.jar"/>
    </resources>

    <!--application-desc 必须，指定webstart启动时执行jar文件中的哪个类-->
    <application-desc main-class="cn.cpf.MainFrame"/>

</jnlp>
```

### 4. 发布前三步的文件到服务器

再此使用tomcat(其他serve-app也可以), 在tomcat的webapp目录下新建 jnlptest 文件夹, 将`swing-demo.jnlp`, `swing-demo.jar`, `swing-demo-key` 等全部拷贝进去. 如果在`.jnlp`文件中配置logo, 或者其它jar包的话也全部放进去. 启动tomcat, 反正只要通过url路径能访问到就行.

   ![file-structure](https://gitee.com/cpfree/picture-warehouse/raw/master/images/jnlp.src/file-structure.png)

### 5. 测试执行

浏览器输入`http://127.0.0.1:8080/jnlptest/swing-demo.jnlp`, 回车,

或者命令行输入 `javaws http://127.0.0.1:8080/jnlptest/swing-demo.jnlp`

---

注意此时可能会弹出安全, 权限什么的, 如果这是个值得信任的`.jnlp`文件的话就去java控制面板里面去配置信息, 详情见下图配置吧.

![jnlpconfig](https://gitee.com/cpfree/picture-warehouse/raw/master/images/jnlp.src/jnlp-javaws-config.png)

即便配置完成之后也会有下面的警告

![jnlp-warning](https://gitee.com/cpfree/picture-warehouse/raw/master/images/jnlp.src/jnlp-warning.png)

还有就是如果url对应的jar没有签名的话, 也会弹出各种弹框啦, 至于信不信任自己视情况而定.

最后画面就显示出来了

![jnlp-demo](https://gitee.com/cpfree/picture-warehouse/raw/master/images/jnlp.src/mainframe-demo.png)

---

## 问题

### 浏览器输入Url只下载不执行 & 双击`.jnlp` 文件不执行

1. 浏览器通过url访问的一般是一个 `.jnlp` 文件, 浏览器获得文件之后发现自己不能处理 `.jnlp` 文件, 之后不同的浏览器会有不同的处理方式.

   - ie: 默认直接交给系统去运行.
   - chrome: 默认直接下载.
   - Mocrosoft Egde: 弹出一个选项(运行, 下载, 取消), 运行就是交给系统去运行.

2. 系统获得 `.jnlp` 文件之后会交给`java web start`运行.

   > 如果系统无法识别`.jnlp`文件打开方式的话, 可以通过配置`.jnlp`文件默认打开程序来解决.(一般来说只要是通过window安装包正确安装jre的话, 都会自动配置`.jnlp`文件运行方式的.)

3. `java web start` 加载`.jnlp`文件, 从中获取可执行jar包的下载地址，执行方法，以及参数等信息, 然后去下载jar包后执行应用程序.
