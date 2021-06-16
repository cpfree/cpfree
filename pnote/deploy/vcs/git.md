# info

Git共有三个级别的config文件，分别是system、global和local。

在当前环境中，分别对应

%GitPath%\mingw64\etc\gitconfig文件
$home.gitconfig文件
%RepoPath%.git\config文件

其中%GitPath%为Git的安装路径，%RepoPath%为某仓库的本地路径。

所以 system 配置整个系统只有一个，global 配置每个账户只有一个，而 local 配置和git仓库的数目相同，并且只有在仓库目录才能看到该配置。

大致思路，建立两个密钥，不同账号配置不同的密钥，不同仓库配置不同密钥。

## git 命令

## 将一个git仓库的子目录拆分成一个单独的库

使用 `git subtree split` 命令

项目结构示例

   ```tree
   parent  // 一个git目录
   |-- child1
   |-- child2
   ```

1. 进入parent目录, 并将 child1 变成一个parent下的一个分支.

   ```shell
   cd parent
   git subtree split -P child1 -b child1
   ```

2. 新建立一个git新库

   ```shell
   cd ..
   mkdir new-child1
   cd new-child1
   git init
   ```

3. 拉取 parent 目录分支

   ```shell
   git pull ../parent child1
   ```

4. 在远程创建一个空git仓库, 并提交至git远程仓库

   示例代码

   ```shell
   git remote add origin git@github.com:helowcode/child1.git
   git branch -M main
   git push -u origin main
   ```
