
import { formatDate } from './utils.js';

const defaultBeritaData = [
    {
        id: 1,
        title: "Contoh Berita Publik 1",
        date: "2024-01-01",
        excerpt: "Ini adalah contoh berita pertama untuk tampilan publik.",
        category: "berita",
        image: "https://picsum.photos/seed/publicberita1/700/500"
    },
    {
        id: 2,
        title: "Contoh Event Publik 1",
        date: "2024-02-15",
        excerpt: "Ini adalah contoh event pertama untuk tampilan publik.",
        category: "event",
        image: "https://picsum.photos/seed/publicevent1/700/500"
    }
];

export async function initializeBerita() {
    const beritaGrid = document.getElementById('berita-grid');
    const beritaFilters = document.querySelectorAll('.berita-filters .filter-btn');
    
    await renderBerita();
    
    beritaFilters.forEach(btn => {
        btn.addEventListener('click', async () => {
            const filter = btn.dataset.filter;
            
            // Update active filter
            beritaFilters.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter data
            await renderBerita(filter);
        });
    });
}

async function renderBerita(filter = 'all') {
    const beritaGrid = document.getElementById('berita-grid');
    beritaGrid.innerHTML = '<p>Loading...</p>';

    let query = supabaseClient.from('berita').select('*');

    if (filter !== 'all') {
        query = query.eq('category', filter);
    }

    const { data, error } = await query.order('date', { ascending: false });

    let currentData = data;

    if (error || !data || data.length === 0) {
        console.error('Error fetching news data or no data:', error);
        currentData = defaultBeritaData;
    }

    beritaGrid.innerHTML = '';
    
    currentData.forEach(item => {
        const beritaItem = document.createElement('div');
        beritaItem.className = 'berita-item';
        beritaItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div class="berita-content">
                <h3>${item.title}</h3>
                <p class="date">${formatDate(item.date)}</p>
                <p>${item.excerpt}</p>
            </div>
        `;
        
        beritaGrid.appendChild(beritaItem);
    });
}
