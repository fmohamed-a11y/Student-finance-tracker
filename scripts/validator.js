export const PATTERNS = Object.freeze({
    description: /^\S(?:.*\S)?$/,
    amount: /^(0|[1-9]\d*)(\.\d{1,2})?$/,
    date:  /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
    category: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/,
    duplicatedWord: /\b(\w+)\s+\1\b/i
});

export const FIELDS = ['description', 'amount', 'category', 'date'];

function isRealDate(text) {
    const parts = text.split('-');
    const year = Number(parts[0]);
    const month = Number(parts[1]);
    const day = Number(parts[2]);
    const date = new Date(year, month - 1, day);

    if (date.getFullYear() !== year) {
        return false;
    }

    if (date.getMonth() !== month - 1) {
        return false;
    }

    if (date.getDate() !== day) {
        return false;
    }

    return true;
}

export function cleanText(text) {
    return String(text).trim().replace(/\s+/g, ' ');
}

export function validateField(field, value) {
    let text = '';
    if (value !== undefined && value !== null) {
        text = String(value);
    }

    if (text === '') {
        return 'This field is required.';
    }

    if (field === 'description') {
        if (!PATTERNS.description.test(text)) {
            return 'Remove the spaces at the start or end';
        }

        if (PATTERNS.duplicatedWord.test(text)) {
            return 'you typed the same word twice in a row.'
        }
    } else if (field === 'amount') {
        if (!PATTERNS.amount.test(text)) {
            return 'Use a number like 12 or 12.50.';
        }
    } else if (field === 'date') {
        if (!PATTERNS.date.test(text) || !isRealDate(text)) {
            return 'use a real date in the format YYYY-MM-DD.';
        }
    }else if (field === 'category') {
        if (!PATTERNS.category.test(text)) {
            return 'use letters only, with single spaces or hyphens.'
        }
    }

    return '';
}

export function validateRecord(record) {
    const errors = {};
    for (const field of FIELDS) {
        const message = validateField(field, record[field]);
        if (message) {
            errors[field] = message;
        }
    }
    return errors;
}

export function isValid(errors) {
    return Object.keys(errors).length === 0;
}