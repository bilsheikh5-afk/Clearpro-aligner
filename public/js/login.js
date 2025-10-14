// public/js/admin-login.js

const API_URL = 'https://clearpro-fullstack.onrender.com'; // your backend URL

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const passwordInput = document.getElementById('password');
  const togglePassword = document.getElementById('togglePassword');
  const icon = togglePassword ? togglePassword.querySelector('i') : null;
  const errorMsg = document.getElementById('errorMsg');

  // ✅ Password Show / Hide (Click + Press & Hold)
  if (togglePassword && passwordInput) {
    // --- CLICK TO TOGGLE ---
    togglePassword.addEventListener('click', () => {
      const isHidden = passwordInput.type === 'password';
      passwordInput.type = isHidden ? 'text' : 'password';
      icon.classList.toggle('fa-eye', !isHidden);
      icon.classList.toggle('fa-eye-slash', isHidden);
      togglePassword.style.color = isHidden ? '#007bff' : '#00AEEF';
    });

    // --- PRESS & HOLD (Desktop + Mobile) ---
    const showPassword = () => {
      passwordInput.type = 'text';
      icon.classList.add('fa-eye-slash');
      icon.classList.remove('fa-eye');
      togglePassword.style.color = '#007bff';
    };

    const hidePassword = () => {
      passwordInput.type = 'password';
      icon.classList.remove('fa-eye-slash');
      icon.classList.add('fa-eye');
      togglePassword.style.color = '#999';
    };

    // Mouse events
    togglePassword.addEventListener('mousedown', showPassword);
    togglePassword.addEventListener('mouseup', hidePassword);
    togglePassword.addEventListener('mouseleave', hidePassword);

    // Touch events (for mobile)
    togglePassword.addEventListener('touchstart', (e) => {
      e.preventDefault(); // prevent accidental double-tap zoom
      showPassword();
    }, { passive: false });

    togglePassword.addEventListener('touchend', hidePassword);
    togglePassword.addEventListener('touchcancel', hidePassword);
  }

  // ✅ Form Submit Logic
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = document.getElementById('email').value.trim();
      const password = passwordInput.value.trim();
      const submitBtn = loginForm.querySelector('button[type="submit"]');

      // Clear old error
      errorMsg.textContent = '';

      // Disable button temporarily
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

        // ✅ Check admin role
        if (!data.user || data.user.role !== 'admin') {
          throw new Error('Access denied. Admins only.');
        }

        // ✅ Store token and user info
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // ✅ Redirect to Admin Dashboard
        window.location.href = '/admin-dashboard.html';
      } catch (err) {
        errorMsg.textContent = err.message;
      } finally {
        // Re-enable button
        submitBtn.disabled = false;
        submitBtn.textContent = 'Login';
      }
    });
  }
});
