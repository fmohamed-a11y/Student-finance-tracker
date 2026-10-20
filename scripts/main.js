import { validateField, validateRecord, isValid, PATTERNS, cleanText } from './validators.js';
import { compileRegex, isInvalidPattern, matchesRecord } from './search.js';
import {
  getRecords, setRecords, getSettings, updateSettings, addRecord, updateRecord,
  deleteRecord, sortRecords, getStats, getCapStatus, convertAmount,
} from './state.js';
import { loadRecords, saveRecords, loadSettings, saveSettings, exportRecords, parseImport } from './storage.js';
import {
  renderCategoryOptions, renderRecords, readEditRow, renderStats, renderChart,
  renderCap, showFieldError, showStatus,
} from './ui.js';

let editingId = null;
let displayCurrency = 'USD';
let lastLevel = null;
let toastTimer = null;

const FORM_FIELDS = ['description', 'amount', 'category', 'date'];
const WARN_OPTIONS = ['50', '75', '90'];

function convert(amount) {
  return convertAmount(amount, displayCurrency);
}

function saveAll() {
  saveRecords(getRecords());
  saveSettings(getSettings());
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () {
    toast.classList.remove('show');
  }, 3500);
}

function refresh() {
  const searchText = document.getElementById('search-input').value;
  const caseInsensitive = document.getElementById('search-case').checked;
  const re = compileRegex(searchText, caseInsensitive);

  if (isInvalidPattern(searchText)) {
    showStatus('search-error', 'That search pattern is not valid.');
  } else {
    showStatus('search-error', '');
  }

  const sortValue = document.getElementById('sort-select').value.split('-');
  const visible = [];
  for (const record of getRecords()) {
    if (matchesRecord(record, re)) {
      visible.push(record);
    }
  }
  const sorted = sortRecords(visible, sortValue[0], sortValue[1]);
  const settings = getSettings();

  renderRecords(sorted, re, editingId, displayCurrency, convert, settings.categories);

  const stats = getStats(getRecords());
  renderStats(stats, displayCurrency, convert);
  renderChart(stats.lastSevenDays);

  const capStatus = getCapStatus(stats.total, settings.cap, settings.warnAt);
  renderCap(capStatus, displayCurrency, convert, settings.cap);

  if (lastLevel !== null && capStatus.level !== lastLevel) {
    if (capStatus.level === 'warn') {
      showToast(`⚠️ Heads-up: you've used ${capStatus.percent}% of your budget.`);
    } else if (capStatus.level === 'over') {
      showToast('🚨 You are over your budget cap.');
    }
  }
  lastLevel = capStatus.level;
}

function checkField(field) {
  const value = document.getElementById(field).value;
  showFieldError(field, validateField(field, value));
}

function handleAdd(event) {
  event.preventDefault();
  const data = {};
  let ok = true;
  for (const field of FORM_FIELDS) {
    data[field] = document.getElementById(field).value;
    const message = validateField(field, data[field]);
    showFieldError(field, message);
    if (message) {
      ok = false;
    }
  }

  if (!ok) {
    showStatus('form-status', 'Please fix the errors above.');
    return;
  }

  addRecord(data);
  saveAll();
  event.target.reset();
  showStatus('form-status', 'Transaction added.');
  refresh();
}

function handleTableClick(event) {
  const button = event.target.closest('button');
  if (!button) {
    return;
  }
  const row = button.closest('tr');
  const id = row.dataset.id;
  const action = button.dataset.action;

  if (action === 'edit') {
    editingId = id;
    refresh();
    document.querySelector('tr.editing input').focus();
  }

  if (action === 'cancel') {
    editingId = null;
    refresh();
  }

  if (action === 'save') {
    const data = readEditRow(row);
    const errors = validateRecord(data);
    if (!isValid(errors)) {
      const field = Object.keys(errors)[0];
      showStatus('records-status', `Not saved: ${field} - ${errors[field]}`);
      return;
    }
    updateRecord(id, data);
    editingId = null;
    saveAll();
    showStatus('records-status', 'Transaction updated.');
    refresh();
  }

  if (action === 'delete') {
    if (confirm('Delete this transaction?')) {
      deleteRecord(id);
      saveAll();
      showStatus('records-status', 'Transaction deleted.');
      refresh();
    }
  }
}

function handleKeys(event) {
  if (event.key === 'Escape' && editingId !== null) {
    editingId = null;
    refresh();
  }
}

function handleCap(event) {
  event.preventDefault();
  const value = document.getElementById('cap-input').value;
  const warnAt = document.getElementById('warn-select').value;
  if (!PATTERNS.amount.test(value) || Number(value) === 0) {
    showStatus('settings-status', 'Enter a valid cap, like 500 or 250.50.');
    return;
  }
  if (!WARN_OPTIONS.includes(warnAt)) {
    showStatus('settings-status', 'Choose when to be warned.');
    return;
  }
  updateSettings({ cap: Number(value), warnAt: Number(warnAt) });
  saveAll();
  showStatus('settings-status', 'Budget settings saved.');
  refresh();
}

function handleRates(event) {
  event.preventDefault();
  const eur = document.getElementById('rate-eur').value;
  const rwf = document.getElementById('rate-rwf').value;
  if (!PATTERNS.amount.test(eur) || !PATTERNS.amount.test(rwf)) {
    showStatus('settings-status', 'Rates must be numbers, like 0.92 or 1300.');
    return;
  }
  updateSettings({ currencies: { EUR: Number(eur), RWF: Number(rwf) } });
  saveAll();
  showStatus('settings-status', 'Rates saved.');
  refresh();
}

function handleCurrency(event) {
  displayCurrency = event.target.value;
  refresh();
}

function handleAddCategory(event) {
  event.preventDefault();
  const input = document.getElementById('new-category');
  const name = cleanText(input.value);
  if (!PATTERNS.category.test(name)) {
    showStatus('settings-status', 'Categories use letters, single spaces or hyphens.');
    return;
  }
  const categories = getSettings().categories;
  for (const category of categories) {
    if (category.toLowerCase() === name.toLowerCase()) {
      showStatus('settings-status', 'That category already exists.');
      return;
    }
  }
  categories.push(name);
  updateSettings({ categories: categories });
  saveAll();
  renderCategoryOptions(categories);
  input.value = '';
  showStatus('settings-status', `Category "${name}" added.`);
  refresh();
}

function handleExport() {
  exportRecords(getRecords());
  showStatus('settings-status', 'Export downloaded.');
}

function applyImport(text) {
  const result = parseImport(text);
  if (result.error) {
    showStatus('settings-status', `Import failed: ${result.error}`);
    showToast('❌ Import failed. Check the file and try again.');
    return;
  }
  setRecords(result.records);
  saveAll();
  showStatus('settings-status', `Imported ${result.records.length} transactions.`);
  showToast(`✅ Imported ${result.records.length} transactions.`);
  refresh();
  location.hash = '#dashboard';
}

function handleImport(event) {
  const file = event.target.files[0];
  if (!file) {
    return;
  }
  const reader = new FileReader();
  reader.onload = function () {
    applyImport(reader.result);
    event.target.value = '';
  };
  reader.readAsText(file);
}

function handleSample() {
  fetch('seed.json', { cache: 'no-store' })
    .then(function (response) {
      return response.text();
    })
    .then(function (text) {
      applyImport(text);
    })
    .catch(function () {
      showToast('❌ Could not load seed.json.');
    });
}

function greet() {
  const name = getSettings().name;
  const count = getRecords().length;

  let hello = 'Hi there';
  if (name) {
    hello = `Hi ${name}`;
  }

  if (count === 0) {
    showToast(`👋 ${hello}! Your diary is empty. Add your first spend.`);
  } else {
    showToast(`👋 ${hello}! You have ${count} records saved.`);
  }
}

function checkName(name) {
  if (name !== '' && !PATTERNS.category.test(name)) {
    return 'Names use letters, single spaces or hyphens.';
  }
  return '';
}

function handleName(event) {
  event.preventDefault();
  const name = cleanText(document.getElementById('name-input').value);
  const message = checkName(name);
  if (message) {
    showStatus('settings-status', message);
    return;
  }
  updateSettings({ name: name, nameAsked: true });
  saveAll();
  showStatus('settings-status', 'Name saved.');
  greet();
}

function closeWelcome(name) {
  updateSettings({ name: name, nameAsked: true });
  saveAll();
  document.getElementById('name-input').value = name;
  document.getElementById('welcome').close();
  greet();
}

function handleWelcome(event) {
  event.preventDefault();
  const name = cleanText(document.getElementById('welcome-name').value);
  const message = checkName(name);
  showStatus('welcome-error', message);
  if (message) {
    return;
  }
  closeWelcome(name);
}

function handleWelcomeSkip() {
  closeWelcome('');
}

function handleWelcomeCancel(event) {
  event.preventDefault();
  closeWelcome('');
}

function start() {
  setRecords(loadRecords());
  const savedSettings = loadSettings();
  if (savedSettings) {
    updateSettings(savedSettings);
  }

  const settings = getSettings();
  renderCategoryOptions(settings.categories);
  document.getElementById('cap-input').value = settings.cap;
  document.getElementById('warn-select').value = String(settings.warnAt);
  document.getElementById('rate-eur').value = settings.currencies.EUR;
  document.getElementById('rate-rwf').value = settings.currencies.RWF;
  document.getElementById('name-input').value = settings.name || '';

  document.getElementById('record-form').addEventListener('submit', handleAdd);
  for (const field of FORM_FIELDS) {
    document.getElementById(field).addEventListener('input', function () {
      checkField(field);
    });
  }
  document.getElementById('records-body').addEventListener('click', handleTableClick);
  document.addEventListener('keydown', handleKeys);
  document.getElementById('search-input').addEventListener('input', refresh);
  document.getElementById('search-case').addEventListener('change', refresh);
  document.getElementById('sort-select').addEventListener('change', refresh);
  document.getElementById('cap-form').addEventListener('submit', handleCap);
  document.getElementById('rates-form').addEventListener('submit', handleRates);
  document.getElementById('currency-select').addEventListener('change', handleCurrency);
  document.getElementById('category-form').addEventListener('submit', handleAddCategory);
  document.getElementById('sample-btn').addEventListener('click', handleSample);
  document.getElementById('export-btn').addEventListener('click', handleExport);
  document.getElementById('import-file').addEventListener('change', handleImport);
  document.getElementById('name-form').addEventListener('submit', handleName);
  document.getElementById('welcome-form').addEventListener('submit', handleWelcome);
  document.getElementById('welcome-skip').addEventListener('click', handleWelcomeSkip);
  document.getElementById('welcome').addEventListener('cancel', handleWelcomeCancel);

  refresh();

  if (settings.nameAsked || settings.name) {
    greet();
  } else {
    document.getElementById('welcome').showModal();
    document.getElementById('welcome-name').focus();
  }
}

start();

