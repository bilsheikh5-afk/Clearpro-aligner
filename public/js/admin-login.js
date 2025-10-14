// /js/admin-login.js

const API_URL = 'https://clearpro-fullstack.onrender.com';

document.addEventListener('DOMContentLoaded', () => {
  if (Auth.isLoggedIn()) return (window.location.href = '/admin-dashboard');

  const form = document.getElementById('adminLoginForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    const errorMsg = document.getElementById('adminErrorMsg');

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid credentials');

      // ✅ Only allow admin
      if (data.user.role !== 'admin') throw new Error('Access restricted to admins only');

      Auth.setToken(data.token);
      Auth.setUser(data.user);
      window.location.href = '/admin-dashboard';
    } catch (err) {
      errorMsg.textContent = err.message;
    }
  });
});
