document.addEventListener('DOMContentLoaded', async () => {
  if (!Auth.isLoggedIn()) return (window.location.href = '/login.html');
  const user = Auth.getUser();
  document.getElementById('doctorName').textContent = user?.name || 'Doctor';

  document.getElementById('logoutBtn')?.addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/admin-login.html'; // ✅ redirect to login page
});
  try {
    const res = await fetch(`${API_BASE}/cases/my-cases`, {
      headers: { Authorization: `Bearer ${Auth.getToken()}` },
    });
    const cases = await res.json();
    document.getElementById('caseCount').textContent = cases.length;
  } catch {
    document.getElementById('caseCount').textContent = 'Error loading cases';
  }
});
