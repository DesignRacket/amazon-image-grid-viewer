# Amazon Image Grid Viewer

A simple web application that allows users to search for Amazon products and view the top 12 organic search results as images in a grid.

## Features

- Enter a search term in the search box
- Fetch top 12 organic search results from Amazon
- Display product images in a responsive grid
- View product titles
- Responsive design for mobile and desktop

## Live Demo

You can deploy this application to Vercel with your own account.

## How It Works

1. The user enters a search term in the search box
2. The application fetches the top 12 organic search results from Amazon
3. The product images are displayed in a responsive grid
4. The user can click on a product to visit its Amazon page

## Technology Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js with Vercel Serverless Functions
- Web Scraping: Cheerio.js for HTML parsing

## Local Development

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Setup

1. Clone the repository:
   ```
   git clone https://github.com/DesignRacket/amazon-image-grid-viewer.git
   cd amazon-image-grid-viewer
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Deployment

### Deploy to Vercel

1. Install Vercel CLI if you haven't already:
   ```
   npm install -g vercel
   ```

2. Deploy to Vercel:
   ```
   vercel
   ```

3. For production deployment:
   ```
   vercel --prod
   ```

## Important Notes

- This application is for educational purposes only
- Amazon may block requests if they detect scraping activity
- Consider Amazon's terms of service regarding web scraping before using this application
- For a production app, you should implement rate limiting, caching, and proxy rotation

## License

MIT License
