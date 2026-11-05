const fs = require('fs');
const html = fs.readFileSync('temp_booking_confluence_storage.html', 'utf8');

const tags = ['table', 'tbody', 'tr', 'th', 'td', 'ul', 'ol', 'li', 'p', 'h1', 'h2', 'h3', 'h4', 'blockquote', 'code', 'strong', 'em', 'a'];
let hasError = false;
tags.forEach(tag => {
  const openRe = new RegExp(`<${tag}[\\s>]`, 'gi');
  const closeRe = new RegExp(`</${tag}>`, 'gi');
  const openCount = (html.match(openRe) || []).length;
  const closeCount = (html.match(closeRe) || []).length;
  if (openCount !== closeCount) {
    console.log(`Mismatch tag <${tag}>: Open = ${openCount}, Close = ${closeCount}`);
    hasError = true;
  }
});
if (!hasError) {
  console.log('ALL TAGS PERFECTLY BALANCED!');
}
