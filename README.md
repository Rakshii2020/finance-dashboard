# FinFlow — Finance Dashboard

> A premium, production-quality finance dashboard built with React, Tailwind CSS, Recharts, Zustand, and Framer Motion.

## ✨ Features

| Feature | Details |
|---|---|
| **Dashboard** | Summary stat cards, area chart, donut chart, recent transactions, monthly breakdown |
| **Transactions** | Searchable/filterable/sortable table with full CRUD |
| **Role-Based UI** | Admin (CRUD) vs Viewer (read-only) with live switcher |
| **Insights** | 6 smart insight cards, monthly bar chart, category rankings |
| **Dark Mode** | Full dark theme persisted to localStorage |
| **Animations** | Framer Motion throughout — page transitions, micro-interactions |
| **Export CSV** | Exports currently-filtered transaction view |
| **Responsive** | Mobile, tablet, desktop — collapsible sidebar |

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| UI | React 18 + Tailwind CSS |
| Charts | Recharts |
| State | Zustand + persist middleware |
| Animations | Framer Motion |
| Icons | Lucide React |
| Fonts | Syne + DM Sans |

## 🚀 Setup

```bash
npx create-react-app finance-dashboard
cd finance-dashboard
npm install recharts framer-motion zustand lucide-react date-fns clsx
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
# Copy all project files into place
npm start
```

## 🌐 Deploy

**Vercel:** `npm run build` → `vercel --prod`  
**Netlify:** `npm run build` → drag `/build` to app.netlify.com/drop

## 📁 Structure

```
src/
├── App.jsx                    # Root layout + dark mode
├── store/useStore.js          # Zustand global store
├── data/mockData.js           # 6-month mock transactions
├── utils/helpers.js           # Currency, date, CSV utilities
├── components/
│   ├── layout/                # Sidebar, Header
│   ├── ui/                    # StatCard, EmptyState
│   ├── charts/                # BalanceTrendChart, CategoryDonutChart
│   ├── transactions/          # TransactionTable, FilterBar
│   └── modals/                # TransactionModal (add/edit)
└── pages/                     # Dashboard, Transactions, Insights
```

## 🏗 Architecture

- **Zustand store** — single source of truth, `persist` middleware syncs to localStorage
- **Computed getters** — `getFilteredTransactions()` and `getSummary()` derive data on demand
- **Role-based rendering** — `role` field controls visibility of CRUD UI elements
- **Mock data** — realistic 6-month transaction history with ±15% amount variance

## 📋 Assignment Requirements

All requirements implemented: summary cards ✅ | line chart ✅ | donut chart ✅ | transaction table ✅ | search ✅ | filter ✅ | sort ✅ | role switcher ✅ | admin CRUD ✅ | viewer read-only ✅ | insights ✅ | dark mode ✅ | localStorage ✅ | Framer Motion ✅ | modal ✅ | CSV export ✅ | responsive ✅ | empty states ✅

---
MIT License
