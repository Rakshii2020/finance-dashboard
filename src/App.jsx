// src/App.jsx
// Root application component — wires together layout, pages, and modal

import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import useStore from './store/useStore';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import TransactionModal from './components/modals/TransactionModal';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Insights from './pages/Insights';

// Page registry
const PAGES = {
  dashboard: Dashboard,
  transactions: Transactions,
  insights: Insights,
};

function App() {
  const { darkMode, activeTab } = useStore();

  // Sync dark mode class on <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const ActivePage = PAGES[activeTab] || Dashboard;

  return (
    <div className="flex h-screen overflow-hidden bg-surface-light dark:bg-surface-dark transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top header bar */}
        <Header />

        {/* Scrollable page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6 max-w-[1600px] mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
              >
                <ActivePage />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Global transaction modal (add/edit) */}
      <TransactionModal />
    </div>
  );
}

export default App;
