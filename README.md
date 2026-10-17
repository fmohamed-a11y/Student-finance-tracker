<p align="center">
  <img src="assets/banner.svg" alt="pocketpetal banner with pink coins" width="100%">
</p>

<h1 align="center">🌸 pocketpetal</h1>

<p align="center"><i>Student Finance Tracker</i></p>

<p align="center">
  <b>A soft, simple spending diary for students. Track every little spend, stay under budget.</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/storage-localStorage-b3245f?style=for-the-badge" alt="localStorage">
  <img src="https://img.shields.io/badge/frameworks-none-f6c1d6?style=for-the-badge" alt="No frameworks">
  <img src="https://img.shields.io/badge/mobile-responsive-8f1a4b?style=for-the-badge" alt="Mobile responsive">
</p>

---

## 🔗 Links

| | Link |
|---|---|
| 🌐 **Live Demo** | [https://fmohamed-a11y.github.io/Student-finance-tracker/] |
| 🎥 **Demo Video** | [ADD VIDEO LINK HERE] |
| 📁 **Repository** | [https://github.com/fmohamed-a11y/Student-finance-tracker] |
| 🧪 **Tests Page** | [https://fmohamed-a11y.github.io/Student-finance-tracker/tests.html]/tests.html |

---

## 📑 Table of Contents

1. [Overview](#-overview)
2. [Project at a Glance](#-project-at-a-glance)
3. [Languages & Tools](#-languages--tools)
4. [Features](#-features)
5. [Pages & the Files Behind Them](#-pages--the-files-behind-them)
6. [What You Can Add](#-what-you-can-add)
7. [Data Model](#-data-model)
8. [Regex Catalog](#-regex-catalog)
9. [Search Examples](#-search-examples)
10. [Keyboard Map](#-keyboard-map)
11. [Accessibility Notes](#-accessibility-notes)
12. [Responsive Design](#-responsive-design)
13. [Project Structure](#-project-structure)
14. [How to Run](#-how-to-run)
15. [Sample Data (seed.json)](#-sample-data-seedjson)
16. [Tests](#-tests)
17. [AI Usage](#-ai-usage)
18. [Author](#-author)

---

## 🌷 Overview

**pocketpetal** (my Student Finance Tracker) is a one-page web app that helps students keep track of their daily spending. You add what you spend (lunch, books, bus fare…), and the app shows your total, your biggest category, a chart of the last 7 days, and how much of your budget is left.

The name and the little purse logo 👛 come from the idea of a small, soft "pocket" for your money. Think of it as a little money diary that lives in your browser. There's no sign-up, no account and no server: you open the page and start logging. Every spend is checked as you type, saved instantly, and turned into simple numbers and a chart, so you can see where your money goes at a glance.

Everything is built from scratch with **plain (vanilla) HTML, CSS and JavaScript**: no frameworks, no libraries, just clean code split into small files that each do one job.

| | |
|---|---|
| 🎓 **Course** | Building Responsive UI (Front-End Web Development) |
| 📝 **Assignment** | Summative: Student Finance Tracker theme |
| 📅 **Due date** | 10-18-2026 |

**Why it's useful:** students often lose track of small spends. This app makes them visible, warns you before your budget runs out, and keeps your data private in your own browser.

---

## 📊 Project at a Glance

| Item | Details |
|---|---|
| 💾 **Storage** | `localStorage`, saved in your browser |
| 📶 **Internet needed?** | No. There's no server or account, so your data never leaves your device |
| 🔐 **Privacy** | Nothing is sent anywhere; only you can see your records |
| 🧱 **Frameworks** | None: plain HTML, CSS and JavaScript |
| 📱 **Mobile responsive** | Yes: mobile-first, works on phones, tablets and laptops |
| 📐 **Breakpoints** | 3 (mobile ~360px, tablet 768px, desktop 1024px) |
| 🔤 **Regex rules** | 5 (including 1 advanced back-reference) |
| 🧪 **Tests** | 41 automatic checks in `tests.html` |
| 💱 **Currencies** | USD (base), EUR, RWF |
| 🌱 **Sample data** | 12 records in `seed.json`, loaded with one button |

---

## 🛠️ Languages & Tools

| Tool | Used for |
|---|---|
| **HTML5** | Page structure, forms and accessible landmarks |
| **CSS3** | Layout (Flexbox + Grid), colors, animations, responsive design |
| **JavaScript (ES Modules)** | Logic, validation, search, saving and drawing the page |
| **localStorage** | Saving records and settings in the browser |
| **JSON** | Import / export files and the sample data |
| **Git & GitHub** | Version control and hosting (GitHub Pages) |
| **VS Code + Live Server** | Writing and testing the code |
| **Figma** | Designing the wireframes |

---

## ✨ Features

| Feature | What it does |
|---|---|
| 👛 **pocketpetal** | Its own name and purse logo, with separate pages for Dashboard, Records, Add, Settings and About |
| 🙋 **Welcome & greeting** | Asks your name on the first visit ("Hi Fatma"), or "Hi there" if you skip |
| ➕ **Add, edit, delete** | Every field is checked with regex as you type; edit rows inline (Escape cancels) |
| 🔍 **Regex search** | Search with patterns, matches highlighted in yellow, with a case toggle |
| ↕️ **Sorting** | By date, description (A–Z / Z–A) or amount |
| 📊 **Dashboard** | Total spent, records, top category, budget left and a 7-day chart |
| 🎯 **Budget & warnings** | Set a cap and choose to be warned at 50%, 75% or 90%: green, amber or red, with pop-up alerts |
| 💱 **Currencies** | Show amounts in USD, EUR or RWF using your own rates |
| 🏷️ **Categories** | Default categories with icons, plus your own (no duplicates) |
| 💾 **Save, import & export** | Auto-saves in the browser; export a JSON backup, import one (checked first), or load sample data |
| 📱 **Responsive** | Works on phones, tablets and laptops |
| ♿ **Accessible** | Keyboard friendly, screen-reader messages and reduced motion |
---

## 🗺️ Pages & the Files Behind Them

| Page | What you see | Main files | What the code does |
|---|---|---|---|
| 🏠 **Dashboard** | Total spent, records, top category, budget left, 7-day chart, budget card | `state.js`, `ui.js` | `getStats()` adds up all records and the last 7 days; `getCapStatus()` compares the total to your cap; `renderStats()`, `renderChart()` and `renderCap()` draw them |
| 📋 **Records** | The table of transactions, search box and sort menu | `search.js`, `state.js`, `ui.js` | `compileRegex()` turns your search into a safe pattern; `matchesRecord()` filters rows; `highlight()` adds the yellow marks; `sortRecords()` orders them; `renderRecords()` draws the table |
| ➕ **Add** | The form to add a new transaction | `validators.js`, `state.js` | `validateField()` checks each box with regex as you type; `addRecord()` creates the record with an id and time |
| ⚙️ **Settings** | Name, budget cap, warning level, currencies, categories, import/export, sample data | `main.js`, `storage.js` | Saves your settings; `exportRecords()` downloads a JSON file; `parseImport()` checks a file before loading it; `handleSample()` loads `seed.json` |
| 🙋 **Welcome pop-up** | Asks your name on the first visit | `main.js`, `index.html` | A `<dialog>` opened with `showModal()`; `closeWelcome()` saves the name and makes sure it's only asked once |
| ℹ️ **About** | What the app is and how to contact me | `index.html` | Static information |
| 🧠 **Everything** | Connects the pages together | `main.js` | Listens for clicks and typing, then tells the other files what to do |
| 💾 **Saving** | Works in the background | `storage.js` | `saveRecords()` / `loadRecords()` write to and read from `localStorage` |

---

## ➕ What You Can Add

| You can add… | Where | Rules |
|---|---|---|
| 🧾 **A transaction** | Add page | Description, amount, category and date must all pass the regex rules |
| 🏷️ **A category** | Settings | Letters, single spaces or hyphens (e.g. `Self-care`) |
| 🎯 **A budget cap** | Settings | A number like `500` or `250.50` (not 0) |
| ⚠️ **A warning level** | Settings | 50%, 75% or 90% of your budget |
| 💱 **Currency rates** | Settings | Numbers like `0.92` (EUR) or `1300` (RWF) |
| 👋 **Your name** | Welcome pop-up or Settings | Letters, single spaces or hyphens; used in the greeting |
| 📥 **A backup file** | Settings | A `.json` file in the correct format |

**Default categories:** Food · Books · Transport · Entertainment · Fees · Other

---

## 🧾 Data Model

Every transaction is saved like this:

```json
{
  "id": "txn_0001",
  "description": "Lunch at cafeteria",
  "amount": 12.5,
  "category": "Food",
  "date": "2026-10-01",
  "createdAt": "2026-10-01T09:15:00.000Z",
  "updatedAt": "2026-10-01T09:15:00.000Z"
}
```

| Field | Meaning |
|---|---|
| `id` | A unique name for each record (`txn_0001`, `txn_0002`…) |
| `description` | What you spent money on |
| `amount` | How much, in USD |
| `category` | The group it belongs to (Food, Books…) |
| `date` | The day you spent it (`YYYY-MM-DD`) |
| `createdAt` | When the record was first added |
| `updatedAt` | When the record was last edited |

**Storage keys in the browser:**

| Key | What it holds |
|---|---|
| `finance:records` | The list of all transactions |
| `finance:settings` | Your name, budget cap, warning level, currency rates and categories |

---

## 🔤 Regex Catalog

| Field | Pattern | What it means | ✅ Passes | ❌ Fails |
|---|---|---|---|---|
| **Description** | `/^\S(?:.*\S)?$/` | No spaces at the start or end | `Lunch at cafeteria` | ` Lunch` |
| **Amount** | `/^(0\|[1-9]\d*)(\.\d{1,2})?$/` | A positive number, max 2 decimals, no leading zeros | `12`, `12.50`, `0.5` | `012`, `12.345`, `-5` |
| **Date** | `/^\d{4}-(0[1-9]\|1[0-2])-(0[1-9]\|[12]\d\|3[01])$/` | `YYYY-MM-DD` format, real months and days | `2026-10-01` | `2026-13-01`, `26-10-01` |
| **Category / Name** | `/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/` | Letters only, with single spaces or hyphens | `Food`, `Self-care` | `Food1`, `Fast  Food` |
| ⭐ **Duplicate word** | `/\b(\w+)\s+\1\b/i` | Catches the same word typed twice | catches `the the book` | allows `the theory` |

> ⭐ **Advanced regex:** the duplicate-word rule uses a **back-reference** (`\1`), which means "the same word that was just matched". It stops typos like *"Bus bus pass"*.
>
> 📅 **Extra check:** dates must also really exist, so `2025-02-30` is rejected even though it matches the pattern.

---

## 🔍 Search Examples

Type these in the search box on the **Records** page:

| Type this | It finds | Why it's useful |
|---|---|---|
| `coffee` | Any record with "coffee" | Simple word search |
| `coffee\|tea` | Records with coffee **or** tea | `\|` means "or" |
| `^bus` | Descriptions that **start** with "bus" | `^` means "start of text" |
| `\.\d{2}\b` | Amounts with cents, like `89.99` | Finds exact prices |
| `Food` | Every record in the Food category | Search works on categories too |
| `2026-10` | Everything from October 2026 | Search works on dates too |
| `food` (with "Ignore case" off) | Only lowercase "food" | Shows the case toggle |
| `[` | Shows "That search pattern is not valid." | Bad patterns don't crash the app |

---

## ⌨️ Keyboard Map

The whole app can be used **without a mouse**:

| Key | What it does | Where to try it |
|---|---|---|
| `Tab` | Moves to the next button, link or box | Anywhere |
| `Shift + Tab` | Moves back to the previous one | Anywhere |
| `Enter` | Opens a menu page, presses a button, or submits a form | Menu, forms, buttons |
| `Space` | Ticks or unticks a checkbox | "Ignore case" box |
| `Escape` | Cancels editing a row without saving | Records table |
| `Escape` | Skips the welcome pop-up (same as pressing "Skip") | First visit |
| First `Tab` on the page | Shows the **"Skip to content"** link to jump past the menu | Top of the page |

---

## ♿ Accessibility Notes

| What I did | Why it helps |
|---|---|
| **Semantic landmarks** (`header`, `nav`, `main`, `section`, `footer`) | Screen readers can jump straight to each part |
| **Skip-to-content link** | Keyboard users skip the menu in one key press |
| **Labels on every input** | Screen readers say what each box is for |
| **Errors linked with `aria-describedby`** and `aria-invalid` | The error message is read out with its box, and the box turns red |
| **Live regions** (`role="status"`, `aria-live`) | Messages like "Transaction added" and the greeting are read out automatically |
| **Assertive budget warning** | When you go over budget it's announced **right away** |
| **Visible purple focus outline** | You can always see where you are with the keyboard |
| **Welcome pop-up uses `<dialog>`** | Focus goes straight to the name box, and Escape closes it |
| **Decorative icons hidden** (`aria-hidden`) | Screen readers say "Food" instead of reading out the emoji |
| **Hidden chart text** (`.visually-hidden`) | Screen readers can "read" the chart values |
| **Good color contrast** | Text is easy to read for everyone |
| **Reduced motion** (`prefers-reduced-motion`) | Animations turn off for people who get dizzy from motion |

---

## 📱 Responsive Design

The app is **fully mobile responsive**. It was tested at 360px, 768px and 1280px with no sideways scrolling.

| Screen | Width | What changes |
|---|---|---|
| 📱 **Mobile** | ~360px | One column; table rows become cards |
| 📟 **Tablet** | 768px and up | Header in one line; more space |
| 🖥️ **Desktop** | 1024px and up | Stat cards in a row; full table; wider layout |

**How it's made responsive:**

| Technique | What it does |
|---|---|
| **Viewport meta tag** | `<meta name="viewport" content="width=device-width, initial-scale=1.0">` makes phones show the page at its real size instead of zoomed out |
| **Mobile-first CSS** | The base styles are written for phones; `@media (min-width: 768px)` and `@media (min-width: 1024px)` add the tablet and desktop layouts on top |
| **Table → cards** | On phones each table row becomes a card, and `td::before { content: attr(data-label) }` adds a label (Date, Amount…) to every value |
| **Flexible layout** | Flexbox, Grid, `width: 100%` and `max-width` instead of fixed pixel widths, so everything stretches or shrinks to fit |

**Try it yourself:** open the app → press **F12** → **Ctrl + Shift + M** → choose a phone, tablet or laptop size.

Wireframes for all three sizes are in [`assets/`](assets/).

---

## 🗂️ Project Structure

```
Student-finance-tracker/
├── index.html          → the app
├── tests.html          → automatic tests for regex and search
├── seed.json           → sample transactions
├── README.md           → this file
├── .gitignore          → files Git should ignore
├── assets/             → banner and wireframes
├── styles/
│   └── main.css        → all the styles (mobile first)
└── scripts/
    ├── validators.js   → regex rules and field checks
    ├── search.js       → safe regex search and highlighting
    ├── state.js        → records, settings, stats and budget maths
    ├── storage.js      → localStorage, import and export
    ├── ui.js           → draws the table, cards and chart
    └── main.js         → connects everything to the page
```

---

## 🚀 How to Run

**1. Clone the repository**
```bash
git clone https://github.com/fmohamed-a11y/Student-finance-tracker.git
```

**2. Open it in VS Code**
```bash
cd Student-finance-tracker
code .
```

**3. Start Live Server**
Right-click `index.html` → **Open with Live Server**.

> ⚠️ The app uses ES modules (`type="module"`), so it must run on a local server like Live Server. Double-clicking `index.html` won't work.

---

## 🌱 Sample Data (seed.json)

`seed.json` has **12 sample transactions** with:
- 📈 **A busy week:** 7 records from Oct 9 to Oct 15, 2026, with high and low days so the chart goes up and down
- 📅 **Edge dates:** a leap day, the first and last day of the year
- 💰 **Small and large amounts:** from `0.5` to over `1000`
- 🔤 **Tricky text:** `&`, hyphens and quotes

**How to load it (easy way):** Settings → **Load sample data**.

**Other way:** Settings → **Restore a JSON backup** → choose `seed.json`.

> 📅 The chart only shows the **last 7 days from today**, so the up-and-down bars appear when the sample week matches the current week.

---

## 🧪 Tests

Open `tests.html` with Live Server. It runs **41 automatic checks**:

| Group | What it tests |
|---|---|
| Description | Spaces at the start/end, empty text |
| Duplicate word | The back-reference catches repeated words |
| Amount | Decimals, leading zeros, negative numbers |
| Date | Real dates, leap years, wrong months |
| Category | Letters, spaces, hyphens, numbers |
| Helpers | Cleaning text and checking whole records |
| Search | Invalid patterns, highlighting, case toggle, HTML escaping |

✅ **Expected result:** `41 of 41 tests passed`



---

## 👩🏽‍💻 Author

<p align="center">
  <b>Fatma Samir</b><br>
  African Leadership University<br><br>
  <a href="https://github.com/fmohamed-a11y"><img src="https://img.shields.io/badge/GitHub-fmohamed--a11y-181717?style=flat&logo=github" alt="GitHub"></a>
  <a href="mailto:f.mohamed@alustudent.com"><img src="https://img.shields.io/badge/Email-f.mohamed%40alustudent.com-b3245f?style=flat&logo=gmail&logoColor=white" alt="Email"></a>
</p>

<p align="center">🌸 Made with care, one little spend at a time 🌸</p>
