---
keys: 
type: copy,blog,trim
url: <>
id: 220117-120850
---

## spring-cloud 版本选择

如果仅仅是 Spring 项目的话, 可以直接选择`Springboot`最新版本.

但是如果是要搭建 `spring-cloud` 的话, 还需要考虑 `spring-cloud` 和 `spring-boot` 的对应关系.

而当前中国比较流行的 `spring-cloud` 是 `spring-cloud-alibaba`, 那么就需要同时考虑三者的版本匹配.

#### 首先选择 `spring cloud alibaba`

访问官网 <https://spring.io/projects/spring-cloud-alibaba>

获取`最新的`, `稳定的` 版本, 当前(2022年1月7日)最新稳定版本是 `2.2.6.RELEASE`

![](https://gitee.com/cpfree/picture-warehouse/raw/master/devops-note/1642236172883.png)

仅仅想使用 `spring cloud alibaba` 的部分功能, 因此, 仅仅包含红框中选择的就好

![](https://gitee.com/cpfree/picture-warehouse/raw/master/devops-note/1642236333763.png)

#### 选择其它组件版本

1. 访问阿里巴巴 git 版本说明 <https://github.com/alibaba/spring-cloud-alibaba/wiki/版本说明>

   ![](https://gitee.com/cpfree/picture-warehouse/raw/master/devops-note/1642237046137.png)

   由此可以选择 `2.2.6.RELEASE` 适配的一些插件版本, 但是不用急, 先继续往下看.

2. 通过 pom 文件查看版本

   如下

   ```xml
    <properties>
        <maven.compiler.source>1.8</maven.compiler.source>
        <maven.compiler.target>1.8</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <java.version>1.8</java.version>

        <spring.cloud.alibaba.version>2.2.6.RELEASE</spring.cloud.alibaba.version>
    </properties>

   <dependencyManagement>
      <dependencies>
         <dependency>
               <groupId>com.alibaba.cloud</groupId>
               <artifactId>spring-cloud-alibaba-dependencies</artifactId>
               <version>{project-version}</version>
               <type>pom</type>
               <scope>import</scope>
         </dependency>
      </dependencies>
   </dependencyManagement>
   ```

   成功刷新 maven 后, 引入`2.2.6.RELEASE`的`spring-cloud-alibaba`.

3. 查看`spring-cloud-alibaba`里面的 `spring-cloud`

   ![](https://gitee.com/cpfree/picture-warehouse/raw/master/devops-note/1642236607744.png)

   发现是 `spring-cloud` 是 `2.3.1.RELEASE`;

   ![](https://gitee.com/cpfree/picture-warehouse/raw/master/devops-note/1642236771872.png)

4. 至此, 发现:

   1. `nacos`, `sentinel` 等已经再`spring-cloud-alibaba-dependencies`里面有引入, 因此 pom 文件里面不需要再引入这些插件.
   2. `spring-cloud` 的 `2.3.1-RELEASE` 就是 `Hoxton.SR9`, 在此, 我们引入 `Hoxton.SR9`

   最终`pom.xml`文件里面

   ```xml
    <properties>
        <maven.compiler.source>1.8</maven.compiler.source>
        <maven.compiler.target>1.8</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <java.version>1.8</java.version>

        <!-- Dependency Versions -->
        <spring.boot.version>2.3.2.RELEASE</spring.boot.version>
        <spring.cloud.version>Hoxton.SR9</spring.cloud.version>
        <spring.cloud.alibaba.version>2.2.6.RELEASE</spring.cloud.alibaba.version>
        <dubbo.version>2.7.8</dubbo.version>
        <rocketMq.version>4.4.0</rocketMq.version>
    </properties>
    
    <dependencyManagement>
        <dependencies>
            <!--  spring cloud alibaba -->
            <dependency>
                <groupId>com.alibaba.cloud</groupId>
                <artifactId>spring-cloud-alibaba-dependencies</artifactId>
                <version>${spring.cloud.alibaba.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
            <!-- spring boot -->
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-starter-parent</artifactId>
                <version>${spring.boot.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>
   ```

## 注意(踩坑点)

1. dependencyManagement 里面的依赖都应该有版本号.
   
   如下pom, 引入 parent 的 pom 之后, 引入了没有版本号的 `spring-boot-starter-test`

   1. 在父工程里面, 引入了 `spring-boot-starter-parent`之外, 又引入了`spring-boot-starter-log4j2`, 则此时将会以`2.6.2`版本为优先.
   2. 在父工程里面, 引入了 `spring-boot-starter-parent`之外, 又引入了`spring-boot-starter-test`, 并且没有标识版本号, maven中pom编译正常通过.
      当时当在子工程里面, 再次引入 `spring-boot-starter-test` 时, 子工程将以无版本号的`spring-boot-starter-test`为优先, 之后发现没有填版本号, 结果导致maven找不到jar.

   ```xml
    <dependencyManagement>
        <dependencies>
            <!-- spring boot -->
            <dependency>
                  <groupId>org.springframework.boot</groupId>
                  <artifactId>spring-boot-starter-parent</artifactId>
                  <version>2.3.2.RELEASE</version>
                  <type>pom</type>
                  <scope>import</scope>
            </dependency>
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-starter-log4j2</artifactId>
                <version>2.6.2</version>
            </dependency>
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-starter-test</artifactId>
            </dependency>
        </dependencies>
    </dependencyManagement>
   ```
