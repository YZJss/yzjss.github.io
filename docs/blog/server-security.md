# 服务器防暴力破解

最近服务器一直被人暴力破解...

`lastb`命令会显示最近错误登录的日志，包括通过ssh服务错误登录的日志。

![Ssh Login](https://cdn.jsdelivr.net/gh/YZJss/tuchuang@main/images/server-security/ssh-login.png)

没办法，只能修改登陆端口了。

1.先查看服务器端口范围

```bash
[root@iZ2zei0fg2v7x4egtl0wllZ /]# sysctl -a|grep ip_local_port_range
sysctl: reading key "net.ipv6.conf.all.stable_secret"
sysctl: reading key "net.ipv6.conf.default.stable_secret"
sysctl: reading key "net.ipv6.conf.eth0.stable_secret"
sysctl: reading key "net.ipv6.conf.lo.stable_secret"
net.ipv4.ip_local_port_range = 32768    60999
```

ssh端口范围在(32768~60999)之间就可以 ，也可以用`netstat -lnp|grep 10086`查看端口是否被占用

2.修改配置文件

`vim /etc/ssh/sshd_config`找到`#Port 22`修改成

```
Port 22
Port 10086
```

3.重启服务

`systemctl restart sshd.service`，查看sshd状态`systemctl status sshd.service`

4.如果可以用新端口连接，把默认22端口禁用。

`vim /etc/ssh/sshd_config`在`Port 22`前加上#

ps:阿里云服务器需要在控制台添加安全组规则即可。

Copyright © YZJ 2022 all right reserved，powered by Gitbook更新时间： 2023-08-23 21:25:53
