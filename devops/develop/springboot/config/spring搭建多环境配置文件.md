# 使用IDEA搭建SpringBoot多环境多配置文件

启动SpringBoot

打开SpringBootApplication启动类，鼠标右键RUN项，或者Ctrl+Shift+F10，生成启动配置

生成dev环境的配置文件

```java
/src/main/resources/application.properties公共配置文件 
/src/main/resources/application-default.properties生产环境配置文件 
/src/main/resources/application-dev.properties开发环境配置文件，在代码管理中排除，不提交 
```

在启动配置中，Program arguments中添加--spring.profiles.active=dev，这样启动时就会只加载公共和开发环境的配置文件

开发时修改代码自动重启
增加依赖库spring-boot-devtools，这样修改代码后，Ctrl+F9编译代码后，就会自动重启，重新载入代码。IDEA也可以设置自动编译，但是不推荐，快捷键更好。

日志
开发环境：编辑/src/main/resources/application-dev.properties

```conf
logging.level.root=WARN
logging.level.org.springframework.web=DEBUG
logging.level.org.hibernate=ERROR
```

生产环境：日志写到文件，编辑/src/main/resources/application-default.properties

# 将日志写入该目录下面，默认日志文件达到10M，会自动滚动，备份原来的，生成新的。
logging.path=/var/log
