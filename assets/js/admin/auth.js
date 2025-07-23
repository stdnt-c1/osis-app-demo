import { supabaseClient } from './supabase.js';

export function initializeAuth() {
    document.getElementById('loginForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorMessage = document.getElementById('errorMessage');
        const loading = document.getElementById('loading');
        const submitBtn = document.querySelector('.btn-login');
        
        // Show loading
        loading.style.display = 'block';
        submitBtn.disabled = true;
        errorMessage.style.display = 'none';
        
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: username, // Assuming username is the email
            password: password,
        });

        if (error) {
            errorMessage.textContent = 'Username atau password salah!';
            errorMessage.style.display = 'block';
            loading.style.display = 'none';
            submitBtn.disabled = false;
            document.getElementById('password').value = '';
            document.getElementById('username').focus();
        } else {
            sessionStorage.setItem('adminLoggedIn', 'true');
            sessionStorage.setItem('adminUsername', data.user.email);
            // You might want to store the role in the user's metadata in Supabase
            // Fetch user role from the 'users' table
            const { data: userProfile, error: profileError } = await supabaseClient
                .from('users')
                .select('role')
                .eq('id', data.user.id)
                .single();

            if (profileError) {
                console.error('Error fetching user profile:', profileError);
                sessionStorage.setItem('adminRole', 'default'); // Fallback role
            } else {
                sessionStorage.setItem('adminRole', userProfile.role || 'default');
            }
            window.location.href = 'dashboard.html';
        }
    });

    // Check if already logged in
    if (sessionStorage.getItem('adminLoggedIn') === 'true') {
        window.location.href = 'dashboard.html';
    }
}