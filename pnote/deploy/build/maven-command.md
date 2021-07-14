# maven 必备知识技巧

1. 当我们运行install的时候，Maven实际上是将项目生成的构件安装到了本地仓库，也就是说，只有install了之后，其它项目才能使用此项目生成的构件。

## maven version

3.6.3

## 编译的时候跳过测试

方式1：用命令带上参数

`mvn install -Dmaven.test.skip=true`

方式2：在pom.xml里面配置

```xml
    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-surefire-plugin</artifactId>
                <configuration>
                    <skip>true</skip>
                </configuration>
            </plugin>
        </plugins>
    </build>
```

## dependencyManagement

## 仓库

照例来说, 相对于多用户的PC机而言，在Maven安装目录的conf子目录下面的settings.xml才是真正的全局的配置。而用户目录的.m2子目录下面的settings.xml的配置只是针对当前用户的。当这两个文件同时存在的时候，那么对于相同的配置信息用户目录下面的settings.xml中定义的会覆盖Maven安装目录下面的settings.xml中的定义。用户目录下的settings.xml文件一般是不存在的，但是Maven允许我们在这里定义我们自己的settings.xml，如果需要在这里定义我们自己的settings.xml的时候就可以把Maven安装目录下面的settings.xml文件拷贝到用户目录的.m2目录下，然后改成自己想要的样子。

但是在有些软件的使用过程中, 如果不在

```xml
<?xml version="1.0" encoding="UTF-8"?>

<!--
 | This is the configuration file for Maven. It can be specified at two levels:
 |
 |  1. User Level. This settings.xml file provides configuration for a single user,
 |                 and is normally provided in ${user.home}/.m2/settings.xml.
 |
 |                 NOTE: This location can be overridden with the CLI option:
 |
 |                 -s /path/to/user/settings.xml
 |
 |  2. Global Level. This settings.xml file provides configuration for all Maven
 |                 users on a machine (assuming they're all using the same Maven
 |                 installation). It's normally provided in
 |                 ${maven.conf}/settings.xml.
 |
 |                 NOTE: This location can be overridden with the CLI option:
 |
 |                 -gs /path/to/global/settings.xml
 |
 | The sections in this sample file are intended to give you a running start at
 | getting the most out of your Maven installation. Where appropriate, the default
 | values (values used when the setting is not specified) are provided.
 |
 |-->
<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0 http://maven.apache.org/xsd/settings-1.0.0.xsd">
  <!-- localRepository
   | The path to the local repository maven will use to store artifacts.
   |
   | Default: ${user.home}/.m2/repository
  <localRepository>/path/to/local/repo</localRepository>
  -->
  <localRepository>D:\programing\Resource\.m2\repository</localRepository>

  <!-- interactiveMode
   | This will determine whether maven prompts you when it needs input. If set to false,
   | maven will use a sensible default value, perhaps based on some other setting, for
   | the parameter in question.
   |
   | Default: true
  <interactiveMode>true</interactiveMode>
  -->

  <!-- offline
   | Determines whether maven should attempt to connect to the network when executing a build.
   | This will have an effect on artifact downloads, artifact deployment, and others.
   |
   | Default: false
  <offline>false</offline>
  -->

  <!-- pluginGroups
   | This is a list of additional group identifiers that will be searched when resolving plugins by their prefix, i.e.
   | when invoking a command line like "mvn prefix:goal". Maven will automatically add the group identifiers
   | "org.apache.maven.plugins" and "org.codehaus.mojo" if these are not already contained in the list.
   |-->
  <pluginGroups>
    <!-- pluginGroup
     | Specifies a further group identifier to use for plugin lookup.
    <pluginGroup>com.your.plugins</pluginGroup>
    -->
  </pluginGroups>

  <!-- proxies
   | This is a list of proxies which can be used on this machine to connect to the network.
   | Unless otherwise specified (by system property or command-line switch), the first proxy
   | specification in this list marked as active will be used.
   |-->
  <proxies>
    <!-- proxy
     | Specification for one proxy, to be used in connecting to the network.
     |
    <proxy>
      <id>optional</id>
      <active>true</active>
      <protocol>http</protocol>
      <username>proxyuser</username>
      <password>proxypass</password>
      <host>proxy.host.net</host>
      <port>80</port>
      <nonProxyHosts>local.net|some.host.com</nonProxyHosts>
    </proxy>
    -->
  </proxies>

  <!-- servers
   | This is a list of authentication profiles, keyed by the server-id used within the system.
   | Authentication profiles can be used whenever maven must make a connection to a remote server.
   |-->
  <servers>
    <!-- server
     | Specifies the authentication information to use when connecting to a particular server, identified by
     | a unique name within the system (referred to by the 'id' attribute below).
     |
     | NOTE: You should either specify username/password OR privateKey/passphrase, since these pairings are
     |       used together.
     |
    <server>
      <id>deploymentRepo</id>
      <username>repouser</username>
      <password>repopwd</password>
    </server>
    -->

    <!-- Another sample, using keys to authenticate.
    <server>
      <id>siteServer</id>
      <privateKey>/path/to/private/key</privateKey>
      <passphrase>optional; leave empty if not used.</passphrase>
    </server>
    -->
    <server>
      <id>releases</id>
      <username>deployment</username>
      <password>deployment123</password> <!-- impossible password here :-) -->
    </server>
    <server>
      <id>snapshots</id>
      <username>deployment</username>
      <password>deployment123</password> <!-- impossible password here :-) -->
    </server>
    <server>
      <id>nexus</id>
      <username>deployment</username>
      <password>deployment123</password> <!-- impossible password here :-) -->
    </server>
    <server>
      <id>thirdparty</id>
      <username>deployment</username>
      <password>deployment123</password> <!-- impossible password here :-) -->
    </server>
    <server>
        <id>oss</id>
        <username>sinyer</username>
        <password>CPF@niliu4823</password>
    </server>
  </servers>

  <!-- mirrors
   |这是用于从远程存储库下载工件的镜像列表。
   |
   |它是这样工作的：一个 POM 可以声明一个存储库，用于解析某些工件。然而，这个存储库有时可能会遇到流量大的问题，所以人们已经镜像了它到几个地方。
   |
   |该存储库定义将具有唯一的 ID，因此我们可以为其创建镜像引用存储库，用作备用下载站点。镜像站点将是首选该存储库的服务器。
   |--> 
  <mirrors>
  
    <!-- mirrorOf相同的镜像，配置多了没任何作用，只会选取第一个。-->

    <!-- 阿里云仓库 -->
    <mirror>
      <id>alimaven</id>
      <mirrorOf>central</mirrorOf>
      <name>aliyun maven</name>
      <url>http://maven.aliyun.com/nexus/content/groups/public/</url>
    </mirror>

    <!-- 凯美瑞德仓库 -->
    <mirror>
      <id>nexus</id>
      <mirrorOf>kmerit</mirrorOf>
      <name>Nexus</name>
	    <url>http://172.16.10.120:8081/nexus/content/groups/public/</url>
    </mirror>

    <!-- 中央仓库1 -->
    <mirror>
        <id>repo1</id>
        <mirrorOf>repo1</mirrorOf>
        <name>Human Readable Name for this Mirror.</name>
        <url>http://repo1.maven.org/maven2/</url>
    </mirror>

    <!-- 中央仓库2 -->
    <mirror>
        <id>repo2</id>
        <mirrorOf>repo2</mirrorOf>
        <name>Human Readable Name for this Mirror.</name>
        <url>http://repo2.maven.org/maven2/</url>
    </mirror>
    
  </mirrors>

  <!-- profiles
   | 这是一个配置文件列表，可以通过多种方式激活，并且可以修改构建过程。 settings.xml 中提供的配置文件旨在提供本地机器-允许构建在本地环境中工作的特定路径和存储库位置。
   |
   |例如，如果你有一个集成测试插件——比如仙人掌——它需要知道在哪里您的 Tomcat 实例已安装，您可以在此处提供一个变量，以便该变量为在构建过程中取消引用以配置仙人掌插件。
   |
   |如上所述，可以通过多种方式激活配置文件。一种方式 -activeProfiles本文档的部分 (settings.xml) -稍后将讨论。另一种方式本质上依赖于系统属性的检测，或者匹配属性的特定值，
   |或者只是测试它的存在。配置文件也可以通过 JDK 版本前缀激活，其中在“1.4.2_07”的 JDK 版本上执行构建时，“1.4”的值可能会激活配置文件。最后，可以直接从命令行指定活动配置文件列表。
   |
   |注意：对于 settings.xml 中定义的配置文件，您只能指定工件存储库、插件存储库和用作配置的自由格式属性 POM 中插件的变量。
   |
   |--> 
  <profiles>
    <profile>
        <id>default</id>
        <activation>
          <activeByDefault>true</activeByDefault>
          <jdk>1.8</jdk>
        </activation>

        <properties>
          <maven.compiler.source>1.8</maven.compiler.source>
          <maven.compiler.target>1.8</maven.compiler.target>
          <maven.compiler.compilerVersion>1.8</maven.compiler.compilerVersion>
        </properties>
    </profile>
  </profiles>

  <!-- activeProfiles
   | List of profiles that are active for all builds.
   |
  <activeProfiles>
    <activeProfile>alwaysActiveProfile</activeProfile>
    <activeProfile>anotherAlwaysActiveProfile</activeProfile>
  </activeProfiles>
  -->
  <activeProfiles>
    <activeProfile>default</activeProfile>
  </activeProfiles>
</settings>

```


```xml
<repositories>
   <repository>
      <id>central11</id>
      <name>public</name>
      <url>http://172.16.10.91:8081/nexus/content/groups/public/</url>
   </repository>
   <repository>
      <id>3rd</id>
      <name>3rd</name>
      <url>http://172.16.10.91:8081/nexus/content/repositories/thirdparty/</url>
   </repository>
</repositories>

<pluginRepositories>
   <pluginRepository>
      <id>central</id>
      <name>public</name>
      <url>http://172.16.10.91:8081/nexus/content/groups/public/</url>
      <releases>
         <updatePolicy>always</updatePolicy>
      </releases>
      <snapshots>
         <enabled>false</enabled>
      </snapshots>
   </pluginRepository>

   <pluginRepository>
      <id>3rd</id>
      <name>3rd</name>
      <url>http://172.16.10.91:8081/nexus/content/repositories/thirdparty/</url>
      <releases>
         <updatePolicy>always</updatePolicy>
      </releases>
      <snapshots>
         <enabled>false</enabled>
      </snapshots>
   </pluginRepository>

</pluginRepositories>


<distributionManagement>
   <repository>
      <id>releases</id>
      <name>kmip release repository</name>
      <url>http://172.16.10.91:8081/nexus/content/repositories/releases</url>
   </repository>
   <snapshotRepository>
      <id>snapshots</id>
      <name>kmip snapshot repository</name>
      <url>http://172.16.10.91:8081/nexus/content/repositories/snapshots/</url>
   </snapshotRepository>
</distributionManagement>
```

## package | install | deploy 区别

`mvn command1 command2 ...` 

相当于

```shell
mvn command1
mvn command2
mvn ...
```

`mvn clean package`: 依次执行了clean、resources、compile、testResources、testCompile、test、jar|war(打包)等７个阶段。
`mvn clean install`: 依次执行了clean、resources、compile、testResources、testCompile、test、jar|war(打包)、install等8个阶段。
`mvn clean deploy`: 依次执行了clean、resources、compile、testResources、testCompile、test、jar|war(打包)、install、deploy等９个阶段。

`package`: 完成了项目编译、单元测试、打包功能，但没有把打好的可执行jar包（war包或其它形式的包）布署到本地maven仓库和远程maven私服仓库
`install`: 完成了项目编译、单元测试、打包功能，同时把打好的可执行jar包（war包或其它形式的包）布署到本地maven仓库，但没有布署到远程maven私服仓库
`deploy`: 完成了项目编译、单元测试、打包功能，同时把打好的可执行jar包（war包或其它形式的包）布署到本地maven仓库和远程maven私服仓库
