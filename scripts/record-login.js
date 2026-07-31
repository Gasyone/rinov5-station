const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function run() {
  console.log('Launching browser...');
  const browser = await chromium.launch({
    headless: true
  });
  
  const context = await browser.newContext({
    recordVideo: {
      dir: path.join(__dirname, '../videos'),
      size: { width: 1280, height: 720 }
    },
    viewport: { width: 1280, height: 720 }
  });
  
  const page = await context.newPage();
  
  console.log('Navigating to login page...');
  await page.goto('http://localhost:3000/login');
  
  await page.waitForTimeout(2000);
  
  console.log('Selecting language...');
  await page.click('button:has-text("VI")');
  await page.waitForTimeout(1000);
  await page.click('span:has-text("English")');
  await page.waitForTimeout(1500);
  await page.click('button:has-text("EN")');
  await page.waitForTimeout(1000);
  await page.click('span:has-text("Tiếng Việt")');
  await page.waitForTimeout(1500);

  console.log('Typing email...');
  const emailInput = page.locator('input[placeholder="Nhập email hoặc username"]');
  await emailInput.click();
  await page.waitForTimeout(500);
  await emailInput.pressSequentially('admin@rinoedu.vn', { delay: 100 });
  await page.waitForTimeout(1000);
  
  console.log('Typing password...');
  const passwordInput = page.locator('input[placeholder="Nhập mật khẩu"]');
  await passwordInput.click();
  await page.waitForTimeout(500);
  await passwordInput.pressSequentially('admin123', { delay: 100 });
  await page.waitForTimeout(1500);
  
  console.log('Toggling password visibility...');
  const toggleBtn = page.locator('button[aria-label="Hiện mật khẩu"]');
  await toggleBtn.click();
  await page.waitForTimeout(2000);
  const toggleBtnHide = page.locator('button[aria-label="Ẩn mật khẩu"]');
  await toggleBtnHide.click();
  await page.waitForTimeout(1000);
  
  console.log('Clicking login...');
  await page.click('button:has-text("Đăng nhập")');
  
  console.log('Waiting for navigation to dashboard...');
  await page.waitForURL('**/app/calendar_class_schedule', { timeout: 60000 });
  await page.waitForTimeout(5000);
  
  console.log('Closing browser...');
  await context.close();
  await browser.close();
  
  const videoFile = await page.video().path();
  console.log('Video recorded to:', videoFile);
  
  const destDir = 'C:\\Users\\Jacky Tran\\.gemini\\antigravity\\brain\\24e51d81-950b-41e0-a755-48e8fc73dad4';
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  const destPath = path.join(destDir, 'login_tutorial.mp4');
  fs.copyFileSync(videoFile, destPath);
  console.log('Video copied to:', destPath);
  
  // Clean up original video directory
  try {
    fs.unlinkSync(videoFile);
    console.log('Original video file cleaned up.');
  } catch (e) {
    // Ignore cleanup error
  }
}

run().catch(err => {
  console.error('Error running playwright:', err);
  process.exit(1);
});
