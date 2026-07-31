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

  // --- Flow 3: Giáo vụ duyệt ghép lớp, đổi buổi ---
  console.log('Navigating to trial_class v1...');
  await page.goto('http://localhost:3000/app/trial_class', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  // Expand search
  console.log('Expanding search bar...');
  const searchBtn = page.locator('button[aria-label="Tìm Booking"]');
  await searchBtn.waitFor({ state: 'visible', timeout: 10000 });
  const searchInput = page.locator('input[placeholder="Tìm mã, tên HV, SĐT..."]');
  
  for (let i = 0; i < 3; i++) {
    await searchBtn.click();
    await page.waitForTimeout(1000);
    if (await searchInput.isVisible()) {
      break;
    }
    console.log('Search input not visible yet, retrying click...');
  }

  // 3.1: Approve class pairing for Nguyễn Minh Anh (status=pending_approval)
  console.log('Flow 3.1: Searching for Nguyễn Minh Anh...');
  await searchInput.fill('Nguyễn Minh Anh');
  await page.waitForTimeout(1500);

  console.log('Flow 3.1: Approving class pairing...');
  const row1 = page.locator('tr:has(p:has-text("Nguyễn Minh Anh"))').first();
  await row1.hover();
  await page.waitForTimeout(1000);

  const approveBtn = row1.locator('button[aria-label*="Chấp thuận ghép lớp"]');
  await approveBtn.click({ timeout: 5000 });
  await page.waitForTimeout(2500);

  // 3.2: Reschedule for Trần Bảo Nam (status=confirmed, has sessions)
  console.log('Clearing search...');
  await searchInput.clear();
  await page.waitForTimeout(1000);

  console.log('Flow 3.2: Searching for Trần Bảo Nam...');
  await searchInput.fill('Trần Bảo Nam');
  await page.waitForTimeout(1500);

  console.log('Flow 3.2: Opening reschedule dialog...');
  const row2 = page.locator('tr:has(p:has-text("Trần Bảo Nam"))').first();
  await row2.hover();
  await page.waitForTimeout(1000);

  const rescheduleBtn = row2.locator('button[aria-label*="Đổi buổi học"]');
  await rescheduleBtn.click({ timeout: 5000 });
  await page.waitForTimeout(2000);

  // Select a new session from the available class schedules
  console.log('Selecting a new session...');
  const sessionBtn = page.locator('button:has-text("Buổi 1")').first();
  await sessionBtn.waitFor({ state: 'visible', timeout: 5000 });
  await sessionBtn.click();
  await page.waitForTimeout(1000);
 
  // Click "Lưu thay đổi"
  console.log('Saving reschedule changes...');
  const saveBtn = page.locator('button:has-text("Lưu thay đổi")');
  await saveBtn.click({ timeout: 5000 });
  await page.waitForTimeout(2500);

  // 3.3: Open detail for a completed trial to show feedback
  console.log('Clearing search...');
  await searchInput.clear();
  await page.waitForTimeout(1000);

  console.log('Flow 3.3: Opening Nguyễn An detail (completed)...');
  await searchInput.fill('Nguyễn An');
  await page.waitForTimeout(1500);

  const row3 = page.locator('tr:has(p:has-text("Nguyễn An"))').first();
  await row3.click();
  await page.waitForTimeout(3000);

  // Close detail
  console.log('Closing detail dialog...');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(2000);

  console.log('Closing browser...');
  await context.close();
  await browser.close();

  const videoFile = await page.video().path();
  console.log('Video recorded to:', videoFile);
  
  const destPath = path.join(destDir, 'v1_flow3_coordinator.webm');
  fs.copyFileSync(videoFile, destPath);
  console.log('Video copied to:', destPath);
  try { fs.unlinkSync(videoFile); } catch (e) {}
}

run().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
