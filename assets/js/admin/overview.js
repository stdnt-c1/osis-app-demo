import { supabaseClient } from './supabase.js';
import { formatCurrency } from './utils.js';

export function initializeOverview() {
    updateStats();
}

export async function updateStats() {
    // Fetch total berita
    const { count: totalBerita, error: beritaError } = await supabaseClient
        .from('berita')
        .select('id', { count: 'exact' });
    if (beritaError) console.error('Error fetching total berita:', beritaError);
    document.getElementById('total-berita').textContent = totalBerita || 0;

    // Fetch total galeri
    const { count: totalGaleri, error: galeriError } = await supabaseClient
        .from('gallery')
        .select('id', { count: 'exact' });
    if (galeriError) console.error('Error fetching total galeri:', galeriError);
    document.getElementById('total-galeri').textContent = totalGaleri || 0;

    // Fetch total saran
    const { count: totalSaran, error: saranError } = await supabaseClient
        .from('saran')
        .select('id', { count: 'exact' });
    if (saranError) console.error('Error fetching total saran:', saranError);
    document.getElementById('total-saran').textContent = totalSaran || 0;
    
    // Calculate saldo
    const { data: transaksiData, error: transaksiError } = await supabaseClient
        .from('transaksi')
        .select('tipe, jumlah');

    if (transaksiError) {
        console.error('Error fetching transaksi data:', transaksiError);
        document.getElementById('saldo-kas').textContent = formatCurrency(0);
        return;
    }

    const totalPemasukan = transaksiData
        .filter(t => t.tipe === 'pemasukan')
        .reduce((sum, t) => sum + t.jumlah, 0);
    
    const totalPengeluaran = transaksiData
        .filter(t => t.tipe === 'pengeluaran')
        .reduce((sum, t) => sum + t.jumlah, 0);
    
    const saldo = totalPemasukan - totalPengeluaran;
    document.getElementById('saldo-kas').textContent = formatCurrency(saldo);
}