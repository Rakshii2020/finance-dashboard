// src/components/layout/Sidebar.jsx
import React from 'react';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Lightbulb,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Wallet,
} from 'lucide-react';
import useStore from '../../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
  { id: 'insights', label: 'Insights', icon: Lightbulb },
];

const Sidebar = () => {
  const { activeTab, setActiveTab, sidebarOpen, setSidebarOpen } = useStore();

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={clsx(
          'fixed top-0 left-0 h-full z-40 flex flex-col',
          'bg-white dark:bg-surface-dark-card border-r border-slate-100 dark:border-slate-700/50',
          'transition-all duration-300',
          sidebarOpen ? 'w-64' : 'w-[72px]',
          'lg:relative lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
        initial={false}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-slate-100 dark:border-slate-700/50 flex-shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl gradient-teal flex items-center justify-center flex-shrink-0 shadow-glow">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span
                  className="font-display text-xl font-bold text-gradient whitespace-nowrap"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  FinFlow
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              title={!sidebarOpen ? label : undefined}
              className={clsx(
                'w-full text-left transition-all duration-200 group',
                'flex items-center gap-3 rounded-xl px-3 py-2.5',
                activeTab === id
                  ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-800 dark:hover:text-slate-200'
              )}
            >
              <Icon
                className={clsx(
                  'w-5 h-5 flex-shrink-0 transition-colors',
                  activeTab === id ? 'text-brand-600 dark:text-brand-400' : ''
                )}
              />
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.span
                    className="text-sm font-medium whitespace-nowrap"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
              {activeTab === id && sidebarOpen && (
                <motion.div
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-500"
                  layoutId="nav-dot"
                />
              )}
            </button>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="px-3 pb-4 border-t border-slate-100 dark:border-slate-700/50 pt-3 flex-shrink-0">
          {/* Collapse toggle (desktop) */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:flex w-full items-center justify-center gap-2 py-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all duration-200 text-sm"
            title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {sidebarOpen ? (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span className="text-xs">Collapse</span>
              </>
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
