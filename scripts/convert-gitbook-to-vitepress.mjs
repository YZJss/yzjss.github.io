import fs from 'node:fs'
import path from 'node:path'
import { load } from 'cheerio'
import TurndownService from 'turndown'

const root = process.cwd()
const outDir = path.join(root, 'docs', 'blog')

const pages = [
  ['C++.html', 'cpp', 'C++'],
  ['STL.html', 'stl', 'STL'],
  ['计算机网络.html', 'network', '计算机网络'],
  ['操作系统.html', 'os', '操作系统'],
  ['数据库.html', 'database', '数据库'],
  ['Linux常用命令.html', 'linux-commands', 'Linux 常用命令'],
  ['SQL.html', 'sql', 'SQL'],
  ['剑指offer.html', 'offer', '剑指 Offer'],
  ['排序算法.html', 'sorting', '排序算法'],
  ['WebServer.html', 'webserver', 'WebServer'],
  ['RPC.html', 'rpc', 'RPC'],
  ['GPT.html', 'gpt', 'GPT'],
  ['服务器防止暴力破解.html', 'server-security', '服务器防止暴力破解'],
  ['Vultr配置Shadowsocks.html', 'shadowsocks', 'Vultr 配置 Shadowsocks']
]

const turndown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-'
})

turndown.addRule('fencedCodeWithLanguage', {
  filter: ['pre'],
  replacement(content, node) {
    const code = node.querySelector('code')
    const className = code?.getAttribute('class') || ''
    let language = className.replace(/^lang-/, '').replace(/^language-/, '').toLowerCase()
    if (language === 'mysql') language = 'sql'
    const text = code?.textContent ?? node.textContent ?? ''
    return `\n\n\`\`\`${language}\n${text.replace(/\n+$/, '')}\n\`\`\`\n\n`
  }
})

fs.mkdirSync(outDir, { recursive: true })

for (const [fileName, slug, title] of pages) {
  const source = path.join(root, fileName)
  const html = fs.readFileSync(source, 'utf8')
  const $ = load(html, { decodeEntities: false })
  const section = $('section.normal.markdown-section')

  section.find('#anchor-navigation-ex-navbar').remove()
  section.find('#anchorNavigationExGoTop').remove()
  section.find('a.anchor-navigation-ex-anchor').remove()
  section.find('script, style').remove()

  let markdown = turndown.turndown(section.html() || '')
  markdown = markdown
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\\\[/g, '[')
    .replace(/\\\]/g, ']')
    .trim()

  if (!markdown.startsWith('# ')) {
    markdown = `# ${title}\n\n${markdown}`
  }

  fs.writeFileSync(path.join(outDir, `${slug}.md`), `${markdown}\n`, 'utf8')
}

const index = `# 原博客文章

${pages.map(([, slug, title]) => `- [${title}](/blog/${slug})`).join('\n')}
`

fs.writeFileSync(path.join(outDir, 'index.md'), index, 'utf8')

console.log(`Converted ${pages.length} pages to ${path.relative(root, outDir)}`)
