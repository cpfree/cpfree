# 获取包下所有类方法

## 背景

最近遇到一个需求, **需要获取 jar 中的 class 文件**, 但在网上找了很多**获取包下所有类**的文档, 但都大同小异, 只能获取项目中未打包的 class 文件, 无法获取 jar 中的 class 文件.于是便稍微研究了一下.

## 开发环境

OS : window
SDK: jdk1.8
IDE: IDEA

## summary

首先, jdk 中并没有给出具体的获取包下类的方法, 但想要获取指定包下的class, 可以通过IO操作获取指定文件夹下的类的方式获取class文件.

但是问题来了: jar包中的class怎么获取呢?

要知道, class文件可以以**独立文件**的形式存在文件夹中(例如通常我们项目中的编译的java代码), 但还可以在 jar包里面, 在jar包里面可以使用普通的文件IO操作获取里面的文件吗, 答案是否定的, 但是不要担心, jdk里面是有提供获取jar包文件方法的, 例如 `JarFile` 类.

但是啊, 实际上我在网上找了很多代码, 虽然都支持在jar中获取class, 但是 **全部没什么用**, 只能获取项目中未打包的 class 文件.

在java中, package是为多层命名空间使用的, **java进程中, 同样的package可以不唯一的, 只要保证同样的package中class唯一即可**, 然后就造成了下面一个问题.

问题: 例如, a.jar 中有个 `com.github.sinjar.util` 包, b.jar 里面有个 `com.github.sinjar.util`, 然后你的代码里面也有一个 `com.github.sinjar.util`, 那么问题来了, 你要获取哪个 `com.github.sinjar.util` 下的class, 还是说需要全部获取.

当然通常情况下不会出现多个package的情况, 但是因为可以出现多个package情况, 结果就造成了, 仅仅传一个package是无法获取到指定的路径的, 全部获取又太过麻烦, 那该怎么办呢?

要知道, package虽然是不唯一的, 但是class却是唯一的, 我们可以通过class路径获取到class所在jar和所在包.

`*.class.getProtectionDomain().getCodeSource().getLocation().getPath()`

## 获取指定包的所有类有几种情况

情况 1: 指定 package 下的类在 jar 文件中.
情况 2: 指定 package 下的类是没有在 jar 中的 class 文件.
情况 3: package 在多个地方均存在.


