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
            // In production, use the real API endpoint
            // For development/demo purposes, we'll use mock data
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
            // Check if we're in a production environment
            const isProduction = window.location.hostname !== 'localhost' && 
                                window.location.hostname !== '127.0.0.1';
            
            if (isProduction) {
                // Call the serverless function
                const apiUrl = `/api/search-amazon?q=${encodeURIComponent(searchTerm)}`;
                const response = await fetch(apiUrl);
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to fetch results');
                }
                
                return await response.json();
            } else {
                // In development or demo, use mock data
                return await getMockResults(searchTerm);
            }
        } catch (error) {
            console.error('Error fetching results:', error);
            throw new Error('Failed to fetch Amazon results');
        }
    }

    // Function to get mock results for demonstration purposes
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
            
            // Optional: Make the product clickable to go to Amazon
            if (product.url && product.url !== '#') {
                productElement.style.cursor = 'pointer';
                productElement.addEventListener('click', () => {
                    window.open(product.url, '_blank');
                });
            }
            
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