const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/products.json');

/**
 * Read all products from the JSON file.
 * Returns empty array if file is missing or empty.
 */
function readProducts() {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    const raw = fs.readFileSync(DATA_FILE, 'utf-8').trim();
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/**
 * Write the full products array to the JSON file.
 */
function writeProducts(products) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2), 'utf-8');
}

/**
 * Generate the next auto-incremented ID.
 */
function generateId(products) {
  if (products.length === 0) return 1;
  return Math.max(...products.map((p) => p.id)) + 1;
}

module.exports = { readProducts, writeProducts, generateId };
