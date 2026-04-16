# Product Requirement Document (PRD)

## 1. Overview

A simple web application to manage products with CRUD functionality, external API sync, and internal API. Built using:

* Frontend: React JS + Tailwind CSS
* Backend: Express JS
* Data Storage: JSON file (no database)

---

## 2. Objectives

* Provide basic product management (CRUD)
* Integrate with external API for product import
* Expose internal API for product data
* Simple and responsive UI

---

## 3. Features

### 3.1 Product CRUD

**Fields:**

* id
* name
* price
* stock
* description

**Functionalities:**

* Create product
* Read product list
* Update product
* Delete product

**Validation:**

* name: required
* price: must be number
* stock: must be number
* description: optional

**UI:**

* Display products in table
* Pagination (simple client-side or server-side)

---

### 3.2 External API Integration

* API Source: [https://fakestoreapi.com/products](https://fakestoreapi.com/products)
* Button: "Sync Products"

**Behavior:**

* Fetch products from API
* Map fields:

  * title → name
  * price → price
  * description → description
  * stock → default (e.g., 10)
* Save to local JSON storage

---

### 3.3 Internal API

**Endpoint:**

* GET /api/products

**Response:**

```json
[
  {
    "id": 1,
    "name": "Product Name",
    "price": 100,
    "stock": 10,
    "description": "Sample"
  }
]
```

---

### 3.4 Frontend (React)

* Dashboard page
* Features:

  * Product table
  * Add/Edit form
  * Delete button
  * Sync Products button

**UI Requirements:**

* Responsive layout
* Use Tailwind CSS

---

## 4. Technical Design

### 4.1 Backend (Express JS)

* File-based storage (products.json)
* Endpoints:

  * GET /api/products
  * POST /api/products
  * PUT /api/products/:id
  * DELETE /api/products/:id
  * POST /api/products/sync

---

### 4.2 Frontend (React)

* Pages:

  * Dashboard
* Components:

  * ProductTable
  * ProductForm
  * SyncButton

---

## 5. Data Storage

* File: products.json
* Structure: Array of product objects

---

## 6. Assumptions

* No authentication required
* Data stored locally (no database)
* Simple validation only

---

## 7. Success Criteria

* CRUD works correctly
* Sync button imports products
* API endpoint returns JSON data
* UI responsive and usable

---
