import { formatDate, formatCurrency } from './utils.js';
import { supabaseClient } from '../admin/supabase.js';

const defaultTransaksiData = [
    {
        id: 1,
        tanggal: "2024-01-01",
        deskripsi: "Pemasukan Contoh Awal",
        tipe: "pemasukan",
        jumlah: 1500000
    },
    {
        id: 2,
        tanggal: "2024-01-15",
        deskripsi: "Pengeluaran Contoh Operasional",
        tipe: "pengeluaran",
        jumlah: 800000
    },
    {
        id: 3,
        tanggal: "2024-02-01",
        deskripsi: "Pemasukan Contoh Februari",
        tipe: "pemasukan",
        jumlah: 1000000
    },
    {
        id: 4,
        tanggal: "2024-02-10",
        deskripsi: "Pengeluaran Contoh Februari",
        tipe: "pengeluaran",
        jumlah: 500000
    }
];

export async function initializeKeuangan() {
    await renderKeuanganStats();
    await renderKeuanganTable();
}

async function renderKeuanganStats() {
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
    
    document.querySelector('.balance-amount h2').textContent = formatCurrency(saldo);
    document.querySelector('.balance-summary .income').textContent = `Pemasukan: ${formatCurrency(totalPemasukan)}`;
    document.querySelector('.balance-summary .expense').textContent = `Pengeluaran: ${formatCurrency(totalPengeluaran)}`;

    // Quick chart for home section
    const quickCtx = document.getElementById('quickChart');
    if (quickCtx) {
        new Chart(quickCtx, {
            type: 'doughnut',
            data: {
                labels: ['Pemasukan', 'Pengeluaran'],
                datasets: [{
                    data: [totalPemasukan, totalPengeluaran],
                    backgroundColor: ['#4CAF50', '#F44336'],
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
}

async function renderKeuanganTable() {
    const tbody = document.getElementById('transaksi-tbody');
    tbody.innerHTML = '<tr><td colspan="4">Loading...</td></tr>';

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
        row.innerHTML = `
            <td>${formatDate(item.tanggal)}</td>
            <td>${item.deskripsi}</td>
            <td>${item.tipe === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran'}</td>
            <td>${formatCurrency(item.jumlah)}</td>
        `;
        tbody.appendChild(row);
    });

    // Main finance chart
    const financeCtx = document.getElementById('financeChart');
    if (financeCtx) {
        const monthlyData = {};

        currentTransaksiData.forEach(t => {
            const month = new Date(t.tanggal).toLocaleString('default', { month: 'short', year: 'numeric' });
            if (!monthlyData[month]) {
                monthlyData[month] = { pemasukan: 0, pengeluaran: 0 };
            }
            if (t.tipe === 'pemasukan') {
                monthlyData[month].pemasukan += t.jumlah;
            } else {
                monthlyData[month].pengeluaran += t.jumlah;
            }
        });

        const labels = Object.keys(monthlyData).sort((a, b) => new Date(a) - new Date(b));
        const pemasukanValues = labels.map(month => monthlyData[month].pemasukan);
        const pengeluaranValues = labels.map(month => monthlyData[month].pengeluaran);

        new Chart(financeCtx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Pemasukan',
                        data: pemasukanValues,
                        borderColor: '#4CAF50',
                        tension: 0.1,
                        fill: false
                    },
                    {
                        label: 'Pengeluaran',
                        data: pengeluaranValues,
                        borderColor: '#F44336',
                        tension: 0.1,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}
