
## 三种配置bean方式

1. 基于XML的配置方式
2. 基于Java类的配置方式
3. 基于注解的配置方式

## Spring Bean作用域的区别是什么

Spring容器中的Bean可以分为5个范围。所有范围的名称都是自说明的，但是为了避免混淆，还是让我们来解释一下。

1. singleton: 这种Bean范围是默认的，这种范围确保不管接收到多少个请求，每个容器中只有一个Bean的实例，单例的模式由Bean Factory自身来维护。
2. prototype: 原形范围与单例范围相反，为每一个Bean请求提供一个实例。
3. request: 在请求Bean范围内为每一个来自客户端的网络请求创建一个实例，在请求完成以后，Bean会失效并被垃圾回收器回收。
4. Session: 与请求范围类似，确保每个Session中有一个Bean的实例，在Session过期后，Bean会随之失效。
5. global-session: global-session和Portlet应用相关。当你的应用部署在Portlet容器中时，它包含很多portlet。如果你想要声明让所有的portlet共用全局的存储变量，那么这个全局变量需要存储在global-session中。全局作用域与Servlet中的Session作用域效果相同。

## 讲述一下 核心容器 (spring context应用上下文) 模块

BeanFactory 是 任何以spring为基础的应用的核心。Spring 框架建立在此模块之上，它使Spring成为一个容器。

Bean 工厂是工厂模式的一个实现，提供了控制反转功能，用来把应用的配置和依赖从真正的应用代码中分离。最常用的就是org.springframework.beans.factory.xml.XmlBeanFactory ，它根据XML文件中的定义加载beans。该容器从XML 文件读取配置元数据并用它去创建一个完全配置的系统或应用。

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

内部Bean的声明方式如下: 

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

## Spring框架中有哪些不同类型的事件

Spring 提供了以下5种标准的事件：

上下文更新事件（ContextRefreshedEvent）：在调用ConfigurableApplicationContext 接口中的refresh()方法时被触发。
上下文开始事件（ContextStartedEvent）：当容器调用ConfigurableApplicationContext的Start()方法开始/重新开始容器时触发该事件。
上下文停止事件（ContextStoppedEvent）：当容器调用ConfigurableApplicationContext的Stop()方法停止容器时触发该事件。
上下文关闭事件（ContextClosedEvent）：当ApplicationContext被关闭时触发该事件。容器被关闭时，其管理的所有单例Bean都被销毁。
请求处理事件（RequestHandledEvent）：在Web应用中，当一个http请求（request）结束触发该事件。如果一个bean实现了ApplicationListener接口，当一个ApplicationEvent 被发布以后，bean会自动被通知。