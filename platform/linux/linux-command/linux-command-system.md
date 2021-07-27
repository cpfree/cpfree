# linux command

## 查看版本信息

`cat /etc/redhat-release`

## 查看CPU信息

```shell
# 查看cpu信息
> cat /proc/cpuinfo

# 查看物理cpu个数
> grep 'physical id' /proc/cpuinfo | sort -u

# 查看核心数量
> grep 'core id' /proc/cpuinfo | sort -u | wc -l

# 查看线程数
> grep 'processor' /proc/cpuinfo | sort -u | wc -l
```


## yum

yum [options] [command] [package ...]
options：可选，选项包括-h（帮助），-y（当安装过程提示选择全部为"yes"），-q（不显示安装的过程）等等。
command：要进行的操作。
package操作的对象。
yum常用命令

1. 列出所有可更新的软件清单命令：yum check-update
2. 更新所有软件命令：yum update
3. 仅安装指定的软件命令：yum install `<package_name>`
4. 仅更新指定的软件命令：yum update `<package_name>`
5. `yum list`

   ```shell
   # 不带参数 : 列出所有可安裝的软件清单命令：
   yum list
   # 2.列出所有可安装的软件包
   yum list
   # 3.列出所有可更新的软件包
   yum list updates
   # 4.列出所有已安装的软件包
   yum list installed
   # 5.列出所有已安装但不在 Yum Repository 内的软件包
   yum list extras
   # 6.列出所指定的软件包
   yum list XX
   ```

6. 删除软件包命令：yum remove `<package_name>`
7. 查找软件包 命令：yum search `<keyword>`
8. 清除缓存命令:

`yum clean packages`: 清除缓存目录下的软件包
`yum clean headers`: 清除缓存目录下的 headers
`yum clean oldheaders`: 清除缓存目录下旧的 headers
`yum clean, yum clean all (= yum clean packages; yum clean oldheaders)` :清除缓存目录下的软件包及旧的headers

## docker

docker images
docker ps -as
docker run -d --name tomcat -p 8800:8080 tomcat
