# PyTorch 实战

## 基本训练流程

```python
for epoch in range(num_epochs):
    for X, y in train_loader:
        pred = model(X)
        loss = loss_fn(pred, y)

        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
```

## 常用模块

| 模块 | 用途 |
| --- | --- |
| `nn.Linear` | 全连接层 |
| `nn.Conv2d` | 二维卷积 |
| `nn.ReLU` | ReLU 激活 |
| `nn.CrossEntropyLoss` | 多分类损失 |
| `torch.optim.SGD` | 随机梯度下降 |
| `torch.optim.Adam` | Adam 优化器 |

## 后续补充

这一章可以结合 `d2l-zh-pytorch.pdf` 逐步补充线性回归、Softmax 回归、MLP、CNN、RNN 和 Transformer 的最小代码示例。
