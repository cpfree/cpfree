---
keys: 
type: copy,blog,trim
url: <>
id: 220100-100000
---

# springboot-shiro autoconfig

> `shiro` 网上介绍的很乱, 当然和乱七八糟的版本也有关系, 需要问题, 请参照官网和源码 <https://shiro.apache.org/spring-boot.html>

## 基础环境

`springboot` 版本

   ```xml
   <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-parent</artifactId>
      <version>2.5.6</version>
      <type>pom</type>
      <scope>import</scope>
   </dependency>
   ```

`shiro` 版本

   ```xml
   <dependency>
         <groupId>org.apache.shiro</groupId>
         <artifactId>shiro-spring-boot-web-starter</artifactId>
         <version>1.8.0</version>
   </dependency>
   ```

## 自动装配源码解析

`org.apache.shiro.spring.config.web.autoconfigure.ShiroWebFilterConfiguration.java` 是 `shiro` 的自动装配类, 其代码如下

```java
package org.apache.shiro.spring.config.web.autoconfigure;

import java.util.List;
import javax.servlet.DispatcherType;
import org.apache.shiro.spring.web.ShiroFilterFactoryBean;
import org.apache.shiro.spring.web.config.AbstractShiroWebFilterConfiguration;
import org.apache.shiro.web.servlet.AbstractShiroFilter;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication;
import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication.Type;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConditionalOnWebApplication(type = Type.SERVLET)
@ConditionalOnProperty(name = {"shiro.web.enabled"}, matchIfMissing = true)
public class ShiroWebFilterConfiguration extends AbstractShiroWebFilterConfiguration {
    public static final String REGISTRATION_BEAN_NAME = "filterShiroFilterRegistrationBean";
    public static final String FILTER_NAME = "shiroFilter";

    public ShiroWebFilterConfiguration() {}

    @Bean
    @ConditionalOnMissingBean
    protected ShiroFilterFactoryBean shiroFilterFactoryBean() {
        return super.shiroFilterFactoryBean();
    }

    @Bean(name = {"filterShiroFilterRegistrationBean"})
    @ConditionalOnMissingBean(name = {"filterShiroFilterRegistrationBean"})
    protected FilterRegistrationBean<AbstractShiroFilter> filterShiroFilterRegistrationBean() throws Exception {
        FilterRegistrationBean<AbstractShiroFilter> filterRegistrationBean = new FilterRegistrationBean();
        filterRegistrationBean.setDispatcherTypes(DispatcherType.REQUEST, new DispatcherType[]{DispatcherType.FORWARD, DispatcherType.INCLUDE, DispatcherType.ERROR});
        // getObject() 方法实际上就是一个单例模式, getObject() 就是获取 shiroFilterFactoryBean 的唯一的一个单例
        filterRegistrationBean.setFilter((AbstractShiroFilter)this.shiroFilterFactoryBean().getObject());
        filterRegistrationBean.setName("shiroFilter");
        filterRegistrationBean.setOrder(1);
        return filterRegistrationBean;
    }

    @Bean(name = {"globalFilters"})
    @ConditionalOnMissingBean
    protected List<String> globalFilters() {
        return super.globalFilters();
    }
}
```

由`ShiroWebFilterConfiguration`类可知, 整个装配过程实际上就是需要创建两个类 `globalFilters`, `filterShiroFilterRegistrationBean`.

一般而言, `filterShiroFilterRegistrationBean`, `globalFilters` 都不需要个性化配置, 我们需要做的只是配置 `shiroFilterFactoryBean` 而已, 

>   由上面的一句代码 `filterRegistrationBean.setFilter((AbstractShiroFilter)this.shiroFilterFactoryBean().getObject());` 可知, 
>
>   `shiroFilterFactoryBean` 在被创建 `filterShiroFilterRegistrationBean` 的时候会被用到, 
>
>   `getObject()` 方法是一个单例模式, 代码如下
>
>   ```java
>   class ShiroFilterFactoryBean {
>      // ...
>      // 无关代码忽略
>      // ...
>
>      public Object getObject() throws Exception {
>         if (this.instance == null) {
>            this.instance = this.createInstance();
>         }
>
>         return this.instance;
>      }
>   }
>   ```

`shiroFilterFactoryBean` 的默认创建调用了父类方法, `ShiroWebFilterConfiguration.java` 继承于`AbstractShiroWebFilterConfiguration`

`org.apache.shiro.spring.web.config.AbstractShiroWebFilterConfiguration` 类如下

```java
package org.apache.shiro.spring.web.config;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import javax.servlet.Filter;
import org.apache.shiro.mgt.SecurityManager;
import org.apache.shiro.spring.web.ShiroFilterFactoryBean;
import org.apache.shiro.web.filter.mgt.DefaultFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

public class AbstractShiroWebFilterConfiguration {
    @Autowired
    protected SecurityManager securityManager;
    @Autowired
    protected ShiroFilterChainDefinition shiroFilterChainDefinition;
    @Autowired(required = false)
    protected Map<String, Filter> filterMap;
    @Value("#{ @environment['shiro.loginUrl'] ?: '/login.jsp' }")
    protected String loginUrl;
    @Value("#{ @environment['shiro.successUrl'] ?: '/' }")
    protected String successUrl;
    @Value("#{ @environment['shiro.unauthorizedUrl'] ?: null }")
    protected String unauthorizedUrl;

    public AbstractShiroWebFilterConfiguration() {
    }

    protected List<String> globalFilters() {
        return Collections.singletonList(DefaultFilter.invalidRequest.name());
    }

    protected ShiroFilterFactoryBean shiroFilterFactoryBean() {
        ShiroFilterFactoryBean filterFactoryBean = new ShiroFilterFactoryBean();
        filterFactoryBean.setLoginUrl(this.loginUrl);
        filterFactoryBean.setSuccessUrl(this.successUrl);
        filterFactoryBean.setUnauthorizedUrl(this.unauthorizedUrl);
        filterFactoryBean.setSecurityManager(this.securityManager);
        filterFactoryBean.setGlobalFilters(this.globalFilters());
        filterFactoryBean.setFilterChainDefinitionMap(this.shiroFilterChainDefinition.getFilterChainMap());
        filterFactoryBean.setFilters(this.filterMap);
        return filterFactoryBean;
    }
}
```

由上面的 `AbstractShiroWebFilterConfiguration` 类可知, 其中自动装配了几个Bean和属性.

因此我们一般需要配置的也就这几个`Bean`.

1. `securityManager`: 安全管理器

2. `shiroFilterChainDefinition`: 过滤器, 用来匹配路径和安全策略之间的关系.
   
3. `filterMap`: 这个是不需要进行配置的, 它对应的是一个 key: 过滤器, 如下, 定义`login`, `logout` 的过滤器.

   ```java
   Map<String, Filter> filters = Maps.newHashMapWithExpectedSize(3);
   filters.put("login", new LoginAuthenticationFilter());
   filters.put("logout", new CpLogoutFilter());
   ```

   这个是不需要进行配置的, 如果我们有继承 `FormAuthenticationFilter`, `LogoutFilter` 的类, 并加入扫描路径的话, 那么在自动装配的时候, 就会将这些类自动 `put` 到`filterMap`里面.

4. `loginUrl` : 如果没有登录, 则会跳转至该页面.
   
5. `successUrl`: 发现已经登陆, 则跳转至该页面.

6. `unauthorizedUrl`: 发现登录了, 但是没有权限, 则会跳转至该页面.

由上面的自动装配可知, 我们使用 `springboot` 集成 `shiro`的时候, 也就是以下几个

1. 对于`shiro`的`@Configuration`类里面, 实际上一般要配置的也就是`securityManager`, `shiroFilterChainDefinition` 两个`Bean`
2. 配置文件里面对 `loginUrl`, `successUrl`, `unauthorizedUrl` 进行配置.

示例配置如下

```java
package cn.cpf.web.boot.conf.spring;

import cn.cpf.web.boot.conf.shiro.ScAuthorizingRealm;
import cn.cpf.web.boot.conf.shiro.ScLoginAuthenticationFilter;
import lombok.extern.slf4j.Slf4j;
import org.apache.shiro.cache.CacheManager;
import org.apache.shiro.cache.MemoryConstrainedCacheManager;
import org.apache.shiro.realm.Realm;
import org.apache.shiro.spring.web.config.DefaultShiroFilterChainDefinition;
import org.apache.shiro.spring.web.config.ShiroFilterChainDefinition;
import org.apache.shiro.web.filter.authc.FormAuthenticationFilter;
import org.apache.shiro.web.mgt.DefaultWebSecurityManager;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * <b>Description : </b> shiro 的配置文件
 * <p>
 * <br> 最终就是创建出 {@link org.apache.shiro.spring.config.web.autoconfigure.ShiroWebFilterConfiguration} 里面的三个 Bean
 * </p>
 *
 * <p>
 * <b>created in </b> 2019/10/26 17:05
 * </p>
 *
 * @author CPF
 **/
@Configuration
@Slf4j
public class ShiroConfig {

    /**
     * 若没有 @Bean("shiroFilterFactoryBean") 则当前 Bean 生效
     * 配置安全管理器
     */
    @Bean("securityManager")
    public DefaultWebSecurityManager securityManager(){
        log.info("创建 securityManager ");
        final DefaultWebSecurityManager manager = new DefaultWebSecurityManager();
        manager.setRealm(new ScAuthorizingRealm());
        manager.setCacheManager(cacheManager());
        return manager;
    }

    /**
     * shiro 权限过滤器
     *
     * 若没有 @Bean("shiroFilterFactoryBean") 则当前 Bean 生效
     *
     * authc: 所有url都必须认证通过才可以访问;
     * anon: 所有url都都可以匿名访问;
     * user: remember me的可以访问
     *
     * 设置问题
     * 1. 尽量不要设置为 chainDefinition.addPathDefinition("/**", "authc");
     *
     * @return 过滤器
     */
    @Bean
    public ShiroFilterChainDefinition shiroFilterChainDefinition() {
        // DefaultShiroFilterChainDefinition 里面维护了一个 LinkedMap, 是一个顺序 Map, 在查看权限的时候, 前面的优先级比后面的高.
        DefaultShiroFilterChainDefinition chainDefinition = new DefaultShiroFilterChainDefinition();

        // 可以匿名访问
        chainDefinition.addPathDefinition("/", "anon");
        chainDefinition.addPathDefinition("/static/**", "anon");
        chainDefinition.addPathDefinition("/kaptcha", "anon");
        chainDefinition.addPathDefinition("/login.jsp", "anon");
        // 注册,验证账号,找回密码等
        chainDefinition.addPathDefinition("/noAccount/**", "anon");
        // 匹配 filterMap 里面的过滤器类
        chainDefinition.addPathDefinition("/logout", "logout");
        // 可以匿名访问
        chainDefinition.addPathDefinition("/account/loginVerification", "scLogin");
        chainDefinition.addPathDefinition("/validate", "scLogin");

        // 要求认证, 且需要 admin 的角色
        chainDefinition.addPathDefinition("/admin/**", "authc, roles[admin]");

        // 要求认证, 且有 document:read 的权限
        chainDefinition.addPathDefinition("/docs/**", "authc, perms[document:read]");


        // 要求用户权限 尽量不要设置：("/**", "authc"): 这种如果页面访问不到,则会导致返回登陆页面,而不是跳转到404页面.
        chainDefinition.addPathDefinition("/authc/**", "authc");
        return chainDefinition;
    }

    /**
     * 启动缓存 (仅仅需要 创建一个 CacheManager)
     */
    @Bean
    protected CacheManager cacheManager() {
        return new MemoryConstrainedCacheManager();
    }


    /**
     * <br> 添加一个 FilterRegistrationBean 来取消 Spring 对 ScLoginAuthenticationFilter 的注册
     *
     * <br> 简单来说, 该配置实现了 ScLoginAuthenticationFilter 被 Spring Bean 管理, 但是不会被 Spring 注册为 Filter
     *
     * <br> 如果没有改配置, 则 Spring 会将 ScLoginAuthenticationFilter 注册为一个 Spring 过滤器, 且匹配路径为 /*
     *
     * <p>
     * <br> 1. spring 会自动注册实现 Filter 或 Servlet 的 Bean
     * <br> 2. shiro 里面的过滤器是对 Filter 的实现,
     * <br> 3. 当前项目自定义了一个 scLogin 的 ScLoginAuthenticationFilter 过滤器, 它需要放在 shiro 过滤器注册, 而不是被 Spring 过滤器注册, 因此需要单独禁掉该过滤器的注册.
     * </p>
     *
     * <p>
     *     <b>其它方式</b>
     * <br> 其实还有一种方式, 就是不要让 ScLoginAuthenticationFilter 成为一个 Bean, 也就是取消掉 @Component 注解, 但是如此一来,
     * 就需要单独创建一个 filterMap 的 Bean, 用于 shiro 的配置, 采用 new 的 形势来引入 ScLoginAuthenticationFilter, 相对而言比较复杂, 没有该方式优雅.
     * </p>
     *
     * <p>
     *     <b>注意点</b>
     * <br> 1. 方法名取什么无所谓, 但是要注意参数和返回值需要是 Spring 的 Bean, 且有且只能找到一个符合条件的 Bean
     * </p>
     *
     * @param filter 需要禁止 spring 注册的过滤器
     */
    @Bean
    public FilterRegistrationBean<ScLoginAuthenticationFilter> springConfigForDisabledScFilterRegister(ScLoginAuthenticationFilter filter) {
        FilterRegistrationBean<ScLoginAuthenticationFilter> registration = new FilterRegistrationBean<>(filter);
        registration.setEnabled(false);
        return registration;
    }
    
}

```
