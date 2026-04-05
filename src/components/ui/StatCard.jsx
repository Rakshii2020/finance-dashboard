// src/components/ui/StatCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency, formatChange } from '../../utils/helpers';
import clsx from 'clsx';

const StatCard = ({ title, amount, change, changeLabel, icon: Icon, gradient, index = 0 }) => {
  const isPositive = change >= 0;
  const isNeutral = change === undefined || change === null;

  return (
    <motion.div
      className="stat-card group cursor-default"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -2 }}
    >
      {/* Background decoration */}
      <div
        className={clsx(
          'absolute top-0 right-0 w-32 h-32 rounded-bl-[60px] opacity-5 dark:opacity-10',
          gradient
        )}
      />

      {/* Icon */}
      <div className={clsx('w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-lg', gradient)}>
        <Icon className="w-6 h-6 text-white" />
      </div>

      {/* Amount */}
      <div className="font-display text-2xl font-bold text-slate-800 dark:text-white tabular-nums mb-1">
        {formatCurrency(amount)}
      </div>

      {/* Title */}
      <div className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-3">{title}</div>

      {/* Change indicator */}
      {!isNeutral && (
        <div className="flex items-center gap-1.5">
          <div
            className={clsx(
              'flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold',
              isPositive
                ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                : 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400'
            )}
          >
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {formatChange(Math.abs(change))}
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500">{changeLabel}</span>
        </div>
      )}
    </motion.div>
  );
};

export default StatCard;
