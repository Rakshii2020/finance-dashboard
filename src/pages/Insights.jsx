// src/pages/Insights.jsx
// Smart financial insights: trends, comparisons, category rankings, and tips

import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Zap,
  PiggyBank,
  Target,
  Award,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import useStore from '../store/useStore';
import { computeMonthlyData, computeCategorySpending } from '../data/mockData';
import { formatCurrency, formatChange } from '../utils/helpers';
import { motion as m } from 'framer-motion';
import clsx from 'clsx';

// ─── Tooltip for bar chart ────────────────────────────────────────────────────
const BarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-xl p-4 text-sm min-w-[160px]">
      <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center justify-between gap-4 py-0.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: entry.fill }} />
            <span className="text-slate-500 dark:text-slate-400 capitalize text-xs">{entry.name}</span>
          </div>
          <span className="font-mono font-semibold text-xs" style={{ color: entry.fill }}>
            {formatCurrency(entry.value, true)}
          </span>
        </div>
      ))}
    </div>
  );
};

// ─── Insight card component ────────────────────────────────────────────────────
const InsightCard = ({ icon: Icon, title, text, borderColor, bgColor, iconColor, index }) => (
  <motion.div
    className={clsx('card p-5 border-l-4', borderColor)}
    initial={{ opacity: 0, x: -16 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.08, duration: 0.35 }}
  >
    <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center mb-3', bgColor)}>
      <Icon className={clsx('w-5 h-5', iconColor)} />
    </div>
    <h3 className="font-display text-sm font-bold text-slate-800 dark:text-white mb-1.5">{title}</h3>
    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{text}</p>
  </motion.div>
);

// ─── Main Insights page ───────────────────────────────────────────────────────
const Insights = () => {
  const { transactions, getSummary, darkMode } = useStore();
  const summary = getSummary();
  const monthly = computeMonthlyData(transactions);
  const categorySpending = computeCategorySpending(transactions);
  const topCategory = categorySpending[0];
  const totalExpense = categorySpending.reduce((s, c) => s + c.amount, 0);

  const savingsRate =
    summary.thisMonthIncome > 0
      ? ((summary.thisMonthIncome - summary.thisMonthExpense) / summary.thisMonthIncome) * 100
      : 0;

  const expenseUp = summary.expenseChange > 0;
  const incomeUp = summary.incomeChange >= 0;

  const gridColor = darkMode ? '#334155' : '#f1f5f9';
  const tickColor = darkMode ? '#94a3b8' : '#94a3b8';

  // Build insight cards dynamically
  const insights = [
    {
      icon: expenseUp ? AlertTriangle : CheckCircle2,
      borderColor: expenseUp ? 'border-rose-400' : 'border-emerald-400',
      bgColor: expenseUp
        ? 'bg-rose-50 dark:bg-rose-900/20'
        : 'bg-emerald-50 dark:bg-emerald-900/20',
      iconColor: expenseUp ? 'text-rose-500' : 'text-emerald-500',
      title: expenseUp ? '⚠️ Spending Increased' : '✅ Spending Under Control',
      text: `You spent ${formatChange(Math.abs(summary.expenseChange))} ${
        expenseUp ? 'more' : 'less'
      } this month compared to last month. ${
        expenseUp
          ? 'Consider reviewing your discretionary expenses.'
          : 'Great discipline! Keep it up.'
      }`,
    },
    {
      icon: incomeUp ? TrendingUp : TrendingDown,
      borderColor: incomeUp ? 'border-emerald-400' : 'border-amber-400',
      bgColor: incomeUp
        ? 'bg-emerald-50 dark:bg-emerald-900/20'
        : 'bg-amber-50 dark:bg-amber-900/20',
      iconColor: incomeUp ? 'text-emerald-500' : 'text-amber-500',
      title: incomeUp ? '📈 Income Growing' : '📉 Income Declined',
      text: `Your income ${incomeUp ? 'grew' : 'dropped'} by ${formatChange(
        Math.abs(summary.incomeChange)
      )} compared to last month (${formatCurrency(summary.thisMonthIncome)} this month vs ${formatCurrency(
        summary.lastMonthIncome
      )} last month).`,
    },
    {
      icon: Zap,
      borderColor: 'border-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
      iconColor: 'text-amber-500',
      title: '🔥 Biggest Spending Category',
      text: topCategory
        ? `${topCategory.icon} ${topCategory.label} is your largest expense at ${formatCurrency(
            topCategory.amount
          )}, making up ${((topCategory.amount / totalExpense) * 100).toFixed(1)}% of your total spending.`
        : 'No expense data available yet.',
    },
    {
      icon: PiggyBank,
      borderColor:
        savingsRate >= 30
          ? 'border-emerald-400'
          : savingsRate >= 20
          ? 'border-brand-400'
          : 'border-rose-400',
      bgColor:
        savingsRate >= 30
          ? 'bg-emerald-50 dark:bg-emerald-900/20'
          : savingsRate >= 20
          ? 'bg-brand-50 dark:bg-brand-900/20'
          : 'bg-rose-50 dark:bg-rose-900/20',
      iconColor:
        savingsRate >= 30
          ? 'text-emerald-500'
          : savingsRate >= 20
          ? 'text-brand-500'
          : 'text-rose-500',
      title: '💰 Savings Rate',
      text: `You are saving ${savingsRate.toFixed(1)}% of your income this month. ${
        savingsRate >= 30
          ? 'Excellent! You are well above the recommended 20% savings rate. 🎉'
          : savingsRate >= 20
          ? 'Good job! You are meeting the recommended savings threshold.'
          : 'Try to save at least 20% of your monthly income for financial health.'
      }`,
    },
    {
      icon: Target,
      borderColor: 'border-violet-400',
      bgColor: 'bg-violet-50 dark:bg-violet-900/20',
      iconColor: 'text-violet-500',
      title: '🎯 This Month Summary',
      text: `You earned ${formatCurrency(summary.thisMonthIncome)} and spent ${formatCurrency(
        summary.thisMonthExpense
      )} this month, resulting in a net ${
        summary.thisMonthBalance >= 0 ? 'surplus' : 'deficit'
      } of ${formatCurrency(Math.abs(summary.thisMonthBalance))}.`,
    },
    {
      icon: Award,
      borderColor: 'border-teal-400',
      bgColor: 'bg-teal-50 dark:bg-teal-900/20',
      iconColor: 'text-teal-500',
      title: '🏆 Financial Health Score',
      text: (() => {
        let score = 0;
        if (savingsRate >= 20) score += 2;
        if (!expenseUp) score += 2;
        if (incomeUp) score += 2;
        if (summary.totalBalance > 0) score += 2;
        if (savingsRate >= 30) score += 2;
        const label =
          score >= 8 ? 'Excellent 🌟' : score >= 6 ? 'Good 👍' : score >= 4 ? 'Fair ⚡' : 'Needs Attention ⚠️';
        return `Based on your savings rate, income trend, and expense control, your financial health is: ${label} (${score}/10). Keep tracking your finances to improve your score.`;
      })(),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Insight cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {insights.map((ins, i) => (
          <InsightCard key={i} index={i} {...ins} />
        ))}
      </div>

      {/* Monthly income vs expenses bar chart */}
      <motion.div
        className="card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-start justify-between mb-6 flex-wrap gap-2">
          <div>
            <h2 className="font-display text-base font-bold text-slate-800 dark:text-white">
              Monthly Income vs Expenses
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              6-month cash flow comparison
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-500 inline-block" />
              <span className="text-slate-500 dark:text-slate-400">Income</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-rose-500 inline-block" />
              <span className="text-slate-500 dark:text-slate-400">Expense</span>
            </div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={monthly} barGap={6} barCategoryGap="28%">
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: tickColor }}
              axisLine={false}
              tickLine={false}
              dy={6}
            />
            <YAxis
              tickFormatter={(v) => formatCurrency(v, true)}
              tick={{ fontSize: 11, fill: tickColor }}
              axisLine={false}
              tickLine={false}
              width={62}
            />
            <Tooltip content={<BarTooltip />} cursor={{ fill: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }} />
            <Bar dataKey="income" name="income" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={48} />
            <Bar dataKey="expense" name="expense" fill="#f43f5e" radius={[6, 6, 0, 0]} maxBarSize={48} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Bottom row: top categories + monthly net */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top spending categories */}
        <motion.div
          className="card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="font-display text-base font-bold text-slate-800 dark:text-white mb-1">
            Top Spending Categories
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">All-time breakdown</p>

          <div className="space-y-4">
            {categorySpending.slice(0, 7).map((cat, i) => {
              const maxAmt = categorySpending[0]?.amount || 1;
              const pct = (cat.amount / maxAmt) * 100;
              const sharePct = ((cat.amount / totalExpense) * 100).toFixed(1);

              return (
                <div key={cat.id} className="group">
                  <div className="flex items-center gap-3 mb-1.5">
                    <div className="w-5 text-xs font-bold text-slate-300 dark:text-slate-600 flex-shrink-0 text-right">
                      {i + 1}
                    </div>
                    <span className="text-base leading-none flex-shrink-0">{cat.icon}</span>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex-1 truncate">
                      {cat.label}
                    </span>
                    <div className="text-right flex-shrink-0">
                      <span className="text-sm font-semibold font-mono text-slate-800 dark:text-slate-200">
                        {formatCurrency(cat.amount, true)}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-1.5">
                        {sharePct}%
                      </span>
                    </div>
                  </div>
                  <div className="ml-8 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: cat.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: 0.7 + i * 0.06, duration: 0.6, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Monthly net balance table */}
        <motion.div
          className="card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h2 className="font-display text-base font-bold text-slate-800 dark:text-white mb-1">
            Monthly Net Balance
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
            Income minus expenses per month
          </p>

          <div className="space-y-2">
            {[...monthly].reverse().map((m, i) => {
              const isPositive = m.balance >= 0;
              const maxAbs = Math.max(...monthly.map((x) => Math.abs(x.balance)));
              const barPct = maxAbs > 0 ? (Math.abs(m.balance) / maxAbs) * 100 : 0;

              return (
                <motion.div
                  key={m.key}
                  className="flex items-center gap-3 py-2 border-b border-slate-50 dark:border-slate-700/50 last:border-b-0"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.75 + i * 0.05 }}
                >
                  <div className="w-14 text-xs font-medium text-slate-500 dark:text-slate-400 flex-shrink-0">
                    {m.label}
                  </div>
                  <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      className={clsx('h-full rounded-full', isPositive ? 'bg-emerald-500' : 'bg-rose-500')}
                      initial={{ width: 0 }}
                      animate={{ width: `${barPct}%` }}
                      transition={{ delay: 0.8 + i * 0.05, duration: 0.5, ease: 'easeOut' }}
                    />
                  </div>
                  <div
                    className={clsx(
                      'text-xs font-semibold font-mono w-24 text-right flex-shrink-0',
                      isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    )}
                  >
                    {isPositive ? '+' : '-'}
                    {formatCurrency(Math.abs(m.balance), true)}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Total net */}
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Total Net</span>
            <span
              className={clsx(
                'text-sm font-bold font-mono',
                monthly.reduce((s, m) => s + m.balance, 0) >= 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              )}
            >
              {formatCurrency(monthly.reduce((s, m) => s + m.balance, 0))}
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Insights;
