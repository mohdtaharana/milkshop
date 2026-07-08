/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Expense } from "../types";
import { Plus, Search, Landmark, Receipt, Calendar, Trash2, Tag, DollarSign, Wallet, FileSpreadsheet, CheckCircle2, Flame, Sparkles, X } from "lucide-react";

export const ExpensesView: React.FC = () => {
  const { expenses, addExpense, deleteExpense, formatCurrency, formatNumber, t, direction } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Form Fields
  const [amount, setAmount] = useState<number>(0);
  const [category, setCategory] = useState<Expense["category"]>("Rent");
  const [desc, setDesc] = useState("");
  const [approvedBy, setApprovedBy] = useState("Admin Haji Sb");
  const [refNo, setRefNo] = useState("");
  const [formError, setFormError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (amount <= 0 || !desc.trim()) {
      setFormError("Expense Amount and Description are required.");
      return;
    }

    addExpense({
      amount: Number(amount),
      category,
      description: desc,
      approvedBy,
      referenceNo: refNo || "CASH-VOUCH"
    });

    setAmount(0);
    setDesc("");
    setRefNo("");
    setShowAddModal(false);
    alert(t("successRecord"));
  };

  const filteredExpenses = expenses.filter(exp => {
    const matchesSearch = (exp.description || "").toLowerCase().includes((searchQuery || "").toLowerCase()) || 
                          (exp.approvedBy || "").toLowerCase().includes((searchQuery || "").toLowerCase());
    const matchesCategory = categoryFilter === "All" || exp.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalExpenseSum = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Receipt className="w-6 h-6 text-blue-600" />
            <span>Store Expense & Ledger Voucher Register</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Log raw logistics costs, electricity bills, worker feed, salaries, and ice-block refrigeration expenses
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-md shadow-blue-500/25 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t("addExpense")}</span>
        </button>
      </div>

      {/* KPI blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-mono">Total Logged Expenses</p>
            <h4 className="text-sm font-extrabold text-rose-500">
              {formatCurrency(expenses.reduce((sum, e) => sum + e.amount, 0))}
            </h4>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-mono">Active Cost Centers</p>
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Samanabad Shop, Lahore
            </h4>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-mono">Top Category Expense</p>
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Utility Bills / Rent
            </h4>
          </div>
        </div>

      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        
        {/* Filters */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-3 justify-between items-center bg-slate-50/50 dark:bg-slate-950/10">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute top-3 left-3" />
            <input 
              type="text" 
              placeholder="Search expenses by voucher / author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 border border-slate-200 dark:border-slate-700 pl-9 pr-4 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:bg-slate-950 dark:text-white"
            />
          </div>

          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-10 border border-gray-200 dark:border-slate-700 rounded-xl text-xs px-3 bg-white dark:bg-slate-950 dark:text-white cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="Rent">Rent (دکان کا کرایہ)</option>
            <option value="Utility Bills">Utility Bills (بجلی پانی بل)</option>
            <option value="Feed / Chara">Feed / Chara (بھینس کا چارہ)</option>
            <option value="Fuel / Transport">Fuel / Transport (ٹرانسپورٹ خرچہ)</option>
            <option value="Repair & Maintenance">Repair & Maintenance (مرمت دکان)</option>
            <option value="Salaries">Worker Salaries (ملازموں کی تنخواہ)</option>
            <option value="Packaging Materials">Packaging Materials</option>
            <option value="Ice Blocks">Ice blocks (برف کا خرچہ)</option>
            <option value="Tea / Entertainment">Tea & Food (چائے روٹی خرچہ)</option>
            <option value="Others">Others</option>
          </select>
        </div>

        {/* Expense list */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="border-b border-gray-100 dark:border-slate-800 text-gray-500 font-mono text-xs uppercase bg-gray-50/40 dark:bg-slate-950/20 whitespace-nowrap">
                <th className="p-4">Voucher Reference</th>
                <th className="p-4">Cost Category</th>
                <th className="p-4">Detailed Description</th>
                <th className="p-4">Date Logged</th>
                <th className="p-4">Approved By</th>
                <th className="p-4 text-right">Sum Outflow</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-xs">
              {filteredExpenses.map(exp => (
                <tr key={exp.id} className="hover:bg-gray-50/40 dark:hover:bg-slate-950/20 transition-colors whitespace-nowrap">
                  <td className="p-4">
                    <div className="font-bold text-gray-900 dark:text-white">{exp.referenceNo}</div>
                    <div className="text-[10px] text-gray-400 font-mono mt-0.5">ID: {exp.id}</div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 bg-rose-500/5 text-rose-500 font-bold px-2.5 py-1 rounded-md">
                      {exp.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="text-gray-900 dark:text-white font-medium max-w-xs truncate" title={exp.description}>
                      {exp.description}
                    </div>
                  </td>
                  <td className="p-4 font-mono text-gray-500">
                    {exp.date}
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-gray-900 dark:text-white">{exp.approvedBy}</div>
                  </td>
                  <td className="p-4 text-right font-sans font-black text-rose-500">
                    {formatCurrency(exp.amount)}
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => {
                        if (confirm("Delete this expense record?")) {
                          deleteExpense(exp.id);
                        }
                      }}
                      className="p-1 text-rose-500 hover:bg-rose-500/10 rounded-md transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* ----------------- DIALOG MODAL: ADD EXPENSE VOUCHER ----------------- */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs px-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
            
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-950 text-white flex justify-between items-center">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Receipt className="w-5 h-5 text-rose-400" />
                <span>Log Store Expense Voucher</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              {formError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs rounded-xl font-medium">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-gray-500 block">Outflow Amount (PKR) *</label>
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full h-11 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white font-sans font-extrabold text-rose-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-gray-500 block">Category</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Expense["category"])}
                    className="w-full h-11 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white cursor-pointer"
                  >
                    <option value="Rent">Rent (دکان کا کرایہ)</option>
                    <option value="Utility Bills">Utility Bills (بجلی پانی بل)</option>
                    <option value="Feed / Chara">Feed / Chara (چارہ خرچہ)</option>
                    <option value="Fuel / Transport">Fuel / Transport (کرایہ ٹرانسپورٹ)</option>
                    <option value="Repair & Maintenance">Repair & Maintenance</option>
                    <option value="Salaries">Worker Salaries (ملازموں کی تنخواہ)</option>
                    <option value="Packaging Materials">Packaging materials</option>
                    <option value="Ice Blocks">Ice blocks (برف کا خرچہ)</option>
                    <option value="Tea / Entertainment">Tea & Food (چائے روٹی)</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase text-gray-500 block">Voucher Description *</label>
                <textarea 
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="E.g. Electricity bill for June 2026 paid, LESCO samnabad sub division."
                  rows={3}
                  className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-gray-500 block">Receipt / Ref No.</label>
                  <input 
                    type="text" 
                    value={refNo}
                    onChange={(e) => setRefNo(e.target.value)}
                    placeholder="LESCO-88321"
                    className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-gray-500 block">Approved By Author</label>
                  <input 
                    type="text" 
                    value={approvedBy}
                    onChange={(e) => setApprovedBy(e.target.value)}
                    className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white font-bold"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800 pt-4 mt-4">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 text-xs font-bold bg-rose-500 text-white hover:bg-rose-600 rounded-xl transition-all shadow-md shadow-rose-500/25 cursor-pointer"
                >
                  Save Voucher
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
