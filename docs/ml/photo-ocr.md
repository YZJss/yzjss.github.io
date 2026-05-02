# 第 18 章 Transformer 与注意力机制

讲 self-attention、QKV、多头注意力、位置编码、Encoder/Decoder、Masked Attention、残差和长序列复杂度。

## 学习主线

本章在整套笔记中的作用是把相关知识点放到同一个框架里，先理解它解决什么问题，再理解模型或方法如何工作，最后记住考试和工程中容易混淆的点。

## 核心内容

- 自注意力用于捕捉序列中不同元素之间的依赖关系。
- Q、K、V 通常由上一层输出线性变换得到。
- 多头注意力允许模型在不同表示子空间关注不同位置。
- Masked Self-Attention 防止解码器看到未来信息。
- 标准注意力复杂度为 O(n^2)，长序列是瓶颈。

## 关键公式

$\text{Attention}(Q,K,V)=\text{softmax}(\frac{QK^T}{\sqrt{d_k}})V$

## 考点覆盖

- 自注意力
- Q/K/V
- 多头注意力
- 位置编码
- Masked Self-Attention
- Reformer/LSH

## 和其他章节的关系

第 18 章只讲 Transformer 结构，BERT/GPT/预训练放在第 22、23 章。
