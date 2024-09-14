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
      console.error('Login failed, aborting scraping.');
      return { error: 'Login failed' };
    }

    console.log('Navigating to the Amazon cart page...');
    await globalPage.goto(`${baseUrl}/gp/cart/view.html?ref_=nav_cart`, {
      waitUntil: 'domcontentloaded',
      timeout: 120000, // Increased timeout to 120 seconds
    });

    // Log the page content to see what the structure looks like
    const pageContent = await globalPage.content();
    console.log('Page content loaded. Checking product links...');

    // Log specific HTML section to ensure we are in the right area
    const cartContent = await globalPage.$eval('#sc-active-cart', (element) => element.outerHTML);
    console.log('Cart content HTML:', cartContent); // Logs the HTML content of the cart column

    // Scrape product URLs from the cart page
    const productLinks = await globalPage.$$eval('#sc-active-cart .sc-item-product-title-cont .a-list-item a', (links) =>
      links.map((link) => link.href)
    );

    console.log(`Found ${productLinks.length} product links.`); // Log the number of product links found

    if (productLinks.length === 0) {
      console.warn('No product links found. The cart might be empty or the page structure has changed.');
    } else {
      console.log('Product Links:', productLinks); // Log the list of product links
    }

    const results = [];

    for (const productUrl of productLinks) {
        try {
            console.log(`Navigating to product page: ${productUrl}`);
            await globalPage.goto(productUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
            
            // Detailed logging and scraping attempt
            const pageInfo = await globalPage.evaluate(() => {
                const importantInfoDiv = document.querySelector('#importantInformation_feature_div');
                let log = '';
                let ingredients = 'Ingredients not found';
    
                if (importantInfoDiv) {
                    log += 'Found #importantInformation_feature_div\n';
                    const contentSections = importantInfoDiv.querySelectorAll('.a-section.content');
                    log += `Found ${contentSections.length} .a-section.content elements\n`;
    
                    contentSections.forEach((section, index) => {
                        const header = section.querySelector('h4');
                        if (header) {
                            log += `Section ${index + 1} header: ${header.innerText}\n`;
                            if (header.innerText === 'Ingredients') {
                                const paragraphs = section.querySelectorAll('p');
                                log += `Found ${paragraphs.length} paragraphs in Ingredients section\n`;
                                paragraphs.forEach((p, pIndex) => {
                                    log += `Paragraph ${pIndex + 1} content: ${p.innerText}\n`;
                                    if (p.innerText.trim() !== '') {
                                        ingredients = p.innerText.trim();
                                    }
                                });
                            }
                        } else {
                            log += `Section ${index + 1} has no h4 header\n`;
                        }
                    });
                } else {
                    log += '#importantInformation_feature_div not found\n';
                }
    
                return { log, ingredients };
            });
            
            console.log(`Detailed log for ${productUrl}:\n${pageInfo.log}`);
            console.log(`Ingredients for ${productUrl}: ${pageInfo.ingredients}`);
            results.push({ url: productUrl, ingredients: pageInfo.ingredients });
        } catch (error) {
            console.error(`Error scraping product ${productUrl}:`, error.message);
            results.push({ url: productUrl, ingredients: 'Error: Unable to scrape' });
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
