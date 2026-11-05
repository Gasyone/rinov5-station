import fs from 'fs';

async function main() {
  const res = await fetch('https://sta.rinoedu.ai/assets/js/BookingTestView-CXWaGBxi.js');
  const code = await res.text();
  fs.writeFileSync('temp_booking_view.js', code);
  
  // Find column definitions or table structure
  const titles = [...code.matchAll(/title:\s*"([^"]+)"/g)].map(m => m[1]);
  console.log('Titles found:', titles);

  // Find table header strings
  const headers = [...code.matchAll(/["']([A-ZÀ-Ỹa-zà-ỹ0-9\s/&()-]+)["']/g)]
    .map(m => m[1])
    .filter(s => s.length > 3 && s.length < 40);
  console.log('Sample text snippets:', headers.slice(0, 50));
}

main().catch(console.error);
