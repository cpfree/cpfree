# linux 误删文件恢复

## extundelete 恢复误删文件

> 参考网址: <https://blog.csdn.net/weixin_51613313/article/details/110772257>

> EXT(extundelete ）是一个开源的 Linux 数据恢复工具，支持 ext3，ext4 文件系统。(ext4只能在centos6版本恢复)

### 一. 操作前提

1. 误删除文件之后, 马上对文件所在磁盘进行写入保护, 禁止写入, 只允许读取文件.


   例如所在磁盘挂载位置是 `/dev/sdb1`

   ```shell
   # 重新挂载磁盘, 只给予读取权限
   mount -o remount,ro /dev/sbd1
   ```

2. 恢复文件时, 一定要在另外一个分区上进行, 防止写入的文件不小心覆盖了已删除文件的`inode`, `block`块. 如果覆盖, 那就彻底没戏了.


### 二. 安装 extundelete

官方网站: <http://extundelete.sourceforge.net/>, 最好下周稳定版

工具下载: `wget https://nchc.dl.sourceforge.net/project/extundelete/extundelete/0.2.4/extundelete-0.2.4.tar.bz2`

   ```shell
   # 1. 安装必备包
   yum -y install gcc-c++ e2fsprogs.x86_64 e2fsprogs-devel.x86_64

   # 2. 安装 extundelete
   tar -jxvf extundelete-0.2.4.tar.bz2

   # 3. 进入文件夹
   cd extundelete-0.2.4

   # 4. 配置 以及 指定安装目录
   ./configure --prefix=/usr/local/extundelete

   # 5. 编译安装
   make && make install

   # 6. 安装完成后验证安装结果
   extundelete -v
   ```

### 三. 查看被删除文件信息

ext 文件系统中的 inode 节点, 是从 2 开始的, 一般 2 就是代表文件系统的根目录.

1. 查看文件系统/dev/sdb1下存在哪些文件，

   `extundelete /dev/sdb1 --inode 2`

   执行完成可以看到文件系统下的文件(包括删除的, 和被删除的)

### 四. 执行恢复文件操作

1. 使用 `extundelete /dev/sdb1 --restore-all` 可以直接恢复 `/dev/sdb1` 下所有被删除的文件

2. 执行上部命令之后, 查看当前用户目录下, 可以看到 RECOVERED_FILES 文件夹, 里面有被删除的文件.