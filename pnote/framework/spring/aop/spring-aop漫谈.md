# 动态代理应用

1. java

   动态代理

## 植入

1. 静态织入

   aspectJ 拥有强大的静态植入能力

2. asm 动态植入，以及java中的动态代理

## spring-AOP 和 aspectJ

AspectJ能提供了强大的静态织入能力.

Spring中只集成了后者的语法，保留了自身的动态织入，利用后者解析AspectJ风格的表达式并生成Advisor，最终对target的织入只有JDK dynamic和Cglib两种方式。

Spring的AOP框架的基于代理的性质，`保护的方法是通过定义不拦截`，既不是JDK代理（其中，这是不适用），也不是CGLIB代理（其中这在技术上是可行的，但不建议用于AOP目的）。

Spring的AOP框架 对于 任何给定的切入点将仅与公共方法匹配！

如果您的拦截需求包括`protected/private`方法或`构造函数`，请考虑使用`Spring`驱动的本机`AspectJ`编织，而不是`Spring`的基于代理的AOP框架。

### 案例场景

假如有个类 `cn.a.Test`, 其中有一个方法 `protect void fun()`.

1. 使用AOP直接拦截保护方法

   ```java
   @Pointcut("execution(protected cn.a.Test.fun(..))") 
   ```

   > 如果写了protected，他就什么事情都不做，连protected的方法也不拦截。

2. 如果改为如下切入表达式

   ```java
   @Pointcut("execution(* cn.a.Test.fun(..))") 
   ```

   > 把 protected 换成 *, 则什么都匹配不到, 但是也不报错.


### Spring AOP 何时使用JDK代理, 何时使用Cglib

以下是spring源码(版本: `spring-aop:5.3.12`)

   ```java
   package org.springframework.aop.framework;

   import java.io.Serializable;
   import java.lang.reflect.Proxy;
   import org.springframework.aop.SpringProxy;
   import org.springframework.core.NativeDetector;

   public class DefaultAopProxyFactory implements AopProxyFactory, Serializable {
      public DefaultAopProxyFactory() {
      }

      public AopProxy createAopProxy(AdvisedSupport config) throws AopConfigException {
         // NativeDetector.inNativeImage(): 如果在图像构建的上下文中或在图像运行期间调用，则返回true ，否则返回false 。
         // config.isOptimize：表示是否使用了优化策略，配置的属性optimize值决定；
         // config.isProxyTargetClass：表示是否是代理目标类，配置的属性 proxy-target-class 值决定；
         // hasNoUserSuppliedProxyInterfaces：就是在判断代理的对象是否有实现接口
         if (NativeDetector.inNativeImage() || !config.isOptimize() && !config.isProxyTargetClass() && !this.hasNoUserSuppliedProxyInterfaces(config)) {
               return new JdkDynamicAopProxy(config);
         } else {
               Class<?> targetClass = config.getTargetClass();
               if (targetClass == null) {
                  throw new AopConfigException("TargetSource cannot determine target class: Either an interface or a target is required for proxy creation.");
               } else {
                  return (AopProxy)(!targetClass.isInterface() && !Proxy.isProxyClass(targetClass) ? new ObjenesisCglibAopProxy(config) : new JdkDynamicAopProxy(config));
               }
         }
      }

      // 确定提供的AdvisedSupport是否仅指定了SpringProxy接口（或根本没有指定代理接口）。
      // 没有实现 JDK 可代理的接口则返回 true
      private boolean hasNoUserSuppliedProxyInterfaces(AdvisedSupport config) {
         Class<?>[] ifcs = config.getProxiedInterfaces();
         return ifcs.length == 0 || ifcs.length == 1 && SpringProxy.class.isAssignableFrom(ifcs[0]);
      }
   }
   ```

从上面的代码可知, 在不考虑优化策略的默认情况下

1. 如果配置属性 `proxy-target-class` , 则以配置属性为准 `proxy-target-class`.
2. 如果目标对象实现了接口，默认情况下会采用JDK的动态代理实现AOP
3. 如果没有实现接口, 则以 CGlib 为主. 如果无法cglib代理, 则抛出异常.

> spring推荐使用JDK动态代理，因为高版本的JDK中，至少JDK1.6以上JDK动态代理的效率远高于CGLIB（无论是单例模式还是多例模式）
