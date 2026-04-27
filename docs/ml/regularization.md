# 第 7 章 正则化

正则化用于缓解过拟合。它通过惩罚过大的参数，让模型不要为了完全贴合训练集而变得过于复杂。

## 7.1 过拟合的问题

模型可能出现三种情况：

| 情况 | 表现 |
| --- | --- |
| 欠拟合 | 模型太简单，训练集都拟合不好 |
| 合适拟合 | 能较好表示数据规律 |
| 过拟合 | 模型太复杂，把训练集噪声也学进去 |

在线性回归中，如果使用过高阶的多项式，曲线可能穿过几乎所有训练点，但对新样本预测很差。

解决过拟合的常见办法：

- 减少特征数量。
- 使用正则化，保留所有特征但减小参数影响。

## 7.2 代价函数

正则化的想法是：在原来的代价函数后面加上参数惩罚项。

线性回归正则化代价函数：

$$
J(\theta)
=
\frac{1}{2m}
\left[
\sum_{i=1}^{m}
\left(h_\theta(x^{(i)})-y^{(i)}\right)^2
+
\lambda
\sum_{j=1}^{n}
\theta_j^2
\right]
$$

注意：通常不惩罚 `theta_0`。

`lambda` 是正则化参数：

- `lambda` 太小，正则化作用不明显，可能仍然过拟合。
- `lambda` 太大，模型参数被压得太小，可能欠拟合。

## 7.3 正则化线性回归

正则化线性回归中，`theta_0` 和其他参数的更新略有不同。

`theta_0` 不加正则化：

$$
\theta_0
\leftarrow
\theta_0
-
\alpha
\frac{1}{m}
\sum_{i=1}^{m}
\left(h_\theta(x^{(i)})-y^{(i)}\right)x_0^{(i)}
$$

对于 `j >= 1`：

$$
\theta_j
\leftarrow
\theta_j
-
\alpha
\left[
\frac{1}{m}
\sum_{i=1}^{m}
\left(h_\theta(x^{(i)})-y^{(i)}\right)x_j^{(i)}
+
\frac{\lambda}{m}\theta_j
\right]
$$

## 7.4 正则化的逻辑回归模型

逻辑回归也可以加入正则化。

正则化逻辑回归代价函数：

$$
J(\theta)
=
-\frac{1}{m}
\sum_{i=1}^{m}
\left[
y^{(i)}\log(h_\theta(x^{(i)}))
+
(1-y^{(i)})\log(1-h_\theta(x^{(i)}))
\right]
+
\frac{\lambda}{2m}
\sum_{j=1}^{n}
\theta_j^2
$$

同样不惩罚 `theta_0`。

对于 `j >= 1`，梯度更新中会额外多出正则化项：

$$
\frac{\lambda}{m}\theta_j
$$
