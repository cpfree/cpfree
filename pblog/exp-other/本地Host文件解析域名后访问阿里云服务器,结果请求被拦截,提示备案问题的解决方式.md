# 本地Host文件解析域名后访问阿里云服务器, 结果请求被拦截, 提示备案问题的解决方式

上周腾讯云服务器使用时间到期了, 于是就想再换成阿里云服务器试试.

买了服务器之后, 我的得到了我的云服务器公网ip: 118.xxx.xxx.xxx, 但是我向来是不记ip地址的, 连接云服务器都是使用的域名`cpf.cn`, 我之前注册过域名, 但早到期了, 现在使用的域名`cpf.cn`仅仅是在本地host文件里面解析的罢了. 本来想着, 既然换了服务器, 那就就把原来host文件指向的腾讯云的ip地址转成阿里云的服务器ip地址就好了.

在改完host文件配置之后, 经过了mysql, docker, redis, jdk, nginx等各种安装配置之后, nginx代理80端口, 浏览器访问`cpf.cn`也成功打开页面. 但是第二天再次访问的时候, 发现居然提示我域名要备案.

![备案页面](https://gitee.com/cpfree/picture-warehouse/raw/master/images/cloud-server/fe426d6a2dde75a4b2479f91e89489ee704807baf9169e95825979877223a836.png)  

我擦嘞, 我本地的host文件里的域名备什么案! 只是做本地ip解析用的!

## 查找原因

在网上查找了原因之后, 发现是访问阿里云服务器的时候, 阿里云服务器的网关会对非授权的访问进行截获。比如你没有备案，那么针对特定端口，比如80，443的请求进行截获。当你备案后就予以放行。

![图 2](https://gitee.com/cpfree/picture-warehouse/raw/master/images/cloud-server/da55c02d5711cf9fc479c26259c8c892000fcf6233cddf6033fc8425d43b9aae.png)  

也就是说, 如果没有备案的话, 使用本地域名访问80，443端口的话是会被拦截的, 但是访问其它端口却问题(例如使用域名访问22, 3306, 6379等端口就可以正常访问), 而且如果使用ip地址的话, 也是可以正常访问的.

![图 3](https://gitee.com/cpfree/picture-warehouse/raw/master/images/cloud-server/940bf8bffc81cc83fc01aa23d6567834c40f3c80746c8ced5372b08bfc945f2a.png)  

## 历程

80端口和443端口一般也就浏览器访问才会用到的端口, 换句话讲, 拦截了80端口和443端口相当于仅仅拦截了**浏览器通过域名对服务器的访问**(http, https).

那么岂不是每次浏览器访问只能够输入IP地址了?

可惜本人就是不想记忆ip地址, 虽然chrome浏览器有url记忆功能, 输入个118就能够将把整个ip地址给带出来, 但本人用着就是不爽.

![图 4](https://gitee.com/cpfree/picture-warehouse/raw/master/images/cloud-server/9820aaea84beaa5ecaef82b4ace8d4704ac5fff6ab76087bf68b0951b9c4888f.png)

那么就只能去申请备案了

打开备案页面

![图 5](https://gitee.com/cpfree/picture-warehouse/raw/master/images/cloud-server/84998e3620808e54945962b5eb0028c62c65c618728a8e5c3eb939e62eab0587.png)  

卧槽, 还初审, 终审, 管局核检, 重要的是还人脸识别, 奈何本人长的丑, 不想以真面目示人...

尼玛, 阿里云屁事儿怎么这么多, 隔壁腾讯用两年了, 都没这么多事儿, 想让我备案是吧, 我就偏偏不想备! 闲话不多数, 先把阿里骂一遍!

## 明明是通过本地host文件解析域名为ip地址, 为神马服务器还是知道我访问的域名呢

其实从第一开始我输入本地域名, 跳出提示需要备案页面的时候, 我就有这个问题, 我一直以为的是, 本地host文件里面有对应域名的话, 访问的IP地址会被替换成host文件里面对应的ip地址, 而服务器是获取不了你访问的域名的.

但事实是, 访问80端口, 通过域名访问, 网关拦截了请求, 通过IP地址, 网关放行请求, 那么说明请求报文八成带上了 `cpf.cn` 这个域名.

那么就用Wireshark抓包分析一下(在我电脑里面吃土一年的Wireshark终于再次有了用武之地).

使用IP地址访问, 抓到的请求数据如下.

   ![图 6](https://gitee.com/cpfree/picture-warehouse/raw/master/images/cloud-server/09c869b1f7498bc399125df6b966746a2fd8c6fed326222fbf684238a73b0272.png)  

使用`sinjar.cn`访问, 抓到的请求数据如下.

   ![图 7](https://gitee.com/cpfree/picture-warehouse/raw/master/images/cloud-server/687f4169b0189d54a99bd7f616612f062284892021f02a8dccdadaaac6531aa3.png)  

经过抓包测试后才发现, 使用浏览器通过域名访问服务器, 域名确实通过host文件被替换成了ip地址, 但是请求报文的头也还带有你的本地域名(请求头的Host属性).

想来阿里云服务器就是通过`Hypertext Transder Protocol`中的`Host`来判断出你使用的这个域名没有经过备案.

## 最终解决方式

既然是请求头携带了域名, 那就容易了, 要知道请求头是由浏览器进行封装的, 而万能强大的chrome浏览器修改个host简直太容易了有没有.

虽然不知道解决方式但是, 我知道chrome 九成九能实现这个简单的需求.

于是就用百度搜索答案, 结果搜了10分钟什么都没有搜出来.

之后换成chrome搜索, 尼玛, 前三行立刻就跳出来了一个吸引我的插件, `ModHander`, 号称能够修改请求和相应的各种数据, 在此惊讶chrome搜索强大力量的同时顺便把百度搜索骂一遍.

我马上安装了这个插件, 并根据操作很快找到了两种解决方式

第一种配置

   ![图 8](https://gitee.com/cpfree/picture-warehouse/raw/master/images/cloud-server/b5f2b2abed8284565423d9041684f207f9e1336d24946a44ab3c176b6eb89ff7.png)  

   使用`redirect URLs`功能映射地址, 这样的话, 当你输入域名的时候, 浏览器会自动将域名转换为IP地址, 但是这样的话浏览器URL栏里面的`sinjar.cn`, 会变成ip `118.xxx.xx.xxx`, 感觉用着也不太优雅.

第二种配置(我当前在使用的配置)

   ![图 9](https://gitee.com/cpfree/picture-warehouse/raw/master/images/cloud-server/4c859a5a7f045e7a01b35a49b3651846debe5d2a433b6340f19821e9d33eef56.png)  

   当浏览器访问域名 `cpf.cn` 的时候, 浏览器会自动把报文头里面的 Host 属性改为`ip`地址, 这样的话浏览器Url栏里面显示的依然是`cpf.cn`.

   ![图 10](https://gitee.com/cpfree/picture-warehouse/raw/master/images/cloud-server/2a399619dbfbaa10e6e5ea98dec5ec87cb6d9f94f9a2b2ae84f279741b06d381.png)  

   此时使用 Wireshark 抓包发现Host属性的值也变成了ip地址, 完美解决了我的需求
