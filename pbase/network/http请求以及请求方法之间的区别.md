---
keys: 
type: copy,blog,trim
url: <https://www.cnblogs.com/logsharing/p/8448446.html>,<https://baijiahao.baidu.com/s?id=1664932291911157034&wfr=spider&for=pc>
id: 220205-141300
---

# HTTP 请求

GET 请求 | 请求指定的页面信息, 并返回实体数据.



# GET 请求和POST 请求区别

1. 小白级

GET 请求

   1. 请求只能进行url编码, 把参数包含在URL中.
   2. GET把参数包含在URL中，POST通过request body传递参数

浏览器的处理方式

   1. GET产生的URL地址可以被Bookmark，而POST不可以。
   2. GET请求会被浏览器主动cache，请求参数会被完整保留在浏览器历史记录里, 而POST不会，除非手动设置。
   3. GET在浏览器回退时是无害的，而POST会再次提交请求。
   4. GET请求在URL中传送的参数是有长度限制的，而POST没有。

2. 中级

   GET和POST是什么？HTTP协议中的两种发送请求的方法。

   HTTP是什么？HTTP是基于TCP/IP的关于数据如何在万维网中如何通信的协议。

   HTTP的底层是TCP/IP。所以GET和POST的底层也是TCP/IP，也就是说，GET/POST都是TCP链接。GET和POST能做的事情是一样一样的。你要给GET加上request body，给POST带上url参数，技术上是完全行的通的。 

3. 高级

   GET产生一个TCP数据包；POST产生两个TCP数据包。

   对于GET方式的请求，浏览器会把http header和data一并发送出去，服务器响应200（返回数据）；

   而对于POST，浏览器先发送header，服务器响应100 continue，浏览器再发送data，服务器响应200 ok（返回数据）。


   因为POST需要两步，时间上消耗的要多一点，看起来GET比POST更有效。因此Yahoo团队有推荐用GET替换POST来优化网站性能。但这是一个坑！跳入需谨慎。为什么？

   1. GET与POST都有自己的语义，不能随便混用。

   2. 据研究，在网络环境好的情况下，发一次包的时间和发两次包的时间差别基本可以无视。而在网络环境差的情况下，两次包的TCP在验证数据包完整性上，有非常大的优点。

   3. 并不是所有浏览器都会在POST中发送两次包，Firefox就只发送一次。
