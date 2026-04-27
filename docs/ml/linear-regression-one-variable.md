# 第 2 章 单变量线性回归

这一章开始学习第一个具体算法：线性回归。主线是：

1. 用假设函数表示模型。
2. 用代价函数衡量模型好坏。
3. 用梯度下降自动寻找最优参数。

## 2.1 模型表示

课程用房价预测作为线性回归的例子。

已知一批房子的面积和实际成交价格，希望根据新房子的面积预测它的价格。因为训练集中每个样本都有正确答案，所以这是监督学习；因为要预测的是价格这种连续值，所以这是回归问题。

常用符号如下：

| 符号 | 含义 |
| --- | --- |
| `m` | 训练集中样本的数量 |
| `x` | 特征 / 输入变量 |
| `y` | 目标变量 / 输出变量 |
| `(x, y)` | 一个训练样本 |
| `(x^(i), y^(i))` | 第 `i` 个训练样本 |
| `h` | 假设函数，也就是学习算法得到的预测函数 |

监督学习的大致流程：

```text
训练集 -> 学习算法 -> 假设函数 h -> 对新输入 x 预测 y
```

在单变量线性回归中，只有一个输入特征，例如房屋面积。假设函数写作：

$$
h_\theta(x) = \theta_0 + \theta_1 x
$$

其中：

- `theta_0` 是截距。
- `theta_1` 是斜率。
- `h_theta(x)` 是模型对输入 `x` 的预测结果。

因为模型只有一个特征变量，所以叫单变量线性回归。

## 2.2 代价函数

线性回归要做的事情是选择合适的参数 `theta_0` 和 `theta_1`，让直线尽量贴合训练数据。

模型预测值和真实值之间的差距就是误差：

$$
h_\theta(x^{(i)}) - y^{(i)}
$$

线性回归中常用平方误差代价函数：

$$
\begin{aligned}
J(\theta_0, \theta_1)
&= \frac{1}{2m}
\sum_{i=1}^{m}
\left(h_\theta(x^{(i)}) - y^{(i)}\right)^2
\end{aligned}
$$

目标是找到一组参数，使代价函数最小：

$$
\min_{\theta_0,\theta_1} J(\theta_0,\theta_1)
$$

这里的 `1 / 2m` 是为了后面求导更方便。平方误差代价函数是回归问题中非常常见的选择。

## 2.3 代价函数的直观理解 I

先看简化情况：假设 `theta_0 = 0`，模型变成：

$$
h_\theta(x) = \theta_1 x
$$

此时只有一个参数 `theta_1`。不同的 `theta_1` 会得到不同斜率的直线，也会对应不同的代价函数值 `J(theta_1)`。

直观理解：

- 直线越贴近训练样本，预测误差越小。
- 预测误差越小，代价函数 `J` 越小。
- 最好的 `theta_1` 是让 `J(theta_1)` 最小的值。

这一节的重点不是计算，而是把“选参数”理解成“找代价函数最低点”。

## 2.4 代价函数的直观理解 II

回到完整模型：

$$
h_\theta(x) = \theta_0 + \theta_1 x
$$

这时参数有两个：`theta_0` 和 `theta_1`。代价函数是：

$$
J(\theta_0,\theta_1)
$$

可以把它想成一个三维曲面：

- 横轴是 `theta_0`。
- 另一个横轴是 `theta_1`。
- 高度是 `J(theta_0, theta_1)`。

也可以用等高线图观察。等高线越靠近中心低点，说明对应参数让代价函数越小。

但实际做机器学习时，不能靠人工画图找最低点。因为真实问题可能有很多参数，维度很高，无法直接可视化。所以需要一种自动寻找最小值的算法，也就是下一节的梯度下降。

## 2.5 梯度下降

梯度下降是一种用来求函数最小值的算法。在线性回归里，它用来最小化代价函数：

$$
J(\theta_0,\theta_1)
$$

直观想法：从某个初始位置出发，每次朝着让代价函数下降最快的方向走一小步，不断重复，直到接近局部最小值。

梯度下降更新规则：

$$
\theta_j \leftarrow \theta_j - \alpha \frac{\partial}{\partial \theta_j} J(\theta)
$$

其中：

- `alpha` 是学习率。
- `dJ / dtheta_j` 是代价函数对参数 `theta_j` 的偏导数。
- `j` 表示要更新的参数编号。

对 `theta_0` 和 `theta_1` 更新时，必须同时更新。也就是说，先用旧参数计算出两个新值，再一起赋值。

正确的同步更新方式：

```text
temp0 := theta0 - alpha * dJ/dtheta0
temp1 := theta1 - alpha * dJ/dtheta1

theta0 := temp0
theta1 := temp1
```

不要先更新 `theta_0`，再拿新的 `theta_0` 去计算 `theta_1`。

## 2.6 梯度下降的直观理解

梯度下降公式：

$$
\theta_j \leftarrow \theta_j - \alpha \frac{\partial}{\partial \theta_j} J(\theta)
$$

可以从两个角度理解。

### 导数决定方向

导数表示当前位置的斜率。

- 如果导数为正，参数会减小。
- 如果导数为负，参数会增大。
- 如果导数为 0，说明已经在局部最低点附近，参数不会继续改变。

### 学习率决定步长

学习率 `alpha` 控制每一步走多大。

| 学习率情况 | 结果 |
| --- | --- |
| `alpha` 太小 | 收敛很慢，需要很多步 |
| `alpha` 太大 | 可能越过最低点，甚至发散 |
| `alpha` 合适 | 能较稳定地下降到局部最小值 |

即使 `alpha` 固定不变，接近最低点时，导数会越来越小，所以每次更新的幅度也会自然变小。

## 2.7 梯度下降的线性回归

现在把梯度下降应用到线性回归的平方误差代价函数上。

线性回归假设函数：

$$
h_\theta(x) = \theta_0 + \theta_1 x
$$

代价函数：

$$
\begin{aligned}
J(\theta_0, \theta_1)
&= \frac{1}{2m}
\sum_{i=1}^{m}
\left(h_\theta(x^{(i)}) - y^{(i)}\right)^2
\end{aligned}
$$

求偏导后得到：

$$
\begin{aligned}
\frac{\partial}{\partial \theta_0}J(\theta_0,\theta_1)
&= \frac{1}{m}\sum_{i=1}^{m}
\left(h_\theta(x^{(i)}) - y^{(i)}\right)
\end{aligned}
$$

$$
\begin{aligned}
\frac{\partial}{\partial \theta_1}J(\theta_0,\theta_1)
&= \frac{1}{m}\sum_{i=1}^{m}
\left(h_\theta(x^{(i)}) - y^{(i)}\right)x^{(i)}
\end{aligned}
$$

所以线性回归的梯度下降算法是：

$$
\begin{aligned}
\theta_0
&\leftarrow \theta_0 - \alpha \frac{1}{m}
\sum_{i=1}^{m}
\left(h_\theta(x^{(i)}) - y^{(i)}\right)
\end{aligned}
$$

$$
\begin{aligned}
\theta_1
&\leftarrow \theta_1 - \alpha \frac{1}{m}
\sum_{i=1}^{m}
\left(h_\theta(x^{(i)}) - y^{(i)}\right)x^{(i)}
\end{aligned}
$$

并且 `theta_0` 和 `theta_1` 仍然要同步更新。

课程把这种方法叫做批量梯度下降。这里的“批量”表示：每次更新参数时，都用到了全部 `m` 个训练样本。

后面还会学到其他梯度下降变体，它们可能不会每一步都使用完整训练集。
