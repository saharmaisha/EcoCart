import { startAmazonScraping } from '../../services/amazonService';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { amazonEmail, amazonPassword } = req.body;

    if (!amazonEmail || !amazonPassword) {
      return res.status(400).json({ error: 'Amazon email and password are required.' });
    }

    try {
      // Pass the credentials to the scraping service
      const results = await startAmazonScraping(amazonEmail, amazonPassword);
      res.status(200).json({ success: true, data: results });
    } catch (error) {
      console.error('Error during scraping:', error);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: error.message,
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
