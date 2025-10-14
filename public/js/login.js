const API_URL = 'https://clearpro-fullstack.onrender.com';

document.addEventListener('DOMContentLoaded', () => {
  // ✅ Redirect if already logged in
  if (Auth.isLoggedIn()) return (window.location.href = '/dashboard');

  // ✅ Password toggle logic
  const passwordInput = document.getElementById('password');
  const togglePassword = document.getElementById('togglePassword');

  if (passwordInput && togglePassword) {
    togglePassword.addEventListener('click', () => {
      const isHidden = passwordInput.type === 'password';
      passwordInput.type = isHidden ? 'text' : 'password';
      togglePassword.innerHTML = isHidden
        ? '<i class="fa-solid fa-eye-slash"></i>'
        : '<i class="fa-solid fa-eye"></i>';
    });
  } else {
    console.error('⚠️ Password toggle elements not found.');
  }

  // ✅ Login form submission
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value.trim();
      const password = passwordInput.value.trim();
      const errorMsg = document.getElementById('errorMsg');

      try {
        const res = await fetch(`${API_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Invalid credentials');

        Auth.setToken(data.token);
        Auth.setUser(data.user);
        window.location.href = '/dashboard';
      } catch (err) {
        console.error('Login error:', err);
        errorMsg.textContent = err.message || 'Login failed';
      }
    });
  }
});
