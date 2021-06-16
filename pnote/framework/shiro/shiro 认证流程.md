
# 身份验证

## 流程

### 环境及代码准备

环境

   SDK : jdk1.8
   IDE : IDEA

pom文件

   ```xml
      <!-- shiro -->
      <dependency>
         <groupId>org.apache.shiro</groupId>
         <artifactId>shiro-ehcache</artifactId>
         <version>1.4.0</version>
      </dependency>
      <dependency>
         <groupId>org.apache.shiro</groupId>
         <artifactId>shiro-spring</artifactId>
         <version>1.4.0</version>
      </dependency>
   ```

配置文件 `shiro.int`

   ```ini
   [users]
   zhang=123
   wang=123
   ```

java 代码

   ```java
   package cn.cpf.web.boot.shiro;

   import org.apache.shiro.SecurityUtils;
   import org.apache.shiro.authc.AuthenticationException;
   import org.apache.shiro.authc.UsernamePasswordToken;
   import org.apache.shiro.mgt.DefaultSecurityManager;
   import org.apache.shiro.realm.text.IniRealm;
   import org.apache.shiro.subject.Subject;
   import org.junit.Test;

   /**
   * <b>Description : </b>
   *
   * @author CPF
   * @date 2019/10/26 10:57
   **/
   public class AuthenticationTest {

      @Test
      public void authenticationTest(){
         //1、此处使用Ini配置文件初始化SecurityManager
         DefaultSecurityManager securityManager = new DefaultSecurityManager();
         IniRealm iniRealm = new IniRealm("classpath:shiro.ini");
         securityManager.setRealm(iniRealm);

         //2、得到SecurityManager实例 并绑定给SecurityUtils
         SecurityUtils.setSecurityManager(securityManager);
         //3、得到Subject及创建用户名/密码身份验证Token（即用户身份/凭证）
         Subject subject = SecurityUtils.getSubject();

         UsernamePasswordToken token = new UsernamePasswordToken("zhang", "123");

         //4、登录，即身份验证
         try {
               subject.login(token);
         } catch (AuthenticationException e) {
               //5、身份验证失败
         }

         //执行认证提交
         boolean isAuthenticated = subject.isAuthenticated();

         //是否认证通过
         System.out.println("isAuthenticated : " + isAuthenticated);

         //6、退出
         subject.logout();

         System.out.println("退出后再次执行 subject.isAuthenticated() : " + subject.isAuthenticated());
      }
   }
   ```

## 流程介绍

前置的java流程信息可以从java代码里面读取, 这里着重介绍下 `subject.login(token);` 这行代码做了什么事情.

![2](https://gitee.com/cpfree/picture-warehouse/raw/master/pic/20210615173855.png)

 `token` 一般即为我们登录时输入的账号和密码, `Subject` 的`login()`将其传递给`SecurityManager`(安全管理器, 所有与安全有关的操作都会与 SecurityManager 交互；且它管理着所有 Subject；是 Shiro 的核心), `SecurityManager` 通过 `Realm` 获取安全数据（如用户、角色、权限）, 而是 `Realm` 一般就是开发人员自己写一些自己的代码(从数据库获取用户、角色、权限等)).

1. 一般来说, 我们都会通过实现Realm的一个抽象子类 `AuthenticatingRealm` 来实现我们的业务逻辑, `AuthenticatingRealm` 里面有两个抽象方法(如下), 分别和身份验证和权限验证有关, 由于我们现在讲的是有关身份验证的东西, 所以暂时只分析`AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken)`方法.

   ```java
   protected abstract AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals);

   protected abstract AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException;
   ```

2. 让我们回到我们的逻辑, 一般来说 `token` 分别经过 `Subject`, `SecurityManager`的好几层传递之后, 被传到 `AuthenticatingRealm` 的 `getAuthenticationInfo(AuthenticationToken token)` 方法(如下, 该方法是 final 方法, 也就是说不可重写.

   ```java
   public final AuthenticationInfo getAuthenticationInfo(AuthenticationToken token) throws AuthenticationException {
      // 获取缓存
      AuthenticationInfo info = this.getCachedAuthenticationInfo(token);
      // 如果缓存不存在, 才会获取验证信息, 并将验证信息存入缓存.
      if (info == null) {
            info = this.doGetAuthenticationInfo(token);
            log.debug("Looked up AuthenticationInfo [{}] from doGetAuthenticationInfo", info);
            if (token != null && info != null) {
               this.cacheAuthenticationInfoIfPossible(token, info);
            }
      } else {
            log.debug("Using cached authentication info [{}] to perform credentials matching.", info);
      }

      if (info != null) {
         // 验证身份
            this.assertCredentialsMatch(token, info);
      } else {
            log.debug("No AuthenticationInfo found for submitted AuthenticationToken [{}].  Returning null.", token);
      }

      return info;
   }
   ```

3. 从数据库或缓存获取真实身份信息.
   从这个方法里面我们可以看到, 改方法首先通过 `token` 获取缓存(这一步一般只是使用我们的登陆的用户名, 到数据库或缓存里面查询信息), 如果缓存不可用或不存在, 才会执行我们通常去实现的 `doGetAuthenticationInfo`方法来获取验证信息. 如果成功获取, 还会将其存入缓存, 等待下次使用(这样就可以防止我们多次去数据库查询身份信息).

4. 当我们从数据库拿到身份信息之后, 下一步自然就是和输入的信息 `token` 比对, `this.assertCredentialsMatch(token, info);` 方法就是执行的这个逻辑, 如下面的源码, 这一笔还通过获取匹配器来匹配, 一般这一步比对的是密码, 如果你想要实现其它比对的逻辑, 可以重写这个方法.

   ```java
   protected void assertCredentialsMatch(AuthenticationToken token, AuthenticationInfo info) throws AuthenticationException {
      CredentialsMatcher cm = this.getCredentialsMatcher();
      if (cm != null) {
            if (!cm.doCredentialsMatch(token, info)) {
               String msg = "Submitted credentials for token [" + token + "] did not match the expected credentials.";
               throw new IncorrectCredentialsException(msg);
            }
      } else {
            throw new AuthenticationException("A CredentialsMatcher must be configured in order to verify credentials during authentication.  If you do not wish for credentials to be examined, you can configure an " + AllowAllCredentialsMatcher.class.getName() + " instance.");
      }
   }
   ```

5. 既然讲到`doGetAuthenticationInfo()`, 不妨给个官方的 `SimpleAccountRealm` 做一个示例, 他也是`AuthorizingRealm`的子类, 只不过这个代码逻辑不是很实用, 在`doGetAuthenticationInfo`中, 我们一般只是获取身份信息, 然后等待之后的匹配, 可是, 假如用户账号锁定或过期的话, 就没有必要再去进行之后的缓存, session等操作, 然而按这个框架的步骤, 密码验证是在获取身份信息之后, 可是如果密码都还没有进行验证, 就直接返回用户账号锁定的类似消息的话, 就有些不合适(例如我输入了个错误的密码, 就可以判断出该账号是否已被锁定)), 所以在身份验证这个地方, 可以根据业务进行灵活的开发.

   ```java

    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken token) throws AuthenticationException {
        UsernamePasswordToken upToken = (UsernamePasswordToken)token;
        SimpleAccount account = this.getUser(upToken.getUsername());
        if (account != null) {
            if (account.isLocked()) {
                throw new LockedAccountException("Account [" + account + "] is locked.");
            }

            if (account.isCredentialsExpired()) {
                String msg = "The credentials for account [" + account + "] are expired";
                throw new ExpiredCredentialsException(msg);
            }
        }

        return account;
    }
   ```

## end

到这一步之后, 我们使用框架可以操作的代码部分已经结束了, 如果你想了解更多, 可以看下官方文档, 或自己学习源代码.

当然这只是简单的shiro框架使用, 毕竟我shiro学的还很浅. 有其它更好的方式的话或者我说的有什么不对的地方, 可以在评论区留言.
