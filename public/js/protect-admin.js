// public/js/protect-admin.js
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // ✅ If no token or not an admin → redirect to login page
  if (!token || user.role !== 'admin') {
    window.location.href = '/admin-login.html';
  }
});
