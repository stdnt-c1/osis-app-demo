
import { initializeNavigation, initializeMobileMenu, initializeLogout } from './navigation.js';
import { initializeOverview } from './overview.js';
import { initializeBeritaSection } from './berita.js';
import { initializeGaleriSection } from './gallery.js';
import { initializeKeuanganSection } from './finance.js';
import { initializeSaranSection } from './suggestions.js';
import { initializeUsersSection } from './users.js';
import { initializeForms } from './forms.js';

// Admin Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if (sessionStorage.getItem('adminLoggedIn') !== 'true') {
        window.location.href = 'login.html';
        return;
    }
    
    // Initialize admin dashboard
    initializeAdminDashboard();
});

// Initialize admin dashboard
function initializeAdminDashboard() {
    const adminRole = sessionStorage.getItem('adminRole') || 'default';

    // Set username
    document.getElementById('username').textContent = sessionStorage.getItem('adminUsername') || 'Admin';
    
    // Initialize navigation with role
    initializeNavigation(adminRole);
    
    // Initialize stats
    initializeOverview();
    
    // Initialize sections based on role
    if (adminRole === 'admin' || adminRole === 'editor') {
        initializeBeritaSection();
        initializeGaleriSection();
        initializeSaranSection();
    }
    if (adminRole === 'admin' || adminRole === 'keuangan') {
        initializeKeuanganSection();
    }
    if (adminRole === 'admin') {
        initializeUsersSection();
    }
    
    // Initialize forms
    initializeForms();
    
    // Initialize logout
    initializeLogout();
    
    // Initialize mobile menu
    initializeMobileMenu();
}
