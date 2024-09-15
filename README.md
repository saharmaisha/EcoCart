# **EcoCart - Find Greener, Better Products Instantly**

EcoCart is an AI-enabled tool that analyzes the ingredients of products you shop for on Amazon. By leveraging web scraping, it generates sustainability scores for each product in your Amazon cart, highlights good (sustainable) ingredients, and bad (unsustainable) ingredients. For products with a sustainability score below 5, EcoCart's recommendation system provides more sustainable alternatives to shop for instead.

## **Features**
- **Secure Authentication**: Utilizes Clerk for secure and streamlined authentication, ensuring user login is protected.
- **Automated Web Scraping**: Uses Playwright for browser automation to log in to Amazon, scrape product details (name, ingredients, etc.), and extract relevant data from the shopping cart.
- **AI-Powered Analysis**: Sends product ingredients to OpenAI's GPT-3.5-turbo model to generate sustainability scores and classify ingredients as good or bad based on their environmental impact.
- **User-Friendly Interface**: Displays all scraped and AI-analyzed data, including product names, ingredients, sustainability scores, and suggestions, in a clean, intuitive web interface.
- **Recommendation System**: Products with sustainability scores lower than 5 trigger an AI-powered recommendation system that suggests more sustainable alternatives based on ingredient data.

## **Technologies Used**
- **Node.js**: Handles backend scripting, including the scraping logic and interactions with the OpenAI API.
- **Playwright**: Facilitates browser automation, allowing the tool to navigate Amazon, log in, and scrape product data.
- **OpenAI API**: Generates sustainability scores, identifies good and bad ingredients, and powers the recommendation system for unsustainable products.
- **Clerk**: Secures user authentication, providing a streamlined login experience.
- **Next.js**: Used for the frontend to display results, providing a modern, responsive user experience.

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
CLERK_API_KEY=your-clerk-api-key
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
1. **Login to Amazon**: The scraper uses Playwright to automate the Amazon login process. After the user logs in, it navigates to the shopping cart page.

2. **Scraping Products**: The scraper extracts product links from the Amazon cart and navigates to each product page to extract product names and ingredients (if available).

3. **Generating Sustainability Score**: The list of ingredients is sent to the OpenAI API, which responds with:
   - A sustainability score (on a scale of 1-10).
   - A list of good (sustainable) ingredients.
   - A list of bad (unsustainable) ingredients.
   
4. **AI Recommendation System**: For products with a sustainability score lower than 5, the AI system recommends alternative, more sustainable options based on ingredient analysis, providing users with eco-friendlier choices.

5. **Display Results**: All the scraped data, including product names, ingredients, sustainability scores, and alternative product suggestions, are displayed on the Next.js-powered web interface.

## **Important Notes**
- **Amazon CAPTCHA/OTP**: If Amazon prompts you for CAPTCHA or OTP, you must manually handle this as the script waits for user input during such cases.
- **Data Privacy**: Make sure not to share or expose your `.env.local` file, as it contains sensitive information like your Amazon login and OpenAI API key.

## **Future Enhancements**
- Expand support to additional e-commerce platforms beyond Amazon.
- Enhance the AI recommendation system to provide more detailed alternatives for low-scoring products.
- Introduce a feature that tracks and compares historical sustainability scores over time, helping users make progressively better shopping decisions.