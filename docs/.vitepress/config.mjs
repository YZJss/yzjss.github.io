import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: '笔记',
  description: '笔记',
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    logo: '/morty.ico',
    siteTitle: '笔记',
    nav: [
      { text: '首页', link: '/' },
      { text: '笔记', link: '/blog/' },
      { text: '机器学习', link: '/ml/' },
      { text: 'GitHub', link: 'https://github.com/YZJss/yzjss.github.io' }
    ],
    sidebar: {
      '/ml/': [
        {
          text: '机器学习',
          items: [
            { text: '目录', link: '/ml/' },
            { text: '第 1 章 机器学习概述', link: '/ml/basics' },
            { text: '第 2 章 数学基础', link: '/ml/linear-algebra-review' },
            { text: '第 3 章 优化基础', link: '/ml/linear-regression-one-variable' },
            { text: '第 4 章 线性回归', link: '/ml/linear-regression-multiple-variables' },
            { text: '第 5 章 逻辑回归与分类模型', link: '/ml/logistic-regression' },
            { text: '第 6 章 模型评估与泛化', link: '/ml/advice-for-applying-ml' },
            { text: '第 7 章 正则化与模型复杂度', link: '/ml/regularization' },
            { text: '第 8 章 特征工程、特征选择与降维', link: '/ml/dimensionality-reduction' },
            { text: '第 9 章 无监督学习与聚类', link: '/ml/clustering' },
            { text: '第 10 章 概率模型与异常检测', link: '/ml/anomaly-detection' },
            { text: '第 11 章 支持向量机与核方法', link: '/ml/svm' },
            { text: '第 12 章 推荐系统与表示学习', link: '/ml/recommender-systems' },
            { text: '第 13 章 神经网络表示', link: '/ml/neural-networks-representation' },
            { text: '第 14 章 神经网络训练', link: '/ml/neural-networks-learning' },
            { text: '第 15 章 深度学习训练技巧', link: '/ml/deep-learning-basics' },
            { text: '第 16 章 卷积神经网络与视觉任务', link: '/ml/cnn' },
            { text: '第 17 章 序列模型', link: '/ml/sequence-models' },
            { text: '第 18 章 Transformer 与注意力机制', link: '/ml/photo-ocr' },
            { text: '第 19 章 图神经网络', link: '/ml/gnn' },
            { text: '第 20 章 概率图模型、贝叶斯方法与因果推断', link: '/ml/ml-system-design' },
            { text: '第 21 章 生成模型', link: '/ml/generative-models' },
            { text: '第 22 章 迁移学习与预训练模型', link: '/ml/transfer-learning-pretraining' },
            { text: '第 23 章 大模型基础', link: '/ml/transformer' },
            { text: '第 24 章 AI Agent 与应用系统', link: '/ml/ai-agent' },
            { text: '第 25 章 机器学习系统设计与工程实践', link: '/ml/large-scale-ml' },
            { text: '第 26 章 综合复习与考点索引', link: '/ml/conclusion' }
          ]
        }
      ],
      '/blog/': [
        {
          text: '目录',
          items: [
            { text: '文章列表', link: '/blog/' },
            { text: 'C++', link: '/blog/cpp' },
            { text: 'STL', link: '/blog/stl' },
            { text: '计算机网络', link: '/blog/network' },
            { text: '操作系统', link: '/blog/os' },
            { text: '数据库', link: '/blog/database' },
            { text: 'Linux 常用命令', link: '/blog/linux-commands' },
            { text: 'SQL', link: '/blog/sql' },
            { text: '剑指 Offer', link: '/blog/offer' },
            { text: '排序算法', link: '/blog/sorting' },
            { text: 'WebServer', link: '/blog/webserver' },
            { text: 'RPC', link: '/blog/rpc' },
            { text: 'GPT', link: '/blog/gpt' },
            { text: '服务器防止暴力破解', link: '/blog/server-security' },
            { text: 'Vultr 配置 Shadowsocks', link: '/blog/shadowsocks' }
          ]
        }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/YZJss' }
    ],
    search: {
      provider: 'local'
    },
    footer: {
      message: 'Powered by VitePress',
      copyright: 'Copyright © YZJ'
    },
    lastUpdated: {
      text: '最后更新'
    },
    outline: {
      label: '本页目录'
    },
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    darkModeSwitchLabel: '外观',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '返回顶部'
  },
  markdown: {
    math: true
  }
})
