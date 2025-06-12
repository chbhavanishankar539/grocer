import puppeteer, { Page, Browser } from 'puppeteer';
import { selectors } from '../config/selectors.ts';

export async function launchBrowser(blockResources = true): Promise<Browser> {
  return puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process',
    ],
    defaultViewport: null,
  });
}

export async function automateLogin(
  platform: keyof typeof selectors,
  phoneNumber: string
): Promise<{ cookies: any; dom: string; url: string }> {
  const browser = await launchBrowser();
  const page = await browser.newPage();

  // Block non-essential resources
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    const type = req.resourceType();
    if (['stylesheet', 'font', 'image'].includes(type)) req.abort();
    else req.continue();
  });

  // Bypass CSP
  await page.setBypassCSP(true);

  // Navigate and automate login
  await page.goto(getPlatformUrl(platform));
  await page.click(selectors[platform].loginButton);
  await page.waitForSelector(selectors[platform].phoneInput);
  await page.type(selectors[platform].phoneInput, phoneNumber);
  await page.click(selectors[platform].submitButton);

  // Wait for OTP input to appear (simulate OTP sent)
  await page.waitForSelector(selectors[platform].otpInput);

  // Capture session
  const cookies = await page.cookies();
  const dom = await page.content();
  const url = page.url();
  await browser.close();
  return { cookies, dom, url };
}

export async function submitOtpWithSession(session: any, otp: string): Promise<{ cookies: any; dom: string; url: string }> {
  const browser = await launchBrowser();
  const page = await browser.newPage();

  // Restore cookies
  if (session.cookies && Array.isArray(session.cookies)) {
    for (const cookie of session.cookies) {
      await page.setCookie(cookie);
    }
  }

  // Go to the saved URL
  await page.goto(session.url);

  // Wait for OTP input and enter OTP
  await page.waitForSelector(session.otpInputSelector);
  await page.type(session.otpInputSelector, otp);

  // Click the submit button
  if (session.submitButtonSelector) {
    await page.waitForSelector(session.submitButtonSelector);
    await page.click(session.submitButtonSelector);
  }

  // Wait for navigation or confirmation
  await new Promise(res => setTimeout(res, 2000));

  // Capture new session state
  const cookies = await page.cookies();
  const dom = await page.content();
  const url = page.url();
  await browser.close();
  return { cookies, dom, url };
}

function getPlatformUrl(platform: keyof typeof selectors): string {
  switch (platform) {
    case 'blinkit':
      return 'https://www.blinkit.com';
    case 'zepto':
      return 'https://www.zeptonow.com';
    case 'instamart':
      return 'https://www.swiggy.com/instamart';
    default:
      throw new Error('Unknown platform');
  }
}

export async function addProductsToCartWithSession(session: any, product_urls: string[], variants: Record<string, string>): Promise<{ cart_details: any; final_price: number }> {
  const browser = await launchBrowser();
  const page = await browser.newPage();

  // Restore cookies
  if (session.cookies && Array.isArray(session.cookies)) {
    for (const cookie of session.cookies) {
      await page.setCookie(cookie);
    }
  }

  // Go to the saved URL (or homepage)
  await page.goto(session.url || 'https://www.blinkit.com');

  // Use selectors for the platform
  const platform = session.platform;
  const selectors = (await import('../config/selectors.ts')).selectors[platform];

  for (const url of product_urls) {
    await page.goto(url);
    
    // Handle variant selection
    if (selectors.variantSelector && variants[url]) {
      try {
        // Wait for variant selector to be visible
        await page.waitForSelector(selectors.variantSelector, { visible: true });
        
        // Click the variant selector to open options
        await page.click(selectors.variantSelector);
        
        // Wait for variant container to appear
        await page.waitForSelector(selectors.variantContainer, { visible: true });
        
        // Wait a bit for the variant options to load
        await new Promise(res => setTimeout(res, 500));
        
        // Find and click the desired variant
        const variantText = variants[url];
        const variantElements = await page.$$eval('div.tw-text-300', (elements, targetText) => {
          const element = elements.find(el => el.textContent?.includes(targetText));
          if (element) {
            element.click();
            return true;
          }
          return false;
        }, variantText);
        
        // Wait for variant selection to be applied
        await new Promise(res => setTimeout(res, 500));
      } catch (error) {
        console.error(`Failed to select variant for ${url}:`, error);
      }
    }

    // Add to cart
    await page.waitForSelector(selectors.addToCartButton);
    await page.click(selectors.addToCartButton);
    await new Promise(res => setTimeout(res, 1000));
  }

  // Go to cart page
  await page.goto(selectors.cartPage);
  await page.waitForSelector(selectors.priceDetails);
  
  // Extract cart details and price
  const cart_details = await page.evaluate((selector) => {
    const el = document.querySelector(selector);
    return el ? el.innerText : '';
  }, selectors.priceDetails);

  // For demo, parse price as a number (customize as needed)
  const final_price = parseFloat(cart_details.match(/\d+[.,]?\d*/)?.[0] || '0');

  await browser.close();
  return { cart_details, final_price };
}

// Add more functions for OTP submission, session restore, etc. 