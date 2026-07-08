import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { ModalPortal } from "./ModalPortal";
import { Plus, Search, Receipt, Trash2, DollarSign, Wallet, CheckCircle2, XCircle, X, User2 } from "lucide-react";

export const ExpensesView: React.FC = () => {
  const { expenses, employees, addExpense, updateExpense, deleteExpense, formatCurrency, t } = useApp();

  const [tab, setTab] = useState<"all" | "unpaid" | "salary">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Bill modal
  const [showBillModal, setShowBillModal] = useState(false);
  const [billName, setBillName] = useState("");
  const [billAmount, setBillAmount] = useState(0);
  const [billPaid, setBillPaid] = useState(true);
  const [billError, setBillError] = useState("");

  // Salary modal
  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const [salWorkerId, setSalWorkerId] = useState("");
  const [salAmount, setSalAmount] = useState(0);
  const [salMonth, setSalMonth] = useState(new Date().toISOString().slice(0, 7));
  const [salError, setSalError] = useState("");

  const filtered = expenses.filter(e => {
    const matchSearch = (e.category || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.notes || "").toLowerCase().includes(searchQuery.toLowerCase());
    if (tab === "unpaid") return matchSearch && !e.paid;
    if (tab === "salary") return matchSearch && e.category === "Salary";
    return matchSearch;
  });

  const totalAll = expenses.reduce((s, e) => s + e.amount, 0);
  const totalUnpaid = expenses.filter(e => !e.paid).reduce((s, e) => s + e.amount, 0);
  const totalPaid = expenses.filter(e => e.paid).reduce((s, e) => s + e.amount, 0);

  const handleAddBill = (e: React.FormEvent) => {
    e.preventDefault();
    setBillError("");
    if (!billName.trim() || billAmount <= 0) {
      setBillError("Bill name and amount are required");
      return;
    }
    addExpense({
      category: billName.trim(),
      amount: billAmount,
      paid: billPaid,
      paymentMethod: billPaid ? "Cash" : "Pending",
      notes: billName.trim(),
    });
    setBillName(""); setBillAmount(0); setBillPaid(true);
    setShowBillModal(false);
  };

  const handleAddSalary = (e: React.FormEvent) => {
    e.preventDefault();
    setSalError("");
    if (!salWorkerId || salAmount <= 0) {
      setSalError("Select a worker and enter amount");
      return;
    }
    const worker = employees.find(w => w.id === salWorkerId);
    addExpense({
      category: "Salary",
      amount: salAmount,
      paid: true,
      paidTo: worker?.name,
      paymentMethod: "Cash",
      notes: `Salary - ${worker?.name} (${salMonth})`,
    });
    setSalWorkerId(""); setSalAmount(0);
    setShowSalaryModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Receipt className="w-6 h-6 text-blue-600" />
            <span>Expenses</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Track bills, salaries, and other expenses
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowSalaryModal(true)} className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all shadow-md cursor-pointer">
            <User2 className="w-4 h-4" />
            <span>Pay Salary</span>
          </button>
          <button onClick={() => setShowBillModal(true)} className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-md shadow-blue-500/25 cursor-pointer">
            <Plus className="w-4 h-4" />
            <span>Add Bill</span>
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-mono">Total Expenses</p>
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">{formatCurrency(totalAll)}</h4>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-mono">Paid</p>
            <h4 className="text-sm font-extrabold text-emerald-500">{formatCurrency(totalPaid)}</h4>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-mono">Unpaid</p>
            <h4 className="text-sm font-extrabold text-rose-500">{formatCurrency(totalUnpaid)}</h4>
          </div>
        </div>
      </div>

      {/* Table card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        {/* Filters */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-3 justify-between items-center bg-slate-50/50 dark:bg-slate-950/10">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute top-3 left-3" />
            <input type="text" placeholder="Search expenses..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full h-10 border border-slate-200 dark:border-slate-700 pl-9 pr-4 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:bg-slate-950 dark:text-white" />
          </div>
          <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
            <button onClick={() => setTab("all")} className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${tab === "all" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>All</button>
            <button onClick={() => setTab("unpaid")} className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${tab === "unpaid" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>Unpaid</button>
            <button onClick={() => setTab("salary")} className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${tab === "salary" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>Salaries</button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left">
            <thead>
              <tr className="border-b border-gray-100 dark:border-slate-800 text-gray-500 font-mono text-xs uppercase bg-gray-50/40 dark:bg-slate-950/20">
                <th className="p-4">Bill / Expense</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Amount</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-xs">
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-400">No expenses found</td></tr>
              ) : (
                filtered.map(exp => (
                  <tr key={exp.id} className="hover:bg-gray-50/40 dark:hover:bg-slate-950/20 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-gray-900 dark:text-white">{exp.category}</div>
                      <div className="text-[10px] text-gray-400">{exp.notes}</div>
                    </td>
                    <td className="p-4 font-mono text-gray-500">{exp.date}</td>
                    <td className="p-4">
                      {exp.paid ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-2.5 py-1 rounded-md text-[11px]">
                          <CheckCircle2 className="w-3 h-3" /> Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-rose-500/10 text-rose-500 font-bold px-2.5 py-1 rounded-md text-[11px]">
                          <XCircle className="w-3 h-3" /> Unpaid
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right font-sans font-black text-gray-900 dark:text-white">{formatCurrency(exp.amount)}</td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {!exp.paid && (
                          <button onClick={() => updateExpense(exp.id, { paid: true })} className="p-1.5 text-emerald-500 hover:bg-emerald-500/10 rounded-md transition-colors cursor-pointer" title="Mark as paid"><CheckCircle2 className="w-4 h-4" /></button>
                        )}
                        <button onClick={() => { if (confirm("Delete this expense?")) deleteExpense(exp.id); }} className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-md transition-colors cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── ADD BILL MODAL ── */}
      {showBillModal && (
        <ModalPortal onClose={() => setShowBillModal(false)}>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs px-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-950 text-white flex justify-between items-center">
                <h3 className="text-base font-bold flex items-center gap-2"><Receipt className="w-5 h-5 text-blue-400" /> Add Bill</h3>
                <button onClick={() => setShowBillModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleAddBill} className="p-6 space-y-4">
                {billError && <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs rounded-xl font-medium">{billError}</div>}
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-gray-500 block">Bill Name *</label>
                  <input type="text" value={billName} onChange={e => setBillName(e.target.value)} placeholder="e.g. Electricity Bill, Gas Bill, Rent" className="w-full h-11 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-gray-500 block">Amount (PKR) *</label>
                  <input type="number" value={billAmount} onChange={e => setBillAmount(Number(e.target.value))} className="w-full h-11 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white font-bold" />
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl">
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">Status:</span>
                  <button type="button" onClick={() => setBillPaid(true)} className={`px-4 py-2 text-xs font-bold rounded-lg cursor-pointer transition-all ${billPaid ? "bg-emerald-500 text-white shadow-sm" : "bg-slate-200 dark:bg-slate-700 text-slate-500"}`}><CheckCircle2 className="w-3.5 h-3.5 inline mr-1" />Paid</button>
                  <button type="button" onClick={() => setBillPaid(false)} className={`px-4 py-2 text-xs font-bold rounded-lg cursor-pointer transition-all ${!billPaid ? "bg-rose-500 text-white shadow-sm" : "bg-slate-200 dark:bg-slate-700 text-slate-500"}`}><XCircle className="w-3.5 h-3.5 inline mr-1" />Unpaid</button>
                </div>
                <div className="flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800 pt-4 mt-4">
                  <button type="button" onClick={() => setShowBillModal(false)} className="px-4 py-2 text-xs font-semibold bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 rounded-xl cursor-pointer">Cancel</button>
                  <button type="submit" className="px-4 py-2 text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 rounded-xl transition-all shadow-md shadow-blue-500/25 cursor-pointer">Save Bill</button>
                </div>
              </form>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* ── PAY SALARY MODAL ── */}
      {showSalaryModal && (
        <ModalPortal onClose={() => setShowSalaryModal(false)}>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs px-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-950 text-white flex justify-between items-center">
                <h3 className="text-base font-bold flex items-center gap-2"><User2 className="w-5 h-5 text-emerald-400" /> Pay Salary</h3>
                <button onClick={() => setShowSalaryModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleAddSalary} className="p-6 space-y-4">
                {salError && <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs rounded-xl font-medium">{salError}</div>}
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-gray-500 block">Worker *</label>
                  <select value={salWorkerId} onChange={e => setSalWorkerId(e.target.value)} className="w-full h-11 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white cursor-pointer">
                    <option value="">Select worker...</option>
                    {employees.map(w => (
                      <option key={w.id} value={w.id}>{w.name} ({w.role})</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono uppercase text-gray-500 block">Amount (PKR) *</label>
                    <input type="number" value={salAmount} onChange={e => setSalAmount(Number(e.target.value))} className="w-full h-11 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono uppercase text-gray-500 block">Month</label>
                    <input type="month" value={salMonth} onChange={e => setSalMonth(e.target.value)} className="w-full h-11 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white cursor-pointer" />
                  </div>
                </div>
                {salWorkerId && (
                  <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl text-xs text-blue-600 dark:text-blue-400">
                    {employees.find(w => w.id === salWorkerId)?.name} — Base salary: {formatCurrency(employees.find(w => w.id === salWorkerId)?.salary || 0)}
                  </div>
                )}
                <div className="flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800 pt-4 mt-4">
                  <button type="button" onClick={() => setShowSalaryModal(false)} className="px-4 py-2 text-xs font-semibold bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 rounded-xl cursor-pointer">Cancel</button>
                  <button type="submit" className="px-4 py-2 text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-600 rounded-xl transition-all shadow-md shadow-emerald-500/25 cursor-pointer">Pay Salary</button>
                </div>
              </form>
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  );
};
