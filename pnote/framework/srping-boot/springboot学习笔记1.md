### spring boot 学习笔记

1. 简介
   - 简化 Spring 开发的一个框架.
   - spring boot 整合了几乎所有的框架.
   - 设计目的是用来简化新 Spring 应用的初始搭建以及开发过程。
   - 奉行的宗旨: 废除掉所有配置文件, 让开发变得简单纯粹, 核心 : 尽量实现零配置,
   - Spring Boot 并不是对 Spring 功能上的增强，而是提供了一种快速使用 Spring 的方式。

2. 优点
   - 创建独立的 Spring 应用程序
   - 嵌入的 Tomcat，无需部署 WAR 文件
   - 简化 Maven 配置
   - 自动配置 Spring.
   - 提供生产就绪型功能，如指标，健康检查和外部配置
   - 开箱即用，没有代码生成，也无需 XML 配置。

### Spring-boot 的 2 大优点

1. 约定优先于配置（COC）
2. 开箱即用（约定 spring-boot-starter- 作为命名前缀，都位于 org.springframenwork.boot 包或者命名空间下）。

#### Spring Boot 之 Spring Boot Starter 依赖包及作用

1. spring-boot-starter-parent
   这是 Spring Boot 的父级依赖，这样当前的项目就是 Spring Boot 项目了。
   spring-boot-starter-parent 是一个特殊的 starter，它用来提供相关的 Maven 默认依赖。使用它之后，常用的包依赖可以省去 version 标签。
2. spring-boot-starter

3. spring-boot-starter-web

   快速 web 应用开发, 有这个依赖后在当下项目运行 mvn spring-boot:run 就可以直接启用一个嵌套了 tomcat 的 web 应用。

   > 如果没有提供任何服务的 Cotroller,访问任何路径都会返回一个 springBoot 默认的错误页面（Whitelabel error page）。

   三种启动方式

   1. 运行带有 main 方法类
   2. 通过命令行 java -jar 的方式
   3. 通过 spring-boot-plugin 的方式

   嵌入式 Web 容器层面的约定和定制

   spring-boot-starter-web 默认使用嵌套式的 Tomcat 作为 Web 容器对外提供 HTTP 服务，默认端口 8080 对外监听和提供服务。

   我们同样可以使用 spring-boot-starter-jetty 或者 spring-boot-starter-undertow 作为 Web 容器。

   想改变默认的配置端口，可以在 application.properties 中指定：

   ```properties
   server.port = 9000(the port number you want)

   server.address
   server.ssl.*
   server.tomcat.*
   ```

   如果上诉仍然没有办法满足要求，springBoot 支持对嵌入式的 Web 容器实例进行定制，可以通过向 IoC 容器中注册一个 EmbeddedServletContainerCustomizer 类型的组件来对嵌入式的 Web 容器进行定制

   ```java
   public class UnveilSpringEmbeddedTomcatCustomizer implements EmbeddedServletContainer{
      public void customize(ConfigurableEmbeddedServletContainer container){
         container.setPort(9999);
         container.setContextPath("C\\hello");
                        ...
      }
   }
   ```

4. spring-boot-configuration-processor

   spring 默认使用 yml 中的配置，但有时候要用传统的 xml 或 properties 配置，就需要使用`spring-boot-configuration-processor`了
   再在你的配置类开头加上@PropertySource("classpath:your.properties")，其余用法与加载 yml 的配置一样

5. spring-boot-starter-logging

   常见的日志系统大致有：java.util 默认提供的日志支持，log4j,log4j2,commons logging,spring-boot-starter-logging 也是其中的一种。
   springBoot 将使用 logback 作为应用日志的框架，程序启动时，由`org.springframework.boot.logging-Logging-Application-Lisetener`根据情况初始化并使用。

   > 如果要想改变 springBoot 提供的应用日志设定，可以通过以下原则：
   > 遵循 logback 的约定，在 classpath 中使用自己定制的 logback.xml 配置文件。
   > 在文件系统的任意一个位置提供自己的 logback.xml 配置文件，然后通过 logging.config 配置项指向这个配置文件然后引用它，例如在 application.properties 中指定如下的配置：
   > `logging.config=/{some.path.you.defined}/any-logfile-name-I-like.log}`

## 依赖包

> <https://blog.csdn.net/shuxing520/article/details/78213862>

| 依赖包                                 | 作用                                                                                      |
| -------------------------------------- | ----------------------------------------------------------------------------------------- |
| spring-boot-starter                    | 这是 Spring Boot 的核心启动器，包含了自动配置、日志和 YAML。                              |
| spring-boot-starter-amqp               | 通过 spring-rabbit 来支持 AMQP 协议（Advanced Message Queuing Protocol. 。                |
| spring-boot-starter-aop                | 支持面向方面的编程即 AOP，包括 spring-aop 和 AspectJ。                                    |
| spring-boot-starter-artemis            | 通过 Apache Artemis 支持 JMS 的 API（Java Message Service API. 。                         |
| spring-boot-starter-batch              | 支持 Spring Batch，包括 HSQLDB 数据库。                                                   |
| spring-boot-starter-cache              | 支持 Spring 的 Cache 抽象。                                                               |
| spring-boot-starter-cloud-connectors   | 支持 Spring Cloud Connectors，简化了在像 Cloud Foundry 或 Heroku 这样的云平台上连接服务。 |
| spring-boot-starter-data-elasticsearch | 支持 ElasticSearch 搜索和分析引擎，包括 spring-data-elasticsearch。                       |
| spring-boot-starter-data-gemfire       | 支持 GemFire 分布式数据存储，包括 spring-data-gemfire。                                   |
| spring-boot-starter-data-jpa           | 支持 JPA（Java Persistence API. ，包括 spring-data-jpa、spring-orm、Hibernate。           |
| spring-boot-starter-data-mongodb       | 支持 MongoDB 数据，包括 spring-data-mongodb。                                             |
| spring-boot-starter-data-rest          | 通过 spring-data-rest-webmvc，支持通过 REST 暴露 Spring Data 数据仓库。                   |
| spring-boot-starter-data-solr          | 支持 Apache Solr 搜索平台，包括 spring-data-solr。                                        |
| `spring-boot-starter-freemarker`       | 支持 FreeMarker 模板引擎。                                                                |
| spring-boot-starter-groovy-templates   | 支持 Groovy 模板引擎。                                                                    |
| spring-boot-starter-hateoas            | 通过 spring-hateoas 支持基于 HATEOAS 的 RESTful Web 服务。                                |
| spring-boot-starter-hornetq            | 通过 HornetQ 支持 JMS。                                                                   |
| spring-boot-starter-integration        | 支持通用的 spring-integration 模块。                                                      |
| `spring-boot-starter-jdbc`             | 支持 JDBC 数据库。                                                                        |
| spring-boot-starter-jersey             | 支持 Jersey RESTful Web 服务框架。                                                        |
| spring-boot-starter-jta-atomikos       | 通过 Atomikos 支持 JTA 分布式事务处理。                                                   |
| spring-boot-starter-jta-bitronix       | 通过 Bitronix 支持 JTA 分布式事务处理。                                                   |
| spring-boot-starter-mail               | 支持 javax.mail 模块。                                                                    |
| spring-boot-starter-redis              | 支持 Redis 键值存储数据库，包括 spring-redis。                                            |
| spring-boot-starter-security           | 支持 spring-security。                                                                    |
| spring-boot-starter-social-facebook    | 支持 spring-social-facebook                                                               |
| spring-boot-starter-social-linkedin    | 支持 pring-social-linkedin                                                                |
| spring-boot-starter-social-twitter     | 支持 pring-social-twitter                                                                 |
| spring-boot-starter-test               | 支持常规的测试依赖，包括 JUnit、Hamcrest、Mockito 以及 spring-test 模块。                 |
| spring-boot-starter-thymeleaf          | 支持 Thymeleaf 模板引擎，包括与 Spring 的集成。                                           |
| spring-boot-starter-velocity           | 支持 Velocity 模板引擎。                                                                  |
| spring-boot-starter-web                | 支持全栈式 Web 开发，包括 Tomcat 和 spring-webmvc。                                       |
| spring-boot-starter-websocket          | 支持 WebSocket 开发。                                                                     |
| spring-boot-starter-ws                 | 支持 Spring Web Services。                                                                |

Spring Boot 应用启动器面向生产环境的还有 2 种，具体如下：

| 依赖包                           | 作用                                           |
| -------------------------------- | ---------------------------------------------- |
| spring-boot-starter-actuator     | 增加了面向产品上线相关的功能，比如测量和监控。 |
| spring-boot-starter-remote-shell | 增加了远程 ssh shell 的支持。                  |

Spring Boot 应用启动器还有一些替换技术的启动器，具体如下：

| 依赖包                       | 作用                                           |
| ---------------------------- | ---------------------------------------------- |
| spring-boot-starter-jetty    | 引入了 Jetty HTTP 引擎（用于替换 Tomcat. 。    |
| spring-boot-starter-log4j    | 支持 Log4J 日志框架。                          |
| spring-boot-starter-logging  | 引入了 Spring Boot 默认的日志框架 Logback。    |
| spring-boot-starter-tomcat   | 引入了 Spring Boot 默认的 HTTP 引擎 Tomcat。   |
| spring-boot-starter-undertow | 引入了 Undertow HTTP 引擎（用于替换 Tomcat. 。 |
