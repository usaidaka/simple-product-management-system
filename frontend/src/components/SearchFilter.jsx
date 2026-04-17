import React, { useState } from 'react';

const EMPTY_FILTERS = {
  search: '',
  minPrice: '',
  maxPrice: '',
  minStock: '',
  maxStock: '',
  sortOrder: 'desc',
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

  function handleSortToggle() {
    const nextOrder = filters.sortOrder === 'desc' ? 'asc' : 'desc';
    const updated = { ...filters, sortOrder: nextOrder };
    setFilters(updated);
    onFilter(updated);
  }

  const hasActiveFilters =
    filters.search ||
    filters.minPrice !== '' ||
    filters.maxPrice !== '' ||
    filters.minStock !== '' ||
    filters.maxStock !== '' ||
    filters.sortOrder !== 'desc';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
      {/* Main Bar: Search + Sort + Filter Toggle */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2 sm:p-3">
        {/* Search Input */}
        <div className="relative flex-1 group">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors"
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
            placeholder="Search products…"
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-100 bg-gray-50/50 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 focus:bg-white outline-none transition-all placeholder:text-gray-400"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Sort Button (Icon only) */}
          <button
            id="sort-toggle-btn"
            type="button"
            onClick={handleSortToggle}
            title={filters.sortOrder === 'desc' ? 'Sorting: Newest (Click for Oldest)' : 'Sorting: Oldest (Click for Newest)'}
            className={`p-2.5 rounded-xl border transition-all flex items-center justify-center gap-2 ${
                filters.sortOrder === 'asc'
                ? 'bg-amber-50 border-amber-200 text-amber-700 shadow-sm'
                : 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm'
            }`}
          >
            <div className="flex flex-col items-center">
              {filters.sortOrder === 'desc' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4 4m0 0l4-4m-4 4v-12" />
                </svg>
              )}
            </div>
            <span className="text-xs font-bold uppercase tracking-wider pr-1 hidden lg:inline">
              {filters.sortOrder === 'desc' ? 'Newest' : 'Oldest'}
            </span>
          </button>

          {/* Toggle advanced filters */}
          <button
            id="toggle-filters-btn"
            onClick={() => setExpanded((v) => !v)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl border transition-all ${
              expanded
                ? 'bg-slate-800 border-slate-800 text-white shadow-md'
                : hasActiveFilters && !filters.search && filters.sortOrder === 'desc'
                  ? 'border-indigo-300 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 text-gray-600 hover:border-indigo-200 hover:bg-gray-50'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
            <span className="hidden sm:inline">Filters</span>
            {hasActiveFilters && filters.sortOrder === 'desc' && !filters.search && (
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            )}
          </button>

          {/* Reset button */}
          {hasActiveFilters && (
            <button
              id="reset-filters-btn"
              onClick={handleReset}
              className="p-2.5 rounded-xl text-red-500 bg-red-50 hover:bg-red-100 border border-red-100 transition-colors"
              title="Clear all filters"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Expandable advanced filters: Streamlined Grid */}
      {expanded && (
        <div className="border-t border-gray-100 bg-gray-50/30 p-4">
          <form onSubmit={handleApply}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Price Range</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={handleChange('minPrice')}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-100 focus:border-indigo-400 outline-none"
                  />
                  <span className="text-gray-300">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={handleChange('maxPrice')}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-100 focus:border-indigo-400 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5 col-span-1 md:col-span-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Stock Availability</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min Stock"
                    value={filters.minStock}
                    onChange={handleChange('minStock')}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-100 focus:border-indigo-400 outline-none"
                  />
                  <span className="text-gray-300">-</span>
                  <input
                    type="number"
                    placeholder="Max Stock"
                    value={filters.maxStock}
                    onChange={handleChange('maxStock')}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-100 focus:border-indigo-400 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2 text-xs font-bold uppercase tracking-widest rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-sm"
                >
                  Apply
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
