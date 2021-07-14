# info

git 可以为每个项目建立不同的密钥, 不同账号配置不同的密钥，不同仓库配置不同密钥。

## git 和 svn 区别

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

### git 配置文件详解

用户目录下 `.gitconfig` 示例

   ```ini
   [credential]
      helper = manager
      username = xxxxx@xxxx.com
   [user]
      name = cpfree
      email = sinjar.chen@qq.com
   ```

### 查看配置项

语法: `git config [--local|--global|--system] #{section.key}`

操作示例

   ```shell
   # 查看 user.name 配置
   git config user.name
   # 查看全局 user.name 配置
   git config --global user.name
   # 查看本地 user.name 配置
   git config --local user.name
   ```

### git 添加和删除配置项

1. 设置值命令语法: `git config [--local|--global|--system] #{section.key} #{value}`
2. 删除值命令语法: `git config [--local|--global|--system] --unset #{section.key}`

> section.key #区域下的键
> value #对应的值

操作示例

   ```shell
   # 设置 用户目录下 `.gitconfig` 文件种的user下的name值为 cpfree
   git config --global user.name "cpfree" 
   # 移除 用户目录下 `.gitconfig` 文件种的user下的name值的值
   git config --global --unset user.name
   ```


## git 命令

## 将一个 git 仓库的子目录拆分成一个单独的库

使用 `git subtree split` 命令

项目结构示例

```tree
parent  // 一个git目录
|-- child1
|-- child2
```

1. 进入 parent 目录, 并将 child1 变成一个 parent 下的一个分支.

   ```shell
   cd parent
   git subtree split -P child1 -b child1
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
   git pull ../parent child1
   ```

4. 在远程创建一个空 git 仓库, 并提交至 git 远程仓库

   示例代码

   ```shell
   git remote add origin git@github.com:helowcode/child1.git
   git branch -M main
   git push -u origin main
   ```
