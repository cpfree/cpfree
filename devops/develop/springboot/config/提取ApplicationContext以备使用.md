# 启动spring时, 保存applicationContext

## 代码如下

   ```java
   package cn.cpf.web.boot.conf.inter;

   import org.springframework.beans.BeansException;
   import org.springframework.context.ApplicationContext;
   import org.springframework.context.ApplicationContextAware;
   import org.springframework.stereotype.Component;

   import java.util.Objects;

   /**
   * <b>Description : </b>
   * <p>
   * <b>created in </b> 2021/12/27
   * </p>
   *
   * @author CPF
   * @since 1.0
   **/
   @Component
   public class MyAppContext implements ApplicationContextAware {

      /**
      * 提取 applicationContext, 以备使用
      */
      private static ApplicationContext applicationContext;

      @Override
      @SuppressWarnings("java:S2696")
      public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
         // 提取 applicationContext, 以备使用
         Objects.requireNonNull(applicationContext, "MyAppContext 提取 applicationContext 失败");
         MyAppContext.applicationContext = applicationContext;
      }

      public static ApplicationContext applicationContext() {
         return applicationContext;
      }

   }
   ```
