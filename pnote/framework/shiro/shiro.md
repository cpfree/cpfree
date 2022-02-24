# Apache Shiro

> 参考
>
> - <https://www.w3cschool.cn/shiro/andc1if0.html>
> - <https://www.w3cschool.cn/shiro/>

### intro

Apache Shiro 是一个功能强大且易于使用的 Java 安全框架，提供了认证，授权，加密，和会话管理

如同 Spring security 一样都是是一个权限安全框架，但是与 Spring Security 相比，在于他使用了和比较简洁易懂的认证和授权方式。

### 基础知识

1. Authentication 和 Authorization

   1. Authentication：是验证用户身份的过程。
   2. Authorization：是授权访问控制，用于对用户进行的操作进行人证授权，证明该用户是否允许进行当前操作，如访问某个链接，某个资源文件等。

2. 身份凭证

   - Principals(身份)：是 subject 的标识属性，比如：提交的用户名
   - Credenticals(凭证)：身份证明，比如：登录提供的密码。

### shiro 流程

shiro 中有两个比较重要的流程，一个是认证，一个是授权。

认证就是身份验证, 一般来说就是判断下登录账号和登录密码什么的是否匹配, 而授权则是判断下你是否有权限访问某些资源.

在 shiro 的用户权限认证过程中其通过两个方法来实现：

#### doGetAuthenticationInfo

获取认证方式, 即登陆验证

在用户登录的时候调用的也就是执行 SecurityUtils.getSubject().login（）的时候调用；(即:登录验证)

#### SimpleAuthenticationInfo

上面是 SimpleAuthenticationInfo 源码的一个构造方法，这里第一个参数就是你刚才传入的用户名，第二个参数就是你传入的密码，但是方法定义中这两个参数都是 Object 类型，尤其是第一个 principal 参数，它的意义远远不止用户名那么简单，它是用户的所有认证信息集合，登陆成功后，<shiro:principal/>标签一旦有 property 属性，PrincipalTag 类也就是标签的支持类，会从 Subject 的 principalcollection 里将 principal 取出，取出的就是你传入的第一个参数，如果你传了个 string 类型的用户名，那么你只能获取用户名。
仔细看那个 this.principals=new SimplePrincipalCollection，这一行，这一行构造了一个新的对象并将引用给了 principals，而 principals 就是 principalcollection。

### 三大核心组件

1. Subject ：当前用户的操作

   Subject：即当前用户，在权限管理的应用程序里往往需要知道谁能够操作什么，谁拥有操作该程序的权利，shiro 中则需要通过 Subject 来提供基础的当前用户信息，Subject 不仅仅代表某个用户，也可以是第三方进程、后台帐户（Daemon Account）或其他类似事物。

2. SecurityManager：用于管理所有的 Subject

   SecurityManager：即所有 Subject 的管理者，这是 Shiro 框架的核心组件，可以把他看做是一个 Shiro 框架的全局管理组件，用于调度各种 Shiro 框架的服务。

3. Realms：用于进行权限信息的验证

   Realms：Realms 则是用户的信息认证器和用户的权限人证器，我们需要自己来实现 Realms 来自定义的管理我们自己系统内部的权限规则。

4. 其他组件：

   除了以上几个组件外，Shiro 还有几个其他组件：

   1、SessionManager ：Shiro 为任何应用提供了一个会话编程范式。

   2、CacheManager :对 Shiro 的其他组件提供缓存支持。

### usage

springrain 使用 shiro 控制权限，配置 filterChainDefinitions 结合数据库校验权限。

我们在 web.xml 中配置一个全局过滤器，也就是在 springrain 配置的是一个 spring bean 的"shiroFilter"，在这个 bean 中可以根据访问路径在配置不同的过滤器，其中 shiro 默认自带的过滤器如下：

| Filter Name       | Class                                                            |
| ----------------- | ---------------------------------------------------------------- |
| anon              | org.apache.shiro.web.filter.authc.AnonymousFilter                |
| authc             | org.apache.shiro.web.filter.authc.FormAuthenticationFilter       |
| authcBasic        | org.apache.shiro.web.filter.authc.BasicHttpAuthenticationFilter  |
| logout            | org.apache.shiro.web.filter.authc.LogoutFilter                   |
| noSessionCreation | org.apache.shiro.web.filter.session.NoSessionCreationFilter      |
| perms             | org.apache.shiro.web.filter.authz.PermissionsAuthorizationFilter |
| port              | org.apache.shiro.web.filter.authz.PortFilter                     |
| rest              | org.apache.shiro.web.filter.authz.HttpMethodPermissionFilter     |
| roles             | org.apache.shiro.web.filter.authz.RolesAuthorizationFilter       |
| ssl               | org.apache.shiro.web.filter.authz.SslFilter                      |
| user              | org.apache.shiro.web.filter.authc.UserFilter                     |
