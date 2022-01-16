
### 将一个 git 仓库的子目录拆分成一个单独的库

使用 `git subtree split` 命令

项目结构示例

```tree
parent  // 一个git目录
|-- child1
|-- child2
```

1. 进入 parent 目录, 并将 child1 变成一个 parent 下的一个分支 child1-branch.

   ```shell
   cd parent
   git subtree split -P child1 -b child1-branch
   ```

2. 新建立一个 git 新库

   ```shell
   cd ..
   mkdir new-child1
   cd new-child1
   git init
   ```

3. 拉取 parent 目录分支

   ```shell
   git pull ../parent child1-branch
   ```

4. 在远程创建一个空 git 仓库, 并提交至 git 远程仓库

   示例代码

   ```shell
   git remote add origin git@github.com:helowcode/child1.git
   git branch -M main
   git push -u origin main
   ```

### git 合并两个库中的部分

项目路径以及前两步参考 [将一个-git-仓库的子目录拆分成一个单独的库](#将一个-git-仓库的子目录拆分成一个单独的库)

但是由于此时合并的时候, 不是一个空仓库, 因此, 此处有点变化

3. 进入目标git库拉取分支

   ```shell
   git pull ../parent child1-branch --allow-unrelated-histories
   ```

   此处需要加上`--allow-unrelated-histories`, 如果不加, 合并则会出现 `fatal: refusing to merge unrelated histories` 的提示.

### 从远程 git 合并两个不同的仓库

项目结构示例

   ```log
   parent  // 一个git目录
   |-- child1
   |-- child2
   ```

1. 假设现在有两个 repo：`child1`,`child2`
2. `child2` 的 URL 为 <https://gitee.com/XXX/child2>
3. 现在想把 `child2` 合并到 `child1` 中的 `develop` 分支

```shell
# 进入 child1 目录, 切换分支
cd child1
git checkout develop

# 添加远程连接, 并将命名为 child2
git remote add child2 https://github.com/username/child2
# 获取 child2 仓库的 master 分支更新, 并将分支名为 child2
git fetch child2 master:child2 

# 合并分支
git merge child2 master
git push
```