import { initializeSlider } from './slider.js';
import { initializeGaleri } from './gallery.js';
import { initializeBerita } from './news.js';
import { initializeKeuangan } from './finance.js';
import { initializeTabSwitcher, initializeNavigation, initializeFadeInAnimation } from './navigation.js';
import { initializeSaranForm } from './suggestions.js';
import { initializePushNotifications } from './push-notifications.js';
import { formatDate, formatCurrency, searchContent } from './utils.js';

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeSlider();
    initializeGaleri();
    initializeBerita();
    initializeKeuangan();
    initializeTabSwitcher();
    initializeSaranForm();
    initializeNavigation();
    initializeFadeInAnimation();
    initializePushNotifications();
});

// Export functions and data for admin use (if needed, though admin has its own data)
window.osisApp = {
    galeriData,
    beritaData,
    transaksiData,
    formatDate,
    formatCurrency,
    searchContent
};