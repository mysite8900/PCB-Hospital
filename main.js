// State management
let state = {
  isLoggedIn: false,
  username: '',
  activeSection: 'appointment',
  doctors: [],
  nurses: [],
  patients: [],
  appointments: [],
  reports: [],
  bills: [],
  modals: {
    schedulePatient: false,
    findAppointment: false,
    addPatient: false,
    addBill: false
  }
};

// DOM Elements
const root = document.getElementById('root');

// Initial render
renderApp();

// Main render function
function renderApp() {
  if (!state.isLoggedIn) {
    renderLoginForm();
  } else {
    renderDashboard();
  }
}

// Login Form
function renderLoginForm() {
  const loginForm = `
    <div class="flex-center min-h-screen p-6">
      <div class="card max-w-md w-full">
        <div class="p-6">
          <div class="text-center">
            <h1 class="text-3xl font-bold text-primary">PCB Hospital</h1>
            <h2 class="mt-2 text-2xl">Login</h2>
            <p class="mt-2 text-sm text-gray-600">
              Please enter your credentials to access the system
            </p>
          </div>

          <form id="login-form" class="mt-8 space-y-6">
            <div class="form-group">
              <label class="form-label" for="username">User ID</label>
              <input 
                type="text" 
                id="username" 
                class="form-control" 
                placeholder="Enter your user ID" 
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label" for="password">Password</label>
              <input 
                type="password" 
                id="password" 
                class="form-control" 
                placeholder="Enter your password" 
                required
              />
            </div>

            <button type="submit" class="btn btn-primary w-full">
              Login
            </button>

            <div class="text-center text-xs text-gray-500">
              <p></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;

  root.innerHTML = loginForm;

  // Add login form event listener
  document.getElementById('login-form').addEventListener('submit', handleLogin);
}

// Login handler
function handleLogin(event) {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // Simple validation for demo purposes
  if (username === 'Priti' && password === '8900') {
    state.isLoggedIn = true;
    state.username = username;
    
    // Fetch initial data
    fetchData();
    
    // Re-render app
    renderApp();
  } else {
    alert('Invalid username or password. Please try again.');
  }
}

// Dashboard
function renderDashboard() {
  const dashboard = `
    <div class="layout">
      <!-- Sidebar -->
      <div class="sidebar">
        <div class="sidebar-logo">
          <div class="logo-main">PCB</div>
          <div class="logo-sub">Hospital<sup>TM</sup></div>
        </div>
        <div>Welcome</div>
      </div>

      <div class="main-wrapper">
        <!-- Navigation Tabs -->
        <nav>
          <div class="nav-tabs">
            <button 
              class="nav-tab ${state.activeSection === 'appointment' ? 'active' : ''}" 
              data-section="appointment"
            >
              Appointments
            </button>
            <button 
              class="nav-tab ${state.activeSection === 'patient-details' ? 'active' : ''}" 
              data-section="patient-details"
            >
              Patient Details
            </button>
            <button 
              class="nav-tab ${state.activeSection === 'nurse-dashboard' ? 'active' : ''}" 
              data-section="nurse-dashboard"
            >
              Nurse Dashboard
            </button>
            <button 
              class="nav-tab ${state.activeSection === 'doctor-dashboard' ? 'active' : ''}" 
              data-section="doctor-dashboard"
            >
              Doctor Dashboard
            </button>
            <button 
              class="nav-tab ${state.activeSection === 'Reports' ? 'active' : ''}" 
              data-section="Reports"
            >
              Reports
            </button>
            <button 
              class="nav-tab ${state.activeSection === 'billing' ? 'active' : ''}" 
              data-section="billing"
            >
              Billing
            </button>
            <button id="logout-btn" class="nav-tab" style="margin-left: auto;">
              Logout
            </button>
          </div>
        </nav>

        <!-- Main Content -->
        <main>
          <div class="main-content">
            ${renderActiveSection()}
          </div>
        </main>

        <!-- Footer -->
        <footer>
          <div class="container">
            &copy; 2025 PCB Hospital. All rights reserved. | Website created by Priti Bhandare.
          </div>
        </footer>
      </div>

      <!-- Modals -->
      ${state.modals.schedulePatient ? renderSchedulePatientModal() : ''}
      ${state.modals.findAppointment ? renderFindAppointmentModal() : ''}
      ${state.modals.addPatient ? renderAddPatientModal() : ''}
      ${state.modals.addBill ? renderAddBillModal() : ''}
    </div>
  `;

  root.innerHTML = dashboard;

  // Add event listeners
  document.getElementById('logout-btn').addEventListener('click', handleLogout);
  
  // Add tab navigation listeners
  document.querySelectorAll('.nav-tab').forEach(tab => {
    if (tab.id !== 'logout-btn') {
      tab.addEventListener('click', () => {
        state.activeSection = tab.dataset.section;
        renderApp();
      });
    }
  });

  // Add section-specific event listeners
  addSectionEventListeners();
}

// Render the active section based on state
function renderActiveSection() {
  switch (state.activeSection) {
    case 'appointment':
      return renderAppointmentsSection();
    case 'patient-details':
      return renderPatientsSection();
    case 'nurse-dashboard':
      return renderNurseSection();
    case 'doctor-dashboard':
      return renderDoctorSection();
    case 'Reports':
      return renderReportsSection();
    case 'billing':
      return renderBillingSection();
    default:
      return '';
  }
}

// Appointments Section
function renderAppointmentsSection() {
  return `
    <div>
      <div class="section-header">
        <h2 class="section-title">Appointments</h2>
        <div class="flex gap-3">
          <button id="schedule-patient-btn" class="btn btn-primary">
            Schedule New Patient
          </button>
          <button id="find-appointment-btn" class="btn btn-outline">
            Find Appointment
          </button>
        </div>
      </div>

      <div class="card">
        <div class="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Doctor</th>
                <th>Department</th>
                <th>Date</th>
                <th>Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${state.appointments.length === 0 ? 
                `<tr><td colspan="6" class="text-center">No appointments found</td></tr>` : 
                state.appointments.map(appt => `
                  <tr>
                    <td>${appt.patientName}</td>
                    <td>${appt.doctorName}</td>
                    <td>${appt.department}</td>
                    <td>${appt.date}</td>
                    <td>${appt.time}</td>
                    <td>
                      <div class="action-buttons">
                        <button class="action-btn">Edit</button>
                        <button class="action-btn">Cancel</button>
                      </div>
                    </td>
                  </tr>
                `).join('')
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// Patients Section
function renderPatientsSection() {
  return `
    <div>
      <div class="section-header">
        <h2 class="section-title">Patient Details</h2>
        <button id="add-patient-btn" class="btn btn-primary">
          Add New Patient
        </button>
      </div>

      <div class="card">
        <div class="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Problem</th>
                <th>Assigned Doctor</th>
                <th>Admit Date</th>
                <th>Discharge Date</th>
                <th>Assigned Room</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${state.patients.length === 0 ? 
                `<tr><td colspan="7" class="text-center">No patients found</td></tr>` : 
                state.patients.map(patient => `
                  <tr>
                    <td>${patient.name}</td>
                    <td>${patient.problem}</td>
                    <td>${patient.doctorName}</td>
                    <td>${patient.admitDate}</td>
                    <td>${patient.dischargeDate}</td>
                    <td>${patient.assignedRoom}</td>
                    <td>
                      <div class="action-buttons">
                        <button class="action-btn">View</button>
                        <button class="action-btn">Discharge</button>
                      </div>
                    </td>
                  </tr>
                `).join('')
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// Nurse Section
function renderNurseSection() {
  return `
    <div>
      <h2 class="section-title mb-6">Nurse Dashboard</h2>

      <div class="card">
        <div class="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Shift Time</th>
                <th>Working Hours</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${state.nurses.length === 0 ? 
                `<tr><td colspan="4" class="text-center">No nurses found</td></tr>` : 
                state.nurses.map(nurse => `
                  <tr>
                    <td>${nurse.name}</td>
                    <td>${nurse.shiftTime}</td>
                    <td>${nurse.workingHours}</td>
                    <td>
                      <div class="action-buttons">
                        <button class="action-btn">View Schedule</button>
                      </div>
                    </td>
                  </tr>
                `).join('')
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// Doctor Section
function renderDoctorSection() {
  return `
    <div>
      <h2 class="section-title mb-6">Doctor Dashboard</h2>

      <div class="card">
        <div class="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Department</th>
                <th>Experience</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${state.doctors.length === 0 ? 
                `<tr><td colspan="4" class="text-center">No doctors found</td></tr>` : 
                state.doctors.map(doctor => `
                  <tr>
                    <td>${doctor.name}</td>
                    <td>${doctor.department}</td>
                    <td>${doctor.experience}</td>
                    <td>
                      <div class="action-buttons">
                        <button class="action-btn">View Schedule</button>
                      </div>
                    </td>
                  </tr>
                `).join('')
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// Reports Section
function renderReportsSection() {
  return `
    <div>
      <h2 class="section-title mb-2">Reports</h2>
      <p class="text-gray-600 mb-6">
        The hospital Reports section includes diagnostic tests, MRI, CT Scan, and advanced blood testing results.
      </p>

      <div class="card">
        <div class="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Status</th>
                <th>Test Name</th>
                <th>Test Report</th>
                <th>Report File</th>
              </tr>
            </thead>
            <tbody>
              ${state.reports.length === 0 ? 
                `<tr><td colspan="6" class="text-center">No reports found</td></tr>` : 
                state.reports.map(report => `
                  <tr>
                    <td>${report.patientName}</td>
                    <td>${report.age}</td>
                    <td>
                      <span class="badge ${getStatusClass(report.status)}">
                        ${report.status}
                      </span>
                    </td>
                    <td>${report.testName}</td>
                    <td>${report.testReport}</td>
                    <td>
                      <button 
                        class="action-btn" 
                        ${report.status === "Pending" ? 'disabled' : ''}
                      >
                        View Report
                      </button>
                    </td>
                  </tr>
                `).join('')
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// Billing Section
function renderBillingSection() {
  return `
    <div>
      <div class="section-header">
        <h2 class="section-title">Billing</h2>
        <button id="add-bill-btn" class="btn btn-primary">
          Add New Bill
        </button>
      </div>

      <div class="card">
        <div class="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Amount</th>
                <th>Doctor</th>
                <th>Department</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${state.bills.length === 0 ? 
                `<tr><td colspan="6" class="text-center">No bills found</td></tr>` : 
                state.bills.map(bill => `
                  <tr>
                    <td>${bill.patientName}</td>
                    <td>${bill.amount}</td>
                    <td>
                      <div>Dr.</div>
                      <div>${bill.doctorName.replace('Dr. ', '')}</div>
                    </td>
                    <td>${bill.department}</td>
                    <td>${bill.date}</td>
                    <td>
                      <div class="action-buttons">
                        <button class="action-btn">Print</button>
                        <button class="action-btn">Delete</button>
                      </div>
                    </td>
                  </tr>
                `).join('')
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// Rest of the code remains the same
// Modal renderers
function renderSchedulePatientModal() {
  return `
    <div class="modal-backdrop">
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">Schedule New Patient</h3>
        </div>
        
        <form id="schedule-patient-form">
          <div class="form-group">
            <label class="form-label">Patient Name</label>
            <input type="text" class="form-control" name="patientName" required>
          </div>
          
          <div class="form-group">
            <label class="form-label">Doctor</label>
            <select class="form-control" name="doctorName" required>
              <option value="">Select a doctor</option>
              ${state.doctors.map(doctor => `
                <option value="${doctor.name}">${doctor.name} (${doctor.department})</option>
              `).join('')}
            </select>
          </div>
          
          <div class="form-group">
            <label class="form-label">Department</label>
            <select class="form-control" name="department" required>
              <option value="">Select a department</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Neurology">Neurology</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="General Medicine">General Medicine</option>
              <option value="Dermatology">Dermatology</option>
            </select>
          </div>
          
          <div class="form-group">
            <label class="form-label">Date</label>
            <input type="date" class="form-control" name="date" required>
          </div>
          
          <div class="form-group">
            <label class="form-label">Time</label>
            <input type="time" class="form-control" name="time" required>
          </div>
          
          <div class="modal-footer">
            <button type="button" class="btn btn-outline close-modal-btn">Cancel</button>
            <button type="submit" class="btn btn-primary">Schedule</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function renderFindAppointmentModal() {
  return `
    <div class="modal-backdrop">
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">Find Appointment</h3>
        </div>
        
        <form id="find-appointment-form">
          <div class="form-group">
            <label class="form-label">Patient Name</label>
            <input type="text" class="form-control" name="patientName">
          </div>
          
          <div class="form-group">
            <label class="form-label">Appointment Date (Optional)</label>
            <input type="date" class="form-control" name="date">
          </div>
          
          <div class="form-group">
            <label class="form-label">Doctor (Optional)</label>
            <select class="form-control" name="doctorName">
              <option value="">Any Doctor</option>
              ${state.doctors.map(doctor => `
                <option value="${doctor.name}">${doctor.name}</option>
              `).join('')}
            </select>
          </div>
          
          <div id="search-results" class="mt-6 hidden">
            <h4 class="font-medium text-gray-700 mb-2">Search Results:</h4>
            <div class="border rounded-md max-h-48 overflow-y-auto" id="results-container">
              <!-- Results will be inserted here -->
            </div>
          </div>
          
          <div class="modal-footer">
            <button type="button" class="btn btn-outline" id="reset-search-btn">Reset</button>
            <button type="button" class="btn btn-outline close-modal-btn">Close</button>
            <button type="submit" class="btn btn-primary">Search</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function renderAddPatientModal() {
  return `
    <div class="modal-backdrop">
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">Add New Patient</h3>
        </div>
        
        <form id="add-patient-form">
          <div class="form-group">
            <label class="form-label">Patient Name</label>
            <input type="text" class="form-control" name="name" required>
          </div>
          
          <div class="form-group">
            <label class="form-label">Problem</label>
            <input type="text" class="form-control" name="problem" required>
          </div>
          
          <div class="form-group">
            <label class="form-label">Doctor</label>
            <select class="form-control" name="doctorName" required>
              <option value="">Select a doctor</option>
              ${state.doctors.map(doctor => `
                <option value="${doctor.name}">${doctor.name} (${doctor.department})</option>
              `).join('')}
            </select>
          </div>
          
          <div class="form-group">
            <label class="form-label">Admit Date</label>
            <input type="date" class="form-control" name="admitDate" required>
          </div>
          
          <div class="form-group">
            <label class="form-label">Discharge Date (Estimated)</label>
            <input type="date" class="form-control" name="dischargeDate">
          </div>
          
          <div class="form-group">
            <label class="form-label">Assigned Room</label>
            <input type="text" class="form-control" name="assignedRoom" required>
          </div>
          
          <div class="modal-footer">
            <button type="button" class="btn btn-outline close-modal-btn">Cancel</button>
            <button type="submit" class="btn btn-primary">Add Patient</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function renderAddBillModal() {
  return `
    <div class="modal-backdrop">
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">Add New Bill</h3>
        </div>
        
        <form id="add-bill-form">
          <div class="form-group">
            <label class="form-label">Patient Name</label>
            <input type="text" class="form-control" name="patientName" required>
          </div>
          
          <div class="form-group">
            <label class="form-label">Amount (₹)</label>
            <input type="number" min="0" class="form-control" name="amount" required>
          </div>
          
          <div class="form-group">
            <label class="form-label">Doctor</label>
            <select class="form-control" name="doctorName" required>
              <option value="">Select a doctor</option>
              ${state.doctors.map(doctor => `
                <option value="${doctor.name}">${doctor.name}</option>
              `).join('')}
            </select>
          </div>
          
          <div class="form-group">
            <label class="form-label">Department</label>
            <select class="form-control" name="department" required>
              <option value="">Select a department</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Neurology">Neurology</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="General Medicine">General Medicine</option>
              <option value="Dermatology">Dermatology</option>
            </select>
          </div>
          
          <div class="form-group">
            <label class="form-label">Date</label>
            <input type="date" class="form-control" name="date" required>
          </div>
          
          <div class="modal-footer">
            <button type="button" class="btn btn-outline close-modal-btn">Cancel</button>
            <button type="submit" class="btn btn-primary">Add Bill</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

// Helper function to get status class
function getStatusClass(status) {
  switch (status) {
    case 'Completed':
      return 'bg-success';
    case 'Pending':
      return 'bg-warning';
    default:
      return 'bg-gray';
  }
}

// Event listeners for section-specific buttons
function addSectionEventListeners() {
  // Appointment section
  const schedulePatientBtn = document.getElementById('schedule-patient-btn');
  if (schedulePatientBtn) {
    schedulePatientBtn.addEventListener('click', () => {
      state.modals.schedulePatient = true;
      renderApp();
    });
  }
  
  const findAppointmentBtn = document.getElementById('find-appointment-btn');
  if (findAppointmentBtn) {
    findAppointmentBtn.addEventListener('click', () => {
      state.modals.findAppointment = true;
      renderApp();
    });
  }
  
  // Patient section
  const addPatientBtn = document.getElementById('add-patient-btn');
  if (addPatientBtn) {
    addPatientBtn.addEventListener('click', () => {
      state.modals.addPatient = true;
      renderApp();
    });
  }
  
  // Billing section
  const addBillBtn = document.getElementById('add-bill-btn');
  if (addBillBtn) {
    addBillBtn.addEventListener('click', () => {
      state.modals.addBill = true;
      renderApp();
    });
  }
  
  // Modal close buttons
  document.querySelectorAll('.close-modal-btn').forEach(btn => {
    btn.addEventListener('click', closeAllModals);
  });
  
  // Modal backdrop close
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', event => {
      if (event.target === backdrop) {
        closeAllModals();
      }
    });
  });
  
  // Reset search button in find appointment modal
  const resetSearchBtn = document.getElementById('reset-search-btn');
  if (resetSearchBtn) {
    resetSearchBtn.addEventListener('click', resetSearchForm);
  }
  
  // Setup form submissions
  setupFormSubmissions();
}

// Form submissions
function setupFormSubmissions() {
  // Schedule Patient Form
  const schedulePatientForm = document.getElementById('schedule-patient-form');
  if (schedulePatientForm) {
    schedulePatientForm.addEventListener('submit', handleSchedulePatient);
  }
  
  // Find Appointment Form
  const findAppointmentForm = document.getElementById('find-appointment-form');
  if (findAppointmentForm) {
    findAppointmentForm.addEventListener('submit', handleFindAppointment);
  }
  
  // Add Patient Form
  const addPatientForm = document.getElementById('add-patient-form');
  if (addPatientForm) {
    addPatientForm.addEventListener('submit', handleAddPatient);
  }
  
  // Add Bill Form
  const addBillForm = document.getElementById('add-bill-form');
  if (addBillForm) {
    addBillForm.addEventListener('submit', handleAddBill);
  }
}

// Form handlers
function handleSchedulePatient(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  
  const appointment = {
    patientName: formData.get('patientName'),
    doctorName: formData.get('doctorName'),
    department: formData.get('department'),
    date: formData.get('date'),
    time: formData.get('time')
  };
  
  // Add to state
  state.appointments.push(appointment);
  
  // Close modal
  closeAllModals();
  
  // Re-render app
  renderApp();
}

function handleFindAppointment(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  
  const patientName = formData.get('patientName');
  const date = formData.get('date');
  const doctorName = formData.get('doctorName');
  
  // Filter appointments
  const filteredAppointments = state.appointments.filter(appt => {
    if (patientName && !appt.patientName.toLowerCase().includes(patientName.toLowerCase())) {
      return false;
    }
    
    if (date && appt.date !== date) {
      return false;
    }
    
    if (doctorName && appt.doctorName !== doctorName) {
      return false;
    }
    
    return true;
  });
  
  // Show results
  const searchResults = document.getElementById('search-results');
  const resultsContainer = document.getElementById('results-container');
  
  if (searchResults && resultsContainer) {
    searchResults.classList.remove('hidden');
    
    if (filteredAppointments.length === 0) {
      resultsContainer.innerHTML = `<div class="p-4 text-center text-gray-500">No appointments found matching the criteria.</div>`;
    } else {
      resultsContainer.innerHTML = filteredAppointments.map(appt => `
        <div class="p-3 border-b hover:bg-gray-50 last:border-b-0">
          <div class="font-medium">${appt.patientName}</div>
          <div class="text-sm text-gray-500">
            ${appt.date} at ${appt.time} with ${appt.doctorName}
          </div>
        </div>
      `).join('');
    }
  }
}

function handleAddPatient(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  
  const patient = {
    name: formData.get('name'),
    problem: formData.get('problem'),
    doctorName: formData.get('doctorName'),
    admitDate: formData.get('admitDate'),
    dischargeDate: formData.get('dischargeDate') || 'TBD',
    assignedRoom: formData.get('assignedRoom')
  };
  
  // Add to state
  state.patients.push(patient);
  
  // Close modal
  closeAllModals();
  
  // Re-render app
  renderApp();
}

function handleAddBill(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  
  const bill = {
    patientName: formData.get('patientName'),
    amount: `₹${formData.get('amount')}`,
    doctorName: formData.get('doctorName'),
    department: formData.get('department'),
    date: formData.get('date')
  };
  
  // Add to state
  state.bills.push(bill);
  
  // Close modal
  closeAllModals();
  
  // Re-render app
  renderApp();
}

// Reset search form
function resetSearchForm() {
  const form = document.getElementById('find-appointment-form');
  if (form) {
    form.reset();
  }
  
  const searchResults = document.getElementById('search-results');
  if (searchResults) {
    searchResults.classList.add('hidden');
  }
}

// Logout handler
function handleLogout() {
  state.isLoggedIn = false;
  state.username = '';
  state.activeSection = 'appointment';
  
  // Clear modals
  closeAllModals();
  
  // Re-render app
  renderApp();
}

// Close all modals
function closeAllModals() {
  Object.keys(state.modals).forEach(key => {
    state.modals[key] = false;
  });
  
  renderApp();
}

// Data fetching functions
function fetchData() {
  // In a real app, these would be API calls
  fetchDoctors();
  fetchNurses();
  fetchPatients();
  fetchAppointments();
  fetchReports();
  fetchBills();
}

// Simulated API functions
function fetchDoctors() {
  state.doctors = [
    { name: "Dr. Verma", department: "Cardiology", experience: "15 years" },
    { name: "Dr. Mehta", department: "Neurology", experience: "10 years" },
    { name: "Dr. Khanna", department: "Orthopedics", experience: "12 years" },
    { name: "Dr. Nisha", department: "General Medicine", experience: "8 years" },
  ];
}

function fetchNurses() {
  state.nurses = [
    { name: "Priya Sharma", shiftTime: "Day", workingHours: "8 AM - 4 PM" },
    { name: "Neha Patel", shiftTime: "Night", workingHours: "8 PM - 4 AM" },
    { name: "Anjali Gupta", shiftTime: "Evening", workingHours: "4 PM - 12 AM" },
  ];
}

function fetchPatients() {
  state.patients = [
    { 
      name: "Rahul Sharma", 
      problem: "Heart Issue", 
      doctorName: "Dr. Verma", 
      admitDate: "2025-02-15", 
      dischargeDate: "2025-02-25", 
      assignedRoom: "101" 
    },
    { 
      name: "Priya Mehta", 
      problem: "Brain Injury", 
      doctorName: "Dr. Mehta", 
      admitDate: "2025-03-01", 
      dischargeDate: "2025-03-15", 
      assignedRoom: "203" 
    },
  ];
}

function fetchAppointments() {
  state.appointments = [
    {
      patientName: "Amit Sharma",
      doctorName: "Dr. Verma",
      department: "Cardiology",
      date: "2025-03-25",
      time: "10:30 AM"
    },
    {
      patientName: "Neha Singh",
      doctorName: "Dr. Mehta",
      department: "Neurology",
      date: "2025-03-26",
      time: "2:15 PM"
    },
  ];
}

function fetchReports() {
  state.reports = [
    {
      patientName: "Rahul Sharma",
      age: "45",
      status: "Completed",
      testName: "Blood Test",
      testReport: "Hemoglobin: 14.2 g/dL"
    },
    {
      patientName: "Priya Mehta",
      age: "32",
      status: "Pending",
      testName: "MRI Scan",
      testReport: "Awaiting results"
    },
  ];
}

function fetchBills() {
  state.bills = [
    {
      patientName: "Rohan Das",
      amount: "₹5000",
      doctorName: "Verma",
      department: "Cardiology",
      date: "2025-03-20"
    },
    {
      patientName: "Neha Singh",
      amount: "₹8500",
      doctorName: "Mehta",
      department: "Neurology",
      date: "2025-03-15"
    },
  ];
}