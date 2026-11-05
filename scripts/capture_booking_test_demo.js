const { chromium } = require('playwright');

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:3001/login...');
  await page.goto('http://localhost:3001/login');
  
  // Fill login
  await page.fill('input[placeholder*="email"], input[type="text"], input[type="email"]', 'admin@rinoedu.vn');
  await page.fill('input[type="password"]', 'admin123');
  await page.click('button:has-text("Đăng nhập")');
  
  await page.waitForTimeout(1500);
  console.log('Navigating to http://localhost:3001/app/booking_test...');
  await page.goto('http://localhost:3001/app/booking_test');
  await page.waitForTimeout(2000);

  console.log('Page Title:', await page.title());
  console.log('URL:', page.url());

  // Screenshot for reference
  await page.screenshot({ path: 'artifacts/localhost_booking_test.png', fullPage: true });
  console.log('Saved screenshot to artifacts/localhost_booking_test.png');

  // Extract visible toolbar, status tiles, and table headers
  const text = await page.innerText('body');
  console.log('Page text excerpt:\n', text.slice(0, 1500));

  await browser.close();
}

main().catch(console.error);
