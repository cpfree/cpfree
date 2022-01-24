---
keys: 
type: copy,blog,trim
url: <>
id: 220100-100035
---

## window 环境安装部署

1. 到 alibaba github 上去下载 sentinel: <https://github.com/alibaba/Sentinel/releases>

   ![](https://gitee.com/cpfree/picture-warehouse/raw/master/devops-note/1642514579739.png)

2. 解压后, 到压缩包根目录, 命令行执行

   > sentinel 端口号随意定义一个就好, 如 `8858`

   ```shell
   java -Dserver.port=8858 -Dcsp.sentinel.dashboard.server=localhost:8858 -Dproject.name=sentinel-dashboard -jar sentinel-dashboard-1.8.0.jar
   ```

3. 访问`http://127.0.0.1:8858`

   初始`用户/密码`: `sentinel/sentinel`

   ![](https://gitee.com/cpfree/picture-warehouse/raw/master/devops-note/1642495414361.png)

## docker 安装 sentinel 控制台 `sentinel-dashboard`

1. `docker search sentinel`

   ```shell
   # 搜索 sentinel
   > $ docker search sentinel
   NAME                                   DESCRIPTION                                     STARS     OFFICIAL   AUTOMATED
   bladex/sentinel-dashboard              Alibaba Cloud Sentinel Dashboard (阿里巴巴流…        57
   sentinelofficial/sentinel-vpn-node                                                     6
   thrashr888/sentinel-simulator          An image for Hashicorp's Sentinel https://ww…   3                    [OK]
   fredboat/sentinel                      https://github.com/FredBoat/sentinel            2
   opennms/sentinel                                                                       1
   hashicorp/sentinel                                                                     1
   anjia0532/sentinel-docker              alibaba sentinel docker                         1
   cooperaj/sentinel-broker               Small, use once webservice to hookup a Redis…   1                    [OK]
   mintproject/sentinel                                                                   0
   thalesgroupsm/sentinel_ldk_rte         Docker image with Sentinel LDK Runtime versi…   0
   c0ff3e/sentinel-proxy                  to run a sentinel proxy                         0
   gatblau/sentinel-snapshot              Development snapshots for Sentinel              0
   filecoin/sentinel-visor                This repository is deprecated. New tags will…   0
   iandavis/sentinel-airflow-spark                                                        0
   camptocamp/sentinel-tunnel                                                             0
   tsuyoshiushio/sentinel                                                                 0
   thattommyhall/sentinel-airflow-spark                                                   0
   dashpay/sentinel                       Dash Sentinel                                   0                    [OK]
   thattommyhall/sentinel-dbcopy                                                          0
   filecoin/sentinel-tick                                                                 0
   arilot/sentinel                        Argo Sentinel.  An all-powerful toolset for …   0                    [OK]
   filecoin/sentinel-locations                                                            0
   seandooher/sentinel-iot                Sentinel IoT docker image                       0
   msopenstack/sentinel-ubuntu_xenial                                                     0
   king019/sentinel                                                                       0
   ```

2. `docker pull bladex/sentinel-dashboard`

   ```shell
   > $ docker pull bladex/sentinel-dashboard
   Using default tag: latest
   latest: Pulling from bladex/sentinel-dashboard
   169185f82c45: Pull complete
   4346af5b5a4f: Pull complete
   28ac9c6decc7: Pull complete
   4ca458a82bd5: Pull complete
   Digest: sha256:c596d19cd68b6f140a2230f5f7f16a4203fd3241d3f507e5513de5d28c897b8a
   Status: Downloaded newer image for bladex/sentinel-dashboard:latest
   docker.io/bladex/sentinel-dashboard:latest
   ```

3. `docker run --name sentinel -d -p 8858:8858 bladex/sentinel-dashboard`

4. 访问 `http://ip:8858/`

   初始`用户/密码`: `sentinel/sentinel`

   ![](https://gitee.com/cpfree/picture-warehouse/raw/master/devops-note/1642495414361.png)
