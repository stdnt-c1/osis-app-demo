
import { formatDate, showNotification } from './utils.js';
import { updateStats } from './overview.js';

const defaultGaleriData = [
    {
        id: 1,
        src: "https://picsum.photos/seed/defaultgaleri1/700/500",
        title: "Contoh Galeri 1",
        description: "Deskripsi singkat untuk contoh galeri pertama.",
        category: "ldks",
        date: "2024-01-01"
    },
    {
        id: 2,
        src: "https://picsum.photos/seed/defaultgaleri2/700/500",
        title: "Contoh Galeri 2",
        description: "Deskripsi singkat untuk contoh galeri kedua.",
        category: "classmeeting",
        date: "2024-02-15"
    }
];

export async function initializeGaleriSection() {
    await renderGaleriGrid();
}

export async function renderGaleriGrid() {
    const grid = document.getElementById('galeri-admin-grid');
    grid.innerHTML = '';

    const { data: galeriData, error } = await supabaseClient
        .from('gallery')
        .select('*');

    if (error) {
        console.error('Error fetching gallery data:', error);
        // Fallback to default data on error
        renderGalleryItems(defaultGaleriData, grid);
        return;
    }
    
    if (galeriData.length === 0) {
        renderGalleryItems(defaultGaleriData, grid);
    } else {
        renderGalleryItems(galeriData, grid);
    }
}

function renderGalleryItems(items, gridElement) {
    items.forEach(item => {
        const galeriItem = document.createElement('div');
        galeriItem.className = 'galeri-admin-item';
        galeriItem.innerHTML = `
            <img src="${item.src}" alt="${item.title}">
            <div class="galeri-admin-content">
                <h3>${item.title}</h3>
                <p class="date">${formatDate(item.date)}</p>
                <p>${item.description}</p>
                <div class="actions">
                    <button class="btn-secondary" onclick="editGaleri(${item.id})">Edit</button>
                    <button class="btn-danger" onclick="deleteGaleri(${item.id})">Hapus</button>
                </div>
            </div>
        `;
        gridElement.appendChild(galeriItem);
    });
}

export function editGaleri(id) {
    showNotification('Edit galeri belum diimplementasi');
}

export async function deleteGaleri(id) {
    if (confirm('Apakah Anda yakin ingin menghapus galeri ini?')) {
        const { error } = await supabaseClient
            .from('gallery')
            .delete()
            .match({ id });

        if (error) {
            showNotification('Gagal menghapus galeri', 'error');
            console.error('Error deleting gallery item:', error);
        } else {
            await renderGaleriGrid();
            updateStats();
            showNotification('Galeri berhasil dihapus');
        }
    }
}

export function editGaleri(id) {
    showNotification('Edit galeri belum diimplementasi');
}

export async function deleteGaleri(id) {
    if (confirm('Apakah Anda yakin ingin menghapus galeri ini?')) {
        const { error } = await supabaseClient
            .from('gallery')
            .delete()
            .match({ id });

        if (error) {
            showNotification('Gagal menghapus galeri', 'error');
            console.error('Error deleting gallery item:', error);
        } else {
            await renderGaleriGrid();
            updateStats();
            showNotification('Galeri berhasil dihapus');
        }
    }
}