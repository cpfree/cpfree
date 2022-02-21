# @Configuration

## 作用

- @Configuration 中所有带 @Bean 注解的方法都会被动态代理，因此调用该方法返回的都是同一个实例。

- `@Configuration` 用于定义配置类，可替换xml配置文件，被注解的类内部包含有一个或多个被@Bean注解的方法，这些方法将会被`AnnotationConfigApplicationContext`或`AnnotationConfigWebApplicationContext`类进行扫描，并用于构建`bean`定义，初始化`Spring`容器。

## info

> `@Configuration` 注解的配置类有如下要求
>
> - `@Configuration` 不可以是final类型(没法动态代理)
> - `@Configuration` 不可以是匿名类(没法动态代理)
> - 嵌套的 `configuration` 必须是静态类。

一、用`@Configuration`加载spring

1.1. `@Configuration`配置 `spring` 并启动 spring 容器
1.2. `@Configuration`启动容器+ `@Bean` 注册Bean
1.3. `@Configuration`启动容器+ `@Component` 注册Bean
1.4. 使用 `AnnotationConfigApplicationContext` 注册 `AppContext` 类的两种方法
1.5. 配置Web应用程序(`web.xml` 中配置 `AnnotationConfigApplicationContext`)

二、组合多个配置类

2.1、在`@Configuration`中引入spring的xml配置文件
2.2、在`@Configuration`中引入其它注解配置
2.3、`@Configuration`嵌套（嵌套的Configuration必须是静态类）
三、@EnableXXX注解
四、@Profile逻辑组配置
五、使用外部变量

@Configuation等价于`<Beans></Beans>`
@Bean等价于`<Bean></Bean>`
@ComponentScan 等价于`<context:component-scan base-package="com.dxz.demo"/>`

## @Configuration 原理


@Configuration 注解：

   ```java
   @Target(ElementType.TYPE)
   @Retention(RetentionPolicy.RUNTIME)
   @Documented
   @Component
   public @interface Configuration {
      String value() default "";
   }
   ```

从定义来看， @Configuration 注解本质上还是 @Component，因此 <context:component-scan/> 或者 @ComponentScan 都能处理@Configuration 注解的类。



