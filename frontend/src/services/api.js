import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';
const BASE = `${API_URL}/api/products`;

export const getProducts = (page = 1, limit = 10, filters = {}) => {
  const params = new URLSearchParams({ page, limit });
  if (filters.search) params.set('search', filters.search);
  if (filters.minPrice !== '' && filters.minPrice != null) params.set('minPrice', filters.minPrice);
  if (filters.maxPrice !== '' && filters.maxPrice != null) params.set('maxPrice', filters.maxPrice);
  if (filters.minStock !== '' && filters.minStock != null) params.set('minStock', filters.minStock);
  if (filters.maxStock !== '' && filters.maxStock != null) params.set('maxStock', filters.maxStock);
  return axios.get(`${BASE}?${params.toString()}`).then((r) => r.data);
};

export const createProduct = (data) =>
  axios.post(BASE, data).then((r) => r.data);

export const updateProduct = (id, data) =>
  axios.put(`${BASE}/${id}`, data).then((r) => r.data);

export const deleteProduct = (id) =>
  axios.delete(`${BASE}/${id}`).then((r) => r.data);

export const syncProducts = () =>
  axios.post(`${BASE}/sync`).then((r) => r.data);
