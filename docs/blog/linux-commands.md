# Linux 常用命令

## 文件和目录

### 目录切换

```bash
pwd         # 查看当前所在目录
cd ~        # 进入当前用户主目录
cd ..       # 进入上级目录
cd /        # 进入系统根目录
```

### 查看目录

```bash
ls -a       # 列出目录下所有文件和目录，包括隐藏文件
ls -l       # 以长格式显示文件权限、所有者、大小、修改时间等信息
ll          # 很多系统中是 ls -l 的别名
```

### 创建文件和目录

```bash
touch a.txt     # 创建空文件，或更新文件修改时间
mkdir test      # 创建目录
mkdir -p a/b/c  # 递归创建多级目录
```

### 删除、移动、复制

```bash
rm -f a.txt         # 强制删除文件
rm -r test          # 删除目录及目录下所有内容
rm -rf test         # 强制递归删除目录

mv a.txt b.txt      # 重命名文件
mv b.txt ../        # 将文件移动到上级目录

cp a.txt b.txt      # 复制文件
cp -r dir1 dir2     # 复制目录
cp -u a.txt b.txt   # 源文件较新时才复制
```

`rm -rf /` 这类命令会删除系统根目录下的内容，生产环境中绝对不要执行。

## 权限 chmod

Linux 中常见文件类型如下：

| 标识 | 类型 |
| --- | --- |
| `-` | 普通文件 |
| `d` | 目录 |
| `l` | 符号链接 |
| `b` | 块设备文件 |
| `c` | 字符设备文件 |
| `p` | 管道文件 |

每个文件或目录的权限分为三组：文件所有者、所属组、其他用户。每组都包含读、写、执行三种权限。

![Chmod Permission](https://cdn.jsdelivr.net/gh/YZJss/tuchuang@main/images/linux/chmod-permission.png)

### 权限含义

| 权限 | 数字 | 含义 |
| --- | --- | --- |
| `r` | 4 | 可读 |
| `w` | 2 | 可写 |
| `x` | 1 | 可执行 |

例如 `7 = 4 + 2 + 1`，表示可读、可写、可执行；`6 = 4 + 2`，表示可读、可写。

### 符号模式

```bash
chmod u+x run.sh     # 给文件所有者增加执行权限
chmod g-w a.txt      # 去掉所属组写权限
chmod a+r a.txt      # 所有人增加读权限
```

| 标识 | 用户类型 |
| --- | --- |
| `u` | 文件所有者 |
| `g` | 文件所属组 |
| `o` | 其他用户 |
| `a` | 所有用户，相当于 `ugo` |

| 操作符 | 含义 |
| --- | --- |
| `+` | 增加权限 |
| `-` | 去除权限 |
| `=` | 重新设置权限 |

### 常见数字权限

| 权限 | 含义 |
| --- | --- |
| `400` | 所有者可读，其他人无权限 |
| `644` | 所有者可读写，组用户和其他用户可读 |
| `660` | 所有者和组用户可读写，其他用户无权限 |
| `700` | 所有者可读写执行，其他用户无权限 |
| `755` | 所有者可读写执行，其他用户可读和执行 |
| `777` | 所有人可读写执行，通常不建议使用 |

```bash
chmod 755 run.sh
chmod -R 755 project
```

## 文本搜索 grep

`grep` 用于按模式搜索文本，并输出匹配的行。

```bash
grep [选项] "模式" 文件
```

常用选项：

| 选项 | 含义 |
| --- | --- |
| `-i` | 忽略大小写 |
| `-n` | 显示匹配行号 |
| `-c` | 统计匹配行数 |
| `-o` | 只输出匹配到的内容 |
| `-v` | 反向匹配，输出不匹配的行 |
| `-w` | 匹配完整单词 |
| `-A n` | 输出匹配行之后 n 行 |
| `-B n` | 输出匹配行之前 n 行 |
| `-C n` | 输出匹配行前后各 n 行 |
| `-E` | 使用扩展正则表达式 |
| `-P` | 使用 Perl 兼容正则表达式 |

```bash
grep -n "error" app.log
grep -R "TODO" .
grep -E "error|warn" app.log
```

## 文件查找 find

```bash
find 搜索路径 [条件]
```

常用示例：

```bash
find . -name "a.cpp"             # 按文件名查找
find . -type f -name "*.log"     # 查找 log 文件
find . -type d -name "build"     # 查找目录
find . -mtime -7                 # 查找 7 天内修改过的文件
find . -size +100M               # 查找大于 100MB 的文件
```

## 查看文本内容

```bash
cat a.txt            # 一次显示整个文件
more a.txt           # 分页显示文件内容
less a.txt           # 分页查看，支持前后翻页和搜索
head -n 20 a.txt     # 查看前 20 行
tail -n 20 a.txt     # 查看后 20 行
tail -f app.log      # 实时追踪日志
```

## 进程管理

| 命令 | 作用 |
| --- | --- |
| `ps -ef` | 查看所有进程 |
| `ps -ef | grep nginx` | 按关键字过滤进程 |
| `kill PID` | 结束指定 PID 的进程 |
| `kill -9 PID` | 强制结束进程 |
| `top` | 实时查看进程和系统资源 |
| `iostat` | 查看磁盘 I/O 和 CPU 使用情况 |
| `sar -u 1 10` | 每 1 秒采样一次 CPU，共 10 次 |
| `sar -d 1 10` | 每 1 秒采样一次磁盘，共 10 次 |

## 网络

| 命令 | 作用 |
| --- | --- |
| `ifconfig` | 查看或配置网络接口，部分系统需要安装 `net-tools` |
| `ip addr` | 查看 IP 地址 |
| `ip link` | 查看网卡状态 |
| `ping host` | 测试网络连通性 |
| `netstat -lntp` | 查看监听中的 TCP 端口 |
| `netstat -antp` | 查看 TCP 连接 |
| `netstat -lutp` | 查看 TCP/UDP 监听和连接信息 |
| `ss -lntp` | 新系统中常用来替代 `netstat` |
| `route -n` | 查看路由表 |
| `ip route` | 查看路由表 |

配置 IP 示例：

```bash
ifconfig eth0 192.168.1.10 netmask 255.255.255.0
ip addr add 192.168.1.10/24 dev eth0
```

## 系统服务 systemctl

| 命令 | 作用 |
| --- | --- |
| `systemctl status 服务名` | 查看服务状态 |
| `systemctl start 服务名` | 启动服务 |
| `systemctl stop 服务名` | 停止服务 |
| `systemctl restart 服务名` | 重启服务 |
| `systemctl enable 服务名` | 设置开机自启动 |
| `systemctl disable 服务名` | 关闭开机自启动 |

## 防火墙 firewall-cmd

### 查看状态

```bash
firewall-cmd --version
firewall-cmd --state
systemctl status firewalld
firewall-cmd --list-all
firewall-cmd --list-ports
firewall-cmd --list-services
firewall-cmd --get-services
systemctl is-enabled firewalld
```

### 配置端口和服务

```bash
systemctl start firewalld
systemctl restart firewalld
systemctl stop firewalld

firewall-cmd --zone=public --add-port=80/tcp --permanent
firewall-cmd --zone=public --remove-port=80/tcp --permanent

firewall-cmd --zone=public --add-port=5000-5500/tcp --permanent
firewall-cmd --zone=public --remove-port=5000-5500/tcp --permanent

firewall-cmd --zone=public --add-service=ftp --permanent
firewall-cmd --zone=public --remove-service=ftp --permanent

firewall-cmd --reload
systemctl enable firewalld
systemctl disable firewalld
```

## 压缩和解压

| 文件类型 | 解压命令 |
| --- | --- |
| `.tar` | `tar -xvf file.tar` |
| `.gz` | `gzip -d file.gz` 或 `gunzip file.gz` |
| `.tar.gz` / `.tgz` | `tar -xzf file.tar.gz` |
| `.bz2` | `bzip2 -d file.bz2` 或 `bunzip2 file.bz2` |
| `.tar.bz2` | `tar -xjf file.tar.bz2` |
| `.Z` | `uncompress file.Z` |
| `.tar.Z` | `tar -xZf file.tar.Z` |
| `.rar` | `unrar e file.rar` |
| `.zip` | `unzip file.zip` |
| `.xz` | `xz -d file.xz` |
| `.tar.xz` | `tar -xJf file.tar.xz` |

## Git 常用命令

| 命令 | 作用 |
| --- | --- |
| `git init` | 初始化 Git 仓库 |
| `git clone URL` | 克隆远程仓库 |
| `git add 文件` | 添加文件到暂存区 |
| `git commit -m "message"` | 提交暂存区内容 |
| `git push` | 推送到远程仓库 |
| `git pull` | 拉取远程代码并合并 |
| `git fetch` | 拉取远程代码但不自动合并 |
| `git branch` | 查看本地分支 |
| `git checkout 分支名` | 切换分支 |
| `git switch 分支名` | 切换分支，新版本推荐 |
| `git merge 分支名` | 合并分支 |
| `git status` | 查看工作区状态 |
| `git log` | 查看提交日志 |
| `git diff` | 查看差异 |
| `git stash` | 暂存当前工作区修改 |
| `git tag` | 管理标签 |
| `git remote -v` | 查看远程仓库 |
