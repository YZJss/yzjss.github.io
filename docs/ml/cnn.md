# 第 13 章 卷积神经网络

卷积神经网络（Convolutional Neural Network, CNN）主要用于图像和网格结构数据。它利用局部连接和参数共享，让模型更适合处理图像。

## 13.1 为什么图像适合用 CNN

图像有两个重要特点：

- 局部像素之间关系很强。
- 同一种局部模式可能出现在图像不同位置。

如果把图像直接展平成向量，再接全连接层，参数量会非常大，而且会破坏空间结构。CNN 使用卷积核在图像上滑动，能保留局部结构。

## 13.2 卷积层

卷积层用一个小窗口在输入图像上滑动，对局部区域做加权求和。

卷积核可以学习不同局部模式，例如边缘、角点、纹理等。

常见参数：

| 参数 | 含义 |
| --- | --- |
| kernel size | 卷积核大小 |
| stride | 滑动步长 |
| padding | 边缘填充 |
| channel | 通道数 |

卷积层的输出通常叫特征图。多个卷积核会产生多个输出通道。

## 13.3 池化层

池化用于降低特征图尺寸，减少计算量，并增强一定的平移鲁棒性。

常见池化：

| 池化 | 含义 |
| --- | --- |
| Max Pooling | 取局部区域最大值 |
| Average Pooling | 取局部区域平均值 |

现代网络中，有些结构会减少显式池化，改用带步长的卷积或全局平均池化。

## 13.4 感受野

感受野指输出特征图上一个位置对应输入图像中的区域大小。

浅层神经元感受野小，通常学习边缘、纹理等底层特征；深层神经元感受野更大，能组合出更抽象的物体部件和语义信息。

考试里常见问法是：CNN 靠近输入的层通常学习局部、底层特征，例如边缘和纹理。

## 13.5 典型 CNN 结构

一个简单 CNN 可以写成：

```text
输入图像 -> 卷积 -> 激活 -> 池化 -> 卷积 -> 激活 -> 池化 -> 全连接 -> 输出
```

经典结构：

| 模型 | 特点 |
| --- | --- |
| LeNet | 早期手写数字识别 |
| AlexNet | 推动深度学习在 ImageNet 上突破 |
| VGG | 结构规整，使用多个小卷积核 |
| ResNet | 引入残差连接，便于训练深层网络 |

ResNet 的跳跃连接让网络更容易学习恒等映射，缓解深层网络退化问题。

## 13.6 数据增强

图像数据增强可以提升泛化能力。

常见方法：

- 随机裁剪。
- 随机翻转。
- 随机旋转。
- 平移和缩放。
- 颜色扰动。

数据增强要保证不改变样本语义。例如数字识别里，某些旋转可能会把 `6` 变得像 `9`，这种增强就要谨慎。

## 13.7 目标检测

图像分类只回答“图里是什么”，目标检测还要回答“在哪里”。

目标检测输出通常包括：

- 类别。
- 边界框位置。
- 置信度。

常见模型包括 R-CNN 系列和 YOLO（You Only Look Once）系列。

IoU（Intersection over Union）用来衡量预测框和真实框的重合程度。设预测框为 $B_p$，真实框为 $B_g$：

$$
IoU = \frac{area(B_p \cap B_g)}{area(B_p \cup B_g)}
$$

IoU 越大，说明预测框越接近真实框。

## 13.8 图像分割和 U-Net

图像分割要对每个像素分类，比目标检测更细。

| 任务 | 输出 |
| --- | --- |
| 图像分类 | 整张图一个类别 |
| 目标检测 | 目标框和类别 |
| 图像分割 | 每个像素的类别 |

U-Net 常用于医学图像分割。它的名字来自网络整体像字母 U 的编码器-解码器结构，跳跃连接可以融合浅层空间信息和深层语义信息，从而得到更精细的分割结果。

## 13.9 迁移学习在视觉中的使用

图像任务常用在 ImageNet 上预训练的模型作为特征提取器。

常见做法：

1. 加载预训练 CNN。
2. 去掉或替换最后的分类层。
3. 冻结大部分卷积层。
4. 在自己的数据上训练新的分类头。

如果数据较多，也可以微调整个网络。数据较少时，只训练顶部分类层通常更稳。

## 13.10 卷积输出尺寸

卷积层输出尺寸由输入大小、卷积核大小、padding 和 stride 决定。

单个空间维度上，输出大小为：

$$
O =
\left\lfloor
\frac{I + 2P - K}{S}
\right\rfloor + 1
$$

其中：

| 符号 | 含义 |
| --- | --- |
| $I$ | 输入尺寸 |
| $K$ | 卷积核尺寸 |
| $P$ | padding 大小 |
| $S$ | stride 大小 |
| $O$ | 输出尺寸 |

例如输入是 `32 x 32`，卷积核是 `3 x 3`，padding 为 `1`，stride 为 `1`，输出仍然是 `32 x 32`。

padding 的作用不是“增加信息”，而是控制边缘如何参与卷积，并影响输出尺寸。

## 13.11 参数共享为什么有效

全连接层中，每个输出单元都连接所有输入像素。图像稍大时，参数量会迅速变大。

卷积层的参数共享指同一个卷积核在不同位置重复使用。这样有两个好处：

- 参数量大幅减少。
- 同一个局部模式可以在不同位置被检测出来。

例如一个边缘检测卷积核，不需要在图像左上角、右下角分别学习一套参数。只要这个局部模式出现，卷积核就有机会响应。

这也是 CNN 对图像平移具有一定鲁棒性的原因之一。但 CNN 并不是完全平移不变，stride、padding、池化和数据增强都会影响这种性质。

## 13.12 通道和多卷积核

彩色图像通常有 3 个输入通道：R、G、B。卷积核不是只在二维平面上滑动，而是同时覆盖所有输入通道。

如果输入特征图尺寸是：

```text
H x W x C_in
```

一个卷积核的尺寸通常是：

```text
K_h x K_w x C_in
```

如果有 $C_{out}$ 个卷积核，就会得到 $C_{out}$ 个输出通道。

所以卷积层参数量是：

$$
K_h \times K_w \times C_{in} \times C_{out}
$$

如果包含偏置，还要再加 $C_{out}$ 个偏置参数。

## 13.13 CNN 中的层级特征

CNN 的不同层学习到的东西不同。

| 层级 | 常见特征 |
| --- | --- |
| 浅层 | 边缘、角点、颜色变化 |
| 中层 | 纹理、局部形状、简单部件 |
| 深层 | 物体部件、类别语义 |

这种层级结构不是人工写死的，而是通过反向传播从数据中学出来的。

如果训练数据和任务相关性强，深层特征会更贴近目标任务。例如在人脸识别中，深层可能关注眼睛、鼻子、脸型等结构；在医学图像中，深层可能关注病灶形态。

## 13.14 检测任务的基本思路

目标检测比分类难，因为模型要同时解决两个问题：

- 分类：目标是什么。
- 定位：目标在哪里。

早期 R-CNN 系列通常先生成候选区域，再对候选区域分类和回归边界框。YOLO 系列把检测看成一次前向传播中的密集预测，速度更快。

检测模型通常会预测：

| 输出 | 含义 |
| --- | --- |
| class score | 每个类别的置信度 |
| box coordinate | 边界框位置 |
| objectness | 当前位置是否有目标 |

边界框回归不是直接“画框”，而是让模型学习预测框的位置偏移。

## 13.15 分割任务为什么需要跳跃连接

图像分割要求输出和输入在空间上精细对齐。深层特征语义强，但分辨率低；浅层特征分辨率高，但语义弱。

U-Net 的跳跃连接把浅层特征传到解码器，帮助恢复细节。

在实现目标检测系统时，可以把流程分成几个层次：

```text
深层特征：知道“是什么”
浅层特征：知道“在哪里”
跳跃连接：把语义和位置细节合起来
```

这就是 U-Net 在医学图像分割中常见的原因：很多病灶区域边界细，需要同时保留空间细节和高级语义。

## 13.16 MNIST CNN 实操

下面是一份完整的 MNIST CNN 训练和测试代码：

```python
from torchvision import datasets, transforms  # 从 torchvision 导入数据集工具和图像预处理工具
from torch.utils.data import DataLoader  # 导入 DataLoader，用来按 batch 加载数据
import torch.nn as nn  # 导入神经网络模块，常用别名是 nn
import torch  # 导入 PyTorch 主库

device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")  # 有 CUDA 显卡就用 GPU，否则用 CPU
transform = transforms.Compose([  # 把多个图像预处理步骤组合起来
    transforms.ToTensor(),  # 把图片转成 Tensor，并把像素值从 0~255 缩放到 0~1
    transforms.Normalize((0.1307,), (0.3081,)),  # 用 MNIST 的均值和标准差做归一化，让训练更稳定
])  # 预处理组合结束
model = nn.Sequential(  # 用 Sequential 按顺序搭建神经网络
    nn.Conv2d(1, 32, 3),  # 第一层卷积：输入 1 个灰度通道，输出 32 个特征通道，卷积核大小 3x3
    nn.BatchNorm2d(32),  # 对 32 个卷积输出通道做批归一化，让训练更稳定
    nn.ReLU(),  # 激活函数，把负数变成 0，增加模型的非线性表达能力
    nn.Conv2d(32, 64, 3),  # 第二层卷积：输入 32 个通道，输出 64 个通道，卷积核大小 3x3
    nn.BatchNorm2d(64),  # 对 64 个卷积输出通道做批归一化
    nn.ReLU(),  # 再次使用 ReLU 激活函数
    nn.MaxPool2d(2),  # 最大池化，把特征图宽高缩小一半，减少计算量
    nn.Flatten(),  # 把多维特征图展平成一维向量，方便接全连接层
    nn.Dropout(0.3),  # 训练时随机丢弃 30% 的神经元输出，降低过拟合
    nn.Linear(9216, 128),  # 全连接层：把 9216 个输入特征映射到 128 个特征
    nn.ReLU(),  # 全连接层后继续加 ReLU 激活
    nn.Dropout(0.3),  # 再做一次 Dropout，继续降低过拟合风险
    nn.Linear(128, 10),  # 输出层：把 128 个特征映射到 10 类数字
).to(device)  # 把模型参数移动到 CPU 或 GPU 上
traindata = datasets.MNIST(root='./data', train=True, download=True, transform=transform)  # 下载/读取 MNIST 训练集
traindataloader = DataLoader(traindata, batch_size=64, shuffle=True)  # 把训练集包装成 DataLoader，每批 64 张，训练时打乱顺序
opt = torch.optim.Adam(model.parameters(), lr=0.001)  # 创建 Adam 优化器，用来更新模型参数
criterion = nn.CrossEntropyLoss()  # 创建交叉熵损失函数，适合多分类任务
for epoch in range(0, 10):  # 训练 10 轮，epoch 表示完整看一遍训练集
    model.train()  # 切换到训练模式，启用 Dropout 和 BatchNorm 的训练行为
    for x, y in traindataloader:  # 每次从训练集中取出一批图片 x 和标签 y
        x = x.to(device)  # 把图片移动到当前设备
        y = y.to(device)  # 把标签移动到当前设备
        opt.zero_grad()  # 清空上一轮反向传播留下的梯度
        output = model(x)  # 前向传播：把图片输入模型，得到 10 类分数
        loss = criterion(output, y)  # 计算 loss，衡量预测结果和真实标签的差距
        loss.backward()  # 反向传播，根据 loss 计算每个参数的梯度
        opt.step()  # 优化器根据梯度更新模型参数
    print(loss.item())  # 打印当前 epoch 最后一个 batch 的 loss
torch.save(model.state_dict(), './model.pth')  # 保存模型参数到 model.pth

valdata = datasets.MNIST(root='./data', train=False, download=True, transform=transform)  # 下载/读取 MNIST 测试集
valdataloader = DataLoader(valdata, batch_size=1000, shuffle=False)  # 测试集 DataLoader，每批 1000 张，测试时不需要打乱
model.eval()  # 切换到评估模式，关闭 Dropout，并让 BatchNorm 使用训练时累计的统计值
correct = 0  # 记录预测正确的样本数量
total = 0  # 记录测试过的样本总数量
with torch.no_grad():  # 测试时不计算梯度，速度更快，也更省显存
    for x, y in valdataloader:  # 每次从测试集中取出一批图片 x 和标签 y
        x = x.to(device)  # 把测试图片移动到当前设备
        y = y.to(device)  # 把测试标签移动到当前设备
        pred = model(x).argmax(dim=1)  # 模型输出 10 类分数，取分数最大的类别作为预测结果
        correct += (pred == y).sum().item()  # 统计这一批里预测正确的数量，并累加
        total += y.size(0)  # 累加这一批的样本数量
print(correct / total)  # 打印测试集准确率
```

