## 介绍docker容器访问宿主机的服务端口

Docker容器运行的时候有 host 、 bridge 、 none 三种网络可供配置。默认是 bridge ，即桥接网络，以桥接模式连接到宿主机； host 是宿主网络，即与宿主机共用网络； none 则表示无网络，容器将无法联网。

当容器使用 host 网络时，容器与宿主共用网络，这样就能在容器中访问宿主机网络，那么容器的 localhost 就是宿主机的 localhost。

