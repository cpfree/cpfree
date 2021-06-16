# 批量测试IP端口号是否联通

## linux环境批量测试IP端口号

linux环境: `tcp_ipport_batch_test.sh`

```sh
#!/bin/bash

echo "200.31.158.3 10151
200.31.158.3 10152
200.31.154.15 7877
200.31.154.13 9877
200.31.154.15 9877
200.31.147.22 9877
200.31.147.23 9877
200.31.154.14 9773
200.31.157.210 52299" | \
while read host port; do
  r=$(bash -c 'exec 3<> /dev/tcp/'$host'/'$port';echo $?' 2>/dev/null)
  if [ "$r" = "0" ]; then
    echo $host $port is open
  else
    echo $host $port is closed
  fi
done
```

> 将批量测试的IP地址和端口号放入 echo 的字符串, 直接访问文件执行 `tcp_ipport_batch_test`

听你们说 A0541T104, A0541T105, A0541T106 中的数据是处理过的, 如果我们获取即期和远期的实时数据的话, 可以从这几个接口里面获取吗? 还是说我们应该调用A0541T124接口呢?

, 对应即期和远期数据







