# **EcoCart - Amazon Scraper with Sustainability Score**

EcoCart is a AI-enabled tool that analyzes the ingredients of products you shop for on amazon. We use AI to generate a sustainability score, highlight good (sustainable) ingredients, and bad (unsustainable) ingredients for each product based on its ingredient list.

## **Features**
- Secure login using Clerk for authentication.
- Automates login to Amazon and scraping of product details from the cart.
- Extracts product names and ingredients from each product page.
- Sends ingredients to OpenAI to generate a sustainability score, list good ingredients, and list bad ingredients.
- Displays the results in a front-end web page.
  
## **Technologies Used**
- **Node.js**: For backend scripting and automation.
- **Playwright**: For browser automation to scrape Amazon.
- **OpenAI API**: To generate sustainability scores and identify good and bad ingredients.
- **React.js**: For front-end display of the scraped results.
  
## **Setup Instructions**

### **Prerequisites**
- Node.js v14+ installed on your system.
- A valid OpenAI API key.
- An Amazon account with items in the shopping cart.

### **1. Clone the repository**
```bash
git clone https://github.com/yourusername/EcoCart.git
cd EcoCart
```

### **2. Install dependencies**
Run the following command in the project root to install all required packages:

```bash
npm install
```

### **3. Environment Variables**
Create a `.env.local` file in the root directory and set up your environment variables like so:

```bash
OPENAI_API_KEY=your-openai-api-key
```

### **4. Run the Application**

#### **Backend:**
To start the backend scraper (including Playwright and OpenAI API integration), run the following command:

```bash
node scraper.js
```

#### **Frontend:**
To run the Next.js frontend to display results:

```bash
npm run dev
```

Then open your browser and navigate to `http://localhost:3000` to see the results.

## **How it Works**
1. **Login to Amazon**: The scraper uses Playwright to automate the Amazon login process. After the user is logged in, it navigates to the shopping cart page.
  
2. **Scraping Products**: The scraper extracts product links from the Amazon cart and navigates to each product page to extract the product name and its ingredients (if available).

3. **Generating Sustainability Score**: The list of ingredients is sent to the OpenAI API, which responds with:
   - A sustainability score (on a scale of 1-10).
   - A list of good (sustainable) ingredients.
   - A list of bad (unsustainable) ingredients.

4. **Display Results**: The scraped products, along with their sustainability score, good ingredients, and bad ingredients, are displayed in a web interface built using Next.js.

## **Example Output**

On the frontend, each product will display:
- Product Name
- Ingredients
- Sustainability Score
- Good Ingredients
- Bad Ingredients
- A link to view the product on Amazon

## **Project Structure**

```
.
├── pages/                # Frontend pages
│   └── index.js          # Landing page
│   └── results.js        # Display results
├── styles/               # Styling for the frontend
├── scraper.js            # The main backend scraper
├── package.json          # Project dependencies
├── .env.local            # Environment variables file
└── README.md             # Project documentation
```

## **Important Notes**
- **Amazon CAPTCHA/OTP**: If Amazon prompts you for CAPTCHA or OTP, you must manually handle this as the script waits for user input during such cases.
- **Data Privacy**: Make sure not to share or expose your `.env.local` file, as it contains sensitive information like your Amazon login and OpenAI API key.

## **Future Enhancements**
- Include support for other e-commerce platforms.
- Provide recommendations of alternative products for sustainability scores lower than 5.
- Store and compare historical sustainability scores over time.
  
## **License**
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.