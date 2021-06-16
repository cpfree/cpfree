# VMware

[TOC]

## linux 相关

### 安装vmware-tools

1. 如果是最小安装的话首先要安装依赖包
   `[root@localhost ~]# yum -y install perl gcc gcc-c++ make cmake kernel kernel-headers kernel-devel net-tools`

2. 检查kernel版本是否和当前系统一致.
   一般情况下, 步骤一安装的kernel都是最新的, 当前启动的kernel和刚安装的kernel不是一个版本. 致使之后的安装可能出现失败, 所以最好重启一下.

   > 判断版本是否一致的方法: 运行两个命令来查看linux内核与 kernel-headers情况
   > 命令一：uname -r (查看内核版本)
   > 命令二：rpm -qa kernel-headers (查看kernel-headers版本)
   > 命令二：rpm -qa kernel-devel (查看kernel-devel版本)
   > 三个命令版本一致后继续下一步

3. VMware workstation 导航栏 --> 虚拟机 --> 安装 VMware tools.
4. 将CD-ROM挂载到指定目录

   ```shell
   # 若存在 /mnt/cdrom, 则该步可省略
   [root@localhost ~]# mkdir -p /mnt/cdrom
   # 挂载目录
   [root@localhost ~]# mount -t auto /dev/cdrom /mnt/cdrom
   mount: /dev/sr0 is write-protected, mounting read-only
   ```

   > 通常情况下都是将设备目录 /dev/crrom 挂载到 /mnt/cdrom 目录, 当然也可能会在 /media/cdrom 目录

5. 拷贝安装包到用户家目录

   ```shell
   # 拷贝文件
   [root@localhost ~]# cp /mnt/cdrom/VMwareTools-10.0.5-3228253.tar.gz ~
   # 解除挂载
   [root@localhost ~]# umount /dev/cdrom
   # 解压安装包
   [root@localhost ~]# tar -zxvf VMwareTools-10.0.5-3228253.tar.gz
   ```

6. 安装VMware Tools

   ```shell
   # 进入文件夹
   [root@localhost ~]# cd vmware-tools-distrib/
   # 运行 `vmware-install.pl` 文件
   [root@localhost vmware-tools-distrib]# perl ./vmware-install.pl
   # 运行 `vmware-install.pl` 命令之后全默认 enter 即可.
   ```

### 建立window10 家庭版和linux虚拟机共享文件夹

1. 在 window10 下新建一个共享文件夹
2. 使用VMware workstation设置将共享文件夹添加至虚拟机(虚拟机最好关机)
   VMware workstation --> 右键当前虚拟机设置 --> 选项 --> 共享文件夹
3. 打开虚拟机, 使用 `ls /mnt/hgfs` 命令看到共享的文件夹.

### [如何快速解决虚拟机中的CentOS7无法上网的方式](http://baijiahao.baidu.com/s?id=1597809303775176940&wfr=spider&for=pc)

1. VM player;
   1. 设置网络连接方式为net方式,
   2. 进入虚拟机 执行脚本,
      `vi /etc/sysconfig/network-scripts/ifcfg-ens33`
      进入编辑模式，将 ONBOOT=no 改为 ONBOOT=yes
   3. `service network restart`，回车确认重启network服务！

   > 重点设置BOOTPROTO=dhcp，ONBOOT=yes

### VM player 配置静态Ip地址

1. 设置网络连接方式为net方式
2. 查询当前网络的网关

   Linux下查看网关的命令不过如果IP是DHCP获取，那么有些命令是不适用的.

   1. cat /etc/resolv.conf
   2. netstat –r
   3. cat /etc/sysconfig/network
   4. cat /etc/sysconfig/network-scripts/ifcfg-eth0
   5. traceroute 第一行就是自己的网关
   6. ip route show
   7. route -n

3. 进入虚拟机执行脚本
   `vi /etc/sysconfig/network-scripts/ifcfg-ens33`

   ```conf
   TYPE=Ethernet
   PROXY_METHOD=none
   BROWSER_ONLY=no
   # BOOTPROTO=dhcp
   BOOTPROTO=static
   DEFROUTE=yes
   IPV4_FAILURE_FATAL=no
   IPV6INIT=yes
   IPV6_AUTOCONF=yes
   IPV6_DEFROUTE=yes
   IPV6_FAILURE_FATAL=no
   IPV6_ADDR_GEN_MODE=stable-privacy
   NAME=ens33
   UUID=664be395-e533-4902-8458-9771112e9439
   DEVICE=ens33
   # 开机即启动
   ONBOOT=yes

   # 配置的IP地址
   IPADDR=192.168.164.131
   # 子网掩码
   NETMASK=255.255.255.0
   # 网关(通过获取当前网络的网关)
   GATEWAY=192.168.164.2
   # DNS google的DNS
   DNS1=8.8.8.8
   ```
