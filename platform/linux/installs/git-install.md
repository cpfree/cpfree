
# git 安装

## 执行git安装

   1. 执行安装文件 Git-2.22.0-64-bit
   2. 下载git安装 TortoiseGit-2.7.0.0-64bit

## git配置(单个账号)

   > 单个账号可以直接使用全局配置配置全局的 `user.name` 和 `user.email`.

## git 配置（配置多个git）

   > 单个账号可以直接使用全局配置配置全局的 `user.name` 和 `user.email`.
   > 但是如果使用多个git账号， 例如同时使用gitHub， gitee, gitlab， 则需要为三个账号进行分别生成 SSH keys 后， 并配置config防止git冲突。
   > [配置多个git](https://www.jianshu.com/p/68578d52470c)

1. 清除 git 的全局配置。

    > 该操作针对已经安装过git并配置过全局的 `user.name` 和 `user.email`的情况。

    ```shell
    # 进行查看你是否设置
    $ git config --global --list
    # 删除全局配置
    $ git config --global --unset user.name "你的名字"
    $ git config --global --unset user.email "你的邮箱"
    ```

2. 生成 SSH keys

    ```shell
    # 生成 github 密钥, 命令输入后，回车3下，什么也不要输入，就是默认没有密码。
    $ ssh-keygen -t rsa -f ~/.ssh/id_rsa_github_cpfniliu -C "cpfniliu@gmail.com"
    # 生成 gitee 密钥, 命令输入后，回车3下，什么也不要输入，就是默认没有密码。
    $ ssh-keygen -t rsa -f ~/.ssh/id_rsa_gitee_countercurrent -C "cpfniliu"
    $ ssh-keygen -t rsa -f ~/.ssh/id_rsa_gitee_cpsinjar -C "cpsinjar"
    ```

    > 每个命令输入后，回车3下，什么也不要输入，就是默认没有密码。
    > 完成后会在~/.ssh / 目录下生成相关文件。
    > 如有问题删除所有密钥 重新按步骤操作一遍。

3. 添加私钥

    ```shell
    # 添加私钥
    ssh-add ~/.ssh/id_rsa_gitee_cpsinjar
    # 列出已经添加的私钥
    ssh-add -l
    ```

    > 若执行ssh-add 命令出现这个错误: `Could not open a connection to your authentication agent.`
    > 则先执行如下命令即可：`ssh-agent bash`
    > 更多关于ssh-agent的细节，可以用 `man ssh-agent` 来查看
    > 如果私钥配置了 `passphrase`, 则需要输入 `passphrase` 后才能加入

4. 添加公钥至github等服务器.

   - GitHub

    登录 Github
    点击右上方的头像，点击 settings
    选择 SSH key
    点击 Add SSH key
    在出现的界面中填写 SSH key 的名称，填一个你自己喜欢的名称即可。
    将上面拷贝的~/.ssh/id_rsa.xxx.pub文件内容粘帖到 key 一栏，在点击 "add key" 按钮就可以了。

5. 配置 config 文件(多账号必须配置)

    ```shell
    # 创建config文件
    $ touch ~/.ssh/config
    ```

    config 配置文件

    ```conf
    #Default gitHub user Self
        Host github.com
        HostName github.com
        User cpf #默认就是git，可以不写
        IdentityFile ~/.ssh/id_rsa_github

    #gitee user
        Host gitee.com
        Port 22
        HostName gitee.com
        User cpf
        IdentityFile ~/.ssh/id_rsa_gitee
    ```

   参数 | 含义
   - | -
   Host | 它涵盖了下面一个段的配置，我们可以通过他来替代将要连接的服务器地址。这里可以使用任意字段或通配符。当ssh的时候如果服务器地址能匹配上这里Host指定的值，则Host下面指定的HostName将被作为最终的服务器地址使用，并且将使用该Host字段下面配置的所有自定义配置来覆盖默认的/etc/ssh/ssh_config配置信息。
   Port | 自定义的端口。默认为22，可不配置
   User | 自定义的用户名，默认为git，可不配置
   HostName | 真正连接的服务器地址
   PreferredAuthentications | 指定优先使用哪种方式验证，支持密码和秘钥验证方式
   IdentityFile | 指定本次连接使用的密钥文件

6. 测试是否连接成功
    由于每个托管商的仓库都有唯一的后缀，比如 Github 的是 git@github.com:*。

    所以可以这样测试：
    ssh -T git@github.com

    而 gitlab 的可以这样测试：
    ssh -T git@gitlab.corp.xyz.com
    如果能看到一些 Welcome 信息，说明就是 OK 的了

    ssh -T nogithub.com
    ssh -T git@gitlab.com
    ssh -T git@gitee.com
    $ ssh -T git@github.com

    Warning: Permanently added the RSA host key for IP address '13.250.177.223' to the list of known hosts.
    Hi dragon! You've successfully authenticated, but GitHub does not provide shell access.

    $ ssh -T git@gitlab.com

    The authenticity of host 'gitlab.com (35.231.145.151)' can't be established.
    ECDSA key fingerprint is SHA256:HbW3g8zUjNSksFbqTiUWPWg2Bq1x8xdGUrliXFzSn.
    Are you sure you want to continue connecting (yes/no)? yes
    Warning: Permanently added 'gitlab.com,35.231.145.151' (ECDSA) to the list of known hosts.
    Welcome to GitLab, @dragon!

    $ ssh -T git@gitee.com 

    The authenticity of host 'gitee.com (116.211.167.14)' can't be established.
    ECDSA key fingerprint is SHA256:FQGC9Kn/eye1W8icdBgrp+KkGYoFgbVr17bmjeyc.
    Are you sure you want to continue connecting (yes/no)? yes
    Warning: Permanently added 'gitee.com,116.211.167.14' (ECDSA) to the list of known hosts.
    Hi 我是x! You've successfully authenticated, but GITEE.COM does not provide shell access.

    结果如果出现这个就代表成功：

    GitHub -> successfully
    GitLab -> Welcome to GitLab
    Gitee -> successfully
    测试 clone 项目
    $ git clone git@gitlab.com:d-d-u/java-xxx.git
    Cloning into 'java-basic'...
    remote: Enumerating objects: 3, done.
    remote: Counting objects: 100% (3/3), done.
    remote: Total 3 (delta 0), reused 0 (delta 0)
    Receiving objects: 100% (3/3), done.

7. 由于删除了全局的 `user.name` 和 `user.email`, 所以需要命令行进项目里面设置loacl的`user.name` 和 `user.email`

    ```shell
    git config --local user.name "sinjar"
    git config --local user.email "sinjar.chen@qq.com"
    # 执行完毕后，通过以下命令查看本仓库的所有配置信息：
    git config --local --list
    ```

····

## 注意

1. config 配置文件

    ```conf
    #Default github-cpfniliu
    # ssh-keygen -t rsa -f ~/.ssh/id_rsa_github_cpfniliu -C "cpfniliu@gmail.com"
        Host github.com
        HostName github.com
        User git
        IdentityFile ~/.ssh/id_rsa_github_cpfniliu

    # gitee-countercurrent
    # ssh-keygen -t rsa -f ~/.ssh/id_rsa_gitee_countercurrent -C "cpfniliu"
        Host gitee.com
        Port 22
        HostName gitee.com
        User countercurrent
        IdentityFile ~/.ssh/id_rsa_gitee_countercurrent

    # gitee-cpsinjar
    # ssh-keygen -t rsa -f ~/.ssh/id_rsa_gitee_cpsinjar -C "cpsinjar"
        Host gitee.com
        Port 22
        HostName gitee.com:cpsinjar
        User cpsinjar
        IdentityFile ~/.ssh/id_rsa_gitee_cpsinjar
    ```

    > 配置文件一定要配置正确
    > Host理论上不能够相同，虽然不报错，但是会造成提交时出现错误。
    > User暂时没有发现有什么作用
