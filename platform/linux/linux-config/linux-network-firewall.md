# linux 错误处理

## network 相关

### command : service network start/restart

#### `Bringing up interface eth0:  Device eth0 does not seem to be present,delaying initialization`

一.故障现象：

```shell
[root@c1node01 ~]# service network start
Bringing up loopback insterface:                                                            [   OK  ]
Bringing up interface eth0:  Device eth0 does not seem to be present,delaying initialization.                    [FAILED]
 ```
 
解决办法：
[root@c1node01 ~]# rm -rf /etc/udev/rules.d/70-persistent-net.rules
[root@c1node01 ~]# reboot ………………
[root@c1node01 ~]# service network restart
Shutting down loopback insterface:                                                         [   OK   ]
Bringing up loopback insterface:                                                              [   OK   ]
Bringing up interface eth0:                                                                     [   OK   ]
[root@c1node01 ~]#
 
二.另一种方法
造成这样的原因，是因为在虚拟机（Vmware）中移动了Centos系统对应的文件，导致重新配置时，网卡的MAC地址变了，输入ifconfig -a,找不到eth0
·······
 
安装完一个centos虚拟机，又拷贝一份，开机后网卡无法正常启动，报错：Device eth0 does not seem to be present, 
delaying initialization

解决：# mv /etc/sysconfig/network-scripts/ifcfg-eth0 
sysconfig/network-scripts/ifcfg-eth1

vim 
sysconfig/network-scripts/ifcfg-eth1

修改DEVICE="eth0" 
为DEVICE="eth1"

可删掉uuid、物理地址

然后重启启动网卡尝试下

## CentOs防火墙

#centos7启动防火墙
`systemctl start firewalld.service`
#centos7停止防火墙/关闭防火墙
`systemctl stop firewalld.service`
#centos7重启防火墙
`systemctl restart firewalld.service`
 
 
#设置开机启用防火墙
`systemctl enable firewalld.service`
#设置开机不启动防火墙
`systemctl disable firewalld.service`


新增开放一个端口号

`firewall-cmd --zone=public --add-port=80/tcp --permanent`
#说明:
#–zone #作用域
#–add-port=80/tcp #添加端口，格式为：端口/通讯协议
#–permanent 永久生效，没有此参数重启后失效
 
#多个端口:
`firewall-cmd --zone=public --add-port=80-90/tcp --permanent`
#删除
`firewall-cmd --zone=public --remove-port=80/tcp --permanent`



/usr/local/webserver/nginx/sbin/nginx -s reload            # 重新载入配置文件
/usr/local/webserver/nginx/sbin/nginx -s reopen            # 重启 Nginx
/usr/local/webserver/nginx/sbin/nginx -s stop              # 停止 Nginx