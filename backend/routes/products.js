const express = require('express');
const axios = require('axios');
const { readProducts, writeProducts, generateId } = require('../storage/fileStore');

const router = express.Router();

// ─── Validation Helper ────────────────────────────────────────────────────────

function validateProduct(data) {
  const errors = [];
  if (!data.name || String(data.name).trim() === '') {
    errors.push('name is required');
  }
  if (data.price === undefined || data.price === '' || isNaN(Number(data.price)) || Number(data.price) < 0) {
    errors.push('price must be a non-negative number');
  }
  if (data.stock === undefined || data.stock === '' || isNaN(Number(data.stock)) || !Number.isInteger(Number(data.stock)) || Number(data.stock) < 0) {
    errors.push('stock must be a non-negative integer');
  }
  return errors;
}

// ─── GET /api/products ────────────────────────────────────────────────────────

router.get('/', (req, res) => {
  let products = readProducts();

  // ── Search by name or description ─────────────────────────────────────────
  const search = req.query.search ? req.query.search.trim().toLowerCase() : '';
  if (search) {
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(search) ||
        (p.description && p.description.toLowerCase().includes(search))
    );
  }

  // ── Filter by price range ─────────────────────────────────────────────────
  const minPrice = req.query.minPrice !== undefined ? parseFloat(req.query.minPrice) : null;
  const maxPrice = req.query.maxPrice !== undefined ? parseFloat(req.query.maxPrice) : null;
  if (minPrice !== null && !isNaN(minPrice)) products = products.filter((p) => p.price >= minPrice);
  if (maxPrice !== null && !isNaN(maxPrice)) products = products.filter((p) => p.price <= maxPrice);

  // ── Filter by stock range ─────────────────────────────────────────────────
  const minStock = req.query.minStock !== undefined ? parseInt(req.query.minStock) : null;
  const maxStock = req.query.maxStock !== undefined ? parseInt(req.query.maxStock) : null;
  if (minStock !== null && !isNaN(minStock)) products = products.filter((p) => p.stock >= minStock);
  if (maxStock !== null && !isNaN(maxStock)) products = products.filter((p) => p.stock <= maxStock);

  // ── Pagination ────────────────────────────────────────────────────────────
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const total = products.length;
  const start = (page - 1) * limit;
  const paginated = products.slice(start, start + limit);

  res.json({
    data: paginated,
    total,
    page,
    totalPages: Math.ceil(total / limit) || 1,
  });
});

// ─── POST /api/products/sync ──────────────────────────────────────────────────
// Must be declared BEFORE /:id routes

router.post('/sync', async (req, res) => {
  try {
    const { data: fetched } = await axios.get('https://fakestoreapi.com/products');
    const products = readProducts();
    let currentMaxId = products.length > 0 ? Math.max(...products.map((p) => p.id)) : 0;

    const newProducts = fetched.map((item) => {
      currentMaxId += 1;
      return {
        id: currentMaxId,
        name: item.title,
        price: item.price,
        stock: 10,
        description: item.description || '',
      };
    });

    const merged = [...products, ...newProducts];
    writeProducts(merged);

    res.json({ added: newProducts.length });
  } catch (err) {
    console.error('Sync error:', err.message);
    res.status(502).json({ error: 'Failed to sync from FakeStore API' });
  }
});

// ─── POST /api/products ───────────────────────────────────────────────────────

router.post('/', (req, res) => {
  const errors = validateProduct(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(', ') });
  }

  const products = readProducts();
  const newProduct = {
    id: generateId(products),
    name: String(req.body.name).trim(),
    price: Number(req.body.price),
    stock: Number(req.body.stock),
    description: req.body.description ? String(req.body.description).trim() : '',
  };

  products.push(newProduct);
  writeProducts(products);

  res.status(201).json(newProduct);
});

// ─── PUT /api/products/:id ────────────────────────────────────────────────────

router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const products = readProducts();
  const index = products.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const errors = validateProduct(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(', ') });
  }

  products[index] = {
    id,
    name: String(req.body.name).trim(),
    price: Number(req.body.price),
    stock: Number(req.body.stock),
    description: req.body.description ? String(req.body.description).trim() : '',
  };

  writeProducts(products);
  res.json(products[index]);
});

// ─── DELETE /api/products/:id ─────────────────────────────────────────────────

router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const products = readProducts();
  const index = products.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  products.splice(index, 1);
  writeProducts(products);

  res.json({ message: 'Deleted successfully' });
});

module.exports = router;
