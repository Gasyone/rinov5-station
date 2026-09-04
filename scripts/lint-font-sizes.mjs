import fs from 'node:fs';
import path from 'node:path';

const SRC_DIR = path.resolve(process.cwd(), 'src');
const SHOULD_FIX = process.argv.includes('--fix');

// Extensions to check
const EXTENSIONS = new Set(['.tsx', '.ts', '.jsx', '.js']);

// Regex to find text-[Npx] where N < 12
const ARBITRARY_FONT_REGEX = /\btext-\[(\d+)px\]/g;

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(filePath));
    } else {
      const ext = path.extname(filePath);
      if (EXTENSIONS.has(ext)) {
        results.push(filePath);
      }
    }
  }
  return results;
}

let totalViolations = 0;
let filesModified = 0;
const violationsByFile = [];

const allFiles = getFiles(SRC_DIR);

for (const filePath of allFiles) {
  const content = fs.readFileSync(filePath, 'utf8');
  let fileViolations = 0;
  
  const matches = [...content.matchAll(ARBITRARY_FONT_REGEX)];
  const invalidMatches = matches.filter(m => parseInt(m[1], 10) < 12);

  if (invalidMatches.length > 0) {
    fileViolations = invalidMatches.length;
    totalViolations += fileViolations;
    violationsByFile.push({
      file: path.relative(process.cwd(), filePath),
      count: fileViolations,
      sizes: [...new Set(invalidMatches.map(m => m[1]))].sort((a, b) => a - b),
    });

    if (SHOULD_FIX) {
      const newContent = content.replace(ARBITRARY_FONT_REGEX, (match, size) => {
        const numSize = parseInt(size, 10);
        if (numSize < 12) {
          return 'text-xs';
        }
        return match;
      });

      if (newContent !== content) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        filesModified++;
      }
    }
  }
}

console.log('====================================================');
console.log('🔍 Typography Lint Report: Arbitrary Font Size Check');
console.log('====================================================');

if (totalViolations === 0) {
  console.log('✅ Hoàn hảo! Không phát hiện font chữ < 12px (text-[<12px]) nào trong src/.');
  process.exit(0);
}

if (SHOULD_FIX) {
  console.log(`✨ Đã tự động chuyển đổi thành công ${totalViolations} vị trí font < 12px về text-xs (12px) trên ${filesModified} files.`);
  process.exit(0);
} else {
  console.error(`❌ Phát hiện ${totalViolations} vị trí sử dụng font chữ < 12px vi phạm Design System trên ${violationsByFile.length} files:`);
  for (const item of violationsByFile.slice(0, 15)) {
    console.error(`   - ${item.file}: ${item.count} lỗi (font: ${item.sizes.map(s => s + 'px').join(', ')})`);
  }
  if (violationsByFile.length > 15) {
    console.error(`   ... và ${violationsByFile.length - 15} files khác.`);
  }
  console.error('\n💡 Chạy `node scripts/lint-font-sizes.mjs --fix` để tự động chuẩn hóa về `text-xs`.');
  process.exit(1);
}
