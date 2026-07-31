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

  // --- Flow 2: Giáo viên chấm phỏng vấn Speaking ---
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

  // Search for "Bao Chau" - who has status=checkin and has a teacher assigned
  console.log('Searching for Bao Chau...');
  await searchInput.fill('Bao Chau');
  await page.waitForTimeout(1500);

  // Hover row to reveal action buttons
  const row = page.locator('tr:has(p:has-text("Bao Chau"))').first();
  await row.hover();
  await page.waitForTimeout(1000);

  // Click "Mở đánh giá" button
  console.log('Opening assessment dialog...');
  const assessBtn = row.locator('button[aria-label*="Mở đánh giá"]');
  await assessBtn.click({ timeout: 5000 });
  await page.waitForTimeout(2500);

  // The assessment dialog should be open
  // Interact with scoring - click on some score buttons
  console.log('Scoring Speaking criteria...');
  const dialog = page.locator('div[role="dialog"]');

  // Click edit button if visible to unlock editing
  const editBtn = dialog.locator('button:has-text("Chỉnh sửa đánh giá")');
  if (await editBtn.isVisible().catch(() => false)) {
    console.log('Clicking Chỉnh sửa đánh giá to enter edit mode...');
    await editBtn.click();
    await page.waitForTimeout(1000);
  }

  // Click some score options - 1 điểm for first 4 criteria
  for (let i = 1; i <= 4; i++) {
    try {
      const btn = dialog.locator(`button[aria-label="${i} - 1 điểm"]`);
      await btn.click({ timeout: 2000 });
      await page.waitForTimeout(500);
    } catch (e) {
      console.log(`Skipped score button for criteria ${i}`);
    }
  }
  await page.waitForTimeout(1500);

  // Scroll down in dialog to show more criteria
  console.log('Scrolling to show more criteria...');
  await dialog.locator('div.overflow-y-auto').first().evaluate((el) => el.scrollBy(0, 300));
  await page.waitForTimeout(1500);

  // Click "Cập nhật" button to save
  console.log('Clicking update button...');
  const updateBtn = dialog.locator('button:has-text("Cập nhật")');
  if (await updateBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await updateBtn.click();
    await page.waitForTimeout(2500);
  }

  // Close dialog
  console.log('Closing dialog...');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(2000);

  console.log('Closing browser...');
  await context.close();
  await browser.close();

  const videoFile = await page.video().path();
  console.log('Video recorded to:', videoFile);
  
  const destPath = path.join(destDir, 'v1_flow2_assessment.webm');
  fs.copyFileSync(videoFile, destPath);
  console.log('Video copied to:', destPath);
  try { fs.unlinkSync(videoFile); } catch (e) {}
}

run().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
