# 源代码比对解决方案

[toc]

## 背景

1. jar包比对.
2. 源代码比对.

## 方案简介

使用`Beyond Compare`软件来进行代码比对

将需要比较的jar或者源代码或其它文件放入两个文件夹中, 通过`Beyond Compare`一次性比较两个文件夹中的全部内容.

> 通过Beyond compare中的插件将 class 文件反编译成源码， 比较反编译后的源码内容。
> 对于源码执行规则对比，将注释、空格、换行等不重要的信息设为次要内容, 仅仅比较其中重要的代码.

## Beyond Compare功能与简介

1. Beyond Compare 是一款专业级的文件夹和文件对比工具。 使用它可以很方便地对比出两个文件夹或者文件的不同之处， 相差的每一个字节用颜色加以表示，查看方便。

   ![image-20200513105929172](https://gitee.com/cpfree/picture-warehouse/raw/master/images/jarcompare/image-20200513105929172.png)

2. Beyond Compare 可以高效对比整个文件夹，检查大小和修改时间；或者逐字节完整验证每个文件；强大的过滤功能允许您只看到的自己感兴趣的。

3. Beyond Compare 支持将 jar 包作为文件夹打开, 进而比较其内部的 class 文件

4. 使用 Beyond compare 中的 Java Class to source 插件进行比较 class 文件时可以直接将 class 文件反编译成源码， 然后比较反编译后的源码内容,

5. Beyond Compare 能设置比较规则, 以java文件为例, 对比时能够将注释、空格、换行等不重要的信息设为次要内容, 仅仅比较其中重要的代码.

## 有 jar 包的文件夹比对示例

### step1. 安装 java Class to Source 插件

1. 打开 Beyond Compare, 导航栏选择, 工具 -> 文件格式, 打开文件格式对话框
    ![image-20200513095636621](https://gitee.com/cpfree/picture-warehouse/raw/master/images/jarcompare/image-20200513095636621.png)

    ![image-20200513100553419](https://gitee.com/cpfree/picture-warehouse/raw/master/images/jarcompare/image-20200513100553419.png)

2. 到官网后, 搜索 Java class to source 插件, 选择插件后, 滚动至网页底部, 点击下载选中的插件

   ![image-20200513102353738](https://gitee.com/cpfree/picture-warehouse/raw/master/images/jarcompare/image-20200513102353738.png)

    ![image-20200513102529076](https://gitee.com/cpfree/picture-warehouse/raw/master/images/jarcompare/image-20200513102529076.png)

3. 导航页, 选择工具 -> 导入设置, 选择从官网下载的插件文件包, 即可安装 Java class to source 插件

   ![image-20200513102807332](https://gitee.com/cpfree/picture-warehouse/raw/master/images/jarcompare/image-20200513102807332.png)

### step2. 准备需要比较的两个文件夹

1. 将需要比较的内容放入两个文件夹, 确认带比较的两个文件夹中各个文件路径名称正确, 两个文件夹的结构大致如下图所示

   ![image-20200513103948265](https://gitee.com/cpfree/picture-warehouse/raw/master/images/jarcompare/image-20200513103948265.png)

2. 打开 Beyond Compare, 新建文件夹比较会话, 以选择或拖拽的方式将两个文件夹进行对比.如下示例所示.

   ![image-20200513103751425](https://gitee.com/cpfree/picture-warehouse/raw/master/images/jarcompare/image-20200513103751425.png)

### step3. 文件夹比对

1. 菜单栏, 选择规则, 打开规则对话框, 设置比较内容为基于规则的比较

   ![image-20200513104135391](https://gitee.com/cpfree/picture-warehouse/raw/master/images/jarcompare/image-20200513104135391.png)

2. 菜单栏, 选择规则, 打开规则对话框, 设置压缩包总是作为文件夹打开.

   ![image-20200513104315753](https://gitee.com/cpfree/picture-warehouse/raw/master/images/jarcompare/image-20200513104315753.png)

3. 设置过滤规则, 仅仅比较重要的, 自己需要比较的内容.

   ![image-20200513104517368](https://gitee.com/cpfree/picture-warehouse/raw/master/images/jarcompare/image-20200513104517368.png)

4. 确保 Java Class to source 下载安装并启用.

   ![image-20200513104559104](https://gitee.com/cpfree/picture-warehouse/raw/master/images/jarcompare/image-20200513104559104.png)

5. 选择全部文件, 右键选择比较内容, 开始比较内容

   ![image-20200513105045628](https://gitee.com/cpfree/picture-warehouse/raw/master/images/jarcompare/image-20200513105045628.png)

6. 待比较完成后即可清楚的看到哪些文件是选共同的, 哪些文件时不同的, 或者是已忽略的.

   ![image-20200513105724804](https://gitee.com/cpfree/picture-warehouse/raw/master/images/jarcompare/image-20200513105724804.png)

比较结果

   次要文件示例
   ![image-20200513105249328](https://gitee.com/cpfree/picture-warehouse/raw/master/images/jarcompare/image-20200513105249328.png)

   相同文件示例
   ![image-20200513105819927](https://gitee.com/cpfree/picture-warehouse/raw/master/images/jarcompare/image-20200513105819927.png)

   不同文件示例
   ![image-20200513105758732](https://gitee.com/cpfree/picture-warehouse/raw/master/images/jarcompare/image-20200513105758732.png)
