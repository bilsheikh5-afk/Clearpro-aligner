const API_URL = 'https://clearpro-fullstack.onrender.com';

document.addEventListener('DOMContentLoaded', () => {
  if (Auth.isLoggedIn()) return (window.location.href = '/dashboard');

  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
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
      errorMsg.textContent = err.message;
    }
  });
});
