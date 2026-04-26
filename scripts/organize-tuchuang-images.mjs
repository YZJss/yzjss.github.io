import fs from 'node:fs'
import path from 'node:path'

const blogRoot = process.cwd()
const imageRoot = 'C:/Users/YZJ/Desktop/tuchuang'
const baseUrl = 'https://cdn.jsdelivr.net/gh/YZJss/tuchuang@main'

const articleLabels = {
  cpp: 'cpp',
  database: 'database',
  'linux-commands': 'linux',
  network: 'network',
  offer: 'offer',
  os: 'os',
  rpc: 'rpc',
  'server-security': 'server-security',
  shadowsocks: 'shadowsocks',
  sorting: 'sorting',
  sql: 'sql',
  stl: 'stl',
  webserver: 'webserver'
}

const manualNames = new Map(Object.entries({
  'image-20210919202217064.png': 'compile-process.png',
  '虚函数表.png': 'virtual-function-table.png',
  'b+tree.png': 'b-plus-tree.png',
  'Btree.png': 'b-tree.png',
  'IMG_2233.PNG': 'network-model-overview.png',
  'TCPIP.png': 'tcp-ip-model.png',
  '截屏2023-08-15 13.43.45.png': 'network-packet-capture.png',
  '2020062815271156.png': 'http-status-code.png',
  'MPRPC.png': 'mprpc-framework.png',
  'ssh.png': 'ssh-login.png',
  '01.png': 'shadowsocks-step-01.png',
  '02.png': 'shadowsocks-step-02.png',
  '03.png': 'shadowsocks-step-03.png',
  'join.jpg': 'sql-join.png',
  'system-call-procedure.png': 'system-call-procedure.png',
  'tinywebserver.jfif': 'tinywebserver.png',
  '640.jpg': 'webserver-epoll-01.jpg',
  '642.jpg': 'webserver-epoll-02.jpg',
  '643.jpg': 'webserver-epoll-03.jpg',
  'skiplist.png': 'skiplist.png',
  'offer04.png': 'offer-04.png',
  'offer55-1.png': 'offer-55-1.png'
}))

function slugify(text, fallback) {
  const cleaned = text
    .replace(/!\[[^\]]*]\([^)]*\)/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/[`*_~[\](){}'"“”‘’：:？?，,。.;；/\\|]+/g, ' ')
    .trim()
    .toLowerCase()
  const ascii = cleaned
    .replace(/\+/g, ' plus ')
    .replace(/#/g, ' sharp ')
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return ascii || fallback
}

function extFromName(name) {
  const ext = path.extname(name)
  if (ext) return ext.toLowerCase()
  return '.png'
}

function getRepoPath(url) {
  let decoded = decodeURI(url)
  decoded = decoded.split(/[?#]/)[0]
  const jsdelivr = decoded.match(/cdn\.jsdelivr\.net\/gh\/YZJss\/tuchuang@main\/(.+)$/)
  if (jsdelivr) return jsdelivr[1]
  const raw = decoded.match(/raw\.githubusercontent\.com\/YZJss\/tuchuang\/main\/(.+)$/)
  if (raw) return raw[1]
  return null
}

function nearestHeading(lines, index) {
  for (let i = index; i >= 0; i--) {
    const m = lines[i].match(/^(#{1,6})\s+(.+)$/)
    if (m) return m[2].trim()
  }
  return ''
}

function uniquePath(target) {
  if (!fs.existsSync(target)) return target
  const dir = path.dirname(target)
  const ext = path.extname(target)
  const base = path.basename(target, ext)
  let i = 2
  while (true) {
    const candidate = path.join(dir, `${base}-${i}${ext}`)
    if (!fs.existsSync(candidate)) return candidate
    i += 1
  }
}

function resolveSource(repoPath) {
  const candidates = [
    path.join(imageRoot, repoPath),
    path.join(imageRoot, path.basename(repoPath))
  ]
  return candidates.find(candidate => fs.existsSync(candidate))
}

const replacements = []
const moves = []
const seenSource = new Map()

const blogDir = path.join(blogRoot, 'docs', 'blog')
for (const file of fs.readdirSync(blogDir).filter(file => file.endsWith('.md') && file !== 'index.md')) {
  const slug = path.basename(file, '.md')
  const articleDir = articleLabels[slug] || slug
  const fullPath = path.join(blogDir, file)
  const content = fs.readFileSync(fullPath, 'utf8')
  const lines = content.split(/\r?\n/)
  const imageRegex = /!\[([^\]]*)\]\((https?:\/\/[^)]+)\)/g

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    let match
    while ((match = imageRegex.exec(lines[lineIndex])) !== null) {
      const [full, alt, url] = match
      const repoPath = getRepoPath(url)
      if (!repoPath) continue
      const source = resolveSource(repoPath)
      if (!source) continue

      if (!seenSource.has(source)) {
        const oldName = path.basename(source)
        const ext = extFromName(oldName)
        const heading = nearestHeading(lines, lineIndex)
        const semanticBase = manualNames.has(oldName)
          ? path.basename(manualNames.get(oldName), path.extname(manualNames.get(oldName)))
          : slugify(alt && alt !== 'img' && alt !== '图片alt' ? alt : heading, `${articleDir}-image`)
        const targetDir = path.join(imageRoot, 'images', articleDir)
        fs.mkdirSync(targetDir, { recursive: true })
        const target = uniquePath(path.join(targetDir, `${semanticBase}${ext}`))
        seenSource.set(source, path.relative(imageRoot, target).replace(/\\/g, '/'))
        moves.push({ source, target })
      }

      const newRepoPath = seenSource.get(source)
      const newUrl = `${baseUrl}/${newRepoPath}`
      replacements.push({ file: fullPath, old: url, next: newUrl, oldRef: full })
    }
  }
}

for (const { source, target } of moves) {
  if (path.resolve(source) === path.resolve(target)) continue
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.renameSync(source, target)
}

const byFile = new Map()
for (const item of replacements) {
  if (!byFile.has(item.file)) byFile.set(item.file, [])
  byFile.get(item.file).push(item)
}

for (const [file, items] of byFile) {
  let content = fs.readFileSync(file, 'utf8')
  for (const item of items) {
    content = content.split(item.old).join(item.next)
  }
  fs.writeFileSync(file, content, 'utf8')
}

const manifestPath = path.join(blogRoot, 'scripts', 'tuchuang-organize-manifest.json')
const manifest = {
  generatedAt: new Date().toISOString(),
  moved: moves.map(item => ({
    from: path.relative(imageRoot, item.source).replace(/\\/g, '/'),
    to: path.relative(imageRoot, item.target).replace(/\\/g, '/')
  })),
  replacements: replacements.map(item => ({
    file: path.relative(blogRoot, item.file).replace(/\\/g, '/'),
    from: item.old,
    to: item.next
  }))
}
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8')

console.log(`Moved ${moves.length} images`)
console.log(`Updated ${replacements.length} markdown image links`)
console.log(`Manifest: ${path.relative(blogRoot, manifestPath)}`)
