/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { SalesTrendChart, ProfitAndExpenseChart } from "./Charts";
import { 
  FileText, TrendingUp, DollarSign, Wallet, ArrowDownRight, 
  ArrowUpRight, Download, Calendar, Sparkles, Filter 
} from "lucide-react";

export const ReportsView: React.FC = () => {
  const { invoices, expenses, collections, formatCurrency, formatNumber, t, direction } = useApp();

  const [timeframe, setTimeframe] = useState("This Month");

  // Calculate sums
  const totalInvoicedSales = invoices.reduce((sum, i) => sum + i.total, 0);
  const totalCashReceived = invoices.reduce((sum, i) => sum + i.paid, 0);
  const totalExpensesPaid = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalMilkPurchases = collections.reduce((sum, c) => sum + c.totalAmount, 0);

  const netShopProfit = totalInvoicedSales - totalExpensesPaid - totalMilkPurchases;

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            <span>Store Performance Analytics & Tax Reports</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Audit general ledgers, milk cost metrics, and monthly profit margins
          </p>
        </div>

        <div className="flex gap-2">
          <select 
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="h-10 border border-slate-200 dark:border-slate-700 rounded-xl text-xs px-3 bg-white dark:bg-slate-900 dark:text-white cursor-pointer"
          >
            <option value="Today">Today (آج)</option>
            <option value="This Week">This Week (یہ ہفتہ)</option>
            <option value="This Month">This Month (یہ مہینہ)</option>
            <option value="Quarterly">Q3 Fiscal 2026</option>
          </select>
          <button
            onClick={() => alert("Simulating PDF Statement Generation... Finished!")}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-md cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Balance Sheet</span>
          </button>
        </div>
      </div>

      {/* Main Stats Card Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <p className="text-[10px] text-gray-500 uppercase font-mono">Gross Retail Sales</p>
          <h3 className="text-lg font-black text-gray-900 dark:text-white mt-1">
            {formatCurrency(totalInvoicedSales)}
          </h3>
          <p className="text-[10px] text-emerald-500 flex items-center gap-1 mt-1 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+12.4% vs Last Month</span>
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <p className="text-[10px] text-gray-500 uppercase font-mono">Milk Supply Cost</p>
          <h3 className="text-lg font-black text-rose-500 mt-1">
            {formatCurrency(totalMilkPurchases)}
          </h3>
          <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-1">
            <span>Intake Cost Baseline</span>
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <p className="text-[10px] text-gray-500 uppercase font-mono">Operating Expenses</p>
          <h3 className="text-lg font-black text-rose-500 mt-1">
            {formatCurrency(totalExpensesPaid)}
          </h3>
          <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-1">
            <span>Rent, Salaries, Ice, Feed</span>
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <p className="text-[10px] text-gray-500 uppercase font-mono">Net Operating Profit</p>
          <h3 className={`text-lg font-black mt-1 ${netShopProfit >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
            {formatCurrency(netShopProfit)}
          </h3>
          <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-1">
            <span>Take-home shop margins</span>
          </p>
        </div>

      </div>

      {/* Recharts Graphical Visuals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="bg-white dark:bg-slate-900 p-6 border border-gray-100 dark:border-slate-800 rounded-3xl space-y-4 shadow-xs">
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Daily Outflow & Sales Cash Flows</h3>
            <p className="text-[10px] text-gray-400 mt-0.5">Tracking daily register inflows vs supplier cash payouts</p>
          </div>
          <div className="h-72">
            <SalesTrendChart />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 border border-gray-100 dark:border-slate-800 rounded-3xl space-y-4 shadow-xs">
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Store Net Profit Margins</h3>
            <p className="text-[10px] text-gray-400 mt-0.5">Shop net earnings after subtracting all logistics & dairy overheads</p>
          </div>
          <div className="h-72">
            <ProfitAndExpenseChart />
          </div>
        </div>

      </div>

      {/* Lower Details Balance Table mock */}
      <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-xs">
        <div>
          <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-widest">Lahore Store Fiscal Balance Sheet</h3>
          <p className="text-[10px] text-gray-400 mt-0.5">Detailed accounting parameters of Subhanallah Dairy</p>
        </div>

        <div className="overflow-x-auto text-xs border border-gray-100 dark:border-slate-800 rounded-xl">
          <table className="w-full min-w-[800px] text-left">
            <thead className="bg-gray-50 dark:bg-slate-950 text-gray-500 font-mono whitespace-nowrap">
              <tr>
                <th className="p-3">Account Group</th>
                <th className="p-3">Cash Ledger Parameter</th>
                <th className="p-3 text-right">Debit (Inflow)</th>
                <th className="p-3 text-right">Credit (Outflow)</th>
                <th className="p-3 text-right">Cumulative Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-gray-700 dark:text-slate-300">
              <tr className="whitespace-nowrap">
                <td className="p-3 font-semibold text-gray-900 dark:text-white">Revenue / Cash Sales</td>
                <td className="p-3">POS Counter Walk-In Sales</td>
                <td className="p-3 text-emerald-500 text-right">₨ {formatNumber(totalInvoicedSales)}</td>
                <td className="p-3 text-right">—</td>
                <td className="p-3 text-right font-bold text-emerald-500">₨ {formatNumber(totalInvoicedSales)}</td>
              </tr>
              <tr className="whitespace-nowrap">
                <td className="p-3 font-semibold text-gray-900 dark:text-white">Cost of Goods Sold (COGS)</td>
                <td className="p-3">Raw Milk Intake from Farmers</td>
                <td className="p-3 text-right">—</td>
                <td className="p-3 text-rose-500 text-right">₨ {formatNumber(totalMilkPurchases)}</td>
                <td className="p-3 text-right">₨ {formatNumber(totalInvoicedSales - totalMilkPurchases)}</td>
              </tr>
              <tr className="whitespace-nowrap">
                <td className="p-3 font-semibold text-gray-900 dark:text-white">Operating Overhead (OPEX)</td>
                <td className="p-3">Rent, Ice Blocks, Salaries, Utilities</td>
                <td className="p-3 text-right">—</td>
                <td className="p-3 text-rose-500 text-right">₨ {formatNumber(totalExpensesPaid)}</td>
                <td className="p-3 text-right font-black text-gray-900 dark:text-white">₨ {formatNumber(netShopProfit)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
