// Google Sheets Configuration
const SHEETS_CONFIG = {
	// Default Sheet ID (can be updated via configuration page)
	SHEET_ID: '1Mdss7oPMA-FuXsNVAtJBTeF15UQLZNy6',

	// Sheet name
	SHEET_NAME: 'prix',

	// API configuration
	API_KEY: 'AIzaSyBNlYH01_9Hc5S1J9vuFmu2nUqBZJNAXxs', // Public API key for Sheets API

	// Cache configuration
	CACHE_DURATION: 5 * 60 * 1000, // 5 minutes cache

	// Auto-sync interval
	SYNC_INTERVAL: 5 * 60 * 1000, // 5 minutes
};

// Load saved configuration
function loadSheetConfig() {
	const saved = localStorage.getItem('leeketGoogleSheetConfig');
	if (saved) {
		try {
			const config = JSON.parse(saved);
			SHEETS_CONFIG.SHEET_ID = config.sheetId || '';
			SHEETS_CONFIG.SHEET_NAME = config.sheetName || 'prix';
			return true;
		} catch (e) {
			console.error('Error loading sheet config:', e);
		}
	}
	return false;
}

// Save configuration
function saveSheetConfig(sheetId, sheetName = 'prix') {
	const config = {
		sheetId: sheetId,
		sheetName: sheetName,
		csvUrl: `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${sheetName}`,
		jsonUrl: `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${sheetName}`,
	};

	localStorage.setItem('leeketGoogleSheetConfig', JSON.stringify(config));
	SHEETS_CONFIG.SHEET_ID = sheetId;
	SHEETS_CONFIG.SHEET_NAME = sheetName;

	return config;
}

// Get Google Sheets API URL
function getSheetURL() {
	if (!SHEETS_CONFIG.SHEET_ID) {
		return null;
	}

	const baseURL = 'https://sheets.googleapis.com/v4/spreadsheets';
	const sheetId = SHEETS_CONFIG.SHEET_ID;
	const sheetName = SHEETS_CONFIG.SHEET_NAME;
	const apiKey = SHEETS_CONFIG.API_KEY;

	if (apiKey) {
		return `${baseURL}/${sheetId}/values/${sheetName}?key=${apiKey}`;
	} else {
		// Fallback to public JSON export
		return `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${sheetName}`;
	}
}

// Get CSV export URL
function getCSVExportURL() {
	if (!SHEETS_CONFIG.SHEET_ID) {
		return null;
	}
	return `https://docs.google.com/spreadsheets/d/${SHEETS_CONFIG.SHEET_ID}/export?format=csv`;
}

// Fetch data from Google Sheets
async function fetchSheetData() {
	const url = getSheetURL();
	if (!url) {
		throw new Error('No Google Sheet configured');
	}

	try {
		const response = await fetch(url);

		if (!response.ok) {
			// Try CSV as fallback
			const csvUrl = getCSVExportURL();
			if (csvUrl) {
				const csvResponse = await fetch(csvUrl);
				if (csvResponse.ok) {
					const csvText = await csvResponse.text();
					return parseCSV(csvText);
				}
			}
			throw new Error('Failed to fetch sheet data');
		}

		const text = await response.text();

		// Check if it's Google Visualization API response
		if (text.startsWith('/*O_o*/') || text.includes('google.visualization.Query')) {
			return parseGoogleVisualizationResponse(text);
		} else {
			// It's standard Sheets API JSON
			const data = JSON.parse(text);
			return parseSheetAPIResponse(data);
		}
	} catch (error) {
		console.error('Error fetching sheet data:', error);
		throw error;
	}
}

// Parse Google Visualization API response
function parseGoogleVisualizationResponse(text) {
	// Remove the JavaScript wrapper
	const jsonString = text.replace(/^.*?({.*}).*?$/, '$1');

	try {
		const data = JSON.parse(jsonString);
		const rows = data.table.rows;
		const cols = data.table.cols;

		const result = [];
		const headers = cols.map(col => col.label || '');

		rows.forEach(row => {
			const rowData = {};
			row.c.forEach((cell, index) => {
				const header = headers[index] || `col${index}`;
				rowData[header] = cell ? cell.v || '' : '';
			});
			result.push(rowData);
		});

		return result;
	} catch (e) {
		console.error('Error parsing Google Visualization response:', e);
		return [];
	}
}

// Parse Sheets API response
function parseSheetAPIResponse(data) {
	if (!data.values || data.values.length < 2) {
		return [];
	}

	const headers = data.values[0];
	const rows = data.values.slice(1);

	return rows.map(row => {
		const rowData = {};
		headers.forEach((header, index) => {
			rowData[header] = row[index] || '';
		});
		return rowData;
	});
}

// Parse CSV text
function parseCSV(csvText) {
	const lines = csvText.split('\n');
	if (lines.length < 2) return [];

	const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
	const result = [];

	for (let i = 1; i < lines.length; i++) {
		if (lines[i].trim()) {
			const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
			const row = {};
			headers.forEach((header, index) => {
				row[header] = values[index] || '';
			});
			result.push(row);
		}
	}

	return result;
}

// Check if Google Sheets is configured
function isSheetConfigured() {
	return loadSheetConfig() && SHEETS_CONFIG.SHEET_ID;
}

// Initialize on load
loadSheetConfig();
