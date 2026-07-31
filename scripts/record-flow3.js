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
  
  console.log('Navigating to trial_class_v2...');
  await page.goto('http://localhost:3000/app/trial_class_v2');
  await page.waitForTimeout(3000);
  
  console.log('Expanding search bar...');
  const searchButton = page.locator('button[aria-label="Tìm Booking"]');
  const searchInput = page.locator('input[placeholder*="Tìm mã, tên HV"]');
  
  // Retry clicking the search button until input is visible (handles hydration delay)
  for (let i = 0; i < 5; i++) {
    await searchButton.click();
    await page.waitForTimeout(1000);
    if (await searchInput.isVisible()) {
      break;
    }
    console.log(`Search input not visible, retrying click... (${i+1})`);
  }

  console.log('Flow 3.1: Searching for Nguyễn Minh Anh...');
  await searchInput.click();
  await searchInput.fill('Nguyễn Minh Anh');
  await page.waitForTimeout(1500);

  console.log('Flow 3.1: Approving class pairing for Nguyễn Minh Anh...');
  await page.hover('p:has-text("Nguyễn Minh Anh")');
  await page.waitForTimeout(1000);
  await page.click('button[aria-label="Chấp thuận ghép lớp cho Nguyễn Minh Anh"]');
  await page.waitForTimeout(3000);
  
  console.log('Clearing search...');
  await searchInput.click();
  await page.keyboard.press('Control+A');
  await page.keyboard.press('Backspace');
  await page.waitForTimeout(1500);

  console.log('Flow 3.2: Searching for Trần Bảo Nam...');
  await searchInput.fill('Trần Bảo Nam');
  await page.waitForTimeout(1500);

  console.log('Flow 3.2: Rescheduling class session for Trần Bảo Nam...');
  const rowBaoNam = page.locator('tr:has-text("Trần Bảo Nam")');
  await rowBaoNam.hover();
  await page.waitForTimeout(1000);
  await rowBaoNam.locator('button[aria-label="Đổi buổi học"]').click();
  await page.waitForTimeout(2000);
  
  console.log('Selecting a new session...');
  await page.click('div[role="dialog"] button:has-text("Buổi 1")');
  await page.waitForTimeout(1500);
  
  console.log('Confirming Reschedule...');
  await page.click('div[role="dialog"] button:has-text("Lưu thay đổi")');
  await page.waitForTimeout(3000);
  
  console.log('Clearing search...');
  await searchInput.click();
  await page.keyboard.press('Control+A');
  await page.keyboard.press('Backspace');
  await page.waitForTimeout(1500);

  console.log('Flow 3.3: Searching for Đỗ Khánh Linh...');
  await searchInput.fill('Đỗ Khánh Linh');
  await page.waitForTimeout(1500);

  console.log('Flow 3.3: Cancelling trial class for Đỗ Khánh Linh...');
  await page.click('p:has-text("Đỗ Khánh Linh")');
  await page.waitForTimeout(2500);
  
  console.log('Clicking Cancel (Hủy lịch) in detail dialog...');
  await page.click('div[role="dialog"] button:has-text("Hủy lịch")');
  await page.waitForTimeout(2000);
  
  console.log('Selecting Cancellation Reason...');
  // ConfirmDialog uses AlertDialog (role="alertdialog"), not Dialog
  await page.click('div[role="alertdialog"] button[aria-label="Lý do hủy"]');
  await page.waitForTimeout(1000);
  await page.click('div[role="option"]:has-text("Khách bận")');
  await page.waitForTimeout(1000);
  
  console.log('Confirming Cancellation...');
  await page.click('div[role="alertdialog"] button:has-text("Xác nhận hủy")');
  await page.waitForTimeout(3000);
  
  console.log('Closing detail dialog...');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(2000);
  
  console.log('Closing browser...');
  await context.close();
  await browser.close();
  
  const videoFile = await page.video().path();
  console.log('Video recorded to:', videoFile);
  
  const destPath = path.join(destDir, 'flow3_trial_management.webm');
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
