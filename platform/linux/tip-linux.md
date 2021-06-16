进入终端后可以看到命令行前的提示符为$符号，这代表登录的是普通用户在创建shell脚本，如果命令行是#符号 那就证明是管理员在创建shell...

# llinux

1. 安装nodejs, 菜鸟教程.
   npm在nodejs里面

2. 安装svn

/home/cpf/Downloads/node-v12.14.1-linux-x64

## tip

`/usr/local/bin` 在环境变量里面, 其中的命令可以在任何路径下执行, 通过软连接将脚本连接到其目录下, 即可实现在任何地方执行所连接的脚本.

将npm命令软连接到/local/bin命令下.
 `ln -s /home/cpf/program/node-x64/bin/npx  /usr/local/bin/`

 `sudo apt-get install gcc`
