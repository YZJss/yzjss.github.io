import fs from 'node:fs'
import path from 'node:path'

const repoRoot = process.cwd()
const imageRoot = 'C:/Users/YZJ/Desktop/tuchuang'
const blogDir = path.join(repoRoot, 'docs', 'blog')
const baseUrl = 'https://cdn.jsdelivr.net/gh/YZJss/tuchuang@main'

const renames = {
  'images/cpp/c-plus-plus-内存分布模型.png': 'images/cpp/cpp-memory-layout.png',
  'images/cpp/移动语义的原理.png': 'images/cpp/move-semantics.png',
  'images/cpp/image-20210909102027074.png': 'images/cpp/diamond-inheritance.png',
  'images/cpp/image-20210909102539106.png': 'images/cpp/virtual-inheritance.png',
  'images/cpp/image-20210909102606304.png': 'images/cpp/iostream-diamond-inheritance.png',
  'images/database/一条sql语句在数据库框架中的执行流程.png': 'images/database/sql-execution-flow.png',
  'images/database/image-20230826160127383.png': 'images/database/b-tree.png',
  'images/linux/chmod-权限.png': 'images/linux/chmod-permission.png',
  'images/network/image-20230224151105745.png': 'images/network/tcp-header.png',
  'images/network/image-20220914145846758.png': 'images/network/tcp-three-way-handshake.png',
  'images/network/image-20220914154745203.png': 'images/network/tcp-four-way-wave.png',
  'images/network/image-20230224174931014.png': 'images/network/tcp-state-transition.png',
  'images/network/image-20230227100725672.png': 'images/network/http-methods.png',
  'images/network/image-20230227100800953.png': 'images/network/http-status-codes.png',
  'images/network/https的通信建立过程.png': 'images/network/https-handshake.png',
  'images/network/mtu和mss分别是什么.png': 'images/network/mtu-mss.png',
  'images/os/image-20210912191907237.png': 'images/os/process-state-transition.png',
  'images/rpc/image-20220814221421663.png': 'images/rpc/rpc-overview.png',
  'images/rpc/image-20220815133628010.png': 'images/rpc/rpc-flow-01.png',
  'images/rpc/image-20220815184439376.png': 'images/rpc/rpc-flow-02.png',
  'images/rpc/image-20220815120520672.png': 'images/rpc/rpc-message-header.png',
  'images/sorting/6-归并排序.jpeg': 'images/sorting/merge-sort.jpeg',
  'images/sql/image-20230218182106153.png': 'images/sql/sql-execution-order.png',
  'images/stl/image-20210910184701486.png': 'images/stl/vector-capacity.png',
  'images/stl/image-20210910211801644.png': 'images/stl/list-structure.png',
  'images/webserver/image-20230329161251178.png': 'images/webserver/proactor-workflow.png',
  'images/webserver/v2-ab874df7219895195def55a02fb390f7-1440w.webp': 'images/webserver/threadpool-structure.webp',
  'images/webserver/http-conn-h.png': 'images/webserver/http-connection-header.png',
  'images/webserver/v2-50f8a9c898447e79c04810883e7ed332-1440w.webp': 'images/webserver/timer-list.webp'
}

const applied = []

for (const [from, to] of Object.entries(renames)) {
  const source = path.join(imageRoot, from)
  const target = path.join(imageRoot, to)
  if (!fs.existsSync(source)) continue
  fs.mkdirSync(path.dirname(target), { recursive: true })
  if (fs.existsSync(target)) {
    throw new Error(`Target already exists: ${to}`)
  }
  fs.renameSync(source, target)
  applied.push({ from, to })
}

const mdFiles = fs.readdirSync(blogDir)
  .filter(file => file.endsWith('.md'))
  .map(file => path.join(blogDir, file))

for (const file of mdFiles) {
  let content = fs.readFileSync(file, 'utf8')
  for (const { from, to } of applied) {
    content = content.split(`${baseUrl}/${from}`).join(`${baseUrl}/${to}`)
    content = content.split(`${baseUrl}//${from}`).join(`${baseUrl}/${to}`)
  }
  fs.writeFileSync(file, content, 'utf8')
}

const manifestPath = path.join(repoRoot, 'scripts', 'tuchuang-refine-manifest.json')
fs.writeFileSync(manifestPath, JSON.stringify({
  generatedAt: new Date().toISOString(),
  renamed: applied
}, null, 2), 'utf8')

console.log(`Renamed ${applied.length} images`)
console.log(`Manifest: ${path.relative(repoRoot, manifestPath)}`)
