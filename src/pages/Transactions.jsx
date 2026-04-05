// src/pages/Transactions.jsx
// Full transactions management page with filtering, sorting, and CRUD

import React from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Download, ArrowLeftRight } from 'lucide-react';
import useStore from '../store/useStore';
import FilterBar from '../components/transactions/FilterBar';
import TransactionTable from '../components/transactions/TransactionTable';
import { exportToCSV } from '../utils/helpers';
import clsx from 'clsx';

const Transactions = () => {
  const {
    role,
    openAddModal,
    openEditModal,
    getFilteredTransactions,
    transactions,
    filters,
  } = useStore();

  const filtered = getFilteredTransactions();

  // Compute quick stat totals from filtered set
  const filteredIncome = filtered
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0);
  const filteredExpense = filtered
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0);

  const hasFilter =
    filters.search ||
    filters.type !== 'all' ||
    filters.category !== 'all' ||
    filters.dateRange !== 'all';

  return (
    <div className="space-y-4">
      {/* Page header card with filters */}
      <motion.div
        className="card p-5"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Title row */}
        <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center">
              <ArrowLeftRight className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            </div>
            <div>
              <h2 className="font-display text-base font-bold text-slate-800 dark:text-white leading-tight">
                All Transactions
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Showing {filtered.length} of {transactions.length} transactions
                {hasFilter && (
                  <span className="ml-1 text-brand-500 font-medium">(filtered)</span>
                )}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => exportToCSV(filtered)}
              className="btn-secondary text-xs"
              title="Export filtered results to CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
            {role === 'admin' && (
              <button onClick={openAddModal} className="btn-primary text-xs">
                <PlusCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Add Transaction</span>
                <span className="sm:hidden">Add</span>
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <FilterBar />

        {/* Quick stats for filtered results */}
        {filtered.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
              <span className="text-slate-500 dark:text-slate-400">Income:</span>
              <span className="font-semibold font-mono text-emerald-600 dark:text-emerald-400">
                +₹{filteredIncome.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0" />
              <span className="text-slate-500 dark:text-slate-400">Expenses:</span>
              <span className="font-semibold font-mono text-rose-600 dark:text-rose-400">
                -₹{filteredExpense.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-brand-500 flex-shrink-0" />
              <span className="text-slate-500 dark:text-slate-400">Net:</span>
              <span
                className={clsx(
                  'font-semibold font-mono',
                  filteredIncome - filteredExpense >= 0
                    ? 'text-brand-600 dark:text-brand-400'
                    : 'text-rose-600 dark:text-rose-400'
                )}
              >
                ₹{(filteredIncome - filteredExpense).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        )}
      </motion.div>

      {/* Table card */}
      <motion.div
        className="card overflow-hidden"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        <TransactionTable transactions={filtered} onEdit={openEditModal} />
      </motion.div>
    </div>
  );
};

export default Transactions;
