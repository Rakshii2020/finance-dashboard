// src/components/ui/EmptyState.jsx
import React from 'react';
import { SearchX, PlusCircle } from 'lucide-react';

const EmptyState = ({ title = 'No data found', subtitle = '', icon: Icon = SearchX, action, actionLabel }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4">
      <Icon className="w-8 h-8 text-slate-400 dark:text-slate-500" />
    </div>
    <h3 className="font-display text-lg font-semibold text-slate-700 dark:text-slate-300 mb-1">{title}</h3>
    {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">{subtitle}</p>}
    {action && (
      <button onClick={action} className="btn-primary mt-4">
        <PlusCircle className="w-4 h-4" />
        {actionLabel || 'Add Transaction'}
      </button>
    )}
  </div>
);

export default EmptyState;
