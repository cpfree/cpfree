# springFactory

## BeanFactory

### BeanFactory 简介

BeanFactory 是工厂模式的一个实现，提供了 依赖注入 / 控制反转 功能，负责读取 bean 配置，管理 bean 的加载，实例化，维护 bean 之间的依赖关系，负责 bean 的声明周期。用来把应用的配置和依赖从正真的应用代码中分离。
BeanFactory 不像其他工厂模式的实现，他们只是分发一种类型的对象，而 Bean 工厂是一个通用的工厂，可以创建和分发各种类型的 Bean。
BeanFactory 使用延迟加载所有的 Bean，为了从 BeanhFactory 得到一个 Bean, 只要调用 getBean() 方法，就能获得 Bean，
> Spring 3.1 之前最常用的 BeanFactory 实现是 XmlBeanFactory 类，它根据 XML 文件中的定义加载 beans。该容器从 XML 文件读取配置元数据并用它去创建一个完全配置的系统或应用。Spring 3.1 以后已经废弃了 XmlBeanFactory 这个类了。推荐使用 **DefaultListableBeanFactory** 和 **XmlBeanDefinitionReader** 替换，两个类配合使用。

eg : 使用 ~~XmlBeanFactory~~ （Spring 3.1 以后已经 **废弃** 了这个类）

```JAVA
   public void testBean2() {
      BeanFactory factory = new XmlBeanFactory(new ClassPathResource("spring-bean.xml"));
      Person person = factory.getBean("person", Person.class);
      System.out.println(person);
   }
```

eg : 使用 **DefaultListableBeanFactory** & **XmlBeanDefinitionReader**

```Java
public void testIOC() throws Exception {
        // 现在，把对象的创建交给 spring 的 IOC 容器
        Resource resource = new ClassPathResource("cn/itcast/a_hello/applicationContext.xml");
        // 创建容器对象 (Bean 的工厂), IOC 容器 = 工厂类 + applicationContext.xml
        DefaultListableBeanFactory factory = new DefaultListableBeanFactory();
        // 得到容器创建的对象
        XmlBeanDefinitionReader reader = new XmlBeanDefinitionReader(factory);// 新增 XMl 阅读器
        reader.loadBeanDefinitions(resource);
        User user = (User) factory.getBean("user1");
        System.out.println(user.getId());
}
```

### BeanFactory 继承结构

BeanFactory 继承结构图
![DefaultListableBeanFactory](https://gitee.com/cpfree/picture-warehouse/raw/master/pic/20210615191131.png)

其中 BeanFactory 作为最顶层的一个接口类，它定义了 IOC 容器的基本功能规范，BeanFactory 有三个子类：ListableBeanFactory、HierarchicalBeanFactory 和 AutowireCapableBeanFactory。但是从上图中我们可以发现最终的默认实现类是 DefaultListableBeanFactory，他实现了所有的接口。那为何要定义这么多层次的接口呢？查阅这些接口的源码和说明发现，每个接口都有他使用的场合，它主要是为了区分在 Spring 内部在操作过程中对象的传递和转化过程中，对对象的数据访问所做的限制。

- ListableBeanFactory 接口表示这些 Bean 是可列表的.
- HierarchicalBeanFactory 表示的是这些 Bean 是有继承关系的，也就是每个 Bean 有可能有父 Bean。
- AutowireCapableBeanFactory 接口定义 Bean 的自动装配规则。这四个接口共同定义了 Bean 的集合、Bean 之间的关系、以及 Bean 行为.

![BeanFactory 类关系继承图](https://gitee.com/cpfree/picture-warehouse/raw/master/pic/20210615191221.jpg)

## ApplicationContext

### ApplicationContext 简介

应用上下文（ApplicationContext 接口），建立在 BeanFactory 基础之上（*ApplicationContext 接口扩展于 BeanFactory 接口 *），除了提供上述 BeanFactory 所能提供的功能之外，还额外提供了系统架构服务。
   a、提供文本信息解析，支持 I18N
   b、提供载入文件资源的通用方法
   c、向注册为监听器的 Bean 发送事件
   d、ApplicationContext 接口扩展 BeanFactory 接口
   e、ApplicationContext 提供附加功能

1. ApplicationContext 的三个经常用到的实现类：
   a. ClassPathXmlApplication ：把上下文文件当成类路径资源
   b. FileSystemXmlApplication ：从文件系统中的 XML 文件载入上下文定义信息
   c. XmlWebApplicationContext ：从 Web 系统中的 XML 文件载入上下文定义信息

   第一种和第二种的区别在于，ClassPathXmlApplication 可以在整个类路径（包括 JAR 文件）中寻找定义 Bean 的 XML 文件；而 FileSystemXmlApplication 只能在指定路径中寻找。

   ```java
   // FileSystemXmlApplication
   ApplicationContext context = new FileSystemXmlApplicationContext("c:/pirate.xml");
   // ClassPathXmlApplication
   ApplicationContext context = new ClassPathXmlApplicationContext("pirate.xml");
   ```

#### Resource

   要创建 XmlBeanFactory，需要传递一个 org.springframework.core.io.Resource 实例给构造函数。此 Resource 对象提供 XML 文件给工厂。

> 有以下几种方式配置 XML 源：

   org.springframework.core.io.ByteArrayResource
   org.springframework.core.io.ClassPathResource
   org.springframework.core.io.DescriptiveResource
   org.springframework.core.io.FileSystemResource
   org.springframework.core.io.InputStreamResource
   org.springframework.web.portlet.contentx.PortletContextResource
   org.springframework.web.context.support.ServletContextResource
   org.springframework.core.io.UrlResource

### Bean 设置：设值注入：

1. 简单配置

```XML
<bean id="xxx" class="Bean 的全称类名">
   <!-- value 中的值可以是基本数据类型或者 String 类型，spring 将会自动判断设置的类型并且将其转换成合适的值 -->
   <property name="xx" value="xxxxx"></property>
</bean>
```

1. 引用配置

```XML
<bean id="xxx" class="Bean 的全称类名">
   <!-- ref 中的值是引用数据类型，spring 容器会完成获取工作 -->
   <property name="xx" ref="xxxxx"></property>
</bean>
```

1. List 和数组

```XML
<bean id="xxx" class="Bean 的全称类名">
   <property name="list">
      <!-- list 元素内可以是任何元素，但不能违背 Bean 所需要的对象类型 -->
      <list>
         <value>xxxxx</value>
         <ref bean="xxxxx"/>
      </list>
   </property>
</bean>
```

1. Set 配置：和 \<list\> 一样，将 \<list\> 改成 \<set\>。
2. Map 配置：Map 中的每条数据是由一个键和一个值组成，用 \<entry\> 元素来定义。

```XML
<bean id="xxx" class="Bean 的全称类名">
   <!-- 注意：配置 entry 时，属性 key 的值只能是 String，因为 Map 通常用 String 作为主键 -->
   <property name="list">
      <entry key="key1">
         <value></value>
      </entry>
   </property>
</bean>
<bean id="xxx" class="Bean 的全称类名">
   <property name="list">
      <entry key="key1">
         <ref bean=""/>
      </entry>
   </property>
</bean>
```

c. 事件传递：通过实现 ApplicationContextAware 接口
1. 常用的获取 ApplicationContext 的方法：
   FileSystemXmlApplicationContext：从文件系统或者 url 指定的 xml 配置文件创建，参数为配置文件名或文件名数组
   ClassPathXmlApplicationContext：从 classpath 的 xml 配置文件创建，可以从 jar 包中读取配置文件
   WebApplicationContextUtils：从 web 应用的根目录读取配置文件，需要先在 web.xml 中配置，可以配置监听器或者 servlet 来实现

   ```XML
   <listener>
      <listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
   </listener>
   <servlet>
      <servlet-name>context</servlet-name>
      <servlet-class>org.springframework.web.context.ContextLoaderServlet</servlet-class>
      <load-on-startup>1</load-on-startup>
   </servlet>
   这两种方式都默认配置文件为 web-inf/applicationContext.xml，也可使用 context-param 指定配置文件
   <context-param>
      <param-name>contextConfigLocation</param-name>
      <param-value>/WEB-INF/myApplicationContext.xml</param-value>
   </context-param>
   ```

### BeanFactory 和 ApplicationContext 的区别

BeanFactory 和 ApplicationContext 的一个大的区别是：BeanFactory 在初始化容器时，并未实例化 Bean，直到第一次访问某个 Bean 时才实例目标 Bean；而 ApplicationContext 则在初始化应用上下文时就实例化所有单实例的 Bean。
ApplicationContext 会利用 Java 反射机制自动识别出配置文件中定义的 BeanPostProcessor、InstantiationAwareBeanPostProcessor 和 BeanFactoryPostProcessor，并将它们自动注册到应用上下文中；而 BeanFactory 需要我们手工调用 addBeanPostProcessor() 方法进行注册. 下面我们来看一下 ApplicationContext 中 Bean 的生命周期的图示：

![AbstractApplicationContext.refresh()](https://gitee.com/cpfree/picture-warehouse/raw/master/pic/20210615174107.jpg)
