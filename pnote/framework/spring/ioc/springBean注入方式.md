---
keys: 
type: blog
url: <>
id: 220206-211233
---

## spring 注入方式

1. Field Injection : 使用 `@Autowired` 或者 `@Resource`
2. Constructor Injection : 仅仅写一个构造方法, 在构造方法上面添加一个`@Autowired`
3. Setter Injection : set方法上面加一个 `@Autowired`

> 在 Spring 4.3 及以后的版本中 `Constructor Injection` 上面的 `@Autowired` 注解是可以不写的。

### 三种注入方式的优缺点分析1

1. 三种注入方式的优缺点分析

   ![](https://gitee.com/cpfree/picture-warehouse/raw/master/pic1/1644141208626.png)

   > Constructor Injection和Setter Injection的方式更容易Mock和注入对象，所以更容易实现单元测试。

   从图片中看Constructor Injection在很多方面都是优于其他两种方式的，所以Constructor Injection通常都是首选方案！

2. 注入异常

   1. Field Injection 使用对象或接口接收的话, 若是找不到Bean, 是会抛异常的.
      
      ```log
      Caused by: org.springframework.beans.factory.NoSuchBeanDefinitionException: No qualifying bean of type 'cn.hydroxyl.xxxx' available: expected at least 1 bean which qualifies as autowire candidate. 
      ```

      但是和`Optional` 结合用, 即便找不到 `Bean` 也不会抛异常

      ```java
      @Autowired
      private Optional<Comp> comp;
      ```

   2. Setter 方法即便没有找到 对应的Bean, 也不会抛异常, 因此更加适合测试.

### 三种注入方式的优缺点分析2

1. 基于 field 注入的好处: 简单, 方便

2. 基于 field 注入的坏处

   1. 容易违背了单一职责原则 
      使用这种基于 field 注入的方式，添加依赖是很简单的，就算你的类中有十几个依赖你可能都觉得没有什么问题，普通的开发者很可能会无意识地给一个类添加很多的依赖。但是当使用构造器方式注入，到了某个特定的点，构造器中的参数变得太多以至于很明显地发现something is wrong。拥有太多的依赖通常意味着你的类要承担更多的责任，明显违背了单一职责原则（SRP：Single responsibility principle）。

   2. 依赖注入与容器本身耦合

      依赖注入框架的核心思想之一就是受容器管理的类不应该去依赖容器所使用的依赖。换句话说，这个类应该是一个简单的POJO(Plain Ordinary Java Object)能够被单独实例化并且你也能为它提供它所需的依赖。

      这个问题具体可以表现在：

      - 你的类和依赖容器强耦合，不能在容器外使用
      - 你的类不能绕过反射（例如单元测试的时候）进行实例化，必须通过依赖容器才能实例化，这更像是集成测试

3. 使用 Setter 方法的优略

   基于 setter 的注入，则只应该被用于注入非必需的依赖，同时在类中应该对这个依赖提供一个合理的默认值。
   
   如果使用 setter 注入必需的依赖，那么将会有过多的 null 检查充斥在代码中。使用 setter 注入的一个优点是，这个依赖可以很方便的被改变或者重新注入 。

### spring 团队开发建议

1. 强制依赖就用构造器方式

2. 可选、可变的依赖就用setter 注入

   当然你可以在同一个类中使用这两种方法。构造器注入更适合强制性的注入旨在不变性，Setter注入更适合可变性的注入。

#### IDEA 提示 Field injection is not recommended

标准解决方案

```java
@Service
public class HelpService {
    private final Svc svc;

    @Autowired
    public HelpService(@Qualifier("svcB") Svc svc) {
        // Assert.notNull(svc, "svc must not be null");
        this.svc = svc;
    }

    public void sayHello() {
        svc.sayHello();
    }
}
```

## spring 其它注入方式

1. `Optional<>` 注入, 可以解决空指针问题.

   ```java
   @Autowired
   private Optional<ConfigBean> configBean;
   ```

   一般用在 `Configurable` 配置里面, `sentinel` 里面好像就是使用的这种注入方式, 可以有效解决空指针问题.

2. Map 依赖注入

   ```java
   @Autowired
   private Map<String, BaseService> map;
   ```

   普通的注入方式, 如果有多个BaseService实现的话会抛出异常的, 但是这个就不会

   其中key是bean的名字，value是实现BaseService的Bean，可根据bean的名字来获取bean实例，`适用于一个Web层需要使用多个BaseService实现类的情况`

3. List 注入

   ```java
   @Autowired
   private List<BaseService> list;
   ```

   也是可以同时注入 多个BaseService实现.
   但是注入的顺序是不确定的.

   可以通过 `@Order` 接口来排序, 如下面的Service.

   ```java
   @Order(1)
   @Service
   public class UserService extends BaseService<User>{}
   ```

## 实例

1. Setter 注入是可以注入 String 的, 但是不能注入基础数据和包装类, 如果参数是 `Integer` 和 `int` 的话, 是会报错的.

   ```java
   // 写Bean的时候返回个 Integer
   @Bean
   public Integer num() {
      return 9;
   }

   // 以下注入会报错
   @Autowired
   public void setNum(Integer num) {
      this.num = num;
   }
   ```

2. 类型注入是可以注入 String, Integer, int 这些数据的.

   如下, 都是可以注入成功的

   ```java
   @Autowired
   private Integer num1;

   @Autowired
   private int num2;
   ```

   甚至 写Bean的时候返回个 `int`, 之后注入的时候使用 `Integer`去接收, 都是可以的, 反过来也可以.

   ```java
   // 写Bean的时候返回个 int
   @Bean
   public int num() {
      return 9;
   }

   // 注入的时候使用 Integer 接收
   @Autowired
   private Integer num1;
   ```

## set 注入

假如说 `Comp` 是一个`Bean`

标准的 setter 注入是下面这样

   ```java
   @Component
   public class InjectTest {

      private Comp comp;
      
      @Autowired
      public void setComp(Comp comp) {
         this.comp = comp;
      }
   }
   ```

但是下面的也可以成功注入, Spring 注入的时候是根据参数进行判断的,

   ```java
   @Component
   public class InjectTest {

      private Comp comp;
      
      @Autowired
      public void h(Comp comp) {
         this.comp = comp;
      }
   }
   ```

甚至参数什么都不写, 也是可以注入的, 相当于 `@postContract`, 但是触发的时机不同, `@postContract` 触发的时间更晚.

   ```java
   @Component
   public class InjectTest {

      @Autowired
      public void fun() {
        System.out.println("成功调用了无参方法");
      }
   }
   ```

   > 即便是不写参数，只要加了`@Autowire`也是会正常调用 `fun`方法的.

## byname

依赖注入的时候，当一个接口有多个Bean实现时，一个@Autowired是无法确定具体注入那个Bean的。这个时候可以使用名称限定具体注入哪个Bean

如有以下两个Bean

   ```java
   @Bean
   public Comp hehe0() {
      return new Comp("hehe0");
   }
   @Bean
   public Comp haha1() {
      return new Comp("haha1");
   }
   ```

1. `@Qualifier注解`

   ```java
   @Autowired
   @Qualifier("hehe0")
   private Comp comp0;
   ```

2. 使用带name属性的@Resource,同样可以完成上面的效果。

   ```java
   @Resource(name="hehe0")
   private Comp comp0;
   ```