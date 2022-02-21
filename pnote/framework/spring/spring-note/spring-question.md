# Spring

## spring 用到了哪些设计模式

IOC
   1. 工厂模式: BeanFactory就是简单工厂模式的体现，用来创建对象的实例;
   2. 单例模式: Bean默认为单例模式。

AOP
   1. 代理模式: Spring的AOP功能用到了JDK的动态代理和CGLIB字节码生成技术;
   2. 模板方法: 用来解决代码重复的问题。比如. RestTemplate, JmsTemplate, JpaTemplate。
   3. 观察者模式: 定义对象键一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都会得到通知被制动更新，如Spring中listener的实现–ApplicationListener。

## 请解释各种自动装配模式的区别

- no: 默认值，表示没有自动装配，应使用显式 bean 引用进行装配。
- byName: 它根据 bean 的名称注入对象依赖项。
- byType: 它根据类型注入对象依赖项。
- 构造函数: 通过构造函数来注入依赖项，需要设置大量的参数。
- autodetect: 容器首先通过构造函数使用 autowire 装配，如果不能，则通过 byType 自动装配。

## Spring如何处理线程并发问题

Spring通过各种模板类降低了开发者使用各种数据持久技术的难度。这些模板类都是线程安全的，也就是说，多个DAO可以复用同一个模板实例而不会发生冲突。

在Spring中，绝大部分Bean都可以声明为singleton作用域，因为Spring对一些Bean中非线程安全状态采用ThreadLocal进行处理，解决线程安全问题。

ThreadLocal在Spring中发挥着重要的作用，在管理request作用域的Bean、事务管理、任务调度、AOP等模块都出现了它们的身影，起着举足轻重的作用。要想了解Spring事务管理的底层技术，ThreadLocal是必须攻克的山头堡垒。 

## Spring框架中bean的生命周期


//TODO

Spring容器中的bean的生命周期就显得相对复杂多了。正确理解Spring bean的生命周期非常重要，因为你或许要利用Spring提供的扩展点来自定义bean的创建过程。下图展示了bean装载到Spring应用上下文中的一个典型的生命周期过程。

![](image/spring-question/1645438952031.png)

1. Bean 实例化
2. Bean 注入填充Bean属性
3. 对 ApplicationContextAware 接口Bean 注入上下文引用
4. BeanPostProcessor


## 13 Spring框架中的单例Bean是线程安全的吗

Spring框架并没有对单例Bean进行任何多线程的封装处理。关于单例Bean的线程安全和并发问题需要开发者自行搞定。但实际上，大部分Spring Bean并没有可变的状态（比如Serview类和DAO类），所以在某种程度上说，Spring的单例Bean是线程安全的。如果你的Bean有多种状态（比如View Model对象），就需要自行保证线程安全。
最浅显的解决办法就是将多态Bean的作用域由“singleton”变更为“prototype”。

## 哪些是重要的bean生命周期方法？ 你能重载它们吗？

bean 标签有两个重要的属性（init-method和destroy-method）。用它们你可以自己定制初始化和注销方法。它们也有相应的注解（@PostConstruct和@PreDestroy）。

## 什么是Spring的内部bean？什么是Spring inner beans？
在Spring框架中，当一个bean仅被用作另一个bean的属性时，它能被声明为一个内部bean。内部bean可以用setter注入“属性”和构造方法注入“构造参数”的方式来实现，内部bean通常是匿名的，它们的Scope一般是prototype。


## Spring支持的事务管理类型， spring 事务实现方式有哪些？
Spring支持两种类型的事务管理：

编程式事务管理：这意味你通过编程的方式管理事务，给你带来极大的灵活性，但是难维护。

声明式事务管理：这意味着你可以将业务代码和事务管理分离，你只需用注解和XML配置来管理事务。

9. Spring通知有哪些类型？
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

六、Spring面向切面编程(AOP)
1. 什么是AOP
OOP(Object-Oriented Programming)面向对象编程，允许开发者定义纵向的关系，但并适用于定义横向的关系，导致了大量代码的重复，而不利于各个模块的重用。

AOP(Aspect-Oriented Programming)，一般称为面向切面编程，作为面向对象的一种补充，用于将那些与业务无关，但却对多个对象产生影响的公共行为和逻辑，抽取并封装为一个可重用的模块，这个模块被命名为“切面”（Aspect），减少系统中的重复代码，降低了模块间的耦合度，同时提高了系统的可维护性。可用于权限认证、日志、事务处理等。

2. Spring AOP and AspectJ AOP 有什么区别？AOP 有哪些实现方式？
AOP实现的关键在于 代理模式，AOP代理主要分为静态代理和动态代理。静态代理的代表为AspectJ；动态代理则以Spring AOP为代表。

（1）AspectJ是静态代理的增强，所谓静态代理，就是AOP框架会在编译阶段生成AOP代理类，因此也称为编译时增强，他会在编译阶段将AspectJ(切面)织入到Java字节码中，运行的时候就是增强之后的AOP对象。

（2）Spring AOP使用的动态代理，所谓的动态代理就是说AOP框架不会去修改字节码，而是每次运行时在内存中临时为方法生成一个AOP对象，这个AOP对象包含了目标对象的全部方法，并且在特定的切点做了增强处理，并回调原对象的方法。

3. JDK动态代理和CGLIB动态代理的区别
Spring AOP中的动态代理主要有两种方式，JDK动态代理和CGLIB动态代理：

JDK动态代理只提供接口的代理，不支持类的代理。核心InvocationHandler接口和Proxy类，InvocationHandler 通过invoke()方法反射来调用目标类中的代码，动态地将横切逻辑和业务编织在一起；接着，Proxy利用 InvocationHandler动态创建一个符合某一接口的的实例, 生成目标类的代理对象。
如果代理类没有实现 InvocationHandler 接口，那么Spring AOP会选择使用CGLIB来动态代理目标类。CGLIB（Code Generation Library），是一个代码生成的类库，可以在运行时动态的生成指定类的一个子类对象，并覆盖其中特定方法并添加增强代码，从而实现AOP。CGLIB是通过继承的方式做的动态代理，因此如果某个类被标记为final，那么它是无法使用CGLIB做动态代理的。
静态代理与动态代理区别在于生成AOP代理对象的时机不同，相对来说AspectJ的静态代理方式具有更好的性能，但是AspectJ需要特定的编译器进行处理，而Spring AOP则无需特定的编译器处理。

InvocationHandler 的 invoke(Object proxy,Method method,Object[] args)：proxy是最终生成的代理实例; method 是被代理目标实例的某个具体方法; args 是被代理目标实例某个方法的具体入参, 在方法反射调用时使用。


## 请举例说明如何在Spring中注入一个Java 集合？

Spring提供了以下四种集合类的配置元素: 

（1）<list>标签用来装配可重复的list值。 
（2）<set>标签用来装配没有重复的set值。 
（3）<map>标签可用来注入键和值，可以为任何类型的键值对。 
（4）<props>标签支持注入键和值都是字符串类型的键值对。 
下面看一下具体的例子: 
<beans>
   <bean id="javaCollection" class="com.gupaoedu.JavaCollection">
      <property name="customList">
         <list>
            <value>INDIA</value>
            <value>Pakistan</value>
            <value>USA</value>
            <value>UK</value>
         </list>
      </property>
      <property name="customSet">
         <set>
            <value>INDIA</value>
            <value>Pakistan</value>
            <value>USA</value>
            <value>UK</value>
         </set>
      </property>
      <property name="customMap">
         <map>
            <entry key="1" value="INDIA"/>
            <entry key="2" value="Pakistan"/>
            <entry key="3" value="USA"/>
            <entry key="4" value="UK"/>
         </map>
      </property>
      <property name="customProperies">
         <props>
            <prop key="admin">admin@gupaoedu.com</prop>
            <prop key="support">support@gupaoedu.com</prop>
         </props>
      </property>
   </bean>
</beans>

## 15  如何向Spring Bean中注入java.util.Properties？
第一种方法是使用如下面代码所示的标签: 
<bean id="adminUser" class="com.gupaoedu.common.Customer">
   <property name="emails">
      <props>
         <prop key="admin">admin@gupaoedu.com</prop>
         <prop key="support">support@gupaoedu.com</prop>
      </props>
   </property>
</bean>

也可用“util:”命名空间来从properties文件中创建一个propertiesbean，然后利用setter方法注入Bean的引用。


## 16  请解释Spring Bean的自动装配

## 17  自动装配有哪些局限性？

## 19  请举例解释@Required Annotation

```java
public class EmployeeFactoryBean extends AbstractFactoryBean<Object>{
    private String designation;

    public String getDesignation() {
        return designation;
    }

    @Required
    public void setDesignation(String designation) {
        this.designation = designation;
    }

    //more code here
}
```

RequiredAnnotationBeanPostProcessor是Spring中的后置处理用来验证被@Required 注解的bean属性是否被正确的设置了。在使用RequiredAnnotationBeanPostProcesso来验证bean属性之前，首先要在IoC容器中对其进行注册: 

```xml
<bean class="org.springframework.beans.factory.annotation.RequiredAnnotationBeanPostProcessor" />
```

## 22  Spring框架中有哪些不同类型的事件

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

## 23  FileSystemResource 和 ClassPathResource 有何区别

ClassPathResource在环境变量中读取配置文件，FileSystemResource在配置文件中读取配置文件

## 24  Spring 框架中都用到了哪些设计模式

单例模式 : Spring 中的 Bean 默认都是单例的。
工厂模式 : Spring使用工厂模式通过 BeanFactory、ApplicationContext 创建 bean 对象。
动态代理 : Spring AOP 功能的实现。
模板模式 : Spring 中 jdbcTemplate、hibernateTemplate 等以 Template 结尾的对数据库操作的类，它们就使用到了模板模式。
委派模式 : SpringMVC 分发请求。
观察者模式: Spring 事件驱动模型。
适配器模式 :Spring AOP 的增强或通知(Advice)使用到了适配器模式、spring MVC 中Controller。
策略模式: spring中在实例化对象的时候用到Strategy模式，还有SpringMVC的Convert转换各种类型

## 26  请解释下Spring框架中的IOC容器

IOC容器就是具有依赖注入功能的容器，IOC容器负责实例化、定位、配置应用程序中的对象及建立这些对象间的依赖。应用程序无需直接在代码中new相关的对象，应用程序由IOC容器进行组装。

Spring 的 IoC 容器就是一个实现了 BeanFactory 接口的可实例化类。事实上，Spring 提供了两种不同的容器: 一种是最基本的 BeanFactory，另一种是扩展的 ApplicationContext。BeanFactory 仅提供了最基本的依赖注入支持，而 ApplicationContext 则扩展了 BeanFactory , 提供了更多的额外功能。二者对 Bean 的初始化也有很大区别。BeanFactory 当需要调用时读取配置信息，生成某个类的实例。如果读入的 Bean 配置正确，则其他的配置中有错误也不会影响程序的运行。而 ApplicationContext 在初始化时就把 xml 的配置信息读入内存，对 XML 文件进行检验，如果配置文件没有错误，就创建所有的 Bean , 直接为应用程序服务。相对于基本的 BeanFactory，ApplicationContext 唯一的不足是占用内存空间。当应用程序配置 Bean 较多时，程序启动较慢。

## 27  在Spring中可以注入null或空字符串吗

可以
