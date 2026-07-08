/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, Cell, LineChart, Line
} from "recharts";
import { useApp } from "../context/AppContext";

// Mock Data for Charts
const dailySalesTrend = [
  { day: "Mon", sales: 125000, collections: 85000, credit: 40000 },
  { day: "Tue", sales: 145000, collections: 95000, credit: 50000 },
  { day: "Wed", sales: 132000, collections: 110000, credit: 22000 },
  { day: "Thu", sales: 165000, collections: 115000, credit: 50000 },
  { day: "Fri", sales: 158000, collections: 120000, credit: 38000 },
  { day: "Sat", sales: 185000, collections: 130000, credit: 55000 },
  { day: "Sun", sales: 195000, collections: 140000, credit: 55000 }
];

const categorySales = [
  { name: "Buffalo Milk", value: 45 },
  { name: "Yogurt", value: 25 },
  { name: "Desi Ghee", value: 15 },
  { name: "Fresh Cream", value: 8 },
  { name: "White Butter", value: 7 }
];

const COLORS = ["#14b8a6", "#3b82f6", "#f59e0b", "#ec4899", "#8b5cf6"];

const monthlyCashFlow = [
  { month: "Jan", inflow: 850000, outflow: 710000 },
  { month: "Feb", inflow: 980000, outflow: 800000 },
  { month: "Mar", inflow: 1150000, outflow: 910000 },
  { month: "Apr", inflow: 1250000, outflow: 1050000 },
  { month: "May", inflow: 1420000, outflow: 1180000 },
  { month: "Jun", inflow: 1650000, outflow: 1350000 }
];

export const SalesTrendChart: React.FC = () => {
  const { formatCurrency, theme, t } = useApp();
  const strokeColor = theme === "dark" ? "#475569" : "#e2e8f0";
  const textColor = theme === "dark" ? "#94a3b8" : "#64748b";

  const translatedData = dailySalesTrend.map(d => ({
    ...d,
    day: t(d.day)
  }));

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={translatedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorCredit" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={strokeColor} />
          <XAxis dataKey="day" stroke={textColor} style={{ fontSize: "11px" }} />
          <YAxis 
            stroke={textColor} 
            style={{ fontSize: "11px" }} 
            tickFormatter={(v) => `₨ ${v / 1000}k`}
          />
          <Tooltip 
            formatter={(val: number) => [formatCurrency(val), ""]}
            contentStyle={{ 
              backgroundColor: theme === "dark" ? "#0f172a" : "#ffffff", 
              borderColor: theme === "dark" ? "#334155" : "#e2e8f0",
              color: theme === "dark" ? "#f8fafc" : "#0f172a",
              borderRadius: "12px",
              fontSize: "12px"
            }} 
          />
          <Area type="monotone" dataKey="sales" name={t("Sales")} stroke="#14b8a6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSales)" />
          <Area type="monotone" dataKey="credit" name={t("Credit (Khata)")} stroke="#f59e0b" strokeWidth={1.5} fillOpacity={1} fill="url(#colorCredit)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const ProfitAndExpenseChart: React.FC = () => {
  const { theme, formatCurrency, t } = useApp();
  const strokeColor = theme === "dark" ? "#475569" : "#e2e8f0";
  const textColor = theme === "dark" ? "#94a3b8" : "#64748b";

  const translatedData = monthlyCashFlow.map(m => ({
    ...m,
    month: t(m.month)
  }));

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={translatedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={strokeColor} />
          <XAxis dataKey="month" stroke={textColor} style={{ fontSize: "11px" }} />
          <YAxis 
            stroke={textColor} 
            style={{ fontSize: "11px" }} 
            tickFormatter={(v) => `₨ ${v / 1000}k`}
          />
          <Tooltip 
            formatter={(val: number) => [formatCurrency(val), ""]}
            contentStyle={{ 
              backgroundColor: theme === "dark" ? "#0f172a" : "#ffffff", 
              borderColor: theme === "dark" ? "#334155" : "#e2e8f0",
              color: theme === "dark" ? "#f8fafc" : "#0f172a",
              borderRadius: "12px",
              fontSize: "12px"
            }} 
          />
          <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
          <Bar dataKey="inflow" name={t("Inflow Revenue")} fill="#14b8a6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="outflow" name={t("Expenses & Purchases")} fill="#f43f5e" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const ProductPieChart: React.FC = () => {
  const { theme, t } = useApp();

  const translatedData = categorySales.map(c => ({
    ...c,
    name: t(c.name)
  }));
  
  return (
    <div className="w-full h-64 flex flex-col justify-center">
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={translatedData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={75}
              paddingAngle={4}
              dataKey="value"
            >
              {translatedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(val: number) => [`${val}%`, ""]}
              contentStyle={{ 
                backgroundColor: theme === "dark" ? "#0f172a" : "#ffffff", 
                borderColor: theme === "dark" ? "#334155" : "#e2e8f0",
                color: theme === "dark" ? "#f8fafc" : "#0f172a",
                borderRadius: "12px",
                fontSize: "11px"
              }} 
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-3 gap-2 px-4">
        {translatedData.map((entry, index) => (
          <div key={entry.name} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
            <span className="text-[10px] text-gray-500 dark:text-slate-400 font-medium truncate">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const CashFlowLineChart: React.FC = () => {
  const { theme, formatCurrency, t } = useApp();
  const strokeColor = theme === "dark" ? "#475569" : "#e2e8f0";
  const textColor = theme === "dark" ? "#94a3b8" : "#64748b";

  const translatedData = monthlyCashFlow.map(m => ({
    ...m,
    month: t(m.month)
  }));

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={translatedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={strokeColor} />
          <XAxis dataKey="month" stroke={textColor} style={{ fontSize: "11px" }} />
          <YAxis 
            stroke={textColor} 
            style={{ fontSize: "11px" }} 
            tickFormatter={(v) => `₨ ${v / 1000}k`}
          />
          <Tooltip 
            formatter={(val: number) => [formatCurrency(val), ""]}
            contentStyle={{ 
              backgroundColor: theme === "dark" ? "#0f172a" : "#ffffff", 
              borderColor: theme === "dark" ? "#334155" : "#e2e8f0",
              color: theme === "dark" ? "#f8fafc" : "#0f172a",
              borderRadius: "12px",
              fontSize: "12px"
            }} 
          />
          <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
          <Line type="monotone" dataKey="inflow" name={t("Cash In")} stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          <Line type="monotone" dataKey="outflow" name={t("Cash Out")} stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
