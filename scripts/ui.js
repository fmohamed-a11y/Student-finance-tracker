import { highlight, escapeHTML } from './search.js';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CATEGORY_ICONS = {
  Food: '🍴',
  Books: '📚',
  Transport: '🚌',
  Entertainment: '🎬',
  Fees: '🧾',
  Other: '✨',
};

function byId(id) {
  return document.getElementById(id);
}

export function categoryIcon(name) {
  if (CATEGORY_ICONS[name]) {
    return CATEGORY_ICONS[name];
  }
  return '🏷️';
}

export function formatMoney(amount, currency) {
  return `${currency} ${Number(amount).toFixed(2)}`;
}

export function renderCategoryOptions(categories) {
  const select = byId('category');
  const list = byId('category-list');
  select.innerHTML = '<option value="">Choose a category</option>';
  list.innerHTML = '';
  for (const category of categories) {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = `${categoryIcon(category)} ${category}`;
    select.append(option);

    const item = document.createElement('li');
    const icon = document.createElement('span');
    icon.className = 'category-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = categoryIcon(category);
    item.append(icon, ` ${category}`);
    list.append(item);
  }
}

function rowHTML(record, re, currency, amount) {
  return `
    <tr data-id="${record.id}">
      <td data-label="Date">${escapeHTML(record.date)}</td>
      <td data-label="Description">${highlight(record.description, re)}</td>
      <td data-label="Category"><span class="pill"><span aria-hidden="true">${categoryIcon(record.category)}</span> ${highlight(record.category, re)}</span></td>
      <td data-label="Amount">${formatMoney(amount, currency)}</td>
      <td data-label="Actions" class="actions">
        <button type="button" data-action="edit">Edit</button>
        <button type="button" data-action="delete">Delete</button>
      </td>
    </tr>`;
}

function editRowHTML(record, categories) {
  let options = '';
  for (const category of categories) {
    let selected = '';
    if (category === record.category) {
      selected = ' selected';
    }
    options += `<option value="${escapeHTML(category)}"${selected}>${escapeHTML(category)}</option>`;
  }
  return `
    <tr data-id="${record.id}" class="editing">
      <td data-label="Date"><input type="text" name="date" value="${escapeHTML(record.date)}" aria-label="Date"></td>
      <td data-label="Description"><input type="text" name="description" value="${escapeHTML(record.description)}" aria-label="Description"></td>
      <td data-label="Category"><select name="category" aria-label="Category">${options}</select></td>
      <td data-label="Amount"><input type="text" name="amount" value="${record.amount}" aria-label="Amount"></td>
      <td data-label="Actions" class="actions">
        <button type="button" data-action="save">Save</button>
        <button type="button" data-action="cancel">Cancel</button>
      </td>
    </tr>`;
}

export function renderRecords(list, re, editingId, currency, convert, categories) {
  const body = byId('records-body');
  const empty = byId('empty-state');
  const total = byId('records-total');

  if (list.length === 0) {
    body.innerHTML = '';
    total.textContent = '';
    empty.hidden = false;
    return;
  }

  empty.hidden = true;
  let html = '';
  let sum = 0;
  for (const record of list) {
    sum = sum + record.amount;
    if (record.id === editingId) {
      html += editRowHTML(record, categories);
    } else {
      html += rowHTML(record, re, currency, convert(record.amount));
    }
  }
  body.innerHTML = html;

  let word = 'records';
  if (list.length === 1) {
    word = 'record';
  }
  total.textContent = `${list.length} ${word} · Total ${formatMoney(convert(sum), currency)}`;
}

export function readEditRow(row) {
  return {
    description: row.querySelector('[name="description"]').value,
    amount: row.querySelector('[name="amount"]').value,
    category: row.querySelector('[name="category"]').value,
    date: row.querySelector('[name="date"]').value,
  };
}

export function renderStats(stats, currency, convert) {
  byId('stat-count').textContent = stats.count;
  byId('stat-total').textContent = formatMoney(convert(stats.total), currency);
  byId('stat-top').textContent = stats.topCategory;
}

export function renderChart(days) {
  const chart = byId('chart');
  let biggest = 0;
  for (const day of days) {
    if (day.total > biggest) {
      biggest = day.total;
    }
  }

  let html = '';
  for (const day of days) {
    let percent = 0;
    if (biggest > 0) {
      percent = Math.round((day.total / biggest) * 100);
    }
    const label = DAY_NAMES[new Date(day.date + 'T00:00:00').getDay()];
    let value = '';
    if (day.total > 0) {
      value = Math.round(day.total);
    }
    html += `
      <li class="bar-item">
        <span class="bar-value" aria-hidden="true">${value}</span>
        <span class="bar" style="height: ${percent}%"></span>
        <span class="bar-label">${label}</span>
        <span class="visually-hidden">${day.date}: ${day.total.toFixed(2)}</span>
      </li>`;
  }
  chart.innerHTML = html;
}

export function renderCap(capStatus, currency, convert, cap) {
  const message = byId('cap-message');
  const bar = byId('cap-bar');
  const left = byId('stat-left');
  const leftNote = byId('stat-left-note');
  const detail = byId('cap-detail');

  let width = capStatus.percent;
  if (width > 100) {
    width = 100;
  }
  if (width < 0) {
    width = 0;
  }
  bar.style.width = `${width}%`;
  bar.className = `progress-bar ${capStatus.level}`;
  detail.textContent = `${capStatus.percent}% of your ${formatMoney(convert(cap), currency)} budget used.`;
  leftNote.textContent = `Of your ${formatMoney(convert(cap), currency)} cap`;

  if (capStatus.isOver) {
    left.textContent = formatMoney(0, currency);
    message.setAttribute('aria-live', 'assertive');
    message.className = 'cap over';
    message.textContent = `Over budget by ${formatMoney(convert(-capStatus.remaining), currency)}.`;
  } else {
    left.textContent = formatMoney(convert(capStatus.remaining), currency);
    message.setAttribute('aria-live', 'polite');
    if (capStatus.level === 'warn') {
      message.className = 'cap warn';
      message.textContent = `Heads-up: only ${formatMoney(convert(capStatus.remaining), currency)} left.`;
    } else {
      message.className = 'cap under';
      message.textContent = `${formatMoney(convert(capStatus.remaining), currency)} to spare.`;
    }
  }
}

export function showFieldError(field, message) {
  const input = byId(field);
  const error = byId(`${field}-error`);
  error.textContent = message;
  if (message) {
    input.setAttribute('aria-invalid', 'true');
  } else {
    input.removeAttribute('aria-invalid');
  }
}

export function showStatus(id, message) {
  byId(id).textContent = message;
}