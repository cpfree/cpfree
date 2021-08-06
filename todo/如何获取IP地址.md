# 如何获取 ip 地址

1. 使用 `InetAddress.getLocalHost().getHostAddress()`
   window 获取本机内网 ip 地址可以, 但是在 linux 上面需要在 host 文件中配置 linux 主机名和 ip 地址的对应关系才能够获取到配置的 ip 地址

   ```xml
   InetAddress.getLocalHost().getHostAddress()
   ```

2. 获取所有 ip 地址

   ```java
   public static Set<String> getIp(){
      Set<String> set = new HashSet<>();
      try {
         for (Enumeration<NetworkInterface> en = NetworkInterface.getNetworkInterfaces(); en.hasMoreElements();) {
               NetworkInterface intf = en.nextElement();
               for (Enumeration<InetAddress> enumIpAddr = intf.getInetAddresses(); enumIpAddr.hasMoreElements();) {
                  InetAddress inetAddress = enumIpAddr.nextElement();
                  if (!inetAddress.isLoopbackAddress() && !inetAddress.isLinkLocalAddress() && inetAddress.isSiteLocalAddress()) {
                     set.add(inetAddress.getHostAddress());
                  }
               }
         }
      } catch (SocketException ex) {
      }
      return set;
   }
   ```

3. 主机多网卡会导致电脑的 ip 地址可以有多个
   电脑的 ip 地址可以有多层
4. 电脑的 ip 地址被代理的情况

   通过主机获取 ip 地址, 毕竟程序运行在主机上, 如果主机不想给你 ip 那么你就获取不到, 不同的主机获取 ip 地址的方式也不一样

   通过访问指定网络 ip 来获取到当前的 ip 地址怎么做,

   网管代理 ip 会导致 ip 有多个, 甚至获取错误

5. InetAddress addr = InetAddress.getLocalHost();
   ip=addr.getHostAddress()；
   [/Quote]
   答：
   1）在你的网卡处理激活状态下，用这种方式当然可以取到本机 IP。
   2）若不论网卡是否处理激活状态，想获取到本机所有的网卡的所有的 IP（可能不只有一个网卡），则可用 JDK6。0 开始的
   NetworkInterface.getNetworkInterfaces();就可获取到本机 所有的网卡的所有的 IP（可能不只有一个网卡）了。
   如：

6. InetAddress.getLocalHost().getHostAddress(); 在某些系统版本可能会导致阻塞 5 秒

7. 电脑名, 主机名, ip地址, 域名之间的关系

   主机名称一般标记一台主机, 可以修改, 但是一般需要重启生效, 在局域网里面可以充当域名, 可以直接ping主机名,可以得到当前激活(当前ping使用的网卡)的ip地址或mac地址.

   域名: 可以映射ip地址

   mac地址: 是物理地址, 是固定的，也是唯一的，在每一台电脑被制造出来后就和mac绑定了。mac是绑定在网卡上的，也就是说每一个网卡都有一个固定且唯一的mac。
   > 但是如今有软件可以修改mac地址, 导致不唯一.
 
   ip地址: 可变化, 可分配, 一个网卡会对应一个ip地址

8. 主机名和域名之间的关系

   主机名的含义是机器本身的名字，域名是方面记录IP地址才做的一种IP映射；

   二者有共性：都能对应到一个唯一的IP上，

   从应用场景上可以这么简单理解二者的区别：主机名用于局域网中；域名用于公网中。

   一个域名下可以有多个主机名，域名下还可以有子域名。例如，域名abc.com下，有主机server1和server2，其主机全名就是server1.abc.com和server2.abc.com。

   在局域网可以直接ping主机名, 获取到指定的ip地址

   多网卡下是需要配置路由的

9. 一个IP可以对应多个域名，一个域名也可以对应多个ip?

   可以，可以。一个IP对应多个域名：多网站共享一个IP，比如你买台服务器，只有一个Ip，但你可以开多个空间，每个空间有自己绑定的域名，多个域名解析到同一IP，到又指向不同空间。一个域名多个IP：这种情况一般是分线路分地区解析，比如当国外用户访问时解析到国外节点服务器的IP，国内用户访问时解析到国内节点，蜘蛛访问时解析到对搜索引擎更友好的节点。

10. 一台window可以配置一个hostname, linux可以配置多个主机名
    

11. 域名解析，一个域名可以对应多个IP地址（基于DNS的负载均衡）