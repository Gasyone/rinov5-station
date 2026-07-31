import fs from 'fs';
import path from 'path';

const DOCS_DIR = path.resolve('docs/00-business');

// Từ khóa bị cấm trong nội dung nghiệp vụ
const FORBIDDEN_WORDS = [
  { regex: /\bapi\b/gi, replacement: "máy chủ / hệ thống" },
  { regex: /\bbackend\b/gi, replacement: "máy chủ / hệ thống" },
  { regex: /\bfrontend\b/gi, replacement: "giao diện" },
  { regex: /\bcss\b/gi, replacement: "thiết kế trực quan / kiểu hiển thị" },
  { regex: /\bjson\b/gi, replacement: "gói dữ liệu / dữ liệu phản hồi" },
  { regex: /\bsupabase\b/gi, replacement: "cơ sở dữ liệu" },
  { regex: /\bpadding\b/gi, replacement: "khoảng cách lề" },
  { regex: /\bmargin\b/gi, replacement: "khoảng cách lề" },
  { regex: /\bcsdl\b/gi, replacement: "cơ sở dữ liệu" }
];

function lintFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const errors = [];

  const fileName = path.basename(filePath);
  const isUS = fileName.startsWith('US-');

  let inFrontmatter = false;
  let frontmatterLinesCount = 0;
  let inCodeBlock = false;
  let inSection3 = false;
  let inSection4 = false;
  let inSection5 = false;
  
  let section5Content = [];
  let acBlocks = [];
  let currentAc = null;

  // Trạng thái theo dõi bảng dữ liệu
  let inTable = false;
  let tableHeaderCols = [];
  let isFieldTable = false;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();
    const lineNum = i + 1;

    // Quản lý khối Frontmatter
    if (line === '---') {
      if (frontmatterLinesCount === 0) {
        inFrontmatter = true;
        frontmatterLinesCount++;
        continue;
      } else if (inFrontmatter) {
        inFrontmatter = false;
        continue;
      }
    }

    if (inFrontmatter) continue;

    // Quản lý khối code (Mermaid, code block)
    if (line.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }

    if (inCodeBlock) continue;

    // Xác định Section hiện tại
    if (line.startsWith('## ')) {
      inSection3 = line.includes('3. GIAO DIỆN') || line.includes('3. CẤU TRÚC');
      inSection4 = line.includes('4. KHỐI CHỨC NĂNG');
      inSection5 = line.includes('5. CÁC TRƯỜNG HỢP') || line.includes('5. Các trường hợp');
    }

    // 1. Kiểm tra Từ cấm (Jargon & Forbidden Words Validation)
    // Bỏ qua dòng blockquote chứa các cảnh báo hoặc ví dụ nghiệp vụ
    if (!line.startsWith('>')) {
      // Loại bỏ các đường dẫn liên kết URL để tránh báo lỗi oan trong link figma
      const cleanedLine = line.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1');
      
      for (const rule of FORBIDDEN_WORDS) {
        if (rule.regex.test(cleanedLine)) {
          errors.push({
            line: lineNum,
            message: `Vi phạm quy tắc ngôn ngữ tự nhiên [POLICY-DS-05]: Phát hiện từ cấm "${cleanedLine.match(rule.regex)[0]}". Đề xuất thay thế bằng "${rule.replacement}".`
          });
        }
      }
    }

    // 2. Kiểm tra cấu trúc Bảng mô tả UI (US-*)
    if (isUS && inSection3) {
      if (line.startsWith('|')) {
        // Đọc các cột của dòng
        const cols = line.split('|').map(col => col.trim()).filter((col, idx, arr) => {
          if (idx === 0 && col === '') return false;
          if (idx === arr.length - 1 && col === '') return false;
          return true;
        });

        if (!inTable) {
          // Bắt đầu một bảng mới
          inTable = true;
          tableHeaderCols = cols;
          // Xác định bảng này có phải là bảng mô tả trường thông tin / UI không
          const headerStr = cols.join(' ');
          isFieldTable = /mobile|di\s+động|co\s+giãn/i.test(headerStr);
        } else {
          // Dòng phân cách |---|---|
          if (line.includes('---')) continue;

          // Nếu là bảng mô tả UI, kiểm tra số lượng cột tương ứng
          if (isFieldTable) {
            const hasRequiredField = tableHeaderCols.some(h => /bắt\s+buộc/i.test(h));
            const expectedCols = hasRequiredField ? 6 : 5;

            if (cols.length !== expectedCols) {
              errors.push({
                line: lineNum,
                message: `Bảng dữ liệu mô tả giao diện tĩnh phải có đúng ${expectedCols} cột (Hiện tại có ${cols.length} cột). Tiêu đề bảng phát hiện: [${tableHeaderCols.join(' | ')}]`
              });
            }
          }
        }
      } else {
        // Kết thúc một bảng
        inTable = false;
        isFieldTable = false;
        tableHeaderCols = [];
      }
    }

    // 3. Thu thập dữ liệu AC trong Section 4 (US-*)
    if (isUS && inSection4) {
      const acMatch = line.match(/(?:AC-\d+|Tiêu chí nghiệm thu \d+)/i);
      if (acMatch) {
        if (currentAc) {
          acBlocks.push(currentAc);
        }
        currentAc = {
          name: acMatch[0],
          line: lineNum,
          text: []
        };
      } else if (currentAc) {
        // Thu thập các dòng tiếp theo cho đến khi gặp AC mới hoặc hết Section 4
        currentAc.text.push(line);
      }
    }

    // 4. Thu thập nội dung Section 5 (US-*)
    if (isUS && inSection5) {
      if (line.startsWith('-') || line.startsWith('*')) {
        section5Content.push({
          line: lineNum,
          text: line
        });
      }
    }
  }

  // Đẩy AC cuối cùng vào danh sách
  if (currentAc) {
    acBlocks.push(currentAc);
  }

  // Kiểm tra AC validation (US-*)
  if (isUS) {
    acBlocks.forEach(ac => {
      const fullText = ac.text.join(' ');
      const hasGiven = /giả\s+sử|given/i.test(fullText);
      const hasWhen = /khi|when/i.test(fullText);
      const hasThen = /thì|then/i.test(fullText);

      if (!hasGiven || !hasWhen || !hasThen) {
        const missing = [];
        if (!hasGiven) missing.push('"Giả sử" (Given)');
        if (!hasWhen) missing.push('"Khi" (When)');
        if (!hasThen) missing.push('"Thì" (Then)');
        errors.push({
          line: ac.line,
          message: `Tiêu chí nghiệm thu "${ac.name}" thiếu định dạng logic: thiếu ${missing.join(', ')}.`
        });
      }
    });

    // Kiểm tra Corner Cases (US-*)
    const hasSection5Header = lines.some(l => l.trim().startsWith('## 5. CÁC TRƯỜNG HỢP') || l.trim().startsWith('## 5. Các trường hợp'));
    if (!hasSection5Header) {
      errors.push({
        line: 1,
        message: `Thiếu mục "## 5. CÁC TRƯỜNG HỢP GÓC CẠNH (CORNER CASES)" ở cấu trúc User Story.`
      });
    } else if (section5Content.length < 5) {
      errors.push({
        line: 1,
        message: `Mục Các trường hợp góc cạnh (Corner Cases) phải có tối thiểu 5 trường hợp cụ thể (Hiện tại chỉ phát hiện được ${section5Content.length}).`
      });
    }
  }

  return errors;
}

function runLinter() {
  console.log('=== KHỞI CHẠY KIỂM TRA CHẤT LƯỢNG TÀI LIỆU (DOC LINTER) ===');
  
  if (!fs.existsSync(DOCS_DIR)) {
    console.error(`Không tìm thấy thư mục tài liệu nghiệp vụ: ${DOCS_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(DOCS_DIR)
    .filter(f => f.endsWith('.md') && (f.startsWith('BF-') || f.startsWith('US-')));

  let totalErrors = 0;

  files.forEach(file => {
    const filePath = path.join(DOCS_DIR, file);
    const errors = lintFile(filePath);

    if (errors.length > 0) {
      console.error(`\n[LỖI] Tài liệu: docs/00-business/${file}`);
      errors.forEach(err => {
        console.error(`  - Dòng ${err.line}: ${err.message}`);
      });
      totalErrors += errors.length;
    } else {
      console.log(`[OK] Tài liệu: docs/00-business/${file} - Đầy đủ & Hợp lệ.`);
    }
  });

  console.log('\n=== KẾT QUẢ KIỂM TRA ===');
  if (totalErrors > 0) {
    console.error(`Phát hiện tổng cộng ${totalErrors} lỗi chất lượng tài liệu. Vui lòng sửa chữa trước khi đẩy lên Confluence!`);
    process.exit(1);
  } else {
    console.log('Chúc mừng! Tất cả tài liệu đều đạt chuẩn chất lượng 100%.');
    process.exit(0);
  }
}

runLinter();
