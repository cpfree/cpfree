# Contrroller 拦截

1. 引入依赖

   ```xml
   <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-aop</artifactId>
   </dependency>
   ```

2. 加入切面

   ```java
   package cn.hydroxyl.sso.auth2.config.spring;

   import com.github.cosycode.web.base.util.cast.JsonUtils;
   import lombok.extern.slf4j.Slf4j;
   import org.aspectj.lang.ProceedingJoinPoint;
   import org.aspectj.lang.Signature;
   import org.aspectj.lang.annotation.Around;
   import org.aspectj.lang.annotation.Aspect;
   import org.aspectj.lang.reflect.MethodSignature;
   import org.springframework.stereotype.Component;
   import org.springframework.web.context.request.RequestContextHolder;
   import org.springframework.web.context.request.ServletRequestAttributes;
   import org.springframework.web.multipart.MultipartFile;

   import javax.servlet.ServletRequest;
   import javax.servlet.ServletResponse;
   import javax.servlet.http.HttpServletRequest;
   import java.lang.reflect.Method;

   /**
   * <b>Description : </b> 打印参数 和 返回值的 AOP 切面
   * <p>
   * <b>created in </b> 2021/12/29
   * </p>
   *
   * @author CPF
   * @since 1.0
   **/
   @Slf4j
   @Component
   @Aspect
   public class LogAspectConfiguration {

      @PostConstruct
      public void test() {
         log.info("hahahahhahahh ===-=== . ");
      }

      /**
      * execution：改成自己要打印的控制器路径
      *
      * @param proceedingJoinPoint 切点
      */
      @Around("execution(* cn.hydroxyl.sso.auth2.controller.*.*(..)) ")
      public Object handleControllerMethod(ProceedingJoinPoint proceedingJoinPoint) throws Throwable {
         final boolean debugEnabled = log.isDebugEnabled();
         if (!debugEnabled) {
               return proceedingJoinPoint.proceed();
         }

         //原始的HTTP请求和响应的信息
         ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
         assert attributes != null : "attributes is null";
         HttpServletRequest request = attributes.getRequest();

         Signature signature = proceedingJoinPoint.getSignature();
         MethodSignature methodSignature = (MethodSignature) signature;
         //获取当前执行的方法
         Method targetMethod = methodSignature.getMethod();
         //获取参数
         Object[] objects = proceedingJoinPoint.getArgs();
         //获取参数
         Object[] arguments = new Object[objects.length];
         for (int i = 0; i < objects.length; i++) {
               if (objects[i] instanceof ServletRequest || objects[i] instanceof ServletResponse || objects[i] instanceof MultipartFile) {
                  //过滤掉不能序列化的参数
                  continue;
               }
               arguments[i] = objects[i];
         }

         final String name = Thread.currentThread().getName();

         log.info("\n     [{} call start] ==> [{}] {} : {}::{}\n     Params    : {} \n session: {}",
                  name, request.getMethod(), request.getRequestURL(), targetMethod.getDeclaringClass().getName()
                  , targetMethod.getName(), JsonUtils.toJson(arguments), request.getSession().getId());
         //获取返回对象
         Object object = proceedingJoinPoint.proceed();
         log.info("\n     [{} call end] ==> {}", name, object);
         return object;
      }

   }
   ```

3. 配置

   ```yml
   spring:
      aop:
         # 为 false(默认为false)，则使用标准的JDK 基于接口的代理。
         # 为 true 且有引入 cglib 库, 则是基于类的代理将起作用（需要cglib库）, 否则会使用标准的JDK 基于接口的代理
         proxy-target-class: true

   debug: true
   logging:
      level:
         org.springframework.boot.autoconfigure: ERROR
         org.springframework.web: INFO
         # 容器启动的时候, 加载到了一个 Bean, 遇到的日志是可以直接被打印的.
         # 但是容器启动后, 代理的内容需要配置下面的才能被打印
         cn.hydroxyl.sso.auth2: DEBUG
   ```

   > 因为切面类`cn.hydroxyl.sso.auth2.config.spring.LogAspectConfiguration` 中有两个函数, 一个是切面函数, 一个是加上了`@PostConstruct`的初始化函数.
   > 
   > 当配置文件里面没有配置了 `cn.hydroxyl.sso.auth2` 的时候, 只有带有`@PostConstruct`的初始化函数被打印了信息.
   > 只有加上log配置 `cn.hydroxyl.sso.auth2` 的时候, 切面函数才打印日志.
   > 
   > TODO
   >
   > 这个没有仔细研究, 本来想着 cglib衍生出代理类不匹配 log 日志打印规则引起的.
   >
   > 但是在两个方法里面均加上了 `log.info("class === {}", getClass().getName());`, 打印出来的都是
   > `class === cn.hydroxyl.sso.auth2.config.spring.LogAspectConfiguration`

