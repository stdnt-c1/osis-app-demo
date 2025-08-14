import { supabaseClient } from './supabase.js';
import { closeModal } from './modals.js';
import { showNotification } from './utils.js';
import { renderBeritaTable } from './berita.js';
import { renderGaleriGrid } from './gallery.js';
import { renderKeuanganStats, renderKeuanganTable } from './finance.js';
import { renderUsersTable } from './users.js';
import { updateStats } from './overview.js';
import { uploadFileToVercelBlob } from './vercel-blob.js';

export function initializeForms() {
    // Add Berita Form
    document.getElementById('addBeritaForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const imageFile = formData.get('imageFile');
        let imageUrl = formData.get('imageUrl');

        if (imageFile && imageFile.size > 0) {
            const uploadedUrl = await uploadFileToVercelBlob(imageFile);
            if (uploadedUrl) {
                imageUrl = uploadedUrl;
            } else {
                showNotification('Gagal mengunggah gambar berita.', 'error');
                return;
            }
        } else if (!imageUrl) {
            imageUrl = 'https://picsum.photos/seed/defaultberita/700/500'; // Default image if neither file nor URL is provided
        }

        const newBerita = {
            title: formData.get('title'),
            category: formData.get('category'),
            date: formData.get('date'),
            excerpt: formData.get('excerpt'),
            image: imageUrl
        };
        
        const { data, error } = await supabaseClient
            .from('berita')
            .insert([newBerita]);

        if (error) {
            showNotification('Gagal menambahkan berita', 'error');
            console.error('Error adding berita:', error);
        } else {
            renderBeritaTable();
            updateStats();
            closeModal('addBeritaModal');
            this.reset();
            showNotification('Berita berhasil ditambahkan');
        }
    });
    
    // Add Galeri Form
    document.getElementById('addGaleriForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const imageFile = formData.get('imageFile');
        let imageUrl = formData.get('src');

        if (imageFile && imageFile.size > 0) {
            const uploadedUrl = await uploadFileToVercelBlob(imageFile);
            if (uploadedUrl) {
                imageUrl = uploadedUrl;
            } else {
                showNotification('Gagal mengunggah gambar galeri.', 'error');
                return;
            }
        } else if (!imageUrl) {
            showNotification('Harap sediakan file gambar atau URL gambar.', 'error');
            return;
        }

        const newGaleri = {
            title: formData.get('title'),
            category: formData.get('category'),
            date: formData.get('date'),
            description: formData.get('description'),
            src: imageUrl
        };
        
        const { data, error } = await supabaseClient
            .from('gallery')
            .insert([newGaleri]);

        if (error) {
            showNotification('Gagal menambahkan galeri', 'error');
            console.error('Error adding galeri:', error);
        } else {
            renderGaleriGrid();
            updateStats();
            closeModal('addGaleriModal');
            this.reset();
            showNotification('Galeri berhasil ditambahkan');
        }
    });
    
    // Add Transaksi Form
    document.getElementById('addTransaksiForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const newTransaksi = {
            tanggal: formData.get('tanggal'),
            deskripsi: formData.get('deskripsi'),
            tipe: formData.get('tipe'),
            jumlah: parseInt(formData.get('jumlah'))
        };
        
        const { data, error } = await supabaseClient
            .from('transaksi')
            .insert([newTransaksi]);

        if (error) {
            showNotification('Gagal menambahkan transaksi', 'error');
            console.error('Error adding transaksi:', error);
        } else {
            renderKeuanganStats();
            renderKeuanganTable();
            updateStats();
            closeModal('addTransaksiModal');
            this.reset();
            showNotification('Transaksi berhasil ditambahkan');
        }
    });
    
    // Add User Form
    document.getElementById('addUserForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const username = formData.get('username');
        const email = formData.get('email');
        const password = formData.get('password');
        const role = formData.get('role');

        // Check if username already exists in our public.users table
        const { data: existingUser, error: existingUserError } = await supabaseClient
            .from('users')
            .select('id')
            .eq('username', username)
            .single();

        if (existingUserError && existingUserError.code !== 'PGRST116') { // PGRST116 means no rows found
            showNotification('Error checking existing username.', 'error');
            console.error('Error checking existing username:', existingUserError);
            return;
        }

        if (existingUser) {
            showNotification('Username sudah digunakan!', 'error');
            return;
        }

        // Sign up user with Supabase Auth
        const { data: authData, error: authError } = await supabaseClient.auth.signUp({
            email: email,
            password: password,
            options: {
                data: { // This data will be stored in auth.users.user_metadata
                    username: username,
                    role: role
                }
            }
        });

        if (authError) {
            showNotification(`Gagal menambahkan user: ${authError.message}`, 'error');
            console.error('Error signing up user:', authError);
            return;
        }

        // Insert user metadata into public.users table
        const { data: userProfile, error: profileError } = await supabaseClient
            .from('users')
            .insert([
                {
                    id: authData.user.id,
                    username: username,
                    email: email,
                    role: role,
                    status: 'active'
                }
            ]);

        if (profileError) {
            showNotification('Gagal menyimpan profil user.', 'error');
            console.error('Error inserting user profile:', profileError);
            // Consider rolling back auth.signUp if profile insertion fails
            return;
        }
        
        renderUsersTable();
        closeModal('addUserModal');
        this.reset();
        showNotification('User berhasil ditambahkan');
    });
    
    // Edit User Form
    document.getElementById('editUserForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const userId = formData.get('id');
        const username = formData.get('username');
        const email = formData.get('email');
        const newPassword = formData.get('password');
        const role = formData.get('role');
        const status = formData.get('status');

        // Check if username already exists (excluding current user)
        const { data: existingUser, error: existingUserError } = await supabaseClient
            .from('users')
            .select('id')
            .eq('username', username)
            .neq('id', userId)
            .single();

        if (existingUserError && existingUserError.code !== 'PGRST116') {
            showNotification('Error checking existing username.', 'error');
            console.error('Error checking existing username:', existingUserError);
            return;
        }

        if (existingUser) {
            showNotification('Username sudah digunakan!', 'error');
            return;
        }

        // Update user in public.users table
        const { error: profileError } = await supabaseClient
            .from('users')
            .update({
                username: username,
                email: email,
                role: role,
                status: status
            })
            .eq('id', userId);

        if (profileError) {
            showNotification('Gagal mengupdate profil user.', 'error');
            console.error('Error updating user profile:', profileError);
            return;
        }

        // Update email and/or password in auth.users if provided
        const updates = {};
        if (newPassword && newPassword.trim() !== '') {
            updates.password = newPassword;
        }
        // Supabase auth.updateUser does not directly update email, it sends a verification email.
        // For simplicity in this demo, we'll assume email changes are handled by the profile update.
        // In a real app, you'd use `supabase.auth.updateUser({ email: newEmail })` and handle verification.

        if (Object.keys(updates).length > 0) {
            const { error: authUpdateError } = await supabaseClient.auth.updateUser(updates);
            if (authUpdateError) {
                showNotification(`Gagal mengupdate kredensial user: ${authUpdateError.message}`, 'error');
                console.error('Error updating user auth:', authUpdateError);
                return;
            }
        }
        
        renderUsersTable();
        closeModal('editUserModal');
        this.reset();
        showNotification('User berhasil diupdate');
    });
}