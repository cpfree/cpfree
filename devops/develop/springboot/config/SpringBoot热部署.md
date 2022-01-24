---
keys: 热部署
type: copy,blog,trim
url: <https://blog.csdn.net/wm20000/article/details/119394522>
id: 211228-123256
---

# 热部署配置

1. 确保 spring 版本正确

   

2. 第一步 增加工具依赖 pom.xml

   ```xml
   <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-devtools</artifactId>
      <optional>true</optional>
      <scope>runtime</scope>
   </dependency>
   ```

3. 第二步  增加配置 pom.xml

   ```xml
   <plugin>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-maven-plugin</artifactId>
      <configuration>
         <fork>true</fork>
      </configuration>
   </plugin>
   ```

4. IDEA 2021.3 配置 ==> 设置自动编译
   
   ![](https://gitee.com/cpfree/picture-warehouse/raw/master/devops-note/1640666209699.png)

5. IDEA 2021.3 配置 ==> 允许运行时重新自动构建

   ![](https://gitee.com/cpfree/picture-warehouse/raw/master/devops-note/1640666093790.png)

6. 如果还不行, 可以重启IDEA

7. 提高速度

   ![](https://gitee.com/cpfree/picture-warehouse/raw/master/devops-note/1640666406421.png)