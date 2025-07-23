export function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return date.toLocaleDateString('id-ID', options);
}

export function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

export function searchContent(query) {
    const searchResults = [];
    
    // Search in galeri
    // galeriData is not available here, it will be in data.js
    // This function will need to be updated if search is fully implemented
    
    return searchResults;
}
