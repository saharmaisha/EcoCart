// Importing OpenAI
const OpenAI = require('openai');
const { chromium } = require('playwright');

let globalBrowser;
let globalBrowserContext;
let globalPage;

const baseUrl = 'https://www.amazon.com';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function initBrowser() {
  if (!globalBrowser) {
    globalBrowser = await chromium.launch({
      headless: false,
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
      await globalPage.goto('https://www.amazon.com/ap/signin?openid.pape.max_auth_age=0&openid.return_to=https%3A%2F%2Fwww.amazon.com%2F%3Fref_%3Dnav_signin&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.assoc_handle=usflex&openid.mode=checkid_setup&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0', { waitUntil: 'domcontentloaded' });
  
      if (await globalPage.isVisible('#ap_email')) {
        await globalPage.fill('#ap_email', email);
        await globalPage.click('#continue');
        await globalPage.waitForNavigation({ timeout: 5000 }).catch(() => console.log('Navigation after continue timed out'));
      }
  
      await globalPage.fill('#ap_password', password);
      await globalPage.click('#signInSubmit');
  
      console.log('Waiting for user to interact with the page for additional inputs...');
      let isLoggedIn = false;
      while (!isLoggedIn) {
        isLoggedIn = await globalPage.isVisible('#nav-orders');
        if (!isLoggedIn) {
          console.log('Waiting for user to complete login. Please enter any required details (CAPTCHA, OTP, etc.) manually...');
          await globalPage.waitForTimeout(5000);
        }
      }
  
      console.log('Login successful, proceeding to the scraping process.');
      return true;
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    }
  }

async function generateSustainabilityScore(ingredients) {
    try {
      console.log('Generating sustainability score for ingredients:', ingredients);
  
      const prompt = `Based on the following ingredients: ${ingredients}, 
      Rate the product's sustainability on a scale of 1 to 10. Provide the number only with no explanation on the first line. 
      List the good (sustainable) ingredients in one sentence. 
      List the bad (unsustainable) ingredients in one sentence.
      
      Each of the answers to those prompts should be on a new line.`;
  
      console.log('Prompt being sent to OpenAI:', prompt);
  
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
      });
  
      console.log('OpenAI API response:', JSON.stringify(response, null, 2));
  
      // Extract message content
      const messageContent = response.choices[0].message.content;
      console.log('Message content:', messageContent);
  
      // Extract the sustainability score, good ingredients, and bad ingredients using regex or split by lines
      const [scoreLine, goodIngredientsLine, badIngredientsLine] = messageContent.split('\n').filter(line => line.trim());
  
      const scoreMatch = scoreLine.match(/\d+(\.\d+)?/);
      const sustainabilityScore = scoreMatch ? parseFloat(scoreMatch[0]) : 5; // Default to 5 if no score found
      const goodIngredients = goodIngredientsLine || 'Good ingredients not found';
      const badIngredients = badIngredientsLine || 'Bad ingredients not found';
  
      return {
        sustainabilityScore,
        goodIngredients,
        badIngredients
      };
    } catch (error) {
      console.error('Error generating sustainability score:', error);
      return {
        sustainabilityScore: 5, // Default score in case of error
        goodIngredients: 'Unable to determine good ingredients',
        badIngredients: 'Unable to determine bad ingredients'
      };
    }
  }
  
  // Generate alternative product recommendations using OpenAI
  async function generateRecommendations(productName) {
    try {
      const prompt = `Based on the product "${productName}", recommend three alternative, more sustainable products. Provide the names of these products and brief descriptions in the format of name:description with a new line between each. Do NOT number, bullet point, or dash your response.`;
  
      console.log('Prompt for recommendations:', prompt);
  
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
      });
  
      const messageContent = response.choices[0].message.content;
      console.log('Recommendation response:', messageContent);
  
      // Parse the response to extract the recommended products (assuming OpenAI returns a newline-separated list of recommendations)
      const recommendations = messageContent.split('\n').filter(rec => rec.trim() !== '').slice(0, 3);
  
      return recommendations;
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return ['Alternative Product 1', 'Alternative Product 2', 'Alternative Product 3']; // Fallback recommendations
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
      await globalPage.goto(`${baseUrl}/gp/cart/view.html`, {
        waitUntil: 'domcontentloaded',
        timeout: 120000,
      });
  
      // Extract product links from the cart page
      const productLinks = await globalPage.$$eval(
        '#sc-active-cart .sc-item-product-title-cont .a-list-item a',
        (links) => links.map((link) => link.href)
      );
  
      if (productLinks.length === 0) {
        console.warn('No product links found. The cart might be empty.');
        return [];
      }
  
      const results = [];
  
      // Iterate over each product link and scrape data
      for (const productUrl of productLinks) {
        try {
          console.log(`Navigating to product page: ${productUrl}`);
          await globalPage.goto(productUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
  
          // Scrape the product name and ingredients
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
  
          // Generate the sustainability score
          const { sustainabilityScore, goodIngredients, badIngredients } = await generateSustainabilityScore(pageInfo.ingredients);
  
          // Generate recommendations if the sustainability score is less than 5
          let recommendations = [];
          if (sustainabilityScore < 5) {
            recommendations = await generateRecommendations(pageInfo.productName);
          }
  
          // Push the product info along with the sustainability score, good/bad ingredients, and recommendations (if any)
          results.push({
            url: productUrl,
            ...pageInfo,
            sustainabilityScore,
            goodIngredients,
            badIngredients,
            recommendations
          });
        } catch (error) {
          console.error(`Error scraping product ${productUrl}:`, error.message);
          results.push({
            url: productUrl,
            productName: 'Error: Unable to scrape',
            ingredients: 'Error: Unable to scrape',
            sustainabilityScore: 'N/A',
            goodIngredients: 'N/A',
            badIngredients: 'N/A',
            recommendations: []
          });
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
