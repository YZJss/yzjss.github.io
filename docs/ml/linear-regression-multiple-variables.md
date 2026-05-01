# 第 4 章 多变量线性回归

多变量线性回归是在单变量线性回归的基础上，引入多个特征。例如预测房价时，不只看面积，还可以同时考虑房间数、楼层、房龄等。

## 4.1 多维特征

单变量线性回归只有一个特征。多变量线性回归有多个特征，通常记作 x<sub>1</sub>, x<sub>2</sub>, ..., x<sub>n</sub>。

新增符号：

| 符号 | 含义 |
| --- | --- |
| `n` | 特征数量 |
| x<sup>(i)</sup> | 第 `i` 个训练样本，是一个向量 |
| x<sub>j</sub><sup>(i)</sup> | 第 `i` 个训练样本的第 `j` 个特征 |

例如某个房屋样本可以写成：

$$
x^{(2)} =
\begin{bmatrix}
1416 \\
3 \\
2 \\
40
\end{bmatrix}
$$

多变量线性回归的假设函数：

$$
h_\theta(x)
= \theta_0 + \theta_1 x_1 + \theta_2 x_2 + \cdots + \theta_n x_n
$$

为了让公式更统一，可以引入 x<sub>0</sub> = 1：

$$
h_\theta(x)
= \theta_0 x_0 + \theta_1 x_1 + \theta_2 x_2 + \cdots + \theta_n x_n
$$

此时参数 θ 和样本 `x` 都可以看作向量，假设函数可以写成：

$$
h_\theta(x) = \theta^T x
$$

## 4.2 多变量梯度下降

多变量线性回归的代价函数仍然是所有训练样本预测误差的平方和：

$$
\begin{aligned}
J(\theta_0,\theta_1,\ldots,\theta_n)
&= \frac{1}{2m}
\sum_{i=1}^{m}
\left(h_\theta(x^{(i)}) - y^{(i)}\right)^2
\end{aligned}
$$

其中：

$$
h_\theta(x)
= \theta^T x
= \theta_0 + \theta_1x_1 + \theta_2x_2 + \cdots + \theta_nx_n
$$

目标仍然是找到一组参数，让代价函数最小。

批量梯度下降的更新规则：

$$
\theta_j
\leftarrow
\theta_j
- \alpha
\frac{1}{m}
\sum_{i=1}^{m}
\left(h_\theta(x^{(i)}) - y^{(i)}\right)x_j^{(i)}
$$

其中 `j = 0, 1, ..., n`。

展开来看：

$$
\begin{aligned}
\theta_0
&\leftarrow
\theta_0 - \alpha
\frac{1}{m}
\sum_{i=1}^{m}
\left(h_\theta(x^{(i)}) - y^{(i)}\right)x_0^{(i)}
\\
\theta_1
&\leftarrow
\theta_1 - \alpha
\frac{1}{m}
\sum_{i=1}^{m}
\left(h_\theta(x^{(i)}) - y^{(i)}\right)x_1^{(i)}
\\
\theta_2
&\leftarrow
\theta_2 - \alpha
\frac{1}{m}
\sum_{i=1}^{m}
\left(h_\theta(x^{(i)}) - y^{(i)}\right)x_2^{(i)}
\end{aligned}
$$

实现时从一组初始参数开始，计算预测结果和误差，再同步更新所有参数，不断重复直到收敛。

Python 中计算代价函数的示例：

```python
def computeCost(X, y, theta):
    inner = np.power(((X * theta.T) - y), 2)
    return np.sum(inner) / (2 * len(X))
```

## 4.3 梯度下降法实践 1：特征缩放

多变量问题中，不同特征的取值范围可能差异很大。例如房屋面积可能在 `0` 到 `2000`，房间数量可能在 `0` 到 `5`。

如果特征尺度差别太大，代价函数的等高线会很扁，梯度下降可能需要很多次迭代才能收敛。

解决方法是做特征缩放，让不同特征尽量落在相近范围内，常见目标范围是 `-1` 到 `1`。

常用做法是均值归一化：

$$
x_n
=
\frac{x_n - \muₙ}{s_n}
$$

其中：

- `μ<sub>n</sub>` 是第 `n` 个特征的平均值。
- s<sub>n</sub> 通常可以取第 `n` 个特征的标准差或取值范围。

## 4.4 梯度下降法实践 2：学习率

梯度下降需要多少次迭代才能收敛，不能提前准确知道。通常可以画出迭代次数和代价函数的关系图，观察代价函数是否持续下降并趋于平稳。

如果学习率 α 太小，收敛会很慢。

如果学习率 α 太大，每次迭代可能无法降低代价函数，甚至越过局部最小值导致发散。

课程中建议可以尝试这些学习率：

```text
0.01, 0.03, 0.1, 0.3, 1, 3, 10
```

调学习率时，要观察 J(θ) 是否随着迭代次数下降。如果 J(θ) 上升或震荡，通常说明学习率过大。

## 4.5 特征和多项式回归

有时原始特征可以重新组合成更有意义的特征。

例如房价预测中，房子的临街宽度和纵向深度可以组合成面积：

```text
area = frontage * depth
```

这样就可以用面积作为一个新的特征。

线性模型并不适用于所有数据。有时需要用曲线拟合数据，例如二次模型或三次模型：

$$
h_\theta(x)
= \theta_0 + \theta_1x_1 + \theta_2x_2^2
$$

$$
h_\theta(x)
= \theta_0 + \theta_1x_1 + \theta_2x_2^2 + \theta_3x_3^3
$$

也可以根据房价随面积变化的形状，选择类似下面的模型：

$$
h_\theta(x)
= \theta_0 + \theta_1(size) + \theta_2(size)^2
$$

或者：

$$
h_\theta(x)
= \theta_0 + \theta_1(size) + \theta_2\sqrt{size}
$$

如果使用多项式回归，特征缩放会更重要。因为平方、立方后的特征尺度可能变得非常大。
