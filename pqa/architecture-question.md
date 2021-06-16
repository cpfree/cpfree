# architecture-question

## 面向对象——三层架构（表现层、业务层、持久层）

1. 持久层：采用DAO模式，建立实体类和数据库表映射（ORM(Object Relational Mapping)映射）。也就是哪个类对应哪个表，哪个属性对应哪个列。持久层的目的就是，完成对象数据和关系数据的转换。

2. 业务逻辑层：采用事务脚本模式。将一个业务中所有的操作封装成一个方法，同时保证方法中所有的数据库更新操作，即保证同时成功或同时失败。避免部分成功部分失败引起的数据混乱操作。

3. 表现层：采用MVC模式。
    M称为模型，也就是实体类。用于数据的封装和数据的传输。
    V为视图，也就是GUI组件，用于数据的展示。
    C为控制，也就是事件，用于流程的控制

设计原则：
业务层接口的设计原则：一个实体类一个接口，一次提交一个业务方法。业务方法的参数来自表现层。
持久层接口的设计原则：一个实体类一个接口，一次数据库操作一个持久方法。

## SpringMVC 简单介绍

- Spring MVC 提供了一种分离式的方法来开发 Web 应用。通过运用像 DispatcherServelet, MoudlAndView 和 ViewResolver 等一些简单的概念，开发 Web 应用将会变的非常简单。

- SpringMVC的工作流程
   1. 用户发送请求至前端控制器 DispatcherServlet
   2. DispatcherServlet 收到请求通过调用 HandlerMapping 处理器映射器，找到具体的处理器。
   3. DispatcherServlet 通过 HandlerAdapter 处理器适配器调用处理器Controller 得到返回 ModelAndView
   4. DispatcherServlet 将 ModelAndView 传给 ViewReslover 视图解析器解析后得到具体 View
   5. DispatcherServlet 对 View 进行渲染视图（即将模型数据填充至视图中）后响应用户

![SpringMVC的工作流程图1](https://gitee.com/cpfree/picture-warehouse/raw/master/pic/20210615192054.jpg)
![SpringMVC的工作流程图2](https://gitee.com/cpfree/picture-warehouse/raw/master/pic/20210615192219.png)=
