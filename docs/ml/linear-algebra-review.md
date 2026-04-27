# 第 3 章 线性代数回顾

这一章回顾机器学习里会用到的基础线性代数知识，主要包括矩阵、向量、矩阵运算、逆矩阵和转置。

## 3.1 矩阵和向量

矩阵可以理解成按行和列排列的一组数。

一个 `m x n` 的矩阵表示它有 `m` 行、`n` 列。例如一个 `4 x 2` 的矩阵：

$$
A =
\begin{bmatrix}
1402 & 191 \\
1371 & 821 \\
949 & 1437 \\
147 & 1448
\end{bmatrix}
$$

矩阵的维数就是：

```text
行数 x 列数
```

矩阵元素通常写作 `A_ij`，表示矩阵 `A` 中第 `i` 行、第 `j` 列的元素。

向量是一种特殊的矩阵。课程里的向量一般指列向量，例如：

$$
y =
\begin{bmatrix}
460 \\
232 \\
315 \\
178
\end{bmatrix}
$$

这个向量有 `4` 行 `1` 列，所以也可以说它是一个 `4` 维列向量。

课程中一般使用 `1` 索引，也就是第一个元素写作 `y_1`，而不是 `y_0`。

## 3.2 加法和标量乘法

矩阵加法要求两个矩阵的行数和列数完全相同。

例如两个 `2 x 2` 矩阵相加：

$$
\begin{bmatrix}
1 & 2 \\
3 & 4
\end{bmatrix}
+
\begin{bmatrix}
5 & 6 \\
7 & 8
\end{bmatrix}
=
\begin{bmatrix}
6 & 8 \\
10 & 12
\end{bmatrix}
$$

标量乘法是用一个普通数去乘矩阵中的每一个元素。

例如：

$$
3
\begin{bmatrix}
1 & 2 \\
3 & 4
\end{bmatrix}
=
\begin{bmatrix}
3 & 6 \\
9 & 12
\end{bmatrix}
$$

矩阵也可以和标量做除法，本质上就是每个元素都除以这个标量。

## 3.3 矩阵向量乘法

一个 `m x n` 的矩阵乘以一个 `n x 1` 的向量，结果是一个 `m x 1` 的向量。

维度关系：

```text
(m x n) * (n x 1) = (m x 1)
```

例子：

$$
\begin{bmatrix}
1 & 3 \\
4 & 0 \\
2 & 1
\end{bmatrix}
\begin{bmatrix}
1 \\
5
\end{bmatrix}
=
\begin{bmatrix}
1 \times 1 + 3 \times 5 \\
4 \times 1 + 0 \times 5 \\
2 \times 1 + 1 \times 5
\end{bmatrix}
=
\begin{bmatrix}
16 \\
4 \\
7
\end{bmatrix}
$$

计算时，矩阵的每一行分别和向量做乘加运算，得到结果向量中的一个元素。

## 3.4 矩阵乘法

矩阵乘法的维度规则是：

```text
(m x n) * (n x o) = (m x o)
```

也就是说，左边矩阵的列数必须等于右边矩阵的行数。

例如：

$$
\begin{bmatrix}
1 & 3 \\
2 & 4
\end{bmatrix}
\begin{bmatrix}
5 & 6 \\
7 & 8
\end{bmatrix}
=
\begin{bmatrix}
1 \times 5 + 3 \times 7 & 1 \times 6 + 3 \times 8 \\
2 \times 5 + 4 \times 7 & 2 \times 6 + 4 \times 8
\end{bmatrix}
=
\begin{bmatrix}
26 & 30 \\
38 & 44
\end{bmatrix}
$$

可以把矩阵乘法理解为：左矩阵的每一行，分别和右矩阵的每一列做乘加。

## 3.5 矩阵乘法的性质

矩阵乘法不满足交换律。

$$
A B \ne B A
$$

矩阵乘法满足结合律。

$$
A(BC) = (AB)C
$$

单位矩阵在矩阵乘法中的作用类似普通乘法里的 `1`。单位矩阵一般记作 `I`，它是一个方阵，主对角线元素全是 `1`，其他位置全是 `0`。

例如 `3 x 3` 单位矩阵：

$$
I =
\begin{bmatrix}
1 & 0 & 0 \\
0 & 1 & 0 \\
0 & 0 & 1
\end{bmatrix}
$$

对于单位矩阵，有：

$$
AI = IA = A
$$

## 3.6 逆、转置

### 逆矩阵

如果矩阵 `A` 是一个方阵，并且存在逆矩阵，那么它的逆矩阵记作 `A^{-1}`。

逆矩阵满足：

$$
AA^{-1} = A^{-1}A = I
$$

课程中提到，实际计算逆矩阵时，一般可以交给 Octave 或 MATLAB 这类工具完成。

### 转置

设 `A` 是一个 `m x n` 矩阵，它的转置记作 `A^T`，转置后的矩阵维度会变成 `n x m`。

转置的直观理解：把矩阵沿左上到右下方向翻转，原来的行变成列，原来的列变成行。

例如：

$$
\begin{bmatrix}
a & b \\
c & d \\
e & f
\end{bmatrix}^{T}
=
\begin{bmatrix}
a & c & e \\
b & d & f
\end{bmatrix}
$$

转置的基本性质：

$$
(A \pm B)^T = A^T \pm B^T
$$

$$
(AB)^T = B^T A^T
$$

$$
(A^T)^T = A
$$

$$
(kA)^T = kA^T
$$

在 MATLAB 中，矩阵转置可以用一撇表示，例如：

```matlab
x = y'
```
