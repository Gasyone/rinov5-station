import fs from 'fs';
import path from 'path';

function formatInline(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/&lt;br\s*\/?&gt;/gi, '<br/>');
}

function convertMarkdownToStorageFormat(mdContent) {
  const lines = mdContent.split('\n');

  let html = '';
  let inCode = false;
  let codeLang = '';
  let codeBuffer = '';
  let inTable = false;
  let tableHeader = true;
  let listStack = []; // stores indent levels

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Frontmatter skip
    if (i === 0 && line.trim() === '---') {
      while (i + 1 < lines.length && lines[++i].trim() !== '---') {}
      continue;
    }

    // Code blocks
    if (line.trim().startsWith('```')) {
      if (!inCode) {
        if (listStack.length > 0) {
          while (listStack.length > 0) {
            html += listStack.pop();
          }
        }
        if (inTable) {
          html += '</tbody></table>';
          inTable = false;
        }
        inCode = true;
        codeLang = line.trim().slice(3).trim();
        codeBuffer = '';
      } else {
        inCode = false;
        html += '<ac:structured-macro ac:name="code">';
        if (codeLang) {
          html += '<ac:parameter ac:name="language">' + codeLang + '</ac:parameter>';
        }
        html += '<ac:plain-text-body><![CDATA[' + codeBuffer.trim() + ']]></ac:plain-text-body></ac:structured-macro>';
      }
      continue;
    }
    if (inCode) {
      codeBuffer += line + '\n';
      continue;
    }

    // Close lists if non-list line encountered
    const isListItem = line.trim().startsWith('- ') || line.trim().startsWith('* ') || /^\s*\d+\.\s/.test(line);
    const isIndentedList = /^\s{2,}(?:[-*]|\d+\.)\s/.test(line);
    const isIndentedText = /^\s{2,}\S/.test(line);

    if (!isListItem && !isIndentedText && listStack.length > 0 && line.trim() !== '') {
      while (listStack.length > 0) {
        html += listStack.pop();
      }
    }

    // Tables
    if (line.trim().startsWith('|')) {
      if (listStack.length > 0) {
        while (listStack.length > 0) {
          html += listStack.pop();
        }
      }
      if (line.includes('---')) continue; // divider
      const cells = line.split('|').map(c => c.trim()).filter((c, idx, arr) => idx > 0 && idx < arr.length - 1);
      if (!inTable) {
        inTable = true;
        tableHeader = true;
        html += '<table data-layout="center" data-table-width="1400"><tbody>';
      }
      html += '<tr>';
      cells.forEach(cell => {
        let tag = tableHeader ? 'th' : 'td';
        let bg = tableHeader ? ' data-highlight-colour="color(srgb 0.917882 0.917882 0.917882)"' : '';
        let formatted = formatInline(cell);
        html += '<' + tag + bg + '><p>' + formatted + '</p></' + tag + '>';
      });
      html += '</tr>';
      tableHeader = false;
      continue;
    } else if (inTable) {
      inTable = false;
      html += '</tbody></table>';
    }

    // Lists handling
    if (isListItem) {
      const match = line.match(/^(\s*)([-*]|\d+\.)\s+(.*)$/);
      if (match) {
        const indent = match[1].length;
        const bullet = match[2];
        const content = match[3];
        const tag = /^\d+\./.test(bullet) ? 'ol' : 'ul';

        // Check if we need to open a new list or close sublists
        if (listStack.length === 0) {
          html += '<' + tag + '>';
          listStack.push('</' + tag + '>');
        }
        html += '<li><p>' + formatInline(content) + '</p></li>';
        continue;
      }
    }

    // Indented text under list
    if (isIndentedText && listStack.length > 0) {
      html += '<p style="margin-left: 20px;">' + formatInline(line.trim()) + '</p>';
      continue;
    }

    // Headings
    if (line.startsWith('# ')) {
      html += '<h1>' + formatInline(line.slice(2).trim()) + '</h1>';
      continue;
    }
    if (line.startsWith('## ')) {
      html += '<h2>' + formatInline(line.slice(3).trim()) + '</h2>';
      continue;
    }
    if (line.startsWith('### ')) {
      html += '<h3>' + formatInline(line.slice(4).trim()) + '</h3>';
      continue;
    }
    if (line.startsWith('#### ')) {
      html += '<h4>' + formatInline(line.slice(5).trim()) + '</h4>';
      continue;
    }

    // Blockquote
    if (line.trim().startsWith('>')) {
      html += '<p><em>' + formatInline(line.trim().slice(1).trim()) + '</em></p>';
      continue;
    }

    // Horizontal rule
    if (line.trim() === '---') {
      html += '<hr />';
      continue;
    }

    // Paragraph
    if (line.trim() !== '') {
      html += '<p>' + formatInline(line.trim()) + '</p>';
    }
  }

  if (inTable) html += '</tbody></table>';
  while (listStack.length > 0) {
    html += listStack.pop();
  }

  return html;
}

const mdPath = path.resolve('docs/00-business/US-CARE-01-03-chi-tiet-hoc-tap-lay-du-lieu-hinh-anh-buoi-du-an.md');
const content = fs.readFileSync(mdPath, 'utf8');
const storageHtml = convertMarkdownToStorageFormat(content);

const outPath = path.resolve('scratch_storage.html');
fs.writeFileSync(outPath, storageHtml, 'utf8');
console.log('Successfully generated storage format HTML. Length:', storageHtml.length);
