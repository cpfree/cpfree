# aspectJ

相关 aspectj 文档

<https://blog.mythsman.com/post/5d301cf2976abc05b34546be/>

aspect 植入分为

1. 编译时织入
2. 编译后织入
3. 加载时织入(LTW)

## Spring Set注入

对Java beans的使用透着Spring整个团队的灵性，Rod Johnson和其团队在对JDK组件以及第三方开源中间件的使用上，不仅知其然更知其所以然，并在此基础上进行了合理的精简和扩展。

举一个例子，Spring中使用了AspectJ，AspectJ能提供了强大的静态织入能力，很多人也想当然的认为AspectJ是Aop的一种织入方式，事实上Spring做了取舍，只集成了后者的语法，保留了自身的动态织入，利用后者解析AspectJ风格的表达式并生成Advisor，最终对target的织入只有JDK dynamic和Cglib两种方式。

Spring beans也几乎是对Java beans的颠覆和升级，在后者的基础上，增加了更加强大的嵌套属性支持并有自己独特的表达式。

## Bean表达式

Bean表达式和Spring表达式（Spring Expression）是两码事，前者只是bean模块里内置简易功能，后者则是一个单独模块，两者既不是正交关系也不是平行关系。

Bean表达式主要用于对象和集合的注入，语法很简单，主要有两种：

以bean.propertyName代表bean的内部属性，并支持多级嵌套。每个点代表是一级路径，路径和路径之间是嵌套和包含关系。
以propertyName[index/key]代表集合类属性的内部元素，同样也支持多级嵌套。
支持两者混合使用，举例路径A.c.b1。这代表A的属性c下的属性b是个数组或者集合(假设其为aa)，则这个表达式是用来对aa的第2个元素map的name key绑定值。


