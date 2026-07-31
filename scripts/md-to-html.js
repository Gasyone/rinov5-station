import fs from 'fs';
import path from 'path';

function mdToHtml(md) {
  // Split lines
  const lines = md.split(/\r?\n/);
  let html = '';
  let inList = false;
  let inTable = false;
  let inCodeBlock = false;
  let codeContent = '';
  let codeLang = '';

  let processedFrontmatter = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    let trimmed = line.trim();

    // Handle code blocks
    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        // End of code block
        inCodeBlock = false;
        if (codeLang === 'mermaid') {
          html += `<p><code>${codeContent.trim()}</code></p>\n`;
        } else {
          html += `<pre><code>${codeContent.trim()}</code></pre>\n`;
        }
        codeContent = '';
        codeLang = '';
      } else {
        // Start of code block
        inCodeBlock = true;
        codeLang = trimmed.substring(3).trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeContent += line + '\n';
      continue;
    }

    // Handle frontmatter only at the start of the file
    if (!processedFrontmatter && trimmed === '---') {
      let j = i + 1;
      while (j < lines.length && lines[j].trim() !== '---') {
        j++;
      }
      if (j < lines.length) {
        i = j; // skip frontmatter
        processedFrontmatter = true;
        continue;
      }
    }
    processedFrontmatter = true;

    // Handle headers
    if (trimmed.startsWith('# ')) {
      html += `<h1>${escapeHtml(trimmed.substring(2))}</h1>\n`;
      continue;
    }
    if (trimmed.startsWith('## ')) {
      html += `<h2>${escapeHtml(trimmed.substring(3))}</h2>\n`;
      continue;
    }
    if (trimmed.startsWith('### ')) {
      html += `<h3>${escapeHtml(trimmed.substring(4))}</h3>\n`;
      continue;
    }
    if (trimmed.startsWith('#### ')) {
      html += `<h4>${escapeHtml(trimmed.substring(5))}</h4>\n`;
      continue;
    }

    // Handle horizontal rule
    if (trimmed === '---') {
      html += '<p>---</p>\n';
      continue;
    }

    // Handle lists
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      if (!inList) {
        html += '<ul>\n';
        inList = true;
      }
      let content = trimmed.substring(2);
      html += `<li>${parseInline(content)}</li>\n`;
      continue;
    } else {
      if (inList) {
        html += '</ul>\n';
        inList = false;
      }
    }

    // Handle blockquotes
    if (trimmed.startsWith('> ')) {
      let content = trimmed.substring(2);
      html += `<blockquote><p>${parseInline(content)}</p></blockquote>\n`;
      continue;
    }

    // Handle tables
    if (trimmed.startsWith('|')) {
      if (trimmed.includes('---')) {
        // Separator row, skip
        continue;
      }
      if (!inTable) {
        html += '<table>\n<tbody>\n';
        inTable = true;
      }
      let cells = trimmed.split('|').slice(1, -1).map(c => c.trim());
      html += '<tr>\n';
      for (let cell of cells) {
        html += `<td>${parseInline(cell)}</td>\n`;
      }
      html += '</tr>\n';
      continue;
    } else {
      if (inTable) {
        html += '</tbody>\n</table>\n';
        inTable = false;
      }
    }

    // Empty line
    if (trimmed === '') {
      continue;
    }

    // Normal paragraph
    html += `<p>${parseInline(trimmed)}</p>\n`;
  }

  // Close open tags
  if (inList) html += '</ul>\n';
  if (inTable) html += '</tbody>\n</table>\n';

  return html;
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function parseInline(text) {
  // Convert markdown inline to html
  let html = escapeHtml(text);
  
  // Strong
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  
  // Em
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  
  return html;
}

const file = process.argv[2];
if (!file) {
  console.error("Usage: node md-to-html.js <file>");
  process.exit(1);
}

const content = fs.readFileSync(file, 'utf8');
const htmlContent = mdToHtml(content);
fs.writeFileSync(file.replace('.md', '.html'), htmlContent, 'utf8');
console.log("Done converting to HTML!");
