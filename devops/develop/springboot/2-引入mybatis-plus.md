# 引入包 mybatis-plus

在此使用 mybatis-plus

访问`mybatis-plus`官网 <https://baomidou.com/pages/226c21/>

![](https://gitee.com/cpfree/picture-warehouse/raw/master/devops-note/1642237751998.png)

## 1. 选择合适的版本

   因为使用的 spring-boot 是 `2.3.2` 版本.

   访问 `https://search.maven.org/`

   搜索 `mybatis-plus-boot-starter`

   ![](https://gitee.com/cpfree/picture-warehouse/raw/master/devops-note/1642241065638.png)

   切换版本号, 直到发现mybatis-plus版本依赖的 spring-boot 是 `2.3.2` 版本.

   ![](https://gitee.com/cpfree/picture-warehouse/raw/master/devops-note/1642241102506.png)

   在此发现`mybatis-plus`的 `3.4.0`, `3.4.1`, `3.4.2` 版本依赖的 spring-boot 是 `2.3.2` 版本. `3.4.3` 依赖的 spring-boot 是 `2.4.5` 版本, 因此选择 `3.4.2` 版本的`mybatis-plus`

   ```xml
   <dependency>
      <groupId>com.baomidou</groupId>
      <artifactId>mybatis-plus-boot-starter</artifactId>
      <version>3.4.2</version>
   </dependency>
   ```

## 2. pom中引入

   ```xml
   <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter</artifactId>
   </dependency>
   <dependency>
      <groupId>com.baomidou</groupId>
      <artifactId>mybatis-plus-boot-starter</artifactId>
   </dependency>
   <dependency>
      <groupId>mysql</groupId>
      <artifactId>mysql-connector-java</artifactId>
      <scope>runtime</scope>
   </dependency>
   <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-test</artifactId>
      <scope>test</scope>
   </dependency>
   ```

   > 注意 mybatis 里面的示例是最新的 `3.5.0` 版本的, 和当前的不太一样

## 3.4.2 版本示例(引入部分官网配置)

> <https://raw.githubusercontent.com/baomidou/mybatis-plus-doc/master/docs/01.指南/01.快速入门/02.快速开始.md>


#### 数据表

   现有一张 `User` 表，其表结构如下：

   | id  | name   | age | email              |
   | --- | ------ | --- | ------------------ |
   | 1   | Jone   | 18  | test1@baomidou.com |
   | 2   | Jack   | 20  | test2@baomidou.com |
   | 3   | Tom    | 28  | test3@baomidou.com |
   | 4   | Sandy  | 21  | test4@baomidou.com |
   | 5   | Billie | 24  | test5@baomidou.com |

   其对应的数据库 Schema 脚本如下：

   ```sql
   DROP TABLE IF EXISTS user;

   CREATE TABLE user
   (
      id BIGINT(20) NOT NULL COMMENT '主键ID',
      name VARCHAR(30) NULL DEFAULT NULL COMMENT '姓名',
      age INT(11) NULL DEFAULT NULL COMMENT '年龄',
      email VARCHAR(50) NULL DEFAULT NULL COMMENT '邮箱',
      PRIMARY KEY (id)
   );
   ```

   其对应的数据库 Data 脚本如下：

   ```sql
   DELETE FROM user;

   INSERT INTO user (id, name, age, email) VALUES
   (1, 'Jone', 18, 'test1@baomidou.com'),
   (2, 'Jack', 20, 'test2@baomidou.com'),
   (3, 'Tom', 28, 'test3@baomidou.com'),
   (4, 'Sandy', 21, 'test4@baomidou.com'),
   (5, 'Billie', 24, 'test5@baomidou.com');
   ```

#### 初始化工程

创建一个空的 Spring Boot 工程（工程将以 H2 作为默认数据库进行演示）

::: tip
可以使用 [Spring Initializer](https://start.spring.io/) 快速初始化一个 Spring Boot 工程
:::

#### 添加依赖

   > 该部分参考上面选择 mybatis-plus 的 pom

#### 配置`application.yml`

```yaml
# DataSource Config
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://ip:3306/test?useUnicode=true&characterEncoding=utf-8&zeroDateTimeBehavior=CONVERT_TO_NULL&serverTimezone=Hongkong
    username: XXXX
    password: XXXX
```

#### 编写java文件

1. 添加 User 类

   ```java
   package cn.oh.account.mybatis.test;

   import lombok.Data;

   @Data
   public class User {
      private Long id;
      private String name;
      private Integer age;
      private String email;
   }
   ```

2. 编写 Mapper 类 `UserMapper.java`

   ```java
   package cn.oh.account.mybatis.test.mapper;

   import cn.oh.account.mybatis.test.User;
   import com.baomidou.mybatisplus.core.mapper.BaseMapper;

   public interface UserMapper extends BaseMapper<User> {

   }
   ```

3. 在 Spring Boot 启动类中添加 `@MapperScan` 注解，扫描 Mapper 文件夹：

   ```java
   @SpringBootApplication
   @MapperScan("cn.oh.account.mybatis.test.mapper")
   public class Application {

      public static void main(String[] args) {
         SpringApplication.run(Application.class, args);
      }

   }
   ```

4. 添加测试类，进行功能测试：

   ```java
   @RunWith(SpringRunner.class)
   @SpringBootTest(classes = Application.class)
   public class SampleTest {

      @Autowired
      private UserMapper userMapper;

      @Test
      public void testSelect() {
         System.out.println(("----- selectAll method test ------"));
         List<User> userList = userMapper.selectList(null);
         Assert.assertEquals(5, userList.size());
         userList.forEach(System.out::println);
      }

   }
   ```

#### 控制台输出：

   ```log
   User(id=1, name=Jone, age=18, email=test1@baomidou.com)
   User(id=2, name=Jack, age=20, email=test2@baomidou.com)
   User(id=3, name=Tom, age=28, email=test3@baomidou.com)
   User(id=4, name=Sandy, age=21, email=test4@baomidou.com)
   User(id=5, name=Billie, age=24, email=test5@baomidou.com)
   ```
