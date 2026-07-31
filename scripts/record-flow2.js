const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function run() {
  console.log('Launching browser...');
  const browser = await chromium.launch({
    headless: true
  });
  
  const destDir = 'C:\\Users\\Jacky Tran\\.gemini\\antigravity\\brain\\b2b3508d-fb20-49a3-8526-190abd6f4a02';
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const context = await browser.newContext({
    recordVideo: {
      dir: destDir,
      size: { width: 1280, height: 720 }
    },
    viewport: { width: 1280, height: 720 }
  });
  
  const page = await context.newPage();
  
  console.log('Navigating to login page...');
  await page.goto('http://localhost:3000/login');
  await page.waitForTimeout(2000);
  
  console.log('Typing email and password...');
  const emailInput = page.locator('input[placeholder="Nhập email hoặc username"]');
  await emailInput.click();
  await emailInput.pressSequentially('admin@rinoedu.vn', { delay: 50 });
  await page.waitForTimeout(500);
  
  const passwordInput = page.locator('input[placeholder="Nhập mật khẩu"]');
  await passwordInput.click();
  await passwordInput.pressSequentially('admin123', { delay: 50 });
  await page.waitForTimeout(1000);
  
  console.log('Clicking login...');
  await page.click('button:has-text("Đăng nhập")');
  
  console.log('Waiting for redirect...');
  await page.waitForURL('**/app/calendar_class_schedule', { timeout: 60000 });
  await page.waitForTimeout(2000);
  
  console.log('Navigating to booking_test_v2...');
  await page.goto('http://localhost:3000/app/booking_test_v2');
  await page.waitForTimeout(3000);
  
  console.log('Searching for Truc My...');
  const searchButton = page.locator('button[aria-label="Tìm lịch test"]');
  const searchInput = page.locator('input[placeholder*="Tìm tên học viên"]');
  
  // Retry clicking the search button until input is visible (handles hydration delay)
  for (let i = 0; i < 5; i++) {
    await searchButton.click();
    await page.waitForTimeout(1000);
    if (await searchInput.isVisible()) {
      break;
    }
    console.log(`Search input not visible, retrying click... (${i+1})`);
  }
  
  await searchInput.click();
  await searchInput.fill('Truc My');
  await page.waitForTimeout(2000);
  
  console.log('Checking if Check-in is needed for Truc My...');
  await page.hover('p:has-text("Truc My")');
  await page.waitForTimeout(1000);
  const checkinButton = page.locator('button[aria-label="Check-in học viên"]');
  if (await checkinButton.isVisible()) {
    console.log('Performing Check-in...');
    await checkinButton.click();
    await page.waitForTimeout(2000);
  } else {
    console.log('Truc My is already checked in.');
  }
  
  console.log('Opening English Assessment Dialog...');
  await page.hover('p:has-text("Truc My")');
  await page.waitForTimeout(1000);
  await page.click('button[aria-label="Mở đánh giá cho Truc My"]');
  await page.waitForTimeout(2000);
  
  console.log('Clicking Skip (Bỏ qua) for standard 2025 form...');
  await page.click('button:has-text("Bỏ qua")');
  await page.waitForTimeout(1000);
  
  console.log('Selecting feedback answers...');
  await page.click('label:has-text("Tự tin trong giao tiếp")');
  await page.waitForTimeout(1000);
  await page.click('label:has-text("Sử dụng từ vựng chính xác, phù hợp")');
  await page.waitForTimeout(1000);
  
  console.log('Selecting weaknesses...');
  await page.click('span:has-text("Thiếu tự tin, ngại nói")');
  await page.waitForTimeout(1000);
  
  console.log('Saving English Assessment...');
  await page.click('button:has-text("Cập nhật đánh giá")');
  await page.waitForTimeout(3000);
  
  console.log('Opening placement test report...');
  const reportLink = page.locator('a[aria-label="Mở trang kết quả của Truc My"]');
  const href = await reportLink.getAttribute('href');
  console.log('Report URL:', href);
  const fullUrl = new URL(href, 'http://localhost:3000').toString();
  await page.goto(fullUrl);
  await page.waitForTimeout(4000);
  
  console.log('Closing browser...');
  await context.close();
  await browser.close();
  
  const videoFile = await page.video().path();
  console.log('Video recorded to:', videoFile);
  
  const destPath = path.join(destDir, 'flow2_evaluation.webm');
  fs.copyFileSync(videoFile, destPath);
  console.log('Video copied to:', destPath);
  
  try {
    fs.unlinkSync(videoFile);
    console.log('Cleaned up temp video.');
  } catch (e) {}
}

run().catch(err => {
  console.error('Error running playwright:', err);
  process.exit(1);
});
