// Simple Google Sheets Integration for Leeket Dashboard
// Direct and simple approach - no complex caching or sync

const SHEETS = {
    // Configuration
    config: {
        sheetId: '1Mdss7oPMA-FuXsNVAtJBTeF15UQLZNy6',
        sheetName: 'prix',
        apiKey: 'AIzaSyBNlYH01_9Hc5S1J9vuFmu2nUqBZJNAXxs'
    },

    // Fallback data when Sheets not available
    fallbackData: [
        { name: 'Thieboudienne', price: 15000, cost: 9000, category: 'Plats principaux' },
        { name: 'Yassa Poulet', price: 12000, cost: 7500, category: 'Plats principaux' },
        { name: 'Mafé', price: 10000, cost: 6000, category: 'Plats principaux' },
        { name: 'Bissap', price: 2000, cost: 800, category: 'Boissons' },
        { name: 'Jus de Gingembre', price: 2500, cost: 1000, category: 'Boissons' }
    ],

    // Load data (from Sheets or fallback)
    async loadData() {
        console.log('Loading data...');

        // Try Google Sheets first if user has access
        if (window.AUTH && window.AUTH.hasGoogleSheetsAccess()) {
            try {
                const data = await this.fetchFromGoogleSheets();
                if (data && data.length > 0) {
                    console.log('Loaded', data.length, 'products from Google Sheets');
                    return this.processSheetData(data);
                }
            } catch (error) {
                console.error('Google Sheets error:', error);
            }
        }

        // Return fallback data
        console.log('Using fallback data');
        return this.processFallbackData();
    },

    // Fetch from Google Sheets
    async fetchFromGoogleSheets() {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.config.sheetId}/values/${this.config.sheetName}?key=${this.config.apiKey}`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch sheet data');
        }

        const data = await response.json();
        return data.values || [];
    },

    // Process Google Sheets data
    processSheetData(rows) {
        const products = [];

        // Skip header row
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            if (!row || row.length < 2) continue;

            const product = {
                name: row[0] || 'Sans nom',
                price: this.parsePrice(row[1]),
                cost: this.parsePrice(row[2]) || 0,
                category: row[3] || 'Non catégorisé'
            };

            // Calculate margin
            if (product.cost === 0 && product.price > 0) {
                product.cost = product.price * 0.65; // Estimate 65% cost
            }
            product.margin = ((product.price - product.cost) / product.price * 100).toFixed(0);

            products.push(product);
        }

        return products;
    },

    // Process fallback data
    processFallbackData() {
        return this.fallbackData.map(item => ({
            ...item,
            margin: ((item.price - item.cost) / item.price * 100).toFixed(0)
        }));
    },

    // Parse price from various formats
    parsePrice(value) {
        if (!value) return 0;

        // Remove all non-numeric characters except digits
        const cleaned = String(value).replace(/[^\d]/g, '');
        return parseInt(cleaned) || 0;
    }
};

// Make available globally
window.SHEETS = SHEETS;