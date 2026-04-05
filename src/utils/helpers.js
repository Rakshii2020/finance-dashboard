// src/utils/helpers.js

/**
 * Format amount as Indian Rupee currency
 */
export const formatCurrency = (amount, compact = false) => {
  if (compact && Math.abs(amount) >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }
  if (compact && Math.abs(amount) >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format date to readable string
 */
export const formatDate = (dateStr, format = 'medium') => {
  const date = new Date(dateStr);
  if (format === 'short') {
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  }
  if (format === 'long') {
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  }
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

/**
 * Get relative date label (Today, Yesterday, or date)
 */
export const getRelativeDate = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const txDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (txDay.getTime() === today.getTime()) return 'Today';
  if (txDay.getTime() === yesterday.getTime()) return 'Yesterday';
  return formatDate(dateStr, 'short');
};

/**
 * Format percentage change with sign
 */
export const formatChange = (pct) => {
  const sign = pct > 0 ? '+' : '';
  return `${sign}${pct.toFixed(1)}%`;
};

/**
 * Export transactions to CSV
 */
export const exportToCSV = (transactions) => {
  const headers = ['Date', 'Description', 'Category', 'Type', 'Amount (INR)'];
  const rows = transactions.map((tx) => [
    tx.date,
    `"${tx.description}"`,
    tx.category,
    tx.type,
    tx.amount,
  ]);

  const csvContent = [headers, ...rows].map((r) => r.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `finflow_transactions_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Clamp a number between min and max
 */
export const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

/**
 * Generate a color with given opacity
 */
export const withOpacity = (hex, opacity) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return hex;
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

/**
 * Debounce utility
 */
export const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};
