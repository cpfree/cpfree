# maven-install

1. 下载 maven 最新版
2. 配置环境变量 `vi /etc/profile`

   ```shell
   # 根据实际情况添加，注意Path路径
   export JAVA_HOME=/usr/local/java/jdk1.7.0_67
   export M2_HOME=/usr/local/apache-maven-3.3.9
   export PATH=$PATH:$JAVA_HOME/bin:$M2_HOME/bin
   export CLASSPATH=.:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar:$JAVA_HOME/jre/lib/rt.jar
   ```

3. 验证
   `source /etc/profile` 测试一下安装是否成功:`mvn -v`

4. 配置镜像资源， 以及本地仓库路径

   打开安装maven的setting文件， 配置一个镜像

   ```xml
   <!-- 阿里云 -->
   <mirror>  
      <id>nexus-aliyun</id>  
      <mirrorOf>central</mirrorOf>
      <name>Nexus aliyun</name>  
      <url>http://maven.aliyun.com/nexus/content/groups/public</url>  
   </mirror>

   <!-- 开源中国 -->
   <mirror>  
      <id>nexus-osc</id>  
      <mirrorOf>*</mirrorOf>  
      <name>Nexus osc</name>  
      <url>http://maven.oschina.net/content/groups/public/</url>  
   </mirror>
   ```

5. 更改 .m2 文件夹

  `<localRepository>/media/cpf/Soft/programing/Resource/m2/repository</localRepository>`
