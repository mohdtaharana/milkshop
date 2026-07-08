/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Employee } from "../types";
import { 
  Plus, Search, UserCheck, Calendar, Phone, Trash2, Shield, DollarSign, 
  Wallet, FileSpreadsheet, CheckCircle2, Award, Clock, Sparkles, X, User2 
} from "lucide-react";

export const StaffView: React.FC = () => {
  const { 
    employees, addEmployee, toggleAttendance, deleteEmployee, addExpense,
    formatCurrency, formatNumber, t, direction 
  } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showSalaryModal, setShowSalaryModal] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Add Worker Form States
  const [formName, setFormName] = useState("");
  const [formRole, setFormRole] = useState<Employee["role"]>("Helper");
  const [formPhone, setFormPhone] = useState("");
  const [formSalary, setFormSalary] = useState<number>(25000);
  const [formError, setFormError] = useState("");

  // Pay Salary Form States
  const [salaryAmt, setSalaryAmt] = useState<number>(0);
  const [salaryMonth, setSalaryMonth] = useState("July 2026");

  const activeSalaryWorker = employees.find(e => e.id === showSalaryModal);

  // Submit adding employee
  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formName.trim() || !formPhone.trim()) {
      setFormError("Staff Name and Phone Contact are required.");
      return;
    }

    if (formSalary <= 0) {
      setFormError("Salary must be a positive number.");
      return;
    }

    addEmployee({
      name: formName,
      role: formRole,
      phone: formPhone,
      salary: Number(formSalary),
      permissions: ["View Dashboard"]
    });

    setFormName("");
    setFormPhone("");
    setFormSalary(25000);
    setShowAddModal(false);
    alert("New worker registered successfully!");
  };

  // Submit worker salary
  const handlePaySalary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showSalaryModal || !activeSalaryWorker) return;

    if (salaryAmt <= 0) {
      alert("Please provide a valid salary amount.");
      return;
    }

    addExpense({
      category: "Salary",
      amount: Number(salaryAmt),
      paidTo: activeSalaryWorker.name,
      paymentMethod: "Cash",
      notes: `Salary disbursed for the month of ${salaryMonth}`
    });

    setSalaryAmt(0);
    setShowSalaryModal(null);
    alert("Salary disbursal logged successfully as shop expense.");
  };

  const filteredStaff = employees.filter(emp => {
    return (emp.name || "").toLowerCase().includes((searchQuery || "").toLowerCase()) || 
           (emp.role || "").toLowerCase().includes((searchQuery || "").toLowerCase());
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-blue-600" />
            <span>Staff Roster & Attendance Sheet</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Oversee shop workers, sales assistants, delivery boys, and daily register attendances
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-md shadow-blue-500/25 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Worker</span>
        </button>
      </div>

      {/* KPI Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-mono">Present Today</p>
            <h4 className="text-sm font-extrabold text-blue-600 dark:text-blue-400">
              {employees.filter(s => s.attendanceToday === "Present").length} / {employees.length} Active
            </h4>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-mono">Roles Logged</p>
            <h4 className="text-sm font-extrabold text-gray-900 dark:text-white">
              Managers & Riders
            </h4>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-500 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-mono">Monthly Base Payroll</p>
            <h4 className="text-sm font-extrabold text-gray-900 dark:text-white">
              {formatCurrency(employees.reduce((sum, s) => sum + s.salary, 0))}
            </h4>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-mono">Absent/Leaves</p>
            <h4 className="text-sm font-extrabold text-rose-500">
              {employees.filter(s => s.attendanceToday === "Absent" || s.attendanceToday === "Leave").length} Workers
            </h4>
          </div>
        </div>

      </div>

      {/* Worker List table card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        
        {/* Search */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-3 justify-between items-center bg-slate-50/50 dark:bg-slate-950/10">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute top-3 left-3" />
            <input 
              type="text" 
              placeholder="Search staff directory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 border border-slate-200 dark:border-slate-700 pl-9 pr-4 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:bg-slate-950 dark:text-white"
            />
          </div>
        </div>

        {/* Directory Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-500 font-mono text-xs uppercase bg-slate-50/40 dark:bg-slate-950/20 whitespace-nowrap">
                <th className="p-4">Worker Profile Details</th>
                <th className="p-4">Contact Phone</th>
                <th className="p-4 text-right">Target Base Salary</th>
                <th className="p-4 text-center">Today's Attendance Status</th>
                <th className="p-4 text-center">Roster Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredStaff.map(emp => (
                <tr key={emp.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-950/20 transition-colors whitespace-nowrap">
                  <td className="p-4">
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{emp.name}</span>
                      <span className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-bold">
                        {emp.role}
                      </span>
                    </div>
                    <div className="text-[10px] text-gray-400 font-mono mt-0.5">ID: {emp.id} • Performance Score: {emp.performanceScore}★</div>
                  </td>
                  <td className="p-4 font-mono text-gray-600 dark:text-slate-400">
                    {emp.phone}
                  </td>
                  <td className="p-4 text-right font-sans font-bold text-slate-950 dark:text-slate-100">
                    {formatCurrency(emp.salary)}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => toggleAttendance(emp.id, "Present")}
                        className={`px-2 py-1 rounded-md text-[10px] font-bold cursor-pointer transition-all ${
                          emp.attendanceToday === "Present" 
                            ? "bg-emerald-500 text-white" 
                            : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200"
                        }`}
                      >
                        Present
                      </button>
                      <button
                        onClick={() => toggleAttendance(emp.id, "Absent")}
                        className={`px-2 py-1 rounded-md text-[10px] font-bold cursor-pointer transition-all ${
                          emp.attendanceToday === "Absent" 
                            ? "bg-rose-500 text-white" 
                            : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200"
                        }`}
                      >
                        Absent
                      </button>
                      <button
                        onClick={() => toggleAttendance(emp.id, "Leave")}
                        className={`px-2 py-1 rounded-md text-[10px] font-bold cursor-pointer transition-all ${
                          emp.attendanceToday === "Leave" 
                            ? "bg-amber-500 text-white" 
                            : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200"
                        }`}
                      >
                        Leave
                      </button>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => {
                          setSalaryAmt(emp.salary);
                          setShowSalaryModal(emp.id);
                        }}
                        className="px-2 py-1 text-[11px] font-bold bg-blue-500/10 hover:bg-blue-600 text-blue-600 dark:text-blue-400 hover:text-white border border-blue-500/10 rounded-lg transition-all cursor-pointer"
                      >
                        Disburse Salary
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Remove this worker profile?")) {
                            deleteEmployee(emp.id);
                          }
                        }}
                        className="p-1 text-rose-500 hover:bg-rose-500/15 rounded-md cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* ----------------- DIALOG MODAL: ADD STAFF MEMBER ----------------- */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs px-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
            
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-950 text-white flex justify-between items-center">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-400" />
                <span>Register Worker Profile</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStaff} className="p-6 space-y-4">
              
              {formError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs rounded-xl font-medium">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-gray-500 block">Worker Name *</label>
                  <input 
                    type="text" 
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Sajid Hussain"
                    className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-gray-500 block">Designated Role</label>
                  <select 
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value as Employee["role"])}
                    className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white cursor-pointer"
                  >
                    <option value="Manager">Manager (منیجر)</option>
                    <option value="Salesperson">Salesperson (سیلزمین)</option>
                    <option value="Delivery Boy">Delivery Rider (ڈلیوری بوائے)</option>
                    <option value="Quality Tester">Quality Tester (لیبارٹری والہ)</option>
                    <option value="Helper">Helper (دودھ والہ)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-gray-500 block">Phone Contact *</label>
                  <input 
                    type="text" 
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="0312-3211221"
                    className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-gray-500 block">Target Base Salary (PKR) *</label>
                  <input 
                    type="number" 
                    value={formSalary}
                    onChange={(e) => setFormSalary(Number(e.target.value))}
                    className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white"
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
                  className="px-4 py-2 text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 rounded-xl transition-all shadow-md shadow-blue-500/25 cursor-pointer"
                >
                  Save Profile
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ----------------- DIALOG MODAL: DISBURSE SALARY ----------------- */}
      {showSalaryModal && activeSalaryWorker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs px-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
            
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-950 text-white flex justify-between items-center">
              <h3 className="text-base font-bold">Disburse Salary: {activeSalaryWorker.name}</h3>
              <button onClick={() => setShowSalaryModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePaySalary} className="p-6 space-y-4">
              
              <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex justify-between items-center text-xs">
                <span className="text-gray-500 font-medium">Standard Salary Scale:</span>
                <span className="font-extrabold text-blue-600 dark:text-blue-400 text-sm">{formatCurrency(activeSalaryWorker.salary)}</span>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase text-gray-500 block">Amount to Pay (PKR) *</label>
                <input 
                  type="number" 
                  value={salaryAmt}
                  onChange={(e) => setSalaryAmt(Number(e.target.value))}
                  className="w-full h-11 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white font-sans font-bold text-blue-600 dark:text-blue-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase text-gray-500 block">Salary Period / Month</label>
                <input 
                  type="text" 
                  value={salaryMonth}
                  onChange={(e) => setSalaryMonth(e.target.value)}
                  className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white"
                />
              </div>

              {/* Confirm */}
              <div className="flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800 pt-4 mt-4">
                <button 
                  type="button" 
                  onClick={() => setShowSalaryModal(null)}
                  className="px-4 py-2 text-xs font-semibold bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 rounded-xl transition-all shadow-md shadow-blue-500/25 cursor-pointer"
                >
                  Log Salary Voucher
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
