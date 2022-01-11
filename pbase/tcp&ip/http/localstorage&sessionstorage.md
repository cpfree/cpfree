# localstorage & sessionstorage

`WebStorage` 的目的是克服由 cookie 所带来的一些限制，当数据需要被严格控制在客户端时，不需要持续的将数据发回服务器。

`WebStorage` 两个主要目标：

1. 提供一种在 cookie 之外存储会话数据的路径
2. 提供一种存储大量可以跨会话存在的数据的机制

HTML5 的 WebStorage 提供了两种 API：localStorage（本地存储）和 sessionStorage（会话存储）

localStorage 和 sessionStorage 的区别 

1. 生命周期

   localStorage 的生命周期是永久的，关闭页面或浏览器之后 localStorage 中的数据也不会消失。除非主动删除数据，否则数据永远不会消失。
   sessionStorage 的生命周期是仅在当前会话下有效。sessionStorage 引入了一个“浏览器窗口”的概念，sessionStorage 是在同源的窗口中始终存在的数据。
      - sessionStorage 在关闭了浏览器窗口后就会被销毁。
      - 只要这个浏览器窗口没有关闭，即使刷新页面或者进入同源另一个页面，数据依然存在。
      - 使用 window.open('xxx.html'), 则sessionStorage会依然存在.
      - 尝试用a 标签href跳到新页面，设置 target = _blank,但是sessionStorage不会存在
      - 使用浏览器独立的打开同一个窗口同一个页面，sessionStorage 也是不一样的。

2. 存储大小

   localStorage 和 sessionStorage 的存储数据大小一般都是：5MB

3. 存储位置

   localStorage 和 sessionStorage 都保存在客户端，不与服务器进行交互通信

4. 存储内容类型

   localStorage 和 sessionStorage 只能存储 `key/value`字符串数据，对于复杂的对象可以使用 ECMAScript 提供的 JSON 对象的 stringify 和 parse 来处理

5. 获取方式

   localStorage：`window.localStorage`
   sessionStorage：`window.sessionStorage`

6. 应用场景

   localStorage：常用于长期登录（+判断用户是否已登录），适合长期保存在本地的数据
   sessionStorage：敏感账号一次性登录

## WebStorage 的优点

1. 存储空间更大：cookie 为 4KB，而 WebStorage 是 5MB
2. 节省网络流量：WebStorage 不会传送到服务器，存储在本地的数据可以直接获取，也不会像 cookie 一样每次请求都会传送到服务器，所以减少了客户端和服务端的交互，节省了网络流量
3. 对于那种只需要在用户浏览一组页面期间保存而关闭浏览器后就可以丢弃的数据，sessionStorage 会非常方便
4. 快速显示：有的数据存储在 WebStorage 上再加上浏览器本身的缓存。获取数据时可以从本地获取会比从服务器端获取快得多，所以速度更快
5. 安全性：WebStorage 不会随着 HTTP header 发送到服务器端，所以安全性相对于 cookie 来说会比较高一些，不会担心截获，但是仍然存在伪造问题
6. WebStorage 提供了一些方法，数据操作比 cookie 方便

   ```js
   // 保存数据，以键值对的方式存储信息
   setItem(key, value)
   // 获取数据，将键值传入，即可获取到对应的 value 值
   getItem(key)
   // 删除单个数据，根据键值移除对应的信息
   removeItem(key)
   // 删除所有的数据
   clear()
   // 获取某个索引的 key
   key(index)
   ```

能否使用 Html5 和 localstorage 使用要看浏览器是否支持, 不过当前主流浏览器一般都支持.

   ```js
   // Check browser support
   if (typeof(Storage) !== "undefined") {
      // Store
      localStorage.setItem("lastname", "Gates");
      // Retrieve
      document.getElementById("result").innerHTML = localStorage.getItem("lastname");
   } else {
      document.getElementById("result").innerHTML = "抱歉！您的浏览器不支持 Web Storage ...";
   }
   ```

## WebStorage 的跨域问题



