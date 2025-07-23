import { supabaseClient } from '../admin/supabase.js';
import { formatDate } from './utils.js';

export function initializeSaranForm() {
    const form = document.getElementById('saranForm');
    const anonimCheckbox = document.getElementById('anonim');
    const namaInput = document.getElementById('nama');
    const kelasInput = document.getElementById('kelas');
    const messageDiv = document.getElementById('form-message');
    
    // Handle anonymous checkbox
    anonimCheckbox.addEventListener('change', function() {
        if (this.checked) {
            namaInput.disabled = true;
            kelasInput.disabled = true;
            namaInput.value = '';
            kelasInput.value = '';
        } else {
            namaInput.disabled = false;
            kelasInput.disabled = false;
        }
    });
    
    // Handle form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const newSaran = {
            nama: anonimCheckbox.checked ? 'Anonim' : formData.get('nama') || 'Tidak disebutkan',
            kelas: anonimCheckbox.checked ? '-' : formData.get('kelas') || 'Tidak disebutkan',
            pesan: formData.get('pesan'),
            // tanggal: new Date().toISOString(), // Supabase will set created_at automatically
            // anonim: anonimCheckbox.checked // Not needed if 'nama' handles it
        };
        
        const { data, error } = await supabaseClient
            .from('saran')
            .insert([newSaran]);

        if (error) {
            showMessage('Gagal mengirim saran. Silakan coba lagi.', 'error');
            console.error('Error submitting suggestion:', error);
        } else {
            showMessage('Terima kasih! Saran Anda telah berhasil dikirim dan akan ditinjau oleh pengurus OSIS.', 'success');
            sendEmailNotification(newSaran);
            // Reset form
            form.reset();
            anonimCheckbox.checked = false;
            namaInput.disabled = false;
            kelasInput.disabled = false;
        }
    });
}

function showMessage(message, type) {
    const messageDiv = document.getElementById('form-message');
    messageDiv.textContent = message;
    messageDiv.className = type;
    messageDiv.style.display = 'block';
    
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}

// Simulated email notification function
function sendEmailNotification(saran) {
    console.log('Simulating email notification for new suggestion:', saran);
    // In a real application, this would trigger a backend function
    // that sends an actual email to the admin/relevant personnel.
    // Example: fetch('/api/send-notification', { method: 'POST', body: JSON.stringify(saran) });
}
