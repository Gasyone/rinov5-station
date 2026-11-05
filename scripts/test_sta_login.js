const { chromium } = require('playwright');

async function testLogin(username, password) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto('https://sta.rinoedu.ai/login?return_url=/booking-test', { waitUntil: 'networkidle' });
    
    // Fill credentials
    const usernameInput = page.locator('input[placeholder*="tên đăng nhập"], input[type="text"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    
    await usernameInput.fill(username);
    await passwordInput.fill(password);
    
    // Listen for responses
    const responsePromise = page.waitForResponse(resp => resp.url().includes('/api/') || resp.url().includes('login'), { timeout: 8000 }).catch(() => null);
    
    await page.click('button:has-text("Đăng nhập")');
    const resp = await responsePromise;
    if (resp) {
      console.log('Login API Status:', resp.status(), resp.url());
      try {
        const body = await resp.text();
        console.log('Login API Body:', body);
      } catch (e) {}
    }
    
    await page.waitForTimeout(2000);
    console.log('After submit URL:', page.url());
  } catch (err) {
    console.log('Error:', err.message);
  } finally {
    await browser.close();
  }
}

testLogin('admin@rinoedu.vn', 'admin123');
