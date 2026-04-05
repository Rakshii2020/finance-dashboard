// src/pages/Dashboard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, TrendingDown, PlusCircle } from 'lucide-react';
import useStore from '../store/useStore';
import StatCard from '../components/ui/StatCard';
import BalanceTrendChart from '../components/charts/BalanceTrendChart';
import CategoryDonutChart from '../components/charts/CategoryDonutChart';
import { formatCurrency, formatDate, getRelativeDate } from '../utils/helpers';
import { getCategoryById } from '../data/mockData';
import clsx from 'clsx';

const RecentTransactionItem = ({ tx }) => {
  const cat = getCategoryById(tx.category);
  const isIncome = tx.type === 'income';
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-slate-50 dark:border-slate-700/50 last:border-b-0">
      <div className={clsx(
        'w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-base',
        isIncome ? 'bg-emerald-50 dark:bg-emerald-900/30' : 'bg-slate-50 dark:bg-slate-700/50'
      )}>
        {cat.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{tx.description}</div>
        <div className="text-xs text-slate-400 dark:text-slate-500">{getRelativeDate(tx.date)}</div>
      </div>
      <span className={clsx(
        'text-sm font-semibold font-mono flex-shrink-0',
        isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
      )}>
        {isIncome ? '+' : '-'}{formatCurrency(tx.amount, true)}
      </span>
    </div>
  );
};

const Dashboard = () => {
  const { getSummary, transactions, role, openAddModal } = useStore();
  const summary = getSummary();
  const recent = transactions.slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Balance"
          amount={summary.totalBalance}
          icon={Wallet}
          gradient="gradient-teal"
          index={0}
        />
        <StatCard
          title="Total Income"
          amount={summary.totalIncome}
          change={summary.incomeChange}
          changeLabel="vs last month"
          icon={TrendingUp}
          gradient="gradient-emerald"
          index={1}
        />
        <StatCard
          title="Total Expenses"
          amount={summary.totalExpense}
          change={summary.expenseChange}
          changeLabel="vs last month"
          icon={TrendingDown}
          gradient="gradient-amber"
          index={2}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <div className="xl:col-span-3">
          <BalanceTrendChart />
        </div>
        <div className="xl:col-span-2">
          <CategoryDonutChart />
        </div>
      </div>

      {/* Bottom row: recent txns + this month summary */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Recent transactions */}
        <motion.div
          className="card p-6 lg:col-span-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-base font-bold text-slate-800 dark:text-white">
                Recent Transactions
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Latest activity</p>
            </div>
            {role === 'admin' && (
              <button onClick={openAddModal} className="btn-primary text-xs py-1.5">
                <PlusCircle className="w-3.5 h-3.5" />
                Add
              </button>
            )}
          </div>
          <div>
            {recent.map((tx) => (
              <RecentTransactionItem key={tx.id} tx={tx} />
            ))}
          </div>
        </motion.div>

        {/* This month summary */}
        <motion.div
          className="card p-6 lg:col-span-2 space-y-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div>
            <h2 className="font-display text-base font-bold text-slate-800 dark:text-white">
              This Month
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Current period overview</p>
          </div>

          {/* Balance */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-teal text-white">
            <div className="text-xs font-medium opacity-80 mb-1">Net Balance</div>
            <div className="font-display text-2xl font-bold tabular-nums">
              {formatCurrency(summary.thisMonthBalance)}
            </div>
          </div>

          {/* Income & Expense bars */}
          <div className="space-y-4">
            {/* Income */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Income</span>
                </div>
                <span className="text-sm font-semibold font-mono text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(summary.thisMonthIncome)}
                </span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-emerald-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min(100, (summary.thisMonthIncome / (summary.thisMonthIncome + summary.thisMonthExpense)) * 100)}%`
                  }}
                  transition={{ delay: 0.8, duration: 0.7, ease: 'easeOut' }}
                />
              </div>
            </div>

            {/* Expense */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-rose-500" />
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Expenses</span>
                </div>
                <span className="text-sm font-semibold font-mono text-rose-600 dark:text-rose-400">
                  {formatCurrency(summary.thisMonthExpense)}
                </span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-rose-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min(100, (summary.thisMonthExpense / (summary.thisMonthIncome + summary.thisMonthExpense)) * 100)}%`
                  }}
                  transition={{ delay: 0.9, duration: 0.7, ease: 'easeOut' }}
                />
              </div>
            </div>

            {/* Savings rate */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">Savings Rate</span>
                <span className="text-sm font-semibold text-brand-600 dark:text-brand-400">
                  {summary.thisMonthIncome > 0
                    ? `${(((summary.thisMonthIncome - summary.thisMonthExpense) / summary.thisMonthIncome) * 100).toFixed(1)}%`
                    : '—'}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
