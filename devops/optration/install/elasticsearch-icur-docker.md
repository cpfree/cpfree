# es docker安装

## docker 安装 elasticsearch:6.4.3, 并安装中文分词插件

1. 下载镜像

   ```shell
   docker pull elasticsearch:6.4.3
   ```

2. 运行容器

   ```shell
   docker run --name es_643 -d -e ES_JAVA_OPTS="-Xms384m -Xmx384m" -p 9200:9200 -p 9300:9300 elasticsearch:6.4.3
   ```

3. 执行`步骤2`后发现`启动没有成功, 或者是运行一会儿就停了`的解决方式

   1. 查看日志

      ```shell
      docker logs -f ${es_643容器ID}
      ```

   2. 输出日志如下

      ```log
      ...
      [2021-07-05T03:15:12,432][INFO ][o.e.d.DiscoveryModule    ] [TdIKspx] using discovery type [zen]
      [2021-07-05T03:15:13,322][INFO ][o.e.n.Node               ] [TdIKspx] initialized
      [2021-07-05T03:15:13,323][INFO ][o.e.n.Node               ] [TdIKspx] starting ...
      [2021-07-05T03:15:13,439][INFO ][o.e.t.TransportService   ] [TdIKspx] publish_address {172.17.0.3:9300}, bound_addresses {0.0.0.0:9300}
      [2021-07-05T03:15:13,453][INFO ][o.e.b.BootstrapChecks    ] [TdIKspx] bound or publishing to a non-loopback address, enforcing bootstrap checks
      ERROR: [2] bootstrap checks failed
      [1]: initial heap size [268435456] not equal to maximum heap size [536870912]; this can cause resize pauses and prevents mlockall from locking the entire heap
      [2]: max virtual memory areas vm.max_map_count [65530] is too low, increase to at least [262144]
      [2021-07-05T03:15:13,463][INFO ][o.e.n.Node               ] [TdIKspx] stopping ...
      [2021-07-05T03:15:13,477][INFO ][o.e.n.Node               ] [TdIKspx] stopped
      [2021-07-05T03:15:13,477][INFO ][o.e.n.Node               ] [TdIKspx] closing ...
      [2021-07-05T03:15:13,489][INFO ][o.e.n.Node               ] [TdIKspx] closed
      ```

      > `max virtual memory areas vm.max_map_count [65530] is too low, increase to at least [262144]` 代表 max_map_count的值太小了，需要设大到262144

   3. 增大`vm.max_map_count`的值

      ```shell
      # 查看 vm.max_map_count 的值
      [sinjar@sinjar-aliyun-0 ~]$ cat /proc/sys/vm/max_map_count 
      65530
      # 修改 vm.max_map_count 的值
      [sinjar@sinjar-aliyun-0 ~]$ sudo sysctl -w vm.max_map_count=262144
      ```

   4. 修改后再次启动容器

      `docker start es_643`

4. 进入docker 中的 es_643, 修改配置文件, 安装分词器等

   ```shell
   docker exec -it es_643 /bin/bash
   ```

   - 修改配置文件, `/usr/share/elasticsearch/config/elasticsearch.yml`中的 `cluster.name` 更改成与项目中同样的名称(如下示例:`cluster.name`为`community`)

      ```yml
      cluster.name: "community"
      network.host: 0.0.0.0

      # minimum_master_nodes need to be explicitly set when bound on a public IP
      # set to 1 to allow single node clusters
      # Details: https://github.com/elastic/elasticsearch/pull/17288
      discovery.zen.minimum_master_nodes: 1
      ```

   - 安装中文分词插件(注意版本号要一致)

      ```shell
      ./bin/elasticsearch-plugin install https://github.com/medcl/elasticsearch-analysis-ik/releases/download/v6.4.3/elasticsearch-analysis-ik-6.4.3.zip
      ```

5. 重启es(另外把防火墙也打开)

   ```
   docker restart es_643
   ```

6. 打开防火墙

   打开 `9200`, `9300` 端口防火墙, 具体请看下面详细 [9200和9300区别](#9200和9300区别)

7. 浏览器访问 `ip:9200`, 出现下面信息即为安装成功

   ```json
   {
      "name" : "X6ynmh4",
      "cluster_name" : "community",
      "cluster_uuid" : "Bwug9cBHSXG4uadFhY6xHg",
      "version" : {
         "number" : "6.4.3",
         "build_flavor" : "default",
         "build_type" : "tar",
         "build_hash" : "fe40335",
         "build_date" : "2018-10-30T23:17:19.084789Z",
         "build_snapshot" : false,
         "lucene_version" : "7.4.0",
         "minimum_wire_compatibility_version" : "5.6.0",
         "minimum_index_compatibility_version" : "5.0.0"
      },
      "tagline" : "You Know, for Search"
   }
   ```

## tip

### 9200和9300区别

- 9200 是ES节点与外部通讯使用的端口。它是http协议的RESTful接口（各种CRUD操作都是走的该端口,如查询：http://localhost:9200/user/_search）。
- 9300 是ES节点之间通讯使用的端口。它是tcp通讯端口，集群间和TCPclient都走的它。（java程序中使用ES时，在配置文件中要配置该端口）
