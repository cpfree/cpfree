
### 设置 root 密码

安装完系统未设置密码时输入

   ```shell
   cpf@cpf-PC:~$ su root
   密码：
   su：鉴定故障
   ```

此时可以通过 输入命令 `sudo passwd root`，然后系统会让你输入新密码并确认，此时的密码就是root新密码。修改成功后，输入命令su root，再输入新的密码就ok了

   ```shell
   cpf@cpf-PC:~$ su passwd
   没有用户“passwd”的密码项
   cpf@cpf-PC:~$ sudo passwd root
   [sudo] cpf 的密码：
   输入新的 UNIX 密码：
   重新输入新的 UNIX 密码：
   passwd：已成功更新密码
   cpf@cpf-PC:~$ su root
   密码：
   root@cpf-PC:/home/cpf#
   ```
