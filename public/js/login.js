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

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Invalid credentials');

        // Save token and redirect
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = '/admin-dashboard.html';
      } catch (err) {
        errorMsg.textContent = err.message;
      }
    });
  }
});
