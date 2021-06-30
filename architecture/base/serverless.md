# Serverless

> 参考自: Techo TVP 开发者峰会 ServerlessDays China 2021 讲师PPT

Serverless 并不是没有服务器,serverless 表示应用程序的开发人员无需担心基础设施, 如:容器,Vm或物理服务器的容量规划,配置,管理,维护,操作或扩展.

使用 Serverless 需要确实

1. 有没有提升开发效率,可以更快地开发和上线
2. 是不是可以有更高的性能和更好的稳定性,扩展性和安全性
3. 有没有降低运维的成本
4. 有没有很好地管理好成本和使用量
5. 开发人员可以更容易很自然地融合到`DevDps/SRE`中来

## 历史

惨淡经营

2006年- Zimiki伦敦 Fotang推出 Pay as you go",商业上失败,201年关闭.
200B年-GoogleappEngine..仅限于Python.包括具有60秒超时的HTTP函数,以及具有自己的超时的Bb存储区和数据存储区.不允许内存中的持久性.(后来更名为 Google Cloud Platform)
z010年- IcLoud伻平台.旨在通过三个操作来简化云计算. Cloudcall!云上运行您的自定义函数,
cloud resulti索函数的返回值, cloud. mal将您的函数映射到多个参数.[2013年被 Dropbox收购,
之后再也不做5 erverle55了
2011年- dotcloug公司,Dake公司前身,最终也是以失败告终
国内的各种 APP Engine-THE,5月E…[基本也是以失败告终〕

## 思考

1. Serverless 如何进行服务发现?
2. Serverless 如何进行健康检查?
3. Serverless 如何做灰度发布或用B测试?
4. Serverless 需要监控哪些指标,以及调用链
5. Serverless 相互间的依赖关系如何管理?
6. Serverless 的容错处理(重试、限流、降低、隔离、断)5L月如何保障?

是不是 Serverless 无所谓
