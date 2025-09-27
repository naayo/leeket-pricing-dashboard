// Authentication configuration
const AUTH_CONFIG = {
    users: {
        'amy': { password: 'leeketdeamy', role: 'user', hasGoogleSheetsAccess: false },
        'coumba': { password: 'leeketdecoumba', role: 'user', hasGoogleSheetsAccess: false },
        'amyb': { password: 'leeketdemayb', role: 'user', hasGoogleSheetsAccess: false },
        'baila': { password: 'leeketdebaila', role: 'admin', hasGoogleSheetsAccess: true }
    },
    tokenExpiry: {
        normal: 60 * 60 * 1000, // 1 hour
        rememberMe: 7 * 24 * 60 * 60 * 1000 // 7 days
    }
};

// Generate token
function generateToken(username, role) {
    return btoa(JSON.stringify({
        username: username,
        role: role,
        timestamp: Date.now(),
        random: Math.random().toString(36).substring(7)
    }));
}

// Verify token
function verifyToken(token) {
    try {
        const decoded = JSON.parse(atob(token));
        const now = Date.now();
        const session = localStorage.getItem('leeketSession') || sessionStorage.getItem('leeketSession');

        if (session) {
            const sessionData = JSON.parse(session);
            const expiry = sessionData.rememberMe ? AUTH_CONFIG.tokenExpiry.rememberMe : AUTH_CONFIG.tokenExpiry.normal;

            if (now - sessionData.timestamp > expiry) {
                return null; // Token expired
            }
        }

        return decoded;
    } catch (e) {
        return null;
    }
}

// Login function
function login(username, password, rememberMe = false) {
    const normalizedUsername = username.toLowerCase().trim();
    const user = AUTH_CONFIG.users[normalizedUsername];

    if (user && user.password === password) {
        const token = generateToken(normalizedUsername, user.role);

        const sessionData = {
            token: token,
            username: normalizedUsername,
            role: user.role,
            hasGoogleSheetsAccess: user.hasGoogleSheetsAccess,
            timestamp: Date.now(),
            rememberMe: rememberMe
        };

        // Check for custom permissions
        const savedPermissions = localStorage.getItem('leeketUserPermissions');
        if (savedPermissions) {
            try {
                const permissions = JSON.parse(savedPermissions);
                if (permissions[normalizedUsername]) {
                    sessionData.hasGoogleSheetsAccess = permissions[normalizedUsername].hasGoogleSheetsAccess || user.hasGoogleSheetsAccess;
                }
            } catch (e) {
                console.error('Error parsing permissions:', e);
            }
        }

        if (rememberMe) {
            localStorage.setItem('leeketSession', JSON.stringify(sessionData));
        } else {
            sessionStorage.setItem('leeketSession', JSON.stringify(sessionData));
        }

        return true;
    }

    return false;
}

// Logout function
function logout() {
    // Clear all storage
    localStorage.removeItem('leeketSession');
    sessionStorage.removeItem('leeketSession');

    // Redirect to login
    window.location.href = 'index.html';
}

// Check authentication
function isAuthenticated() {
    const session = localStorage.getItem('leeketSession') || sessionStorage.getItem('leeketSession');

    if (!session) {
        return false;
    }

    try {
        const sessionData = JSON.parse(session);
        const now = Date.now();
        const expiry = sessionData.rememberMe ? AUTH_CONFIG.tokenExpiry.rememberMe : AUTH_CONFIG.tokenExpiry.normal;

        if (now - sessionData.timestamp > expiry) {
            logout();
            return false;
        }

        return true;
    } catch (e) {
        return false;
    }
}

// Get current user
function getCurrentUser() {
    const session = localStorage.getItem('leeketSession') || sessionStorage.getItem('leeketSession');

    if (!session) {
        return null;
    }

    try {
        const sessionData = JSON.parse(session);

        // Update permissions if they've changed
        const savedPermissions = localStorage.getItem('leeketUserPermissions');
        if (savedPermissions) {
            try {
                const permissions = JSON.parse(savedPermissions);
                if (permissions[sessionData.username]) {
                    sessionData.hasGoogleSheetsAccess = permissions[sessionData.username].hasGoogleSheetsAccess;
                }
            } catch (e) {
                console.error('Error parsing permissions:', e);
            }
        }

        return {
            username: sessionData.username,
            role: sessionData.role,
            hasGoogleSheetsAccess: sessionData.hasGoogleSheetsAccess,
            timestamp: sessionData.timestamp
        };
    } catch (e) {
        return null;
    }
}

// Check if user has Google Sheets access
function hasGoogleSheetsAccess() {
    const user = getCurrentUser();
    if (!user) return false;

    // Baila always has access
    if (user.username === 'baila') return true;

    // Check saved permissions
    const savedPermissions = localStorage.getItem('leeketUserPermissions');
    if (savedPermissions) {
        try {
            const permissions = JSON.parse(savedPermissions);
            if (permissions[user.username]) {
                return permissions[user.username].hasGoogleSheetsAccess === true;
            }
        } catch (e) {
            console.error('Error checking permissions:', e);
        }
    }

    return false;
}

// Check if user is admin
function isAdmin() {
    const user = getCurrentUser();
    return user && user.role === 'admin';
}

// Require authentication for protected pages
function requireAuth() {
    if (!isAuthenticated()) {
        // Check if we're not already on the login page to avoid loops
        if (!window.location.href.includes('index.html')) {
            window.location.href = 'index.html';
        }
        return false;
    }
    return true;
}