---
keys: 
type: copy,blog,trim
url: <>
id: 220100-100012
---

# spring-boot-starter-actuator

spring-boot-starter-actuator模块是一个spring提供的监控模块。我们在开运行发过程中，需要实时和定时监控服务的各项状态和可用性。Spring Boot的spring-boot-starter-actuator 模块（健康监控）功能提供了很多监控所需的接口，可以对应用系统进行配置查看、相关功能统计等。

## 改造项目, 以 `as-service` 为例

1. 添加依赖 `spring-boot-starter-actuator`

   ```xml
   <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-actuator</artifactId>
   </dependency>
   ```

2. `application.yml` 里面添加如下内容

   ```yaml
   management:
      server:
         port: 9020
      endpoints:
         web:
            exposure:
            include: "*"
   ```

   完整 `application.yml` 文件如下

   ```yml
   server:
      port: 10101

   spring:
      application:
         name: as-service
      cloud:
         nacos:
            discovery:
               server-addr: cpfree.cn:8848

   management:
      server:
         port: 10121
      endpoints:
         web:
            base-path: /
            exposure:
               include: "*"

   debug: true
   logging:
      level:
         org.springframework.boot.autoconfigure: ERROR
         org.springframework.web: INFO
         org.hibernate: ERROR
   ```

3. 添加完成之后 访问 `ip地址:10121/`

   得到如下结果, 

   ![](https://gitee.com/cpfree/picture-warehouse/raw/master/devops-note/1642492880494.png)

   跳转至其中的 url 还能访问局部新息

   ![](https://gitee.com/cpfree/picture-warehouse/raw/master/devops-note/1642492994513.png)


## spring-actuator 图形化界面: SpringBoot Admin（简称SBA）对SpringBoot实现界面化监控

如上面可知 `spring-actuator` 返回的数据直接看很麻烦, 若是项目没有其它界面监控软件的话, 可以看下 `SpringBoot Admin`

SBA则是基于Actuator更加进化了一步，其是一个针对Actuator接口进行UI美化封装的监控工具。Spring Boot Admin 是一个管理和监控Spring Boot 应用程序的开源软件。每个应用都认为是一个客户端，通过HTTP或者使用 Eureka注册到admin server中进行展示，Spring Boot Admin UI部分使用AngularJs将数据展示在前端。

1. 添加依赖

   ```xml
　　<!--SBA Server-->
   <dependency>
      <groupId>de.codecentric</groupId>
      <artifactId>spring-boot-admin-server</artifactId>
   </dependency>
   <!--SBA Server UI-->
   <dependency>
      <groupId>de.codecentric</groupId>
      <artifactId>spring-boot-admin-server-ui</artifactId>
   </dependency>
   ```
