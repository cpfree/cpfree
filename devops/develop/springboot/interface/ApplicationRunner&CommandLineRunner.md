## SpringBoot 启动完成后执行代码

## ApplicationRunner & CommandLineRunner

1. ApplicationRunner

2. CommandLineRunner

当项目中同时实现了ApplicationRunner和CommondLineRunner接口时，可使用Order注解或实现Ordered接口来指定执行顺序，值越小越先执行,

如果不进行排序的话, 则是 ApplicationRunner 先执行, 

### 相关源码

> Spring版本: 2.2.5.RELEASE

ApplicationRunner & CommandLineRunner 仅仅是两个很简单的接口.

CommandLineRunner.java 类

   ```java
   package org.springframework.boot;
   @FunctionalInterface
   public interface CommandLineRunner {
      void run(String... args) throws Exception;
   }
   ```

ApplicationRunner.java 类

   ```java
   package org.springframework.boot;
   @FunctionalInterface
   public interface ApplicationRunner {
      void run(ApplicationArguments args) throws Exception;
   }
   ```

SpringApplication.java 类

   ```java
   package org.springframework.boot;

   public class SpringApplication {
      public ConfigurableApplicationContext run(String... args) {
         StopWatch stopWatch = new StopWatch();
         stopWatch.start();
         ConfigurableApplicationContext context = null;
         Collection<SpringBootExceptionReporter> exceptionReporters = new ArrayList();
         this.configureHeadlessProperty();
         SpringApplicationRunListeners listeners = this.getRunListeners(args);
         listeners.starting();

         Collection exceptionReporters;
         try {
            ApplicationArguments applicationArguments = new DefaultApplicationArguments(args);
            ConfigurableEnvironment environment = this.prepareEnvironment(listeners, applicationArguments);
            this.configureIgnoreBeanInfo(environment);
            Banner printedBanner = this.printBanner(environment);
            context = this.createApplicationContext();
            exceptionReporters = this.getSpringFactoriesInstances(SpringBootExceptionReporter.class, new Class[]{ConfigurableApplicationContext.class}, context);
            this.prepareContext(context, environment, listeners, applicationArguments, printedBanner);
            this.refreshContext(context);
            this.afterRefresh(context, applicationArguments);
            stopWatch.stop();
            if (this.logStartupInfo) {
                  (new StartupInfoLogger(this.mainApplicationClass)).logStarted(this.getApplicationLog(), stopWatch);
            }

            listeners.started(context);

            // 启动后调用了 callRunners 方法
            this.callRunners(context, applicationArguments);
         } catch (Throwable var10) {
            this.handleRunFailure(context, var10, exceptionReporters, listeners);
            throw new IllegalStateException(var10);
         }

         try {
            listeners.running(context);
            return context;
         } catch (Throwable var9) {
            this.handleRunFailure(context, var9, exceptionReporters, (SpringApplicationRunListeners)null);
            throw new IllegalStateException(var9);
         }
      }

      // 添加所有 ApplicationRunner.class, CommandLineRunner.class 的bean, 进行依次执行.
      private void callRunners(ApplicationContext context, ApplicationArguments args) {
         List<Object> runners = new ArrayList();
         runners.addAll(context.getBeansOfType(ApplicationRunner.class).values());
         runners.addAll(context.getBeansOfType(CommandLineRunner.class).values());
         // 对 runners 进行了一次排序
         // org.springframework.core.annotation.AnnotationAwareOrderComparator 方法继承了 OrderComparator 类, 可以使用 Order 进行排序
         AnnotationAwareOrderComparator.sort(runners);

         Iterator var4 = (new LinkedHashSet(runners)).iterator();
         while(var4.hasNext()) {
            Object runner = var4.next();
            if (runner instanceof ApplicationRunner) {
                  this.callRunner((ApplicationRunner)runner, args);
            }
            if (runner instanceof CommandLineRunner) {
                  this.callRunner((CommandLineRunner)runner, args);
            }
         }
      }

      // ApplicationRunner
      private void callRunner(ApplicationRunner runner, ApplicationArguments args) {
         try {
            runner.run(args);
         } catch (Exception var4) {
            throw new IllegalStateException("Failed to execute ApplicationRunner", var4);
         }
      }

      // CommandLineRunner
      private void callRunner(CommandLineRunner runner, ApplicationArguments args) {
         try {
            runner.run(args.getSourceArgs());
         } catch (Exception var4) {
            throw new IllegalStateException("Failed to execute CommandLineRunner", var4);
         }
      }

   }
   ```

从上面的源码可以看出 `SpringApplication` 的run方法, 在 启动之后, 调用了 `this.callRunners(context, applicationArguments)` 方法.

`callRunners`方法, 添加所有 `ApplicationRunner.class`, `CommandLineRunner.class` 的bean.

之后使用了 AnnotationAwareOrderComparator 进行排序, 之后循环迭代执行相关类.

从下面两个 callRunner 重载方法调用执行 `ApplicationRunner.class`, `CommandLineRunner.class`, 由此可见两个接口没有什么大的区别, 仅仅是参数参数不同.
