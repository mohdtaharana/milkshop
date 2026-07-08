import React from "react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, Cell, LineChart, Line
} from "recharts";
import { useApp } from "../context/AppContext";
import { BarChart3, TrendingUp, PieChart as PieChartIcon } from "lucide-react";

const COLORS = ["#14b8a6", "#3b82f6", "#f59e0b", "#ec4899", "#8b5cf6"];

interface WeeklyData { day: string; sales: number; collections: number; credit: number }
interface MonthlyData { month: string; inflow: number; outflow: number }
interface CategoryData { name: string; value: number }

const EmptyState: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <div className="flex items-center justify-center h-72 text-slate-400">
    <div className="text-center space-y-2">
      <div className="flex justify-center opacity-40">{icon}</div>
      <p className="text-xs font-medium">{label}</p>
    </div>
  </div>
);

export const SalesTrendChart: React.FC = () => {
  const { formatCurrency, theme, collections, customers } = useApp();
  const strokeColor = theme === "dark" ? "#475569" : "#e2e8f0";
  const textColor = theme === "dark" ? "#94a3b8" : "#64748b";

  if (collections.length === 0 && customers.length === 0)
    return <EmptyState icon={<BarChart3 className="w-10 h-10" />} label="No collection data yet. Record daily collections to see trends." />;

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={strokeColor} />
          <XAxis dataKey="label" stroke={textColor} style={{ fontSize: "11px" }} />
          <YAxis stroke={textColor} style={{ fontSize: "11px" }} tickFormatter={(v) => `₨ ${v / 1000}k`} />
          <Tooltip formatter={(val: number) => [formatCurrency(val), ""]}
            contentStyle={{ backgroundColor: theme === "dark" ? "#0f172a" : "#ffffff", borderColor: theme === "dark" ? "#334155" : "#e2e8f0", color: theme === "dark" ? "#f8fafc" : "#0f172a", borderRadius: "12px", fontSize: "12px" }} />
          <Area type="monotone" dataKey="total" stroke="#14b8a6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSales)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const ProfitAndExpenseChart: React.FC = () => {
  const { theme, formatCurrency, collections, expenses } = useApp();
  const strokeColor = theme === "dark" ? "#475569" : "#e2e8f0";
  const textColor = theme === "dark" ? "#94a3b8" : "#64748b";

  if (collections.length === 0 && expenses.length === 0)
    return <EmptyState icon={<TrendingUp className="w-10 h-10" />} label="No financial data. Add collections and expenses to see cash flow." />;

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={strokeColor} />
          <XAxis dataKey="label" stroke={textColor} style={{ fontSize: "11px" }} />
          <YAxis stroke={textColor} style={{ fontSize: "11px" }} tickFormatter={(v) => `₨ ${v / 1000}k`} />
          <Tooltip formatter={(val: number) => [formatCurrency(val), ""]}
            contentStyle={{ backgroundColor: theme === "dark" ? "#0f172a" : "#ffffff", borderColor: theme === "dark" ? "#334155" : "#e2e8f0", color: theme === "dark" ? "#f8fafc" : "#0f172a", borderRadius: "12px", fontSize: "12px" }} />
          <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
          <Bar dataKey="inflow" name="Revenue" fill="#14b8a6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="outflow" name="Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const ProductPieChart: React.FC = () => {
  const { theme, inventory } = useApp();
  const translatedData = inventory.length > 0
    ? Object.entries(
        inventory.reduce((acc, item) => {
          acc[item.category] = (acc[item.category] || 0) + item.currentStock;
          return acc;
        }, {} as Record<string, number>)
      )
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 8)
    : [];

  if (translatedData.length === 0)
    return <EmptyState icon={<PieChartIcon className="w-10 h-10" />} label="No inventory data. Add products to see category distribution." />;

  return (
    <div className="w-full h-64 flex flex-col justify-center">
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={translatedData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={4} dataKey="value">
              {translatedData.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(val: number) => [val, "Units"]}
              contentStyle={{ backgroundColor: theme === "dark" ? "#0f172a" : "#ffffff", borderColor: theme === "dark" ? "#334155" : "#e2e8f0", color: theme === "dark" ? "#f8fafc" : "#0f172a", borderRadius: "12px", fontSize: "11px" }} />
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
  const { theme, formatCurrency, collections, expenses } = useApp();
  const strokeColor = theme === "dark" ? "#475569" : "#e2e8f0";
  const textColor = theme === "dark" ? "#94a3b8" : "#64748b";

  if (collections.length === 0 && expenses.length === 0)
    return <EmptyState icon={<TrendingUp className="w-10 h-10" />} label="No data yet. Record transactions to view cash flow trends." />;

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={strokeColor} />
          <XAxis dataKey="label" stroke={textColor} style={{ fontSize: "11px" }} />
          <YAxis stroke={textColor} style={{ fontSize: "11px" }} tickFormatter={(v) => `₨ ${v / 1000}k`} />
          <Tooltip formatter={(val: number) => [formatCurrency(val), ""]}
            contentStyle={{ backgroundColor: theme === "dark" ? "#0f172a" : "#ffffff", borderColor: theme === "dark" ? "#334155" : "#e2e8f0", color: theme === "dark" ? "#f8fafc" : "#0f172a", borderRadius: "12px", fontSize: "12px" }} />
          <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
          <Line type="monotone" dataKey="inflow" name="Cash In" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          <Line type="monotone" dataKey="outflow" name="Cash Out" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
