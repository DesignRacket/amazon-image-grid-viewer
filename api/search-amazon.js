// This is a Vercel serverless function to scrape Amazon search results
// In a production environment, you'd need to handle rate limiting, caching, and other considerations

const https = require('https');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
  // Set CORS headers to allow cross-origin requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request (preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Check if request method is GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get search term from query parameter
  const searchTerm = req.query.q;
  if (!searchTerm) {
    return res.status(400).json({ error: 'Search term is required' });
  }

  try {
    // Fetch Amazon search results
    const products = await scrapeAmazonProducts(searchTerm);
    return res.status(200).json(products);
  } catch (error) {
    console.error('Error scraping Amazon:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch Amazon products',
      details: error.message
    });
  }
};

// Function to scrape Amazon search results
async function scrapeAmazonProducts(searchTerm) {
  return new Promise((resolve, reject) => {
    // Format the search term for URL
    const formattedSearchTerm = encodeURIComponent(searchTerm);
    
    // Amazon search URL
    const url = `https://www.amazon.com/s?k=${formattedSearchTerm}`;
    
    // Options for the HTTPS request
    // Add user agent to avoid being blocked
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Cache-Control': 'max-age=0'
      }
    };

    // Make the request to Amazon
    https.get(url, options, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        reject(new Error('Redirect received, consider using a headless browser or a proxy service'));
        return;
      }

      let data = '';

      // A chunk of data has been received
      response.on('data', (chunk) => {
        data += chunk;
      });

      // The whole response has been received
      response.on('end', () => {
        try {
          // Parse the HTML response with Cheerio
          const $ = cheerio.load(data);
          const products = [];

          // Find product elements
          // This selector may need to be updated as Amazon changes their page structure
          $('.s-result-item[data-component-type="s-search-result"]').each((i, el) => {
            if (products.length >= 12) return false; // Only get 12 results

            // Extract product details
            const title = $(el).find('h2 .a-link-normal').text().trim();
            const imageUrl = $(el).find('img.s-image').attr('src');
            const link = 'https://www.amazon.com' + $(el).find('h2 .a-link-normal').attr('href');
            
            // Check if we have necessary data
            if (title && imageUrl) {
              products.push({
                id: i,
                title,
                imageUrl,
                url: link
              });
            }
          });

          if (products.length === 0) {
            reject(new Error('No products found or Amazon blocked the request'));
          } else {
            resolve(products);
          }
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}