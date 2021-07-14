# git

## git init

创建版本库

## git status 

   ```shell
   #查看指定文件状态
   git status [filename]

   #查看所有文件状态
   git status

   #精简的方式显示文件状态
   git status -s
   ```

查看仓库状态, 看下哪些改过, 哪些没有改过

## git diff ${文件路径}

查询某一个文件做了什么修改

   ```bash
   CPF@window-sinjar MINGW64 /p/git/my-note/code-exp (master)
   $ git diff bus-logic/account/account.md
   diff --git a/bus-logic/account/account.md b/bus-logic/account/account.md
   index 1e306c9..2a3e745 100644
   --- a/bus-logic/account/account.md
   +++ b/bus-logic/account/account.md
   @@ -10,5 +10,9 @@
   8. 第三方登录


   +## 稳定性
   +
   +1. 幂等性验证
   +

   ```

## git add ${文件路径}

将文件添加至git版本库管理

## 