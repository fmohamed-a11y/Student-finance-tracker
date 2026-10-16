export const PATTERNS = Object.freeze({
  description: /^\S(?:.*\S)?$/,//description must start with anonspace and also end with a nonspace
  amount: /^(0|[1-9]\d*)(\.\d{1,2})?$/,//a dot followed by 1 or 2 dig,  pass- 0 or a number that starts with 0 fails
  date: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,//YYYY-MM-DD. Month must be 01-12 and day must be 01-31.only the structure, isRealDate() takes care of the actual job 
  category: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/,
  duplicateWord: /\b(\w+)\s+\1\b/i,
});
//defining the list of the 4 fields every record needs, so we can use it later in validateRecord().
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
//func that "tidies" test befor saving it it removes the spaces at the start and the end and removes ths
// unnessary spaces. my state.js file will need this func. to add/edit also main.js for categories and names.
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
      return 'Remove the spaces at the start or end.';
    }
    if (PATTERNS.duplicateWord.test(text)) {
      return 'You typed the same word twice in a row.';
    }
  } else if (field === 'amount') {
    if (!PATTERNS.amount.test(text)) {
      return 'Use a number like 12 or 12.50.';
    }
  } else if (field === 'date') {
    if (!PATTERNS.date.test(text) || !isRealDate(text)) {
      return 'Use a real date in the format YYYY-MM-DD.';
    }
  } else if (field === 'category') {
    if (!PATTERNS.category.test(text)) {
      return 'Use letters only, with single spaces or hyphens.';
    }
  }

  return '';
}
// it checks the records by the FIELD list in case something is wrong it gives a error message, in case there is no error the list comes back empty  
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
// In case all the fields are correct it gives true, in case no it gives false. The error message itself comes from validateRecord.

export function isValid(errors) {
  return Object.keys(errors).length === 0;
}