import { supabaseClient } from './supabase.js';
import { formatDate, showNotification } from './utils.js';
import { updateStats } from './overview.js';

const defaultSaranData = [
    {
        id: 1,
        nama: "Anonim",
        kelas: "-",
        pesan: "Ini adalah contoh saran pertama dari pengguna anonim.",
        status: "baru",
        created_at: "2024-01-01T10:00:00Z"
    },
    {
        id: 2,
        nama: "Budi Santoso",
        kelas: "XII RPL 2",
        pesan: "Mohon tingkatkan kegiatan ekstrakurikuler di sekolah.",
        status: "dibaca",
        created_at: "2024-01-05T11:30:00Z"
    }
];

export async function initializeSaranSection() {
    await renderSaranStats();
    await renderSaranList();
    
    // Initialize filters
    const filters = document.querySelectorAll('.saran-filters .filter-btn');
    filters.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Update active filter
            filters.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter and render
            renderSaranList(filter);
        });
    });
}

export async function renderSaranStats() {
    const { data: saranData, error } = await supabaseClient
        .from('saran')
        .select('status');

    let currentSaranData = saranData;

    if (error || !saranData || saranData.length === 0) {
        console.error('Error fetching suggestion stats or no data:', error);
        currentSaranData = defaultSaranData;
    }

    const stats = {
        baru: currentSaranData.filter(s => s.status === 'baru').length,
        dibaca: currentSaranData.filter(s => s.status === 'dibaca').length,
        diproses: currentSaranData.filter(s => s.status === 'diproses').length
    };
    
    document.getElementById('saran-baru').textContent = stats.baru;
    document.getElementById('saran-dibaca').textContent = stats.dibaca;
    document.getElementById('saran-diproses').textContent = stats.diproses;
}

export async function renderSaranList(filter = 'all') {
    const list = document.getElementById('saran-list');
    list.innerHTML = '<p>Loading...</p>';

    let query = supabaseClient.from('saran').select('*');

    if (filter !== 'all') {
        query = query.eq('status', filter);
    }

    const { data: saranData, error } = await query.order('created_at', { ascending: false });

    let currentSaranData = saranData;

    if (error || !saranData || saranData.length === 0) {
        console.error('Error fetching suggestions or no data:', error);
        currentSaranData = defaultSaranData;
    }

    list.innerHTML = '';
    
    currentSaranData.forEach(item => {
        const saranItem = document.createElement('div');
        saranItem.className = `saran-item ${item.status}`;
        saranItem.innerHTML = `
            <div class="saran-header">
                <div class="saran-info">
                    <h4>Dari: ${item.nama}</h4>
                    <div class="saran-meta">
                        <span>Kelas: ${item.kelas}</span> • 
                        <span>${formatDate(item.created_at)}</span>
                    </div>
                </div>
                <div class="saran-status ${item.status}">${item.status}</div>
            </div>
            <div class="saran-content">
                ${item.pesan}
            </div>
            <div class="saran-actions">
                <button class="btn-secondary" onclick="updateSaranStatus(${item.id}, 'dibaca')">Tandai Dibaca</button>
                <button class="btn-secondary" onclick="updateSaranStatus(${item.id}, 'diproses')">Tandai Diproses</button>
                <button class="btn-secondary" onclick="updateSaranStatus(${item.id}, 'ditanggapi')">Tandai Ditanggapi</button>
                <button class="btn-danger" onclick="deleteSaran(${item.id})">Hapus</button>
            </div>
        `;
        list.appendChild(saranItem);
    });
}

export async function updateSaranStatus(id, status) {
    const { error } = await supabaseClient
        .from('saran')
        .update({ status })
        .match({ id });

    if (error) {
        showNotification('Gagal mengupdate status saran', 'error');
        console.error('Error updating suggestion status:', error);
    } else {
        await renderSaranStats();
        await renderSaranList();
        showNotification('Status saran berhasil diupdate');
    }
}

export async function deleteSaran(id) {
    if (confirm('Apakah Anda yakin ingin menghapus saran ini?')) {
        const { error } = await supabaseClient
            .from('saran')
            .delete()
            .match({ id });

        if (error) {
            showNotification('Gagal menghapus saran', 'error');
            console.error('Error deleting suggestion:', error);
        } else {
            await renderSaranStats();
            await renderSaranList();
            showNotification('Saran berhasil dihapus');
        }
    }
}