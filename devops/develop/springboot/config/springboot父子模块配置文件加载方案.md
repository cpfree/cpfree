# SpringCloud 父子模块配置文件加载方案

## 方案一: 使用springboot启动来配置子模块

#### 数据访问层模块(DAL)

> 数据访问层负责对数据库的修改.

![](https://gitee.com/cpfree/picture-warehouse/raw/master/pic1/1643462005814.png)

1. `src/main/resources/application-dal.yml`

   > 需要提交git仓库, 不能有密码

   ```yaml
   spring:
      datasource:
         driver-class-name: com.mysql.cj.jdbc.Driver
         url: ${config.datasource.url}
         username: ${config.datasource.username}
         password: ${config.datasource.password}

   mybatis-plus:
      # 注意：一定要对应mapper映射xml文件的所在路径
      mapper-locations: classpath:mappers/*.xml
      # mapper.xml文件中resultMap的type、parameterType、resultType会引用一些实体类，实体类需要时全类名, 配置这个属性后, 就可以仅仅写类的名字了.
      # 虽然可以配置这项来进行 pojo 包扫描，但其实我更倾向于在 mapper.xml 写全类名
      type-aliases-package: cn.hydroxyl.dal.base.entity
   ```

2. `src/test/resources/config/application.yml`

   > 保留本地, 不会提交到git仓库, 全局 `.gitignore` 文件中有正则配置 `**/resources/config/application.yml`.

   ```yaml
   config:
      datasource:
         url: jdbc:mysql://xxxxxx:3306/xxxxxx?useUnicode=true&characterEncoding=utf-8&zeroDateTimeBehavior=CONVERT_TO_NULL&serverTimezone=Hongkong
         username: xxxxxx
         password: xxxxxx

   spring:
      profiles:
         # 启动 application-dal.yml 配置
         active: dal
   ```

3. 为了方便测试还有两个测试类

   `cn.hydroxyl.dal.Application.java`

   ```java
   @SpringBootApplication
   @MapperScan({"cn.hydroxyl.dal.base.mapper", "cn.hydroxyl.dal.combine.mapper"})
   public class Application {
      public static void main(String[] args) {
         SpringApplication.run(Application.class, args);
      }
   }
   ```

   `cn.hydroxyl.dal.SampleTest.java`

   ```java
   @RunWith(SpringRunner.class)
   @SpringBootTest(classes = Application.class)
   public class SampleTest {
   
      @Autowired
      private IAccCombineService iAccCombineService;
   
      @Test
      public void testMybatisPlusSelect() {
         final List<String> role = iAccCombineService.findAllRoleByUserGuid("system00-8589-446e-0000-443a683687ab");
         role.forEach(System.out::println);
      }
   
   }
   ```

测试的时候, 运行`cn.hydroxyl.dal.SampleTest.java`文件, 先加载`src/test/resources/config/application.yml`, 之后其中有一个 `spring.profiles.active: dal` 会带动加载 `src/main/resources/application-dal.yml`, 最终拼接好配置完成测试工作.

#### 其它模块(需要引入DAL的模块)

![](https://gitee.com/cpfree/picture-warehouse/raw/master/pic1/1643462677914.png)

1. Spring 启动文件

   注意这里需要对 dal 模块中的 Component 进行扫描, 还要对dal模块的 mapper 文件进行扫描.

   ```java
   package cn.hydroxyl.sso.auth2;

   import org.mybatis.spring.annotation.MapperScan;
   import org.springframework.boot.SpringApplication;
   import org.springframework.boot.autoconfigure.SpringBootApplication;
   import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
   import org.springframework.context.annotation.ComponentScan;

   @EnableDiscoveryClient
   @SpringBootApplication
   @ComponentScan({"cn.hydroxyl.dal", "cn.hydroxyl.sso.auth2"})
   @MapperScan({"cn.hydroxyl.dal.base.mapper", "cn.hydroxyl.dal.combine.mapper"})
   public class Oauth2AuthApplication {
      public static void main(String[] args) {
         SpringApplication.run(Oauth2AuthApplication.class, args);
      }
   }
   ```

2. 配置文件

   在 `application.yml` 加入 `spring.profiles.active: dal`, 会去找子模块里面的 `application-dal.yml`, 带动子模块中的配置文件进行加载, 这样就可以将 mapper 文件保留在 dal 模块中了.

   ```yml
   spring:
      profiles:
         # 启动 application-dal.yml 配置
         active: dal
   ```

## 方案二: 配置多模块为 `springboot-start`.

这样更加方便, 只要引入个包就可以.
