# 附录：MNIST CNN 实操

参考脚本：`C:\Users\YZJ\Desktop\机器学习\mnist_cnn.py`

这个例子用一个简单 CNN 训练 MNIST 手写数字分类模型。MNIST 是灰度图像数据集，每张图片大小为 `28 x 28`，类别是 `0` 到 `9`。

整体流程：

```text
加载 MNIST -> 定义 CNN -> 前向传播 -> 计算交叉熵损失 -> 反向传播 -> Adam 更新参数 -> 测试准确率
```

## A.1 数据加载

脚本使用 `torchvision.datasets.MNIST` 加载数据：

```python
trainset = datasets.MNIST(
    root="data",
    train=True,
    transform=transforms.ToTensor()
)
trainloader = DataLoader(trainset, batch_size=64, shuffle=True)
```

其中：

| 参数 | 含义 |
| --- | --- |
| `root="data"` | 数据集保存目录 |
| `train=True` | 加载训练集 |
| `transforms.ToTensor()` | 把图像转换成 PyTorch 张量 |
| `batch_size=64` | 每次训练使用 64 张图片 |
| `shuffle=True` | 每轮训练前打乱数据 |

`ToTensor()` 会把图像转换成形状类似下面的张量：

```text
batch_size x channels x height x width
```

MNIST 是灰度图，所以通道数是 `1`。

## A.2 网络结构

脚本中的模型结构：

```python
self.conv1 = nn.Conv2d(1, 32, 3)
self.conv2 = nn.Conv2d(32, 64, 3)
self.linear1 = nn.Linear(9216, 128)
self.linear2 = nn.Linear(128, 10)
```

可以理解为：

```text
1 通道输入
-> 32 个 3x3 卷积核
-> 64 个 3x3 卷积核
-> 2x2 最大池化
-> 展平
-> 128 维全连接层
-> 10 类输出
```

前向传播：

```python
x = self.conv1(x)
x = F.relu(x)
x = self.conv2(x)
x = F.relu(x)
x = F.max_pool2d(x, 2)
x = torch.flatten(x, 1)
x = self.linear1(x)
x = F.relu(x)
x = self.linear2(x)
```

最后一层输出的是 logits，不需要手动加 softmax，因为 `nn.CrossEntropyLoss()` 内部会处理。

## A.3 尺寸变化

输入图像尺寸是：

```text
1 x 28 x 28
```

第一层卷积：

```text
Conv2d(1, 32, 3)
```

没有 padding，卷积核大小为 `3 x 3`，输出空间尺寸：

```text
28 - 3 + 1 = 26
```

所以输出为：

```text
32 x 26 x 26
```

第二层卷积：

```text
Conv2d(32, 64, 3)
```

输出空间尺寸：

```text
26 - 3 + 1 = 24
```

所以输出为：

```text
64 x 24 x 24
```

经过 `2 x 2` 最大池化后：

```text
64 x 12 x 12
```

展平后长度：

```text
64 x 12 x 12 = 9216
```

这就是 `linear1 = nn.Linear(9216, 128)` 中 `9216` 的来源。

## A.4 训练过程

训练代码核心部分：

```python
opt.zero_grad()
L = loss(model(x), y)
L.backward()
opt.step()
```

对应含义：

| 代码 | 作用 |
| --- | --- |
| `opt.zero_grad()` | 清空上一批次梯度 |
| `model(x)` | 前向传播得到 logits |
| `loss(model(x), y)` | 计算交叉熵损失 |
| `L.backward()` | 反向传播计算梯度 |
| `opt.step()` | 优化器更新参数 |

脚本使用 Adam 优化器：

```python
opt = torch.optim.Adam(model.parameters(), lr=0.001)
```

损失函数：

```python
loss = nn.CrossEntropyLoss()
```

`CrossEntropyLoss` 适合多分类任务，标签 `y` 直接使用类别编号，不需要手动转成 one-hot。

## A.5 测试过程

测试时要切换到评估模式：

```python
model.eval()
```

预测类别：

```python
pred = model(x).argmax(dim=1)
```

`argmax(dim=1)` 表示在 10 个类别分数中选择最大值对应的类别。

准确率计算：

```python
correct += (pred == y).sum().item()
total += y.size(0)
print(correct, total, correct / total)
```

## A.6 实操注意点

脚本中设备写的是：

```python
torch.device("mps")
```

这适合 Apple Silicon 设备。如果在 Windows 或没有 MPS 的环境中运行，可以改成：

```python
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
```

然后统一写：

```python
x, y = x.to(device), y.to(device)
model = net().to(device)
```

另外，脚本会保存模型到：

```python
checkpoints/a.pt
```

运行前需要确保 `checkpoints` 目录存在，否则保存模型时可能报错。
