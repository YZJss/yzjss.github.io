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
      { text: 'GitHub', link: 'https://github.com/YZJss/yzjss.github.io' }
    ],
    sidebar: {
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
