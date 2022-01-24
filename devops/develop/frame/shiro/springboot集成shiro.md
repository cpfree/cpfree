

## springBoot 集成 shiro 注意事项

1. Spring 集成 shiro 后, 


2. shiro 在用户登录失败之后, 会重新生成 sessionid


## ds

3.  如果访问的资源拿不到, 则 shiro 会返回登录页面, 或者其他页面, 如果, 这个页面还是拿不到, 则会循环重定向.

shiro 配置注意事项

1. 配置`shiro`的`loginUrl`等, 一定要确保`loginUrl`可以正常访问到, 如果访问不到, 则可能出现连续的重定向问题.

2. 在过滤器里面添加了这句代码: `chainDefinition.addPathDefinition("/**", "authc");`,

   如果访问的资源获取不到, 则 shiro 会返回登录页面, 也就是 shiro 配置的 `loginUrl`, 而不是跳转到 404 页面.


## shiro 解决的一些问题

### shiro 在用户登录失败之后, 会重新生成 sessionid

> 参考网址: <https://blog.csdn.net/cloud_ll/article/details/43604547>

Shiro 在 1.3 版本之后(当然现在已经1.8版本了), 就具有在用户登录之后就重新生成 sessionid 的功能.

> [Session_Fixation问题](https://owasp.org/www-community/attacks/Session_fixation)
>
> 会话固定是一种允许攻击者劫持有效用户会话的攻击。该攻击探索了 Web 应用程序管理会话 ID 的方式的限制，更具体地说是易受攻击的 Web 应用程序。**对用户进行身份验证时，它不会分配新的会话 ID，因此可以使用现有的会话 ID**。攻击包括获取有效的会话 ID（例如，通过连接到应用程序），诱使用户使用该会话 ID 对自己进行身份验证，然后通过知道使用的会话 ID 来劫持用户验证的会话。攻击者必须提供合法的 Web 应用程序会话 ID，并尝试使受害者的浏览器使用它。


## springBoot 集成 Shiro 的坑

### spring + shiro 的过滤器问题

spring里面有一个特性, 就是被 Spring 管理的 Bean 里面只要有实现 `Servlet` 或 `Filter` 的都会被 `Spring servlet container` 自动注册和管理, 且默认匹配路径为 `/*`.

而 shiro 里面的过滤器实际上就是对 Filter 的实现, 无论是自带的还是自定义的.

然后配置的时候就很容易引发一个问题, 那就是, 本该被 shiro 管理的 `Filter`结果被 `Spring` 管理了, 并且匹配路径是 `/*`. 导致这个过滤器拦截了很多不该拦截的请求.

解决方式有两种

方案一(推荐): 

   直接禁用掉 `Spring` 对指定实现 `Filter` 的 `Bean` 的注册

   > [Spring官方文档: Disable Registration of a Servlet or Filter](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#howto.webserver.add-servlet-filter-listener.spring-bean.disable)
   > 
   > As described earlier, any Servlet or Filter beans are registered with the servlet container automatically. To disable registration of a particular Filter or Servlet bean, create a registration bean for it and mark it as disabled, as shown in the following example:

   ```java
   import org.springframework.boot.web.servlet.FilterRegistrationBean;
   import org.springframework.context.annotation.Bean;
   import org.springframework.context.annotation.Configuration;

   @Configuration(proxyBeanMethods = false)
   public class MyFilterConfiguration {

      @Bean
      public FilterRegistrationBean<MyFilter> registration(MyFilter filter) {
         FilterRegistrationBean<MyFilter> registration = new FilterRegistrationBean<>(filter);
         registration.setEnabled(false);
         return registration;
      }

   }
   ```

   实际案例:

   项目自定义了一个 scLogin 的 ScLoginAuthenticationFilter 过滤器, 它需要放在 shiro 过滤器注册, 而不是被 Spring 过滤器注册, 因此需要单独禁掉该过滤器的注册.

   ```java
   @Slf4j
   @Component("login")
   public class ScLoginAuthenticationFilter extends FormAuthenticationFilter {
      // 代码略
   }
   ```

   添加一个 `Bean` 配置来禁用掉 `Spring` 的注册.

   ```java
   @Configuration(proxyBeanMethods = false)
   public class MyFilterConfiguration {
      @Bean
      public FilterRegistrationBean<ScLoginAuthenticationFilter> registration(MyFilter filter) {
         FilterRegistrationBean<ScLoginAuthenticationFilter> registration = new FilterRegistrationBean<>(filter);
         registration.setEnabled(false);
         return registration;
      }
   }
   ```

方案二: 

   就是不要让 ScLoginAuthenticationFilter 成为一个 Bean, 也就是取消掉 @Component 注解, 但是如此一来

   就需要单独创建一个 filterMap 的 Bean, 用于 shiro 的配置, 采用 new 的 形势来引入 ScLoginAuthenticationFilter, 相对而言比较复杂



### spring 整合 shiro 的无限循环重定向问题

这是 `2021年12月29日` 遇到的问题.

1. 没有配置或没有正确配置 `ShiroFilterChainDefinition`, 导致 `shiro` 默认访问不到的请求都走权限过滤器.

   简单来讲就是在过滤器里面添加了这句代码: `chainDefinition.addPathDefinition("/**", "authc");`,

   导致访问不到的资源全部返回了 `loginUrl`, 而不是`404`

2. `loginUrl` 没有配置, 默认的是 `login.jsp`, 结果又拿不到资源, 继而又重定向 `loginUrl`, 由此形成了循环重定向




