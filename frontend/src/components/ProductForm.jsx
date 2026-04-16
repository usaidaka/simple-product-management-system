import React, { useState, useEffect } from 'react';
import { createProduct, updateProduct } from '../services/api';

const EMPTY_FORM = { name: '', price: '', stock: '', description: '' };

export default function ProductForm({ isOpen, product, onSave, onClose }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const isEdit = !!product;

  useEffect(() => {
    if (isOpen) {
      setForm(product ? { ...product, price: String(product.price), stock: String(product.stock) } : EMPTY_FORM);
      setErrors({});
      setServerError('');
    }
  }, [isOpen, product]);

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = 'Product name is required';
    if (form.price === '' || isNaN(Number(form.price)) || Number(form.price) < 0)
      e.price = 'Price must be a non-negative number';
    if (form.stock === '' || isNaN(Number(form.stock)) || !Number.isInteger(Number(form.stock)) || Number(form.stock) < 0)
      e.stock = 'Stock must be a non-negative integer';
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setServerError('');

    const payload = {
      name: form.name.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      description: form.description.trim(),
    };

    try {
      if (isEdit) {
        await updateProduct(product.id, payload);
      } else {
        await createProduct(payload);
      }
      onSave();
    } catch (err) {
      setServerError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleChange(field) {
    return (e) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
    };
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-indigo-600 to-violet-600">
          <div>
            <h2 id="modal-title" className="text-lg font-bold text-white">
              {isEdit ? 'Edit Product' : 'Add New Product'}
            </h2>
            <p className="text-indigo-200 text-xs mt-0.5">
              {isEdit ? `Editing product #${product.id}` : 'Fill in the details below'}
            </p>
          </div>
          <button
            id="modal-close-btn"
            onClick={onClose}
            className="p-2 rounded-lg text-indigo-200 hover:text-white hover:bg-white/20 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="px-6 py-6 space-y-4">
          {serverError && (
            <div id="form-server-error" className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {serverError}
            </div>
          )}

          {/* Name */}
          <div>
            <label htmlFor="field-name" className="block text-sm font-medium text-gray-700 mb-1.5">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              id="field-name"
              type="text"
              value={form.name}
              onChange={handleChange('name')}
              placeholder="e.g. Wireless Keyboard"
              className={`w-full px-4 py-2.5 text-sm rounded-xl border transition-all outline-none ${
                errors.name
                  ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200'
                  : 'border-gray-200 bg-gray-50 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:bg-white'
              }`}
            />
            {errors.name && <p id="error-name" className="mt-1 text-xs text-red-600">{errors.name}</p>}
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="field-price" className="block text-sm font-medium text-gray-700 mb-1.5">
                Price ($) <span className="text-red-500">*</span>
              </label>
              <input
                id="field-price"
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={handleChange('price')}
                placeholder="0.00"
                className={`w-full px-4 py-2.5 text-sm rounded-xl border transition-all outline-none ${
                  errors.price
                    ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200'
                    : 'border-gray-200 bg-gray-50 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:bg-white'
                }`}
              />
              {errors.price && <p id="error-price" className="mt-1 text-xs text-red-600">{errors.price}</p>}
            </div>

            <div>
              <label htmlFor="field-stock" className="block text-sm font-medium text-gray-700 mb-1.5">
                Stock <span className="text-red-500">*</span>
              </label>
              <input
                id="field-stock"
                type="number"
                min="0"
                step="1"
                value={form.stock}
                onChange={handleChange('stock')}
                placeholder="0"
                className={`w-full px-4 py-2.5 text-sm rounded-xl border transition-all outline-none ${
                  errors.stock
                    ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200'
                    : 'border-gray-200 bg-gray-50 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:bg-white'
                }`}
              />
              {errors.stock && <p id="error-stock" className="mt-1 text-xs text-red-600">{errors.stock}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="field-description" className="block text-sm font-medium text-gray-700 mb-1.5">
              Description <span className="text-gray-400 text-xs font-normal">(optional)</span>
            </label>
            <textarea
              id="field-description"
              rows={3}
              value={form.description}
              onChange={handleChange('description')}
              placeholder="Short product description..."
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all outline-none resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              id="form-cancel-btn"
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              id="form-submit-btn"
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm hover:from-indigo-700 hover:to-violet-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            >
              {loading && (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              )}
              {loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
