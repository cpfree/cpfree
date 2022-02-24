---
keys: 
type: copy,blog,trim
url: <>
id: 220100-100033
---

# redis 安装配置

## 源码安装

1. 下载最新稳定版本: <http://redis.io/download>.
2. 解压编译

   ```shell
   > wget http://download.redis.io/releases/redis-6.0.8.tar.gz
   > tar xzf redis-6.0.8.tar.gz
   > cd redis-6.0.8
   > make
   ```

3. 执行完 make 命令后，redis-6.0.8 的 src 目录下会出现编译后的 redis 服务程序 redis-server，还有用于测试的客户端程序 redis-cli：

   ```shell
   > cd src
   # 注意这种方式启动 redis 使用的是默认配置。也可以通过启动参数告诉 redis 使用指定配置文件使用下面命令启动。
   > ./redis-server
   ```

---

4. 修改配置文件

   1. 注释掉redis.window.conf文件中的bind属性设置。

      ```conf
      # bind 127.0.0.1
      ```

   2. 关于保护模式

      ```conf
      protected-mode no
      ```

   3. 设置密码

      ```conf
      requirepass 123456
      ```

5. 启动

   ```shell
   # 启动应该如下
   > cd src
   > ./redis-server ../redis.conf
   # 绝对路径 启动
   > /.../redis-6.2.5/src/redis-server /.../redis-6.2.5/redis.conf
   # 无日志 绝对路径 启动
   > nohup /.../redis-6.2.5/src/redis-server /.../redis-6.2.5/redis.conf > /dev/null 2>&1 &
   ```

## redis 客户端连接

1. 启动客户端
   `redis-cli -h host -p port -a password`
2. 验证是否redis服务启动

   ```shell
   redis 127.0.0.1:6379> PING
   PONG
   ```
