# 将jar上传至maven仓库

参考url: <https://blog.csdn.net/qq_29994609/article/details/82705932>


## 一、JIRA 账号准备

1. 注册sonatype 账号: <https://issues.sonatype.org/>
2. 新建一个“Project ticket”.
3. 填写工单内容
4. 等待审核
5. 当页面上审核状态（Status）为resolved时，才可以向中央仓库提交jar包。

> 参考如下
> 
> com.github.cosycode: <https://issues.sonatype.org/browse/OSSRH-62503>
>
> ![](https://gitee.com/cpfree/picture-warehouse/raw/master/pic/20210722172238.png)

## 二、Maven `/home/.m2/settings.xml` 配置JIRA的账号和密码

```xml
<settings>
  <servers>
    <server>
      <id>snapshots</id>
      <username>你的用户名</username>
      <password>你的密码</password>
    </server>
    <server>
      <id>releases</id>
      <username>你的用户名</username>
      <password>你的密码</password>
    </server>
  </servers>
</settings>
```

## 三、gpg相关配置(window)

1. 安装 gpg 程序

   - 方案1: 到 <https://www.gnupg.org/download/index.html> 下载安装 GnuPG 程序
   - 方案2: 如果window有安装git, 直接使用git中的 GunPG 程序即可, 也就是将git目录下的bin加入到环境变量即可.

2. 生成 gpg 密钥

   ```shell
   # 生成 gpg 密钥
   > gpg --gen-key
   # 查看 密钥
   > gpg --list-keys
   ```

3. 上传 gpg 密钥

   > 一个国内公钥服务器(公钥服务器之间会自动同步): <keyserver.ubuntu.com>

   ```shell
   # 上传公钥
   > gpg --keyserver hkp://keyserver.ubuntu.com --send-keys [公钥ID]
   ```

   密钥其它操作

   ```shell
   # 验证公钥
   > gpg --keyserver hkp://keyserver.ubuntu.com --recv-keys [公钥ID]

   # 导出公钥
   > gpg --armor --output public-key --export [用户ID]
   # 导出私钥
   > gpg --armor --output private-key --export-secret-keys [用户ID]

   # 导入密钥
   > gpg --import [密钥文件]
   # 从公钥服务器导入公钥
   > gpg --keyserver hkp://subkeys.pgp.net --search-keys [用户ID]

   # 删除私钥
   > gpg --delete-secret-keys [用户uid]
   # 删除公钥
   > gpg --delete-keys [用户uid]
   ```

## 四、Maven-pom.xml文件整理准备

1. POM中完善name、description、url、license、scm、developer的信息
   
   ```xml
   <name>common-lang</name>
   <description>A more powerful tool class based on org.apache.commons:commons-lang3</description>
   <url>http://github.com/cosycode/common-lang.git</url>

   <licenses>
      <license>
         <name>The Apache Software License, Version 2.0</name>
         <url>http://www.apache.org/licenses/LICENSE-2.0.txt</url>
         <distribution>repo</distribution>
      </license>
   </licenses>

   <scm>
      <connection>scm:git:git://github.com/cosycode/common-lang.git</connection>
      <developerConnection>scm:git:ssh://github.com:cosycode/common-lang.git</developerConnection>
      <url>http://github.com/cosycode/common-lang</url>
   </scm>

   <developers>
      <developer>
         <name>sinjar.chen</name>
         <email>sinjar.chen@qq.com</email>
         <timezone>+8</timezone>
      </developer>
   </developers>
   ```

2. 配置distributionManagement

   ```xml
   <distributionManagement>
         <snapshotRepository>
            <id>oss</id>
            <url>https://oss.sonatype.org/content/repositories/snapshots/</url>
         </snapshotRepository>
         <repository>
            <id>oss</id>
            <url>https://oss.sonatype.org/service/local/staging/deploy/maven2/</url>
         </repository>
   </distributionManagement>
   ```

3. 配置maven 插件, source, Javadoc, GPG 加密插件

   > 下面的配置示例将 `distributionManagement` 也加入了进去.

   ```xml
   <profiles>
      <profile>
         <id>release</id>
         <build>
               <plugins>
                  <!-- Source -->
                  <plugin>
                     <groupId>org.apache.maven.plugins</groupId>
                     <artifactId>maven-source-plugin</artifactId>
                     <version>2.1.2</version>
                     <executions>
                           <execution>
                              <phase>package</phase>
                              <goals>
                                 <goal>jar-no-fork</goal>
                              </goals>
                           </execution>
                     </executions>
                  </plugin>
                  <!-- Javadoc -->
                  <plugin>
                     <groupId>org.apache.maven.plugins</groupId>
                     <artifactId>maven-javadoc-plugin</artifactId>
                     <version>2.9.1</version>
                     <configuration>
                           <show>private</show>
                           <nohelp>true</nohelp>
                           <charset>UTF-8</charset>
                           <encoding>UTF-8</encoding>
                           <docencoding>UTF-8</docencoding>
                           <additionalparam>-Xdoclint:html,syntax,accessibility,reference</additionalparam>
                           <!-- <additionalparam>-Xdoclint:none</additionalparam> -->
                     </configuration>
                     <executions>
                           <execution>
                              <phase>package</phase>
                              <goals>
                                 <goal>jar</goal>
                              </goals>
                           </execution>
                     </executions>
                  </plugin>
                  <!-- GPG -->
                  <plugin>
                     <groupId>org.apache.maven.plugins</groupId>
                     <artifactId>maven-gpg-plugin</artifactId>
                     <version>1.6</version>
                     <executions>
                           <execution>
                              <id>sign-artifacts</id>
                              <phase>verify</phase>
                              <goals>
                                 <goal>sign</goal>
                              </goals>
                           </execution>
                     </executions>
                  </plugin>
               </plugins>
         </build>
         <distributionManagement>
               <snapshotRepository>
                  <id>oss</id>
                  <url>https://oss.sonatype.org/content/repositories/snapshots/</url>
               </snapshotRepository>
               <repository>
                  <id>oss</id>
                  <url>https://oss.sonatype.org/service/local/staging/deploy/maven2/</url>
               </repository>
         </distributionManagement>
      </profile>
   </profiles>
   ```

## 五、部署发布配置

发布命令: `mvn clean deploy`

- 发布snapshot版本
   
   修改version，并加上`-SNAPSHOT`后缀

   > 注意：snapshot版本提交时，并不需要gpg签名，直接提交即可。

- 发布release版本

   修改version，确保没有`-SNAPSHOT`后缀

   > 注意：snapshot版本提交时，release版本提交时，需要gpg签名。

## 六、登录sonatype执行发布操作

1. 登录页面查看发布的`artifect`
   
   登录 <https://oss.sonatype.org/>, 选择`stagingRepositories`, 也可以直接打开<https://oss.sonatype.org/#stagingRepositories>
   在仓库中可以看到已经发布的版本

2. 验证
   
   查看你所提交的Repository。

   勾选需要sonatype验证的Repository，点击菜单栏的Close。

   在下方状态栏中（Activity）可以看见sonatype正在执行验证，并且会实时的显示验证结果

   该过程大概1,2分钟

3. 发布

   当验证完成后！

   查看你所提交的Repository。

   勾选需要sonatype发布的Repository，点击菜单栏的Release。

   在下方状态栏中（Activity）可以看见sonatype正在执行发布，并且会实时的显示验证结果

4. 验证

   整个Repository消失后，表示发布成功，
   
   过一段时间后，中央仓库会从sonatype仓库同步。

   之后大概1,2个小时就可以在仓库中找到了。

> sonatype-snapshots仓库地址：<https://oss.sonatype.org/content/repositories/snapshots/>
> sonatype-releases仓库地址：<https://oss.sonatype.org/content/repositories/releases/>
> 中央仓库地址: <http://mvnrepository.com/>
