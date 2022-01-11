---
keys: 
type: copy,blog,trim
url: <>
id: 220111-104255
---

# credentials&token&ticket

> credentials 相当于拿着身份证刷卡, token 相当于拿着现金支付, ticket 相当于是拿票买东西.

1. credentials 就是凭证

   用于标记用户身份的一个信息对象, 通过 credentials 可以确定 用户是用户.

   > 如登录后将用户名和密码, 封装成一个实体对象, 这个就是个凭证
   > 如登陆后生成一个信息(不是用户名和密码), 封装成一个实体, 通过这个实体也能判断出用户是该用户, 那么也是一个凭证.

   > 认证和授权都是一个过程, 凭证是一个信息.

   credentials一般生命周期很长, 至少也是会话级别.

2. token

   token 重要的特点是`无状态`的信息对象.

   后端不需要存储任何数据, 后端只需要一种验证token的方式, 在验证token的时候不需要去查询数据库, 只需要通过一种方式对token进行验证, 就可以确认token是真的还是假的.

   token 也被翻译成令牌, 正如你进大门的时候, 只需要验证下令牌是真的还是假的就行了, 只认令牌不认人.

   token 在区块链中也被当做金钱来使用, 在规定时间内, 只要验证下 token 是不是真的, 以及本身面值多少就行.

   token 生命周期一般很短, 每隔一段时间就需要换个token.

3. ticket

   ticket 又称票据, 就像先到前台去买票, 之后拿着票, 进场一样.

   ticket 一般来说 只能用一次, 且有过期时间, 过期了之后 ticket 就不能用了.

## 凭证(Credentials)


相当于身份卡, 登录之后用于标记用户的身份, 凭证是一个信息, 而认证和授权都是一个过程.

## Token

Token 可以认为一个在 前后端传递的 信息对象.

session 一直在后端, cookie 一直在前端, 两者都是有状态的, 而 **token 就是一个无状态的东西**.

Session 和 Token 并不矛盾，作为身份认证 Token 安全性比 Session 好，因为每一个请求都有签名还能防止监听以及重放攻击，而 Session 就必须依赖链路层来保障通讯安全了。如果你需要实现有状态的会话，仍然可以增加 Session 来在服务器端保存一些状态。

如 token 也许可以是后端一个随机生成的序列, 之后后端将 token 传给前端, 前端发送请求时, 再将 token 加入参数, 后端接收到请求, 再去验证 token,

如果指的是 OAuth Token 或类似的机制的话，提供的是 认证 和 授权 ，认证是针对用户，授权是针对 App 。其目的是让某 App 有权利访问某用户的信息。这里的 Token 是唯一的。

token 作用

1. 在前后台传输
2. 服务端无状态化(不需要保存什么东西), 可扩展性好.
3. 支持多设备
4. 安全性好.
5. 支持跨域调用.
6. 在区块链中可以当作金钱来使用.

### Acesss Token

访问资源接口（API）时所需要的资源凭证。
简单 token 的组成： uid(用户唯一的身份标识)、time(当前时间的时间戳)、sign（签名，token 的前几位以哈希算法压缩成的一定长度的十六进制字符串）。

token 的身份验证流程：

![](https://gitee.com/cpfree/picture-warehouse/raw/master/pic1/20220110170809.png)

1.  客户端使用用户名跟密码请求登录
2.  服务端收到请求，去验证用户名与密码
3.  验证成功后，服务端会签发一个 token 并把这个 token 发送给客户端
4.  客户端收到 token 以后，会把它存储起来，比如放在 cookie 里或者 localStorage 里
5.  客户端每次向服务端请求资源的时候需要带着服务端签发的 token
6.  服务端收到请求，然后去验证客户端请求里面带着的 token ，如果验证成功，就向客户端返回请求的数据
7.  每一次请求都需要携带 token，需要把 token 放到 HTTP 的 Header 里。

8.  token 的用户认证是一种服务端无状态的认证方式
9.  服务端只需要对 token 本身进行解析就可以对用户身份进行认证, ,
10. 用解析 token 的计算时间换取 session 的存储空间，从而减轻服务器的压力，减少频繁的查询数据库。

### Refresh Token

`access token` 是需要不时地去刷新或失效的.

每次刷新都要用户输入登录用户名与密码，会很麻烦。于是有了 `refresh token`, `refresh token` 是专用于刷新 `access token` 的.

![](https://gitee.com/cpfree/picture-warehouse/raw/master/pic1/20220110171834.png)

`Access Token` 的有效期比较短，当 `Acesss Token` 由于过期而失效时，使用 `Refresh Token` 就可以获取到新的 Token，如果 `Refresh Token` 也失效了，用户就只能重新登录了。

`Refresh Token` 及过期时间是存储在服务器的数据库中，只有在申请新的 `Acesss Token` 时才会验证，不会对业务接口响应时间造成影响，也不需要向 `Session` 一样一直保持在内存中以应对大量的请求。


