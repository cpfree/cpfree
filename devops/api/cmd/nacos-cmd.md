# 相关脚本

### 启动

1. `Linux/Unix/Mac` 启动命令

   ```shell
   sh startup.sh -m standalone
   ```

2. Windows


   ```shell
   startup.cmd -m standalone
   ```

   > 或双击startup.cmd运行文件

### 关闭

1. `Linux/Unix/Mac` 启动命令

   ```shell
   sh shutdown.sh
   ```

2. Windows


   ```shell
   shutdown.cmd
   ```

   > 或双击shutdown.cmd运行文件

### 服务注册&发现和配置管理

服务注册

   ```shell
   curl -X POST 'http://127.0.0.1:8848/nacos/v1/ns/instance?serviceName=nacos.naming.serviceName&ip=20.18.7.10&port=8080'
   ```

服务发现

   ```shell
   curl -X GET 'http://127.0.0.1:8848/nacos/v1/ns/instance/list?serviceName=nacos.naming.serviceName'
   ```

发布配置

   ```shell
   curl -X POST "http://127.0.0.1:8848/nacos/v1/cs/configs?dataId=nacos.cfg.dataId&group=test&content=HelloWorld"
   ```

获取配置

   ```shell
   curl -X GET "http://127.0.0.1:8848/nacos/v1/cs/configs?dataId=nacos.cfg.dataId&group=test"
   ```
