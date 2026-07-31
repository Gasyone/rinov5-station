const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const destDir = 'C:\\Users\\Jacky Tran\\.gemini\\antigravity\\brain\\b2b3508d-fb20-49a3-8526-190abd6f4a02';

async function run() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: { dir: destDir, size: { width: 1280, height: 720 } },
  });

  // Set auth cookie to skip login
  await context.addCookies([{
    name: 'auth_session',
    value: 'true',
    domain: 'localhost',
    path: '/',
  }]);

  const page = await context.newPage();

  // --- Flow 1: CS/Admin Check-in ---
  console.log('Navigating to booking_test v1...');
  await page.goto('http://localhost:3000/app/booking_test', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  // Expand search
  console.log('Expanding search bar...');
  const searchBtn = page.locator('button[aria-label="Tìm lịch test"]');
  await searchBtn.waitFor({ state: 'visible', timeout: 10000 });
  const searchInput = page.locator('input[placeholder="Tìm tên học viên, số điện thoại, mã lịch..."]');
  
  for (let i = 0; i < 3; i++) {
    await searchBtn.click();
    await page.waitForTimeout(1000);
    if (await searchInput.isVisible()) {
      break;
    }
    console.log('Search input not visible yet, retrying click...');
  }

  // Search for "Truc My" who has status booked_assessment -> can check-in
  console.log('Searching for Truc My...');
  await searchInput.fill('Truc My');
  await page.waitForTimeout(1500);

  // Hover the row to reveal action buttons
  console.log('Hovering row to show Check-in button...');
  const row = page.locator('tr:has(p:has-text("Truc My"))').first();
  await row.hover();
  await page.waitForTimeout(1000);

  // Click Check-in
  console.log('Clicking Check-in button...');
  const checkinBtn = row.locator('button[aria-label="Check-in học viên"]');
  await checkinBtn.click({ timeout: 5000 });
  await page.waitForTimeout(2500);

  // Clear search to show updated list
  console.log('Clearing search...');
  await searchInput.clear();
  await page.waitForTimeout(2000);

  // Click on the row to show detail dialog 
  console.log('Opening detail dialog for Truc My...');
  await searchInput.fill('Truc My');
  await page.waitForTimeout(1500);
  const detailRow = page.locator('tr:has(p:has-text("Truc My"))').first();
  await detailRow.click();
  await page.waitForTimeout(3000);

  // Close detail dialog  
  console.log('Closing detail dialog...');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(2000);

  console.log('Closing browser...');
  await context.close();
  await browser.close();

  const videoFile = await page.video().path();
  console.log('Video recorded to:', videoFile);
  
  const destPath = path.join(destDir, 'v1_flow1_checkin.webm');
  fs.copyFileSync(videoFile, destPath);
  console.log('Video copied to:', destPath);
  try { fs.unlinkSync(videoFile); } catch (e) {}
}

run().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
