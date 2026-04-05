// src/components/layout/Header.jsx
import React from 'react';
import { Moon, Sun, Menu, Bell, Shield, Eye, Download } from 'lucide-react';
import useStore from '../../store/useStore';
import { exportToCSV } from '../../utils/helpers';
import clsx from 'clsx';

const PAGE_TITLES = {
  dashboard: { title: 'Dashboard', subtitle: 'Your financial overview at a glance' },
  transactions: { title: 'Transactions', subtitle: 'Manage and track your money flow' },
  insights: { title: 'Insights', subtitle: 'Smart analysis of your spending habits' },
};

const Header = () => {
  const { darkMode, toggleDarkMode, role, setRole, activeTab, setSidebarOpen, sidebarOpen, transactions, openAddModal } = useStore();
  const { title, subtitle } = PAGE_TITLES[activeTab] || PAGE_TITLES.dashboard;

  return (
    <header className="h-16 bg-white dark:bg-surface-dark-card border-b border-slate-100 dark:border-slate-700/50 flex items-center px-4 lg:px-6 gap-4 flex-shrink-0 z-20">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Page title */}
      <div className="flex-1 min-w-0">
        <h1 className="font-display text-lg font-bold text-slate-800 dark:text-white leading-tight truncate">
          {title}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">{subtitle}</p>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Export CSV */}
        {activeTab === 'transactions' && (
          <button
            onClick={() => exportToCSV(transactions)}
            className="btn-secondary hidden sm:flex"
            title="Export to CSV"
          >
            <Download className="w-4 h-4" />
            <span className="hidden md:inline">Export</span>
          </button>
        )}

        {/* Role switcher */}
        <div className="relative">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className={clsx(
              'appearance-none pl-8 pr-3 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 cursor-pointer',
              'focus:outline-none focus:ring-2 focus:ring-brand-500/40',
              role === 'admin'
                ? 'bg-brand-50 dark:bg-brand-900/30 border-brand-200 dark:border-brand-700 text-brand-700 dark:text-brand-400'
                : 'bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300'
            )}
          >
            <option value="admin">Admin</option>
            <option value="viewer">Viewer</option>
          </select>
          <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
            {role === 'admin' ? (
              <Shield className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            ) : (
              <Eye className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            )}
          </div>
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
        </button>

        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all duration-200"
          title="Toggle dark mode"
        >
          {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-xl gradient-teal flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-glow">
          FF
        </div>
      </div>
    </header>
  );
};

export default Header;
