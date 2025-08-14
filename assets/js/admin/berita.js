
import { formatDate, showNotification } from './utils.js';
import { updateStats } from './overview.js';

const defaultBeritaData = [
    {
        id: 1,
        title: "Contoh Berita 1",
        date: "2024-01-01",
        excerpt: "Ini adalah contoh berita pertama untuk mengisi kekosongan data.",
        category: "berita",
        image: "https://picsum.photos/seed/defaultberita1/700/500"
    },
    {
        id: 2,
        title: "Contoh Event 1",
        date: "2024-02-15",
        excerpt: "Ini adalah contoh event pertama untuk mengisi kekosongan data.",
        category: "event",
        image: "https://picsum.photos/seed/defaultevent1/700/500"
    }
];

export function initializeBeritaSection() {
    renderBeritaTable();
    
    // Initialize filters
    const filters = document.querySelectorAll('.berita-filters .filter-btn');
    filters.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Update active filter
            filters.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter and render
            renderBeritaTable(filter);
        });
    });
}

export async function renderBeritaTable(filter = 'all') {
    const tbody = document.getElementById('berita-table');
    tbody.innerHTML = '<tr><td colspan="5">Loading...</td></tr>';

    let query = supabaseClient.from('berita').select('*');

    if (filter !== 'all') {
        query = query.eq('category', filter);
    }

    const { data: beritaData, error } = await query.order('date', { ascending: false });

    if (error) {
        console.error('Error fetching berita data:', error);
        // Fallback to default data on error
        renderBeritaItems(defaultBeritaData, tbody);
        return;
    }

    if (beritaData.length === 0) {
        renderBeritaItems(defaultBeritaData, tbody);
    } else {
        renderBeritaItems(beritaData, tbody);
    }
}

function renderBeritaItems(items, tbodyElement) {
    tbodyElement.innerHTML = '';
    items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.title}</td>
            <td><span class="badge ${item.category}">${item.category}</span></td>
            <td>${formatDate(item.date)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-secondary" onclick="editBerita(${item.id})">Edit</button>
                    <button class="btn-danger" onclick="deleteBerita(${item.id})">Hapus</button>
                </div>
            </td>
        `;
        tbodyElement.appendChild(row);
    });
}

export function editBerita(id) {
    // This function is not implemented yet.
    showNotification('Edit berita belum diimplementasi');
}

export async function deleteBerita(id) {
    if (confirm('Apakah Anda yakin ingin menghapus berita ini?')) {
        const { error } = await supabaseClient
            .from('berita')
            .delete()
            .match({ id });

        if (error) {
            showNotification('Gagal menghapus berita', 'error');
            console.error('Error deleting berita item:', error);
        } else {
            renderBeritaTable(); // Re-render the table
            updateStats(); // This might need adjustment to work with async data
            showNotification('Berita berhasil dihapus');
        }
    }
}