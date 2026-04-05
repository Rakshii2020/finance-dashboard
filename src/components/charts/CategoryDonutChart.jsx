// src/components/charts/CategoryDonutChart.jsx
import React, { useState } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Sector } from 'recharts';
import { motion } from 'framer-motion';
import { computeCategorySpending } from '../../data/mockData';
import { formatCurrency } from '../../utils/helpers';
import useStore from '../../store/useStore';

const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 4}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        opacity={0.9}
      />
    </g>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value, payload: d } = payload[0];
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl shadow-xl p-3 text-sm">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-base">{d.icon}</span>
        <span className="font-semibold text-slate-700 dark:text-slate-200">{name}</span>
      </div>
      <div className="font-mono font-bold text-slate-800 dark:text-white">{formatCurrency(value)}</div>
      <div className="text-xs text-slate-400 dark:text-slate-500">{d.percentage?.toFixed(1)}% of total</div>
    </div>
  );
};

const CategoryDonutChart = () => {
  const { transactions } = useStore();
  const [activeIndex, setActiveIndex] = useState(null);

  const rawData = computeCategorySpending(transactions);
  const total = rawData.reduce((s, d) => s + d.amount, 0);
  const data = rawData.slice(0, 8).map((d) => ({
    ...d,
    name: d.label,
    value: d.amount,
    percentage: (d.amount / total) * 100,
  }));

  return (
    <motion.div
      className="card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="mb-6">
        <h2 className="font-display text-base font-bold text-slate-800 dark:text-white">
          Spending by Category
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Where your money goes</p>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-6">
        {/* Donut chart */}
        <div className="relative flex-shrink-0">
          <ResponsiveContainer width={200} height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                onMouseEnter={(_, idx) => setActiveIndex(idx)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {data.map((entry, index) => (
                  <Cell key={entry.id} fill={entry.color} opacity={activeIndex === null || activeIndex === index ? 1 : 0.5} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="text-xs text-slate-500 dark:text-slate-400">Total</div>
            <div className="font-display text-base font-bold text-slate-800 dark:text-white tabular-nums">
              {formatCurrency(total, true)}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 w-full space-y-2">
          {data.map((item, idx) => (
            <div
              key={item.id}
              className="flex items-center gap-3 group cursor-default"
              onMouseEnter={() => setActiveIndex(idx)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0 transition-transform group-hover:scale-125"
                style={{ background: item.color }}
              />
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300 flex-1 truncate">
                {item.icon} {item.label}
              </span>
              <div className="text-right flex-shrink-0">
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-200 tabular-nums">
                  {formatCurrency(item.value, true)}
                </div>
                <div className="text-[10px] text-slate-400 dark:text-slate-500">
                  {item.percentage.toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CategoryDonutChart;
