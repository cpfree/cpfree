# docker install

## CentOs

> [菜鸟教程](https://www.runoob.com/docker/centos-docker-install.html)

1. 卸载旧的docker

    ```shell
    sudo yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-engine
    ```

2. 安装 Docker Engine-Community

    使用 Docker 仓库进行安装
    在新主机上首次安装 Docker Engine-Community 之前，需要设置 Docker 仓库。之后，您可以从仓库安装和更新 Docker。

    ```shell
    # 设置仓库
    # 安装所需的软件包。yum-utils 提供了 yum-config-manager ，并且 device mapper 存储驱动程序需要 device-mapper-persistent-data 和 lvm2。
    > $ sudo yum install -y yum-utils  device-mapper-persistent-data  lvm2

    # 使用以下命令来设置稳定的仓库。
    > $ sudo yum-config-manager  --add-repo  https://download.docker.com/linux/centos/docker-ce.repo
    ```

3. 安装 Docker Engine-Community
    安装最新版本的 Docker Engine-Community 和 containerd，或者转到下一步安装特定版本：

    `$ sudo yum install docker-ce docker-ce-cli containerd.io`

4. 启动 Docker。

    `$ sudo systemctl start docker`

5. 通过运行 hello-world 映像来验证是否正确安装了 Docker Engine-Community 。

    `$ sudo docker run hello-world`
