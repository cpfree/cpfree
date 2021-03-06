# 一个java工程里，有同一个jar包的多个版本，会有什么影响

### 可能的场景

> 正常和异常的服务器，环境完全一样，JDK版本也一样, 但就是一个正常运行, 一个报错

- 情况1: 两个jar包(a.jar和b.jar), 里面有相同的类c(包名类名相同, 但内容不同), 被同一个classloader加载, 如果加载到了a.jar中的`c.class`, 程序正常运行, 加载到了b.jar，程序会报错。
- 情况2: 两个jar包(a.jar和b.jar, 同一类型jar包, 但是不同版本号), 被一些工具或服务加载(maven, websphere), 加载到了`a.jar`, 死活加载不到`b.jar`, 哪怕`b.jar`里面有`a.jar`没有的类`c.class`, 但就是加载不到`c.class`.

### jar加载知识

1. 同一个classloader只会加载相同的class一次，后续再遇到相同的类, 不会再次加载.
2. jvm加载jar的顺序和系统返回的文件顺序有关, 而`系统返回的顺序`随着系统的不同, 系统版本的不同, 编码方式不同, 甚至环境的不同而可能不同.
3. 加载jar不是jvm的专利, tomcat,weblogic,websphere都有它们自己的加载方式, websphere服务器上的程序只允许加载两个相同但版本不同的jar中的一个，而tomcat和weblogic允许程序两个都加载进去。

### maven 加载jar包顺序

> 参考自: <https://blog.csdn.net/lizz861109/article/details/111594969>

maven只会引入一个`group + artifect`, 当依赖一个jar包多个版本时，maven 加载 jar 包优先级如下

1. 加载优先级与版本号大小没有关系
2. 本级优先于上级，上级优先于下级；
3. 本级依赖版本优先于管理版本；
4. 同一个包中后加载的版本覆盖先加载的版本；
5. 上级管理版本和本级管理版本会覆盖下级依赖版本；
6. 不同下级jar中依赖了不同版本，优先使用先加载下级jar中的版本；
7. 本级无法使用下级管理版本

> - 依赖版本：指dependencies中直接依赖
> - 管理版本：指dependencyManagement中管理的版本
> - 本级：指当前工程
> - 上级：指parent依赖的jar
> - 下级：指本级引用的jar

## 建议

1. class + 类全路径(包括内部类) 决定一个类, 在运行之前一定要保证这个是唯一的, 如果不唯一, 可能会在某个环境上正常运行, 但是在某些环境上可能会运行失败. 排查困难.
2. 除非必要, 否则类全路径最好保证唯一: 如果不唯一, 会影响开发人员的判断, 很可能忽视classloader的不同导致写出bug, 而且排查困难
3. 生产环境不要将jar的加载顺序和加载优先级的工作交给jvm或者是各种插件, 不同的版本的jvm和插件可能都不一样.
4. 开发过程中最好保证只引入一个版本的jar, 运行过程中最好保证lib下只有一个版本的jar.
5. 优先使用较适合的和较稳定版本的jar, 禁止使用有漏洞的jar.
