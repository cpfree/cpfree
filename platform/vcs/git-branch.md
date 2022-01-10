# git 分支

## 基础知识

### 合并策略

1. 启动配置

   命令行输入

   ```shell
   # 全局生效
   git config --global merge.ours.driver true

   # 当前项目生效
   git config merge.ours.driver true
   ```

   > 这句命令的功能是：当进行`code merge`，调用`git -diff`命令的时候，git 先会读取`.gitattributes`文件.
   > 然后发现例如`pom.xml`文件需要执行`git-diff`自定义`driver：ours`，而`ours.driver`设置为`true`了，于是就直接“跳过了”。

   执行完之后, `.gitconfig` 文件下, 会有一段配置

   ```.gitconfig
   [merge "ours"]
      driver = true
   ```

2. 配置 `.gitattributes`

   ```conf
   # 示例1: 指定文件 ==> 跳过 pom.xml 文件 
   pom.xml merge=ours

   # 示例2: 通配符 ==>  跳过所有 xml 文件
   *.xml merge=ours

   # 示例3: 文件路径方式 ==>  跳过所有/src/resources/ 下的 xml 文件
   /src/resources/*.xml merge=ours
   ```

注意点: 

   假如有个 `A` 分支, `A` 分支有一个 `x.txt` 文件, _假设这个时候 `x.txt` 文件版本为 `v1`_
   之后从 `A` 分支建立了一个 `B` 分支, 之后 `B` 分支修改了 `x.txt`, , _假设这个时候 `x.txt` 文件版本为 `v2`_
   此时, 那么`A` 分支 `merge` `B分支` 的时候, 发现`v1` 在 `v2` 的版本链上, 于是就直接更新了. 此时不会调用 `git -diff`, 也不会读取`.gitattributes`文件.

   倘若`A` 分支上也修改了`x.txt` 文件, _假设这个时候 `x.txt` 文件版本为 `v3`_
   之后, 那么`A` 分支 `merge` `B分支` 的时候, 发现`v3` 不在 `v2` 的版本链上, 于是需要解决冲突, 此时先读取`.gitattributes`文件. 判断是否需要忽略该文件, 如果无法忽略, 则调用 `git -diff` 尝试自动解决冲突.


## git 分支部分合并 gitattribute

1. 配置 git 项目

