# spring 事务失效的场景

<https://blog.csdn.net/lisu061714112/article/details/120098743>

要想 AOP 生效, 需要保证以下几点

1. 数据库和数据库表支持事务
   
2. 同一个数据库连接
   比如在同一个事务中使用了两个线程, 进而拿到了两个数据库连接, 因此肯定会出现问题

3. Spring 事务模块正常引入, 且开启事务.
   springboot 项目是自动开启事务的.
   spring 就需要自己配置事务

4. Bean被Spring容器管理.
   没有被spring容器管理, 肯定不生效

## AOP 失效导致的事务失效

要想事务生效, 首先代理需要生效

### 1. spring 要求被代理方法必须是 public 的.

   在 AbstractFallbackTransactionAttributeSource 类的 computeTransactionAttribute 方法中有个判断，如果目标方法不是 public，则 TransactionAttribute 返回 null，即不支持事务。

   > 在这个地方直接要求使用 public, 盲猜应该是为了保持JDK代理和Cglib代理的一致性, 统一使用public, 否则切换个代理方式就导致重要的事务一个执行, 一个不执行...

   ```java

	/**
	 * Should only public methods be allowed to have transactional semantics?
	 * <p>The default implementation returns {@code false}.
	 */
	protected boolean allowPublicMethodsOnly() {
		return false;
	}

   protected TransactionAttribute computeTransactionAttribute(Method method, @Nullable Class<?> targetClass) {
      // Don't allow no-public methods as required.
      if (allowPublicMethodsOnly() && !Modifier.isPublic(method.getModifiers())) {
         return null;
      }

      // The method may be on an interface, but we need attributes from the target class.
      // If the target class is null, the method will be unchanged.
      Method specificMethod = AopUtils.getMostSpecificMethod(method, targetClass);

      // First try is the method in the target class.
      TransactionAttribute txAttr = findTransactionAttribute(specificMethod);
      if (txAttr != null) {
         return txAttr;
      }

      // Second try is the transaction attribute on the target class.
      txAttr = findTransactionAttribute(specificMethod.getDeclaringClass());
      if (txAttr != null && ClassUtils.isUserLevelMethod(method)) {
         return txAttr;
      }

      if (specificMethod != method) {
         // Fallback is to look at the original method.
         txAttr = findTransactionAttribute(method);
         if (txAttr != null) {
            return txAttr;
         }
         // Last fallback is the class of the original method.
         txAttr = findTransactionAttribute(method.getDeclaringClass());
         if (txAttr != null && ClassUtils.isUserLevelMethod(method)) {
            return txAttr;
         }
      }
      return null;
   }
   ```

### 2. 方法用final修饰, 或者用 static 修饰

   cglib, 无法继承, 因此无法使用 AOP

### 3. 方法内部调用

   ```java
   @Service
   public class UserService {

      @Autowired
      private UserMapper userMapper;

      @Transactional
      public void add(UserModel userModel) {
         userMapper.insertUser(userModel);
         updateStatus(userModel);
      }

      @Transactional
      public void updateStatus(UserModel userModel) {
         doSameThing();
      }
   }
   ```

   在事务方法add中，直接调用事务方法updateStatus。从前面介绍的内容可以知道，updateStatus方法拥有事务的能力是因为spring aop生成代理了对象，但是这种方法直接调用了this对象的方法，所以updateStatus方法不会生成事务。

   由此可见，在同一个类中的方法直接内部调用，会导致事务失效。

解决方式参考如下几种

   1. 方法内部调用使得无法调用到代理对象, 此时需要将两个事务之间的调用放到不同的类里面.

   2. 从Spring AOP容器内获取到代理对象
   
      AopContext 可以专门解决这类问题

      ```java
      @Servcie
      public class ServiceA {

         public void save(User user) {
               queryData1();
               queryData2();
               ((ServiceA)AopContext.currentProxy()).doSave(user);
         }

         @Transactional(rollbackFor=Exception.class)
         public void doSave(User user) {
            addData1();
            updateData2();
         }
      }
      ```

   3. 自己注入自己(推荐)

      ```java
      @Servcie
      public class ServiceA {
         @Autowired
         prvate ServiceA serviceA;

         public void save(User user) {
               queryData1();
               queryData2();
               serviceA.doSave(user);
         }

         @Transactional(rollbackFor=Exception.class)
         public void doSave(User user) {
            addData1();
            updateData2();
         }
      }
      ```

### 数据库连接不同, 事务肯定不生效

spring的事务是通过数据库连接来实现的。当前线程中保存了一个map，key是数据源，value是数据库连接。

同一个事务，其实是指同一个数据库连接，只有拥有同一个数据库连接才能同时提交和回滚。如果在不同的线程，拿到的数据库连接肯定是不一样的，所以是不同的事务。

如下面的事务肯定不生效

   ```java
   @Slf4j
   @Service
   public class UserService {

      @Autowired
      private UserMapper userMapper;
      @Autowired
      private RoleService roleService;

      @Transactional
      public void add(UserModel userModel) throws Exception {
         userMapper.insertUser(userModel);
         new Thread(() -> {
               roleService.doOtherThing();
         }).start();
      }
   }

   @Service
   public class RoleService {

      @Transactional
      public void doOtherThing() {
         System.out.println("保存role表数据");
      }
   }

   ```

## Spring 事务不回滚的情况

1. catch了异常, 没有抛出

   自动事务回滚是通过异常来进行回滚的, catch了异常, 没有抛出, 因此回滚不了.

2. catch了异常, 结果抛出了其它的异常

   spring事务，默认情况下只会回滚RuntimeException（运行时异常）和Error（错误），对于普通的Exception（非运行时异常），它不会回滚。

3. 自定义了回滚异常

   ```java
   @Service
   public class UserService {
      
      @Transactional(rollbackFor = BusinessException.class)
      public void add(UserModel userModel) throws Exception {
         saveData(userModel);
         updateData(userModel);
      }
   }
   ```

   如果在执行上面这段代码，保存和更新数据时，程序报错了，抛了SqlException、DuplicateKeyException等异常。而BusinessException是我们自定义的异常，报错的异常不属于BusinessException，所以事务也不会回滚。

   spring 默认回滚RuntimeException和Error, 但是若是自定义了异常, 则会以自定义的为准, 此时若异常不是自定义异常, 哪怕是RuntimeException的话, 也不会再回滚了.

   建议不要使用spring默认回滚的异常, 而是将回滚异常手动设置为`Exception`或`Throwable`, 这样的话只要有异常就全部回滚了.

4. 异常回滚过多

   ```java
   public class UserService {

      @Autowired
      private UserMapper userMapper;

      @Autowired
      private RoleService roleService;

      @Transactional
      public void add(UserModel userModel) throws Exception {
         userMapper.insertUser(userModel);
         roleService.doOtherThing();
      }
   }

   @Service
   public class RoleService {

      @Transactional(propagation = Propagation.NESTED)
      public void doOtherThing() {
         System.out.println("保存role表数据");
      }
   }
   ```

   使用了嵌套的事务机制, 计划若是发生异常, 则仅仅回滚 `doOtherThing()`方法, 不回滚`add`方法, 但是由于没有catch, 因此异常会一直往上, 抛出, 因此最终将外层的事务也回滚了.

   解决方式, 在外层catch异常, 并处理掉异常.

