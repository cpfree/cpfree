# crontab

循环运行的例行性计划任务，linux 系统则是由 cron (crond) 这个系统服务来控制的。Linux 系统上面原本就有非常多的计划性工作，因此这个系统服务是默认启动的。另外, 由于使用者自己也可以设置计划任务，所以， Linux 系统也提供了使用者控制计划任务的命令 :crontab 命令。

crond 是 linux 下用来周期性的执行某种任务或等待处理某些事件的一个守护进程，与 windows 下的计划任务类似，当安装完成操作系统后，默认会安装此服务工具，并且会自动启动 crond 进程，crond 进程每分钟会定期检查是否有要执行的任务，如果有要执行的任务，则自动执行该任务。

Linux 下的任务调度分为两类，系统任务调度和用户任务调度。

系统任务调度：系统周期性所要执行的工作，比如写缓存数据到硬盘、日志清理等。在/etc 目录下有一个 crontab 文件，这个就是系统任务调度的配置文件。

## `/etc/crontab` 文件示例如下

`cat /etc/crontab`

```conf
SHELL=/bin/bash
PATH=/sbin:/bin:/usr/sbin:/usr/bin
MAILTO=""HOME=/
# run-parts

51 * * * * root run-parts /etc/cron.hourly
24 7 * * * root run-parts /etc/cron.daily
22 4 * * 0 root run-parts /etc/cron.weekly
42 4 1 * * root run-parts /etc/cron.monthly
```

> 前四行是用来配置 crond 任务运行的环境变量，第一行 SHELL 变量指定了系统要使用哪个 shell，这里是 bash，第二行 PATH 变量指定了系统执行命令的路径，第三行 MAILTO 变量指定了 crond 的任务执行信息将通过电子邮件发送给 root 用户，如果 MAILTO 变量的值为空，则表示不发送任务执行信息给用户，第四行的 HOME 变量指定了在执行命令或者脚本时使用的主目录。第六至九行表示的含义将在下个小节详细讲述。这里不在多说。

> 用户任务调度：用户定期要执行的工作，比如用户数据备份、定时邮件提醒等。用户可以使用 crontab 工具来定制自己的计划任务。所有用户定义的 crontab 文件都被保存在 /var/spool/cron 目录中。其文件名与用户名一致。

## 使用者权限文件：

| 文件             | 说明                                         |
| ---------------- | -------------------------------------------- |
| /etc/cron.deny   | 该文件中所列用户不允许使用 crontab 命令      |
| /etc/cron.allow  | 该文件中所列用户允许使用 crontab 命令        |
| /var/spool/cron/ | 所有用户 crontab 文件存放的目录,以用户名命名 |

crontab 文件的含义：

用户所建立的 crontab 文件中，每一行都代表一项任务，每行的每个字段代表一项设置，它的格式共分为六个字段，前五段是时间设定段，第六段是要执行的命令段，格式如下：

minute hour day month week command

其中：

minute： 表示分钟，可以是从 0 到 59 之间的任何整数。
hour：表示小时，可以是从 0 到 23 之间的任何整数。
day：表示日期，可以是从 1 到 31 之间的任何整数。
month：表示月份，可以是从 1 到 12 之间的任何整数。
week：表示星期几，可以是从 0 到 7 之间的任何整数，这里的 0 或 7 代表星期日。
command：要执行的命令，可以是系统命令，也可以是自己编写的脚本文件。

在以上各个字段中，还可以使用以下特殊字符：

星号（\*）：代表所有可能的值，例如 month 字段如果是星号，则表示在满足其它字段的制约条件后每月都执行该命令操作。
逗号（,）：可以用逗号隔开的值指定一个列表范围，例如，“1,2,5,7,8,9”
中杠（-）：可以用整数之间的中杠表示一个整数范围，例如“2-6”表示“2,3,4,5,6”
正斜线（/）：可以用正斜线指定时间的间隔频率，例如“0-23/2”表示每两小时执行一次。同时正斜线可以和星号一起使用，例如\*/10，如果用在 minute 字段，表示每十分钟执行一次。

## crond 服务安装

一般系统自带, 如果没有带可以通过下面方法安装

`yum install crontabs`

服务操作说明：

| 操作语句                      | 含义                  |
| ----------------------------- | --------------------- |
| `/sbin/service crond start`   | 启动服务              |
| `/sbin/service crond stop`    | 关闭服务              |
| `/sbin/service crond restart` | 重启服务              |
| `/sbin/service crond reload`  | 重新载入配置          |
| `service crond status`        | 查看 crontab 服务状态 |
| `service crond start`         | 手动启动 crontab 服务 |

### crontab 命令详解

1. 命令格式：

   `crontab [-u user] file`

   `crontab [-u user] [ -e | -l | -r ]`

2. 命令功能：

   通过 crontab 命令，我们可以在固定的间隔时间执行指定的系统指令或 shell script 脚本。时间间隔的单位可以是分钟、小时、日、月、周及以上的任意组合。这个命令非常设合周期性的日志分析或数据备份等工作。

3. 命令参数：

   - `-u user`：用来设定某个用户的 crontab 服务，例如，“-u ixdba”表示设定 ixdba 用户的 crontab 服务，此参数一般有 root 用户来运行。
   - `file`：file 是命令文件的名字,表示将 file 做为 crontab 的任务列表文件并载入 crontab。如果在命令行中没有指定这个文件，crontab 命令将接受标准输入（键盘）上键入的命令，并将它们载入 crontab。
   - `-e`：编辑某个用户的 crontab 文件内容。如果不指定用户，则表示编辑当前用户的 crontab 文件。
   - `-l`：显示某个用户的 crontab 文件内容，如果不指定用户，则表示显示当前用户的 crontab 文件内容。
   - `-r`：从/var/spool/cron 目录中删除某个用户的 crontab 文件，如果不指定用户，则默认删除当前用户的 crontab 文件。
   - `-i`：在删除用户的 crontab 文件时给确认提示。

### crontab 配置

1. 列出当前用户对应的 crontab 文件配置

   ```
   crontab -l
   ```

   > 列出的是 `/var/spool/cron/` 目录下的和当前用户同名的文件.

2. 编辑/创建当前用户对应的 crontab 文件

   > 如果`/var/spool/cron/` 目录下没有和当前用户同名的文件, 则提交修改后会新建一个文件.

   ```
   crontab -e
   ```

   1. 使用 `crontab -e` 编辑以下内容

      ```cron
      # 将每隔 1 分钟向控制台输出一次当前时间
      * * * * * /bin/echo 'date' > /dev/console
      ```

      > 最好在 crontab 文件的每一个条目之上加入一条注释，这样就可以知道它的功能、运行时间，更为重要的是，知道这是哪位用户的作业。

   2. $ crontab ${创建的用户名} cron

      现在该文件已经提交给 cron 进程，它将每隔 1 5 分钟运行一次。

      同时，新创建文件的一个副本已经被放在/var/spool/cron 目录中，文件名就是用户名(即 dave)。

3. 删除 crontab 文件

   要删除 crontab 文件，可以用：

   `$ crontab -r`

## 使用注意事项

1. 注意环境变量问题

   有时我们创建了一个 crontab，但是这个任务却无法自动执行，而手动执行这个任务却没有问题，这种情况一般是由于在 crontab 文件中没有配置环境变量引起的。

   在 crontab 文件中定义多个调度任务时，需要特别注意的一个问题就是环境变量的设置，因为我们手动执行某个任务时，是在当前 shell 环境下进行的，程序当然能找到环境变量，而系统自动执行任务调度时，是不会加载任何环境变量的，因此，就需要在 crontab 文件中指定任务运行所需的所有环境变量，这样，系统执行任务调度时就没有问题了。

   不要假定 cron 知道所需要的特殊环境，它其实并不知道。所以你要保证在 shelll 脚本中提供所有必要的路径和环境变量，除了一些自动设置的全局变量。所以注意如下 3 点：

   1）脚本中涉及文件路径时写全局路径；

   2）脚本执行要用到 java 或其他环境变量时，通过 source 命令引入环境变量，如：

   cat start_cbp.sh

   #!/bin/sh

   source /etc/profile

   export RUN_CONF=/home/d139/conf/platform/cbp/cbp_jboss.conf

   /usr/local/jboss-4.0.5/bin/run.sh -c mev &

   3）当手动执行脚本 OK，但是 crontab 死活不执行时。这时必须大胆怀疑是环境变量惹的祸，并可以尝试在 crontab 中直接引入环境变量解决问题。如：

   0 \* \* \* \* . /etc/profile;/bin/sh /var/www/java/audit_no_count/bin/restart_audit.sh

2. 注意清理系统用户的邮件日志

   每条任务调度执行完毕，系统都会将任务输出信息通过电子邮件的形式发送给当前系统用户，这样日积月累，日志信息会非常大，可能会影响系统的正常运行，因此，将每条任务进行重定向处理非常重要。

   例如，可以在 crontab 文件中设置如下形式，忽略日志输出：

   0 _/3 _ \* \* /usr/local/apache2/apachectl restart >/dev/null 2>&1

   “/dev/null 2>&1”表示先将标准输出重定向到/dev/null，然后将标准错误重定向到标准输出，由于标准输出已经重定向到了/dev/null，因此标准错误也会重定向到/dev/null，这样日志输出问题就解决了。

3. 系统级任务调度与用户级任务调度

   系统级任务调度主要完成系统的一些维护操作，用户级任务调度主要完成用户自定义的一些任务，可以将用户级任务调度放到系统级任务调度来完成（不建议这么做），但是反过来却不行，root 用户的任务调度操作可以通过“crontab –uroot –e”来设置，也可以将调度任务直接写入/etc/crontab 文件，需要注意的是，如果要定义一个定时重启系统的任务，就必须将任务放到/etc/crontab 文件，即使在 root 用户下创建一个定时重启系统的任务也是无效的。

4. 其他注意事项

   新创建的 cron job，不会马上执行，至少要过 2 分钟才执行。如果重启 cron 则马上执行。

   当 crontab 突然失效时，可以尝试/etc/init.d/crond restart 解决问题。或者查看日志看某个 job 有没有执行/报错 tail -f /var/log/cron。

   千万别乱运行 crontab -r。它从 Crontab 目录（/var/spool/cron）中删除用户的 Crontab 文件。删除了该用户的所有 crontab 都没了。

   在 crontab 中%是有特殊含义的，表示换行的意思。如果要用的话必须进行转义\%，如经常用的 date ‘+%Y%m%d’在 crontab 里是不会执行的，应该换成 date ‘+\%Y\%m\%d’。
