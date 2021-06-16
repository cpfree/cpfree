# SpringBoot 自动装配

> 注意: 以Spring 2.5.0 为例, 早期版本有所不同.

自动配置是 SpringBoot 框架思想的核心实现, 它指的是springBoot 启动时, 会自动将需要的组件导入 IOC 容器, 省去了之前各种繁琐的配置.

## 自动装配代码剖析

1. 首先看下 `@SpringBootApplication` 注解(以我看得懂的方式展示😁)

   ```java
   // FIXME: 注意这个地方是 SpringBoot 2.5.0版本, 早期版本有所不同.
   @SpringBootApplication {
      @EnableAutoConfiguration { // 开启自动配置功能的注解
         @Import(AutoConfigurationImportSelector.class) // 决定哪些配置类和组件需要导入我们项目
         @Target(ElementType.TYPE)
         @Retention(RetentionPolicy.RUNTIME)
         @Documented
         @Inherited
         @AutoConfigurationPackage
      }
      @Target(ElementType.TYPE)
      @Retention(RetentionPolicy.RUNTIME)
      @Documented
      @Inherited
      @SpringBootConfiguration
      @ComponentScan(excludeFilters = { @Filter(type = FilterType.CUSTOM, classes = TypeExcludeFilter.class),
         @Filter(type = FilterType.CUSTOM, classes = AutoConfigurationExcludeFilter.class) })
   }
   ```

   > `@SpringBootApplication -> @EnableAutoConfiguration -> @Import(AutoConfigurationImportSelector.class)`

   大体就是 `@SpringBootApplication` 注解里面有个 `AutoConfigurationImportSelector`, 而 `AutoConfigurationImportSelector` 就是自动装配的相关代码类.

2. `AutoConfigurationImportSelector` 解析

   ```java
   package org.springframework.boot.autoconfigure;
   
   public class AutoConfigurationImportSelector implements DeferredImportSelector, BeanClassLoaderAware,
         ResourceLoaderAware, BeanFactoryAware, EnvironmentAware, Ordered {
   
      ...
   
      @Override
      public String[] selectImports(AnnotationMetadata annotationMetadata) {
         if (!isEnabled(annotationMetadata)) {
            return NO_IMPORTS;
         }
         // 1. 获取自动配置
         AutoConfigurationEntry autoConfigurationEntry = getAutoConfigurationEntry(annotationMetadata);
         return StringUtils.toStringArray(autoConfigurationEntry.getConfigurations());
      }
   
      protected AutoConfigurationEntry getAutoConfigurationEntry(AnnotationMetadata annotationMetadata) {
         if (!isEnabled(annotationMetadata)) {
            return EMPTY_ENTRY;
         }
         // 获取＠EnableAutoConfiguration注解中的属性exclude、excludeName等。
         AnnotationAttributes attributes = getAttributes(annotationMetadata);
         // 2. 获得所有自动装配的配置类 (加载jar包中的 META-INF/spring.factories 配置, 并获取其中的 org.springframework.boot.autoconfigure.EnableAutoConfiguration 的值.)
         List<String> configurations = getCandidateConfigurations(annotationMetadata, attributes);
         // 7. 去重操作, 简单的逻辑
         configurations = removeDuplicates(configurations);
         // 8. 根据＠EnableAutoConfiguration注解中配置的exclude等属性，把不需要自动装配的配置类移除。
         Set<String> exclusions = getExclusions(annotationMetadata, attributes);
         checkExcludedClasses(configurations, exclusions);
         configurations.removeAll(exclusions);
         configurations = getConfigurationClassFilter().filter(configurations);
         // 广播事件
         fireAutoConfigurationImportEvents(configurations, exclusions);
         // 最后返回经过多层判断和过滤之后的配置类集合。
         return new AutoConfigurationEntry(configurations, exclusions);
      }
   
      protected List<String> getCandidateConfigurations(AnnotationMetadata metadata, AnnotationAttributes attributes) {
         // 3. 加载配置, 
         // getSpringFactoriesLoaderFactoryClass() 返回的是 EnableAutoConfiguration.class;
         // 后续操作在 SpringFactoriesLoader.loadFactoryNames 方法
         // getBeanClassLoader() 返回的是 当前 AutoConfigurationImportSelector 的 this.beanClassLoader
         List<String> configurations = SpringFactoriesLoader.loadFactoryNames(getSpringFactoriesLoaderFactoryClass(),
               getBeanClassLoader());
         Assert.notEmpty(configurations, "No auto configuration classes found in META-INF/spring.factories. If you "
               + "are using a custom packaging, make sure that file is correct.");
         return configurations;
      }
   }
   
   ```

   `org.springframework.core.io.support.SpringFactoriesLoader.java`

   ```java
   package org.springframework.core.io.support;
   
   public final class SpringFactoriesLoader {
   
      public static List<String> loadFactoryNames(Class<?> factoryType, @Nullable ClassLoader classLoader) {
         ClassLoader classLoaderToUse = classLoader;
         if (classLoader == null) {
               classLoaderToUse = SpringFactoriesLoader.class.getClassLoader();
         }
         // 4. 由 3 处可知, 此时 factoryType 是 EnableAutoConfiguration.class
         // 所以 factoryTypeName = "org.springframework.boot.autoconfigure.EnableAutoConfiguration"
         String factoryTypeName = factoryType.getName();
         // 5. 加载jar包中的 META-INF/spring.factories 配置, 并获取其中的 org.springframework.boot.autoconfigure.EnableAutoConfiguration 的值.
         return (List)loadSpringFactories(classLoaderToUse)
            .getOrDefault(factoryTypeName, Collections.emptyList());
      }
   
      // 整个类的作用是加载 classLoader 中的 META-INF/spring.factories
      private static Map<String, List<String>> loadSpringFactories(ClassLoader classLoader) {
         Map<String, List<String>> result = (Map)cache.get(classLoader);
         if (result != null) {
               return result;
         } else {
               HashMap result = new HashMap();
               try {
                  // 6. 从这个地方可以清楚的看出是加载了 `META-INF/spring.factories`
                  Enumeration urls = classLoader.getResources("META-INF/spring.factories");
   
                  while(urls.hasMoreElements()) {
                     URL url = (URL)urls.nextElement();
                     UrlResource resource = new UrlResource(url);
                     Properties properties = PropertiesLoaderUtils.loadProperties(resource);
                     Iterator var6 = properties.entrySet().iterator();
   
                     while(var6.hasNext()) {
                           Entry<?, ?> entry = (Entry)var6.next();
                           String factoryTypeName = ((String)entry.getKey()).trim();
                           String[] factoryImplementationNames = StringUtils.commaDelimitedListToStringArray((String)entry.getValue());
                           String[] var10 = factoryImplementationNames;
                           int var11 = factoryImplementationNames.length;
   
                           for(int var12 = 0; var12 < var11; ++var12) {
                              String factoryImplementationName = var10[var12];
                              ((List)result.computeIfAbsent(factoryTypeName, (key) -> {
                                 return new ArrayList();
                              })).add(factoryImplementationName.trim());
                           }
                     }
                  }
   
                  result.replaceAll((factoryType, implementations) -> {
                     return (List)implementations.stream().distinct().collect(Collectors.collectingAndThen(Collectors.toList(), Collections::unmodifiableList));
                  });
                  cache.put(classLoader, result);
                  return result;
               } catch (IOException var14) {
                  throw new IllegalArgumentException("Unable to load factories from location [META-INF/spring.factories]", var14);
               }
         }
      }
   }
   ```

## 自动装配原理说明

1. `@SpringBootApplication` 注解里面有个 `AutoConfigurationImportSelector`, 而 `AutoConfigurationImportSelector` 就是自动装配的相关代码类.
2. AutoConfigurationImportSelector中的selectImports方法，它是ImportSelector接口的实现，这个方法中主要有两个功能：
   1. AutoConfigurationMetadataLoader.loadMetadata 从`META-INF/spring-autoconfigure-metadata.properties`中加载自动装配的条件元数据，简单来说就是只有满足条件的Bean才能装配
   2. 收集所有符合条件的配置类 autoConfigurationEntry.getConfigurations（），完成自动装配。
3. ＠Configuration 条件装配注解
   ＠Conditional是Spring Framework提供的一个核心注解，这个注解的作用是提供自动装配的条件约束，一般与＠Configuration和＠Bean配合使用。
   简单来说，Spring在解析＠Configuration配置类时，如果该配置类增加了＠Conditional注解，那么会根据该注解配置的条件来决定是否要实现Bean的装配。
4. 在Spring Boot中，针对＠Conditional做了扩展，提供了更简单的使用形式，扩展注解如下：
   * ConditionalOnBean/ConditionalOnMissingBean：容器中存在某个类或者不存在某个Bean时进行Bean装载。
   * ConditionalOnClass/ConditionalOnMissingClass：classpath下存在指定类或者不存在指定类时进行Bean装载。
   * ConditionalOnCloudPlatform：只有运行在指定的云平台上才加载指定的Bean。
   * ConditionalOnExpression：基于SpEl表达式的条件判断。
   * ConditionalOnJava：只有运行指定版本的Java才会加载Bean。
   * ConditionalOnJndi：只有指定的资源通过JNDI加载后才加载Bean。
   * ConditionalOnWebApplication/ConditionalOnNotWebApplication：如果是Web应用或者不是Web应用，才加载指定的Bean。
   * ConditionalOnProperty：系统中指定的对应的属性是否有对应的值。
   * ConditionalOnResource：要加载的Bean依赖指定资源是否存在于classpath中。
   * ConditionalOnSingleCandidate：只有在确定了给定Bean类的单个候选项时才会加载Bean。
5. spring-autoconfigure-metadata
   除了＠Conditional注解类，在Spring Boot中还提供了spring-autoconfigure-metadata.properties文件来实现批量自动装配条件配置。
   它的作用和＠Conditional是一样的，只是将这些条件配置放在了配置文件中。下面这段配置来自spring-boot-autoconfigure.jar包中的`/META-INF/spring-autoconfigure-metadata.properties`文件。
   这种配置方法的好处在于，它可以有效地降低Spring Boot的启动时间，通过这种过滤方式可以减少配置类的加载数量，因为这个过滤发生在配置类的装载之前，所以它可以降低Spring Boot启动时装载Bean的耗时。

   ![img](https://gitee.com/cpfree/picture-warehouse/raw/master/pic/20210616102423.png)

   **自动配置类必须在一定的条件下才能生效；
   我们怎么知道哪些自动配置类生效；我们可以通过在配置文件中启用 debug=true 属性；来让控制台打印自动配置报告，这样我们就可以很方便的知道哪些自动配置类生效；**
   ![img](https://gitee.com/cpfree/picture-warehouse/raw/master/pic/20210616102417.png)
   **自动配置报告:**
   ![img](https://gitee.com/cpfree/picture-warehouse/raw/master/pic/20210616102410.png)
   **不生效的**
   ![img](https://gitee.com/cpfree/picture-warehouse/raw/master/pic/20210616102400.png)

手动实现一个 `Starter`
   项目地址
