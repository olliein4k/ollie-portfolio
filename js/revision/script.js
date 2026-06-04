import { validateToken, isAuthenticated } from './auth.js';
import { loadTrackerData, saveTrackerData } from './db.js';
import { setStatus, renderTable, updateTotals } from './ui.js';

const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const subjects = ['phy','pur','mec','sta','cs'];
const weekend = [0,6];
const start = new Date(2026, 3, 1);
const end = new Date(2026, 3, 20);

const tbody = document.getElementById('tbody');
const statusEl = document.getElementById('status');
const authStatusEl = document.getElementById('auth-status');
const tokenInput = document.getElementById('token-input');

const config = { tbody, start, end, subjects, days, weekend };

let data = {};
let saveTimer = null;

// Load stored token
tokenInput.value = localStorage.getItem('trackerToken') || '';

// Validate on load
await validateToken(tokenInput.value, authStatusEl, setStatus);

// Listen for changes
tokenInput.addEventListener('input', async (e) => {
  const token = e.target.value;
  localStorage.setItem('trackerToken', token);
  await validateToken(token, authStatusEl, setStatus);
});

// Load data
data = await loadTrackerData(initData, setStatus, statusEl);
renderTable(data, config, saveData, updateTotals);
updateTotals(data, config);

function initData() {
  const obj = {};
  for (let d = new Date(start); d <= end; d.setDate(d.getDate()+1)) {
    const key = d.toISOString().slice(0,10);
    obj[key] = {};
    subjects.forEach(s => obj[key][s] = '');
  }
  return obj;
}

function saveData() {
  const TOKEN = tokenInput.value;

  if (!TOKEN) {
    setStatus(statusEl, 'Enter password', 'status-amber');
    return;
  }

  if (!isAuthenticated) {
    setStatus(statusEl, 'Invalid password', 'status-red');
    return;
  }

  clearTimeout(saveTimer);
  setStatus(statusEl, 'Saving...', 'status-amber');

  saveTimer = setTimeout(async () => {
    try {
      await saveTrackerData(data, TOKEN);
      setStatus(statusEl, 'Synced', 'status-green');
    } catch (e) {
      setStatus(statusEl, 'Save failed', 'status-red');
    }
  }, 1000);
}