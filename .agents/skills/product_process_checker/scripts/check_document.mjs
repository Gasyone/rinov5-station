import fs from 'fs';
import path from 'path';

// ANSI escape codes for coloring
const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

// Forbidden technical words inside business documentation (from POLICY-DS-05)
const FORBIDDEN_WORDS = [
  { regex: /\bapi\b/gi, replacement: "máy chủ / hệ thống / cổng kết nối" },
  { regex: /\bbackend\b/gi, replacement: "máy chủ / hệ thống" },
  { regex: /\bfrontend\b/gi, replacement: "giao diện" },
  { regex: /\bcss\b/gi, replacement: "thiết kế trực quan / kiểu hiển thị" },
  { regex: /\bjson\b/gi, replacement: "gói dữ liệu / dữ liệu phản hồi" },
  { regex: /\bsupabase\b/gi, replacement: "cơ sở dữ liệu" },
  { regex: /\bpadding\b/gi, replacement: "khoảng cách lề / đệm" },
  { regex: /\bmargin\b/gi, replacement: "khoảng cách lề" },
  { regex: /\bcsdl\b/gi, replacement: "cơ sở dữ liệu" },
  { regex: /\bcookie\b/gi, replacement: "phiên làm việc / bộ nhớ tạm" },
  { regex: /\bredirect\b/gi, replacement: "chuyển hướng giao diện" },
  { regex: /\bdom\b/gi, replacement: "thành phần giao diện" },
  { regex: /\bdiv\b/gi, replacement: "khối giao diện / thẻ hiển thị" },
  { regex: /\bcheckbox grid\b/gi, replacement: "bảng ô chọn / lưới hộp kiểm" },
  { regex: /\bfloating panel\b/gi, replacement: "bảng nổi / khung thông tin di động" }
];

// Check if a file was provided
let filePath = '';
let targetGate = 0; // 0 means auto-detect, 1 means Gate 1, 2 means Gate 2

for (let j = 2; j < process.argv.length; j++) {
  const arg = process.argv[j];
  if (arg === '--gate-1' || arg === '--gate1' || arg === '-g1') {
    targetGate = 1;
  } else if (arg === '--gate-2' || arg === '--gate2' || arg === '-g2') {
    targetGate = 2;
  } else if (!arg.startsWith('-')) {
    filePath = arg;
  }
}

if (!filePath) {
  console.log(`${COLORS.red}${COLORS.bold}Lỗi: Vui lòng cung cấp đường dẫn đến file tài liệu cần kiểm tra.${COLORS.reset}`);
  console.log(`Sử dụng: node check_document.mjs <duong_dan_tai_lieu> [--gate-1 | --gate-2]`);
  process.exit(1);
}

const absolutePath = path.resolve(filePath);
if (!fs.existsSync(absolutePath)) {
  console.log(`${COLORS.red}${COLORS.bold}Lỗi: Không tìm thấy file tài liệu tại: ${absolutePath}${COLORS.reset}`);
  process.exit(1);
}

const fileName = path.basename(absolutePath);
const fileContent = fs.readFileSync(absolutePath, 'utf-8');
const lines = fileContent.split('\n');

console.log(`${COLORS.cyan}${COLORS.bold}======================================================================${COLORS.reset}`);
console.log(`${COLORS.cyan}${COLORS.bold}            QUY TRÌNH KIỂM TRA CHẤT LƯỢNG TÀI LIỆU (PRODUCT SPECS)${COLORS.reset}`);
console.log(`${COLORS.cyan}Tài liệu: ${COLORS.bold}${fileName}${COLORS.reset}`);
console.log(`${COLORS.cyan}${COLORS.bold}======================================================================${COLORS.reset}\n`);

// Analyze document type based on filename and header
let docType = 'UNKNOWN';
if (fileName.startsWith('US-')) {
  docType = 'USER_STORY';
} else if (fileName.startsWith('BF-')) {
  docType = 'BUSINESS_FUNCTION';
} else if (fileName.startsWith('CAP-')) {
  docType = 'CAPABILITY';
} else if (fileName.startsWith('FLOW-')) {
  docType = 'FLOW';
}

console.log(`Phân loại tài liệu phát hiện: ${COLORS.bold}${docType}${COLORS.reset}`);

// If gate not specified, auto-detect from frontmatter or filename
let docStatus = 'draft';
let hasStatusMatch = fileContent.match(/status:\s*["']?(\w+)["']?/i);
if (hasStatusMatch) {
  docStatus = hasStatusMatch[1].toLowerCase();
}
if (targetGate === 0) {
  if (docType === 'BUSINESS_FUNCTION' || docType === 'CAPABILITY') {
    targetGate = 1;
  } else if (docStatus === 'ready' || docStatus === 'active' || docStatus === 'approved') {
    targetGate = 2;
  } else {
    targetGate = 2; // Default to Gate 2 for detailed check
  }
}
console.log(`Mục tiêu kiểm duyệt: ${COLORS.bold}Quality Gate ${targetGate}${COLORS.reset} (Trạng thái tài liệu: ${docStatus})\n`);

const issues = [];
const passes = [];

// Track sections and blocks
let inFrontmatter = false;
let frontmatterLinesCount = 0;
let inCodeBlock = false;
let currentSectionHeader = '';

// Content trackers
let hasChangelog = false;
let hasContext = false;
let hasUserFlowMermaid = false;
let hasFeatureScope = false;
let hasUIUXCheck = false;
let hasKPITarget = false;

// Checklist B trackers
let acCount = 0;
let acs = [];
let hasExceptionFlow = false;
let isExceptionFlowNA = false;
let hasValidationRules = false;
let isValidationRulesNA = false;
let hasPermissionMatrix = false;
let isPermissionMatrixNA = false;
let hasNonFunctional = false;
let isNonFunctionalNA = false;
let hasApiSpec = false;
let isApiSpecNA = false;

let openQuestionsCount = 0;
let dependenciesCount = 0;
let cornerCasesCount = 0;

// Scoring Risk Criteria (Standard vs Risk)
let scoreA = false; // System scope >= 2 modules
let scoreB = false; // Financial impact
let scoreC1 = false; // Revamp
let scoreC2 = false; // Unprecedented business
let scoreD = false; // External dependencies

// Read lines for structure
let sectionContent = {};

for (let i = 0; i < lines.length; i++) {
  const rawLine = lines[i];
  const line = rawLine.trim();
  const lineNum = i + 1;

  // Handle Frontmatter
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

  // Handle Code blocks
  if (line.startsWith('```')) {
    inCodeBlock = !inCodeBlock;
    if (line.includes('mermaid')) {
      if (currentSectionHeader.includes('LUỒNG') || currentSectionHeader.includes('FLOW') || currentSectionHeader.includes('NGHIỆP VỤ')) {
        hasUserFlowMermaid = true;
      }
    }
    continue;
  }
  if (inCodeBlock) continue;

  // Track Section Headers (H1 or H2)
  if (line.startsWith('## ') || line.startsWith('# ')) {
    currentSectionHeader = line.toUpperCase();
    sectionContent[currentSectionHeader] = '';
    
    if (currentSectionHeader.includes('CHANGELOG') || currentSectionHeader.includes('NHẬT KÝ')) {
      hasChangelog = true;
    }
    if (currentSectionHeader.includes('CONTEXT') || currentSectionHeader.includes('BỐI CẢNH') || currentSectionHeader.includes('MÔ TẢ TỔNG QUAN')) {
      hasContext = true;
    }
    if (currentSectionHeader.includes('GIAO DIỆN') || currentSectionHeader.includes('UI STATE') || currentSectionHeader.includes('CẤU TRÚC') || currentSectionHeader.includes('THIẾT KẾ')) {
      hasUIUXCheck = true;
    }
    if (currentSectionHeader.includes('NGOẠI LỆ') || currentSectionHeader.includes('EXCEPTION')) {
      hasExceptionFlow = true;
    }
    if (currentSectionHeader.includes('VALIDATION') || currentSectionHeader.includes('KIỂM TRA DỮ LIỆU') || currentSectionHeader.includes('RÀNG BUỘC') || currentSectionHeader.includes('QUY TẮC KIỂM SOÁT')) {
      hasValidationRules = true;
    }
    if (currentSectionHeader.includes('PERMISSION') || currentSectionHeader.includes('PHÂN QUYỀN')) {
      hasPermissionMatrix = true;
    }
    if (currentSectionHeader.includes('PHI CHỨC NĂNG') || currentSectionHeader.includes('NON-FUNCTIONAL')) {
      hasNonFunctional = true;
    }
    if (currentSectionHeader.includes('API') || currentSectionHeader.includes('KẾT NỐI')) {
      hasApiSpec = true;
    }
  }

  // Accumulate text in current section
  if (currentSectionHeader) {
    sectionContent[currentSectionHeader] += ' ' + line.toLowerCase();
  }

  // 1. Forbidden Words Validation (DS-05)
  if (!line.startsWith('>')) { // Skip blockquotes
    const cleanedLine = line.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1'); // clean links
    for (const rule of FORBIDDEN_WORDS) {
      if (rule.regex.test(cleanedLine)) {
        issues.push({
          line: lineNum,
          type: 'LANGUAGE',
          message: `Từ cấm "${cleanedLine.match(rule.regex)[0]}". Nên dùng "${rule.replacement}".`
        });
      }
    }
  }

  // 2. Risk Matrix Detection
  if (line.toLowerCase().includes('database') || line.toLowerCase().includes('kiến trúc') || line.toLowerCase().includes('cơ sở dữ liệu')) {
    if (line.toLowerCase().includes('thay đổi') || line.toLowerCase().includes('thêm bảng') || line.toLowerCase().includes('migration') || line.toLowerCase().includes('cấu trúc bảng')) {
      scoreA = true;
    }
  }
  if (line.toLowerCase().includes('doanh thu') || line.toLowerCase().includes('chi phí') || line.toLowerCase().includes('tài chính') || line.toLowerCase().includes('thanh toán') || line.toLowerCase().includes('hoá đơn')) {
    scoreB = true;
  }
  if (line.toLowerCase().includes('revamp') || line.toLowerCase().includes('làm lại toàn bộ') || line.toLowerCase().includes('tái thiết kế')) {
    scoreC1 = true;
  }
  if (line.toLowerCase().includes('nghiệp vụ mới') || line.toLowerCase().includes('chưa có tiền lệ') || line.toLowerCase().includes('tính năng mới')) {
    scoreC2 = true;
  }
  if (line.toLowerCase().includes('bên thứ 3') || line.toLowerCase().includes('đối tác') || line.toLowerCase().includes('api ngoài') || line.toLowerCase().includes('tích hợp')) {
    scoreD = true;
  }

  // 3. Feature Scope
  if (currentSectionHeader.includes('SCOPE') || currentSectionHeader.includes('PHẠM VI') || currentSectionHeader.includes('DANH SÁCH CHỨC NĂNG') || currentSectionHeader.includes('YÊU CẦU')) {
    if (line.startsWith('|') && (line.toLowerCase().includes('must') || line.toLowerCase().includes('should') || line.toLowerCase().includes('could') || line.toLowerCase().includes('bắt buộc'))) {
      hasFeatureScope = true;
    }
  }

  // 4. KPI Target
  if (line.toLowerCase().includes('kpi') || line.toLowerCase().includes('baseline') || line.toLowerCase().includes('chỉ số đo lường') || line.toLowerCase().includes('mục tiêu đo lường')) {
    hasKPITarget = true;
  }

  // 5. Acceptance Criteria (Given-When-Then)
  const acMatch = line.match(/(?:AC-\d+|Tiêu chí nghiệm thu \d+|AC\s*\d+)/i);
  if (acMatch) {
    acCount++;
    let hasGiven = false;
    let hasWhen = false;
    let hasThen = false;
    let scanIndex = i + 1;
    while (scanIndex < lines.length && !lines[scanIndex].trim().match(/(?:AC-\d+|Tiêu chí nghiệm thu \d+|##)/i)) {
      const scanLine = lines[scanIndex].toLowerCase();
      if (scanLine.includes('giả sử') || scanLine.includes('given')) hasGiven = true;
      if (scanLine.includes('khi') || scanLine.includes('when')) hasWhen = true;
      if (scanLine.includes('thì') || scanLine.includes('then')) hasThen = true;
      scanIndex++;
    }
    acs.push({ name: acMatch[0], line: lineNum, hasGiven, hasWhen, hasThen });
  }

  // 6. Corner Cases Count
  if (currentSectionHeader.includes('CORNER CASES') || currentSectionHeader.includes('TRƯỜNG HỢP GÓC CẠNH')) {
    if (line.startsWith('-') || line.startsWith('*') || line.match(/^\d+\./)) {
      cornerCasesCount++;
    }
  }

  // 7. Open Questions & Dependencies count
  if (line.toLowerCase().includes('open question') || line.toLowerCase().includes('câu hỏi tồn đọng')) {
    if (line.startsWith('-') || line.startsWith('*')) openQuestionsCount++;
  }
  if (line.toLowerCase().includes('dependency') || line.toLowerCase().includes('phụ thuộc')) {
    if (line.startsWith('-') || line.startsWith('*')) dependenciesCount++;
  }
}

// Check for N/A content in sections
const isNA = (text) => {
  if (!text) return false;
  return text.includes('n/a') || text.includes('không áp dụng') || text.includes('none') || text.includes('kế thừa');
};

for (const header in sectionContent) {
  const content = sectionContent[header];
  if (header.includes('NGOẠI LỆ') || header.includes('EXCEPTION')) {
    isExceptionFlowNA = isNA(content);
  }
  if (header.includes('VALIDATION') || header.includes('KIỂM TRA DỮ LIỆU') || header.includes('RÀNG BUỘC') || header.includes('QUY TẮC KIỂM SOÁT')) {
    isValidationRulesNA = isNA(content);
  }
  if (header.includes('PERMISSION') || header.includes('PHÂN QUYỀN')) {
    isPermissionMatrixNA = isNA(content);
  }
  if (header.includes('PHI CHỨC NĂNG') || header.includes('NON-FUNCTIONAL')) {
    isNonFunctionalNA = isNA(content);
  }
  if (header.includes('API') || header.includes('KẾT NỐI')) {
    isApiSpecNA = isNA(content);
  }
}

// Post-scan validations
// Check ACs format
for (const ac of acs) {
  if (!ac.hasGiven || !ac.hasWhen || !ac.hasThen) {
    const missing = [];
    if (!ac.hasGiven) missing.push('"Giả sử" (Given)');
    if (!ac.hasWhen) missing.push('"Khi" (When)');
    if (!ac.hasThen) missing.push('"Thì" (Then)');
    issues.push({
      line: ac.line,
      type: 'AC_FORMAT',
      message: `Tiêu chí nghiệm thu "${ac.name}" thiếu định dạng logic: thiếu ${missing.join(', ')}.`
    });
  } else {
    passes.push({
      type: 'AC_FORMAT',
      message: `Tiêu chí nghiệm thu "${ac.name}" đạt chuẩn logic Giả sử-Khi-Thì.`
    });
  }
}

// -------------------------------------------------------------
// CHECKLIST A AUDIT (Quality Gate 1 - Do the Right Product)
// -------------------------------------------------------------
// For US, some Checklist A items might be inherited from parent BF
const isUSInherited = (docType === 'USER_STORY');

const gate1Checklist = [
  { name: "Vì sao phải làm? (Bối cảnh/Mục tiêu)", status: hasContext },
  { name: "Làm cho ai? (Persona/Use Case)", status: fileContent.toLowerCase().includes('persona') || fileContent.toLowerCase().includes('đối tượng') },
  { name: "Người dùng sử dụng thế nào? (User Flow Mermaid)", status: hasUserFlowMermaid },
  { name: "Business Rules (Quy tắc nghiệp vụ)", status: fileContent.toLowerCase().includes('business rules') || fileContent.toLowerCase().includes('quy tắc nghiệp vụ') || fileContent.toLowerCase().includes('ràng buộc nghiệp vụ') },
  { name: "Feature Scope (Có mã ID, độ ưu tiên Must/Should/Could)", status: hasFeatureScope || (isUSInherited && fileContent.includes('bf: ')) },
  { name: "Thiết kế giao diện dễ dùng? (Vùng giao diện, Figma)", status: hasUIUXCheck },
  { name: "KPI Target (baseline, target, cách đo lường)", status: hasKPITarget || isUSInherited }
];

// Calculate Gate 1 compliance rate
const gate1Passed = gate1Checklist.filter(item => item.status).length;
const gate1Total = gate1Checklist.length;
const gate1Rate = Math.round((gate1Passed / gate1Total) * 100);

// -------------------------------------------------------------
// CHECKLIST B AUDIT (Quality Gate 2 - Do the Product Right)
// -------------------------------------------------------------
const gate2Checklist = [
  { name: "Acceptance Criteria (>= 3 AC, Given-When-Then, Happy/Unhappy)", status: acCount >= 3 || (acCount > 0 && isUSInherited) },
  { name: "Exception Flow (Luồng ngoại lệ: mất mạng, timeout, sai quyền)", status: hasExceptionFlow || isExceptionFlowNA },
  { name: "Validation Rules (Ràng buộc từng trường)", status: hasValidationRules || isValidationRulesNA },
  { name: "Permission (Ma trận phân quyền vai trò)", status: hasPermissionMatrix || isPermissionMatrixNA },
  { name: "Non-functional (Thời gian phản hồi, bảo mật)", status: hasNonFunctional || isNonFunctionalNA },
  { name: "API Specification (Request/Response, mã lỗi)", status: hasApiSpec || isApiSpecNA || fileContent.toLowerCase().includes('api ') },
  { name: "Open Questions = 0 (Không còn câu hỏi tồn đọng)", status: openQuestionsCount === 0 },
  { name: "Dependencies = 0 (Không còn mối phụ thuộc chưa giải quyết)", status: dependenciesCount === 0 }
];

const gate2Passed = gate2Checklist.filter(item => item.status).length;
const gate2Total = gate2Checklist.length;
const gate2Rate = Math.round((gate2Passed / gate2Total) * 100);

// -------------------------------------------------------------
// RISK SCORING ANALYSIS
// -------------------------------------------------------------
let riskScore = 0;
if (scoreA) riskScore++;
if (scoreB) riskScore++;
if (scoreC1) riskScore++;
if (scoreC2) riskScore++;
if (scoreD) riskScore++;

const isRisk = riskScore >= 1;
const classificationLabel = isRisk ? `🔴 Risk (Điểm: ${riskScore}/5)` : '🟢 Standard (Điểm: 0/5)';

// Display Results
console.log(`${COLORS.bold}1. PHÂN LOẠI RỦI RO & PHÊ DUYỆT (RISK LEVEL)${COLORS.reset}`);
console.log(`   - Trạng thái phân loại: ${COLORS.bold}${classificationLabel}${COLORS.reset}`);
console.log(`   - Chi tiết chấm điểm tự động từ nội dung:`);
console.log(`     [${scoreA ? 'x' : ' '}] Tiêu chí A: Phạm vi ảnh hưởng hệ thống (>=2 modules hoặc đổi database)`);
console.log(`     [${scoreB ? 'x' : ' '}] Tiêu chí B: Tác động tài chính (Ảnh hưởng doanh thu, chi phí, vận hành)`);
console.log(`     [${scoreC1 ? 'x' : ' '}] Tiêu chí C1: Loại thay đổi nghiệp vụ (Revamp toàn bộ tính năng)`);
console.log(`     [${scoreC2 ? 'x' : ' '}] Tiêu chí C2: Độ mới nghiệp vụ (Nghiệp vụ mới chưa có tiền lệ)`);
console.log(`     [${scoreD ? 'x' : ' '}] Tiêu chí D: Phụ thuộc bên thứ 3 hoặc API ngoài`);
console.log(`   - Quy trình phê duyệt yêu cầu:`);
if (isRisk) {
  console.log(`     👉 ${COLORS.red}${COLORS.bold}🔴 Nhánh Risk:${COLORS.reset} AI verify xong bắt buộc phải trình duyệt ${COLORS.bold}Project Manager (PM)${COLORS.reset} phê duyệt.`);
} else {
  console.log(`     👉 ${COLORS.green}${COLORS.bold}🟢 Nhánh Standard:${COLORS.reset} AI verify đạt chuẩn chất lượng sẽ ${COLORS.bold}Tự động thông qua (Auto-pass)${COLORS.reset}.`);
}
console.log();

console.log(`${COLORS.bold}2. KIỂM DUYỆT CỔNG CHẤT LƯỢNG 1 (QUALITY GATE 1 - Checklist A)${COLORS.reset}`);
console.log(`   - Tỷ lệ tuân thủ: ${gate1Rate >= 80 ? COLORS.green : COLORS.red}${gate1Rate}% (${gate1Passed}/${gate1Total})${COLORS.reset}`);
gate1Checklist.forEach(item => {
  const symbol = item.status ? `${COLORS.green}✔ Đạt${COLORS.reset}` : `${COLORS.red}✘ Thiếu${COLORS.reset}`;
  console.log(`     [${symbol}] ${item.name}`);
});
console.log();

console.log(`${COLORS.bold}3. KIỂM DUYỆT CỔNG CHẤT LƯỢNG 2 (QUALITY GATE 2 - Checklist B)${COLORS.reset}`);
console.log(`   - Tỷ lệ tuân thủ: ${gate2Rate >= 80 ? COLORS.green : COLORS.red}${gate2Rate}% (${gate2Passed}/${gate2Total})${COLORS.reset}`);
gate2Checklist.forEach(item => {
  const isNAItem = (item.name.includes('Exception') && isExceptionFlowNA) ||
                   (item.name.includes('Validation') && isValidationRulesNA) ||
                   (item.name.includes('Permission') && isPermissionMatrixNA) ||
                   (item.name.includes('Non-functional') && isNonFunctionalNA) ||
                   (item.name.includes('API') && isApiSpecNA);
  const statusLabel = item.status ? (isNAItem ? `${COLORS.green}✔ Đạt (N/A)${COLORS.reset}` : `${COLORS.green}✔ Đạt${COLORS.reset}`) : `${COLORS.red}✘ Thiếu / Cần rà soát${COLORS.reset}`;
  console.log(`     [${statusLabel}] ${item.name}`);
});
console.log();

console.log(`${COLORS.bold}4. KIỂM TRA TRƯỜNG HỢP GÓC CẠNH (CORNER CASES)${COLORS.reset}`);
const ccSymbol = cornerCasesCount >= 5 ? `${COLORS.green}✔ Đạt${COLORS.reset}` : `${COLORS.red}✘ Cảnh báo${COLORS.reset}`;
console.log(`   - Số lượng Corner Cases phát hiện: ${ccSymbol} ${COLORS.bold}${cornerCasesCount}${COLORS.reset} (Quy định tối thiểu: 5).`);
console.log();

console.log(`${COLORS.bold}5. CHI TIẾT CÁC LỖI & PHÙ HỢP NGÔN NGỮ (LANGUAGE & FORMAT ERRORS)${COLORS.reset}`);
if (issues.length === 0) {
  console.log(`   - ${COLORS.green}Không phát hiện lỗi từ cấm hoặc định dạng nào. Tuyệt vời!${COLORS.reset}`);
} else {
  console.log(`   - Phát hiện ${COLORS.red}${COLORS.bold}${issues.length}${COLORS.reset} lỗi cần điều chỉnh:`);
  issues.forEach(issue => {
    const color = issue.type === 'LANGUAGE' ? COLORS.yellow : COLORS.red;
    console.log(`     [Dòng ${issue.line}] [${issue.type}] ${color}${issue.message}${COLORS.reset}`);
  });
}
console.log();

console.log(`${COLORS.cyan}${COLORS.bold}======================================================================${COLORS.reset}`);
console.log(`Kết luận đánh giá tài liệu:`);

let finalSuccess = false;
if (targetGate === 1) {
  finalSuccess = (gate1Passed === gate1Total && issues.length === 0);
} else {
  // Gate 2 requires Gate 2 criteria + Corner Cases >= 5
  finalSuccess = (gate2Passed === gate2Total && cornerCasesCount >= 5 && issues.length === 0);
}

if (finalSuccess) {
  console.log(`${COLORS.green}${COLORS.bold}  HỢP LỆ (APPROVED) - Vượt qua Quality Gate ${targetGate} thành công!${COLORS.reset}`);
  process.exit(0);
} else {
  console.log(`${COLORS.red}${COLORS.bold}  CẦN ĐIỀU CHỈNH (REJECTED) - Tài liệu chưa đạt chuẩn Quality Gate ${targetGate}.${COLORS.reset}`);
  process.exit(1);
}
