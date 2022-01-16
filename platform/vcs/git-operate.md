# info

git 可以为每个项目建立不同的密钥, 不同账号配置不同的密钥，不同仓库配置不同密钥。

## git 和 svn 区别

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


## git 操作命令

### git撤销(reset & resolve)

1. git reset: reset 是移动本地 git 的当前版本的节点指针 
 
   例如下图, 在使用reset之前, head在D点, C, D 均是错误提交, 现在想要将撤销C, D 的提交, 将提交回滚到 B
   ![](https://gitee.com/cpfree/picture-warehouse/raw/master/pic1/20211123210921.png)

   执行之后如下图, head 指针已经指向了 B.

   ![](https://gitee.com/cpfree/picture-warehouse/raw/master/pic1/20211123211209.png)

   但是这样该法有几个问题
   1. 只能修改本地, 无法进行修改远程, 远程的head指针, 依然指向D
   2. 此时若是想要push, 则会报错, 需要使用 `git push -f` 强制往远程推送.
   3. 一旦`push -f`之后, C, D的提交信息将无法再找回来.

2. git revert

   git revert 的命令是, 生成一个新的提交E, 而新的E提交内容刚好是撤销掉C, D 两次的提交, 使得E的内容和B的一模一样.

一般来说, 有些公司明确禁止使用reset, 推荐使用`git revert`. 因为数据无价, 操作时还是小心谨慎为好.
