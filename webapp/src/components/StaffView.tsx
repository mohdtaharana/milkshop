import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { ModalPortal } from "./ModalPortal";
import { Employee } from "../types";
import { Plus, Search, UserCheck, Phone, Trash2, X } from "lucide-react";

export const StaffView: React.FC = () => {
  const { employees, addEmployee, toggleAttendance, deleteEmployee, formatCurrency, t } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [formName, setFormName] = useState("");
  const [formRole, setFormRole] = useState<Employee["role"]>("Helper");
  const [formPhone, setFormPhone] = useState("");
  const [formSalary, setFormSalary] = useState<number>(25000);
  const [formError, setFormError] = useState("");

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!formName.trim() || !formPhone.trim()) {
      setFormError("Name and phone are required.");
      return;
    }
    if (formSalary <= 0) {
      setFormError("Salary must be positive.");
      return;
    }
    addEmployee({
      name: formName, role: formRole, phone: formPhone,
      salary: Number(formSalary), permissions: ["View Dashboard"],
    });
    setFormName(""); setFormPhone(""); setFormSalary(25000);
    setShowAddModal(false);
  };

  const filtered = employees.filter(e =>
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.phone.includes(searchQuery)
  );

  const present = employees.filter(e => e.attendanceToday === "Present").length;
  const absent = employees.filter(e => e.attendanceToday === "Absent" || e.attendanceToday === "Leave").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-blue-600" />
            <span>Staff & Attendance</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Manage workers and daily attendance</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-md shadow-blue-500/25 cursor-pointer">
          <Plus className="w-4 h-4" /> Add Worker
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-mono">Present Today</p>
            <h4 className="text-sm font-extrabold text-blue-600">{present} / {employees.length}</h4>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-500 flex items-center justify-center">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-mono">Total Workers</p>
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">{employees.length}</h4>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-mono">Absent / Leave</p>
            <h4 className="text-sm font-extrabold text-rose-500">{absent}</h4>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/10">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute top-3 left-3" />
            <input type="text" placeholder="Search by name, role, phone..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full h-10 border border-slate-200 dark:border-slate-700 pl-9 pr-4 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:bg-slate-950 dark:text-white" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-500 font-mono text-xs uppercase bg-slate-50/40 dark:bg-slate-950/20">
                <th className="p-4">Worker</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Salary</th>
                <th className="p-4 text-center">Attendance</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-400">No workers found</td></tr>
              ) : (
                filtered.map(emp => (
                  <tr key={emp.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-950/20 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-900 dark:text-white">{emp.name}</div>
                      <span className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-bold">{emp.role}</span>
                    </td>
                    <td className="p-4 font-mono text-slate-600 dark:text-slate-400">{emp.phone}</td>
                    <td className="p-4 font-sans font-bold text-slate-900 dark:text-white">{formatCurrency(emp.salary)}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => toggleAttendance(emp.id, "Present")} className={`px-2.5 py-1.5 rounded-md text-[10px] font-bold cursor-pointer transition-all ${emp.attendanceToday === "Present" ? "bg-emerald-500 text-white shadow-sm" : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200"}`}>Present</button>
                        <button onClick={() => toggleAttendance(emp.id, "Absent")} className={`px-2.5 py-1.5 rounded-md text-[10px] font-bold cursor-pointer transition-all ${emp.attendanceToday === "Absent" ? "bg-rose-500 text-white shadow-sm" : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200"}`}>Absent</button>
                        <button onClick={() => toggleAttendance(emp.id, "Leave")} className={`px-2.5 py-1.5 rounded-md text-[10px] font-bold cursor-pointer transition-all ${emp.attendanceToday === "Leave" ? "bg-amber-500 text-white shadow-sm" : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200"}`}>Leave</button>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <button onClick={() => { if (confirm("Remove this worker?")) deleteEmployee(emp.id); }} className="p-1.5 text-rose-500 hover:bg-rose-500/15 rounded-md cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Worker Modal */}
      {showAddModal && (
        <ModalPortal onClose={() => setShowAddModal(false)}>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs px-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-950 text-white flex justify-between items-center">
                <h3 className="text-base font-bold"><Plus className="w-5 h-5 text-blue-400 inline mr-2" />Add Worker</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleAddStaff} className="p-6 space-y-4">
                {formError && <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs rounded-xl font-medium">{formError}</div>}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono uppercase text-gray-500 block">Name *</label>
                    <input type="text" value={formName} onChange={e => setFormName(e.target.value)} placeholder="Worker name" className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono uppercase text-gray-500 block">Role</label>
                    <select value={formRole} onChange={e => setFormRole(e.target.value as Employee["role"])} className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white cursor-pointer">
                      <option value="Manager">Manager</option>
                      <option value="Salesperson">Salesperson</option>
                      <option value="Delivery Boy">Delivery Rider</option>
                      <option value="Quality Tester">Quality Tester</option>
                      <option value="Helper">Helper</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono uppercase text-gray-500 block">Phone *</label>
                    <input type="text" value={formPhone} onChange={e => setFormPhone(e.target.value)} placeholder="0312-3456789" className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono uppercase text-gray-500 block">Salary (PKR)</label>
                    <input type="number" value={formSalary} onChange={e => setFormSalary(Number(e.target.value))} className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white" />
                  </div>
                </div>
                <div className="flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800 pt-4 mt-4">
                  <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-xs font-semibold bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 rounded-xl cursor-pointer">Cancel</button>
                  <button type="submit" className="px-4 py-2 text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 rounded-xl transition-all shadow-md shadow-blue-500/25 cursor-pointer">Save</button>
                </div>
              </form>
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  );
};
