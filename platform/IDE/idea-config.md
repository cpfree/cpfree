# IDEA config

## 环境配置

### 配置jdk

1. 进入路径 `File` --> `Project Structure` --> `Platform Settings` --> `SDK`
   添加系统安装的JDK,

2. 路径 `File` --> `Project Structure` --> `project Settings` --> `project`
   配置SDK, 以及 `project language level`,

3. 路径 `File` --> `Other Settings` --> `Project Structure for New Projects`
   配置上面两步

### 配置maven

1. 进入路径 `File` --> `Settings` --> `Build, Execution, Deployment` --> `Build Tools` --> `Maven`
   配置`maven home directory`
   注意配置后的 `Local repository` 是不是自己的本地maven仓库。

## 相关

### idea double shift改成其它快捷键

1. 打开IDE 按快捷键 `Ctrl+Shift+A` 输入 `registry` 进入软件注册表.
2. 进入之后找到 `ide.suppress.double.click.handler` 打上勾 ，然后直接点右下角 `close`.

### IDEA 控制台输出乱码

选择项目部署的tomcat，在配置项VM options文本框中输入`-Dfile.encoding=UTF-8`,点击Apply或OK即可。

### idea 添加 VUE 的语法支持和开发

1. 取消爆红

   `setting` -> `Editor` -> `Inspections`。

   找到 `XML` -> `Unbound XML namespace prefix` 的勾去掉。

2. 添加提示

   `setting` -> `Editor` -> `Inspections`

   右边 `HTML` -> `Unknown HTML tag attribute`。

   `Custom HTML tag attribute` 勾打上
   并在里面填入
   \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\在\\\\\\\\\\\\\\\\\\\\\\\\\\\

   ```xml
   @tap
   @tap.stop
   @tap.prevent
   @tap.once
   @click
   @click.stop
   @click.prevent
   @click.once
   @change
   @change.lazy
   @change.number
   @change.trim
   v-model
   v-for
   v-text
   v-html
   v-if
   v-else-if
   v-else
   v-pre
   v-once
   v-bind
   scoped
   ```

### 添加 lombok

1. 添加依赖

   ```xml
   <dependency>
      <groupId>org.projectlombok</groupId>
      <artifactId>lombok</artifactId>
      <version>1.16.20</version>
      <scope>provided</scope>
   </dependency>
   ```

2. 下载lombok插件

   > File -> `Settings` -> `Plugins`.
   > 搜索 lombok，点击安装install。然后会提示重启，重启。

3. 配置

   - `compiler`
      找到路径 `File | Settings | Build, Execution, Deployment | Compiler | Java Compiler`
      `user compiler` 设置为 `javac`

   - 打开注解生成器Enable annotation processing
      找到 `setting` 路径 `File | Settings | Build, Execution, Deployment | Compiler | Annotation Processors`
      `enable annotation processing` 设置true

> pom.xml中加入的lombok依赖包版本和自动安装的plugin中的lombok依赖包版本需要一致。
> 添加的lombok插件plugin，点击insall时是自动安装的最新版本的lombok。
> 但是在pom.xml中的依赖包是maven中的低版本的一个依赖包，版本不一致，造成了无法找到set和get.

### SpringBoot打包好后，使用外部的配置文件

1. 第一种方式手动指定配置文件位置：

   `java -jar myspring.jar --spring.config.location=D:\JavaSite\config\application.properties`

2. 第二种方式，根据官网介绍放在指定目录下
   SpringApplication loads properties from application.properties files in the following locations and adds them to the Spring Environment:

   1. A /config subdirectory of the current directory //  放在jar包同级目录下的子目录config
   2. The current directory  //与jar包目录同级
   3. A classpath /config package // 大概意思是在classpath下的config目录
   4. The classpath root // classpath中

> 优先级分别从低到高

### 控制台乱码

-Dfile.encoding=UTF-8

### 配置注释等

1. 找到路径 `File | Settings | Editor | Live Templates`

2. 点击右侧 `+`, 添加 `template group`, 命名(例如`my-group`).

3. 在 `my-group` 中添加 `live-template`

   abbreviation: docClass
   description: class 注释

   ```java
   /**
   * <b>Description : </b> $END$
   *
   * @author $user$
   * @date $date$
   **/
   ```

   编辑 `$user$`, `$date$`, 之后编辑生效方式等

### 配置新建类之后自动生成注释

1. 找到路径 `File | Settings | Editor | File and Code Templates`

2. 如下图, 在 Files选项卡中, `Class, Interface, Enum...`等6类文件右侧均包含 `#parse("File Header.java")` 代码, 它的含义就是转换 `File Header.java` 模板

   ![图 1](https://gitee.com/cpfree/picture-warehouse/raw/master/pic/20210616093003.png)

3. 切换到Include选项卡, 一般会有一个 `File Header.java` 文件(没有后缀), `#parse("File Header.java")` 这句代码就是渲染的这个文件, 我们只需要在这个文件中添加以下代码即可, 这样,每次新建 `Class, Interface, Enum...`等6类文件时, 就会自动在类头生成注释了.

   ![图 2](https://gitee.com/cpfree/picture-warehouse/raw/master/pic/20210616093014.png)

   ```java
   /**
   * <b>Description : </b> 
   *
   * @author ${USER}
   * @date ${DATE} ${TIME}
   **/
   ```

### 配置快捷键

`alt + D` : `fix doc comment`

