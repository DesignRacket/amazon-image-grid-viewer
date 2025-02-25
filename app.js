document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const imageGrid = document.getElementById('image-grid');
    const loading = document.getElementById('loading');
    const errorMessage = document.getElementById('error-message');

    // Add event listener for the search button
    searchButton.addEventListener('click', performSearch);

    // Add event listener for the Enter key in the search input
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Function to perform the search
    async function performSearch() {
        const searchTerm = searchInput.value.trim();
        
        if (!searchTerm) {
            showError('Please enter a search term');
            return;
        }

        // Clear previous results and errors
        imageGrid.innerHTML = '';
        hideError();
        showLoading();

        try {
            // Call our serverless function to fetch Amazon results
            const response = await fetchAmazonResults(searchTerm);
            displayResults(response);
        } catch (error) {
            showError('An error occurred while fetching results. ' + error.message);
        } finally {
            hideLoading();
        }
    }

    // Function to fetch Amazon results
    async function fetchAmazonResults(searchTerm) {
        try {
            // In a real implementation, this would be your backend API endpoint
            // Since we don't have a real backend, we'll return mock data for demonstration
            
            // Simulate API call with mock data
            return await getMockResults(searchTerm);
        } catch (error) {
            console.error('Error fetching results:', error);
            throw new Error('Failed to fetch Amazon results');
        }
    }

    // Function to get mock results for demonstration purposes
    // In a real app, this would be replaced with actual Amazon scraping
    async function getMockResults(searchTerm) {
        return new Promise((resolve) => {
            // Simulate network delay
            setTimeout(() => {
                const results = [];
                
                // Generate 12 mock products
                for (let i = 1; i <= 12; i++) {
                    results.push({
                        id: `product-${i}`,
                        title: `${searchTerm} - Product ${i}`,
                        // Using placeholder.com to generate mock product images
                        imageUrl: `https://via.placeholder.com/300x300?text=${encodeURIComponent(searchTerm)}+${i}`,
                        price: `$${(Math.random() * 100).toFixed(2)}`,
                        url: '#'
                    });
                }
                
                resolve(results);
            }, 1500);
        });
    }

    // Function to display results in the grid
    function displayResults(products) {
        if (!products || products.length === 0) {
            showError('No results found for your search term');
            return;
        }

        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.className = 'image-item';
            
            const imageElement = document.createElement('img');
            imageElement.src = product.imageUrl;
            imageElement.alt = product.title;
            imageElement.loading = 'lazy'; // Lazy load images
            
            const titleElement = document.createElement('div');
            titleElement.className = 'title';
            titleElement.textContent = product.title;
            
            productElement.appendChild(imageElement);
            productElement.appendChild(titleElement);
            
            imageGrid.appendChild(productElement);
        });
    }

    // Helper functions for UI state
    function showLoading() {
        loading.classList.remove('hidden');
    }

    function hideLoading() {
        loading.classList.add('hidden');
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
    }

    function hideError() {
        errorMessage.classList.add('hidden');
    }
});