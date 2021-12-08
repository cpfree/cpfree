# git

## git init

创建版本库

## git config

### git 配置文件

| git config 命令              | 对应文件                          | 含义                        | 备注                |
| ---------------------------- | --------------------------------- | --------------------------- | ------------------- |
| `git config --list`          |                                   | 查看现在的 git 环境详细配置 |
| `git config --system --list` | `%GitPath%\mingw64\etc\gitconfig` | 查看系统 config             | 整个系统只有一个    |
| `git config --global --list` | `$home.gitconfig`                 | 查看当前用户（global）配置  | 每个账户只有一个    |
| `git config --local --list`  | `%RepoPath%.git\config`           | 查看当前仓库配置信息        | 每个 git 仓库有一个

> `--list` 也可以换成 `-l`
>
> `%GitPath%`为 Git 的安装路径，`%RepoPath%`为某仓库的本地路径。
>
> 三个配置文件优先级是 `system < global < local`

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

## git merge & rebase

merge(合并): 用于合并分支, 例如将 A, 和 B 的分支进行合并, 形成 C.

rebase(变基): 由merge演变而来, 它的结果一般来说与merge一样, 但是变基实现方式不是分支的合并, 而是将分支A上面的提交, 在分支B上面重新提交一遍.
   **变基可以使提交历史为线性提交。**
   变基本质上是一个完全在本地仓库进行的操作(这是DCSV特有的)，我们往往是在本地执行完成变基操作后，再向远程仓库push。这样做，避免了其他合作者的处理冲突，其他合作者只需要利用git merge自身的fast-forward即可完成Merge的工作。

   变基适用于多人线上合作开发的场景，避免其他合作者处理冲突，例如github上开源项目的维护。公司内部因为地理上、组织上的便利性，可以酌情使用变基。
