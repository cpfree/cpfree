# Mysql 利用拷贝data目录文件的方式迁移mysql数据库

---

## 场景1(linux)

> 配置
> - 源环境: linux: `Red Hat Enterprose Linux server release 6.10`, mysql: `5.7.30-log`
> - 目标环境: linux: `Red Hat Enterprose Linux server release 6.6`, mysql: `5.7.31`

1. 首先要确定data目录位置

   - 命令行登录后, 使用 `show global variables like "%datadir%"` 命令查询位置


