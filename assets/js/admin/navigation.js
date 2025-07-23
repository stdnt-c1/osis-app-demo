import { showNotification } from './utils.js';
import { supabaseClient } from './supabase.js';

export function initializeLogout() {
    document.querySelector('.logout-btn').addEventListener('click', async function() {
        if (confirm('Apakah Anda yakin ingin logout?')) {
            const { error } = await supabaseClient.auth.signOut();
            if (error) {
                showNotification('Gagal logout, coba lagi.', 'error');
            } else {
                sessionStorage.removeItem('adminLoggedIn');
                sessionStorage.removeItem('adminUsername');
                window.location.href = 'login.html';
            }
        }
    });
}

export function initializeMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
    });
    
    // Close sidebar when clicking outside
    document.addEventListener('click', function(e) {
        if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
            sidebar.classList.remove('active');
        }
    });
}

export function initializeNavigation(adminRole) {
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    
    navLinks.forEach(link => {
        const section = link.dataset.section;
        let hasAccess = false;

        switch (adminRole) {
            case 'admin':
                hasAccess = true;
                break;
            case 'editor':
                if (['overview', 'berita', 'galeri', 'saran'].includes(section)) {
                    hasAccess = true;
                }
                break;
            case 'keuangan':
                if (['overview', 'keuangan'].includes(section)) {
                    hasAccess = true;
                }
                break;
            default:
                hasAccess = false;
        }

        if (!hasAccess) {
            link.parentElement.style.display = 'none'; // Hide the list item
        } else {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Update active nav item
                navLinks.forEach(l => l.parentElement.classList.remove('active'));
                this.parentElement.classList.add('active');
                
                // Show corresponding section
                showSection(section);
                
                // Update page title
                updatePageTitle(section);
            });
        }
    });

    // Ensure a default section is shown if the initial active one is hidden
    const firstVisibleLink = document.querySelector('.sidebar-nav li:not([style*="display: none"]) a');
    if (firstVisibleLink) {
        firstVisibleLink.parentElement.classList.add('active');
        showSection(firstVisibleLink.dataset.section);
        updatePageTitle(firstVisibleLink.dataset.section);
    }
}

export function showSection(sectionName) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

export function updatePageTitle(section) {
    const titles = {
        'overview': 'Dashboard Overview',
        'berita': 'Manajemen Berita & Event',
        'galeri': 'Manajemen Galeri',
        'keuangan': 'Manajemen Keuangan',
        'saran': 'Saran & Kritik',
        'users': 'Manajemen Users'
    };
    
    document.getElementById('page-title').textContent = titles[section] || 'Dashboard';
}