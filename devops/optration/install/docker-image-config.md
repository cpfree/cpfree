---
keys: 
type: copy,blog,trim
url: <>
id: 220100-100017
---

# docker 安装配置

## docker 安装配置nginx

1. 安装nginx镜像

   `docker pull nginx:latest`

2. 创建`nginx-test`实例

   `docker run --name nginx-test -p 80:80 -d nginx`

3. 将相关配置文件拷贝到系统环境, 并删除原有镜像

   ```shell
   # 创建外部文件夹
   mkdir ~/app/nginx/logs
   mkdir ~/app/nginx/conf
   mkdir ~/app/nginx/static
   # 将镜像中的文件拷贝至文件夹
   # 77d57d7f89e7 是容器ID
   docker cp 77d57d7f89e7:/etc/nginx/nginx.conf ~/app/nginx/conf/
   docker cp 77d57d7f89e7:/usr/share/nginx/html/ ~/app/nginx/static/
   docker cp 77d57d7f89e7:/var/log/nginx ~/app/nginx/logs/
   ```

4. 创建新的镜像

   `docker run --name nginx-http -p 80:80 -d -v /home/sinjar/app/nginx/static:/usr/share/nginx/html -v /home/sinjar/app/nginx/conf/nginx.conf:/etc/nginx/nginx.conf -v /home/sinjar/app/nginx/logs:/var/log/nginx nginx`

5. 此时在外部文件夹修改配置即可
