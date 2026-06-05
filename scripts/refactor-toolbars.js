const fs = require('fs')
const path = require('path')

const screensDir = path.join(__dirname, 'src', 'components', 'screens')

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f)
    const isDirectory = fs.statSync(dirPath).isDirectory()
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f))
  })
}

const files = []
walkDir(screensDir, (p) => {
  if (p.endsWith('Toolbar.tsx')) {
    files.push(p)
  }
})

let modified = 0
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8')
  
  if (content.includes('bg-background px-4 py-3 lg:px-6')) return
  
  console.log('Needs check:', f)
})
