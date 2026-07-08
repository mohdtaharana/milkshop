/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { 
  SalesTrendChart, ProfitAndExpenseChart, ProductPieChart, CashFlowLineChart 
} from "./Charts";
import { 
  TrendingUp, TrendingDown, DollarSign, Activity, AlertCircle, ShoppingBag, 
  Users, Milk, FileText, ChevronRight, Truck, CheckSquare, Plus, ArrowUpRight
} from "lucide-react";
import { Link } from "react-router-dom";

export const DashboardView: React.FC = () => {
  const { 
    t, formatCurrency, formatNumber, role,
    customers, suppliers, collections, inventory, invoices, expenses, auditLogs
  } = useApp();

  // Tasks mock list
  const [tasks, setTasks] = useState([
    { id: 1, text: "Verify morning milk density from Kasur Route", done: true },
    { id: 2, text: "Print Gourmet Sweets weekly ledger statement", done: false },
    { id: 3, text: "Refuel Suzuki Loader (LES-1232)", done: false },
    { id: 4, text: "Inspect cold temperature for deep chiller #2", done: true }
  ]);

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  // Calculations for real-time KPIs based on mock database state
  const totalSalesToday = invoices
    .filter(inv => inv.status !== "Cancelled")
    .reduce((sum, inv) => sum + inv.total, 0);

  const totalCreditToday = invoices
    .filter(inv => inv.status === "Unpaid" || inv.status === "Partially Paid")
    .reduce((sum, inv) => sum + inv.remaining, 0);

  const milkPurchasedQty = collections.reduce((sum, col) => sum + col.quantity, 0);
  const milkSoldQty = invoices
    .filter(inv => inv.status !== "Cancelled")
    .reduce((sum, inv) => sum + inv.milkQuantity, 0);

  const totalCustomerReceivables = customers.reduce((sum, c) => sum + (c.remainingBalance > 0 ? c.remainingBalance : 0), 0);
  const totalSupplierPayables = suppliers.reduce((sum, s) => sum + s.outstandingBalance, 0);

  const lowStockCount = inventory.filter(i => i.currentStock <= i.minStock).length;
  const remainingMilkStock = inventory
    .filter(i => i.category === "Milk")
    .reduce((sum, i) => sum + i.currentStock, 0);

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Upper Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-linear-to-r from-slate-900 to-blue-950 p-6 rounded-3xl text-white shadow-xl border border-blue-500/20">
        <div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-2">
            <span>{t("appName")}</span> 
            <span className="text-blue-400 font-sans font-light">ERP</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            Assalamu Alaikum! Welcome to the unified registration system. Modern, secure, and register-free.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link 
            to="/collection" 
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-md shadow-blue-500/25 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Milk</span>
          </Link>
          <Link 
            to="/sales" 
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all backdrop-blur-md border border-white/10 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Quick Bill</span>
          </Link>
        </div>
      </div>

      {/* KPI Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Sales Card */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t("todaySales")}</span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white font-sans">{formatCurrency(totalSalesToday)}</h3>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full w-fit">
              <TrendingUp className="w-3 h-3" /> +12.5% vs yesterday
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Collection Card */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t("milkPurchasedToday")}</span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white font-sans">{formatNumber(milkPurchasedQty)} <span className="text-xs font-normal text-slate-500">Ltr</span></h3>
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold flex items-center gap-0.5 bg-blue-50 dark:bg-blue-950/20 px-2 py-0.5 rounded-full w-fit">
              <TrendingUp className="w-3 h-3" /> Fat Avg: 5.6%
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
            <Milk className="w-6 h-6" />
          </div>
        </div>

        {/* Credit Card */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t("todayCredit")}</span>
            <h3 className="text-2xl font-black text-rose-600 dark:text-rose-400 font-sans">{formatCurrency(totalCreditToday)}</h3>
            <span className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold bg-rose-50 dark:bg-rose-950/20 px-2 py-0.5 rounded-full w-fit">To be collected next cycle</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center text-rose-500">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

        {/* Milk Stock Card */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t("remainingStock")}</span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white font-sans">{formatNumber(remainingMilkStock)} <span className="text-xs font-normal text-slate-500">Ltr</span></h3>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded-full w-fit">
              Low Stock Items: {lowStockCount}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-500">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Receivables & Payables Ledger Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-linear-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-blue-950/30 p-5 rounded-2xl border border-blue-200/80 dark:border-blue-900/30 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-xs font-bold text-blue-700 dark:text-blue-400">{t("customerBalanceTotal")}</span>
            <h4 className="text-2xl font-black text-blue-900 dark:text-white font-sans">{formatCurrency(totalCustomerReceivables)}</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Receivable active balances across customer khatas</p>
          </div>
          <Users className="w-10 h-10 text-blue-500/20" />
        </div>

        <div className="bg-linear-to-r from-rose-50 to-orange-50 dark:from-slate-900 dark:to-rose-950/30 p-5 rounded-2xl border border-rose-200/80 dark:border-rose-900/30 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-xs font-bold text-rose-700 dark:text-rose-400">{t("supplierBalanceTotal")}</span>
            <h4 className="text-2xl font-black text-rose-900 dark:text-white font-sans">{formatCurrency(totalSupplierPayables)}</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Outstandings due to suppliers for milk purchases</p>
          </div>
          <Truck className="w-10 h-10 text-rose-500/20" />
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sales Trend Chart (Large Area Chart) */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">Weekly Business Trend</h3>
              <p className="text-xs text-slate-400">Sales revenue versus customer credit logs</p>
            </div>
            <span className="text-[10px] font-mono bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-full uppercase font-bold">
              Live
            </span>
          </div>
          <SalesTrendChart />
        </div>

        {/* Product Sales Share (Pie Chart) */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">Product Share</h3>
              <p className="text-xs text-slate-400">Sales percentage distribution</p>
            </div>
          </div>
          <ProductPieChart />
        </div>

      </div>

      {/* Secondary Charts Block (Admin Only) */}
      {role === "Admin" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Cash Inflow vs Outflow</h3>
            <ProfitAndExpenseChart />
          </div>
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Monthly Liquid Liquidity</h3>
            <CashFlowLineChart />
          </div>
        </div>
      )}

      {/* Recent Activities & Tasks Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Activity (Timeline) */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm lg:col-span-2">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Activity className="w-4 h-4 text-blue-600" />
            <span>{t("recentActivity")}</span>
          </h3>
          <div className="space-y-4">
            {auditLogs.slice(0, 4).map((log, idx) => (
              <div key={log.id} className="flex gap-3 relative">
                {idx !== 3 && (
                  <span className="absolute top-5 left-2.5 bottom-0 w-0.5 bg-slate-100 dark:bg-slate-800" />
                )}
                <div className="w-5 h-5 rounded-full bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-[10px] text-blue-600 font-bold z-10">
                  {idx + 1}
                </div>
                <div className="flex-1 text-xs">
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-slate-800 dark:text-slate-200">{log.action}</p>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    By <span className="font-semibold text-slate-700 dark:text-slate-300">{log.user}</span> ({log.role}) • IP: {log.ipAddress}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-3">
            <CheckSquare className="w-4 h-4 text-blue-600" />
            <span>Operator Checklists</span>
          </h3>
          <div className="space-y-2.5">
            {tasks.map((task) => (
              <div 
                key={task.id} 
                onClick={() => toggleTask(task.id)}
                className={`flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 dark:border-slate-950 bg-slate-50 dark:bg-slate-950/30 hover:bg-slate-100 dark:hover:bg-slate-950 transition-all cursor-pointer`}
              >
                <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all
                  ${task.done 
                    ? "bg-blue-600 border-blue-600 text-white" 
                    : "border-slate-300 dark:border-slate-700"
                  }
                `}>
                  {task.done && <span className="text-[9px] font-bold">✓</span>}
                </div>
                <span className={`text-xs ${task.done ? "line-through text-slate-400 dark:text-slate-500" : "text-slate-700 dark:text-slate-300"}`}>
                  {task.text}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
