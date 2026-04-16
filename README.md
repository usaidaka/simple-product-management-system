# Simple Product Management System

A lightweight full-stack web application for managing products with CRUD operations and external API sync.

**Stack:** React + Tailwind CSS (frontend) · Express JS (backend) · JSON file storage (no database)

---

## Prerequisites

- **Node.js** 18+ and npm

---

## Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd simple-product-management-system
```

### 2. Install Backend dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend dependencies

```bash
cd ../frontend
npm install
```

---

## Running Locally

You'll need **two terminal windows** — one for each server.

### Terminal 1 — Backend (port 5000)

```bash
cd backend
npm run dev
```

### Terminal 2 — Frontend (port 5173)

```bash
cd frontend
npm run dev
```

Then open **http://localhost:5173** in your browser.

---

## Features

| Feature | Description |
|---------|-------------|
| ➕ Add Product | Click "Add Product" to open the form |
| ✏️ Edit Product | Click "Edit" on any table row |
| 🗑️ Delete Product | Click "Delete" → confirm in dialog |
| 🔄 Sync Products | Click "Sync Products" to import from FakeStore API |
| 📄 Pagination | Navigate pages when 10+ products exist |

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/products` | List all products (supports `?page=&limit=`) |
| `POST` | `/api/products` | Create a product |
| `PUT` | `/api/products/:id` | Update a product |
| `DELETE` | `/api/products/:id` | Delete a product |
| `POST` | `/api/products/sync` | Sync from FakeStore API |

### Example Response — GET /api/products

```json
{
  "data": [
    { "id": 1, "name": "Product", "price": 29.99, "stock": 10, "description": "..." }
  ],
  "total": 1,
  "page": 1,
  "totalPages": 1
}
```

---

## Project Structure

```
.
├── backend/
│   ├── data/products.json    # JSON data store
│   ├── routes/products.js    # API routes
│   ├── storage/fileStore.js  # File read/write helpers
│   └── index.js              # Express server entry point
└── frontend/
    └── src/
        ├── components/
        │   ├── ProductTable.jsx
        │   ├── ProductForm.jsx
        │   └── SyncButton.jsx
        ├── services/api.js   # Axios API wrapper
        └── App.jsx           # Main app component
```

---

## Troubleshooting

**"Failed to load products. Is the backend running?"**
→ Make sure the backend server is running on port 5000 (`cd backend && npm run dev`)

**Sync fails**
→ Check your internet connection. The app fetches from `https://fakestoreapi.com/products`

**Port already in use**
→ Kill the process: `lsof -ti:5000 | xargs kill` or `lsof -ti:5173 | xargs kill`
