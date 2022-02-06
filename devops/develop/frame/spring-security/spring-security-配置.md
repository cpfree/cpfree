---
keys: 
type: copy,blog,trim
url: <https://spring.io/guides/gs/securing-web/>,<https://www.jianshu.com/p/5e716b439b94>
id: 220205-144456
---

# spring-security 使用配置

## spring 引入 spring-security

> spring-security 提供了开箱即用的登录权限校验功能。

1. 引入依赖

   ```xml
   <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-security</artifactId>
   </dependency>
   <dependency>
      <groupId>org.springframework.security</groupId>
      <artifactId>spring-security-test</artifactId>
      <scope>test</scope>
   </dependency>
   ```

2. 搭建好spring-boot后启动项目, 会看到日志中生成密码.

   输入默认用户名 `user`, 密码是控制台打印的密码, 进行登录.

   发现登录成功

## WebSecurityConfigurerAdapter 配置

### 1.配置用户名和密码

开发模式下, 可以通过在内存中简单创建账户的方式创建用户名和密码.

   ```java
   @Configuration
   @EnableWebSecurity
   public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

      @Bean
      public PasswordEncoder passwordEncoder() {
         return new BCryptPasswordEncoder();
      }

      @Override
      public void configure(AuthenticationManagerBuilder auth) throws Exception {
         auth.inMemoryAuthentication().withUser("user").password(passwordEncoder().encode("123456")).roles("ADMIN");
      }
   }
   ```

## 2.配置访问权限

   ```java
   import org.springframework.context.annotation.Bean;
   import org.springframework.context.annotation.Configuration;
   import org.springframework.security.config.annotation.web.builders.HttpSecurity;
   import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
   import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
   import org.springframework.security.core.userdetails.User;
   import org.springframework.security.core.userdetails.UserDetails;
   import org.springframework.security.core.userdetails.UserDetailsService;
   import org.springframework.security.provisioning.InMemoryUserDetailsManager;

   @Configuration
   @EnableWebSecurity
   public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

      /**
       * 该方法定义了应该保护哪些 URL 路径，哪些不应该保护。
       * 
       * permitAll：放行所有
       * denyAll：禁止所有
       * anonymous：可以匿名访问，但是会执行后续拦截链
       * authenticate：都需要认证
       * fullyAuthenticated：如果是记住我的状态，那么就不允许访问
       * rememberMe：是记住我的状态才能访问
       */
      @Override
      protected void configure(HttpSecurity http) throws Exception {
         http.authorizeRequests()
               // 允许匹配的请求通过
               .antMatchers("/", "/home").permitAll()
               // 而其他的请求需要认证.
               .anyRequest().authenticated()
               .and()
               // 当用户成功登录时，它们被重定向到以前请求的需要身份验证的页面。有一个自定义页面(由)指定，
            .formLogin()
               .loginPage("/login")
               .permitAll()
               .and()
            .logout()
               .permitAll();
      }

      // 该方法用单个用户设置内存中的用户存储区。
      @Bean
      @Override
      public UserDetailsService userDetailsService() {
         UserDetails user =
            User.withDefaultPasswordEncoder()
               .username("user")
               .password("password")
               .roles("USER")
               .build();
         return new InMemoryUserDetailsManager(user);
      }
   }
   ```

1. `configure(HttpSecurity http)`

   该方法定义了应该保护哪些 URL 路径，哪些不应该保护。

   `antMatchers("/").permitAll()` : 表示根路径不需要任何认证, 直接放行.
   `.antMatchers("/manager").hasRole("admin")`: 表示 `/manager` 路径, 需要有`admin`的权限.
   `.formLogin().loginPage("/index").loginProcessingUrl("/login").successForwardUrl("/success");` 表示当你进入某个你没有权限的页面的时候跳转到登录页面, 还有配置登录成功或失败时候的跳转页面.

## 解决 HTTP Post请求的403错误

为了防止 `跨站提交攻击`

spring security 默认开启了`csrf`, 这保护会阻止所有POST请求访问, 然后返回`403`状态.

最简单的解决方式是直接关闭掉这个保护, 不过这样既不安全, 代码如下所示.

   > <https://docs.spring.io/spring-security/reference/reactive/exploits/csrf.html>

   ```java
   @Configuration
   @EnableWebSecurity
   public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
      @Override
      protected void configure(HttpSecurity http) throws Exception {
         //关闭csrf保护
         http.csrf().disable();
      }
   }
   ```

   或配置

   ```java
   @Bean
   public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
      http.csrf(csrf -> csrf.disable());
      return http.build();
   }
   ```


   ```java
   @Configuration
   @EnableWebSecurity
   public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
      @Override
      protected void configure(HttpSecurity http) throws Exception {
         //关闭csrf保护
         http.csrf().disable().httpBasic()
            //session配置成无状态模式，适用于REST API
            .and().sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            // 所有请求都要经过登录认知
            .and().authorizeRequests().anyRequest().authenticated(); 
      }
   }
   ```


