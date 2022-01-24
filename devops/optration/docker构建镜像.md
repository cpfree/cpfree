# docker 构建镜像

## 实例环境信息

```info
frame: springBoot-2.5.6
JDK: 1.8
Maven: 3.6.0
Docker: 20.10.5
```

## 简单构建

1. 修改项目 `pom.xml` 文件的build

   ```xml
   <build>
      <plugins>
         <plugin>
               <groupId>org.springframework.boot</groupId>
               <artifactId>spring-boot-maven-plugin</artifactId>
               <version>2.5.6</version>
               <configuration>
                  <layers>
                     <enabled>true</enabled>
                  </layers>
               </configuration>
         </plugin>
      </plugins>
   </build>
   ```

2. 使用 maven 进行打包, 将工程打成 jar 包

   - 使用打包命令建议使用 `mvn clean package -U -DskipTests`

   > maven 里面比较好的命令会比较复杂些
   > `-U` 参数： 该参数能强制让Maven检查所有SNAPSHOT依赖更新，确保集成基于最新的状态，如果没有该参数，Maven默认以天为单位检查更新，而持续集成的频率应该比这高很多。
   > `-e` 参数：如果构建出现异常，该参数能让Maven打印完整的stack trace，以方便分析错误原因。

   - 打一个也好, 打多个也行, 反正是需要可以使用 `java -jar` 命令能够将 jar 运行起来

   ![](https://gitee.com/cpfree/picture-warehouse/raw/master/devops-note/1642937486219.png)

3. 检查 jar

   - 打好包后, jar包的 `BOOT-INF` 文件夹里面应该有 `classpath.idx` 和 `layers.idx` 文件

      ![](https://gitee.com/cpfree/picture-warehouse/raw/master/devops-note/1642937624499.png)

   - 在 jar 所在文件夹执行 `java -Djarmode=layertools -jar web-boot-0.0.1-SNAPSHOT.jar list`, 应该会输出以下新息.

      ![](https://gitee.com/cpfree/picture-warehouse/raw/master/devops-note/1642938529253.png)

4. 编写 `Dockerfile` 文件

   ```shell
   # 指定基础镜像，这是分阶段构建的前期阶段
   FROM java:8 as builder
   # 执行工作目录
   WORKDIR application
   # 配置参数
   ARG JAR_FILE=./*.jar
   # 将编译构建得到的jar文件复制到镜像空间中
   COPY ${JAR_FILE} application.jar
   # 通过工具 spring-boot-jarmode-layertools 从 application.jar 中提取拆分后的构建结果
   RUN java -Djarmode=layertools -jar application.jar extract

   # 正式构建镜像
   FROM java:8
   # 执行工作目录
   WORKDIR application
   # 前一阶段从jar中提取除了多个文件，这里分别执行COPY命令复制到镜像空间中，每次COPY都是一个layer
   COPY --from=builder application/dependencies/ ./
   COPY --from=builder application/spring-boot-loader/ ./
   COPY --from=builder application/snapshot-dependencies/ ./
   COPY --from=builder application/application/ ./
   # 直接指定运行的main方法
   ENTRYPOINT ["java", "org.springframework.boot.loader.JarLauncher"]
   ```

   - 上面的参数 `java:8`, 指定了构建的镜像, docker 在打包的时候, 会先下载 `java:8` 的相关镜像文件, 根据项目版本, 可以指定其他的参数, 如 `openjdk:8`, `openjdk:8u212-jdk-stretch`
   - `WORKDIR application` 使用 WORKDIR 指令可以来指定工作目录（或者称为当前目录），以后各层的当前目录就被改为指定的目录，如该目录不存在，WORKDIR 会帮你建立目录。这个直接指定为 `application` 即可, 外面并不需要有 `application` 这个文件夹, 
   - `ARG` 就是构建一个变量, 如果你是在打好的 `jar` 所在文件夹执行 docker 命令, 则直接使用`./*.jar`就好.
   - COPY: 配合上面的 `ARG JAR_FILE=./*.jar`, 把当前文件夹里面的所有 jar 全部添加到 `application.jar` 里面

5. 构建 docker 镜像

   ```shell
   # 构建 docker 镜像
   # 注意最后有一个 `.`, 表示从当前文件夹里面构建镜像. 
   docker build -t web-boot:v0.0.1 .
   ```

   打印以下新息则构建成功

   ![](https://gitee.com/cpfree/picture-warehouse/raw/master/devops-note/1642939617923.png)

6. 使用 `docker images` 查看成功构建的镜像.

   ![](https://gitee.com/cpfree/picture-warehouse/raw/master/devops-note/1642939971322.png)

7. 使用 `docker run` 命令运行镜像

   ```shell
   docker run --name web-boot-01 -d --net="host" web-boot
   ```
   
   > `web-boot` 访问了mysql, 以及 redis 等多个中间件, 端口为 `8080`, 为了方便直接使用 `--net="host"` 了

   访问 `ip:8080` 端口, 测试成功, 运行正常.


