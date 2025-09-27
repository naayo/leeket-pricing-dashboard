// Simple Authentication System for Leeket Dashboard
// No complex redirects, no loops, just simple and functional

const AUTH = {
    // User credentials
    users: {
        'amy': { password: 'leeketdeamy', role: 'user' },
        'coumba': { password: 'leeketdecoumba', role: 'user' },
        'amyb': { password: 'leeketdemayb', role: 'user' },
        'baila': { password: 'leeketdebaila', role: 'admin' }
    },

    // Check if user is logged in
    isLoggedIn() {
        const session = localStorage.getItem('leeketUser');
        if (!session) return false;

        try {
            const user = JSON.parse(session);
            return user && user.username && user.timestamp;
        } catch {
            return false;
        }
    },

    // Get current user
    getCurrentUser() {
        const session = localStorage.getItem('leeketUser');
        if (!session) return null;

        try {
            return JSON.parse(session);
        } catch {
            return null;
        }
    },

    // Login
    login(username, password) {
        const user = this.users[username.toLowerCase().trim()];

        if (user && user.password === password) {
            const sessionData = {
                username: username.toLowerCase().trim(),
                role: user.role,
                timestamp: Date.now()
            };

            localStorage.setItem('leeketUser', JSON.stringify(sessionData));
            return true;
        }

        return false;
    },

    // Logout
    logout() {
        localStorage.removeItem('leeketUser');
        window.location.href = 'index.html';
    },

    // Check if user has Google Sheets access (only baila)
    hasGoogleSheetsAccess() {
        const user = this.getCurrentUser();
        return user && user.username === 'baila';
    }
};

// Make available globally
window.AUTH = AUTH;