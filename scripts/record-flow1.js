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
  
  console.log('Opening Create Dialog...');
  await page.click('button:has-text("Tạo lịch test")');
  await page.waitForTimeout(2000);
  
  console.log('Filling form: Student...');
  const studentInput = page.locator('div[role="dialog"] input[placeholder="Chọn học viên..."]');
  await studentInput.click();
  await studentInput.fill('Trần Minh Châu');
  await page.waitForTimeout(1000);
  await page.click('div[role="option"]:has-text("Trần Minh Châu")');
  await page.waitForTimeout(1000);
  
  console.log('Filling form: Program...');
  await page.click('div[role="dialog"] button[aria-label="Chương trình"]');
  await page.waitForTimeout(1000);
  await page.click('div[role="option"]:has-text("Station Program")');
  await page.waitForTimeout(1000);
  
  console.log('Filling form: Level...');
  await page.click('div[role="dialog"] button[aria-label="Trình độ"]');
  await page.waitForTimeout(1000);
  await page.click('div[role="option"]:has-text("Level 1A")');
  await page.waitForTimeout(1000);
  
  console.log('Filling form: Branch...');
  await page.click('div[role="dialog"] button[aria-label="Trường"]');
  await page.waitForTimeout(1000);
  await page.click('div[role="option"]:has-text("RinoEdu Nguyễn Tuân")');
  await page.waitForTimeout(1000);
  
  console.log('Selecting slot date/time...');
  await page.click('div[role="dialog"] button:has-text("18:00")');
  await page.waitForTimeout(1500);
  
  console.log('Submitting new booking...');
  await page.click('div[role="dialog"] button:has-text("Tạo lịch test")');
  await page.waitForTimeout(3000);
  
  console.log('Searching for created student...');
  await page.click('button[aria-label="Tìm lịch test"]');
  await page.waitForTimeout(1000);
  const searchInput = page.locator('input[placeholder*="Tìm tên học viên"]');
  await searchInput.click();
  await searchInput.fill('Trần Minh Châu');
  await page.waitForTimeout(2000);
  
  console.log('Performing Check-in...');
  // Hover or look for the row
  await page.hover('p:has-text("Trần Minh Châu")');
  await page.waitForTimeout(1000);
  // Click check-in button on the row
  await page.click('button[aria-label="Check-in học viên"]');
  await page.waitForTimeout(4000);
  
  console.log('Closing browser...');
  await context.close();
  await browser.close();
  
  const videoFile = await page.video().path();
  console.log('Video recorded to:', videoFile);
  
  const destPath = path.join(destDir, 'flow1_checkin.webm');
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
