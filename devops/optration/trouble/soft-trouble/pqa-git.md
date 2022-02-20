# project-question

## git pull 时提示 `Host key verification failed`

1. 2021年10月13日情况

   发现 `~\.ssh\config` 文件中对应的 gitee 的 User 莫名其妙的变成了`countercurrent`, 修改回来 `cpfree` 就好了

2. 2021年10月23日

   升级了 git 之后, 发现提交至gitee不正常了, 情况如下

   1. 提交至 github 是正常的, window 通过命令行 提交和 `git bash` 都是正常的.
   2. 提交至 gitee 是不正常的, window 通过命令行连接 gitee 是正常的, 但是通过 `git bash` 连接 gitee出现权限问题.

   最终解决方式: 将 git版本由 `Git-2.33.1-64-bit.exe` 降至 `Git-2.32.0-64-bit.exe`, 就正常了.
