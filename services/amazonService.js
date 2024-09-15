const { chromium } = require('playwright');

let globalBrowser;
let globalBrowserContext;
let globalPage;

const baseUrl = 'https://www.amazon.com';

// Initialize the browser
async function initBrowser() {
  if (!globalBrowser) {
    globalBrowser = await chromium.launch({
      headless: false, // Use headless mode if you don't want the browser UI
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    globalBrowserContext = await globalBrowser.newContext({
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    });
    globalPage = await globalBrowserContext.newPage();
  }
}

// Close the browser
async function closeBrowser() {
  if (globalBrowser) {
    await globalBrowser.close();
    globalBrowser = null;
    globalBrowserContext = null;
    globalPage = null;
  }
}

// Login to Amazon
async function loginToAmazon(email, password) {
  await initBrowser();

  try {
    // Go to the Amazon login page
    await globalPage.goto('https://www.amazon.com/ap/signin?openid.pape.max_auth_age=0&openid.return_to=https%3A%2F%2Fwww.amazon.com%2F%3Fref_%3Dnav_signin&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.assoc_handle=usflex&openid.mode=checkid_setup&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0', { waitUntil: 'domcontentloaded' });

    if (await globalPage.isVisible('#ap_email')) {
      await globalPage.fill('#ap_email', email);
      await globalPage.click('#continue');
      await globalPage.waitForNavigation({ timeout: 5000 }).catch(() => console.log('Navigation after continue timed out'));
    }

    await globalPage.fill('#ap_password', password);
    await globalPage.click('#signInSubmit');

    // After clicking sign-in, we need to wait for user interaction if Amazon asks for CAPTCHA or OTP
    console.log('Waiting for user to interact with the page for additional inputs...');

    // We keep checking if the user has successfully logged in by monitoring the existence of #nav-orders element
    let isLoggedIn = false;
    while (!isLoggedIn) {
      isLoggedIn = await globalPage.isVisible('#nav-orders');
      if (!isLoggedIn) {
        console.log('Waiting for user to complete login. Please enter any required details (CAPTCHA, OTP, etc.) manually...');
        await globalPage.waitForTimeout(5000); // Wait 5 seconds before rechecking the login status
      }
    }

    console.log('Login successful, proceeding to the scraping process.');
    return true; // The user has successfully logged in
  } catch (error) {
    console.error('Error during login:', error);
    return false;
  }
}

// Scraping function
async function startAmazonScraping(email, password) {
    try {
      const isLoggedIn = await loginToAmazon(email, password);
      if (!isLoggedIn) {
        return { error: 'Login failed' };
      }
  
      console.log('Navigating to the Amazon cart page...');
      await globalPage.goto(`${baseUrl}/gp/cart/view.html`, { waitUntil: 'domcontentloaded', timeout: 120000 });
  
      const productLinks = await globalPage.$$eval('#sc-active-cart .sc-item-product-title-cont .a-list-item a', (links) =>
        links.map((link) => link.href)
      );
  
      if (productLinks.length === 0) {
        console.warn('No product links found.');
        return [];
      }
  
      const results = [];
      for (const productUrl of productLinks) {
        try {
          await globalPage.goto(productUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
  
          const pageInfo = await globalPage.evaluate(() => {
            let productName = document.querySelector('#productTitle')?.innerText?.trim() || 'Product name not found';
            let ingredients = 'Ingredients not found';
            const importantInfoDiv = document.querySelector('#importantInformation_feature_div');
            if (importantInfoDiv) {
              const contentSections = importantInfoDiv.querySelectorAll('.a-section.content');
              contentSections.forEach((section) => {
                const header = section.querySelector('h4');
                if (header && header.innerText === 'Ingredients') {
                  const paragraphs = section.querySelectorAll('p');
                  paragraphs.forEach((p) => {
                    if (p.innerText.trim()) {
                      ingredients = p.innerText.trim();
                    }
                  });
                }
              });
            }
            return { productName, ingredients };
          });
  
          results.push({ url: productUrl, ...pageInfo });
        } catch (error) {
          console.error(`Error scraping product ${productUrl}:`, error.message);
          results.push({ url: productUrl, productName: 'Error: Unable to scrape', ingredients: 'Error: Unable to scrape' });
        }
      }
  
      return results;
    } catch (error) {
      console.error('Error during scraping:', error.message);
      throw error;
    } finally {
      await closeBrowser();
    }
  }
  
  module.exports = {
    startAmazonScraping,
    loginToAmazon,
  };
  