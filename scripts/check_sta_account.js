const { chromium } = require('playwright');

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Navigating to https://sta.rinoedu.ai/booking-test...');
  try {
    const res = await page.goto('https://sta.rinoedu.ai/booking-test', { waitUntil: 'networkidle', timeout: 30000 });
    console.log('Final URL:', page.url());
    console.log('Title:', await page.title());

    // Check if redirected to login
    const isLogin = page.url().includes('login');
    console.log('Is on login page?', isLogin);

    // Get visible text
    const bodyText = await page.innerText('body');
    console.log('Page content snippet:', bodyText.slice(0, 500));

    // Check local storage or cookies
    const cookies = await context.cookies();
    console.log('Cookies:', cookies);

    const localStorageData = await page.evaluate(() => {
      return Object.entries(localStorage);
    });
    console.log('LocalStorage keys:', localStorageData.map(([k]) => k));
  } catch (err) {
    console.error('Error during navigation:', err);
  } finally {
    await browser.close();
  }
}

main();
