---
keys: 
type: copy,blog,trim
url: <>
id: 220124-142004
---

## docker 常用命令


## 容器操作

#### 1. 创建运行容器: `docker run`

如创建一个nacos容器, 

   ```shell
   # 单机模式启动, 主机IP: 8848
   docker run --env MODE=standalone --name nacos -d -p 8848:8848 nacos/nacos-server
   ```

1. 环境变量注入 `--env`

   如下同时注入多个环境变量

   ```shell
   docker run \
      --env MODE=standalone \
      --env SERVER_SERVLET_CONTEXTPATH=/ \
      --env SPRING_DATASOURCE_PLATFORM=mysql \
      --env MYSQL_SERVICE_HOST=127.0.0.1   \
      --env MYSQL_SERVICE_DB_NAME=nacos-config   \
      --env MYSQL_SERVICE_USER=root   \
      --env MYSQL_SERVICE_PASSWORD=root   \
      --name nacos -d -p 8848:8848 nacos/nacos-server 
   ```

#### 2. 启停命令

1. docker start :启动一个或多个已经被停止的容器
2. docker stop :停止一个运行中的容器
3. docker restart :重启容器

```shell
# 启动已被停止的容器 nginx
> docker start nginx

# 停止运行中的容器 nginx
> docker stop nginx

# 重启容器 nginx
> docker restart nginx
```

#### 3. 移出一个或多个容器

语法: `docker rm [OPTIONS] CONTAINER [CONTAINER...]`

OPTIONS说明：

   -f :通过 SIGKILL 信号强制删除一个运行中的容器。
   -l :移除容器间的网络连接，而非容器本身。
   -v :删除与容器关联的卷。

实例

   ```shell
   # 强制删除容器 db01、db02：
   > docker rm -f db01 db02

   # 移除容器 nginx01 对容器 db01 的连接，连接名 db：
   > docker rm -l db 

   # 删除容器 nginx01, 并删除容器挂载的数据卷：
   > docker rm -v nginx01
   
   # 删除所有已经停止的容器：
   > docker rm $(docker ps -a -q)
   ```


## docker 容器内命令

#### 1. 进入nacos的容器

`docker exec -it ${容器名称} /bin/bash`

   如进入一个容器名称为 `nacos` 的命令为

   ```shell
   > docker exec -it nacos /bin/bash
   ```

