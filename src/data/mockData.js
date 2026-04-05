// src/data/mockData.js
// Comprehensive mock financial data for the dashboard

export const CATEGORIES = {
  income: [
    { id: 'salary', label: 'Salary', icon: '💼', color: '#10b981' },
    { id: 'freelance', label: 'Freelance', icon: '💻', color: '#0ea5e9' },
    { id: 'investments', label: 'Investments', icon: '📈', color: '#8b5cf6' },
    { id: 'rental', label: 'Rental Income', icon: '🏠', color: '#f59e0b' },
    { id: 'bonus', label: 'Bonus', icon: '🎁', color: '#14b8a6' },
    { id: 'other_income', label: 'Other Income', icon: '💰', color: '#6366f1' },
  ],
  expense: [
    { id: 'food', label: 'Food & Dining', icon: '🍔', color: '#f43f5e' },
    { id: 'transport', label: 'Transport', icon: '🚗', color: '#f97316' },
    { id: 'shopping', label: 'Shopping', icon: '🛍️', color: '#8b5cf6' },
    { id: 'utilities', label: 'Utilities', icon: '⚡', color: '#0ea5e9' },
    { id: 'entertainment', label: 'Entertainment', icon: '🎬', color: '#ec4899' },
    { id: 'health', label: 'Health', icon: '🏥', color: '#10b981' },
    { id: 'education', label: 'Education', icon: '📚', color: '#f59e0b' },
    { id: 'rent', label: 'Rent', icon: '🏠', color: '#14b8a6' },
    { id: 'subscriptions', label: 'Subscriptions', icon: '📱', color: '#6366f1' },
    { id: 'other_expense', label: 'Other', icon: '💸', color: '#94a3b8' },
  ],
};

export const ALL_CATEGORIES = [...CATEGORIES.income, ...CATEGORIES.expense];

export const getCategoryById = (id) =>
  ALL_CATEGORIES.find((c) => c.id === id) || { id, label: id, icon: '💳', color: '#94a3b8' };

// Generate realistic transactions for the last 6 months
const generateTransactions = () => {
  const now = new Date();
  const transactions = [];
  let id = 1;

  const incomeTemplates = [
    { description: 'Monthly Salary', amount: 85000, category: 'salary', type: 'income', recurring: true },
    { description: 'Freelance Project - React Dashboard', amount: 25000, category: 'freelance', type: 'income' },
    { description: 'Freelance - API Integration', amount: 18000, category: 'freelance', type: 'income' },
    { description: 'Stock Dividends', amount: 4500, category: 'investments', type: 'income' },
    { description: 'Apartment Rental Income', amount: 15000, category: 'rental', type: 'income' },
    { description: 'Annual Performance Bonus', amount: 40000, category: 'bonus', type: 'income' },
    { description: 'Mutual Fund Returns', amount: 6800, category: 'investments', type: 'income' },
    { description: 'Consulting Fee', amount: 12000, category: 'freelance', type: 'income' },
    { description: 'Referral Bonus', amount: 3000, category: 'other_income', type: 'income' },
  ];

  const expenseTemplates = [
    { description: 'Monthly Rent', amount: 22000, category: 'rent', type: 'expense', recurring: true },
    { description: 'Grocery Shopping - BigBasket', amount: 4200, category: 'food', type: 'expense' },
    { description: 'Dinner at Trattoria', amount: 2800, category: 'food', type: 'expense' },
    { description: 'Uber/Ola Monthly', amount: 3500, category: 'transport', type: 'expense' },
    { description: 'Petrol', amount: 2200, category: 'transport', type: 'expense' },
    { description: 'Myntra Shopping Haul', amount: 5600, category: 'shopping', type: 'expense' },
    { description: 'Amazon Purchase', amount: 3200, category: 'shopping', type: 'expense' },
    { description: 'Electricity Bill', amount: 1800, category: 'utilities', type: 'expense' },
    { description: 'Internet & Mobile Bills', amount: 1200, category: 'utilities', type: 'expense' },
    { description: 'Netflix + Spotify', amount: 800, category: 'subscriptions', type: 'expense' },
    { description: 'Movie Tickets', amount: 1200, category: 'entertainment', type: 'expense' },
    { description: 'Doctor Consultation', amount: 800, category: 'health', type: 'expense' },
    { description: 'Gym Membership', amount: 2000, category: 'health', type: 'expense' },
    { description: 'Udemy Courses', amount: 1500, category: 'education', type: 'expense' },
    { description: 'Weekend Getaway', amount: 8500, category: 'entertainment', type: 'expense' },
    { description: 'New Laptop Accessories', amount: 4500, category: 'shopping', type: 'expense' },
    { description: 'Restaurant - Team Lunch', amount: 3200, category: 'food', type: 'expense' },
    { description: 'Pharmacy', amount: 600, category: 'health', type: 'expense' },
    { description: 'Book Purchase', amount: 900, category: 'education', type: 'expense' },
    { description: 'Water & Gas Bill', amount: 700, category: 'utilities', type: 'expense' },
    { description: 'Zomato Orders', amount: 2600, category: 'food', type: 'expense' },
    { description: 'Adobe Creative Suite', amount: 2400, category: 'subscriptions', type: 'expense' },
    { description: 'Gaming - Steam', amount: 1800, category: 'entertainment', type: 'expense' },
    { description: 'Clothes Shopping', amount: 7200, category: 'shopping', type: 'expense' },
  ];

  // Generate for last 6 months
  for (let monthOffset = 5; monthOffset >= 0; monthOffset--) {
    const targetDate = new Date(now.getFullYear(), now.getMonth() - monthOffset, 1);
    const daysInMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0).getDate();

    // Add salary (recurring)
    const salaryDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
    transactions.push({
      id: String(id++),
      description: 'Monthly Salary',
      amount: 85000,
      category: 'salary',
      type: 'income',
      date: salaryDate.toISOString().split('T')[0],
    });

    // Add rent (recurring)
    const rentDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), 5);
    transactions.push({
      id: String(id++),
      description: 'Monthly Rent',
      amount: 22000,
      category: 'rent',
      type: 'expense',
      date: rentDate.toISOString().split('T')[0],
    });

    // Add 8–14 random transactions per month
    const nonRecurring = [
      ...incomeTemplates.filter((t) => !t.recurring),
      ...expenseTemplates.filter((t) => !t.recurring),
    ];

    const count = 8 + Math.floor(Math.random() * 7);
    const selected = [...nonRecurring].sort(() => Math.random() - 0.5).slice(0, count);

    selected.forEach((template) => {
      const day = 2 + Math.floor(Math.random() * (daysInMonth - 2));
      const date = new Date(targetDate.getFullYear(), targetDate.getMonth(), day);
      // Add ±15% variance to amounts
      const variance = 0.85 + Math.random() * 0.3;
      const amount = Math.round(template.amount * variance);

      transactions.push({
        id: String(id++),
        description: template.description,
        amount,
        category: template.category,
        type: template.type,
        date: date.toISOString().split('T')[0],
      });
    });
  }

  // Sort by date descending
  return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const INITIAL_TRANSACTIONS = generateTransactions();

// Compute monthly summary for charts
export const computeMonthlyData = (transactions) => {
  const months = {};

  transactions.forEach((t) => {
    const d = new Date(t.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });

    if (!months[key]) months[key] = { key, label, income: 0, expense: 0, balance: 0 };

    if (t.type === 'income') months[key].income += t.amount;
    else months[key].expense += t.amount;
  });

  return Object.values(months)
    .sort((a, b) => a.key.localeCompare(b.key))
    .map((m) => ({ ...m, balance: m.income - m.expense }));
};

// Compute category spending breakdown
export const computeCategorySpending = (transactions) => {
  const spending = {};

  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      if (!spending[t.category]) spending[t.category] = 0;
      spending[t.category] += t.amount;
    });

  return Object.entries(spending)
    .map(([catId, amount]) => {
      const cat = getCategoryById(catId);
      return { id: catId, label: cat.label, icon: cat.icon, color: cat.color, amount };
    })
    .sort((a, b) => b.amount - a.amount);
};
