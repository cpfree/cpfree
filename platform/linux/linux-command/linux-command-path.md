# Linux常用命令简述--dirname与basename 原创

一、简介

1、dirname命令去除文件名中的非目录部分，删除最后一个"\"后面的路径，显示父目录。 语法：dirname [选项] 参数
2、basename命令用于打印目录或者文件的基本名称，显示最后的目录名或文件名。语法：basename [选项] 参数

二、使用实例

1、dirname

   ```shell
   [root@user ~]# dirname /etc/httpd/
   /etc
   [root@user ~]# dirname /etc/
   /
   [root@user ~]# dirname /etc/httpd/conf/httpd.conf
   /etc/httpd/conf
   ```

2、basename

   ```shell
   [root@user ~]# basename $PATH
   tmp
   [root@user ~]# echo $PATH
   /usr/lib64/qt-3.3/bin:/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin:/root/bin:/tmp
   [root@user ~]# basename $PATH
   tmp
   [root@user ~]# basename /etc/httpd/conf/httpd.conf
   httpd.conf
   ```
