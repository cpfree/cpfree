---
keys: 
type: copy,blog,trim
url: <https://nvie.com/posts/a-successful-git-branching-model/>, <https://gitbook.tw/chapters/gitflow/why-need-git-flow>
id: 220107-212247
---

# git 项目

## git flow

> 参考网址: 
> - <https://nvie.com/posts/a-successful-git-branching-model/>
> - <https://gitbook.tw/chapters/gitflow/why-need-git-flow>

主要的分支有 master、develop、hotfix、release 以及 feature 这五种分支，各种分支负责不同的功能。其中 Master 以及 Develop 这两个分支又被称做长期分支，因为他们会一直存活在整个 Git Flow 里，而其它的分支大多会因任务结束而被删除。

![](https://gitee.com/cpfree/picture-warehouse/raw/master/pic1/20220107212459.png)

![](https://gitee.com/cpfree/picture-warehouse/raw/master/pic1/20220107213942.png)

1. Master 分支(长期分支)
   主要是用来放稳定、随时可上线的版本。这个分支的来源只能从别的分支合并过来，开发者不会直接 Commit 到这个分支。因为是稳定版本，所以通常也会在这个分支上的 Commit 上打上版本号标签。

2. Develop 分支(长期分支)
   这个分支主要是所有开发的基础分支，当要新增功能的时候，所有的 Feature 分支都是从这个分支切出去的。而 Feature 分支的功能完成后，也都会合并回来这个分支。

   ![Master & Develop](https://gitee.com/cpfree/picture-warehouse/raw/master/pic1/20220107213725.png)

3. Feature 分支(短期分支)

   命名约定: 除了 `master`, `develop`, `release-*`, `hotfix-*`, 均可以

   当要开始新增功能的时候，就是使用 Feature 分支的时候了。**Feature 分支都是从 Develop 分支来的，完成之后会再并回 Develop 分支**。

   > 用完之后, 可以删除掉
   > ![](https://gitee.com/cpfree/picture-warehouse/raw/master/pic1/20220107213800.png)

4. Release 分支

   命名约定 `release-*`

   当认为 Develop 分支够成熟了，就可以把 Develop 分支合并到 Release 分支，在这边进行算是上线前的最后测试。测试完成后，Release 分支将会同时合并到 Master 以及 Develop 这两个分支上。Master 分支是上线版本，而合并回 Develop 分支的目的，是因为可能在 Release 分支上还会测到并修正一些问题，所以需要跟 Develop 分支同步，免得之后的版本又再度出现同样的问题。

   > 发布版本的时候可能会处理一些配置问题, 需要从 `develop` 分支, 用完之后, 合并回 `develop` 和 `master` 分支.

5. Hotfix 分支

   命名约定 `hotfix-*`

   当线上产品发生紧急问题的时候，会从 Master 分支开一个 Hotfix 分支出来进行修复，Hotfix 分支修复完成之后，会合并回 Master 分支，也同时会合并一份到 Develop 分支。

   为什么要合并回 Develop 分支？如果不这么做，等到时候 Develop 分支完成并且合并回 Master 分支的时候，那个问题就又再次出现了。

   那为什么一开始不从 Develop 分支切出来修？因为 Develop 分支的功能可能尚在开发中，这时候硬是要从这里切出去修再合并回 Master 分支，只会造成更大的灾难。

   > ![](https://gitee.com/cpfree/picture-warehouse/raw/master/pic1/20220107213856.png)
