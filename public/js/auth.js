// auth.js
const API_BASE = 'https://clearpro-fullstack.onrender.com/api';

class Auth {
  static getToken() { return localStorage.getItem('token'); }
  static setToken(token) { localStorage.setItem('token', token); }
  static removeToken() { localStorage.removeItem('token'); localStorage.removeItem('user'); }
  static getUser() { const u = localStorage.getItem('user'); return u ? JSON.parse(u) : null; }
  static setUser(user) { localStorage.setItem('user', JSON.stringify(user)); }
  static isLoggedIn() { return !!this.getToken(); }
  static logout() { this.removeToken(); window.location.href = '/login.html'; }
}

document.addEventListener('DOMContentLoaded', () => {
  // Attach logout handlers automatically
  document.querySelectorAll('.logout-btn').forEach(btn => {
    btn.addEventListener('click', e => { e.preventDefault(); Auth.logout(); });
  });
});
