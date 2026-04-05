// src/components/transactions/FilterBar.jsx
import React, { useCallback } from 'react';
import { Search, X, ArrowUpDown, SlidersHorizontal } from 'lucide-react';
import useStore from '../../store/useStore';
import { ALL_CATEGORIES } from '../../data/mockData';
import { debounce } from '../../utils/helpers';
import clsx from 'clsx';

const FilterBar = () => {
  const { filters, setFilter, resetFilters } = useStore();

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((val) => setFilter('search', val), 250),
    []
  );

  const hasActiveFilters =
    filters.search || filters.type !== 'all' || filters.category !== 'all' || filters.dateRange !== 'all';

  const toggleSort = (field) => {
    if (filters.sortBy === field) {
      setFilter('sortOrder', filters.sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setFilter('sortBy', field);
      setFilter('sortOrder', 'desc');
    }
  };

  return (
    <div className="space-y-3">
      {/* Search + Type filter row */}
      <div className="flex flex-wrap gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            defaultValue={filters.search}
            onChange={(e) => debouncedSearch(e.target.value)}
            className="input-field pl-9 pr-8"
          />
          {filters.search && (
            <button
              onClick={() => setFilter('search', '')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Type filter tabs */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700/50 rounded-xl p-1">
          {[
            { val: 'all', label: 'All' },
            { val: 'income', label: 'Income' },
            { val: 'expense', label: 'Expense' },
          ].map(({ val, label }) => (
            <button
              key={val}
              onClick={() => setFilter('type', val)}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200',
                filters.type === val
                  ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Second row: Category, Date Range, Sort */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Category */}
        <select
          value={filters.category}
          onChange={(e) => setFilter('category', e.target.value)}
          className="input-field w-auto text-xs py-2"
        >
          <option value="all">All Categories</option>
          <optgroup label="Income">
            {ALL_CATEGORIES.filter((c) =>
              ['salary', 'freelance', 'investments', 'rental', 'bonus', 'other_income'].includes(c.id)
            ).map((c) => (
              <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
            ))}
          </optgroup>
          <optgroup label="Expenses">
            {ALL_CATEGORIES.filter((c) =>
              !['salary', 'freelance', 'investments', 'rental', 'bonus', 'other_income'].includes(c.id)
            ).map((c) => (
              <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
            ))}
          </optgroup>
        </select>

        {/* Date range */}
        <select
          value={filters.dateRange}
          onChange={(e) => setFilter('dateRange', e.target.value)}
          className="input-field w-auto text-xs py-2"
        >
          <option value="all">All Time</option>
          <option value="this_month">This Month</option>
          <option value="last_month">Last Month</option>
          <option value="last_3_months">Last 3 Months</option>
          <option value="last_6_months">Last 6 Months</option>
        </select>

        {/* Sort buttons */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => toggleSort('date')}
            className={clsx(
              'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all',
              filters.sortBy === 'date'
                ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400'
                : 'btn-secondary'
            )}
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            Date {filters.sortBy === 'date' && (filters.sortOrder === 'desc' ? '↓' : '↑')}
          </button>
          <button
            onClick={() => toggleSort('amount')}
            className={clsx(
              'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all',
              filters.sortBy === 'amount'
                ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400'
                : 'btn-secondary'
            )}
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            Amount {filters.sortBy === 'amount' && (filters.sortOrder === 'desc' ? '↓' : '↑')}
          </button>

          {/* Clear filters */}
          {hasActiveFilters && (
            <button onClick={resetFilters} className="flex items-center gap-1.5 text-xs text-rose-500 hover:text-rose-700 font-medium transition-colors">
              <X className="w-3.5 h-3.5" />
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
