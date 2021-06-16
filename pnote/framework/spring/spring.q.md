11  Spring Bean作用域的区别是什么？
Spring容器中的Bean可以分为5个范围。所有范围的名称都是自说明的，但是为了避免混淆，还是让我们来解释一下。
（1）singleton：这种Bean范围是默认的，这种范围确保不管接收到多少个请求，每个容器中只有一个Bean的实例，单例的模式由Bean Factory自身来维护。 
（2）prototype：原形范围与单例范围相反，为每一个Bean请求提供一个实例。 
（3）request：在请求Bean范围内为每一个来自客户端的网络请求创建一个实例，在请求完成以后，Bean会失效并被垃圾回收器回收。 
（4）Session：与请求范围类似，确保每个Session中有一个Bean的实例，在Session过期后，Bean会随之失效。
（5）global-session：global-session和Portlet应用相关。当你的应用部署在Portlet容器中时，它包含很多portlet。如果你想要声明让所有的portlet共用全局的存储变量，那么这个全局变量需要存储在global-session中。全局作用域与Servlet中的Session作用域效果相同。

12  什么是Spring Inner Bean？
在Spring框架中，无论何时Bean被使用时，当仅被调用了一个属性，一个明智的做法是将这个Bean声明为内部Bean。内部Bean可以用setter注入"属性"和用构造方法注入"构造参数"的方式来实现。
比如，在我们的应用程序中，一个Customer类引用了一个Person类，我们要做的是创建一个Person的实例，然后在Customer内部使用。
public class Customer{
   private Person person;
}
public class Person{
   private String name;
   private String address;
   private int age;
}

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

13  Spring框架中的单例Bean是线程安全的吗？
Spring框架并没有对单例Bean进行任何多线程的封装处理。关于单例Bean的线程安全和并发问题需要开发者自行搞定。但实际上，大部分Spring Bean并没有可变的状态（比如Serview类和DAO类），所以在某种程度上说，Spring的单例Bean是线程安全的。如果你的Bean有多种状态（比如View Model对象），就需要自行保证线程安全。
最浅显的解决办法就是将多态Bean的作用域由"singleton"变更为"prototype"。

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

也可用"util:"命名空间来从properties文件中创建一个propertiesbean，然后利用setter方法注入Bean的引用。
