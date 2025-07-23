import { supabaseClient } from './supabase.js';
import { formatDate, formatCurrency, showNotification } from './utils.js';
import { updateStats } from './overview.js';

const defaultTransaksiData = [
    {
        id: 1,
        tanggal: "2024-01-05",
        deskripsi: "Contoh Pemasukan Awal",
        tipe: "pemasukan",
        jumlah: 1000000
    },
    {
        id: 2,
        tanggal: "2024-01-10",
        deskripsi: "Contoh Pengeluaran Operasional",
        tipe: "pengeluaran",
        jumlah: 250000
    }
];

export async function initializeKeuanganSection() {
    await renderKeuanganStats();
    await renderKeuanganTable();
}

export async function renderKeuanganStats() {
    const { data: transaksiData, error } = await supabaseClient
        .from('transaksi')
        .select('*');

    let currentTransaksiData = transaksiData;

    if (error || !transaksiData || transaksiData.length === 0) {
        console.error('Error fetching finance data for stats or no data:', error);
        currentTransaksiData = defaultTransaksiData;
    }

    const totalPemasukan = currentTransaksiData
        .filter(t => t.tipe === 'pemasukan')
        .reduce((sum, t) => sum + t.jumlah, 0);
    
    const totalPengeluaran = currentTransaksiData
        .filter(t => t.tipe === 'pengeluaran')
        .reduce((sum, t) => sum + t.jumlah, 0);
    
    const saldo = totalPemasukan - totalPengeluaran;
    
    document.getElementById('current-saldo').textContent = formatCurrency(saldo);
    document.getElementById('total-pemasukan').textContent = formatCurrency(totalPemasukan);
    document.getElementById('total-pengeluaran').textContent = formatCurrency(totalPengeluaran);
}

export async function renderKeuanganTable() {
    const tbody = document.getElementById('keuangan-table');
    tbody.innerHTML = '<tr><td colspan="6">Loading...</td></tr>';

    const { data: transaksiData, error } = await supabaseClient
        .from('transaksi')
        .select('*')
        .order('tanggal', { ascending: false });

    let currentTransaksiData = transaksiData;

    if (error || !transaksiData || transaksiData.length === 0) {
        console.error('Error fetching finance data for table or no data:', error);
        currentTransaksiData = defaultTransaksiData;
    }

    tbody.innerHTML = '';
    
    currentTransaksiData.forEach(item => {
        const row = document.createElement('tr');
        row.className = item.tipe === 'pemasukan' ? 'income-row' : 'expense-row';
        row.innerHTML = `
            <td>${item.id || '-'}</td>
            <td>${formatDate(item.tanggal)}</td>
            <td>${item.deskripsi}</td>
            <td>${item.tipe === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran'}</td>
            <td>${formatCurrency(item.jumlah)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-secondary" onclick="editTransaksi(${item.id || 0})">Edit</button>
                    <button class="btn-danger" onclick="deleteTransaksi(${item.id || 0})">Hapus</button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

export function editTransaksi(id) {
    showNotification('Edit transaksi belum diimplementasi');
}

export async function deleteTransaksi(id) {
    if (confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
        const { error } = await supabaseClient
            .from('transaksi')
            .delete()
            .match({ id });

        if (error) {
            showNotification('Gagal menghapus transaksi', 'error');
            console.error('Error deleting transaction:', error);
        } else {
            await renderKeuanganStats();
            await renderKeuanganTable();
            updateStats();
            showNotification('Transaksi berhasil dihapus');
        }
    }
}