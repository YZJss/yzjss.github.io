import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: 'YZJ 的学习笔记',
  description: '机器学习、深度学习与工程实践笔记',
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    logo: '/morty.ico',
    siteTitle: 'YZJ Notes',
    nav: [
      { text: '首页', link: '/' },
      { text: '机器学习', link: '/machine-learning/' },
      { text: '旧版 GitBook', link: '/legacy/' },
      { text: 'GitHub', link: 'https://github.com/YZJss/yzjss.github.io' }
    ],
    sidebar: {
      '/machine-learning/': [
        {
          text: '机器学习笔记',
          items: [
            { text: '学习路线', link: '/machine-learning/' },
            { text: '机器学习基础', link: '/machine-learning/basics' },
            { text: '监督学习', link: '/machine-learning/supervised-learning' },
            { text: '神经网络基础', link: '/machine-learning/neural-network' },
            { text: '优化与正则化', link: '/machine-learning/optimization-regularization' },
            { text: 'CNN 卷积神经网络', link: '/machine-learning/cnn' },
            { text: 'RNN 与 LSTM', link: '/machine-learning/rnn-lstm' },
            { text: 'Transformer', link: '/machine-learning/transformer' },
            { text: '贝叶斯方法', link: '/machine-learning/bayesian' },
            { text: '生成模型', link: '/machine-learning/generative-models' },
            { text: 'GNN 图神经网络', link: '/machine-learning/gnn' },
            { text: '大模型与 Agent', link: '/machine-learning/llm-agent' },
            { text: 'PyTorch 实战', link: '/machine-learning/pytorch' },
            { text: '考试题整理', link: '/machine-learning/exam-review' }
          ]
        }
      ],
      '/legacy/': [
        {
          text: '旧版页面入口',
          items: [
            { text: '旧版首页说明', link: '/legacy/' }
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
