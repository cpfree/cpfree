# Spring

## 11 Spring Bean作用域的区别是什么

Spring容器中的Bean可以分为5个范围。所有范围的名称都是自说明的，但是为了避免混淆，还是让我们来解释一下。

1. singleton：这种Bean范围是默认的，这种范围确保不管接收到多少个请求，每个容器中只有一个Bean的实例，单例的模式由Bean Factory自身来维护。
2. prototype：原形范围与单例范围相反，为每一个Bean请求提供一个实例。
3. request：在请求Bean范围内为每一个来自客户端的网络请求创建一个实例，在请求完成以后，Bean会失效并被垃圾回收器回收。
4. Session：与请求范围类似，确保每个Session中有一个Bean的实例，在Session过期后，Bean会随之失效。
5. global-session：global-session和Portlet应用相关。当你的应用部署在Portlet容器中时，它包含很多portlet。如果你想要声明让所有的portlet共用全局的存储变量，那么这个全局变量需要存储在global-session中。全局作用域与Servlet中的Session作用域效果相同。

## 12 什么是Spring Inner Bean

在Spring框架中，无论何时Bean被使用时，当仅被调用了一个属性，一个明智的做法是将这个Bean声明为内部Bean。内部Bean可以用setter注入“属性”和用构造方法注入“构造参数”的方式来实现。
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

内部Bean的声明方式如下：

   ```xml
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

## 13 Spring框架中的单例Bean是线程安全的吗

Spring框架并没有对单例Bean进行任何多线程的封装处理。关于单例Bean的线程安全和并发问题需要开发者自行搞定。但实际上，大部分Spring Bean并没有可变的状态（比如Serview类和DAO类），所以在某种程度上说，Spring的单例Bean是线程安全的。如果你的Bean有多种状态（比如View Model对象），就需要自行保证线程安全。
最浅显的解决办法就是将多态Bean的作用域由“singleton”变更为“prototype”。
14  请举例说明如何在Spring中注入一个Java 集合？
Spring提供了以下四种集合类的配置元素：

（1）<list>标签用来装配可重复的list值。 
（2）<set>标签用来装配没有重复的set值。 
（3）<map>标签可用来注入键和值，可以为任何类型的键值对。 
（4）<props>标签支持注入键和值都是字符串类型的键值对。 
下面看一下具体的例子：
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
15  如何向Spring Bean中注入java.util.Properties？
第一种方法是使用如下面代码所示的标签：
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

## 18  请解释各种自动装配模式的区别

no：默认值，表示没有自动装配，应使用显式 bean 引用进行装配。
byName：它根据 bean 的名称注入对象依赖项。
byType：它根据类型注入对象依赖项。
构造函数：通过构造函数来注入依赖项，需要设置大量的参数。
autodetect：容器首先通过构造函数使用 autowire 装配，如果不能，则通过 byType 自动装配。

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

RequiredAnnotationBeanPostProcessor是Spring中的后置处理用来验证被@Required 注解的bean属性是否被正确的设置了。在使用RequiredAnnotationBeanPostProcesso来验证bean属性之前，首先要在IoC容器中对其进行注册：

```xml
<bean class="org.springframework.beans.factory.annotation.RequiredAnnotationBeanPostProcessor" />
```

## 20  请举例说明@Qualifier注解

依赖注入的时候，当一个接口有多个Bean实现时，一个@Autowired是无法确定具体注入那个Bean的。这个时候可以使用@Qualifier限定具体注入哪个Bean
使用带name属性的@Resource,同样可以完成上面的效果。

## 21  构造方法注入和设值注入有什么区别

1. 在Setter注入, 可以将依赖项部分注入, 构造方法注入不能部分注入。

2. 如果同一属性既可以Setter注入，也可以构造方法注入， 那么Setter注入可以覆盖构造方法注入，反之不行。

3. 构造方法注入适合创建必要构造参数，Setter方法注入适合非强制依赖注入。

4. 循环依赖问题，A和B对象相互依赖，如果仅仅使用构造方法注入，则会抛出异常，但是Setter方法注入可以解决循环依赖问题。、

5. 构造方法注入只能在构造期间注入，**代码偏强**，需要稍稍注意写代码的逻辑，代码写的有问题很容易就报错，bug很容易发现，可以有效减少代码bug。

6. Setter方法注入提供过多的修改入口，**代码偏弱**，可以傻瓜小白式写代码，即便代码写的乱起八糟，也能正常运行，一旦有bug，很难发现。

7. 构造方法注入必要参数，setter方法注入非必要参数也是一种方法。

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

Spring 提供了以下5中标准的事件：

1. 上下文更新事件（ContextRefreshedEvent）：该事件会在ApplicationContext被初始化或者更新时发布。也可以在调用ConfigurableApplicationContext 接口中的refresh()方法时被触发。
2. 上下文开始事件（ContextStartedEvent）：当容器调用ConfigurableApplicationContext的Start()方法开始/重新开始容器时触发该事件。
3. 上下文停止事件（ContextStoppedEvent）：当容器调用ConfigurableApplicationContext的Stop()方法停止容器时触发该事件。
4. 上下文关闭事件（ContextClosedEvent）：当ApplicationContext被关闭时触发该事件。容器被关闭时，其管理的所有单例Bean都被销毁。
5. 请求处理事件（RequestHandledEvent）：在Web应用中，当一个http请求（request）结束触发该事件。
6. 除了上面介绍的事件以外，还可以通过扩展ApplicationEvent 类来开发自定义的事件。

   ```java
   public class CustomApplicationEvent extends ApplicationEvent{
      public CustomApplicationEvent ( Object source, final String msg ){
         super(source);
         System.out.println("Created a Custom event");
      }
   }
   ```

   为了监听这个事件，还需要创建一个监听器：

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
委派模式 ：SpringMVC 分发请求。
观察者模式: Spring 事件驱动模型。
适配器模式 :Spring AOP 的增强或通知(Advice)使用到了适配器模式、spring MVC 中Controller。
策略模式：spring中在实例化对象的时候用到Strategy模式，还有SpringMVC的Convert转换各种类型
装饰模式：Spring连接多个数据库时，通过传入不同的数据源DadaSource，执行不同的动作。

## 25  在Spring框架中如何更有效地使用JDBC

没搞明白什么意思

## 26  请解释下Spring框架中的IOC容器

IOC容器就是具有依赖注入功能的容器，IOC容器负责实例化、定位、配置应用程序中的对象及建立这些对象间的依赖。应用程序无需直接在代码中new相关的对象，应用程序由IOC容器进行组装。

Spring 的 IoC 容器就是一个实现了 BeanFactory 接口的可实例化类。事实上，Spring 提供了两种不同的容器：一种是最基本的 BeanFactory，另一种是扩展的 ApplicationContext。BeanFactory 仅提供了最基本的依赖注入支持，而 ApplicationContext 则扩展了 BeanFactory , 提供了更多的额外功能。二者对 Bean 的初始化也有很大区别。BeanFactory 当需要调用时读取配置信息，生成某个类的实例。如果读入的 Bean 配置正确，则其他的配置中有错误也不会影响程序的运行。而 ApplicationContext 在初始化时就把 xml 的配置信息读入内存，对 XML 文件进行检验，如果配置文件没有错误，就创建所有的 Bean , 直接为应用程序服务。相对于基本的 BeanFactory，ApplicationContext 唯一的不足是占用内存空间。当应用程序配置 Bean 较多时，程序启动较慢。

## 27  在Spring中可以注入null或空字符串吗

可以
