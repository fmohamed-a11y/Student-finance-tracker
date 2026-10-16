export function escapeHTML(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
// turns what the user typed into a RegExp,without crashing the app.
// If the user types something broken like "[", new RegExp throws an error.

export function compileRegex(input, caseInsensitive = true) {
  if (!input) {
    return null;
  }
  const flags = caseInsensitive ? 'gi' : 'g';
  try {
    return new RegExp(input, flags);
  } catch (error) {
    return null;
  }
}

export function isInvalidPattern(input) {
  return input !== '' && compileRegex(input) === null;
}

export function matchesRecord(record, re) {
  if (!re) {
    return true;
  }
  const text = `${record.description} ${record.category} ${record.date} ${record.amount}`;
  return text.search(re) !== -1;
}
// We escape FIRST, then add the <mark> tags, so only our own tags become real HTML.
export function highlight(text, re) {
  const safeText = escapeHTML(text);
  if (!re) {
    return safeText;
  }
  return safeText.replace(re, (match) => `<mark>${match}</mark>`);
}