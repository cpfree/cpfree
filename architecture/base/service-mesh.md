---
keys: 
type: copy,blog,trim
url: <>
id: 220124-124327
---

# service mesh

> 参考: <https://blog.csdn.net/baichoufei90/article/details/107293203>
> 参考: [什么是Service Mesh](https://blog.csdn.net/M2l0ZgSsVc7r69eFdTj/article/details/103942326)
> Phil Calçado的文章《Pattern: Service Mesh》
> <https://zhuanlan.zhihu.com/p/61901608>

## 微服务架构面临的的核心技术问题

1. 微服务模式下，企业内部服务少则几个到上百个，每个服务一般都以集群方式部署，这时自然产生两个问题(如下图所示)：

   > 这两个问题微服务架构在技术上的最核心问题。

   - 服务发现：服务的消费方(Consumer)如何发现服务的提供方(Provider)？
   - 负载均衡：服务的消费方如何以某种负载均衡策略访问集群中的服务提供方实例？

### 3种服务发现方式

在服务消费方和服务提供方之间增加一层代理，由代理负责服务发现和负载均衡功能，消费方通过代理间接访问目标服务。

   ![服务发现方式-代理图](https://gitee.com/cpfree/picture-warehouse/raw/master/pic/20210629170912.png)

#### 模式一：传统集中式代理

   ![传统集中式代理图](https://gitee.com/cpfree/picture-warehouse/raw/master/pic/20210629171248.png)

在服务消费者和生产者之间，代理作为独立一层集中部署，由独立团队 (一般是运维或框架) 负责治理和运维。常用的集中式代理有硬件负载均衡器 (如 F5)，或者软件负载均衡器 (如 Nginx)，F5(4 层负载)+Nginx(7 层负载) 这种软硬结合两层代理也是业内常见做法，兼顾配置的灵活性 (Nginx 比 F5 易于配置)。

这种方式通常在 DNS 域名服务器的配合下实现服务发现，服务注册 (建立服务域名和 IP 地址之间的映射关系) 一般由运维人员在代理上手工配置，服务消费方仅依赖服务域名，这个域名指向代理，由代理解析目标地址并做负载均衡和调用。

> 传统集中式代理相对比较重，有单点问题和性能问题；

#### 模式二：客户端嵌入式代理

   ![客户端嵌入式代理图](https://gitee.com/cpfree/picture-warehouse/raw/master/pic/20210629171257.png)

   互联网公司比较流行的一种做法，代理 (包括服务发现和负载均衡逻辑) 以客户库的形式嵌入在应用程序中。这种模式一般需要独立的服务注册中心组件配合，服务启动时自动注册到注册中心并定期报心跳，客户端代理则发现服务并做负载均衡。

   Eureka 和 Ribbon, Dubbo 是这种模式的典型案例

缺陷

   1. 客户端节点复杂.
   2. 嵌入式代理导致语言有关, 支持多语言困难.
   3. 集中治理困难

#### 模式三：主机独立进程代理

   ![主机独立进程代理图](https://gitee.com/cpfree/picture-warehouse/raw/master/pic/20210629171303.png)

   代理既不是独立集中部署，也不嵌入在客户应用程序中，而是作为独立进程部署在每一个主机上，一个主机上的多个消费者应用可以共用这个代理，实现服务发现和负载均衡，如下图所示。这个模式一般也需要独立的服务注册中心组件配合，作用同模式二。

优点

   1. 纯分布式的，没有单点问题，性能也不错，
   2. 应用语言栈无关.
   3. 可以集中治理。

   ![三种模式对比](https://gitee.com/cpfree/picture-warehouse/raw/master/pic/20210629171309.png)

### 当前微服务方式(模式二：客户端嵌入式代理)

微服务模式看似完美，但开发人员很快又发现，它也存在一些本质问题：

   1. 虽然框架本身屏蔽了分布式系统通信的一些通用功能实现细节，但开发者却要花更多精力去掌握和管理复杂的框架本身，在实际应用中，去追踪和解决框架出现的问题也绝非易事；

   2. 开发框架通常只支持一种或几种特定的语言，回过头来看文章最开始对微服务的定义，一个重要的特性就是语言无关，但那些没有框架支持的语言编写的服务，很难融入面向微服务的架构体系，想因地制宜的用多种语言实现架构体系中的不同模块也很难做到；

   3. 应用语言栈有关, 框架以lib库的形式和服务联编，复杂项目依赖时的库版本兼容问题非常棘手，同时，框架库的升级也无法对服务透明，服务会因为和业务无关的lib库升级而被迫升级。

### Service Mesh(模式三：主机独立进程代理)

为了解决微服务中的问题, 以Linkerd，Envoy，Ngixmesh为代表的代理模式（边车模式）应运而生，这就是第一代Service Mesh，
它将分布式服务的通信抽象为单独一层，在这一层中实现负载均衡、服务发现、认证授权、监控追踪、流量控制等分布式系统所需要的功能，作为一个和服务对等的代理服务，和服务部署在一起，接管服务的流量，通过代理之间的通信间接完成服务之间的通信请求，这样上边所说的三个问题也迎刃而解。

   ![边车模式1](https://gitee.com/cpfree/picture-warehouse/raw/master/pic/20210629171315.png)

   ![边车模式2](https://gitee.com/cpfree/picture-warehouse/raw/master/pic/20210629171319.png)

   > 从一个全局视角来看，就会得到如下部署图
   > ![部署图](https://gitee.com/cpfree/picture-warehouse/raw/master/pic/20210629171325.png)
   > 略去服务，只看Service Mesh的单机组件组成的网络则变成如下, 它看起来确实就像是一个由若干服务代理所组成的错综复杂的网格。
   > ![Service Mesh示意图](https://gitee.com/cpfree/picture-warehouse/raw/master/pic/20210629171330.png)

后来为了提供统一的上层运维入口，演化出了集中式的控制面板，所有的单机代理组件通过和控制面板交互进行网络拓扑策略的更新和单机数据的汇报。这就是以Istio为代表的第二代Service Mesh。

   ![第二代Service Mesh](https://gitee.com/cpfree/picture-warehouse/raw/master/pic/20210629171334.png)

   ![Service Mesh全局部署视图](https://gitee.com/cpfree/picture-warehouse/raw/master/pic/20210629171340.png)

## Service Mesh

Service Mesh是一个基础设施层，用于处理服务间通信。云原生应用有着复杂的服务拓扑，服务网格保证请求在这些拓扑中可靠地穿梭。在实际应用当中，服务网格通常是由一系列轻量级的网络代理组成的，它们与应用程序部署在一起，但对应用程序透明。

这个定义中，有四个关键词：

基础设施层+请求在这些拓扑中可靠穿梭：这两个词加起来描述了Service Mesh的定位和功能，是不是似曾相识？没错，你一定想到了TCP；

网络代理：这描述了Service Mesh的实现形态；

对应用透明：这描述了Service Mesh的关键特点，正是由于这个特点，Service Mesh能够解决以Spring Cloud为代表的第二代微服务框架所面临的三个本质问题。

Service Mesh 优点

1. 屏蔽分布式系统通信的复杂性（负载均衡、服务发现、认证授权、监控追踪、流量控制等等），服务只用关注业务逻辑；

2. 应用语言栈无关，服务可以用任何语言编写，只需和Service Mesh通信即可；

3. 对应用透明，Service Mesh组件可以单独升级。

Service Mesh 挑战

1. Service Mesh组件以代理模式计算并转发请求，一定程度上会降低通信系统性能，并增加系统资源开销；

2. Service Mesh组件接管了网络流量，因此服务的整体稳定性依赖于Service Mesh，同时额外引入的大量Service Mesh服务实例的运维和管理也是一个挑战；

> 历史总是惊人的相似。为了解决端到端的字节码通信问题，TCP协议诞生，让多机通信变得简单可靠；
> 微服务时代，Service Mesh应运而生，屏蔽了分布式系统的诸多复杂性，让开发者可以回归业务，聚焦真正的价值。
