# maven 相关错误

## Failed to execute goal org.apache.maven.plugins:maven-gpg-plugin:1.6:sign (sign-artifacts) on project common-lang: Exit code: 2

查看

## build时打包时总是不能把resources资源打包进class文件中

后来发现

```xml
    <groupId>cn.cpf</groupId>
    <artifactId>endpoint-io-transfer</artifactId>
    <packaging>pom</packaging>
    <version>1.0-RELEASE</version>
```

其中的 `packaging`, 写成了 `pom` 应该改为jar, 之后刷新下缓存, 再rebuild一下就好了

## maven 配置jdk 版本

> 参考自: <https://blog.csdn.net/wuyujin1997/article/details/83120164>

> maven项目中，编译器和JRE的版本默认为1.5

如何永久设置maven项目的JDK版本?

方案一: 配置properties节点下的maven编译器信息。

   ```xml
   <properties>
      <maven.compiler.source>1.8</maven.compiler.source>
      <maven.compiler.target>1.8</maven.compiler.target>
   </properties>
   ```

方案二: 配置build>plugins>plugins>configuration节点下的source和target节点值。

   ```xml
   <plugins>
      <plugin>
         <groupId>org.apache.maven.plugins</groupId>
         <artifactId>maven-compiler-plugin</artifactId>
         <version>3.8.0</version>
         <configuration>
            <source>1.8</source>
            <target>1.8</target>
         </configuration>
      </plugin>
   </plugins>
   ```