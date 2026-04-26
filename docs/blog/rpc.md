# RPC

RPC(Remote Procedure Call Protocol) 远程过程调用，客户端应用可以像调用本地函数一样，直接调用运行在远程服务器上的方法。**RPC 的主要功能目标是让构建分布式计算（应用）更容易，在提供强大的远程调用能力时不损失本地调用的语义简洁性。**

![image-20220814221421663](https://cdn.jsdelivr.net/gh/YZJss/tuchuang@main//68747470733a2f2f696d672d626c6f672e6373646e696d672e636e2f696d675f636f6e766572742f38363763653438376562643137653565666432333731386363613336666238312e706e67.png)

muduo+protoobuf+zookeeper

## 流程框架

![image-20220815133628010](https://cdn.jsdelivr.net/gh/YZJss/tuchuang@main//68747470733a2f2f696d672d626c6f672e6373646e696d672e636e2f696d675f636f6e766572742f34393566303135613766613636626631333930663962303034303161333765322e706e67.png)

![image-20220815184439376](https://cdn.jsdelivr.net/gh/YZJss/tuchuang@main//68747470733a2f2f696d672d626c6f672e6373646e696d672e636e2f696d675f636f6e766572742f34366638306630373434323963666463313464346230626161653636363630332e706e67.png)

![MPRPC.png](https://cdn.jsdelivr.net/gh/YZJss/tuchuang@main//MPRPC.png)

## 文件框架

```
rpcheader.proto rpcheader.pb.h/.pb.cc
mprpcapplication.h/.cc
mprpcconfig.h/.cc
rpcprovider.h/.cc
mprpccontroller.h/.cc
mprpcchannel.h/.cc
zookeeperutil.h/.cc
logger.h/.cc lockqueue.h
```

### `MprpcApplication`

`MprpcApplication`类负责mprpc框架的一些初始化操作，例如mprpc服务器需要监听的端口号还有所在地址。这些信息由配置文件来载入例如`test.conf`.

项目初始化的时候，会根据传入的命令行参数信息找到配置文件。如符合规范则找到配置文件会调用`MprpcConfig::LoadConfigFile`方法来解析加载配置文件。

```c++
//  mprpc框架基础类     负责框架的一些初始化操作
class MprpcApplication{
public:
    static void Init(int argc, char **argv);
    static MprpcApplication& GetInstance();
    static MprpcConfig& GetConfig();
private:
    static MprpcConfig m_config;

    MprpcApplication(){}
    MprpcApplication(const MprpcApplication&) = delete;
    MprpcApplication(MprpcApplication&&) = delete;

};
```

**命令行输入的合法性检测**

```c++
void MprpcApplication::Init(int argc, char **argv){
    if(argc < 2){
        ShowArgsHelp();
        exit(EXIT_FAILURE);
    }

    int c = 0;
    std::string config_file;
    if((c = getopt(argc, argv, "i:")) != -1){
        switch (c)
        {
        case 'i':
            config_file = optarg;
            break;
        case '?':
            ShowArgsHelp();
            exit(EXIT_FAILURE);
        case ':':
            ShowArgsHelp();
            exit(EXIT_FAILURE);
        default:
            break;
        }
    }

    //  开始加载配置文件了   rpcserver_ip=  rpcserver_port=  zookeeper_ip=  zookeeper_port=
    m_config.LoadConfigFile(config_file.c_str());
}
```

### `MprpcConfig`

用于读取配置文件，需要去掉注释和字符串前后多余的空格，还需检测配置项是否合法。

```c++
//rpcserverip   rpcserverport   zookeeperip     zookeeperport   
//框架读取配置文件类
class MprpcConfig{
public:
    //负责解析加载配置文件
    void LoadConfigFile(const char *config_file);

    //查询配置项信息
    std::string Load(const std::string &key);

private:
    std::unordered_map<std::string, std::string>m_configMap;

    //去掉字符串前后的空格
    void Trim(std::string &src_buf);
};
```

**测试配置文件加载功能**

编写`test.conf`文件

```bash
# rpc节点的ip地址
rpcserverip=127.0.0.1
# rpc节点的port端口号
rpcserverport=8080
# zk的IP地址
zookeeperip=127.0.0.1
# zk的port端口号
zookeeperport=2181
```

### `RpcProvider`

`RpcProvider`是一个框架专门为发布rpc服务的网络对象类。在服务端会用此类来注册服务，故`RpcProvider`类需要支持所有服务的发布。因此设计的`NotifyService`方法的参数必须要是这些服务的基类，也就是`google::protobuf::Service`。

因为protobuf只是提供了数据的序列化和反序列化还有RPC接口，并没有提供网络传输的相关代码。所以此项目用了muduo库实现网络传输。

同时还需要将服务注册到zookeeper上。

`RpcProvider`类源码

```c++
class RpcProvider{
public:
    //  这里是框架提供给外部使用的，可以发布RPC方法的接口
    void NotifyService(google::protobuf::Service *service);
    //  启动RPC服务结点，开始提供RPC远程网络调用服务
    void Run();
private:
    //  组合了EventLoop
    muduo::net::EventLoop m_eventLoop;
    //  服务类型信息
    struct ServiceInfo{
        google::protobuf::Service *m_service;    //  保存服务对象
        std::unordered_map<std::string, const google::protobuf::MethodDescriptor*> m_methodMap;   //  保存服务方法
    };
    //  存储注册成功的服务对象和其他服务方法的所有信息
    std::unordered_map<std::string, ServiceInfo> m_serviceMap;
    //  新的socket连接回调
    void OnConnection(const muduo::net::TcpConnectionPtr&);
    //  已建立连接用户的读写事件回调
    void OnMessage(const muduo::net::TcpConnectionPtr&, muduo::net::Buffer*, muduo::Timestamp);
    //  Closure的回调操作，用于序列化RPC的响应和网络发送
    void SendRpcResponse(const muduo::net::TcpConnectionPtr&, google::protobuf::Message*);

};
```

#### `NotifyService`

1.  利用NotifyService发布服务
    
2.  从`*service`获取服务对象的描述信息，此接口由protobuf提供。
    
3.  从描述信息中获取到服务名字和服务对象service的方法和数量。
    
4.  遍历`service`获取服务对象指定的服务方法描述，并将其注册到`m_methodMap`上，例如`FriendServiceRpc/GetFriendsList`.
    
5.  最后将其加入服务对象集合`m_serviceMap`中。
    
    ```c++
    void RpcProvider::NotifyService(google::protobuf::Service *service){
        ServiceInfo service_info;
        const google::protobuf::ServiceDescriptor *perviceDesc = service->GetDescriptor();
        std::string service_name = perviceDesc->name();
        int methodCnt = perviceDesc->method_count();
    
        LOG_INFO("service_name:%s", service_name.c_str());
    
        for (int i = 0; i < methodCnt; ++i){
            const google::protobuf::MethodDescriptor* pmethodDesc =  perviceDesc->method(i);
            std::string method_name = pmethodDesc->name();
            service_info.m_methodMap.insert({method_name, pmethodDesc});
    
            LOG_INFO("method_name:%s", method_name.c_str());
        }
        service_info.m_service = service;
        m_serviceMap.insert({service_name, service_info});
    }
    ```
    

**开启远程服务**

1.  从RPC的框架中获取到IP和PORT，创建TCPserver对象
    
2.  设置muduo库的线程数量
    
3.  把当前结点要发布的服务注册到zookeeper上，让客户端可以从zookeeper上发现服务
    
4.  启动网络服务
    
    ```c++
    void RpcProvider::Run(){
        std::string ip = MprpcApplication::GetInstance().GetConfig().Load("rpcserverip");
        uint16_t port = atoi(MprpcApplication::GetInstance().GetConfig().Load("rpcserverport").c_str());
        muduo::net::InetAddress address(ip, port);
    
        muduo::net::TcpServer server(&m_eventLoop, address, "RpcProvider");
    
        server.setConnectionCallback(std::bind(&RpcProvider::OnConnection, this, std::placeholders::_1));
        server.setMessageCallback(std::bind(&RpcProvider::OnMessage, this, std::placeholders::_1,
                 std::placeholders::_2, std::placeholders::_3));
    
        server.setThreadNum(4);
    
        ZkClient zkcli;
        zkcli.Start();
    
        for(auto &sp : m_serviceMap){
            std::string service_path = "/" + sp.first;
            zkcli.Create(service_path.c_str(), nullptr, 0);
            for(auto &mp : sp.second.m_methodMap){
                std::string method_name = service_path + "/" + mp.first;
                char method_path_data[128] = {0};
                sprintf(method_path_data, "%s:%d", ip.c_str(), port);
                zkcli.Create(method_name.c_str(), method_path_data, strlen(method_path_data), ZOO_EPHEMERAL);
            }
        }
    
        LOG_INFO("RpcProvider start service at ip::%s port:%d", ip.c_str(), port);
    
        server.start();
        m_eventLoop.loop();
    }
    ```
    

**客户端发起请求服务端接收到**

当接收到客户端的请求时。`OnMessage`回调函数会被调用，可以从客户端发过来的数据得知他想要调用那一个类的那一个方法以及其参数是什么。

为了防止TCP的粘包问题需要在自定义一个协议，本项目采用了将消息分为消息头和消息体，消息头包含此消息的总长度，每次都需要先读消息头，从而得知我们这次发过来的消息要读到那里。

![image-20220815120520672](https://cdn.jsdelivr.net/gh/YZJss/tuchuang@main//68747470733a2f2f696d672d626c6f672e6373646e696d672e636e2f696d675f636f6e766572742f34643737396238363435303962396238303731663636363637366237633937662e706e67.png)

1.  从网络上接收远程的RPC调用请求的字符串。
2.  从字符串中先读取前四个字节的内容，从而得知此次消息的长度。
3.  根据`header_size`读取数据头的原始字符串，反序列化数据得到RPC请求的详细消息。
4.  获取`service`对象和`method`对象。
5.  生成RPC方法调用请求`request`和相应`response`参数。
6.  在框架上根据远端的RPC请求调用当前的RPC结点方法。

```c++
void RpcProvider::OnMessage(const muduo::net::TcpConnectionPtr& conn, 
                            muduo::net::Buffer *buffer,
                             muduo::Timestamp){
    std::string recv_buf = buffer->retrieveAllAsString();

    uint32_t header_size = 0;
    recv_buf.copy((char *)&header_size, 4, 0);

    std::string rpc_header_str = recv_buf.substr(4, header_size);
    mprpc::RpcHeader rpcHeader;
    std::string service_name;
    std::string method_name;
    uint32_t args_size;
    if(rpcHeader.ParseFromString(rpc_header_str)){
        service_name = rpcHeader.service_name();
        method_name = rpcHeader.method_name();
        args_size = rpcHeader.args_size();
    }
    else{
        LOG_ERR("rec_header_str:%sparse error!", rpc_header_str.c_str());
        return;
    }

    std::string args_str = recv_buf.substr(4 + header_size, args_size);

    auto it = m_serviceMap.find(service_name);
    if(it == m_serviceMap.end()){
        LOG_ERR("%sis not exist", service_name.c_str());
        return;
    }

    auto mit = it->second.m_methodMap.find(method_name);
    if(mit == it->second.m_methodMap.end()){
        LOG_ERR("%s:%sis not exist", service_name.c_str(), method_name.c_str());
        return;
    }

    google::protobuf::Service *service = it->second.m_service;  
    const google::protobuf::MethodDescriptor *method = mit->second; 

    google::protobuf::Message *request = service->GetRequestPrototype(method).New();
    if(!request->ParseFromString(args_str)){
        LOG_ERR("request parse error! content:%s", args_str.c_str());
        return;
    }
    google::protobuf::Message *response = service->GetResponsePrototype(method).New();

    //  给下面的method的方法的调用，绑定一个Closure的回调函数
    google::protobuf::Closure *done = google::protobuf::NewCallback<RpcProvider, const muduo::net::TcpConnectionPtr&, google::protobuf::Message*>(this,&RpcProvider::SendRpcResponse, conn, response);

    service->CallMethod(method, nullptr, request, response, done);
}
```

**服务端处理完请求返回数据给客户端**

当`service->CallMethod`执行完毕后，调用通过`done`绑定的回调函数。将服务器处理后的结果序列化，然后通过muduo网络库发回给客户端。

```c++
void RpcProvider::SendRpcResponse(const muduo::net::TcpConnectionPtr& conn, google::protobuf::Message *response){
    std::string response_str;
    if(response->SerializeToString(&response_str)){
        conn->send(response_str);
    }
    else{
        LOG_ERR("serialize response_str error!");
    }
    conn->shutdown();  
}
```

### `MprpcController`

`MprpcContrller`模块继承于`google::protobuf::RpcController`，他声明于`service.h`文件下，而`RpcController`是一个抽象类，他的成员都是纯虚函数，需要我们自己重写实现，我们可以通过`RpcController`的方法得到RPC方法执行过程中的状态和RPC方法执行过程中的错误信息。

```c++
class PROTOBUF_EXPORT RpcController {
 public:
  inline RpcController() {}
  virtual ~RpcController();

  virtual void Reset() = 0;
  virtual bool Failed() const = 0;
  virtual std::string ErrorText() const = 0;
  virtual void StartCancel() = 0;
  virtual void SetFailed(const std::string& reason) = 0;
  virtual bool IsCanceled() const = 0;
  virtual void NotifyOnCancel(Closure* callback) = 0;

 private:
  GOOGLE_DISALLOW_EVIL_CONSTRUCTORS(RpcController);
};
```

#### `RpcController`的API

这里只提及本项目涉及到的接口

`Reset()`可以将`RpcController`重新设定为初始状态，以便他可以被重用。他不能在RPC进行时调用。

```c++
virtual void Reset() = 0;
```

`Failed()`在一个调用结束以后，如果调用失败则返回`ture`。失败的原因取决于RPC的实现。`Failed()`不能在调用结束前被调用。如果返回`true`则响应消息的内容未被定义。

```c++
virtual bool Failed() const = 0;
```

如果`Failed()`返回为`true`此方法则返回一个用户可读的错误描述。

```c++
virtual std::string ErrorText() const = 0;
```

`StartCancel()`通知RPC系统，调用者希望RPC调用取消，RPC系统可以立刻取消，也可以等待一段时间后再取消调用，也可以不取消。如果调用被取消，`done`回调任然会被调用，`RpcController`会表明当时的调用失败。

```c++
virtual void StartCancel() = 0;
```

#### `MprpcController`声明

```c++
class MprpcController : public google::protobuf::RpcController{
public:
    MprpcController();
    void Reset();
    bool Failed() const;
    std::string ErrorText() const;
    void SetFailed(const std::string& reason);

    //  目前未实现具体的功能
    void StartCancel();
    bool IsCanceled() const;
    void NotifyOnCancel(google::protobuf::Closure* callback);

private:
    bool m_failed;  //  RPC方法执行过程中的状态
    std::string m_errText; //  RPC方法执行过程中的错误信息
};
```

#### `MprpcController`实现

```c++
MprpcController::MprpcController(){
    m_failed = false;
    m_errText = "";
}

void MprpcController::Reset(){
    m_failed = false;
    m_errText = "";
}

bool MprpcController::Failed() const{
    return m_failed;
}

std::string MprpcController::ErrorText() const{
    return m_errText;
}

void MprpcController::SetFailed(const std::string& reason){
    m_failed = true;
    m_errText = reason;
}

//  目前未实现具体的功能
void MprpcController::StartCancel(){}
bool MprpcController::IsCanceled() const{return false;}
void MprpcController::NotifyOnCancel(google::protobuf::Closure* callback){}
```

### `MprpcChannel`

`MprpcChannel`模块继承于`google::protobuf::RpcChannel`是一个RPC通道的抽象接口，表示一个到服务的通信线路，这个线路用于客户端远程调用服务端的方法。我们需要继承这个类并重写他的`CallMethod`方法。

```c++
class PROTOBUF_EXPORT RpcChannel {
 public:
  inline RpcChannel() {}
  virtual ~RpcChannel();

  virtual void CallMethod(const MethodDescriptor* method,
                          RpcController* controller, const Message* request,
                          Message* response, Closure* done) = 0;

 private:
  GOOGLE_DISALLOW_EVIL_CONSTRUCTORS(RpcChannel);
};
```

```c++
class MprpcChannel : public google::protobuf::RpcChannel{
public:
    void CallMethod(const google::protobuf::MethodDescriptor* method,
                          google::protobuf::RpcController* controller, const google::protobuf::Message* request,
                          google::protobuf::Message* response, google::protobuf::Closure* done);

};
```

#### `CallMethod`方法

所有通过**stub**代理对象调用的RPC方法都走到了这里，统一做RPC方法调用的数据序列化和网络发送

**获取客户端请求的方法和序列化**

1.  从`CallMethod`的参数`method`获取`service_name`和`method_name`;
    
2.  将获取到的参数序列化为字符串，并获取他的长度。
    
3.  定义RPC的请求`header`.
    
4.  组织待发送的RPC请求的字符串
    
    ```c++
        const google::protobuf::ServiceDescriptor* sd = method->service();
        std::string service_name = sd->name(); 
        std::string method_name = method->name(); 
    
        uint32_t args_size = 0;
        std::string args_str;
        if(request->SerializeToString(&args_str)){
            args_size = args_str.size();
        }
        else{
            controller->SetFailed("serialize request error!");
            return;
        }
    
        mprpc::RpcHeader rpcHeader;
        rpcHeader.set_service_name(service_name);
        rpcHeader.set_method_name(method_name);
        rpcHeader.set_args_size(args_size);
    
        uint32_t header_size = 0;
        std::string rpc_header_str;
        if(rpcHeader.SerializeToString(&rpc_header_str)){
            header_size = rpc_header_str.size();
        }
        else{
            controller->SetFailed("serialize rpc header error!");
            return;
        }
    
        std::string send_rpc_str;
        send_rpc_str.insert(0, std::string((char*)&header_size, 4)); 
        send_rpc_str += rpc_header_str; 
        send_rpc_str += args_str;
    ```
    

**使用TCP编程完成RPC方法的远程调用**

因为`CallMethod`方法用于客户端远程调用服务端的方法，考虑到这里不需要高并发，故没有使用muduo网络库。

1.  通过 socket 函数在内核中创建一个套接字
    
2.  RPC调用方法想要调用`service_name`的`method_name`服务，需要到zookeeper上查询该服务的所在的`host`信息。
    
3.  查询到了`mathod_name`服务的IP和PORT后，连接RPC服务结点
    
4.  发送RPC请求
    
5.  接收RPC请求的响应值
    
6.  最后反序列化服务器发回来的响应数据
    
    ```c++
        int client_fd = socket(AF_INET, SOCK_STREAM, 0);
        if(client_fd == -1){
            char errtxt[512] = {0};
            sprintf(errtxt, "create socket error! error:%d", errno);
            controller->SetFailed(errtxt);
            return;
        }
    
        ZkClient zkcli;
        zkcli.Start();
        std::string method_path = "/" + service_name + "/" + method_name;
        //  127.0.0.1:8080  
        std::string host_data = zkcli.GetData(method_path.c_str());
        if(host_data == ""){
            controller->SetFailed(method_path + "is not exist!");
            return;
        }
        int idx = host_data.find(":");
        if(idx == -1){
            controller->SetFailed(method_path + "address is invalid!");
            return;
        }
        std::string ip = host_data.substr(0, idx);
        uint16_t port = atoi(host_data.substr(idx + 1, host_data.size() - idx).c_str());
    
        struct sockaddr_in server_addr;
        server_addr.sin_family = AF_INET;
        server_addr.sin_port = htons(port);
        server_addr.sin_addr.s_addr = inet_addr(ip.c_str());
    
        if(connect(client_fd, (struct sockaddr*)&server_addr, sizeof(server_addr)) == -1){
            close(client_fd);
            char errtxt[512] = {0};
            sprintf(errtxt, "connect error! error:%d", errno);
            controller->SetFailed(errtxt);
            return;
        }
    
        if(send(client_fd, send_rpc_str.c_str(), send_rpc_str.size(), 0) == -1){
            close(client_fd);
            char errtxt[512] = {0};
            sprintf(errtxt, "send error! errno:%d", errno);
            controller->SetFailed(errtxt);
            return;
        }
    
        char recv_buf[1024] = {0};
        int recv_size = 0;
        if((recv_size = recv(client_fd, recv_buf, 1024, 0)) == -1){
            close(client_fd);
            char errtxt[512] = {0};
            sprintf(errtxt, "recv error! error:%d", errno);
            controller->SetFailed(errtxt);
            return;
        }
    
        if(!response->ParseFromArray(recv_buf, recv_size)){
            close(client_fd);
            char errtxt[512] = {0};
            sprintf(errtxt, "parse error! response_str%s", recv_buf);
            controller->SetFailed(errtxt);
            return;
        }
        close(client_fd);
    ```
    

## 环境配置与示例

### 环境配置

[muduo](https://blog.csdn.net/T_Solotov/article/details/124044175) [Muduo环境配置](https://blog.csdn.net/QIANGWEIYUAN/article/details/89023980)

Zookeeper[下载链接](<http://archive.apache.org/dist/zookeeper/ 3.4.10>)

```bash
cd /src/c 
sudo apt-get install openjdk-8-jdk        //安装java
sudo ./configure
sudo make
sudo make install
// #include <zookeeper/zookeeper.h>
```

```bash
sudo ./configure
sudo make
sudo make install
// #include <google/protobuf>
```

**cmake配置**

```bash
ln -s /root/cmake-2.8.12.1-Linux-i386/bin/* /usr/bin/ 软连接 cmake
unlink ccmake  cmake  cmake-gui  cpack  ctest 解除软连接
ln -s /root/cmake-3.0.0-Linux-i386/bin/* /usr/bin/ 重新绑定3.0cmake
/usr/local/include
/usr/include/
/usr/local/lib/
```

### 示例

```bash
chmod 777 autobuild.sh
./autobuild.sh
```

在zookeeper-3.4.10/bin下启动zookeeper

```bash
root@iZ0jl7c15vkxg7t9i5hscaZ:~/zip/zookeeper-3.4.10/bin# ./zkServer.sh start        //启动服务
ZooKeeper JMX enabled by default
Using config: /root/zip/zookeeper-3.4.10/bin/../conf/zoo.cfg
Starting zookeeper ... STARTED
root@iZ0jl7c15vkxg7t9i5hscaZ:~/zip/zookeeper-3.4.10/bin# ./zkCli.sh            //启动客户端
Connecting to localhost:2181
2023-08-20 12:59:17,417 [myid:] - INFO  [main:Environment@100] - Client environment:zookeeper.version=3.4.10-39d3a4f269333c922ed3db283be479f9deacaa0f, built on 03/23/2017 10:13 GMT
2023-08-20 12:59:17,420 [myid:] - INFO  [main:Environment@100] - Client environment:host.name=iZ0jl7c15vkxg7t9i5hscaZ
2023-08-20 12:59:17,420 [myid:] - INFO  [main:Environment@100] - Client environment:java.version=1.8.0_292
2023-08-20 12:59:17,422 [myid:] - INFO  [main:Environment@100] - Client environment:java.vendor=Private Build
2023-08-20 12:59:17,422 [myid:] - INFO  [main:Environment@100] - Client environment:java.home=/usr/lib/jvm/java-8-openjdk-amd64/jre
2023-08-20 12:59:17,422 [myid:] - INFO  [main:Environment@100] - Client environment:java.class.path=/root/zip/zookeeper-3.4.10/bin/../build/classes:/root/zip/zookeeper-3.4.10/bin/../build/lib/*.jar:/root/zip/zookeeper-3.4.10/bin/../lib/slf4j-log4j12-1.6.1.jar:/root/zip/zookeeper-3.4.10/bin/../lib/slf4j-api-1.6.1.jar:/root/zip/zookeeper-3.4.10/bin/../lib/netty-3.10.5.Final.jar:/root/zip/zookeeper-3.4.10/bin/../lib/log4j-1.2.16.jar:/root/zip/zookeeper-3.4.10/bin/../lib/jline-0.9.94.jar:/root/zip/zookeeper-3.4.10/bin/../zookeeper-3.4.10.jar:/root/zip/zookeeper-3.4.10/bin/../src/java/lib/*.jar:/root/zip/zookeeper-3.4.10/bin/../conf:
2023-08-20 12:59:17,422 [myid:] - INFO  [main:Environment@100] - Client environment:java.library.path=/usr/java/packages/lib/amd64:/usr/lib/x86_64-linux-gnu/jni:/lib/x86_64-linux-gnu:/usr/lib/x86_64-linux-gnu:/usr/lib/jni:/lib:/usr/lib
2023-08-20 12:59:17,422 [myid:] - INFO  [main:Environment@100] - Client environment:java.io.tmpdir=/tmp
2023-08-20 12:59:17,422 [myid:] - INFO  [main:Environment@100] - Client environment:java.compiler=<NA>
2023-08-20 12:59:17,422 [myid:] - INFO  [main:Environment@100] - Client environment:os.name=Linux
2023-08-20 12:59:17,422 [myid:] - INFO  [main:Environment@100] - Client environment:os.arch=amd64
2023-08-20 12:59:17,422 [myid:] - INFO  [main:Environment@100] - Client environment:os.version=4.4.0-210-generic
2023-08-20 12:59:17,422 [myid:] - INFO  [main:Environment@100] - Client environment:user.name=root
2023-08-20 12:59:17,422 [myid:] - INFO  [main:Environment@100] - Client environment:user.home=/root
2023-08-20 12:59:17,423 [myid:] - INFO  [main:Environment@100] - Client environment:user.dir=/root/zip/zookeeper-3.4.10/bin
2023-08-20 12:59:17,423 [myid:] - INFO  [main:ZooKeeper@438] - Initiating client connection, connectString=localhost:2181 sessionTimeout=30000 watcher=org.apache.zookeeper.ZooKeeperMain$MyWatcher@69d0a921
2023-08-20 12:59:17,438 [myid:] - INFO  [main-SendThread(localhost:2181):ClientCnxn$SendThread@1032] - Opening socket connection to server localhost/0:0:0:0:0:0:0:1:2181. Will not attempt to authenticate using SASL (unknown error)
Welcome to ZooKeeper!
JLine support is enabled
2023-08-20 12:59:17,504 [myid:] - INFO  [main-SendThread(localhost:2181):ClientCnxn$SendThread@876] - Socket connection established to localhost/0:0:0:0:0:0:0:1:2181, initiating session
[zk: localhost:2181(CONNECTING) 0] 2023-08-20 12:59:17,519 [myid:] - INFO  [main-SendThread(localhost:2181):ClientCnxn$SendThread@1299] - Session establishment complete on server localhost/0:0:0:0:0:0:0:1:2181, sessionid = 0x18a114fb21c0000, negotiated timeout = 30000

WATCHER::

WatchedEvent state:SyncConnected type:None path:null
[zk: localhost:2181(CONNECTED) 2] ls /FiendServiceRpc/GetFriendsList
[]
```

启动服务端

```bash
root@iZ0jl7c15vkxg7t9i5hscaZ:~/mprpc/bin# ./provider -i test.conf
2023-08-20 13:00:37,470:25849(0x7fc3f0cd4a00):ZOO_INFO@log_env@726: Client environment:zookeeper.version=zookeeper C client 3.4.10
2023-08-20 13:00:37,470:25849(0x7fc3f0cd4a00):ZOO_INFO@log_env@730: Client environment:host.name=iZ0jl7c15vkxg7t9i5hscaZ
2023-08-20 13:00:37,470:25849(0x7fc3f0cd4a00):ZOO_INFO@log_env@737: Client environment:os.name=Linux
2023-08-20 13:00:37,470:25849(0x7fc3f0cd4a00):ZOO_INFO@log_env@738: Client environment:os.arch=4.4.0-210-generic
2023-08-20 13:00:37,470:25849(0x7fc3f0cd4a00):ZOO_INFO@log_env@739: Client environment:os.version=#242-Ubuntu SMP Fri Apr 16 09:57:56 UTC 2021
2023-08-20 13:00:37,470:25849(0x7fc3f0cd4a00):ZOO_INFO@log_env@747: Client environment:user.name=root
2023-08-20 13:00:37,470:25849(0x7fc3f0cd4a00):ZOO_INFO@log_env@755: Client environment:user.home=/root
2023-08-20 13:00:37,470:25849(0x7fc3f0cd4a00):ZOO_INFO@log_env@767: Client environment:user.dir=/root/mprpc/bin
2023-08-20 13:00:37,470:25849(0x7fc3f0cd4a00):ZOO_INFO@zookeeper_init@800: Initiating client connection, host=127.0.0.1:2181 sessionTimeout=30000 watcher=0x43a680 sessionId=0 sessionPasswd=<null> context=(nil) flags=0
2023-08-20 13:00:37,470:25849(0x7fc3ee318700):ZOO_INFO@check_events@1728: initiated connection to server [127.0.0.1:2181]
2023-08-20 13:00:37,474:25849(0x7fc3ee318700):ZOO_INFO@check_events@1775: session establishment complete on server [127.0.0.1:2181], sessionId=0x18a114fb21c0002, negotiated timeout=30000
zookeeper_init success!
znode create success... path:/FiendServiceRpc/GetFriendsList
RpcProvider start service at ip:127.0.0.1 port:8000
20230820 05:02:06.765811Z 25849 INFO  TcpServer::newConnection [RpcProvider] - new connection [RpcProvider-127.0.0.1:8000#1] from 127.0.0.1:35490 - TcpServer.cc:80
============================================
header_size: 35
rpc_header_str: 
FiendServiceRpcGetFriendsList
service_name: FiendServiceRpc
method_name: GetFriendsList
args_str:�
============================================
do GetFriendsList service! userid:1000
20230820 05:02:06.766073Z 25849 INFO  TcpServer::removeConnectionInLoop [RpcProvider] - connection RpcProvider-127.0.0.1:8000#1 - TcpServer.cc:109
```

启动客户端

```bash
root@iZ0jl7c15vkxg7t9i5hscaZ:~/mprpc/bin# ./consumer -i test.conf
============================================
header_size: 35
rpc_header_str: 
FiendServiceRpcGetFriendsList
service_name: FiendServiceRpc
method_name: GetFriendsList
args_str:�
============================================
2023-08-20 13:02:06,761:25861(0x7f18ef302740):ZOO_INFO@log_env@726: Client environment:zookeeper.version=zookeeper C client 3.4.10
2023-08-20 13:02:06,761:25861(0x7f18ef302740):ZOO_INFO@log_env@730: Client environment:host.name=iZ0jl7c15vkxg7t9i5hscaZ
2023-08-20 13:02:06,761:25861(0x7f18ef302740):ZOO_INFO@log_env@737: Client environment:os.name=Linux
2023-08-20 13:02:06,761:25861(0x7f18ef302740):ZOO_INFO@log_env@738: Client environment:os.arch=4.4.0-210-generic
2023-08-20 13:02:06,761:25861(0x7f18ef302740):ZOO_INFO@log_env@739: Client environment:os.version=#242-Ubuntu SMP Fri Apr 16 09:57:56 UTC 2021
2023-08-20 13:02:06,762:25861(0x7f18ef302740):ZOO_INFO@log_env@747: Client environment:user.name=root
2023-08-20 13:02:06,762:25861(0x7f18ef302740):ZOO_INFO@log_env@755: Client environment:user.home=/root
2023-08-20 13:02:06,762:25861(0x7f18ef302740):ZOO_INFO@log_env@767: Client environment:user.dir=/root/mprpc/bin
2023-08-20 13:02:06,762:25861(0x7f18ef302740):ZOO_INFO@zookeeper_init@800: Initiating client connection, host=127.0.0.1:2181 sessionTimeout=30000 watcher=0x417b00 sessionId=0 sessionPasswd=<null> context=(nil) flags=0
2023-08-20 13:02:06,762:25861(0x7f18ed147700):ZOO_INFO@check_events@1728: initiated connection to server [127.0.0.1:2181]
2023-08-20 13:02:06,764:25861(0x7f18ed147700):ZOO_INFO@check_events@1775: session establishment complete on server [127.0.0.1:2181], sessionId=0x18a114fb21c0003, negotiated timeout=30000
zookeeper_init success!
2023-08-20 13:02:06,766:25861(0x7f18ef302740):ZOO_INFO@zookeeper_close@2527: Closing zookeeper sessionId=0x18a114fb21c0003 to [127.0.0.1:2181]

rpc GetFriendsList response success!
index:1 name:gao yang
index:2 name:liu hong
index:3 name:wang shuo
```

## protobuf

[官方文档](https://protobuf.dev/getting-started/)

Protobuf(Protocol Buffers)，是Google公司开发的一种跨语言和平台的序列化数据结构的方式，是一个灵活的、高效的用于序列化数据的协议。与XML和JSON格式相比，protobuf更小、更快、更便捷。protobuf是跨语言的，并且自带一个编译器(protoc)，只需要用protoc进行编译，就可以编译成Java、Python、C++、C#、Go等多种语言代码，然后可以直接使用，不需要再写其它代码，自带有解析的代码。只需要将要被序列化的结构化数据定义一次(在.proto文件定义)，便可以使用特别生成的源代码(使用protobuf提供的生成工具)轻松的使用不同的数据流完成对结构数据的读写操作。甚至可以更新.proto文件中对数据结构的定义而不会破坏依赖旧格式编译出来的程序。

优点：

性能好，效率高 序列化后字节占用空间比XML少3-10倍，序列化的时间效率比XML快20-100倍。 有代码生成机制 将对结构化数据的操作封装成一个类，便于使用。 支持向后和向前兼容 当客户端和服务器同时使用一块协议的时候， 当客户端在协议中增加一个字节，并不会影响客户端的使用 支持多种编程语言Protobuf目前已经支持Java，C++，Python、Go、Ruby等多种语言。 缺点：

二进制格式导致可读性差

1.创建.proto文件，定义数据结构，格式如下：

```c++
message xxx {
  // 字段规则：required -> 字段只能也必须出现 1 次
  // 字段规则：optional -> 字段可出现 0 次或1次
  // 字段规则：repeated -> 字段可出现任意多次（包括 0）
  // 类型：int32、int64、sint32、sint64、string、32-bit ....
  // 字段编号：0 ~ 536870911（除去 19000 到 19999 之间的数字）
  字段规则 类型 名称 = 字段编号;
}
```

2.protoc编译.proto文件生成xxx.pb.h，xxx.pb.cpp

```bash
// $SRC_DIR: .proto 所在的源目录
// --cpp_out: 生成 c++ 代码
// $DST_DIR: 生成代码的目标目录
// xxx.proto: 要针对哪个 proto 文件生成接口代码
protoc -I=$SRC_DIR --cpp_out=$DST_DIR $SRC_DIR/xxx.proto
protoc ./xxx.proto --cpp_out=./
```

3.调用接口

```c++
#include <iostream>
#include <fstream>
#include "test.pb.h"
#include "google/protobuf/io/zero_copy_stream_impl.h"
#include "google/protobuf/text_format.h"
//g++ -g -o test test.cpp ./test.pb.cc -I. -lprotobuf -pthread -std=c++11

using namespace test;
int main(){
  User p;
  p.set_name("yangzejin");
  p.set_id("0507");

  //------------------将pb二进制信息保存到字符串
  std::string str;
  p.SerializeToString(&str);
  std::cout<<"str: "<<str<<std::endl;  

  //------------------将pb文本信息写入文件
  std::ofstream fw; 
  fw.open("./test.txt", std::ios::out | std::ios::binary);
  google::protobuf::io::OstreamOutputStream *output = new google::protobuf::io::OstreamOutputStream(&fw);
  google::protobuf::TextFormat::Print(p, output);

  delete output;
  fw.close();

  //---------------------将pb文本信息保存到字符串
  std::string str1;
  google::protobuf::TextFormat::PrintToString(p, &str1);
  std::cout<<"str1: "<<str1<<std::endl;

  //---------------------反序列化
  User p1;
  p1.ParseFromString(str);
  std::cout<<"name:"<<p1.name()<<",id:"<<p1.id()<<std::endl;

  return 0;
}
```

删除protobuf

```bash
which protoc
# protoc: /usr/bin/protoc
rm -rf /usr/bin/protoc
# protoc: /usr/bin/protoc
sudo rm -rf /usr/include/google/protobuf #头文件
sudo rm -rf /usr/local/include/google/protobuf #头文件
sudo rm -rf /usr/lib/libproto* #库文件
sudo rm -rf /usr/local/lib/libproto* # 库文件
```

## zookeeper

`ZooKeeper`是一个分布式的应用程序协调服务，我们client在调用RPC框架服务的时候需要一个服务配置中心来记录那个服务器提供了那个服务，通俗些讲就是client需要知道他想要远程调用的服务被放在了哪一台服务器上他的`IP:PORT`是什么，所以我们需要一个中间件`ZooKeeper`来告诉client他想要调用的服务在哪。

### `ZooKeeper`提供了什么

正如上文所说，`zookeeper`为我们提供文件系统和通知机制

-   文件系统
    
    `zookeeper`提供了一个多层级的命名空间（结点znode）。与文件系统不同的是，这些结点都可以设置一个关联的数据，而文件系统只有叶子结点可以存放数据目录结点则不行。`zookeeper`为了保持高吞吐了低延迟，在内存中维护了这个树状的树形结构。这种特质的原因使得`zookeeper`每个结点只能存储1MB的数据。
    
-   通知机制
    
    -   client端会对某一个znode建立一个`watcher`事件，当znode发生变化时，client会接收到zk发过来的通知，从而根据znode的变化做出业务上的改变。

### 结点类型

`zookeeper`节点类型可以分为持久节点（PERSISTENT）、临时节点（EPHEMERAL）和顺序节点（SEQUENTIAL）三大类，而本项目只会用到前两类。

**持久节点（PERSISTENT）**

所谓持久性结点就是指该数据节点被创建了之后，会一直保留在`zookeeper`服务器上，直到有删除操作来主动清除这个节点。例如项目中的`service_name`也就是`/FriendServiceRpc`就会被注册为持久结点，这里即使RPC结点超时未发送`心跳`，zk也不会删除这个结点。（心跳概念见下文）

**临时节点（EPHEMERAL）**

和持久性节点不同的是，临时结点的生命周期和客户端的会话绑定在一起的。因此只要客户端会话失效，那么这个节点就会被自动清理掉。注意，这里提到的是客户端会话失效，而非TCP连接断开。同时`zookeeper`规定了不能在临时结点上创建子结点，即临时结点只能作为叶子结点。我们这里做一个测试。

-   通过自述文件的方法启动`zookeeper`。（这里不做演示）
    
-   启动`provider`发布服务到zk上，这里能看到我们已经发布成功了。
    
    ```c++
    ubuntu% ./provider -i test.conf 
    rpcserverip:127.0.0.1
    rpcserverport:8080
    zookeeperip:127.0.0.1
    zookeeperport:2181
    2023-04-23 00:00:22,262:4806(0x7f7333731a00):ZOO_INFO@log_env@726: Client environment:zookeeper.version=zookeeper C client 3.4.10
    2023-04-23 00:00:22,262:4806(0x7f7333731a00):ZOO_INFO@log_env@730: Client environment:host.name=ubuntu
    2023-04-23 00:00:22,262:4806(0x7f7333731a00):ZOO_INFO@log_env@737: Client environment:os.name=Linux
    2023-04-23 00:00:22,262:4806(0x7f7333731a00):ZOO_INFO@log_env@738: Client environment:os.arch=5.4.0-146-generic
    2023-04-23 00:00:22,262:4806(0x7f7333731a00):ZOO_INFO@log_env@739: Client environment:os.version=#163~18.04.1-Ubuntu SMP Mon Mar 20 15:02:59 UTC 2023
    2023-04-23 00:00:22,263:4806(0x7f7333731a00):ZOO_INFO@log_env@747: Client environment:user.name=zixuanhuang
    2023-04-23 00:00:22,263:4806(0x7f7333731a00):ZOO_INFO@log_env@755: Client environment:user.home=/home/zixuanhuang
    2023-04-23 00:00:22,263:4806(0x7f7333731a00):ZOO_INFO@log_env@767: Client environment:user.dir=/home/zixuanhuang/mprpc/bin
    2023-04-23 00:00:22,263:4806(0x7f7333731a00):ZOO_INFO@zookeeper_init@800: Initiating client connection, host=127.0.0.1:2181 sessionTimeout=30000 watcher=0x55c06a84ef18 sessionId=0 sessionPasswd=<null> context=(nil) flags=0
    2023-04-23 00:00:22,263:4806(0x7f7330ecf700):ZOO_INFO@check_events@1728: initiated connection to server [127.0.0.1:2181]
    2023-04-23 00:00:22,266:4806(0x7f7330ecf700):ZOO_INFO@check_events@1775: session establishment complete on server [127.0.0.1:2181], sessionId=0x1879d16838c0045, negotiated timeout=30000
    zookeeper_init sucess!
    znode create success... path:/FriendServiceRpc
    znode create success... path:/FriendServiceRpc/GetFriendsList
    ```
    
-   回到`zkcli.sh`查看是否注册了这个节点，可以看到已经注册成功了。
    
    ```c++
    [zk: localhost:2181(CONNECTED) 6] ls /
    [zookeeper, FriendServiceRpc]
    [zk: localhost:2181(CONNECTED) 7] ls /FriendServiceRpc/GetFriendsList
    []
    [zk: localhost:2181(CONNECTED) 8]
    ```
    
-   这个时候我们将`provider`的会话关掉，可以看到`/FriendServiceRpc`目录下已经为空。
    
    ```c++
    provider:
    ^C
    ubuntu% 
    zkcli.sh:
    [zk: localhost:2181(CONNECTED) 8] ls /
    [zookeeper, FriendServiceRpc]
    [zk: localhost:2181(CONNECTED) 9] ls /FriendServiceRpc
    []
    ```
    

### 心跳消息

client和ZooKeeper之间通信，需要创建一个Session，这个Session会有一个超时时间，因为Zookeeper集群会把Client的Session信息持久化，所以在Session没超时之前，client与Zookeeper server的连接可以在各个Zookeeper server之间透明地移动。在实际的应用中，如果client与server之间的通信足够频繁，Session的维护就不需要其他额外的消息了。否则，ZooKeeper client每t/3ms就需要发一次心跳给Service，如果超过了t的事件Service还没有接收到client发过来的心跳消息，那么ZooKeeper Service就会认为这个client失效了，从而注销掉他的服务。

### 远程zkClient API存在的问题

1.  设置监听watcher只能是一次性的，每次触发后需要重复设置
2.  .znode节点只存储简单的byte字节数组，如果存储对象，需要自己转换对象生成字节数组

### 项目应用

Roc\_provider中注册到了unordered\_map中，这里需要连接ZkClient，注册到ZooKeeper中。这里需要创建指定的路径和数据。

路径为：`/FriendServiceRpc/GetFriendList`

数据为：`127.0.0.1:2181`

#### 对于提供RPC服务端，在`RpcProvider`的`Run()`方法做以下修改

```c++
        ZkClient zkcli;
    zkcli.Start();
    for(auto &sp : m_serviceMap){
        std::string service_path = "/" + sp.first;
        zkcli.Create(service_path.c_str(), nullptr, 0);
        for(auto &mp : sp.second.m_methodMap){
            std::string method_name = service_path + "/" + mp.first;
            char method_path_data[128] = {0};
            sprintf(method_path_data, "%s:%d", ip.c_str(), port);
            zkcli.Create(method_name.c_str(), method_path_data, strlen(method_path_data), ZOO_EPHEMERAL);
        }
    }
```

#### 对于调用RPC方法的客户端，在`MprpcChannel`的`CallMethod`方法做以下修改

```c++
        ZkClient zkcli;
    zkcli.Start();
    std::string method_path = "/" + service_name + "/" + method_name;
    std::string host_data = zkcli.GetData(method_path.c_str());
    if(host_data == ""){
        controller->SetFailed(method_path + "is not exist!");
        return;
    }
    int idx = host_data.find(":");
    if(idx == -1){
        controller->SetFailed(method_path + "address is invalid!");
        return;
    }
    std::string ip = host_data.substr(0, idx);
    uint16_t port = atoi(host_data.substr(idx + 1, host_data.size() - idx).c_str());
```

Copyright © YZJ 2022 all right reserved，powered by Gitbook更新时间： 2023-09-03 09:42:15
