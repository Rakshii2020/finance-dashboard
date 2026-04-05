// src/components/transactions/TransactionTable.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import useStore from '../../store/useStore';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { getCategoryById } from '../../data/mockData';
import EmptyState from '../ui/EmptyState';
import clsx from 'clsx';

const TransactionRow = ({ tx, index, role, onEdit, onDelete }) => {
  const cat = getCategoryById(tx.category);
  const isIncome = tx.type === 'income';

  return (
    <motion.tr
      key={tx.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ delay: index * 0.03, duration: 0.25 }}
      layout
      className="group"
    >
      {/* Type indicator + Date */}
      <td className="py-3.5 px-4 border-b border-slate-50 dark:border-slate-700/50">
        <div className="flex items-center gap-3">
          <div
            className={clsx(
              'w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0',
              isIncome
                ? 'bg-emerald-50 dark:bg-emerald-900/30'
                : 'bg-red-50 dark:bg-red-900/30'
            )}
          >
            {isIncome ? (
              <ArrowDownLeft className="w-4 h-4 text-emerald-500" />
            ) : (
              <ArrowUpRight className="w-4 h-4 text-rose-500" />
            )}
          </div>
          <div>
            <div className="text-sm font-medium text-slate-800 dark:text-slate-100 leading-tight max-w-[160px] truncate">
              {tx.description}
            </div>
            <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              {formatDate(tx.date, 'short')}
            </div>
          </div>
        </div>
      </td>

      {/* Category */}
      <td className="py-3.5 px-4 border-b border-slate-50 dark:border-slate-700/50 hidden md:table-cell">
        <div className="flex items-center gap-1.5">
          <span className="text-sm">{cat.icon}</span>
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{cat.label}</span>
        </div>
      </td>

      {/* Type badge */}
      <td className="py-3.5 px-4 border-b border-slate-50 dark:border-slate-700/50 hidden sm:table-cell">
        <span className={isIncome ? 'badge-income' : 'badge-expense'}>
          {isIncome ? '↑ Income' : '↓ Expense'}
        </span>
      </td>

      {/* Amount */}
      <td className="py-3.5 px-4 border-b border-slate-50 dark:border-slate-700/50 text-right">
        <span
          className={clsx(
            'font-mono font-semibold text-sm',
            isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
          )}
        >
          {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
        </span>
      </td>

      {/* Actions */}
      {role === 'admin' && (
        <td className="py-3.5 px-4 border-b border-slate-50 dark:border-slate-700/50">
          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(tx)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/30 transition-all"
              title="Edit"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(tx.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-all"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </td>
      )}
    </motion.tr>
  );
};

const TransactionTable = ({ transactions, onEdit }) => {
  const { role, deleteTransaction, openAddModal } = useStore();

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(id);
    }
  };

  if (transactions.length === 0) {
    return (
      <EmptyState
        title="No transactions found"
        subtitle="Try adjusting your filters or add a new transaction."
        action={role === 'admin' ? openAddModal : undefined}
        actionLabel="Add Transaction"
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="data-table">
        <thead>
          <tr>
            <th>Transaction</th>
            <th className="hidden md:table-cell">Category</th>
            <th className="hidden sm:table-cell">Type</th>
            <th className="text-right">Amount</th>
            {role === 'admin' && <th className="text-right">Actions</th>}
          </tr>
        </thead>
        <tbody>
          <AnimatePresence mode="popLayout">
            {transactions.map((tx, idx) => (
              <TransactionRow
                key={tx.id}
                tx={tx}
                index={idx}
                role={role}
                onEdit={onEdit}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
