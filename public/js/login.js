// Auto-redirect if already logged in
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (token && user.role === 'admin') {
    // already logged in → skip login page
    window.location.href = '/admin-dashboard.html';
  }
});

// public/js/admin-login.js

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('adminLoginForm');
  const emailInput = document.getElementById('adminEmail');
  const passwordInput = document.getElementById('adminPassword');
  const togglePassword = document.getElementById('toggleAdminPassword');
  const errorMsg = document.getElementById('errorMsg');

  // ✅ Show/Hide Password
  if (passwordInput && togglePassword) {
    const icon = togglePassword.querySelector('i');

    togglePassword.addEventListener('click', () => {
      const isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';
      icon.classList.toggle('fa-eye');
      icon.classList.toggle('fa-eye-slash');

      // Optional color change when active
      togglePassword.style.color = isPassword ? '#007bff' : '#00AEEF';
    });
  }

  // ✅ Handle Admin Login
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      errorMsg.textContent = '';

      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();

      try {
        const response = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const response = await fetch('https://clearpro-fullstack.onrender.com/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

const data = await response.json();
if (!response.ok) throw new Error(data.error || 'Invalid credentials');

// ✅ Verify role is admin
if (data.user.role !== 'admin') {
  throw new Error('Access denied. Admins only.');
}

// ✅ Store login info
localStorage.setItem('token', data.token);
localStorage.setItem('user', JSON.stringify(data.user));

// ✅ Redirect to dashboard
window.location.href = '/admin-dashboard.html';
