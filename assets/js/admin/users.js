import { supabaseClient } from './supabase.js';
import { openModal } from './modals.js';
import { showNotification } from './utils.js';

const defaultUsersData = [
    {
        id: 'mock-user-1',
        username: "admin_mock",
        email: "admin@example.com",
        role: "admin",
        status: "active"
    },
    {
        id: 'mock-user-2',
        username: "editor_mock",
        email: "editor@example.com",
        role: "editor",
        status: "active"
    }
];

export async function initializeUsersSection() {
    await renderUsersTable();
}

export async function renderUsersTable() {
    const tbody = document.getElementById('users-table');
    tbody.innerHTML = '<tr><td colspan="6">Loading...</td></tr>';
    
    const { data: users, error } = await supabaseClient
        .from('users') // Assuming a 'users' table in Supabase
        .select('id, username, email, role, status');

    let currentUsersData = users;

    if (error || !users || users.length === 0) {
        console.error('Error fetching users or no data:', error);
        currentUsersData = defaultUsersData;
    }

    tbody.innerHTML = '';
    
    currentUsersData.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td><span class="badge ${user.role}">${user.role}</span></td>
            <td><span class="badge ${user.status}">${user.status}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn-secondary" onclick="editUser('${user.id}')">Edit</button>
                    <button class="btn-danger" onclick="deleteUser('${user.id}')">Hapus</button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

export async function editUser(id) {
    const { data: user, error } = await supabaseClient
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

    let currentUserData = user;

    if (error || !user) {
        console.error('Error fetching user for edit or no data:', error);
        // Fallback to finding in default data if not found in Supabase
        currentUserData = defaultUsersData.find(u => u.id === id);
        if (!currentUserData) {
            showNotification('Gagal memuat data user untuk diedit.', 'error');
            return;
        }
    }

    if (currentUserData) {
        // Populate edit form with user data
        document.getElementById('edit-user-id').value = currentUserData.id;
        document.getElementById('edit-username').value = currentUserData.username;
        document.getElementById('edit-email').value = currentUserData.email;
        document.getElementById('edit-role').value = currentUserData.role;
        document.getElementById('edit-status').value = currentUserData.status;
        document.getElementById('edit-password').value = ''; // Always empty for security
        
        // Open edit modal
        openModal('editUserModal');
    }
}

export async function deleteUser(id) {
    const currentUsername = sessionStorage.getItem('adminUsername');
    
    // Fetch the user to be deleted to check their role and username
    const { data: userToDelete, error: fetchError } = await supabaseClient
        .from('users')
        .select('username, role')
        .eq('id', id)
        .single();

    let currentUserToDelete = userToDelete;

    if (fetchError || !userToDelete) {
        console.error('Error fetching user for deletion check or no data:', fetchError);
        // Fallback to finding in default data if not found in Supabase
        currentUserToDelete = defaultUsersData.find(u => u.id === id);
        if (!currentUserToDelete) {
            showNotification('Gagal memeriksa user sebelum penghapusan.', 'error');
            return;
        }
    }

    if (currentUserToDelete) {
        // Prevent deleting current logged in user
        if (currentUserToDelete.username === currentUsername) {
            showNotification('Tidak dapat menghapus user yang sedang login!', 'error');
            return;
        }
        
        // Prevent deleting the last admin
        const { data: adminUsers, error: adminError } = await supabaseClient
            .from('users')
            .select('id')
            .eq('role', 'admin');

        let currentAdminUsers = adminUsers;

        if (adminError || !adminUsers) {
            console.error('Error fetching admin users:', adminError);
            // Fallback to default data for admin check
            currentAdminUsers = defaultUsersData.filter(u => u.role === 'admin');
        }

        if (currentUserToDelete.role === 'admin' && currentAdminUsers.length <= 1) {
            showNotification('Tidak dapat menghapus admin terakhir!', 'error');
            return;
        }
    }
    
    if (confirm('Apakah Anda yakin ingin menghapus user ini?')) {
        const { error } = await supabaseClient
            .from('users')
            .delete()
            .match({ id });

        if (error) {
            showNotification('Gagal menghapus user', 'error');
            console.error('Error deleting user:', error);
        } else {
            await renderUsersTable();
            showNotification('User berhasil dihapus');
        }
    }
}