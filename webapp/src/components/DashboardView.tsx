/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from "react";
import { useApp } from "../context/AppContext";
import { 
  SalesTrendChart, ProfitAndExpenseChart, ProductPieChart, CashFlowLineChart 
} from "./Charts";
import { 
  TrendingUp, Activity, AlertCircle, ShoppingBag, 
  Users, Milk, Truck, CheckSquare, Plus, X
} from "lucide-react";
import { Link } from "react-router-dom";

type Task = { id: number; text: string; done: boolean };
const STORAGE_KEY = "milkop_checklist";

function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [
      { id: 1, text: "Verify morning milk density", done: false },
      { id: 2, text: "Check inventory levels", done: false },
    ];
  } catch { return []; }
}

function saveTasks(tasks: Task[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export const DashboardView: React.FC = () => {
  const { 
    t, formatCurrency, formatNumber, role,
    customers, suppliers, collections, inventory, expenses
  } = useApp();

  const [tasks, setTasks] = useState<Task[]>(loadTasks);
  const [newTaskText, setNewTaskText] = useState("");

  useEffect(() => { saveTasks(tasks); }, [tasks]);

  const toggleTask = useCallback((id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  }, []);

  const addTask = useCallback(() => {
    const text = newTaskText.trim();
    if (!text) return;
    setTasks(prev => [...prev, { id: Date.now(), text, done: false }]);
    setNewTaskText("");
  }, [newTaskText]);

  const deleteTask = useCallback((id: number) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  // Calculations for real-time KPIs
  const milkPurchasedQty = collections.reduce((sum, col) => sum + col.quantity, 0);
  const totalCollectionAmount = collections.reduce((sum, col) => sum + col.totalAmount, 0);

  const totalCustomerReceivables = customers.reduce((sum, c) => sum + (c.remainingBalance > 0 ? c.remainingBalance : 0), 0);
  const totalSupplierPayables = suppliers.reduce((sum, s) => sum + s.outstandingBalance, 0);

  const lowStockCount = inventory.filter(i => i.currentStock <= i.minStock).length;
  const remainingMilkStock = inventory
    .filter(i => i.category === "Milk")
    .reduce((sum, i) => sum + i.currentStock, 0);

  return (
    <div className="space-y-6">
      
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
            to="/customers" 
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all backdrop-blur-md border border-white/10 cursor-pointer"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Customers</span>
          </Link>
        </div>
      </div>

      {/* KPI Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Customers Card */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t("customers")}</span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white font-sans">{formatNumber(customers.length)}</h3>
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold flex items-center gap-0.5 bg-blue-50 dark:bg-blue-950/20 px-2 py-0.5 rounded-full w-fit">
              <Users className="w-3 h-3" /> Active
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Collection Card */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t("milkPurchasedToday")}</span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white font-sans">{formatNumber(milkPurchasedQty)} <span className="text-xs font-normal text-slate-500">Ltr</span></h3>
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold flex items-center gap-0.5 bg-blue-50 dark:bg-blue-950/20 px-2 py-0.5 rounded-full w-fit">
              <TrendingUp className="w-3 h-3" /> Total: {formatCurrency(totalCollectionAmount)}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
            <Milk className="w-6 h-6" />
          </div>
        </div>

        {/* Receivables Card */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t("customerBalanceTotal")}</span>
            <h3 className="text-2xl font-black text-rose-600 dark:text-rose-400 font-sans">{formatCurrency(totalCustomerReceivables)}</h3>
            <span className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold bg-rose-50 dark:bg-rose-950/20 px-2 py-0.5 rounded-full w-fit">Receivable</span>
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

      {/* Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Task List */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm lg:col-span-2">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Activity className="w-4 h-4 text-blue-600" />
            <span>{t("recentActivity")}</span>
          </h3>
          <p className="text-xs text-slate-400 text-center py-8">Activity log will appear here as you work.</p>
        </div>

        {/* Operator Checklist */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-3">
            <CheckSquare className="w-4 h-4 text-blue-600" />
            <span>Operator Checklists</span>
          </h3>
          {/* Add Task Input */}
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTask()}
              placeholder="Add new task..."
              className="flex-1 h-9 px-3 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white"
            />
            <button
              onClick={addTask}
              className="h-9 w-9 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-xl cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2.5">
            {tasks.map((task) => (
              <div 
                key={task.id} 
                className="flex items-center gap-2 group"
              >
                <div 
                  onClick={() => toggleTask(task.id)}
                  className={`flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 dark:border-slate-950 bg-slate-50 dark:bg-slate-950/30 hover:bg-slate-100 dark:hover:bg-slate-950 transition-all cursor-pointer flex-1`}
                >
                  <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all shrink-0
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
                <button
                  onClick={() => deleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-rose-400 transition-all cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
