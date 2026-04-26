# Transformer

## 一句话理解

Transformer 用自注意力机制建模序列中不同位置之间的依赖关系。

## 自注意力

自注意力让序列中的每个位置都能关注其他位置的信息。

## Q、K、V

- Query：查询向量。
- Key：键向量。
- Value：值向量。

## 多头注意力

多头注意力允许模型从不同表示子空间关注不同位置的信息。

## 常考点

- 自注意力的核心作用是捕捉序列中不同元素之间的依赖关系。
- Transformer 的长序列瓶颈是 `O(N^2)` 复杂度。
- Masked Self-Attention 用于防止解码器看到未来信息。
- Reformer 通过 LSH Attention 缓解长序列复杂度问题。
