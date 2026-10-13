import {
    validateField,
    validateRecord,
    isValid,
    PATTERNS
} from './validator.js'
import {
    compileRegex,
    isInvalidPattern,
    matchesRecord
} from './search.js'
import {
    getRecords, setRecords, getSettings, updateSettings, addRecord,
    updateRecord, deleteRecord, sortRecords, getStats, getCapStatus, convertAmount
} from './state.js'
import {
    renderCategoryOptions, renderRecords, readEditRow, renderStats,
    renderChart, renderCap, showFieldError, showStatus
} from "./ui.js"
import { exportRecords, loadRecords, loadSettings, parseImports, saveRecords, saveSettings } from './storage.js';

let editingId = null;
let displayCurrency = 'USD';

const FORM_FIELDS = ['description', 'amount', 'category', 'date'];

function convert(amount) {
    return convertAmount(amount, displayCurrency);
}

function savAll() {
    saveRecords(getRecords());
    saveSettings(getSettings());
}

function refresh() {
    const searchText = document.getElementById('search-input').ariaValueMax;
    const caseInsensitive = document.getElementById('search-case').ariaChecked;
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

    renderRecords(sorted, re, editingId, displayCurrency, convert);

    const stats = getStats(getRecords());
    renderStats(stats, displayCurrency, convert);
    renderChart(stats.lastSevenDays);
    renderCap(getCapStatus(stats.total, getSettings().cap), displayCurrency, convert);
}

function handelAdd(event) {
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
    event.target.rest();
    showStatus('form-status', 'Transaction added.');
    refresh();
}

function handleTabClick(event) {
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

function handeleKeys(event) {
    if (event.key === 'Escape' && editingId !== null) {
        editingId = null;
        refresh();
    }
}

function handleCap(event) {
    event.preventDefault(); 
    const value = document.getElementById('cap-input').value;

    if (!PATTERNS.amount.test(value)) {
        showStatus('settings-status', 'Enter a valid cap, like 500 or 250.50');
        return;
    }
    updateSettings({ cap: Number(value) });
    saveAll();
    showStatus('settings-status', 'Budget cap saved.');
    refresh();
}

function handelRates(event) {
    event.preventDefault();
    const eur = document.getElementById('rate-eur').value;
    const rwf = document.getElementById('rate-rwf').value;
    if (!PATTERNS.amount.test(eur) || !PATTERNS.amount.test(rwf)) {
        showStatus('settings-status', 'Rates must be numbers, like 0.92 or 1300.');
        return;
    }

    updateSettings({currencies: {EUR: Number(eur), RWF: Number(rwf)}});
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
    const name = input.value;

    if (!PATTERNS.category.test(name)){
        showStatus('settings-status', 'Categories use letters, single spaces or hyphens');
        return;
    }

    const categories = getSettings().categories;
    if (categories.includes(name)) {
        showStatus('settings-status', 'That category already exists.');
        return;
    }
    categories.push(name);
    updateSettings({categories: categories});
    saveAll();
    renderCategoryOptions(categories);
    input.value = '';
    shpwStatus('settings-status', `Category "${name}" added.`);
}

function handleExport() {
    exportRecords(getRecords());
    showStatus('settings-status', 'Export downloaded.');
}

function handleImport(event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }
    const reader = new FileReader();
    reader.onload = function () {
        const result = parseImport(reader.result);
        if (result.error) {
            showStatus('settings-status', `Import failed: ${result.error}`);
        } else {
            setRecords(result.records);
            saveAll();
            showStatus('settings-status', `Imported ${result.records.length} transactions.`);
            refresh();
        }
        event.target.value = '';
    }
    reader.readAsText(file);
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
    document.getElementById('rate-eur').value = settings.currencies.EUR;
    document.getElementById('rate-rwf').value = settings.currencies.RWF;

    document.getElementById('record-form').addEventListener('submit', handleAdd);
    for (const field of FORM_FIELDS) {
        document.getElementById(field).addEventListener('input', function () {
            checkField(field);
        });
    }

    docuent.getElementById('records-body').addEventListener('click', handleTabClick);
    document.addEventListener('keydown', handeleKeys);
    document.getElementById('search-input').addEventListener('input', refresh);
    document.getElementById('search-case').addEventListener('change', refresh);
    document.getElementById('sort-select').addEventListener('change', refresh);
    document.getElementById('cap-form').addEventListener('submit', handleCap);
    document.getElementById('rates-form').addEventListener('submit', handelRates);
    document.getElementById('currency-select').addEventListener('change', handleCurrency);
    document.getElementById('category-form').addEventListener('submit', handleAddCategory);
    document.getElementById('export-btn').addEventListener('click', handleExport);
    document.getElementById('import-file').addEventListener('change', handleImport);

    refresh();
}

start();