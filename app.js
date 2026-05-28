let weddingData = {};

async function loadData() {
  const response = await fetch('./data.json');
  weddingData = await response.json();

  renderSummary();
  renderBudget();
  renderGuests();
  renderTasks();
  renderVendors();
}

function renderSummary() {
  const section = document.getElementById('summarySection');

  const totalEstimated = weddingData.budget.reduce(
    (sum, item) => sum + item.estimated,
    0
  );

  const totalActual = weddingData.budget.reduce(
    (sum, item) => sum + item.actual,
    0
  );

  const confirmedGuests = weddingData.guests.filter(
    g => g.rsvp === 'Confirmed'
  ).length;

  const pendingTasks = weddingData.tasks.filter(
    t => !t.completed
  ).length;

  section.innerHTML = `
    <div class="summary-item">
      <h3>Total Budget</h3>
      <p>Rs. ${totalEstimated.toLocaleString()}</p>
    </div>

    <div class="summary-item">
      <h3>Actual Cost</h3>
      <p>Rs. ${totalActual.toLocaleString()}</p>
    </div>

    <div class="summary-item">
      <h3>Confirmed Guests</h3>
      <p>${confirmedGuests}</p>
    </div>

    <div class="summary-item">
      <h3>Pending Tasks</h3>
      <p>${pendingTasks}</p>
    </div>
  `;
}

function renderBudget() {
  const tbody = document.getElementById('budgetTable');

  tbody.innerHTML = weddingData.budget.map(item => {
    const status = item.actual <= item.estimated
      ? 'Within Budget'
      : 'Over Budget';

    return `
      <tr>
        <td>${item.category}</td>
        <td>Rs. ${item.estimated.toLocaleString()}</td>
        <td>Rs. ${item.actual.toLocaleString()}</td>
        <td>${status}</td>
      </tr>
    `;
  }).join('');
}

function renderGuests(filteredGuests = null) {
  const tbody = document.getElementById('guestTable');

  const guests = filteredGuests || weddingData.guests;

  tbody.innerHTML = guests.map(guest => `
    <tr>
      <td>${guest.name}</td>
      <td>${guest.side}</td>
      <td>${guest.rsvp}</td>
      <td>${guest.table}</td>
    </tr>
  `).join('');
}

function renderTasks() {
  const container = document.getElementById('taskList');

  container.innerHTML = weddingData.tasks.map(task => `
    <div class="task-item">
      <div>
        <strong>${task.title}</strong>
        <p>${task.deadline}</p>
      </div>

      <div class="task-status ${task.completed ? 'completed' : 'pending'}">
        ${task.completed ? 'Done' : 'Pending'}
      </div>
    </div>
  `).join('');
}

function renderVendors() {
  const container = document.getElementById('vendorList');

  container.innerHTML = weddingData.vendors.map(vendor => `
    <div class="vendor-card">
      <h3>${vendor.category}</h3>
      <p><strong>${vendor.name}</strong></p>
      <p>${vendor.phone}</p>
      <p>${vendor.notes}</p>
    </div>
  `).join('');
}


document.getElementById('guestSearch').addEventListener('input', e => {
  const value = e.target.value.toLowerCase();

  const filtered = weddingData.guests.filter(g =>
    g.name.toLowerCase().includes(value)
  );

  renderGuests(filtered);
});

loadData();