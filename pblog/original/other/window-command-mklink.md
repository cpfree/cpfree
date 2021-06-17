# window-command-mklink

![mklink示例](https://gitee.com/cpfree/picture-warehouse/raw/master/pic/20210615172432.png)

参考网址: [What is the difference between NTFS Junction Points and Symbolic Links?
]<https://stackoverflow.com/questions/9042542/what-is-the-difference-between-ntfs-junction-points-and-symbolic-links>

<https://liam.page/2018/12/10/mklink-in-Windows/>

## mklink `/D` & `/J` 的区别

| 操作 | `/D` | `/J` |
| - | - | - |
| 用mklink创建链接 | 需要管理员权限 | 不需要管理员权限
| 路径格式 | 可以使用相对路径方式创建, 也可以使用绝对路径创建 | 必须绝对路径方式创建
| 路径类型 | 可以是远程目录 | 必须本地目录
| 对创建的链接进行复制 | 相当于对源文件夹进行复制 | 遍历源文件夹, 对里面的每个文件分别执行复制到目标文件夹的操作(如果目标文件夹不存在则创建)
| 对创建的链接进行拖拽移动 | 正常移动, 移动之后链接依然可以定位到源文件夹 | 拖拽移动后无效, 什么都不执行
| 对创建的链接进行剪贴移动 | 正常移动, 移动之后链接依然可以定位到源文件夹 | 遍历源文件夹, 对里面的每个文件分别执行移动到了新的文件夹的操作(如果目标文件夹不存在则创建).
| 对创建的链接进行删除 | 链接被删除, 不影响源文件夹 | 链接被删除, 不影响源文件夹
| 访问速度 | 较慢 | 较快
| 远程访问 | 无法有效支持远程访问 | 可以支持远程访问(但需要是相同系统)
| 支持系统 | Window Vista+ | Window 2000+

> 总体来说
> `/J` 是`DOS`里面的一个遗留设计(及其垃圾, 不优雅, 尤其是它的行为, 简直不要太死巴), 创建时必须使用绝对路径, 创建后除非删除命令, 否则它将一直在那, 为了是`/J`变得像文件一样好操作, 官方刻意为`/J`单独适配了复制和剪贴移动的命令, 这点已经有点不够优雅了, 对创建的链接进行`拖拽移动`的命令直接无视掉就显得太不优雅啦!
> 但也由于`/J` 的安全性和速度使得它没有被淘汰掉.
> 可能是 `/J` 太过垃圾, 另外隔壁linux的软连接很不错, 于是, `DOS` 抄袭 linux里面的软连接 创建出了 `/D` 参数.
> 因此 `/D` 就显得优雅多了.