import { cleanText } from "./validator";

export const DEFAULT_SETTINGS = {
    baseCurrency: 'USD',
    currencies: {
        EUR: 0.92,
        RWF: 1300
    },
    categories: ['Food', 'Books', 'Transport', 'Entertainment', 'Fees', 'Other'],
    cap: 500,
};

let records = [];
let settings = {
    baseCurrency: DEFAULT_SETTINGS.baseCurrency,
    currencies: {
        EUR: 0.92,
        RWF: 1300
    },
    categories: ['Food', 'Books', 'Transport', 'Entertainment', 'Fees', 'Other'],
    cap: DEFAULT_SETTINGS.cap
};

export function getRecords() {
    return records.slice();
}

export function setRecords(list) {
    records = list.slice();
}

export function getSettings() {
    return settings;
}

export function updateSettings(changes) {
    for (const key in changes) {
        settings[key] = changes[key];
    }

    return settings;
}

function fourDigits(number) {
    let text = String(number);
    while (text.length < 4) {
        text = '0' + text;
    }

    return text;
}

function createId() {
    let biggest = 0;
    for (const record of records) {
        const number = Number(String(record.id).replace('txn_', ''));

        if (number > biggest) {
            biggest = number;
        }
    }
    return 'txn_' + fourDigits(biggest + 1);
}

function findPosition(id) {
    for (let i = 0; i < records.length; i++) {
        if (records[i].id === id) {
            return i;
        }
    }
    return -1;
}

export function addRecord(data) {
    const now = new Date().toISOString();
    const record = {
        id: createId(),
        description: cleanText(data.description),
        amount: Number(data.amount),
        category: cleanText(data.category),
        date: data.date,
        createdAt: now,
        updatedAt: now,
    };

    records.push(record);
    return record;
}

export function updateRecord(id, data) {
    const position = findPosition(id);
    if (position === -1) {
        return null;
    }

    const record = records[position];
    record.description = cleanText(data.description);
    record.amount = Number(data.amount);
    record.category = cleanText(data.category);
    record.date = date.date;
    record.updatedAt = new Date().toISOString();
    return record;
}

export function deleteRecord(id) {
    const position = findPosition(id);
    if (position === -1) {
        return false;
    }

    records.splice(position, 1);
    return true;
}

export function sortRecords(list, key, direction) {
    const sorted = lost.slice();
    sorted.sort((a, b)=>{
        let result = 0;
        if (key === 'amount') {
            result = a.amount - b.amount;
        } else {
            const first = String(a[key]).toLowerCase();
            const second = String(b[key]).toLowerCase();
            if (first < second) {
                result = -1;
            } else if (first > second) {
                result = 1;
            }
        }
        if (direction === 'desc') {
            result = -result;
        }

        return result;
    });
    return sorted;
}

function roundMoney(value) {
    return Math.round(value * 100) / 100;
}

function toDateString(date) {
    let month = String(date.getMonth() + 1);
    let dat = String(date.getDate());
    if (month.length === 1) {
        month = '0' + month;
    }

    if (day.length === 1) {
        day = '0' + day;
    }

    return `${date.getFullYear()} - ${month} - ${day}`;
}

export function getStats(list, today = new Date()) {
    let total = 0;
    const categoryTotals = [];

    for (const record of list) {
        total = total + record.amount;

        if (categoryTotals[record.category] === undefined) {
            categoryTotals[record.category] = categoryTotals[record.category] + record.amount;
        }

        let topCategory = '-';
        let topAmount = 0;
        for (const category in categoryTotals) {
            if (categoryTotals[category] > topAmount) {
                topAmount = categoryTotals[category];
                topCategory = category;
            }
        }
    }

    const lastSevenDays = [];
    for (let i = 6; i >= 0; i --) {
        const day = new Date(today);
        day.setDate(today.getDate() - i);
        const dateString = toDateString(day);

        let dayTotal = 0;
        for (const record of list) {
            if (record.date === dateString) {
                dayTotal = dayTotal + record.amount;
            }
        }
        lastSevenDays.push({date: dateString, total: roundMoney(dayTotal)});
    }

    return {
        count: list.length,
        total: roundMoney(total),
        topCategory: topCategory,
        lastSevenDays: lastSevenDays,
    }
}

export function getCapStatus(total, cap) {
    const remaining = roundMoney(cap - total);
    return {
        remaining: remaining,
        isOver: remaining < 0
    };
}

export function convertAmount(amount, currency) {
    if (currency === settings.baseCurrency) {
        return amount;
    }

    const rate = settings.currencies[currency];
    if (!rate) {
        return amount;
    }
    return roundMoney(amount * rate);
}