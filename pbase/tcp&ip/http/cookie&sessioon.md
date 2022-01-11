---
keys: session,cookie
type: trim
url: <https://www.cnblogs.com/caiwenjing/p/8081391.html>, 《图解HTTP》
id: 220110-103002
---

# cookie 与 session

cookie机制采用的是在客户端保持状态的方案，

session机制采用的是在服务器端保持状态的方案。

由于采用服务器端保持状态的方案在客户端也需要保存一个标识，所以session机制可能需要借助于cookie机制来达到保存标识的目的，但实际上它还有其他选择。

Jsessionid: Jsessionid只是tomcat的对sessionid的叫法，其实就是sessionid；在其它的容器也许就不叫jsessionid了。

## Cookie 与 session 的 产生过程

1. HTTP协议本身是无状态的: 客户端向服务器端发送的每次请求都是独立的。

2. 为了使得web的交互能力大大增强。程序员一方面在HTML中添加表单、脚本、DOM等客户端行为，来增加web应用与客户端的交互性。另一方面在服务器端测出现了CGI规范以响应客户端的动态请求，作为传输载体的HTTP协议添加了文件上载、cookie 等特性。

3. 然而cookie的方式存储信息，可能会存在一点定的安全性，因为所有的信息都是写在客户端的，客户可能会对这些信息进行修改或清除。然后就又出现session的方式用于保存用户行为，这种方式的原理与前面介绍银行卡的方式是一样的。                                         

4. 当程序需要为某个客户端的请求创建一个session时，服务器首先检查这个客户端的请求里是否已包含了一个`session id`.
   1. 如果已包含则说明以前已经为此客户端创建过session，服务器就按照session id把这个session检索出来使用（检索不到，会新建一个），
   2. 如果客户端请求不包含session id，则为此客户端创建一个session并且生成一个与此session相关联的session id，session id的值应该是一个既不会重复，又不容易被找到规律以仿造的字符串，这个session id将被在本次响应中返回给客户端保存。

5. cookie替代: cookie可以被人为的禁止，这个时候要想保存 `sessionId`, 则必须有其他机制以便在cookie被禁止时仍然能够把session id传递回服务器。如下面的方法

   1. URL重写: 就是把session id直接附加在URL路径的后面。
   2. 表单隐藏字段: 就是服务器会自动修改表单，添加一个隐藏字段，以便在表单提交时能够把session id传递回服务器。

6. Cookie其实还可以用在一些方便用户的场景下，设想你某次登陆过一个网站，下次登录的时候不想再次输入账号了，怎么办？这个信息可以写到Cookie里面，访问网站的时候，网站页面的脚本可以读取这个信息，就自动帮你把用户名给填了，能够方便一下用户。这也是Cookie名称的由来，给用户的一点甜头。所以，总结一下：Session是在服务端保存的一个数据结构，用来跟踪用户的状态，这个数据可以保存在集群、数据库、文件中；Cookie是客户端保存用户信息的一种机制，用来记录用户的一些信息，也是实现Session的一种方式。

## cookie机制

1. cookie的创建: 正统的cookie分发是通过扩展HTTP协议来实现的，服务器通过在HTTP的响应头中加上一行特殊的指示以提示浏览器按照指示生成相应的cookie。然而纯粹的客户端脚本如JavaScript或者VBScript也可以生成cookie。

2. cookie的用途
   1. session管理: 用户登陆成功后，设置一个唯一的cookie标识本次会话，基于这个标识进行用户授权。只要请求中带有这个标识，都认为是登录态。
   2. 个性化: cookie可以被用于记录一些信息，以便于在后续用户浏览页面时展示相关内容。典型的例子是购物站点的购物车功能。定制主页,搜索提示
   3. `user tracking`: cookie也可以用于追踪用户行为，例如是否访问过本站点，有过哪些操作等。

3. cookie的内容: 主要包括：名字，值，过期时间，路径和域。

   1. name，(必须)Cookie名称必须使用只能用在URL中的字符，一般用字母及数字，不能包含特殊字符，如有特殊字符想要转码。如js操作cookie的时候可以使用escape()对名称转码。
   2. value，(必须)Cookie值同理Cookie的名称，可以进行转码和加密。
   3. Expires，过期日期，一个GMT格式的时间，当过了这个日期之后，浏览器就会将这个Cookie删除掉，当不设置这个的时候，Cookie在浏览器关闭后消失。
   4. Path，一个路径，在这个路径下面的页面才可以访问该Cookie，一般设为“/”，以表示同一个站点的所有页面都可以访问这个Cookie。
   5. Domain，子域，指定在该子域下才可以访问Cookie，例如要让Cookie在a.test.com下可以访问，但在b.test.com下不能访问，则可将domain设置成a.test.com。
   6. Secure，安全性，指定Cookie是否只能通过https协议访问，一般的Cookie使用HTTP协议既可访问，如果设置了Secure（没有值），则只有当使用https协议连接时cookie才可以被页面访问。
   7. HttpOnly，如果在Cookie中设置了"HttpOnly"属性，那么通过程序(JS脚本、Applet等)将无法读取到Cookie信息。

4. cookie 销毁

   `session cookie` : 当cookie没有设置超时时间，那么cookie会在浏览器退出时销毁，这种cookie是session cookie。

   `persistent cookie/tracking cookie` : 设置了超时时间的cookie，会在指定时间销毁，cookie的维持时间可以持续到浏览器退出之后，这种cookie被持久化在浏览器中。很多站点用cookie跟踪用户的历史记录，例如广告类站点会使用cookie记录浏览过哪些内容，搜索引擎会使用cookie记录历史搜索记录，这时也可以称作tracking cookie，因为它被用于追踪用户行为。

5. cookie 分类
   
   1. `secure cookie` : 服务器端设置cookie的时候，可以指定 secure 属性，这时cookie只有通过https协议传输的时候才会带到网络请求中，不加密的http请求不会带有secure cookie。
   
      设置secure cookie的方式举例：`Set-Cookie: foo=bar; Path=/; Secure`

   2. `HttpOnly cookie` : 设置了这个属性的cookie在javascript中无法获取到，只会在网络传输过程中带到服务器。

      设置secure cookie的方式举例：`Set-Cookie: foo=bar; Path=/; HttpOnly`
      
   3. `third-party cookie` : 第三方cookie的使用场景通常是iframe，例如www.a.com潜入了一个www.ad.com的广告iframe，那么www.ad.com设置的cookie属于不属于www.a.com，被称作第三方cookie。

   4. `supercookie`: cookie会从属于一个域名，例如www.a.com，或者属于一个子域，例如b.a.com。但是如果cookie被声明为属于.com会发生什么？这个cookie会在任何.com域名生效。这有很大的安全性问题。这种cookie被称作supercookie。
         浏览器做出了限制，不允许设置顶级域名cookie(例如.com，.net)和pubic suffix cookie(例如.co.uk，.com.cn)。
         现代主流浏览器都很好的处理了supercookie问题，但是如果有些第三方浏览器使用的顶级域名和public suffix列表有问题，那么就可以针对supercookie进行攻击啦。

   5. `zombie cookie/evercookie`: 指当用户通过浏览器的设置清除cookie后可以自动重新创建的cookie。原理是通过使用多重技术记录同样的内容(例如flash，silverlight)，当cookie被删除时，从其他存储中恢复。 evercookie是实现僵尸cookie的主要技术手段。 了解 僵尸cookie 和 evercookie 。

### 查看cookie

1. 通过查看请求头`Request Headers`对象
2. 使用js, 打印 `document.cookie`
3. 通过浏览器的`cookie管理器`


## session机制

   其实session是一个存在服务器上的类似于一个散列表格的文件。里面存有我们需要的信息，在我们需要用的时候可以从里面取出来。类似于一个大号的map吧，里面的键存储的是用户的sessionid，用户向服务器发送请求的时候会带上这个sessionid。这时就可以从中取出对应的值了。

   session 的工作原理是客户端登录完成之后，服务器会创建对应的 session，session 创建完之后，会把 session 的 id 发送给客户端，客户端再存储到浏览器中。这样客户端每次访问服务器时，都会带着 sessionid，服务器拿到 sessionid 之后，在内存找到与之对应的 session 这样就可以正常工作了。

   在服务端保存Session的方法很多，内存、数据库、文件都有。集群的时候也要考虑Session的转移，在大型的网站，一般会有专门的Session服务器集群，用来保存用户会话，这个时候 Session 信息都是放在内存的，使用一些缓存服务比如Memcached之类的来放 Session。

## QA

1. session 的 cookie 区别

   1. 容量和个数限制：cookie 有容量限制，每个站点下的 cookie 也有个数限制。
   2. session 可以存储在 Redis 中、数据库中、应用程序中；而 cookie 只能存储在浏览器中。

2. 如果客户端禁止 cookie 能实现 session 还能用吗

   可以: `Cookie`的一个作用就是标准化的长久保存, 但是如果仅仅是会话级的cookie的话, 那就没必要保存在浏览器里面了, 也就必要以cookie的方式保存了.

   例如, 将 `session id` 保存在隐藏的表单里面, 甚至使用动态 `cookie` 的形式.
