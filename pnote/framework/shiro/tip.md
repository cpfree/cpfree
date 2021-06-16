# AuthorizingRealm

> 参考 https://www.w3cschool.cn/shiro/

## info

Principals(身份)：是subject的标识属性，比如：提交的用户名
Credenticals(凭证)：身份证明，比如：登录提供的密码。

shiro中有两个比较重要的流程，一个是认证，一个是授权。

认证就是身份验证, 一般来说就是判断下登录账号和登录密码什么的是否匹配, 而授权则是判断下你是否有权限访问某些资源.

## doGetAuthenticationInfo

获取认证方式, 即登陆验证

在用户登录的时候调用的也就是执行SecurityUtils.getSubject().login（）的时候调用；(即:登录验证)


### SimpleAuthenticationInfo

上面是SimpleAuthenticationInfo源码的一个构造方法，这里第一个参数就是你刚才传入的用户名，第二个参数就是你传入的密码，但是方法定义中这两个参数都是Object类型，尤其是第一个principal参数，它的意义远远不止用户名那么简单，它是用户的所有认证信息集合，登陆成功后，<shiro:principal/>标签一旦有property属性，PrincipalTag类也就是标签的支持类，会从Subject的principalcollection里将principal取出，取出的就是你传入的第一个参数，如果你传了个string类型的用户名，那么你只能获取用户名。
仔细看那个this.principals=new SimplePrincipalCollection，这一行，这一行构造了一个新的对象并将引用给了principals，而principals就是principalcollection。

