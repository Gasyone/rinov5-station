const fs = require('fs');
const path = require('path');

const mdPath = path.resolve('docs/00-business/US-CAL-02-07-calling-trong-chi-tiet-buoi-hoc.md');
const md = fs.readFileSync(mdPath, 'utf8');

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatInline(str) {
  let s = escapeXml(str);
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
  return s;
}

function mdToConfluenceHtml(markdown) {
  const lines = markdown.split('\n');
  let html = '';
  let inTable = false;
  let inCode = false;
  let codeContent = '';
  let inUl = false;
  let frontmatterCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (line === '---') {
      frontmatterCount++;
      if (inTable) { html += '</tbody></table>'; inTable = false; }
      if (inUl) { html += '</ul>'; inUl = false; }
      continue;
    }

    if (frontmatterCount === 1) {
      continue;
    }

    if (line.startsWith('```')) {
      if (inCode) {
        html += '<ac:structured-macro ac:name="code"><ac:plain-text-body><![CDATA[' + codeContent.trim() + ']]></ac:plain-text-body></ac:structured-macro>';
        inCode = false;
        codeContent = '';
      } else {
        if (inTable) { html += '</tbody></table>'; inTable = false; }
        if (inUl) { html += '</ul>'; inUl = false; }
        inCode = true;
        codeContent = '';
      }
      continue;
    }

    if (inCode) {
      codeContent += rawLine + '\n';
      continue;
    }

    if (line.startsWith('# ')) {
      if (inTable) { html += '</tbody></table>'; inTable = false; }
      if (inUl) { html += '</ul>'; inUl = false; }
      html += '<h1>' + formatInline(line.slice(2)) + '</h1>';
      continue;
    }
    if (line.startsWith('## ')) {
      if (inTable) { html += '</tbody></table>'; inTable = false; }
      if (inUl) { html += '</ul>'; inUl = false; }
      html += '<h2>' + formatInline(line.slice(3)) + '</h2>';
      continue;
    }
    if (line.startsWith('### ')) {
      if (inTable) { html += '</tbody></table>'; inTable = false; }
      if (inUl) { html += '</ul>'; inUl = false; }
      html += '<h3>' + formatInline(line.slice(4)) + '</h3>';
      continue;
    }
    if (line.startsWith('#### ')) {
      if (inTable) { html += '</tbody></table>'; inTable = false; }
      if (inUl) { html += '</ul>'; inUl = false; }
      html += '<h4>' + formatInline(line.slice(5)) + '</h4>';
      continue;
    }

    if (line.startsWith('|')) {
      if (inUl) { html += '</ul>'; inUl = false; }
      if (line.includes('---')) continue;
      const cells = line.split('|').slice(1, -1).map(c => c.trim());
      if (!inTable) {
        inTable = true;
        html += '<table class="wrapped"><tbody><tr>' + cells.map(c => '<th>' + formatInline(c) + '</th>').join('') + '</tr>';
      } else {
        html += '<tr>' + cells.map(c => '<td>' + formatInline(c) + '</td>').join('') + '</tr>';
      }
      continue;
    } else if (inTable) {
      html += '</tbody></table>';
      inTable = false;
    }

    if (line.startsWith('* ') || line.startsWith('- ')) {
      if (!inUl) {
        inUl = true;
        html += '<ul>';
      }
      html += '<li>' + formatInline(line.slice(2)) + '</li>';
      continue;
    } else if (inUl && !line.startsWith('  -') && !line.startsWith('    -') && !line.startsWith('  *')) {
      html += '</ul>';
      inUl = false;
    }

    if (line.startsWith('  - ') || line.startsWith('  * ')) {
      html += '<li style="margin-left: 20px;">' + formatInline(line.slice(4)) + '</li>';
      continue;
    }

    if (line.startsWith('    - ') || line.startsWith('    * ')) {
      html += '<li style="margin-left: 40px;">' + formatInline(line.slice(6)) + '</li>';
      continue;
    }

    if (line.startsWith('> ')) {
      html += '<blockquote><p>' + formatInline(line.slice(2)) + '</p></blockquote>';
      continue;
    }

    if (line.length > 0) {
      html += '<p>' + formatInline(line) + '</p>';
    }
  }

  if (inTable) html += '</tbody></table>';
  if (inUl) html += '</ul>';
  return html;
}

const out = mdToConfluenceHtml(md);
fs.writeFileSync('temp_confluence_body.html', out, 'utf8');
console.log('Successfully generated Confluence storage body! Length:', out.length);
