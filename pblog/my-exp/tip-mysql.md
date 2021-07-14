# tip

MYSQL 中 int 类型和 Integer 类型没有区别。

## mysql和mysqld的区别

1. mysqld是后台服务程序，即mysql服务器，是一个服务，linux中的服务通常以d结尾，缩写是daemon，守护的意思

2. mysql是一个交互式输入sql语句或从sql文件批处理它们的一个命令行工具，它相当于一个客户端软件，可以对服务端mysqld发起连接。

## mysql 登录

命令行登录本地mysql

   命令格式: `mysql -u ${用户名} -p`

   > 中间的空格可以省略, 变成 `mysql -u${用户名} -p`

   1. `mysql -u root -p`

登录远程mysql

   命令格式: `mysql -h ${主机host} -P ${端口} -u ${用户名} -p`
   > 中间的空格可以省略, 变成 `mysql -h${主机host} -P${端口} -u${用户名} -p`

## 查询mysql版本

1. navicat工具版本查看
2. 命令行登录后, 会显示mysql相关信息, 其中有版本号
3. 命令行登录后, 使用 `status` 命令, 会显示出数据库相关信息, 其中就有版本号
4. 使用查询命令 `select version();` 查看



