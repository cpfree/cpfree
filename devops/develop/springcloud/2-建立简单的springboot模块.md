---
keys: 
type: copy,blog,trim
url: <>
id: 220100-100007
---

# 搭建 spring-boot web 工程

## 1. 引入模块

1. 父 pom 中引入 web-boot

   ```xml
      <dependencyManagement>
         <dependencies>
            <!-- cosycode jar -->
            <dependency>
                  <groupId>com.github.cosycode</groupId>
                  <artifactId>web-base</artifactId>
                  <version>1.0-SNAPSHOT</version>
            </dependency>

            <!-- build -->
            <dependency>
                  <groupId>junit</groupId>
                  <artifactId>junit</artifactId>
                  <version>4.13.2</version>
                  <scope>test</scope>
            </dependency>
            <!-- 热部署 -->
            <dependency>
                  <groupId>org.projectlombok</groupId>
                  <artifactId>lombok</artifactId>
                  <version>1.18.22</version>
                  <scope>provided</scope>
            </dependency>
         </dependencies>
      </dependencyManagement>
   ```

2. 子 pom 中引入 web-boot

   ```xml
         <dependencies>
            <!-- cosycode jar -->
            <dependency>
                  <groupId>com.github.cosycode</groupId>
                  <artifactId>web-base</artifactId>
                  <version>1.0-SNAPSHOT</version>
            </dependency>

            <!-- build -->
            <dependency>
                  <groupId>junit</groupId>
                  <artifactId>junit</artifactId>
                  <version>4.13.2</version>
                  <scope>test</scope>
            </dependency>
            <!-- 热部署 -->
            <dependency>
                  <groupId>org.projectlombok</groupId>
                  <artifactId>lombok</artifactId>
                  <version>1.18.22</version>
                  <scope>provided</scope>
            </dependency>
         </dependencies>
      </dependencyManagement>
   ```
