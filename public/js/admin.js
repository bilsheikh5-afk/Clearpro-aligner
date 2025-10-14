// public/js/admin.js

const API_BASE = 'https://clearpro-fullstack.onrender.com/api';

// ========================
// 🔐 AUTH HANDLER
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
// 🌐 API HANDLER
// ========================
class API {
  static async get(endpoint) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: { Authorization: `Bearer ${Auth.getToken()}` }
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Failed to fetch data');
    return data;
  }

  static async patch(endpoint, body = {}) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Auth.getToken()}`
      },
      body: JSON.stringify(body)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Action failed');
    return data;
  }
}

// ========================
// 📊 LOAD DASHBOARD
// ========================
async function loadDashboard() {
  const user = Auth.getUser();
  if (!Auth.getToken() || !user) {
    window.location.href = '/admin-login.html';
    return;
  }

  // Set admin initials
  document.getElementById('admin-avatar').textContent = user.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : 'AD';
  document.getElementById('admin-name').textContent = user.name;

  document.getElementById('logoutBtn').addEventListener('click', Auth.logout);

  try {
    const [doctors, cases] = await Promise.all([
      API.get('/admin/doctors'),
      API.get('/admin/cases')
    ]);

    // Stats
    document.getElementById('totalDoctors').textContent = doctors.length;
    document.getElementById('totalCases').textContent = cases.length;
    document.getElementById('pendingCases').textContent =
      cases.filter(c => c.status === 'Pending').length;
    document.getElementById('approvedCases').textContent =
      cases.filter(c => c.status === 'Approved').length;

    // Display cases
    renderCases(cases);
    renderCharts(cases);
  } catch (err) {
    console.error(err);
    document.querySelector('#casesTable tbody').innerHTML = `
      <tr><td colspan="5" style="text-align:center; color:red;">${err.message}</td></tr>`;
  }
}

// ========================
// 🧾 CASE TABLE
// ========================
function renderCases(cases) {
  const tbody = document.querySelector('#casesTable tbody');
  if (!cases.length) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No cases found.</td></tr>`;
    return;
  }

  tbody.innerHTML = cases
    .slice(0, 10)
    .map(c => `
      <tr data-id="${c._id}">
        <td>${c.case_id || '—'}</td>
        <td>${c.doctor_name || '—'}</td>
        <td>${c.patient_name || '—'}</td>
        <td>
          <span class="status-badge status-${(c.status || 'Pending').toLowerCase()}">
            ${c.status || 'Pending'}
          </span>
        </td>
        <td>${new Date(c.createdAt).toLocaleDateString()}</td>
        <td>
          ${c.status !== 'Approved' ? `<button class="action-btn approve-btn">Approve</button>` : ''}
          ${c.status !== 'Rejected' ? `<button class="action-btn reject-btn">Reject</button>` : ''}
        </td>
      </tr>
    `)
    .join('');

  // Add action listeners
  document.querySelectorAll('.approve-btn').forEach(btn =>
    btn.addEventListener('click', handleApprove)
  );
  document.querySelectorAll('.reject-btn').forEach(btn =>
    btn.addEventListener('click', handleReject)
  );
}

// ========================
// ✅ APPROVE CASE
// ========================
async function handleApprove(e) {
  const row = e.target.closest('tr');
  const caseId = row.dataset.id;
  e.target.disabled = true;

  try {
    await API.patch(`/admin/cases/${caseId}/approve`);
    showToast('Case approved ✅');
    row.querySelector('.status-badge').textContent = 'Approved';
    row.querySelector('.status-badge').className = 'status-badge status-approved';
    row.querySelectorAll('.action-btn').forEach(btn => btn.remove());
  } catch (err) {
    showToast(err.message, true);
    e.target.disabled = false;
  }
}

// ========================
// ❌ REJECT CASE
// ========================
async function handleReject(e) {
  const row = e.target.closest('tr');
  const caseId = row.dataset.id;
  e.target.disabled = true;

  try {
    await API.patch(`/admin/cases/${caseId}/reject`);
    showToast('Case rejected ❌');
    row.querySelector('.status-badge').textContent = 'Rejected';
    row.querySelector('.status-badge').className = 'status-badge status-rejected';
    row.querySelectorAll('.action-btn').forEach(btn => btn.remove());
  } catch (err) {
    showToast(err.message, true);
    e.target.disabled = false;
  }
}

// ========================
// 📈 CHARTS
// ========================
function renderCharts(cases) {
  const ctx1 = document.getElementById('casesChart').getContext('2d');
  const monthlyCounts = Array(12).fill(0);
  cases.forEach(c => {
    const m = new Date(c.createdAt).getMonth();
    monthlyCounts[m]++;
  });

  new Chart(ctx1, {
    type: 'line',
    data: {
      labels: [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ],
      datasets: [{
        label: 'Case Submissions',
        data: monthlyCounts,
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37,99,235,0.15)',
        borderWidth: 2,
        fill: true,
        tension: 0.4
      }]
    },
    options: { plugins: { legend: { display: false } }, responsive: true }
  });

  const ctx2 = document.getElementById('statusChart').getContext('2d');
  const statusCounts = {
    Pending: cases.filter(c => c.status === 'Pending').length,
    Approved: cases.filter(c => c.status === 'Approved').length,
    Rejected: cases.filter(c => c.status === 'Rejected').length
  };

  new Chart(ctx2, {
    type: 'doughnut',
    data: {
      labels: ['Pending', 'Approved', 'Rejected'],
      datasets: [{
        data: Object.values(statusCounts),
        backgroundColor: ['#f59e0b', '#10b981', '#ef4444']
      }]
    },
    options: { plugins: { legend: { position: 'bottom' } } }
  });
}

// ========================
// 🔔 TOAST MESSAGES
// ========================
function showToast(message, isError = false) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.padding = '12px 20px';
    toast.style.borderRadius = '8px';
    toast.style.color = 'white';
    toast.style.fontWeight = '600';
    toast.style.boxShadow = '0 3px 8px rgba(0,0,0,0.2)';
    toast.style.zIndex = '3000';
  }

  toast.style.background = isError ? '#dc2626' : '#10b981';
  toast.textContent = message;
  toast.style.display = 'block';

  setTimeout(() => (toast.style.display = 'none'), 3000);
}

// ========================
// 🚀 INIT
// ========================
document.addEventListener('DOMContentLoaded', loadDashboard);
