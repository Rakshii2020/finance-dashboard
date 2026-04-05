// src/store/useStore.js
// Zustand store for global state management

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { INITIAL_TRANSACTIONS } from '../data/mockData';

const useStore = create(
  persist(
    (set, get) => ({
      // ─── Transactions ──────────────────────────────────────────────────
      transactions: INITIAL_TRANSACTIONS,

      addTransaction: (transaction) => {
        const newTx = {
          ...transaction,
          id: `tx_${Date.now()}`,
        };
        set((state) => ({
          transactions: [newTx, ...state.transactions],
        }));
      },

      updateTransaction: (id, updates) => {
        set((state) => ({
          transactions: state.transactions.map((tx) =>
            tx.id === id ? { ...tx, ...updates } : tx
          ),
        }));
      },

      deleteTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter((tx) => tx.id !== id),
        }));
      },

      // ─── Filters & Search ──────────────────────────────────────────────
      filters: {
        search: '',
        type: 'all', // 'all' | 'income' | 'expense'
        category: 'all',
        sortBy: 'date', // 'date' | 'amount'
        sortOrder: 'desc', // 'asc' | 'desc'
        dateRange: 'all', // 'all' | 'this_month' | 'last_month' | 'last_3_months' | 'last_6_months'
      },

      setFilter: (key, value) => {
        set((state) => ({
          filters: { ...state.filters, [key]: value },
        }));
      },

      resetFilters: () => {
        set({
          filters: {
            search: '',
            type: 'all',
            category: 'all',
            sortBy: 'date',
            sortOrder: 'desc',
            dateRange: 'all',
          },
        });
      },

      // ─── Computed Getters ──────────────────────────────────────────────
      getFilteredTransactions: () => {
        const { transactions, filters } = get();
        const now = new Date();
        let result = [...transactions];

        // Search filter
        if (filters.search) {
          const q = filters.search.toLowerCase();
          result = result.filter(
            (tx) =>
              tx.description.toLowerCase().includes(q) ||
              tx.category.toLowerCase().includes(q)
          );
        }

        // Type filter
        if (filters.type !== 'all') {
          result = result.filter((tx) => tx.type === filters.type);
        }

        // Category filter
        if (filters.category !== 'all') {
          result = result.filter((tx) => tx.category === filters.category);
        }

        // Date range filter
        if (filters.dateRange !== 'all') {
          const cutoffs = {
            this_month: new Date(now.getFullYear(), now.getMonth(), 1),
            last_month: new Date(now.getFullYear(), now.getMonth() - 1, 1),
            last_3_months: new Date(now.getFullYear(), now.getMonth() - 3, 1),
            last_6_months: new Date(now.getFullYear(), now.getMonth() - 6, 1),
          };
          const cutoff = cutoffs[filters.dateRange];
          if (cutoff) {
            result = result.filter((tx) => new Date(tx.date) >= cutoff);
          }
        }

        // Sorting
        result.sort((a, b) => {
          if (filters.sortBy === 'date') {
            const diff = new Date(b.date) - new Date(a.date);
            return filters.sortOrder === 'desc' ? diff : -diff;
          } else {
            const diff = b.amount - a.amount;
            return filters.sortOrder === 'desc' ? diff : -diff;
          }
        });

        return result;
      },

      getSummary: () => {
        const { transactions } = get();
        const now = new Date();
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        const thisMonthTx = transactions.filter((tx) => new Date(tx.date) >= thisMonthStart);
        const lastMonthTx = transactions.filter(
          (tx) => new Date(tx.date) >= lastMonthStart && new Date(tx.date) < thisMonthStart
        );

        const total = (txs, type) =>
          txs.filter((tx) => tx.type === type).reduce((sum, tx) => sum + tx.amount, 0);

        const totalIncome = total(transactions, 'income');
        const totalExpense = total(transactions, 'expense');
        const thisMonthIncome = total(thisMonthTx, 'income');
        const thisMonthExpense = total(thisMonthTx, 'expense');
        const lastMonthIncome = total(lastMonthTx, 'income');
        const lastMonthExpense = total(lastMonthTx, 'expense');

        return {
          totalBalance: totalIncome - totalExpense,
          totalIncome,
          totalExpense,
          thisMonthIncome,
          thisMonthExpense,
          thisMonthBalance: thisMonthIncome - thisMonthExpense,
          lastMonthIncome,
          lastMonthExpense,
          expenseChange:
            lastMonthExpense > 0
              ? ((thisMonthExpense - lastMonthExpense) / lastMonthExpense) * 100
              : 0,
          incomeChange:
            lastMonthIncome > 0
              ? ((thisMonthIncome - lastMonthIncome) / lastMonthIncome) * 100
              : 0,
        };
      },

      // ─── UI State ─────────────────────────────────────────────────────
      activeTab: 'dashboard', // 'dashboard' | 'transactions' | 'insights'
      setActiveTab: (tab) => set({ activeTab: tab }),

      role: 'admin', // 'admin' | 'viewer'
      setRole: (role) => set({ role }),

      darkMode: false,
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      // ─── Modal State ──────────────────────────────────────────────────
      modal: {
        isOpen: false,
        mode: 'add', // 'add' | 'edit'
        transaction: null,
      },

      openAddModal: () =>
        set({ modal: { isOpen: true, mode: 'add', transaction: null } }),

      openEditModal: (transaction) =>
        set({ modal: { isOpen: true, mode: 'edit', transaction } }),

      closeModal: () =>
        set({ modal: { isOpen: false, mode: 'add', transaction: null } }),
    }),
    {
      name: 'finflow-storage',
      // Only persist transactions, role, and darkMode — not UI state
      partialize: (state) => ({
        transactions: state.transactions,
        role: state.role,
        darkMode: state.darkMode,
      }),
    }
  )
);

export default useStore;
