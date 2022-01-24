# feign

## 修改 `one-service` 工程

1. `pom.xml` 添加 `spring-cloud-starter-openfeign`

   ```xml
   <!-- open feign -->
   <dependency>
      <groupId>org.springframework.cloud</groupId>
      <artifactId>spring-cloud-starter-openfeign</artifactId>
   </dependency>
   ```

2. 启动类中添加 `@EnableFeignClients` 注解

   > 启动时,扫描启动类所在包或子包中的类, 假如接口上有 `@FeignClient` 注解, 则对这样的接口创建其实现代理类, 在实现类内部帮我们进行远程服务调用远程.

   ```java
   package com.github.helowcode.cloud.oneservice;

   import org.springframework.boot.SpringApplication;
   import org.springframework.boot.autoconfigure.SpringBootApplication;
   import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
   import org.springframework.cloud.openfeign.EnableFeignClients;
   import org.springframework.context.annotation.ComponentScan;

   /**
   * @author CPF
   **/
   @SpringBootApplication
   @ComponentScan
   @EnableDiscoveryClient
   @EnableFeignClients
   public class OneApplication {

      public static void main(String[] args) {
         SpringApplication.run(OneApplication.class, args);
      }

   }
   ```

3. 定义接口

   ```java
   package com.github.helowcode.cloud.oneservice.feign.as;

   import org.springframework.cloud.openfeign.FeignClient;
   import org.springframework.web.bind.annotation.GetMapping;

   /**
   * @author CPF
   **/
   @FeignClient(name = "as-service")
   public interface NacosService {

      @GetMapping("/as/nacos/chain")
      String chain();

   }
   ```

4. 使用

   ```java
   package com.github.helowcode.cloud.oneservice.api;

   /**
   * @author CPF
   **/
   @Slf4j
   @RestController
   @RequestMapping("/one/nacos")
   public class NacosController {

      @Value("${spring.application.name}")
      private String appName;

      @Autowired
      private NacosService nacosService;

      @GetMapping(value = "/feign/chain")
      public String feignChain() {
         final String response = nacosService.chain();
         return String.format("%s::/nacos/feign/chain ==> %n %s", appName, response);
      }
   }
   ```

   > 对比之前的写法有明显的差别.

5. 启动项目进行测试.

   ![](https://gitee.com/cpfree/picture-warehouse/raw/master/devops-note/1642429934785.png)

