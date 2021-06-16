# linux命令-用户和用户组相关命令

[回到顶部](https://www.cnblogs.com/ysocean/p/7795480.html#_labelTop)

1. 添加用户命令：useradd
2. 修改用户密码：passwd
3. 修改用户信息：usermod
4. 修改用户密码状态：chage
5. 删除用户命令：userdel
6. 查看用户id
7. 切换用户身份 su
8. 添加用户组：groupadd
9. 修改用户组：groupmod
10. 删除用户组：groupdel
11. 总结

------

## 命令详解

### 1、添加用户命令：useradd

示例

```shell
# 添加用户命令
[root@node3 tmp]# useradd sinjar
[root@node3 tmp]
```

1. 命令所在路径：/usr/sbin/useradd
2. 执行权限：**root**
3. 语法： useradd 【选项】【用户名】
   > -u UID:手工指定用户的uid
   >
   > -d 家目录:手工指定用户的家目录
   >
   > -c 用户说明:手工指定用户说明
   >
   > -g 组名:手工指定用户的初始组
   >
   > -G 组名:手工指定用户的附加组
   >
   > -s shell:手工指定用户的登录shell，默认是/bin/bash

创建一个新用户之后，会在下面文件中自动生成内容：

   1. /etc/passwd：生成用户信息

   2. /etc/shadow：生成密码信息

   3. /etc/group：生成用户组信息

   4. /etc/gshadow：生成用户组密码信息

   5. /home/tom:创建家目录

   6. /var/spool/mail/tom：创建用户邮箱目录

   ![img](https://images2017.cnblogs.com/blog/1120165/201711/1120165-20171107075904856-16575032.png)

   上面出现了很多默认值，用户默认值文件如下：

   ![img](https://images2017.cnblogs.com/blog/1120165/201711/1120165-20171107080007513-1624143077.png)

   ![img](https://images2017.cnblogs.com/blog/1120165/201711/1120165-20171107080018044-670391775.png)

[回到顶部](https://www.cnblogs.com/ysocean/p/7795480.html#_labelTop)

### 2、修改用户密码：passwd

命令名称：passwd
命令所在路径：/usr/bin/passwd
执行权限：**root**
功能描述：修改用户的密码
语法： passwd 【选项】【用户名】

            -S   查询用户密码的密码状态，仅root用户可用

            -l   暂时锁定用户。仅root用户可用

            -u   解锁用户。仅root用户可用

            -stdin 可以通过管道符输出的数据作为用户的密码

   注意：root用户能修改任何用户的密码，语法为 passwd 用户名。而普通用户只能修改自己的密码，语法为 passwd，后面不能加普通用户名，而且密码要符合密码规则，不然修改不了。

   ![img](https://images2017.cnblogs.com/blog/1120165/201711/1120165-20171107081234575-221902510.png)

[回到顶部](https://www.cnblogs.com/ysocean/p/7795480.html#_labelTop)

### 3、修改用户信息：usermod

   ![img](https://images2017.cnblogs.com/blog/1120165/201711/1120165-20171107081359263-1466500530.png)

 

[回到顶部](https://www.cnblogs.com/ysocean/p/7795480.html#_labelTop)

### 4、修改用户密码状态：chage

   ![img](https://images2017.cnblogs.com/blog/1120165/201711/1120165-20171107081446356-987783170.png)

 

[回到顶部](https://www.cnblogs.com/ysocean/p/7795480.html#_labelTop)

### 5、删除用户命令：userdel

   语法：userdel 【-r】用户名

      　-r 删除用户的同时删除用户家目录

   执行上面的命令，会自动删除下面的文件：

   ①、删除 /etc/passwd 文件的用户信息

   ②、删除 /etc/shadow 文件的用户密码信息

   ③、删除/etc/group 文件的用户组信息

   ④、删除 /etc/gshadow 文件的用户组密码信息

   ⑤、删除用户的邮件信息 rm -rf /var/spool/mail/用户名

   ⑥、删除用户的家目录 rm -rf /home/用户名

   注意：基本上完整的删除一个用户都是要加上 -r 选项的。如何判断是否完整的删除一个用户，只需要从新添加该用户一次，如果报如下错误则没有删除干净：

   ![img](https://images2017.cnblogs.com/blog/1120165/201711/1120165-20171107082024278-230233963.png)

 

[回到顶部](https://www.cnblogs.com/ysocean/p/7795480.html#_labelTop)

### 6、查看用户id



   ![img](https://images2017.cnblogs.com/blog/1120165/201711/1120165-20171107082506372-1518221679.png)

 

[回到顶部](https://www.cnblogs.com/ysocean/p/7795480.html#_labelTop)

### 7、切换用户身份 su 

   ![img](https://images2017.cnblogs.com/blog/1120165/201711/1120165-20171107082916950-339798318.png)

 

   注意：选项 - 千万不能省略，必须要连带用户的环境变量一起切换。从普通用户切换到 root 用户是需要输入密码的，而从root用户切换到普通用户是不需要输入密码的。

   ![img](https://images2017.cnblogs.com/blog/1120165/201711/1120165-20171107083231684-1998207253.png)

 

[回到顶部](https://www.cnblogs.com/ysocean/p/7795480.html#_labelTop)

### 8、添加用户组：groupadd

   语法：groupadd 【选项】组名

         -g GID 指定组id

[回到顶部](https://www.cnblogs.com/ysocean/p/7795480.html#_labelTop)

### 9、修改用户组：groupmod

   语法：groupmod 【选项】组名

         -g GID 修改组id

         -n 新组名 修改组名

   范例：把组名 group1 修改为 group2

         groupmod -n group2 group1

[回到顶部](https://www.cnblogs.com/ysocean/p/7795480.html#_labelTop)

### 10、删除用户组：groupdel

   语法：groupdel 组名

[回到顶部](https://www.cnblogs.com/ysocean/p/7795480.html#_labelTop)

### 11、总结

   本篇博客我们讲解了管理用户和用户组的命令，包括新建、修改、查看等等。还讲解了切换用户的命令 su，这个命令以后用到的也比较多。那么通过这一篇博客和前面一篇博客，用户和用户组管理就结束了，下篇博客我们将进入权限管理的介绍。