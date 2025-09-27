// Data fetcher for Leeket Dashboard
class LeeketDataFetcher {
    constructor() {
        this.cache = null;
        this.cacheTimestamp = null;
        this.cacheDuration = SHEETS_CONFIG.CACHE_DURATION || 5 * 60 * 1000; // 5 minutes default
    }

    // Check if cached data is still valid
    isCacheValid() {
        if (!this.cache || !this.cacheTimestamp) {
            return false;
        }
        return Date.now() - this.cacheTimestamp < this.cacheDuration;
    }

    // Fetch data from Google Sheets
    async fetchFromGoogleSheets() {
        // Check cache first
        if (this.isCacheValid()) {
            console.log('Using cached data');
            return this.cache;
        }

        try {
            // Use the fetchSheetData function from sheets-config.js
            const data = await fetchSheetData();

            // Cache the data
            this.cache = data;
            this.cacheTimestamp = Date.now();

            // Also store in localStorage for persistence
            try {
                localStorage.setItem('leeketSheetCache', JSON.stringify(data));
                localStorage.setItem('leeketSheetCacheTimestamp', this.cacheTimestamp.toString());
            } catch (e) {
                console.warn('Could not cache to localStorage:', e);
            }

            return data;
        } catch (error) {
            console.error('Error fetching from Google Sheets:', error);

            // Try to load from localStorage cache
            const cachedData = localStorage.getItem('leeketSheetCache');
            if (cachedData) {
                console.log('Using localStorage cached data due to fetch error');
                return JSON.parse(cachedData);
            }

            // Fall back to hardcoded data if everything fails
            return this.getFallbackData();
        }
    }

    // Process raw data from sheets into the format expected by the dashboard
    processRawData(rawData) {
        if (!rawData || !Array.isArray(rawData)) {
            return this.getFallbackData();
        }

        const processedData = {
            products: [],
            categories: {},
            summary: {
                totalProducts: 0,
                averageMargin: 0,
                totalRevenue: 0,
                averagePrice: 0
            }
        };

        let totalMargin = 0;
        let totalPrice = 0;

        rawData.forEach((row, index) => {
            // Skip header row if it exists
            if (index === 0 && row['Product'] === 'Product') {
                return;
            }

            const product = {
                name: row['Product'] || row['Produit'] || row['Name'] || `Product ${index}`,
                category: row['Category'] || row['Catégorie'] || 'Uncategorized',
                price: parseFloat(row['Price'] || row['Prix'] || row['Selling Price'] || row['Prix de vente'] || 0),
                cost: parseFloat(row['Cost'] || row['Coût'] || row['Unit Cost'] || row['Coût unitaire'] || 0),
                margin: 0,
                marginPercent: 0,
                quantity: parseInt(row['Quantity'] || row['Quantité'] || row['Stock'] || 1),
                revenue: 0
            };

            // Calculate margin
            if (product.price > 0) {
                product.margin = product.price - product.cost;
                product.marginPercent = ((product.margin / product.price) * 100).toFixed(2);
                product.revenue = product.price * product.quantity;
            }

            // Add to products array
            processedData.products.push(product);

            // Group by category
            if (!processedData.categories[product.category]) {
                processedData.categories[product.category] = {
                    products: [],
                    totalRevenue: 0,
                    averageMargin: 0
                };
            }
            processedData.categories[product.category].products.push(product);
            processedData.categories[product.category].totalRevenue += product.revenue;

            // Update totals
            totalMargin += parseFloat(product.marginPercent);
            totalPrice += product.price;
            processedData.summary.totalRevenue += product.revenue;
        });

        // Calculate averages
        processedData.summary.totalProducts = processedData.products.length;
        if (processedData.summary.totalProducts > 0) {
            processedData.summary.averageMargin = (totalMargin / processedData.summary.totalProducts).toFixed(2);
            processedData.summary.averagePrice = (totalPrice / processedData.summary.totalProducts).toFixed(2);
        }

        // Calculate category averages
        Object.keys(processedData.categories).forEach(category => {
            const categoryData = processedData.categories[category];
            const categoryProducts = categoryData.products;
            if (categoryProducts.length > 0) {
                const totalCategoryMargin = categoryProducts.reduce((sum, p) => sum + parseFloat(p.marginPercent), 0);
                categoryData.averageMargin = (totalCategoryMargin / categoryProducts.length).toFixed(2);
            }
        });

        return processedData;
    }

    // Get fallback data when sheets are not available
    getFallbackData() {
        console.log('Using fallback data');
        return {
            products: [
                {
                    name: 'Thieboudienne',
                    category: 'Plats principaux',
                    price: 15000,
                    cost: 9000,
                    margin: 6000,
                    marginPercent: '40.00',
                    quantity: 50,
                    revenue: 750000
                },
                {
                    name: 'Yassa Poulet',
                    category: 'Plats principaux',
                    price: 12000,
                    cost: 7500,
                    margin: 4500,
                    marginPercent: '37.50',
                    quantity: 45,
                    revenue: 540000
                },
                {
                    name: 'Mafé',
                    category: 'Plats principaux',
                    price: 10000,
                    cost: 6000,
                    margin: 4000,
                    marginPercent: '40.00',
                    quantity: 40,
                    revenue: 400000
                },
                {
                    name: 'Bissap',
                    category: 'Boissons',
                    price: 2000,
                    cost: 800,
                    margin: 1200,
                    marginPercent: '60.00',
                    quantity: 100,
                    revenue: 200000
                },
                {
                    name: 'Jus de Gingembre',
                    category: 'Boissons',
                    price: 2500,
                    cost: 1000,
                    margin: 1500,
                    marginPercent: '60.00',
                    quantity: 80,
                    revenue: 200000
                }
            ],
            categories: {
                'Plats principaux': {
                    products: [],
                    totalRevenue: 1690000,
                    averageMargin: '39.17'
                },
                'Boissons': {
                    products: [],
                    totalRevenue: 400000,
                    averageMargin: '60.00'
                }
            },
            summary: {
                totalProducts: 5,
                averageMargin: '47.50',
                totalRevenue: 2090000,
                averagePrice: '8300.00'
            }
        };
    }

    // Load data (main entry point)
    async loadData() {
        try {
            const rawData = await this.fetchFromGoogleSheets();
            return this.processRawData(rawData);
        } catch (error) {
            console.error('Error loading data:', error);
            return this.getFallbackData();
        }
    }
}

// Create a global instance
const leeketDataFetcher = new LeeketDataFetcher();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LeeketDataFetcher, leeketDataFetcher };
}