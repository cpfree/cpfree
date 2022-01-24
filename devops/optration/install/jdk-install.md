---
keys: 
type: copy,blog,trim
url: <>
id: 220100-100025
---

# jdk install

## CentOx 7 x64安装

### 安装jdk

1. 删除原先jdk
2. 下载解压jdk到linux
3. 配置环境变量
   1. `vim /etc/profile`
   2. 在文件尾部添加文件

      ```shell
      export JAVA_HOME=/usr/java/jdk1.8.0_131
      export JRE_HOME=${JAVA_HOME}/jre
      export CLASSPATH=.:${JAVA_HOME}/lib:${JRE_HOME}/lib:$CLASSPATH
      export JAVA_PATH=${JAVA_HOME}/bin:${JRE_HOME}/bin
      export PATH=$PATH:${JAVA_PATH}
      ```

   3. 重启电脑永久生效, 或则通过命令`source /etc/profile` 让profile文件立即生效, 但是切换用户之后则失效

4. 验证
   - 使用javac命令，不会出现command not found错误
   - 使用java -version，出现版本为java version "1.8.0_131"
   - echo $PATH，看看自己刚刚设置的的环境变量配置是否都正确

### 仅仅安装jre

1. 删除原先jre
2. 下载解压jre到jre
3. 配置环境变量
   1. `vim /etc/profile`
   2. 在文件尾部添加文件

      ```shell
      export JAVA_PATH=/usr/local/app/jre-current/bin
      export PATH=$PATH:${JAVA_PATH}
      ```

   3. 重启电脑永久生效, 或则通过命令`source /etc/profile` 让profile文件立即生效, 但是切换用户之后则失效

4. 验证
   - 使用 javac 命令，不会出现 `command not found` 错误
   - 使用 `java -version`，出现版本为 `java version "1.8.0_131"`
   - `echo $PATH`，看看自己刚刚设置的的环境变量配置是否都正确

### ansible 安装JDK

```yaml
- hosts: 127.0.0.1
  connection: local
  remote_user: root
  vars:
      name: "jdk"
      jdk_file: jdk-8u191-linux-x64.tar.gz
      install_path: /usr/local/app/jdk-8u191
      jdk_source_path: /home/sinjar/download/jdk-8u191-linux-x64.tar.gz
      jdk_target_dir: /home/sinjar/download/
  tasks:
    - name: "1.初始化工作目录"
      shell: mkdir -p {{install_path}} && mkdir -p {{jdk_target_dir}}
   #  - name: "2.拷贝安装包"
   #    copy: src={{jdk_file_path}} dest={{jdk_target_dir}}{{jdk_file}}
    - name: "3.解压安装包"
      shell: tar -zxvf {{jdk_target_dir}}{{jdk_file}} -C {{install_path}}  --strip-components 1
    - name: "4.添加环境变量"
      shell: echo '# jdk-config' >> /etc/profile &&
             echo 'export JAVA_HOME={{install_path}}' >> /etc/profile &&
             echo 'export JRE_HOME=${JAVA_HOME}/jre' >> /etc/profile &&
             echo 'export CLASSPATH=.:${JAVA_HOME}/lib:${JRE_HOME}/lib:$CLASSPATH' >> /etc/profile &&
             echo 'export JAVA_PATH=${JAVA_HOME}/bin:${JRE_HOME}/bin' >> /etc/profile &&
             echo 'export PATH=$PATH:${JAVA_PATH}' >> /etc/profile &&
             source /etc/profile
   #  - name: "5.清理安装文件"
   #    shell: rm -rf {{jdk_target_dir}}{{jdk_file}}
```
