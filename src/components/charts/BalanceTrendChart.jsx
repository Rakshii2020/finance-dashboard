// src/components/charts/BalanceTrendChart.jsx
import React from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, Area, AreaChart, ReferenceLine,
} from 'recharts';
import { motion } from 'framer-motion';
import { computeMonthlyData } from '../../data/mockData';
import { formatCurrency } from '../../utils/helpers';
import useStore from '../../store/useStore';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-xl p-4 text-sm min-w-[180px]">
      <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center justify-between gap-4 py-0.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
            <span className="text-slate-500 dark:text-slate-400 capitalize">{entry.name}</span>
          </div>
          <span className="font-mono font-medium" style={{ color: entry.color }}>
            {formatCurrency(entry.value, true)}
          </span>
        </div>
      ))}
    </div>
  );
};

const BalanceTrendChart = () => {
  const { transactions } = useStore();
  const data = computeMonthlyData(transactions);
  const { darkMode } = useStore();

  const gridColor = darkMode ? '#334155' : '#e2e8f0';
  const textColor = darkMode ? '#94a3b8' : '#64748b';

  return (
    <motion.div
      className="card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-base font-bold text-slate-800 dark:text-white">
            Income vs Expenses
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Monthly cash flow overview</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-emerald-500 rounded-full inline-block" />
            <span className="text-slate-500 dark:text-slate-400">Income</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-rose-500 rounded-full inline-block" />
            <span className="text-slate-500 dark:text-slate-400">Expenses</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-brand-500 rounded-full inline-block" />
            <span className="text-slate-500 dark:text-slate-400">Balance</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: textColor, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            dy={8}
          />
          <YAxis
            tickFormatter={(v) => formatCurrency(v, true)}
            tick={{ fill: textColor, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={60}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="income"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#colorIncome)"
            dot={{ fill: '#10b981', strokeWidth: 0, r: 3 }}
            activeDot={{ r: 5, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
          />
          <Area
            type="monotone"
            dataKey="expense"
            stroke="#f43f5e"
            strokeWidth={2}
            fill="url(#colorExpense)"
            dot={{ fill: '#f43f5e', strokeWidth: 0, r: 3 }}
            activeDot={{ r: 5, fill: '#f43f5e', strokeWidth: 2, stroke: '#fff' }}
          />
          <Area
            type="monotone"
            dataKey="balance"
            stroke="#0ea5e9"
            strokeWidth={2.5}
            fill="url(#colorBalance)"
            dot={{ fill: '#0ea5e9', strokeWidth: 0, r: 3 }}
            activeDot={{ r: 5, fill: '#0ea5e9', strokeWidth: 2, stroke: '#fff' }}
            strokeDasharray="0"
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default BalanceTrendChart;
