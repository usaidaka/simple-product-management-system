import React, { useState } from 'react';

const EMPTY_FILTERS = {
  search: '',
  minPrice: '',
  maxPrice: '',
  minStock: '',
  maxStock: '',
};

export default function SearchFilter({ onFilter }) {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [expanded, setExpanded] = useState(false);

  function handleChange(field) {
    return (e) => {
      const updated = { ...filters, [field]: e.target.value };
      setFilters(updated);
      // Live search on text field
      if (field === 'search') onFilter(updated);
    };
  }

  function handleApply(e) {
    e.preventDefault();
    onFilter(filters);
  }

  function handleReset() {
    setFilters(EMPTY_FILTERS);
    onFilter(EMPTY_FILTERS);
  }

  const hasActiveFilters =
    filters.search ||
    filters.minPrice !== '' ||
    filters.maxPrice !== '' ||
    filters.minStock !== '' ||
    filters.maxStock !== '';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
      {/* Top row: search + toggle */}
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Search input */}
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            id="search-input"
            type="text"
            value={filters.search}
            onChange={handleChange('search')}
            placeholder="Search by name or description…"
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:bg-white outline-none transition-all"
          />
          {filters.search && (
            <button
              onClick={() => { const u = { ...filters, search: '' }; setFilters(u); onFilter(u); }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm3.707-9.293a1 1 0 0 0-1.414-1.414L10 8.586l-2.293-2.293a1 1 0 0 0-1.414 1.414L8.586 10l-2.293 2.293a1 1 0 1 0 1.414 1.414L10 11.414l2.293 2.293a1 1 0 0 0 1.414-1.414L11.414 10l2.293-2.293z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>

        {/* Toggle advanced filters */}
        <button
          id="toggle-filters-btn"
          onClick={() => setExpanded((v) => !v)}
          className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl border transition-all ${
            hasActiveFilters && !filters.search
              ? 'border-indigo-300 bg-indigo-50 text-indigo-700'
              : 'border-gray-200 text-gray-600 hover:border-indigo-200 hover:bg-gray-50'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
          </svg>
          Filters
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />
          )}
          <svg
            className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Reset button */}
        {hasActiveFilters && (
          <button
            id="reset-filters-btn"
            onClick={handleReset}
            className="px-3 py-2.5 text-sm font-medium rounded-xl text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Expandable advanced filters */}
      {expanded && (
        <form onSubmit={handleApply} className="border-t border-gray-100 px-4 py-4 bg-gray-50/50">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Min Price */}
            <div>
              <label htmlFor="filter-min-price" className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Min Price ($)
              </label>
              <input
                id="filter-min-price"
                type="number"
                min="0"
                step="0.01"
                placeholder="0"
                value={filters.minPrice}
                onChange={handleChange('minPrice')}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
              />
            </div>

            {/* Max Price */}
            <div>
              <label htmlFor="filter-max-price" className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Max Price ($)
              </label>
              <input
                id="filter-max-price"
                type="number"
                min="0"
                step="0.01"
                placeholder="∞"
                value={filters.maxPrice}
                onChange={handleChange('maxPrice')}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
              />
            </div>

            {/* Min Stock */}
            <div>
              <label htmlFor="filter-min-stock" className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Min Stock
              </label>
              <input
                id="filter-min-stock"
                type="number"
                min="0"
                step="1"
                placeholder="0"
                value={filters.minStock}
                onChange={handleChange('minStock')}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
              />
            </div>

            {/* Max Stock */}
            <div>
              <label htmlFor="filter-max-stock" className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Max Stock
              </label>
              <input
                id="filter-max-stock"
                type="number"
                min="0"
                step="1"
                placeholder="∞"
                value={filters.maxStock}
                onChange={handleChange('maxStock')}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 mt-4">
            <button
              id="apply-filters-btn"
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm hover:from-indigo-700 hover:to-violet-700 transition-all"
            >
              Apply Filters
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
