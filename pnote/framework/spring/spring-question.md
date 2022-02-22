# spring 基础

## 必须掌握

1. IOC
2. AOP

1. spring-context 种就包含了spring core bean 等
2. spring导入expresion后才可以识别 数字类型的 ${db.minPoolCount}

## spring-bean

1. Spring Bean作用域有哪些? 默认什么作用域? 怎么配置作用域? 

   5个作用域

   singleton

   配置Bean的scope属性

2. Spring 几种不同的注入方式

   - no: 默认值，表示没有自动装配，应使用显式 bean 引用进行装配。
   - byName: 它根据 bean 的名称注入对象依赖项。
   - byType: 它根据类型注入对象依赖项。
   - constructor: 通过构造函数来注入依赖项，需要设置大量的参数。
   - autodetect: 容器首先通过构造函数使用 autowire 装配，如果不能，则通过 byType 自动装配。

3. Spring框架中的单例bean是线程安全的吗?

   不是
   Spring框架并没有对单例Bean进行任何多线程的封装处理。关于单例Bean的线程安全和并发问题需要开发者自行搞定。但实际上，大部分Spring Bean并没有可变的状态（比如Serview类和DAO类），所以在某种程度上说，Spring的单例Bean是线程安全的。如果你的Bean有多种状态（比如View Model对象），就需要自行保证线程安全。
   最浅显的解决办法就是将多态Bean的作用域由"singleton"变更为"prototype"。

4. 在Spring中可以注入null或空字符串吗

   可以

5. 什么是Spring Inner Bean

   在Spring框架中，无论何时Bean被使用时，当仅被调用了一个属性，一个明智的做法是将这个Bean声明为内部Bean。内部Bean可以用setter注入"属性"和用构造方法注入"构造参数"的方式来实现。
   比如，在我们的应用程序中，一个Customer类引用了一个Person类，我们要做的是创建一个Person的实例，然后在Customer内部使用。

   ```java
   public class Customer{
      private Person person;
   }
   public class Person{
      private String name;
      private String address;
      private int age;
   }
   ```

   ```xml
   内部Bean的声明方式如下：
   <bean id="CustomerBean" class="com.gupaoedu.common.Customer">
      <property name="person">
         <bean class="com.gupaoedu.common.Person">
            <property name="name" value="lokesh" />
            <property name="address" value="India" />
            <property name="age" value="34" />
         </bean>
      </property>
   </bean>
   ```

6. Spring如何处理线程并发问题？

   Spring使用ThreadLocal解决线程安全问题

   我们知道在一般情况下，只有无状态的Bean才可以在多线程环境下共享，在Spring中，绝大部分Bean都可以声明为singleton作用域。就是因为Spring对一些Bean(如RequestContextHolder、TransactionSynchronizationManager、LocaleContextHolder等)中非线程安全状态采用ThreadLocal进行处理，让它们也成为线程安全的状态，因为有状态的Bean就可以在多线程中共享了。

   ThreadLocal和线程同步机制都是为了解决多线程中相同变量的访问冲突问题。

   在同步机制中，通过对象的锁机制保证同一时间只有一个线程访问变量。这时该变量是多个线程共享的，使用同步机制要求程序慎密地分析什么时候对变量进行读写，什么时候需要锁定某个对象，什么时候释放对象锁等繁杂的问题，程序设计和编写难度相对较大。

   而ThreadLocal则从另一个角度来解决多线程的并发访问。ThreadLocal会为每一个线程提供一个独立的变量副本，从而隔离了多个线程对数据的访问冲突。因为每一个线程都拥有自己的变量副本，从而也就没有必要对该变量进行同步了。ThreadLocal提供了线程安全的共享对象，在编写多线程代码时，可以把不安全的变量封装进ThreadLocal。

   由于ThreadLocal中可以持有任何类型的对象，低版本JDK所提供的get()返回的是Object对象，需要强制类型转换。但JDK5.0通过泛型很好的解决了这个问题，在一定程度地简化ThreadLocal的使用。

   概括起来说，对于多线程资源共享的问题，同步机制采用了“以时间换空间”的方式，而ThreadLocal采用了“以空间换时间”的方式。前者仅提供一份变量，让不同的线程排队访问，而后者为每一个线程都提供了一份变量，因此可以同时访问而互不影响。


7. Spring框架中bean的生命周期

   Spring容器中的bean的生命周期就显得相对复杂多了。正确理解Spring bean的生命周期非常重要，因为你或许要利用Spring提供的扩展点来自定义bean的创建过程。下图展示了bean装载到Spring应用上下文中的一个典型的生命周期过程。

   ![](https://gitee.com/cpfree/picture-warehouse/raw/master/pic1/1645438952031.png)

   1. Bean 实例化
   2. Bean 注入填充Bean属性
   3. 对 ApplicationContextAware 接口Bean 注入上下文引用
   4. BeanPostProcessor

8. 哪些是重要的bean生命周期方法？ 你能重载它们吗？

   bean 标签有两个重要的属性（init-method和destroy-method）。用它们你可以自己定制初始化和注销方法。它们也有相应的注解（@PostConstruct和@PreDestroy）。

## spring 框架

### spring 用到了哪些设计模式

IOC
   1. 工厂模式: BeanFactory就是简单工厂模式的体现，用来创建对象的实例;Spring使用工厂模式通过 ApplicationContext 创建 bean 对象。
   2. 单例模式: Bean默认为单例模式。

AOP
   1. 代理模式: Spring的AOP功能用到了JDK的动态代理和CGLIB字节码生成技术;

其它
   1. 委派模式 : SpringMVC 分发请求。
   2. 模板方法: 用来解决代码重复的问题。比如. RestTemplate, JmsTemplate, JpaTemplate。
   3. 观察者模式: Spring 事件驱动模型。定义对象键一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都会得到通知被制动更新，如Spring中listener的实现–ApplicationListener。
   4. refresh(): 模板
   5. 策略模式: spring中在实例化对象的时候用到Strategy模式，还有SpringMVC的Convert转换各种类型
   6. 适配器模式 :Spring AOP 的增强或通知(Advice)使用到了适配器模式、spring MVC 中Controller。

## FileSystemResource 和 ClassPathResource 有何区别

ClassPathResource在环境变量中读取配置文件，FileSystemResource在配置文件中读取配置文件

## Spring事件

Spring的ApplicationContext 提供了支持事件和代码中监听器的功能。

可以创建bean用来监听在ApplicationContext 中发布的事件。ApplicationEvent类和在ApplicationContext接口中处理的事件，如果一个bean实现了ApplicationListener接口，当一个ApplicationEvent 被发布以后，bean会自动被通知。

   ```java
   public class AllApplicationEventListener implements ApplicationListener<ApplicationEvent>{
      @Override
      public void onApplicationEvent(ApplicationEvent applicationEvent){
         //process event
      }
   }
   ```

Spring 提供了以下5中标准的事件: 

   1. 上下文更新事件（ContextRefreshedEvent）: 该事件会在ApplicationContext被初始化或者更新时发布。也可以在调用ConfigurableApplicationContext 接口中的refresh()方法时被触发。
   2. 上下文开始事件（ContextStartedEvent）: 当容器调用ConfigurableApplicationContext的Start()方法开始/重新开始容器时触发该事件。
   3. 上下文停止事件（ContextStoppedEvent）: 当容器调用ConfigurableApplicationContext的Stop()方法停止容器时触发该事件。
   4. 上下文关闭事件（ContextClosedEvent）: 当ApplicationContext被关闭时触发该事件。容器被关闭时，其管理的所有单例Bean都被销毁。
   5. 请求处理事件（RequestHandledEvent）: 在Web应用中，当一个http请求（request）结束触发该事件。
   6. 除了上面介绍的事件以外，还可以通过扩展ApplicationEvent 类来开发自定义的事件。

   ```java
   public class CustomApplicationEvent extends ApplicationEvent{
      public CustomApplicationEvent ( Object source, final String msg ){
         super(source);
         System.out.println("Created a Custom event");
      }
   }
   ```

   为了监听这个事件，还需要创建一个监听器: 

   ```java
   public class CustomEventListener implements ApplicationListener < CustomApplicationEvent >{
      @Override
      public void onApplicationEvent(CustomApplicationEvent applicationEvent) {
         //handle event
      }
   }
   ```

   之后通过applicationContext接口的publishEvent()方法来发布自定义事件。

   ```java
   CustomApplicationEvent customEvent = new CustomApplicationEvent(applicationContext, "Test message");
   applicationContext.publishEvent(customEvent);
   ```

## Spring-aop

1. Spring通知有哪些类型?

   在AOP术语中，切面的工作被称为通知，实际上是程序执行时要通过SpringAOP框架触发的代码段。

   Spring切面可以应用5种类型的通知：

   前置通知（Before）：在目标方法被调用之前调用通知功能；
   后置通知（After）：在目标方法完成之后调用通知，此时不会关心方法的输出是什么；
   返回通知（After-returning ）：在目标方法成功执行之后调用通知；
   异常通知（After-throwing）：在目标方法抛出异常后调用通知；
   环绕通知（Around）：通知包裹了被通知的方法，在被通知的方法调用之前和调用之后执行自定义的行为。
   同一个aspect，不同advice的执行顺序：

   ①没有异常情况下的执行顺序：

   around before advice
   before advice
   target method 执行
   around after advice
   after advice
   afterReturning
   ②有异常情况下的执行顺序：

   around before advice
   before advice
   target method 执行
   around after advice
   after advice
   afterThrowing:异常发生
   java.lang.RuntimeException: 异常发生

## Spring事务

1. spring 事务实现方式有哪些？

   Spring支持两种类型的事务管理：

   编程式事务管理：这意味你通过编程的方式管理事务，给你带来极大的灵活性，但是难维护。

   声明式事务管理：这意味着你可以将业务代码和事务管理分离，你只需用注解和XML配置来管理事务。
