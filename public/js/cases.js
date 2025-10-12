document.addEventListener('DOMContentLoaded', async () => {
  if (!Auth.isLoggedIn()) return (window.location.href = '/login.html');

  try {
    const res = await fetch(`${API_BASE}/cases/my-cases`, {
      headers: { Authorization: `Bearer ${Auth.getToken()}` },
    });
    const data = await res.json();
    const tbody = document.querySelector('#casesTable tbody');

    tbody.innerHTML = data.map(c => `
      <tr>
        <td>${c.case_id}</td>
        <td>${c.patient_name}</td>
        <td>${c.status}</td>
      </tr>
    `).join('');
  } catch {
    document.querySelector('#casesTable tbody').innerHTML = '<tr><td colspan="3">Error loading cases</td></tr>';
  }
});
