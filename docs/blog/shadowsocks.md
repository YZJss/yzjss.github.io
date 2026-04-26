# Vultr 配置 Shadowsocks

首先在[Vultr](https://www.vultr.com/?ref=8060713)上购买vps，推荐NewYork 3.5美金/月,你也可以在这个网站测试本地到Vultr各个区域的延迟 [https://ping.gaomeluo.com/vultr/](https://ping.gaomeluo.com/vultr/) 。

![01](https://cdn.jsdelivr.net/gh/YZJss/tuchuang@main//01.png)

接下来用putty连接服务器，搭建Shdowsocks。

安装python和shadowsocks

```bash
$ yum install m2crypto python-setuptools
$ easy_install pip
$ pip install shadowsocks
```

配置文件

```bash
$ vi  /etc/shadowsocks.json
```

```bash
{
    "server":"0.0.0.0",
    "server_port":8989,
    "local_address": "127.0.0.1",
    "local_port":1080,
    "password":"yourpwd",
    "timeout":300,
    "method":"aes-256-cfb",
    "fast_open": false
}
```

server\_port可自定义，password是你登陆shadowsocks的密码，最后:wq退出保存即可。

配置防火墙

```bash
# 安装防火墙
$ yum install firewalld
# 启动防火墙
$ systemctl start firewalld
```

Vultr上的vps防火墙已经安装完了，这步可以省略。

下一步开放防火墙对应的端口

```bash
# 端口是上面server_port设置的端口
$ firewall-cmd --permanent --zone=public --add-port=8989/tcp
#重启防火墙
$ firewall-cmd --reload
```

启动Shaodwsocks

```bash
ssserver -c /etc/shadowsocks.json -d start   #启动

ssserver -c /etc/shadowsocks.json -d stop     #停止

ssserver -c /etc/shadowsocks.json -d restart #重启
```

最后用Shadowsocks客户端连接即可

![02](https://cdn.jsdelivr.net/gh/YZJss/tuchuang@main//02.png)

看油管1080p速度还是很快的。

![03](https://cdn.jsdelivr.net/gh/YZJss/tuchuang@main//03.png)

多用户和aes-256-gcm加密配置

```bash
#多用户配置
{
    "server":"0.0.0.0",
    "local_address":"127.0.0.1",
    "local_port":1080,
    "port_password":{
         "8990":"pwd1",
         "8989":"pwd2"                    
    },
    "timeout":300,
    "method":"aes-256-gcm",
    "fast_open": false
}
```

aes-256-gcm配置

```bash
#更新shadowsocks版本，之前的版本不支持aes-256-gcm
pip install https://github.com/shadowsocks/shadowsocks/archive/master.zip -U
```

安装libsodium

```bash
#先安装GCC
yum -y groupinstall "Development Tools"
#下载libsodium
wget https://download.libsodium.org/libsodium/releases/LATEST.tar.gz
#解压，cd进入解压目录下
tar xf LATEST.tar.gz && libsodium
#编译
./configure && make -j4 && make install
echo /usr/local/lib > /etc/ld.so.conf.d/usr_local_lib.conf
ldconfig
```

Copyright © YZJ 2022 all right reserved，powered by Gitbook更新时间： 2023-08-24 08:47:08
