// public/js/admin-login.js

const API_URL = 'https://clearpro-fullstack.onrender.com'; // backend URL

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const passwordInput = document.getElementById('password');
  const togglePassword = document.getElementById('togglePassword');
  const errorMsg = document.getElementById('errorMsg');

  // ✅ Password Show/Hide Toggle (Click + Press & Hold)
  if (togglePassword && passwordInput) {
    // Function to show password
    const showPassword = () => {
      passwordInput.type = 'text';
      togglePassword.innerHTML = '<i class="fa-regular fa-eye-slash"></i>';
      togglePassword.style.color = '#007bff';
    };

    // Function to hide password
    const hidePassword = () => {
      passwordInput.type = 'password';
      togglePassword.innerHTML = '<i class="fa-regular fa-eye"></i>';
      togglePassword.style.color = '#999';
    };

    // Click to toggle
    togglePassword.addEventListener('click', () => {
      const isHidden = passwordInput.type === 'password';
      if (isHidden) showPassword();
      else hidePassword();
    });

    // Press & hold (Desktop)
    togglePassword.addEventListener('mousedown', showPassword);
    togglePassword.addEventListener('mouseup', hidePassword);
    togglePassword.addEventListener('mouseleave', hidePassword);

    // Press & hold (Mobile)
    togglePassword.addEventListener('touchstart', (e) => {
      e.preventDefault(); // Prevent accidental zoom
      showPassword();
    }, { passive: false });
    togglePassword.addEventListener('touchend', hidePassword);
    togglePassword.addEventListener('touchcancel', hidePassword);
  }

  // ✅ Admin Login Logic
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = document.getElementById('email').value.trim();
      const password = passwordInput.value.trim();
      const submitBtn = loginForm.querySelector('button[type="submit"]');
      errorMsg.textContent = '';

      // Disable button during login
      submitBtn.disabled = true;
      submitBtn.textContent = 'Logging in...';

      try {
        const res = await fetch(`${API_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Login failed');

        // Verify admin role
        if (!data.user || data.user.role !== 'admin') {
          throw new Error('Access denied. Admins only.');
        }

        // Save auth data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Redirect
        window.location.href = '/admin-dashboard.html';
      } catch (err) {
        errorMsg.textContent = err.message;
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Login';
      }
    });
  }
});
