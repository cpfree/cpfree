# golang

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

