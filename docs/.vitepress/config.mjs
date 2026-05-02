import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: '面试笔记',
  description: '面试笔记',
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    logo: '/morty.ico',
    siteTitle: '面试笔记',
    nav: [
      { text: '首页', link: '/' },
      { text: '面试笔记', link: '/blog/' },
      { text: '机器学习', link: '/ml/' },
      { text: 'GitHub', link: 'https://github.com/YZJss/yzjss.github.io' }
    ],
    sidebar: {
      '/ml/': [
        {
          text: '基础概念',
          items: [
            { text: '目录', link: '/ml/' },
            { text: '第 1 章 机器学习概述', link: '/ml/basics' },
            { text: '第 2 章 数学基础', link: '/ml/linear-algebra-review' },
            { text: '第 3 章 模型训练', link: '/ml/linear-regression-one-variable' },
            { text: '第 4 章 模型评估', link: '/ml/advice-for-applying-ml' },
            { text: '第 5 章 正则化', link: '/ml/regularization' }
          ]
        },
        {
          text: '经典机器学习',
          items: [
            { text: '第 6 章 线性回归', link: '/ml/linear-regression-multiple-variables' },
            { text: '第 7 章 逻辑回归', link: '/ml/logistic-regression' },
            { text: '第 8 章 支持向量机', link: '/ml/svm' },
            { text: '第 9 章 聚类', link: '/ml/clustering' },
            { text: '第 10 章 PCA', link: '/ml/dimensionality-reduction' },
            { text: '第 11 章 决策树', link: '/ml/random-forest' }
          ]
        },
        {
          text: '神经网络和深度学习',
          items: [
            { text: '第 12 章 神经网络表示', link: '/ml/neural-networks-representation' },
            { text: '第 13 章 神经网络训练', link: '/ml/neural-networks-learning' },
            { text: '第 14 章 深度学习训练技巧', link: '/ml/deep-learning-basics' },
            { text: '第 15 章 卷积神经网络', link: '/ml/cnn' },
            { text: '第 16 章 序列模型', link: '/ml/sequence-models' },
            { text: '第 17 章 Transformer', link: '/ml/photo-ocr' },
            { text: '第 18 章 图神经网络', link: '/ml/gnn' }
          ]
        },
        {
          text: '现代模型和应用',
          items: [
            { text: '第 19 章 概率图模型', link: '/ml/ml-system-design' },
            { text: '第 20 章 生成模型', link: '/ml/generative-models' },
            { text: '第 21 章 迁移学习', link: '/ml/transfer-learning-pretraining' },
            { text: '第 22 章 Dify 应用和 Agent', link: '/ml/ai-agent' }
          ]
        }
      ],
      '/blog/': [
        {
          text: '面试笔记',
          items: [
            { text: '目录', link: '/blog/' },
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
