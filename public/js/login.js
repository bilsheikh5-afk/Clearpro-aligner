// public/js/admin.js

const API_BASE = 'https://clearpro-fullstack.onrender.com/api';

// ========================
// 🔐 AUTH CLASS
// ========================
class Auth {
  static getToken() {
    return localStorage.getItem('token');
  }

  static getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  static logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/admin-login.html';
  }
}

// ========================
// 🌐 API HELPER CLASS
// ========================
class API {
  static async get(endpoint) {
    const token = Auth.getToken();
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'Failed to fetch data');
    return data;
  }
}

// ========================
// 📊 DASHBOARD LOGIC
// ========================
async function loadDashboard() {
  const user = Auth.getUser();
  if (!Auth.getToken() || !user) {
    window.location.href = '/admin-login.html';
    return;
  }

  // Set admin initials
  const avatar = document.getElementById('admin-avatar');
  if (avatar && user.name) {
    avatar.textContent = user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  }

  // Setup logout
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.addEventListener('click', Auth.logout);

  try {
    // Fetch data
    const [doctors, cases] = await Promise.all([
      API.get('/admin/doctors'),
      API.get('/admin/cases')
    ]);

    // Update stats
    document.getElementById('totalDoctors').textContent = doctors.length;
    document.getElementById('totalCases').textContent = cases.length;
    document.getElementById('pendingCases').textContent = cases.filter(c => c.status === 'Pending').length;
    document.getElementById('approvedCases').textContent = cases.filter(c => c.status === 'Approved').length;

    // Display table
    displayCases(cases);
  } catch (error) {
    console.error('Error loading admin dashboard:', error);
    const tbody = document.querySelector('#casesTable tbody');
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:red;">${error.message}</td></tr>`;
  }
}

// ========================
// 🧾 DISPLAY CASES TABLE
// ========================
function displayCases(cases) {
  const tbody = document.querySelector('#casesTable tbody');
  if (!tbody) return;

  if (!cases || cases.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No cases found.</td></tr>`;
    return;
  }

  tbody.innerHTML = cases
    .slice(0, 10)
    .map(c => `
      <tr>
        <td>${c.case_id || '—'}</td>
        <td>${c.doctor_name || '—'}</td>
        <td>${c.patient_name || '—'}</td>
        <td><span class="status ${c.status?.toLowerCase() || 'pending'}">${c.status}</span></td>
        <td>${new Date(c.createdAt).toLocaleDateString()}</td>
      </tr>
    `)
    .join('');
}

// ========================
// 🚀 INIT
// ========================
document.addEventListener('DOMContentLoaded', loadDashboard);
