import { supabaseClient } from '../admin/supabase.js';
import { formatDate } from './utils.js';

const defaultGaleriData = [
    {
        id: 1,
        src: "https://picsum.photos/seed/publicgaleri1/700/500",
        title: "Contoh Galeri Publik 1",
        description: "Deskripsi singkat untuk contoh galeri publik pertama.",
        category: "ldks",
        date: "2024-01-01"
    },
    {
        id: 2,
        src: "https://picsum.photos/seed/publicgaleri2/700/500",
        title: "Contoh Galeri Publik 2",
        description: "Deskripsi singkat untuk contoh galeri publik kedua.",
        category: "classmeeting",
        date: "2024-02-15"
    }
];

export async function initializeGaleri() {
    const galeriGrid = document.getElementById('galeri-grid');
    const galeriFilters = document.querySelectorAll('.galeri-filters .filter-btn');
    
    await renderGaleri();
    
    galeriFilters.forEach(btn => {
        btn.addEventListener('click', async () => {
            const filter = btn.dataset.filter;
            
            // Update active filter
            galeriFilters.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter data
            await renderGaleri(filter);
        });
    });
}

async function renderGaleri(filter = 'all') {
    const galeriGrid = document.getElementById('galeri-grid');
    galeriGrid.innerHTML = '<p>Loading...</p>';

    let query = supabaseClient.from('gallery').select('*');

    if (filter !== 'all') {
        query = query.eq('category', filter);
    }

    const { data, error } = await query.order('date', { ascending: false });

    let currentData = data;

    if (error || !data || data.length === 0) {
        console.error('Error fetching gallery data or no data:', error);
        currentData = defaultGaleriData;
    }

    galeriGrid.innerHTML = '';
    
    currentData.forEach(item => {
        const galeriItem = document.createElement('div');
        galeriItem.className = 'galeri-item';
        galeriItem.innerHTML = `
            <img src="${item.src}" alt="${item.title}">
            <div class="galeri-overlay">
                <h3>${item.title}</h3>
                <p>${item.description}</p>
            </div>
        `;
        
        galeriItem.addEventListener('click', () => openModal(item));
        galeriGrid.appendChild(galeriItem);
    });
}

function openModal(item) {
    const modal = document.getElementById('galeriModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    
    modalImage.src = item.src;
    modalTitle.textContent = item.title;
    modalDescription.textContent = item.description;
    
    modal.style.display = 'block';
}

// Modal close functionality
document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('galeriModal').style.display = 'none';
});

window.addEventListener('click', (e) => {
    const modal = document.getElementById('galeriModal');
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});
