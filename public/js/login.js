// public/js/admin-login.js

const API_URL = 'https://clearpro-fullstack.onrender.com'; // your backend URL

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const passwordInput = document.getElementById('password');
  const togglePassword = document.getElementById('togglePassword');
  const icon = togglePassword ? togglePassword.querySelector('i') : null;
  const errorMsg = document.getElementById('errorMsg');

  // ✅ Show/Hide Password Toggle
  if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', () => {
      const isHidden = passwordInput.type === 'password';
      passwordInput.type = isHidden ? 'text' : 'password';
      icon.classList.toggle('fa-eye');
      icon.classList.toggle('fa-eye-slash');

      // Optional: visual feedback color
      togglePassword.style.color = isHidden ? '#007bff' : '#00AEEF';
    });
  }

  // ✅ Form Submit
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value.trim();
      const password = passwordInput.value.trim();

      // Clear old error
      errorMsg.textContent = '';

      try {
        const res = await fetch(`${API_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Login failed');

        // ✅ Check admin role
        if (data.user.role !== 'admin') {
          throw new Error('Access denied. Admins only.');
        }

        // ✅ Store token and user info
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // ✅ Redirect to Admin Dashboard
        window.location.href = '/admin-dashboard.html';
      } catch (err) {
        errorMsg.textContent = err.message;
      }
    });
  }
});
