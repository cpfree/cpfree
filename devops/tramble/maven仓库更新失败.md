# maven 仓库更新失败

## 在pom文件中增加

```xml
	<repositories>
	    <repository>
	        <id>maven-ali</id>
	        <url>http://maven.aliyun.com/nexus/content/repositories/central</url>
	        <releases>
	            <enabled>true</enabled>
	        </releases>
	        <snapshots>
	            <enabled>true</enabled>
	            <updatePolicy>always</updatePolicy>
	            <checksumPolicy>fail</checksumPolicy>
	        </snapshots>
	    </repository>
	</repositories>
```


## jar包更新失败

### 1. 确定maven配置是否正确，

setting.xml 文件， 一个是maven安装目录的setting.xml的镜像配置, 一个是user目录下的仓库配置, 同时还有一个IDEA自带的Maven, 看下是自己配置否弄错了.

### 1. 确定中央仓库存在相关文件, 因为可能是maven远程中央仓库出现了问题

1. 确定 中心仓库源是否正常， maven中央仓库地址： https://mvnrepository.com/repos/central

   > 7月12号阿里云的maven中心出现异常

2. 到中心仓库确定是否能够正确访问和下载到相关jar包

   例如一个spring的jar, 那么他的html下载位置就是大概如下

   https://mvnrepository.com/repos/central/org.springframework.....

### 1. 到本地maven仓库删除掉相关目录, 重新进行clean install

如果maven仓库能够正确下载jar, 那么看下本地的maven是否出现文件错误, 删掉本地文件, 重新下载看下是否正常

### 1. 确定maven插件是否正常

1. 新建一个空文件夹, 里面放一个pom文件, 如下

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <project xmlns="http://maven.apache.org/POM/4.0.0"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
      <modelVersion>4.0.0</modelVersion>

      <groupId>com.github.cosycode</groupId>
      <artifactId>common-lang</artifactId>
      <version>1.4-SNAPSHOT</version>
      <packaging>jar</packaging>

      <name>common-lang</name>
      <description>A more powerful tool class based on org.apache.commons:commons-lang3</description>
      <url>http://github.com/cosycode/common-lang.git</url>

      <dependencies>
         <dependency>
               <groupId>org.apache.commons</groupId>
               <artifactId>commons-lang3</artifactId>
               <version>3.11</version>
         </dependency>
         <dependency>
               <groupId>org.slf4j</groupId>
               <artifactId>slf4j-api</artifactId>
               <version>1.7.30</version>
         </dependency>
         <dependency>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-source-plugin</artifactId>
            <version>3.0.0</version>
         </dependency>
      </dependencies>
   </project>
   ```

2. 打开命令行窗口, 输入如下命令

   ```
   mvn install
   ```

   如果maven仓库能够下载成功, 则说明maven下载没有问题

   如果下载失败, 则说明maven插件或者中央仓库出现了问题



