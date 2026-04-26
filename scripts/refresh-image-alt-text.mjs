import fs from 'node:fs'
import path from 'node:path'

const blogDir = path.join(process.cwd(), 'docs', 'blog')
const pattern = /!\[([^\]]*)\]\((https:\/\/cdn\.jsdelivr\.net\/gh\/YZJss\/tuchuang@main\/images\/[^)]+)\)/g

function titleFromUrl(url) {
  const file = decodeURI(url.split('/').pop().split(/[?#]/)[0])
  const base = file.replace(/\.[^.]+$/, '')
  return base
    .replace(/-/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase())
}

for (const file of fs.readdirSync(blogDir).filter(file => file.endsWith('.md'))) {
  const fullPath = path.join(blogDir, file)
  const original = fs.readFileSync(fullPath, 'utf8')
  const next = original.replace(pattern, (_match, _alt, url) => `![${titleFromUrl(url)}](${url})`)
  if (next !== original) fs.writeFileSync(fullPath, next, 'utf8')
}

console.log('Updated image alt text')
