# mysql install

[toc]

## mysql 初始化安装

### window(安装包安装mysql-8.0.19-winx64)

> 安装包 mysql-8.0.19-winx64.zip

1. 解压缩
2. my.ini 文件拷贝

   my.ini 文件

   ```ini
   [mysqld]
   # 设置3306端口
   port = 3306
   # 设置mysql的安装目录
   basedir=D:\\programing\\DB\mysql-8.0.19-winx64
   # 设置 mysql数据库的数据的存放目录，MySQL 8+ 不需要以下配置，系统自己生成即可，否则有可能报错
   # datadir=D:\\programing\\DB\mysql-8.0.19-winx64\\data
   # 允许最大连接数
   max_connections=20
   # 允许连接失败的次数。
   # max_connect_errors=10
   # 服务端使用的字符集默认为8比特编码的latin1字符集
   character-set-server=utf8mb4
   # 创建新表时将使用的默认存储引擎
   default-storage-engine=INNODB
   # 默认使用“mysql_native_password”插件认证
   default_authentication_plugin=mysql_native_password
   # sql_mode=ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION
   # sql_mode=STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION

   [mysql]
   default-character-set=utf8mb4

   [client]
   default-character-set=utf8mb4
   ```

   1. 在mysql 安装根目录下新建 `my.ini` 文件.
   2. 更改 `basedir` 为mysql解压的根目录.
   3. 配置其他属性.

3. 安装mysql

   命令行到mysql安装的bin目录下执行 `mysqld --initialize --console`

   ```bat
   > cd bin
   D:\programing\DB\mysql-8.0.19-winx64\bin>mysqld --initialize --console
   2020-02-17T04:09:50.453471Z 0 [System] [MY-013169] [Server] D:\programing\DB\mysql-8.0.19-winx64\bin\mysqld.exe (mysqld 8.0.19) initializing of server in progress as process 15508
   2020-02-17T04:10:15.752329Z 5 [Note] [MY-010454] [Server] A temporary password is generated for root@localhost: p6O&AK<Et+;o
   ```

   > note : 如果命令行没有反应，可能是my.ini配置的不正确

   执行完成之后会输出一个临时密码, 记住这个密码, 后面要用

4. 安装服务
   1. mysqld --install [服务名]

   > 注意此命令需要管理员权限, 否则会报错误: `Install/Remove of the Service Denied`.
   > 后面的服务名可以不写，默认的名字为 mysql。当然，如果你的电脑上需要安装多个MySQL服务，就可以用不同的名字区分了，比如 mysql5 和 mysql8。
   > 安装完成之后，就可以通过命令`net start mysql`启动MySQL的服务了。通过命令`net stop mysql`停止服务。通过命令`sc delete MySQL/mysqld -remove`卸载 MySQL 服务.

5. 启动服务 `net start mysql`
6. `mysql -u root -p`
7. `ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'CPF@4823';`
8. 管理员root的host是localhost，代表仅限localhost登录访问。如果要允许开放其他ip登录，则需要添加新的host。如果要允许所有ip访问，可以直接修改成“%”

> 安裝錯誤或忘記密碼可以嘗試重新初始化

创建用户：

 

CREATE USER 'xxh'@'%' IDENTIFIED WITH mysql_native_password BY 'xxh123!@#';

 

#(需要注意：mysql8.0加密方式修改了)
#检查用户

 

select user, host, plugin, authentication_string from user\G;

 

授权远程数据库

#授权所有权限 
GRANT ALL PRIVILEGES ON *.* TO 'xxh'@'%'；
#授权基本的查询修改权限，按需求设置
GRANT SELECT,INSERT,UPDATE,DELETE,CREATE,DROP,ALTER ON *.* TO 'xxh'@'%';

查看用户权限
show grants for 'xxh'@'%';

### linux yum 安装(mysql 8.0 yum_CentOS8 安装 MySQL8.0)

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

## mysql 配置


