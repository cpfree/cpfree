# golang

## 语言简介

google公司设计, 起源于 2007 年，并在 2009 年正式对外发布

旨在不损失应用程序性能的情况下降低代码的复杂性，具有“部署简单、并发性好、语言设计良好、执行性能好”等优势

它不但能让你访问底层操作系统，还提供了强大的网络编程和并发编程支持。Go语言的用途众多，可以进行网络编程、系统编程、并发编程、分布式编程。

通过接口（interface）的概念来实现多态性。Go语言有一个清晰易懂的轻量级类型系统，在类型之间也没有层级之说。因此可以说Go语言是一门混合型的语言。

很多重要的开源项目都是使用Go语言开发的，其中包括 Docker、Go-Ethereum、Thrraform 和 Kubernetes。

Go 是编译型语言, 是第一门完全支持 UTF-8 的编程语言

## golang 配置简介

通过下载安装 `go1.16.6.windows-amd64.msi` 之后, 发现环境变量里面多了几个参数

1. 用户变量

   GOPATH: C:\Users\CPF\go

2. 系统变量: Path 下 多了 D:\programing\SDK\go\bin

## IDE 安装和配置

> 第一次开发go的时候, 最好使用命令行的形式和比较轻量的文本编辑器看下go语言文件和相关含义
> 但是了解go语言结构后, 考虑到 IDE 的代码提示和 代码推荐检查功能, 使用goland作为初始开发工具, 能帮助对代码进行随时优化和检查

   ```bash
   #!/bin/bash

   echo "200.31.239.114 9773
   200.31.239.114 9777
   200.31.239.114 9778" | \
   while read host port; do
   r=$(bash -c 'exec 3<> /dev/tcp/'$host'/'$port';echo $?' 2>/dev/null)
   if [ "$r" = "0" ]; then
      echo $host $port is open
   else
      echo $host $port is closed
   fi
   done
   ```

