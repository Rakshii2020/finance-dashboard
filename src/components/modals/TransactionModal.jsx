// src/components/modals/TransactionModal.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, DollarSign } from 'lucide-react';
import useStore from '../../store/useStore';
import { CATEGORIES } from '../../data/mockData';
import clsx from 'clsx';

const DEFAULT_FORM = {
  description: '',
  amount: '',
  type: 'expense',
  category: 'food',
  date: new Date().toISOString().split('T')[0],
};

const TransactionModal = () => {
  const { modal, closeModal, addTransaction, updateTransaction } = useStore();
  const { isOpen, mode, transaction } = modal;

  const [form, setForm] = useState(DEFAULT_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && transaction) {
        setForm({
          description: transaction.description,
          amount: String(transaction.amount),
          type: transaction.type,
          category: transaction.category,
          date: transaction.date,
        });
      } else {
        setForm(DEFAULT_FORM);
      }
      setErrors({});
    }
  }, [isOpen, mode, transaction]);

  const currentCategories = CATEGORIES[form.type] || CATEGORIES.expense;

  const validate = () => {
    const newErrors = {};
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)
      newErrors.amount = 'Enter a valid amount';
    if (!form.category) newErrors.category = 'Select a category';
    if (!form.date) newErrors.date = 'Date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const payload = {
      ...form,
      amount: Math.round(Number(form.amount)),
    };

    if (mode === 'add') {
      addTransaction(payload);
    } else {
      updateTransaction(transaction.id, payload);
    }
    closeModal();
  };

  const handleTypeChange = (type) => {
    const defaultCat = CATEGORIES[type][0].id;
    setForm((f) => ({ ...f, type, category: defaultCat }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <motion.div
            className="modal-content"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700">
              <div>
                <h2 className="font-display text-lg font-bold text-slate-800 dark:text-white">
                  {mode === 'add' ? 'Add Transaction' : 'Edit Transaction'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {mode === 'add' ? 'Record a new income or expense' : 'Update transaction details'}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              {/* Type toggle */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['income', 'expense'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleTypeChange(type)}
                      className={clsx(
                        'py-3 rounded-xl text-sm font-semibold border-2 transition-all duration-200 capitalize',
                        form.type === type
                          ? type === 'income'
                            ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-500 text-emerald-700 dark:text-emerald-400'
                            : 'bg-rose-50 dark:bg-rose-900/30 border-rose-500 text-rose-600 dark:text-rose-400'
                          : 'border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-slate-300'
                      )}
                    >
                      {type === 'income' ? '↑ Income' : '↓ Expense'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="e.g., Monthly Salary, Netflix subscription..."
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className={clsx('input-field', errors.description && 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/30')}
                />
                {errors.description && <p className="text-xs text-rose-500 mt-1">{errors.description}</p>}
              </div>

              {/* Amount + Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Amount (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₹</span>
                    <input
                      type="number"
                      placeholder="0"
                      min="1"
                      value={form.amount}
                      onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                      className={clsx('input-field pl-7', errors.amount && 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/30')}
                    />
                  </div>
                  {errors.amount && <p className="text-xs text-rose-500 mt-1">{errors.amount}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                    className={clsx('input-field', errors.date && 'border-rose-400')}
                  />
                  {errors.date && <p className="text-xs text-rose-500 mt-1">{errors.date}</p>}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                  {currentCategories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, category: cat.id }))}
                      className={clsx(
                        'flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium border-2 transition-all duration-200 text-left',
                        form.category === cat.id
                          ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400'
                          : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-500'
                      )}
                    >
                      <span className="text-base">{cat.icon}</span>
                      <span className="truncate">{cat.label}</span>
                    </button>
                  ))}
                </div>
                {errors.category && <p className="text-xs text-rose-500 mt-1">{errors.category}</p>}
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 pt-0">
              <button onClick={closeModal} className="btn-secondary flex-1 justify-center">
                Cancel
              </button>
              <button onClick={handleSubmit} className="btn-primary flex-1 justify-center">
                <Check className="w-4 h-4" />
                {mode === 'add' ? 'Add Transaction' : 'Save Changes'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TransactionModal;
