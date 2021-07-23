# linux-command-run

## 命令行启动程序后台运行

```shell script
#后台执行程序
nohup ${command} > /dev/null 2>&1 &

#查看后台程序
ps aux |grep "test.sh"  #a:显示所有程序  u:以用户为主的格式来显示   x:显示所有程序，不以终端机来区分
ps -ef |grep "test.sh"  #-e显示所有进程。-f全格式。

#关闭后台程序
kill 1001
kill  -9 1001  #-9表示强制关闭
```

> `/dev/null` 表示一个黑洞位置，代表linux的空设备文件，所有往这个文件里面写入的内容都会丢失。

### linux后台运行命令nohup和&的区别

1. &的意思是在后台运行， 什么意思呢？  意思是说， 当你在执行 ./a.out & 的时候， 即使你用ctrl C,  那么a.out照样运行（因为对SIGINT信号免疫）。 但是要注意， 如果你直接关掉shell后， 那么， a.out进程同样消失。 可见， &的后台并不硬（因为对SIGHUP信号不免疫）。

2. nohup的意思是忽略SIGHUP信号， 所以当运行nohup ./a.out的时候， 关闭shell, 那么a.out进程还是存在的（对SIGHUP信号免疫）。 但是， 要注意， 如果你直接在shell中用Ctrl C, 那么, a.out进程也是会消失的（因为对SIGINT信号不免疫）

3. 所以， &和nohup没有半毛钱的关系， 要让进程真正不受shell中Ctrl C和shell关闭的影响， 那该怎么办呢？ 那就用nohua ./a.out &吧， 两全其美。
