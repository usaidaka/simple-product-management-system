import React, { useState } from 'react';
import { syncProducts } from '../services/api';

export default function SyncButton({ onSync }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { type: 'success'|'error', message: string }

  async function handleSync() {
    setLoading(true);
    setResult(null);
    try {
      const data = await syncProducts();
      setResult({ type: 'success', message: `✓ ${data.added} products imported from FakeStore API` });
      onSync();
    } catch (err) {
      setResult({
        type: 'error',
        message: err.response?.data?.error || 'Sync failed. Check your connection and try again.',
      });
    } finally {
      setLoading(false);
      setTimeout(() => setResult(null), 5000);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        id="sync-products-btn"
        onClick={handleSync}
        disabled={loading}
        className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl border-2 border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 hover:border-indigo-300 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
      >
        <svg
          className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        {loading ? 'Syncing…' : 'Sync Products'}
      </button>

      {result && (
        <span
          id="sync-result-message"
          className={`text-sm font-medium px-3 py-1.5 rounded-lg animate-fade-in ${
            result.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {result.message}
        </span>
      )}
    </div>
  );
}
