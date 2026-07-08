/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { ShieldCheck, Search } from "lucide-react";

export const AuditLogView: React.FC = () => {
  const { auditLogs, clearAuditLogs, t, direction } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [moduleFilter, setModuleFilter] = useState("All");

  const getLogModule = (action: string): string => {
    const act = (action || "").toLowerCase();
    if (act.includes("customer")) return "Customers";
    if (act.includes("supplier")) return "Suppliers";
    if (act.includes("collection") || act.includes("milk")) return "Collection";
    if (act.includes("inventory") || act.includes("pricing") || act.includes("stock")) return "Inventory";
    if (act.includes("invoice") || act.includes("sales") || act.includes("billing")) return "Sales";
    if (act.includes("expense") || act.includes("payment")) return "Expenses";
    if (act.includes("staff") || act.includes("salary") || act.includes("worker")) return "Staff";
    return "Settings";
  };

  const getActionType = (action: string): string => {
    const act = (action || "").toLowerCase();
    if (act.includes("added") || act.includes("registered") || act.includes("created")) return "Add";
    if (act.includes("deleted") || act.includes("removed")) return "Delete";
    if (act.includes("updated") || act.includes("modified")) return "Update";
    if (act.includes("payment") || act.includes("disburs")) return "Payment";
    return "System";
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = (log.action || "").toLowerCase().includes((searchQuery || "").toLowerCase()) || 
                          (log.user || "").toLowerCase().includes((searchQuery || "").toLowerCase());
    const matchesModule = moduleFilter === "All" || getLogModule(log.action) === moduleFilter;
    return matchesSearch && matchesModule;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-blue-600" />
            <span>Operational Audit & Security Log</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Cryptographic ledger trail of all counter sales, supplier payments, and staff roster modifications
          </p>
        </div>

        <button
          onClick={() => {
            if (confirm("Clear all security logs? This action is irreversible.")) {
              clearAuditLogs();
            }
          }}
          className="px-4 py-2 text-xs font-semibold bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/20 rounded-xl transition-all cursor-pointer"
        >
          Clear Ledger Trail
        </button>
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        
        {/* Filters */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-3 justify-between items-center bg-slate-50/50 dark:bg-slate-950/10">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute top-3 left-3" />
            <input 
              type="text" 
              placeholder="Search by details or authorized user..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 border border-slate-200 dark:border-slate-700 pl-9 pr-4 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:bg-slate-950 dark:text-white"
            />
          </div>

          <select 
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="h-10 border border-slate-200 dark:border-slate-700 rounded-xl text-xs px-3 bg-white dark:bg-slate-950 dark:text-white cursor-pointer"
          >
            <option value="All">All System Modules</option>
            <option value="Customers">Customers</option>
            <option value="Suppliers">Suppliers</option>
            <option value="Collection">Milk Collection</option>
            <option value="Inventory">Inventory</option>
            <option value="Sales">Sales & Billing</option>
            <option value="Expenses">Expense Management</option>
            <option value="Staff">Staff Management</option>
            <option value="Settings">Settings</option>
          </select>
        </div>

        {/* Audit Logs list */}
        <div className="overflow-x-auto font-mono text-[11px]">
          <table className="w-full min-w-[950px] text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-500 uppercase bg-slate-50/40 dark:bg-slate-950/20 whitespace-nowrap">
                <th className="p-4">Timestamp</th>
                <th className="p-4">Authorized User</th>
                <th className="p-4">Staff Role</th>
                <th className="p-4">Cost Center Module</th>
                <th className="p-4">Mutation Action</th>
                <th className="p-4">Audit Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredLogs.map(log => {
                const module = getLogModule(log.action);
                const actionType = getActionType(log.action);
                return (
                  <tr key={log.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-950/20 transition-colors whitespace-nowrap">
                    <td className="p-4 text-slate-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-4 font-bold text-slate-900 dark:text-white">
                      {log.user}
                    </td>
                    <td className="p-4">
                      <span className="bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-sm">
                        {log.role}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-blue-600 dark:text-blue-400">
                      {module}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-sm font-bold text-[10px] ${
                        actionType === "Add" || actionType === "Payment" 
                          ? "bg-emerald-500/10 text-emerald-500"
                          : actionType === "Delete"
                          ? "bg-rose-500/10 text-rose-500"
                          : "bg-amber-500/10 text-amber-500"
                      }`}>
                        {actionType}
                      </span>
                    </td>
                    <td className="p-4 text-xs font-sans text-gray-900 dark:text-slate-100" title={log.action}>
                      {log.action}
                      <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                        Client: {log.browser} • IP: {log.ipAddress}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
