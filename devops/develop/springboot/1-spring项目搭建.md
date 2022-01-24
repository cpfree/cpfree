---
keys: 
type: copy,blog,trim
url: <>
id: 220100-100002
---

# Spring项目搭建

## Spring版本选择

如果仅仅是 Spring 项目的话, 可以直接选择`Springboot`最新版本.

但是如果是要搭建 `spring-cloud` 的话, 还需要考虑 `spring-cloud` 和 `spring-boot` 的对应关系.

而当前中国比较流行的 `spring-cloud` 是 `spring-cloud-alibaba`, 那么就需要同时考虑三者的版本匹配.

由于当前项目需要去适配 `spring-cloud-alibaba`, 因此 `Spirngboot` 版本选择 `2.3.2.RELEASE`

## 建立工程

### 1. 引入父工程 pom 文件

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <project xmlns="http://maven.apache.org/POM/4.0.0"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
      <modelVersion>4.0.0</modelVersion>
      <groupId>com.github.helowcode</groupId>
      <artifactId>web-parent</artifactId>
      <version>1.0-SNAPSHOT</version>
      <modules>
         <module>gateway</module>
         <module>one-service</module>
      </modules>
      <packaging>pom</packaging>

      <name>oh-cloud</name>
      <description>hydroxyl</description>
      <url>https://gitee.com/cpfree/oh.git</url>

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
               <!--  spring cloud -->
               <dependency>
                  <groupId>org.springframework.cloud</groupId>
                  <artifactId>spring-cloud-dependencies</artifactId>
                  <version>${spring.cloud.version}</version>
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
               <dependency>
                  <groupId>com.baomidou</groupId>
                  <artifactId>mybatis-plus-boot-starter</artifactId>
                  <version>3.4.2</version>
               </dependency>

               <!-- build -->
               <dependency>
                  <groupId>junit</groupId>
                  <artifactId>junit</artifactId>
                  <version>4.13.2</version>
                  <scope>test</scope>
               </dependency>
               <!-- 热部署 -->
               <dependency>
                  <groupId>org.projectlombok</groupId>
                  <artifactId>lombok</artifactId>
                  <version>1.18.22</version>
                  <scope>provided</scope>
               </dependency>
         </dependencies>
      </dependencyManagement>

      <!--编译管理 jdk版本和字符集编码-->
      <build>
         <pluginManagement>
               <plugins>
                  <plugin>
                     <groupId>org.apache.maven.plugins</groupId>
                     <artifactId>maven-compiler-plugin</artifactId>
                     <version>3.6.0</version>
                     <configuration>
                           <source>1.8</source>
                           <target>1.8</target>
                           <!-- 指定插件将使用的编译器的版本 -->
                           <compilerVersion>1.8</compilerVersion>
                           <encoding>UTF-8</encoding>
                           <!-- 要使compilerVersion标签生效，还需要将fork设为true，用于明确表示编译版本配置的可用 -->
                           <fork>true</fork>
                           <verbose>false</verbose>
                           <!--跳过测试-->
                           <skip>true</skip>
                           <showWarnings>true</showWarnings>
                           <meminitial>128m</meminitial><!-- 编译器使用的初始内存 -->
                           <maxmem>512m</maxmem><!-- 编译器使用的最大内存 -->
                     </configuration>
                  </plugin>
                  <plugin>
                     <groupId>org.apache.maven.plugins</groupId>
                     <artifactId>maven-resources-plugin</artifactId>
                     <version>3.1.0</version>
                     <configuration>
                           <encoding>UTF-8</encoding>
                     </configuration>
                  </plugin>
                  <plugin>
                     <groupId>org.springframework.boot</groupId>
                     <artifactId>spring-boot-maven-plugin</artifactId>
                     <version>2.5.6</version>
                     <configuration>
                           <fork>true</fork>
                     </configuration>
                     <executions>
                           <execution>
                              <goals>
                                 <goal>repackage</goal>
                              </goals>
                           </execution>
                     </executions>
                  </plugin>
                  <plugin>
                     <groupId>org.apache.maven.plugins</groupId>
                     <!-- 注意不是maven-compiler-plugin -->
                     <artifactId>maven-jar-plugin</artifactId>
                     <version>2.6</version>
                     <configuration>
                           <archive>
                              <!-- 添加manifest.mf的配置 -->
                              <manifest>
                                 <addClasspath>true</addClasspath>
                              </manifest>
                           </archive>
                     </configuration>
                  </plugin>
                  <!-- build plugin -->
                  <plugin>
                     <groupId>org.apache.maven.plugins</groupId>
                     <artifactId>maven-compiler-plugin</artifactId>
                     <version>3.6.0</version>
                  </plugin>
               </plugins>
         </pluginManagement>
      </build>
   </project>
   ```

### 2. 创建模块(`one-service`), 引入子工程 pom 文件

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <project xmlns="http://maven.apache.org/POM/4.0.0"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
      <parent>
         <artifactId>web-parent</artifactId>
         <groupId>com.github.helowcode</groupId>
         <version>1.0-SNAPSHOT</version>
      </parent>
      <modelVersion>4.0.0</modelVersion>

      <artifactId>one-service</artifactId>

      <properties>
         <maven.compiler.source>8</maven.compiler.source>
         <maven.compiler.target>8</maven.compiler.target>
      </properties>

      <dependencies>
         <dependency>
               <groupId>org.springframework.boot</groupId>
               <artifactId>spring-boot-starter-web</artifactId>
         </dependency>

         <dependency>
               <groupId>org.springframework.boot</groupId>
               <artifactId>spring-boot-starter-test</artifactId>
               <scope>test</scope>
         </dependency>
         <!-- Lombok -->
         <dependency>
               <groupId>org.projectlombok</groupId>
               <artifactId>lombok</artifactId>
         </dependency>
      </dependencies>

      <build>
         <plugins>
               <plugin>
                  <groupId>org.springframework.boot</groupId>
                  <artifactId>spring-boot-maven-plugin</artifactId>
               </plugin>
         </plugins>
      </build>

   </project>
   ```

### 3. 编写 Spring 启动类

   ```java
   package com.github.helowcode.cloud.oneservice;

   import org.springframework.boot.SpringApplication;
   import org.springframework.boot.autoconfigure.SpringBootApplication;
   import org.springframework.context.annotation.ComponentScan;

   @ComponentScan
   @SpringBootApplication
   public class OneApplication {

      public static void main(String[] args) {
         SpringApplication.run(OneApplication.class, args);
      }

   }
   ```

### 4. 编写 Controller

   ```java
   package com.github.helowcode.cloud.oneservice.api;

   import com.github.cosycode.web.base.lang.base.PostBean;
   import org.springframework.stereotype.Controller;
   import org.springframework.web.bind.annotation.*;

   import java.util.Map;

   /**
   * @author CPF
   **/
   @RequestMapping("/simple")
   @Controller
   public class SimpleController {

      @GetMapping(value = "/test")
      @ResponseBody
      public Map<String, Object> testGet(@RequestParam("name") String name) {
         Map<String, Object> post = new HashMap<>(8);
         post.put("method ", "GET");
         post.put("call ", getClass().getSimpleName());
         post.put("name ", name);
         return post;
      }

   }
   ```

### 5. 添加 application.yml

   ```yaml
   server:
      port: 9101

   debug: true
   logging:
      level:
         org.springframework.boot.autoconfigure: ERROR
         org.springframework.web: INFO
         org.hibernate: ERROR
   ```

### 6. 最终项目路径如下

   ![](https://gitee.com/cpfree/picture-warehouse/raw/master/devops-note/1642403037668.png)

## 测试

   请求 URL: `http://127.0.0.1:9101/simple/test?name=haha`

   响应

   ```json
   {
      "call ": "SimpleController",
      "method ": "GET",
      "name ": "haha"
   }
   ```
