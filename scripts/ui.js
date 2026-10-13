import { highlight, escapeHTML } from "./search.js";

function byId(id) {
    return document.getElementById(id);
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
        option.textContent = category;
        select.append(option);

        const item = document.createElement('li');
        item.textContent = category;
        list.append(item);
    }
}

function rowHTML(record, re, currency, amount) {
    return `
        <tr data-id="${record.id}">
            <td data-label="Date">${escapeHTML(record.date)}</td>
            <td data-label="Description">${highlight(record.description, re)}</td>
            <td data-label="Category">${highlight(record.category, re)}</td>
            <td data-label="Amount">${formatMoney(amount, currency)} </td>
            <td data-label="Actions" class="actions">
                <button type="button" data-action="edit">Edit</button>
                <button type="button" data-action="delete">Delete</button>
            </td>
        </td>
    `;
}

function editRowHTML(record) {
    return `
        <tr data-id="${record.id}" class="editing">
            <td data-label="Date"><input type="text" name="date" value="${escapeHTML(record.date)}" aria-label="Date"></td>
            <td data-label="Description"><input type="text" name="description" value="${escapeHTML(record.description)}" aria-label="Description"></td>
            <td data-label="Category"><input type="text" name="category" value="${escapeHTML(record.category)}" aria-label="Category"></td>
            <td data-label="Amount"><input type="text" name="amount" value="${record.amount}" aria-label="Amount"></td>
            <td data-label="Actions" class="actions">
                <button type="button" data-action="save">Save</button>
                <button type="button" data-action="cancel">Cancel</button>
            </td>
        </tr>
    `;
}

export function renderRecords(list, re, editingId, currency, convert) {
    const body = byId('records-body');
    const empty = byId('empty-state');

    if (list.length === 0) {
        body.innerHTML = '';
        empty.hidden = false;
        return;
    }

    empty.hidden = true;
    let html = '';
    for (const record of list) {
        if (record.id === editingId) {
            html += editRowHTML(record);
        } else {
            html += rowHTML(record, re, currency, convert(record.amount));
        }
    }

    body.innerHTML = html;
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
        if (days.total > biggest) {
            biggest = day.total;
        }
    }

    let html = '';
    for (const day of days) {
        let percent = 0;
        if (biggest > 0) {
            percent = Math.round((day.total / biggest) * 100);
        }
        const label = day.date.slice(5);
        html += `
            <li class="bar-item">
                <span class="bar" style="height: ${percent}%"></span>
                <span class="bar-level">${label}</span>
                <span class="visually-hidden">${day.date}: ${day.total.toFixed(2)}</span>
            </li>
        `;
    }
    chart.innerHTML = html;
}

export function renderCap(capStatus, currency, convert) {
    const message = byId('cap-message');
    if (capStatus.isOver) {
        message.setAttribute('aria-live', 'assertive');
        message.className = 'cap over';
        message.textContent = `Over budget by ${formatMoney(convert(-capStatus.remaining), currency)} left in your budget.`;
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