---
keys: nacos
type: copy,blog,trim
url: <>
id: 220115-204042
---

## nacos 安装

1. [nacos安装完成](../../spring-cloud/nacos/nacos-install.md)
2. [nacos安装](../../spring-cloud/nacos/nacos-cmd.md)

> 最终 nacos 单机部署到 `cpf.cn:8848`

## 项目中引入 nacos

> 在 springboot 项目 `one-service` 上进行改造

1. pom 文件添加两个 jar

   1. spring-cloud-starter-alibaba-nacos-discovery

   完整 pom 如下

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
               <groupId>com.alibaba.cloud</groupId>
               <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
         </dependency>

         <dependency>
               <groupId>com.github.cosycode</groupId>
               <artifactId>web-base</artifactId>
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

2. 更改 application.yml

   完成文件如下

   ```yaml
   server:
      port: 9101

   spring:
      application:
         name: one-service
      cloud:
         nacos:
            discovery:
            server-addr: cpf.cn:8848

   debug: true
   logging:
      level:
         org.springframework.boot.autoconfigure: ERROR
         org.springframework.web: INFO
         org.hibernate: ERROR
   ```

3. Springboot 启动类 添加注解 `@EnableDiscoveryClient` 启动 nacos 注册功能.

   完整java文件如下

   ```java
   package com.github.helowcode.cloud.oneservice;

   import org.springframework.boot.SpringApplication;
   import org.springframework.boot.autoconfigure.SpringBootApplication;
   import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
   import org.springframework.context.annotation.ComponentScan;

   /**
   * @author CPF
   * @since 1.0
   **/
   @ComponentScan
   @SpringBootApplication
   @EnableDiscoveryClient
   public class OneApplication {

      public static void main(String[] args) {
         SpringApplication.run(OneApplication.class, args);
      }

   }
   ```

## 启动验证

1. 运行SpringBoot
2. 到控制台查看是否成功注册

   ![nacos注册](https://gitee.com/cpfree/picture-warehouse/raw/master/devops-note/1642407217103.png)
