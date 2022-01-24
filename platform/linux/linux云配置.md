# linux 开机配置(云服务器CentOs8版本)

[TOC]

## 1. 系统配置

### 1.1. 创建新用户(以用户sinjar为例)

   ```shell
   # 创建用户
   useradd sinjar
   # 为用户创建密码
   passwd sinjar
   ```

### 1.2 改用密钥连接

> root 账户设置为只能够使用密钥连接, 普通用户设置为可以使用密钥和密码连接.

请看 [ssh.md#场景2-设置云服务器通过密钥登录](/platform/util-command/ssh.md#场景2-设置云服务器通过密钥登录)

### 1.3 ssh，一段时间不操作就自动断开连接

为了保证服务器安全和避免资源的空闲, 对 `/etc/ssh/sshd_config` 文件进行配置修改

属性 **ClientAliveInterval**: 设置超时间隔（以秒为单位），如果服务器一段时间(ClientAliveInterval设置的值)没有从客户端接收到任何数据，则sshd将通过加密的通道发送消息以请求客户端的响应。
属性 **ClientAliveCountMax**: 如果服务器一段时间(ClientAliveInterval设置的值)没有从客户端接收到任何数据, 服务器向客户端发送请求相应的最大次数.

> 如果ClientAliveCountMax为3, ClientAliveInterval设置为15，则服务器15秒后没有接收到客户端传来的数据的话, 将会通过加密的通道发送消息以请求客户端的响应, 如果客户端一直不响应, 则ssh将在大约45秒后断开连接。此选项仅适用于linux协议版本2。

1. 命令行 `vim /etc/ssh/sshd_config`
2. 修改其中的属性

   ```conf
   # 服务器 30 秒后没有接收到客户端传来的数据的话, 将会通过加密的通道发送消息以请求客户端的响应
   ClientAliveInterval 30
   # 如果客户端一直不响应, 则ssh将在大约 120 秒后断开连接。
   ClientAliveCountMax 4
   ```

3. 最后，重启 SSH 服务：
   `[root@host .ssh]$ service sshd restart`

   > [sshd_config官方文档](https://linux.die.net/man/5/sshd_config)

### 1.4 为普通用户添加 sudo 权限

> 如果用户没有`sudo`权限, 在执行的时候会报 `xxx is not in the sudoers file.This incident will be reported.` 错误, 此时执行以下两步就可以使用sudo权限了.

1. 使用root账户.
2. 编辑 `vi /etc/sudoers`文件, 找到行 root ALL=(ALL) ALL,在他下面添加xxx ALL=(ALL) ALL (这里的xxx是你的用户名).

   ```conf
   # 允许用户youuser执行sudo命令(需要输入密码).
   youuser            ALL=(ALL)                ALL
   # 允许用户组youuser里面的用户执行sudo命令(需要输入密码).
   %youuser           ALL=(ALL)                ALL
   # 允许用户youuser执行sudo命令,并且在执行的时候不输入密码.
   youuser            ALL=(ALL)                NOPASSWD: ALL
   # 允许用户组youuser里面的用户执行sudo命令,并且在执行的时候不输入密码.
   %youuser           ALL=(ALL)                NOPASSWD: ALL
   ```

   > `/etc/sudoers` 文件是只读文件, 可以使用root强行覆盖, 但是也可以更改权限
   > 添加sudoers文件写权限: `chmod u+w /etc/sudoers`
   > 撤销sudoers文件写权限: `chmod u-w /etc/sudoers`

### 1.5 开放端口供访问

   阿里云服务器有两层防火墙, 一层是linux自带防火墙, 一层是阿里云网页版的安全组策略开放端口号, 可以挑一种使用.

1. 使用`netstat -lntp`命令查看端口号监听状态

   ```shell
   [sinjar@sinjar-aliyun-0 ~]$ netstat -lntp
   (Not all processes could be identified, non-owned process info
   will not be shown, you would have to be root to see it all.)
   Active Internet connections (only servers)
   Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name    
   tcp        0      0 0.0.0.0:5355            0.0.0.0:*               LISTEN      -                   
   tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN      -                   
   tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      -                   
   tcp6       0      0 :::5355                 :::*                    LISTEN      -      
   ```



2. 使用 `firewall-cmd --list-services` 查看端口号开放状态

   > 发现80和443没有开放


## 安装基础环境

### docker

1. 安装docker

   官方脚本一键安装 `curl -fsSL https://get.docker.com | bash -s docker --mirror Aliyun`

   > 之前写了一个文档, 但是太老了, 最新的安装方式请参照菜鸟教程docker安装.

2. root 启动 docker

   > 一般可以设置为开机自启, 没设置也没关系, 使用root账户启动一下(默认非root账户没有办法启停docker), 一般linux也不重启.

   `systemctl start docker`

3. 给普通用户操作docker的权限

   启动docker之后, 普通用户依然没有办法操作docker,
   如果提示get …… dial unix /var/run/docker.sock权限不够，则修改/var/run/docker.sock权限
   则执行如下命令`sudo chmod a+rw /var/run/docker.sock`，即可

4. 配置阿里云镜像仓库

   使用root权限新增或修改 `vim /etc/docker/daemon.json`, 设置以下内容

   ```json
   {
      "registry-mirrors": ["加速地址"]
   }
   ```

   依次执行命令刷新docker

   ```shell
   sudo systemctl daemon-reload  
   sudo systemctl restart docker
   ```

### docker 安装软件

#### docker 安装redis

1. 搜索镜像
   `docker search redis`

2. 拉取镜像
   `docker pull redis`

3. 创建Redis容器并设置密码

   ```shell
   # 不设置密码启动
   > docker run --name redis -p 6380:6379 redis-test

   # 设置密码启动
   > docker run --name redis -p 6380:6379 redis-test --requirepass 123456
   ```

4. 使用密码 `123456` 连接 `redis` 测试.

5. 查看密码 和 修改密码

   为现有的redis创建密码或修改密码的方法：

   ```shell
   # docker 进入 redis 的容器
   [sinjar@sinjar-aliyun-0 ~]$ docker exec -it redis-test /bin/bash

   # 进入 /usr/local/bin 目录
   root@e1faa8b01b13:/# cd /usr/local/bin
   
   # 该文件夹里面有 redis-cli
   root@e1faa8b01b13:/usr/local/bin# ls
   docker-entrypoint.sh  gosu  redis-benchmark  redis-check-aof  redis-check-rdb  redis-cli  redis-sentinel  redis-server

   # 运行命令 启动客户端
   root@e1faa8b01b13:/usr/local/bin# redis-cli

   # 查看现有的redis密码
   127.0.0.1:6379> config get requirepass
   1) "requirepass"
   2) ""

   # 设置redis密码 为 abc123
   127.0.0.1:6379> config set requirepass abc123
   ```

#### mysql 安装笔记

mysql 8.0 yum_CentOS8 安装 MySQL8.0（yum）

1. Mysql 官网下载 RPM 包

   `wget https://dev.mysql.com/get/mysql80-community-release-el8-1.noarch.rpm`

2. 检查是否已安装(强力卸载)

   ```shell
   for i in $(rpm -qa|grep mysql);do rpm -e $i --nodeps;done
   rm -rf /var/lib/mysql && rm -rf /etc/my.cnf && rm -rf /usr/share/mysql
   ```

   > 备注：可配合以下方式查找

   ```shell
   whereis mysql
   find / -name mysql
   yum remove mysql mysql-server mysql-libs
   ```

3. 安装 rpm 包

   `yum localinstall rpm`

4. yum 安装

   ```shell
   yum update
   yum install mysql-server
   ```

5. 查看 mysql 是否安装成功

   ```shell
   ps -ef | grep mysql
   mysqladmin --version
   ```

6. 启动 mysql 服务

   ```shell
   systemctl start mysqld

   systemctl enable mysqld

   systemctl status mysqld
   ```

7. 相关安装目录

   ```dir
   /usr/bin //相关命令

   /usr/share/mysql //配置文件目录

   /var/lib/mysql //数据库文件存放目录

   /etc/my.cnf.d //mysql的启动配置文件

   * client.cnf //mysql客户端配置文件

   * mysql-server.cnf //mysql守护进程配置文件

   * mysql-default-authentication-plugin.cnf //默认权限授权配置文件
   ```

   备注：

   可复制一份到/etc下，修改成my.cnf

8. mysql 登录(不用密码登录)

   mysql -uroot

9. 重置 root 密码

   use mysql; //选择数据库

   alter user 'root'@'localhost' identified by 'root'; //修改密码

   flush privileges; //刷新权限表

   备注：mysql8.0修改用户密码命令(新的修改方式)

10. 重新登录(使用新密码)

   mysql -uroot -p

   mysql Mysql8.0 centos yum
