import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getProducts, deleteProduct } from './services/api';
import ProductTable from './components/ProductTable';
import ProductForm from './components/ProductForm';
import SyncButton from './components/SyncButton';
import SearchFilter from './components/SearchFilter';

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // id to confirm delete
  const [activeFilters, setActiveFilters] = useState({});
  const [totalCount, setTotalCount] = useState(0);
  const searchTimeout = useRef(null);

  const PAGE_SIZE = 10;

  const fetchProducts = useCallback(async (page = 1, filters = activeFilters) => {
    setLoading(true);
    setError('');
    try {
      const res = await getProducts(page, PAGE_SIZE, filters);
      setProducts(res.data);
      setTotalPages(res.totalPages || 1);
      setTotalCount(res.total || 0);
      setCurrentPage(page);
    } catch {
      setError('Failed to load products. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }, [activeFilters]);

  useEffect(() => {
    fetchProducts(1);
  }, []);

  function handleEdit(product) {
    setSelectedProduct(product);
    setIsModalOpen(true);
  }

  function handleAddNew() {
    setSelectedProduct(null);
    setIsModalOpen(true);
  }

  function handleModalClose() {
    setIsModalOpen(false);
    setSelectedProduct(null);
  }

  async function handleSave() {
    handleModalClose();
    await fetchProducts(currentPage, activeFilters);
  }

  function handleFilter(filters) {
    // Debounce for live search
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setActiveFilters(filters);
      fetchProducts(1, filters);
    }, 300);
  }

  function handleDeleteClick(id) {
    setDeleteConfirm(id);
  }

  async function confirmDelete() {
    if (!deleteConfirm) return;
    try {
      await deleteProduct(deleteConfirm);
      setDeleteConfirm(null);
      const newPage = products.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
      await fetchProducts(newPage, activeFilters);
    } catch {
      setError('Failed to delete product.');
      setDeleteConfirm(null);
    }
  }

  async function handleSync() {
    await fetchProducts(1, activeFilters);
  }

  function handlePageChange(page) {
    fetchProducts(page, activeFilters);
  }

  const totalProductsText = totalCount === 0
    ? 'No products found'
    : `${totalCount} product${totalCount !== 1 ? 's' : ''} found · Page ${currentPage} of ${totalPages}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V7" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">Product Manager</h1>
              <p className="text-xs text-gray-400 font-medium">Simple product management system</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <SyncButton onSync={handleSync} />
            <button
              id="add-product-btn"
              onClick={handleAddNew}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm hover:from-indigo-700 hover:to-violet-700 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Product
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title + Stats */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Products</h2>
          <p className="text-sm text-gray-500 mt-1">{totalProductsText}</p>
        </div>

        {/* Search & Filter */}
        <SearchFilter onFilter={handleFilter} />

        {/* Error Banner */}
        {error && (
          <div id="global-error-banner" className="flex items-center gap-3 mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">{error}</span>
            <button onClick={() => setError('')} className="ml-auto text-red-400 hover:text-red-600">✕</button>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-4 animate-pulse">
                  <div className="h-4 bg-gray-100 rounded w-12" />
                  <div className="h-4 bg-gray-100 rounded w-48" />
                  <div className="h-4 bg-gray-100 rounded w-20" />
                  <div className="h-4 bg-gray-100 rounded w-16" />
                  <div className="h-4 bg-gray-100 rounded flex-1" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <ProductTable
            products={products}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </main>

      {/* Product Form Modal */}
      <ProductForm
        isOpen={isModalOpen}
        product={selectedProduct}
        onSave={handleSave}
        onClose={handleModalClose}
      />

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0a1 1 0 00-1-1h-4a1 1 0 00-1 1m-4 0h10" />
                </svg>
              </div>
              <div>
                <h3 id="delete-modal-title" className="font-bold text-gray-900">Delete Product</h3>
                <p className="text-sm text-gray-500">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete product <span className="font-semibold text-gray-900">#{deleteConfirm}</span>?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                id="delete-cancel-btn"
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-sm font-medium rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                id="delete-confirm-btn"
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-semibold rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
