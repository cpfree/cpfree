---
keys: maven
type: copy
url: <https://www.cnblogs.com/gengaixue/p/6933773.html>, <https://my.oschina.net/sunchp/blog/100634>
id: 220124-141952
---

# Maven仓库

## 仓库介绍

![](https://gitee.com/cpfree/picture-warehouse/raw/master/pic1/20210713230913.png)

Maven仓库主要有2种：

   `remote repository`：相当于公共的仓库，大家都能访问到，一般可以用URL的形式访问

   `local repository`：存放在本地磁盘的一个文件夹，例如，windows上默认是C:\Users\｛用户名｝\.m2\repository目录

> repository里存放的都是各种jar包和maven插件。当向仓库请求插件或依赖的时候，会先检查`local repository`，如果`local repository`有则直接返回，否则会向`remote repository`请求，并缓存到`local repository`。也可以把做的东西放到本地仓库，仅供本地使用；或上传到远程仓库，供大家使用。 

### `Remote Repository`

`Remote Repository`主要有3种：

   - 中央仓库：http://repo1.maven.org/maven2/ 
   - 私服：内网自建的maven repository，其URL是一个内部网址 
   - 其他公共仓库：其他可以互联网公共访问`maven repository`，例如 jboss repository等

### `local repository`

2. Maven缺省的本地仓库地址为 `${user.home}/.m2/repository` 。也就是说，一个用户会对应的拥有一个本地仓库。

   自定义本地仓库的位置方法:

   1. 修改`${user.home}/.m2/settings.xml` 

      `settings.xml`相关配置如下

      ```xml
      <localRepository>D:programming/resource/.m2/repository</localRepository>
      ```

   2. 运行时指定本地仓库位置：

      ```shell
      mvn clean install -Dmaven.repo.local=D:programming/resource/.m2/repository
      ```

### Maven中央仓库

   `3.xx`版本的 maven 安装目录下的：`/lib/maven-model-builder-${version}.jar` 中有一个超级POM：`\org\apache\maven\model\pom-4.0.0.xml` ，它是所有Maven POM的父POM，所有Maven项目继承该配置，你可以在这个POM中发现如下配置：

   ```xml
   <repositories>
      <repository>
         <id>central</id>
         <name>Central Repository</name>
         <url>https://repo.maven.apache.org/maven2</url>
         <layout>default</layout>
         <snapshots>
            <enabled>false</enabled>
         </snapshots>
      </repository>
   </repositories>
   ```

   > 这里我们只要知道，中央仓库的id为central，远程url地址为http://repo.maven.apache.org/maven2，它关闭了snapshot版本构件下载的支持。

   中央仓库有时可能会遇到流量大的问题，所以人们已经镜像了它到几个地方。同时你可以在`setting.xml`配置文件里,或者pom.xml文件中配置远程仓库url

## 配置远程仓库url

### pom文件中配置仓库示例 repositories & pluginRepositories

要为某个项目单独配置远程仓库则可以参考 `repositories` & `pluginRepositories` 这两个属性

> 关于<repositories>的更详细的配置及相关解释，请参考：<http://www.sonatype.com/books/maven-book/reference_zh/apas02s08.html>

```xml
<project>
  <repositories>
    <!-- 每个<repository>都有它唯一的ID，一个描述性的name，以及最重要的，远程仓库的url -->
    <repository>
      <id>maven-net-cn</id>
      <name>Maven China Mirror</name>
      <url>http://maven.net.cn/content/groups/public/</url>
      <!-- 禁止从公共仓库下载snapshot构件是推荐的做法，因为这些构件不稳定，且不受你控制，你应该避免使用。 -->
      <releases>
        <!-- 告诉Maven 可以 从这个仓库下载releases版本的构件 -->
        <enabled>true</enabled>
      </releases>
      <snapshots>
        <!-- 告诉Maven 不可以 从这个仓库下载snapshot版本的构件 -->
        <enabled>false</enabled>
      </snapshots>
    </repository>
  </repositories>

  <!-- pluginRepositories 是配置Maven从什么地方下载插件构件（Maven的所有实际行为都由其插件完成）。该元素的内部配置和<repository>完全一样 -->
  <pluginRepositories>
    <pluginRepository>
      <id>maven-net-cn</id>
      <name>Maven China Mirror</name>
      <url>http://maven.net.cn/content/groups/public/</url>
      <releases>
        <enabled>true</enabled>
      </releases>
      <snapshots>
        <enabled>false</enabled>
      </snapshots>    
    </pluginRepository>
  </pluginRepositories>
</project>
```

### 在settings.xml中配置远程仓库地址

在每个项目的`pom.xml`文件中配置 `repositories`, `pluginRepositories`是很麻烦的, 我们可以直接配置在 `settings.xml` 中, 这样的话就可以用户级全局生效.

setting.xml不直接支持`<repositories>`及`<pluginRepositories>`元素 这两个元素。但我们还是有一个并不复杂的解决方案，就是利用profile，如下：使用profile为settings.xml添加仓库提供了一种用户全局范围的仓库配置。

   ```xml
   <settings>

   <profiles>
      <profile>
         <id>dev</id>
         <!-- repositories and pluginRepositories here-->
      </profile>
   </profiles>
   <activeProfiles>
      <activeProfile>dev</activeProfile>
   </activeProfiles>

   </settings>
   ```

### `setting.xml` mirror 拦截器

mirror相当于一个拦截器，它会拦截maven对remote repository的相关请求，把请求里的remote repository地址，重定向到mirror里配置的地址。

   ```xml
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
      <!-- 这里覆盖了Maven自带的central -->
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
   ```

#### mirrorOf

mirrorOf相同的镜像，配置多了没任何作用，只会选取第一个。

`<mirrorOf></mirrorOf>`标签里面放置的是要被镜像的`Repository ID`。为了满足一些复杂的需求，Maven还支持更高级的镜像配置： 

`<mirrorOf>*</mirrorOf>`: 匹配所有远程仓库。 
`<mirrorOf>repo1,repo2</mirrorOf>`: 匹配仓库repo1和repo2，使用逗号分隔多个远程仓库。 
`<mirrorOf>*,!repo1</miiroOf>`: 匹配所有远程仓库，repo1除外，使用感叹号将仓库从匹配中排除。 

### setting 范例


```xml

<settings>
   <mirrors>
      <!-- mirrorOf相同的镜像，配置多了没任何作用，只会选取第一个。-->
      <mirror>
         <id>alimaven</id>
         <mirrorOf>alimaven</mirrorOf>
         <name>aliyun maven</name>
         <url>https://maven.aliyun.com/repository/public/</url>
      </mirror> 
      
      <!-- 中央仓库1 -->
      <mirror>
         <id>repo1</id>
         <mirrorOf>repo1</mirrorOf>
         <name>Human Readable Name for this Mirror.</name>
         <url>https://repo1.maven.org/maven2</url>
      </mirror>
   </mirrors>

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
		
         <repositories>
            <!-- 每个<repository>都有它唯一的ID，一个描述性的name，以及最重要的，远程仓库的url -->
            <repository>
               <id>alimaven</id>
               <name>aliyun-mirror</name>
               <!-- 禁止从公共仓库下载snapshot构件是推荐的做法，因为这些构件不稳定，且不受你控制，你应该避免使用。 -->
               <releases>
                  <!-- 告诉Maven 可以 从这个仓库下载releases版本的构件 -->
                  <enabled>true</enabled>
               </releases>
               <snapshots>
                  <!-- 告诉Maven 不可以 从这个仓库下载snapshot版本的构件 -->
                  <enabled>false</enabled>
               </snapshots>
            </repository>
            <repository>
               <id>repo1</id>
               <name>Maven repo1</name>
               <releases>
                  <enabled>true</enabled>
               </releases>
               <snapshots>
                  <enabled>false</enabled>
               </snapshots>
            </repository>
         </repositories>

         <!-- pluginRepositories 是配置Maven从什么地方下载插件构件（Maven的所有实际行为都由其插件完成）。该元素的内部配置和<repository>完全一样 -->
         <pluginRepositories>
            <pluginRepository>
               <id>alimaven</id>
               <name>aliyun-mirror</name>
               <releases>
                  <enabled>true</enabled>
               </releases>
               <snapshots>
                  <enabled>false</enabled>
               </snapshots>
            </pluginRepository>
            <pluginRepository>
               <id>repo1</id>
               <name>Maven repo1</name>
               <releases>
                  <enabled>true</enabled>
               </releases>
               <snapshots>
                  <enabled>false</enabled>
               </snapshots>
            </pluginRepository>
         </pluginRepositories>
      </profile>
  </profiles>

  <activeProfiles>
    <activeProfile>default</activeProfile>
  </activeProfiles>
</settings>

```