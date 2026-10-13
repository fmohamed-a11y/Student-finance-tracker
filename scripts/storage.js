import { validateField, isValid, validateRecord } from "./validator.js";

const RECORD_KEY = 'finance:records';
const SETTINGS_KEY = 'finance:settings';

export function loadRecords() {
    try {
        const saved = JSON.parse(localStorage.getItem(RECORD_KEY));
        if (Array.isArray(saved)) {
            return saved;
        }

        return [];
    } catch(error) {
        return [];
    }
}

export function saveRecords(records) {
    localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
}

export function loadSettings() {
    try {
        const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY));
        if(saved && typeof saved === 'object' && !Array.isArray(saved)) {
            return saved;
        }

        return null
    } catch(error) {
        return null;
    }
}

export function saveSettings(settings) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function exportRecords(records) {
    const text = JSON.stringify(records, null, 2);
    const file = new Blob([text], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(file);
    link.download = 'finance-records.json';
    link.click();
    URL.revokeObjectURL(link.href);
}

export function parseImports(text) {
    let data;
    try {
        data = JSON.parse(text);
    } catch (error) {
        return { error: "This file is not valid JSON." };
    }

    if (!Array.isArray(data)) {
        return {
            error: 'The file must contain a list of transactions.'
        }
    }

    const seenIds = [];
    const records = [];

    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const number = i + 1;

        if (!item || typeof item !== 'object') {
            return {
                error: `Record ${number} is not an object`
            }
        }

        if (typeof item.id !== 'string' || !/^txn_\d+$/.test(item.id)) {
            return {
                error: `Recotd ${number} has a missing or invalid id.`
            }
        }

        if (seenIds.includes(item.id)) {
            return {
                error: `Record ${number} has a duplicate id (${item.id})`
            }
        }

        seenIds.push(item.id);

        const errors = validateRecord(item);
        if (!isValid(errors)) {
            const field = Object.keys(errors)[0];
            return {
                error: `Record ${number} (${item.id}): ${field} - ${errors[field]}`,
            }
        }
        if (typeof item.createdAt !== 'string' || typeof item.updatedAt !== 'string') {
            return {
                error: `Record ${number} (${item.id}) is mising createdAt or updatedAt.`,
            }
        }

        records.push({
            id: item.id,
            description: item.description,
            amount: Number(item.amount),
            category: item.category,
            date: item.date,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt
        })
    }

    return { records: records };
}