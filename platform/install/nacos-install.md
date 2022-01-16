---
keys: 
type: copy,blog,trim
url: <>
id: 220116-140515
---

# nacos-install

> 文档编写时间: 2022年1月11日
> nacos最新稳定版: `nacos-server-2.0.3.zip`

## 前提环境

> 64 bit OS，支持 Linux/Unix/Mac/Windows，推荐选用 Linux/Unix/Mac。
> 64 bit JDK 1.8+；下载 & 配置。
> Maven 3.2.x+；下载 & 配置。

## window 安装 nacos

1. 下载nacos

   > nacos 官方网站: <https://nacos.io>

   官网Github下载 `nacos-server-2.0.3.zip`

2. 解压后启动

   启动nacos, 详见启动脚本

   ```shell
   ## 到 nacos-server-2.0.3\bin 文件夹
   cd XXXX/nacos-server-2.0.3/bin
   ## 启动nacos
   > startup.bat -m standalone
   ```

3. 访问 `http://ip:8848/nacos`到控制台页面.

   默认账号密码是  `nacos/nacos`

## docker 安装 nacos

1. 搜索可用源

   ```shell
   docker search nacos
   ```

   ![](https://gitee.com/cpfree/picture-warehouse/raw/master/devops-note/1642250731582.png)

2. pull 镜像

   ```shell
   docker pull nacos/nacos-server
   ```

3. nacos 启动

   ```shell
   # 单机模式启动, 主机IP: 8848
   docker run --env MODE=standalone --name nacos -d -p 8848:8848 nacos/nacos-server
   ```

4. 开启防火墙端口 `8848`

5. 访问控制台页面(网址, 用户, 密码参考`window安装nacos`).

## nacos 启动数据库(window环境)

事前准备一个MySQL数据库(需要是大于 5.7 版本, 否则sql脚本会执行出错)

1. 在 mysql 数据库里面建立一个 `nacos-config` 的数据库.

2. 安装包里面有一个 `/conf/nacos-mysql.sql`, 在`nacos-config`里面运行建立表.

   执行完成后如下

   ![](https://gitee.com/cpfree/picture-warehouse/raw/master/devops-note/1642255200097.png)

3. 编辑配置文件 `nacos\conf\application.properties`

   将其中的配置启用, 并修改正确的数据库

   ![](https://gitee.com/cpfree/picture-warehouse/raw/master/devops-note/1642255476805.png)

4. 启动nacos, 并访问控制台页面

## nacos 启动数据库(linux:docker环境)

> 由于环境版本不一致, 因此这部分说详细点
> 
> linux 上面已经安装了一个 mysql (非docker安装).
> 
> 现在想要docker启动生成容器后, 连接上`主机的mysql`数据库.

1. 在 mysql 数据库里面建立一个 `nacos-config` 的数据库, 并执行相关脚本

   > 该部分参考(window环境的步骤)

2. docker 重新生成容器

   docker生成容器命令如下: 注意替换掉 mysql 连接的用户名和密码.

   ```shell
   docker run \
      --env MODE=standalone \
      --env SPRING_DATASOURCE_PLATFORM=mysql \
      --env MYSQL_SERVICE_HOST=127.0.0.1   \
      --env MYSQL_SERVICE_DB_NAME=nacos-config   \
      --env MYSQL_SERVICE_DB_PARAM=characterEncoding=utf8\&connectTimeout=1000\&socketTimeout=3000\&autoReconnect=true\&useUnicode=true\&useSSL=false\&serverTimezone=UTC   \
      --env MYSQL_SERVICE_USER=XXXXX   \
      --env MYSQL_SERVICE_PASSWORD=XXXXXX   \
      --name nacos -d --net="host" nacos/nacos-server 
   ```

3. 启动nacos, 并访问控制台页面

#### docker run 命令详解.

在官网并没有找到相关docker启动配置命令, 因为版本可能不一样, 在这里说一下`docker run`命令的出处.

1. 使用 `docker run --env MODE=standalone --name nacos -d -p 8848:8848 nacos/nacos-server` 生成容器并启动.

2. 使用 `docker exec -it nacos /bin/bash` 进入 nacos 容器内部.

3. 找到 application.properties 文件

   ```shell
   # 路径
   [root@XXX conf]# pwd
   /home/nacos/conf

   # 找到 
   [root@XXX conf]# ll
   total 52
   -rw-r--r-- 1  502 games  1224 Jun 18  2021 1.4.0-ipv6_support-update.sql
   -rw-r--r-- 1 root root   2532 Jul 31 18:05 application.properties
   -rw-r--r-- 1  502 games 31156 Jul 15  2021 nacos-logback.xml
   -rw-r--r-- 1  502 games  8795 Jun 18  2021 schema.sql
   ```

4. 使用 `cat` 命令发现其中文件内容如下

   ```properties
   # spring
   server.servlet.contextPath=${SERVER_SERVLET_CONTEXTPATH:/nacos}
   server.contextPath=/nacos
   server.port=${NACOS_APPLICATION_PORT:8848}
   spring.datasource.platform=${SPRING_DATASOURCE_PLATFORM:""}
   nacos.cmdb.dumpTaskInterval=3600
   nacos.cmdb.eventTaskInterval=10
   nacos.cmdb.labelTaskInterval=300
   nacos.cmdb.loadDataAtStart=false
   db.num=${MYSQL_DATABASE_NUM:1}
   db.url.0=jdbc:mysql://${MYSQL_SERVICE_HOST}:${MYSQL_SERVICE_PORT:3306}/${MYSQL_SERVICE_DB_NAME}?${MYSQL_SERVICE_DB_PARAM:characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true&useSSL=false}
   db.url.1=jdbc:mysql://${MYSQL_SERVICE_HOST}:${MYSQL_SERVICE_PORT:3306}/${MYSQL_SERVICE_DB_NAME}?${MYSQL_SERVICE_DB_PARAM:characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true&useSSL=false}
   db.user=${MYSQL_SERVICE_USER}
   db.password=${MYSQL_SERVICE_PASSWORD}
   ### The auth system to use, currently only 'nacos' is supported:
   nacos.core.auth.system.type=${NACOS_AUTH_SYSTEM_TYPE:nacos}


   ### The token expiration in seconds:
   nacos.core.auth.default.token.expire.seconds=${NACOS_AUTH_TOKEN_EXPIRE_SECONDS:18000}

   ### The default token:
   nacos.core.auth.default.token.secret.key=${NACOS_AUTH_TOKEN:SecretKey012345678901234567890123456789012345678901234567890123456789}

   ### Turn on/off caching of auth information. By turning on this switch, the update of auth information would have a 15 seconds delay.
   nacos.core.auth.caching.enabled=${NACOS_AUTH_CACHE_ENABLE:false}
   nacos.core.auth.enable.userAgentAuthWhite=${NACOS_AUTH_USER_AGENT_AUTH_WHITE_ENABLE:false}
   nacos.core.auth.server.identity.key=${NACOS_AUTH_IDENTITY_KEY:serverIdentity}
   nacos.core.auth.server.identity.value=${NACOS_AUTH_IDENTITY_VALUE:security}
   server.tomcat.accesslog.enabled=${TOMCAT_ACCESSLOG_ENABLED:false}
   server.tomcat.accesslog.pattern=%h %l %u %t "%r" %s %b %D
   # default current work dir
   server.tomcat.basedir=
   ## spring security config
   ### turn off security
   nacos.security.ignore.urls=${NACOS_SECURITY_IGNORE_URLS:/,/error,/**/*.css,/**/*.js,/**/*.html,/**/*.map,/**/*.svg,/**/*.png,/**/*.ico,/console-fe/public/**,/v1/auth/**,/v1/console/health/**,/actuator/**,/v1/console/server/**}
   # metrics for elastic search
   management.metrics.export.elastic.enabled=false
   management.metrics.export.influx.enabled=false

   nacos.naming.distro.taskDispatchThreadCount=10
   nacos.naming.distro.taskDispatchPeriod=200
   nacos.naming.distro.batchSyncKeyCount=1000
   nacos.naming.distro.initDataRatio=0.9
   nacos.naming.distro.syncRetryDelay=5000
   nacos.naming.data.warmup=true
   ```

   > 在此处可以看出, docker 参数的传递

   如 第5行 `spring.datasource.platform=${SPRING_DATASOURCE_PLATFORM:""}`, 表示`spring.datasource.platform`的值是获取环境变量 `SPRING_DATASOURCE_PLATFORM` 得来的, 默认为 `""`, 于是就可以知道在这个地方添加一个`docker run` 环境变量参数 `--env SPRING_DATASOURCE_PLATFORM=mysql`.

5. 参考`window`安装nacos里面的`application.properties`

   ```properties
   spring.datasource.platform=mysql

   ### Count of DB:
   db.num=1

   ### Connect URL of DB:
   db.url.0=jdbc:mysql://XXXXXX:3306/nacos-config?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true&useUnicode=true&useSSL=false&serverTimezone=UTC
   db.user.0=XXXXXX
   db.password.0=XXXXXX
   ```

6. 分析 4, 5 步了解到, docker 生成容器时, 应该传入的一些参数.

   ```list
   SPRING_DATASOURCE_PLATFORM
   MYSQL_SERVICE_HOST
   MYSQL_SERVICE_DB_NAME
   MYSQL_SERVICE_DB_PARAM
   MYSQL_SERVICE_USER
   MYSQL_SERVICE_PASSWORD
   ```

7. docker run 编写时可需要注意一些问题

   1. mysql 8版本的数据库, 需要传入 `serverTimezone` 才能够正常连接上.
   2. docker 里面的语句中如果出现 `&`, `!`, `$` 之类的, 都是有特殊含义的, 如果不想被linux额外进行解释, 则前面需要加`\`转义字符.
   3. 由于`生成的容器需要访问主机安装的mysql`, 比较简单的方法就是直接使用 `--net="host"` 使得容器和主机公用一个网络, 共用网络之后, 也不需要搞端口映射之类的东西了.

   最终语句如下:

   ```shell
   docker run \
      --env MODE=standalone \
      --env SPRING_DATASOURCE_PLATFORM=mysql \
      --env MYSQL_SERVICE_HOST=127.0.0.1   \
      --env MYSQL_SERVICE_DB_NAME=nacos-config   \
      --env MYSQL_SERVICE_DB_PARAM=characterEncoding=utf8\&connectTimeout=1000\&socketTimeout=3000\&autoReconnect=true\&useUnicode=true\&useSSL=false\&serverTimezone=UTC   \
      --env MYSQL_SERVICE_USER=XXXXX   \
      --env MYSQL_SERVICE_PASSWORD=XXXXXX   \
      --name nacos -d --net="host" nacos/nacos-server
   ```

   > 注意: 无论是将参数直接通过docker 传入, 还是直接加 `--net="host"` 都是不安全的, 如果要求高的化, 最好采用其它docker 配置.

## 配置

### nacos 修改密码

#### 1. 直接在页面上面改密码即可

   这种方式最安全, 如果忘了密码, 可以直接将密码刷回初始密码.

   ![](https://gitee.com/cpfree/picture-warehouse/raw/master/devops-note/1642254457718.png)

   ![](https://gitee.com/cpfree/picture-warehouse/raw/master/devops-note/1642254468634.png)

### 2. 通过修改数据库User表记录修改密码

> 有时候, 密码忘了, 可以使用这种方式, 将密码修改成你想要的

1. 计算nacos密码()

   要想修改nacos密码, 需要使用 `spring-boot-starter-security` 的一个编码

2. 引入 pom

   ```xml
   <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-security</artifactId>
   </dependency>
   ```

3. 编写java文件, 计算编码

   ```java
   import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

   public class Nacos {

      /**
      * @param args 修改 nacos 密码
      */
      public static void main(String[] args) {
         final String nacosPass = new BCryptPasswordEncoder().encode("cpf@>3j349");
         System.out.println(nacosPass);
      }

   }
   ```

4. 运行 java 文件, 生成密钥

   > 注意 `BCryptPasswordEncoder` 每次生成的算码都不一样.

   ```java
   $2a$10$oQe5NEQo/SrRWYNsiFrf1upxwWFKfWTDRXSuMW8/41CpQaP3zaGq2

   Process finished with exit code 0
   ```

5. 直接去数据库里面改表.

   ![](https://gitee.com/cpfree/picture-warehouse/raw/master/devops-note/1642338260428.png)

6. 登录 `nacos`
