# DOS

> dos 是磁盘操作系统(Disk Operating System)，是个人计算机上的一类操作系统。

> bat是DOS命令，在任何dos环境下都可以使用。
> bat文件是dos下的批处理文件，后缀为.cmd或.bat，在Windows NT系统中，两者没有任何区别。

> cmd是cmd.exe，是Win32命令，只能在32位系统中的命令行窗口中使用，仅仅是基于windows环境下的假DOS。
> cmd文件的描述是“windows nt命令脚本”，
> bat文件的描述是“ms dos批处理文件”；
> 两者所使用的命令行代码是共用的，只是cmd文件中允许使用的命令要比bat文件多。cmd文件只有在windows2000以上的系统中才能运行，而bat文件则没有这个限制。
> 在Windows NT系统中，两者没有任何区别, 均由cmd.exe解释执行。
> 在cmd命令提示符窗口键入批处理文件名，或者直接双击批处理文件，即可执行，系统会去调用cmd.exe按照该文件中各个命令出现的顺序来逐个运行。

## 简单命令

### switch

```bat
@echo off
echo 请输入你的选择并回车确认
echo 0   : custom
echo 118 : 172.16.10.118
set /p a=

if "%a%"=="0" (
   echo rocketmq.config.namesrvAddr :: ip:port
   set /p ipport=
   java -jar P:/kmerit/rocketmq-externals/rocketmq-externals/rocketmq-console/target/rocketmq-console-ng-1.0.0.jar --rocketmq.config.namesrvAddr='%ipport%'
)
if "%a%"=="118" (
   java -jar P:/kmerit/rocketmq-externals/rocketmq-externals/rocketmq-console/target/rocketmq-console-ng-1.0.0.jar --rocketmq.config.namesrvAddr='172.16.10.118:9876'
)
```

### if-else

```bat
dir /ad/b "%1" 2>nul && ${如果%1是目录执行命令} || ${如果%1是文件执行命令}
```

### Ren 命令(批量后缀)

```bat
'Ren 批量后缀.txt *.bat//////////////////
Ren *.mp3 *.txt
Ren *.mp4 *.txt
Ren *.xianwang *.txt
```

### copy命令

```bat
copy /b 1.jpg+d3d09e9e789350000019.MP4 gnff.cpf
```

### 延迟执行

```bat
rem 请输入延迟值（>=10）
set /p a=
rem 请输入延迟后执行命令
set /p b=

ping 127.0.0.1 -n %a%>nul
%b%
pause
```

### tree 命令列出文件夹中的文件

```bat
tree /F >文件夹目录.txt
```

## 软件配置相关

### MYSQL 命令控制

   ```bat
   @echo off
   echo   mysql
   echo 1 : net start mysql
   echo 2 : net stop mysql
   echo 3 : net stop mysql , net start mysql
   echo 请输入你的选择并回车确认
   set /p a=
   if "%a%"=="1" net start mysql
   if "%a%"=="2" net stop mysql
   if "%a%"=="3" net stop mysql &  net start mysql
   pause
   ```

## 场景

### 宽带连接

   ```bat
   @echo off
   echo   15751775540
   echo 0 zj051332
   echo 请输入你的选择并回车确认
   set /p a=
   cls
   if "%a%"=="0" RASDIAL DIAL 15751775540 166000
   if "%a%"=="" RASDIAL DIAL zj051332 123123
   ```

### 打开记事本命令

   ```bat
   start C:\Users\niliu\Desktop\快捷\Notepad.lnk
   type C:\Users\niliu\Desktop\快捷\Notepad.lnk
   edit C:\Users\niliu\Desktop\快捷\Notepad.lnk
   ```

### 获取桌面路径

   ```bat
   @echo off

   SET DESKTOP_REG_ENTRY="HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Shell Folders"
   SET DESKTOP_REG_KEY="Desktop"
   SET DESKTOP_DIR=

   FOR /F "tokens=1,2*" %%a IN ('REG QUERY %DESKTOP_REG_ENTRY% /v %DESKTOP_REG_KEY% ^| FINDSTR "REG_SZ"') DO (
      set DESKTOP_DIR="%%c"
   )

   ECHO Desktop dir: %DESKTOP_DIR%
   PAUSE
   ```

### 发送软连接到桌面(带参数)

   ```bat
   dir /ad/b "%1" 2>nul && mklink /D %DESKTOP_DIR%\%~n1 %1 || mklink %DESKTOP_DIR%\%~n1 %1
   ```

### IPSetting

   ```bat
   @echo off
   set Nic="Epoint" 
   rem //可以根据你的需要更改
   set Addr=192.168.143.100
   set Mask=255.255.255.0
   set Gway=192.168.143.1
   set Dns=114.114.114.114
   rem //以上对应分别是IP地址、子网掩码、网关、首选DNS、备用DNS ，自己根据情况修改
   rem //家里的DNS和公司一样则可以用以上代码，不一样可能需要稍作修改
   echo ★ 1 设置为公司IP ★ 
   echo ★ 3 设置为动态IP ★ 
   echo ★ 4 退出          ★ 
   echo ●●●请选择项目回车●●●
   set /p answer=   
   if %answer%==1 goto 1   
   if %answer%==2 goto 2   
   if %answer%==3 goto 3   
   if %answer%==4 goto 4 
   :1   
   echo 正在进行静态公司IP 设置，请稍等...   
   rem //可以根据你的需要更改   
   echo. I P 地址 = %Addr%   
   echo. 子网掩码 = %Mask%   
   netsh interface ipv4 set address name=%Nic% source=static addr=%Addr% mask=%Mask% gateway=%Gway% gwmetric=0 >nul   
   echo. 首选 DNS = %Dns%   
   netsh interface ipv4 set dns name=%Nic% source=static addr=%Dns% register=PRIMARY >nul 
   echo. 备用 DNS = %Dns%   
   netsh interface ipv4 add dns name=%Nic% addr=%Dns% index=2 >nul   
   echo ----   
   echo 全部设置完成! 
   pause   
   goto end   
   :3   
   echo 正在进行动态IP设置，请稍等...   
   echo. IP 地址正在从DHCP自动获取...   
   netsh interface ip set address %Nic% dhcp   
   echo. DNS地址正在从DHCP自动获取...   
   netsh interface ip set dns %Nic% dhcp   
   echo ----   
   echo 全部设置完成!   
   pause   
   :4 
   echo bye！   
   goto end   
   rem pause >null
   ```

### 启停服务

1. 停止服务

   ```bat
   net stop ABBYY.Licensing.FineReader.Professional.12.0
   sc delete ABBYY.Licensing.FineReader.Professional.12.0
   pause
   ```

2. 终止QQ后台进程

   ```bat
   sc delete qpcore
   taskkill /f /im QQProtect.exe /t
   rem ntsd -c q -p QQProtect.exe
   rem ntsd -c q -p pid
   pause
   ```

3. 打开winfender服务

   ```bat
   sc start WinDefend Enable
   ```
