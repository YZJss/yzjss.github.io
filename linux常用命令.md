# linux常用命令

## 文件和目录常用命令

`pwd `查看当前所在目录

```bash
cd ~		# 进入当前用户主目录
cd ..		# 进入上级目录
cd /		# 进入系统根目录
```

```bash
ls -a		# 列出目录下所有文件和目录
ls -l		# 等同于ll  将文件的名字、权限、所有者、文件大小等信息详细列出来
```

`touch` 新建文件命令

`mkdir` 创建一个空目录

```bash
rm -f				# 强制删除
rm -r				# 删除目录和目录里所有文件
rm -rf /*		# 删库跑路
```

```bash
mv a.txt b.txt		# 修改文件名
mv b.txt ../			# 将文件移动到上级目录
```

```bash
cp 源文件 目标文件（夹）			  # 复制一个源文件到目标文件（夹）
cp -r 源文件夹 目标文件夹			 # 复制源文件夹到目标文件夹下
cp -u 源文件 目标文件					# 只有源文件较目标文件新时复制。
```

## chmod 权限

Linux系统中一切都是文件。Linux使用不同的字符来区分不同的文件：

| 普通文件 | 目录文件 | 链接文件 | 块设备文件 | 字符设备文件 | 管道文件 |
| :------: | :------: | :------: | :--------: | :----------: | :------: |
|    -     |    d     |    l     |     b      |      c       |    p     |

每一文件或目录的访问权限都有三组，每组用三位表示，分别为文件属主的读、写和执行权限；与属主同组的用户的读、写和执行权限；系统中其他用户的读、写和执行权限。当用ls -l命令显示文件或目录的详细信息时，最左边的一列为文件的访问权限。

![图片alt](https://cdn.jsdelivr.net/gh/YZJss/tuchuang@main/1613835889.png)

文件权限的数字表示法基于字符（rwx）的权限计算而来，其目的是简化权限的表示方式。例如，若某个文件的权限为7，则代表可读、可写、可执行（4+2+1）；若权限为6，则代表可读、可写（4+2）。

```
chmod who operator permission file` 如`chmod u+x rumenz.txt
```

#### who(用户类型)

| who  | 用户类型 | 说明                 |
| :--- | :------- | :------------------- |
| u    | user     | 文件所有者           |
| g    | group    | 文件所有者所在组     |
| o    | others   | 所有其他用户         |
| a    | all      | 所用用户, 相当于 ugo |

#### operator(符号模式表)

| Operator | 说明                                                   |
| :------- | :----------------------------------------------------- |
| +        | 为指定的用户类型增加权限                               |
| -        | 去除指定用户类型的权限                                 |
| =        | 设置指定用户权限的设置，即将用户类型的所有权限重新设置 |

#### permission(权限)

| 模式 | 名字     | 说明             |
| :--- | :------- | :--------------- |
| r    | 读       | 设置为可读权限   |
| w    | 写       | 设置为可写权限   |
| x    | 执行权限 | 设置为可执行权限 |

#### 常见的数字权限

- 400 -r———— 拥有者能够读，其他任何人不能进行任何操作；
- 644 -rw-r—r— 拥有者都能够读，但只有拥有者可以编辑；
- 660 -rw-rw—— 拥有者和组用户都可读和写，其他人不能进行任何操作；
- 664 -rw-rw-r— 所有人都可读，但只有拥有者和组用户可编辑；
- 700 -rwx——— 拥有者能够读、写和执行，其他用户不能任何操作；
- 744 -rwxr—r— 所有人都能读，但只有拥有者才能编辑和执行；
- 755 -rwxr-xr-x 所有人都能读和执行，但只有拥有者才能编辑；
- 777 -rwxrwxrwx 所有人都能读、写和执行（该设置通常不是好想法）。

对文件test赋权`chmod 777 test`或对一个目录赋权要加 -R，递归执行，如对yzj目录执行赋权，`chmod -R 777 yzj`

## grep 搜索内容

grep (global search regular expression(RE) and print out the line,全面搜索正则表达式并把行打印出来)是一种强大的文本搜索工具，它能使用正则表达式搜索文本，并把匹配的行打印出来。

格式：**grep  [选项]  ”模式“  [文件]**

内容和文件名均可写作正则表达式

```bash
-i：在搜索的时候忽略大小写

-n：显示结果所在行号

-c：统计匹配到的行数，注意，是匹配到的总行数，不是匹配到的次数

-o：只显示符合条件的字符串，但是不整行显示，每个符合条件的字符串单独显示一行

-v：输出不带关键字的行（反向查询，反向匹配）

-w：匹配整个单词，如果是字符串中包含这个单词，则不作匹配
-Ax：在输出的时候包含结果所在行之后的指定行数，这里指之后的x行，A：after

-Bx：在输出的时候包含结果所在行之前的指定行数，这里指之前的x行，B：before

-Cx：在输出的时候包含结果所在行之前和之后的指定行数，这里指之前和之后的x行，C：context

-e：实现多个选项的匹配，逻辑or关系

-P：表示使用兼容perl的正则引擎。

-E：使用扩展正则表达式，而不是基本正则表达式，在使用"-E"选项时，相当于使用egrep。
```

## find 搜索文件

**find 搜索路径 [选项] 搜索内容**

-name  通过文件名字来查找

```bash
find . -name a.cpp		# 从当前目录搜索
```

## cat、more、tail 显示文本文件内容

`cat 文件名`：cat命令一次显示整个文件的内容

`more 文件名`：more命令分页显示文件的内容，按空格键显示下一页，按b键显上一页，按q键退出。

`tail -f 文件名`：tail -f用于显示文本文件的最后几行，如果文件的内容有增加，就**实时的刷新**。对程序员来说，tail -f极其重要，可以动态显示后台服务程序的日志，用于调试和跟踪程序的运行。

## 进程管理

|         常用命令         |               作用                |
| :----------------------: | :-------------------------------: |
|          ps -ef          |           查看所有进程            |
| ps -ef \|grep expression |  用正则表达式过滤出所需要的进程   |
|       kill -s name       |         kill指定名称进程          |
|       kill -s pid        |         kill指定pid的进程         |
|           top            |         实时显示进程状态          |
|         iostate          |      查看io读写/cpu使用情况       |
|       sar -u 1 10        | 查询cpu使用情况（1秒1次，共10次） |
|       sar -d 1 10        |           查询磁盘性能            |

## 网络

|                     常用命令                     |           作用           |
| :----------------------------------------------: | :----------------------: |
|                   **ifconfig**                   |   **查看网络接口属性**   |
|                     ip addr                      |        查看ip地址        |
| ipconfig eh0 192.168.1.1 netmask 255.255.255.255 |        配置ip地址        |
|                   **netstat**                    | **查看各种网络相关信息** |
|                  netstat -lntp                   |     查看所有监听端口     |
|                  netstat -antp                   |  查看已经建立的TCP连接   |
|                  netstat -lutp                   |  查看TCP/UDP的状态信息   |
|                     route -n                     |        查看路由表        |

## 系统服务

|          常用命令           |     作用     |
| :-------------------------: | :----------: |
| systemctl  status  <服务名> | 查看某个服务 |
|  systemctl  start <服务名>  | 启动某个服务 |
|  systemctl   stop <服务名>  | 终止某个服务 |
| systemctl  restart <服务名> | 重启某个服务 |
| systemctl  enable <服务名>  |  开启自启动  |
| systemctl  disable <服务名> |  关闭自启动  |
|      chkconfig --list       | 列出系统服务 |

使用systemctl命令 配置防火墙的过程如下

**查看防火墙的命令：**

- 1）查看防火墙的版本。firewall-cmd --version
- 2）查看firewall的状态。firewall-cmd --state
- 3）查看firewall服务状态（普通用户可执行）。systemctl status firewalld
- 4）查看防火墙全部的信息。firewall-cmd --list-all
- 5）查看防火墙已开通的端口。firewall-cmd --list-port
- 6）查看防火墙已开通的服务。firewall-cmd --list-service
- 7）查看全部的服务列表（普通用户可执行）。firewall-cmd --get-services
- 8）查看防火墙服务是否开机启动。 systemctl is-enabled firewalld

**配置防火墙的命令：**

- 1）启动、重启、关闭防火墙服务。
  - systemctl start firewalld \# 启动
  - systemctl restart firewalld \# 重启
  - systemctl stop firewalld \# 关闭 

- 2）开放、移去某个端口。
  - firewall-cmd --zone=public --add-port=80/tcp --permanent \# 开放80端口
  - firewall-cmd --zone=public --remove-port=80/tcp --permanent \# 移去80端口

- 3）开放、移去范围端口。
  - firewall-cmd --zone=public --add-port=5000-5500/tcp --permanent \# 开放5000-5500之间的端口
  - firewall-cmd --zone=public --remove-port=5000-5500/tcp --permanent \# 移去5000-5500之间的端口

- 4）开放、移去服务。
  - firewall-cmd --zone=public --add-service=ftp --permanent \# 开放ftp服务
  - firewall-cmd --zone=public --remove-service=ftp --permanent \# 移去http服务

- 5）重新加载防火墙配置（修改配置后要重新加载防火墙配置或重启防火墙服务）。
  - firewall-cmd --reload

- 6）设置开机时启用、禁用防火墙服务。
  - systemctl enable firewalld \# 启用服务
  - systemctl disable firewalld \# 禁用服务

## 其他

tar -xvf xxx.tar 解压tar包

1. *.tar 用 tar –xvf 解压
2. *.gz 用 gzip -d或者gunzip 解压
3. *.tar.gz和*.tgz 用 tar –xzf 解压
4. *.bz2 用 bzip2 -d或者用bunzip2 解压
5. *.tar.bz2用tar –xjf 解压
6. *.Z 用 uncompress 解压
7. *.tar.Z 用tar –xZf 解压
8. *.rar 用 unrar e解压
9. *.zip 用 unzip 解压
10. *.xz 用 xz -d 解压
11. *.tar.xz 用 tar -zJf 解压



## 你用过的 Linux 常用命令有哪些？

- 首先是一些文件和目录操作的命令，比如：
  - cd 、pwd、 ls、
  - 创建 touch 、mkdir，删除 rm、移动或重命名 rm，复制cp
  - cat、more、tail 查看文件内容
  - 还有一些重要的命令，如chmod 权限管理、grep 搜索内容、find 搜索文件
- 还有一些和网络相关的命令
  - ipconfig 查看网络接口属性，配置ip地址
  - netstat 查看各种网络相关信息
  - route 查看路由
  - ping
- 进程管理的常用命令有：
  - ps -ef 查看所有进程信息
  - kill 杀死进程
- 系统方面常用的有：
  - top 可以动态显示cpu、内存、进程等情况
  - iostat 可以查看io读写/cpu使用情况
  - sar 查询cpu、磁盘使用情况
  - env 可以查看环境变量
  - date 显示日期
- 还有一些服务的常用命令
  - systemctl 管理服务
  - firewall-cmd 防火墙
  - vsftpd 文件传输
- 一些软件安装管理的
  - rpm、yum、dpkg、apt-get用于安装管理软件
  - 解压缩有：
    - tar -xvf xxx.tar 解压tar包
    - zip、unzip
    - gzip与gunzip
