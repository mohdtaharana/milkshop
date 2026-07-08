/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { ModalPortal } from "./ModalPortal";
import { Supplier, MilkType, PaymentMethod } from "../types";
import { 
  Plus, Search, Landmark, User2, Phone, MapPin, Trash2, Edit3, X, 
  Eye, DollarSign, Wallet, FileSpreadsheet, CheckCircle2, FlaskConical 
} from "lucide-react";

export const SuppliersView: React.FC = () => {
  const { 
    suppliers, addSupplier, updateSupplier, deleteSupplier, 
    formatCurrency, formatNumber, t, direction 
  } = useApp();

  // Selected supplier detail
  const [selectedSuppId, setSelectedSuppId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDisburseModal, setShowDisburseModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSuppId, setEditingSuppId] = useState<string | null>(null);

  // Search states
  const [searchQuery, setSearchQuery] = useState("");

  // Add form fields
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formAddress, setFormAddress] = useState("");
  const [formVillage, setFormVillage] = useState("");
  const [formSource, setFormSource] = useState<MilkType>(MilkType.BUFFALO);
  const [formQtyM, setFormQtyM] = useState<number>(100);
  const [formQtyE, setFormQtyE] = useState<number>(100);
  const [formFat, setFormFat] = useState<number>(6.5);
  const [formSnf, setFormSnf] = useState<number>(8.8);
  const [formRate, setFormRate] = useState<number>(155);
  const [formBank, setFormBank] = useState("");
  const [formAccTitle, setFormAccTitle] = useState("");
  const [formIban, setFormIban] = useState("");
  const [formError, setFormError] = useState("");

  // Pay supplier fields
  const [disburseAmount, setDisburseAmount] = useState<number>(0);
  const [disburseMethod, setDisburseMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
  const [disburseRef, setDisburseRef] = useState("");
  const [disburseError, setDisburseError] = useState("");

  const selectedSupplier = suppliers.find(s => s.id === selectedSuppId);

  // Submit new supplier
  const handleAddSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formName.trim() || !formPhone.trim() || !formVillage.trim()) {
      setFormError("Please fill out Name, Phone, and Village / Town.");
      return;
    }

    addSupplier({
      name: formName,
      phone: formPhone,
      address: formAddress || `Dera ${formName}, ${formVillage}`,
      village: formVillage,
      milkSource: formSource,
      morningSupply: Number(formQtyM),
      eveningSupply: Number(formQtyE),
      milkFat: Number(formFat),
      snf: Number(formSnf),
      rate: Number(formRate),
      bankDetails: formBank ? {
        bankName: formBank,
        accountTitle: formAccTitle || formName,
        iban: formIban
      } : undefined,
      status: "Active"
    });

    // Reset Form
    setFormName("");
    setFormPhone("");
    setFormAddress("");
    setFormVillage("");
    setFormQtyM(100);
    setFormQtyE(100);
    setFormFat(6.5);
    setFormSnf(8.8);
    setFormRate(155);
    setFormBank("");
    setFormAccTitle("");
    setFormIban("");
    setShowAddModal(false);
  };

  // Submit Payment / Disbursal
  const handleDisburseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDisburseError("");

    if (!selectedSuppId || !selectedSupplier) return;

    if (disburseAmount <= 0) {
      setDisburseError("Payment amount must be greater than 0 PKR.");
      return;
    }

    await updateSupplier(selectedSuppId, {
      outstandingBalance: selectedSupplier.outstandingBalance - Number(disburseAmount)
    });

    setDisburseAmount(0);
    setDisburseRef("");
    setShowDisburseModal(false);
    alert(t("successRecord"));
  };

  const handleEditSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!editingSuppId) return;
    if (!formName.trim() || !formPhone.trim()) {
      setFormError("Name and Phone are required.");
      return;
    }
    updateSupplier(editingSuppId, {
      name: formName, phone: formPhone,
      address: formAddress || `Dera ${formName}, ${formVillage}`,
      village: formVillage, milkSource: formSource,
      morningSupply: Number(formQtyM), eveningSupply: Number(formQtyE),
      milkFat: Number(formFat), snf: Number(formSnf), rate: Number(formRate),
      bankDetails: formBank ? {
        bankName: formBank, accountTitle: formAccTitle || formName, iban: formIban,
      } : undefined,
    });
    resetSuppForm();
    setShowEditModal(false);
    setEditingSuppId(null);
  };

  const openEditModal = (s: Supplier) => {
    setFormName(s.name); setFormPhone(s.phone); setFormAddress(s.address || "");
    setFormVillage(s.village); setFormSource(s.milkSource);
    setFormQtyM(s.morningSupply); setFormQtyE(s.eveningSupply);
    setFormFat(s.milkFat); setFormSnf(s.snf); setFormRate(s.rate);
    setFormBank(s.bankDetails?.bankName || ""); setFormAccTitle(s.bankDetails?.accountTitle || "");
    setFormIban(s.bankDetails?.iban || "");
    setEditingSuppId(s.id);
    setShowEditModal(true);
  };

  const resetSuppForm = () => {
    setFormName(""); setFormPhone(""); setFormAddress(""); setFormVillage("");
    setFormQtyM(100); setFormQtyE(100); setFormFat(6.5); setFormSnf(8.8);
    setFormRate(155); setFormBank(""); setFormAccTitle(""); setFormIban("");
  };

  // Filter lists
  const filteredSuppliers = suppliers.filter(s => {
    return (s.name || "").toLowerCase().includes((searchQuery || "").toLowerCase()) ||
           (s.village || "").toLowerCase().includes((searchQuery || "").toLowerCase()) ||
           (s.phone || "").includes(searchQuery);
  });

  return (
    <div className="space-y-6">
      
      {/* Upper header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Landmark className="w-6 h-6 text-blue-600" />
            <span>Supplier Operations Manager</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage rural milk suppliers, Fat/SNF baselines, and commercial payables
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-md shadow-blue-500/25 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t("addSupplier")}</span>
        </button>
      </div>

      {/* Selected supplier profile details sheet */}
      {selectedSupplier ? (
        
        /* ---------------- SELECTED SUPPLIER LEDGER VIEW ---------------- */
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          
          <div className="bg-slate-950 p-6 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-base">
                {selectedSupplier.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <span>{selectedSupplier.name}</span>
                  <span className="text-xs bg-blue-500/15 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full font-mono">
                    {selectedSupplier.milkSource} Supplier
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Primary Source Village: <span className="text-slate-200 font-bold">{selectedSupplier.village}</span> • Status: <span className="text-emerald-400 font-bold">{selectedSupplier.status}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => openEditModal(selectedSupplier)}
                className="px-3 py-1.5 text-xs font-semibold bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </button>
              <button 
                onClick={() => setShowDisburseModal(true)}
                className="px-3.5 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-500/25"
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>Disburse Milk Payment</span>
              </button>
              <button 
                onClick={() => {
                  if (confirm("Are you sure you want to delete this supplier?")) {
                    deleteSupplier(selectedSupplier.id);
                    setSelectedSuppId(null);
                  }
                }}
                className="px-3 py-1.5 text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t("delete")}</span>
              </button>
              <button 
                onClick={() => setSelectedSuppId(null)}
                className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer"
              >
                {t("backToList")}
              </button>
            </div>
          </div>

          {/* KPI Mini blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6 border-b border-gray-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
            <div className="p-3 bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-xl flex items-center gap-3">
              <Wallet className="w-8 h-8 text-rose-500 shrink-0" />
              <div>
                <p className="text-[10px] text-gray-500 font-mono uppercase">Outstanding Payable</p>
                <h4 className="text-base font-black text-rose-500 font-sans">
                  {formatCurrency(selectedSupplier.outstandingBalance)}
                </h4>
              </div>
            </div>

            <div className="p-3 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl flex items-center gap-3">
              <FlaskConical className="w-8 h-8 text-blue-500 shrink-0" />
              <div>
                <p className="text-[10px] text-gray-500 font-mono uppercase">Avg Quality Standards</p>
                <h4 className="text-base font-black text-slate-900 dark:text-white">
                  {selectedSupplier.milkFat}% Fat / {selectedSupplier.snf}% SNF
                </h4>
              </div>
            </div>

            <div className="p-3 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl flex items-center gap-3">
              <Wallet className="w-8 h-8 text-blue-500 shrink-0" />
              <div>
                <p className="text-[10px] text-gray-500 font-mono uppercase">Daily Base Supply</p>
                <h4 className="text-base font-black text-slate-900 dark:text-white">
                  M: {selectedSupplier.morningSupply}L / E: {selectedSupplier.eveningSupply}L
                </h4>
              </div>
            </div>

            <div className="p-3 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-amber-500 shrink-0" />
              <div>
                <p className="text-[10px] text-gray-500 font-mono uppercase">Contract Base Price</p>
                <h4 className="text-base font-black text-slate-900 dark:text-white">
                  Rs. {selectedSupplier.rate}/L
                </h4>
              </div>
            </div>
          </div>

          {/* Supplier specifics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            
            {/* Left Box: Contacts and Bank Accounts */}
            <div className="space-y-4 lg:col-span-1 border-r border-slate-100 dark:border-slate-800 pr-0 lg:pr-6">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">Supplier Particulars</h3>
              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Phone className="w-4 h-4 text-blue-500" />
                  <span>Phone Contact: <b className="text-slate-900 dark:text-white">{selectedSupplier.phone}</b></span>
                </div>
                <div className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                  <MapPin className="w-4 h-4 text-blue-500 mt-0.5" />
                  <span>Dera Address: <b className="text-slate-900 dark:text-white">{selectedSupplier.address}</b></span>
                </div>

                {selectedSupplier.bankDetails && (
                  <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl space-y-1.5 mt-2">
                    <p className="text-[10px] text-blue-600 font-mono uppercase font-bold">Bank Details / IBAN Transfer</p>
                    <p className="text-[11px] text-slate-800 dark:text-slate-200">Bank Name: <b className="block">{selectedSupplier.bankDetails.bankName}</b></p>
                    <p className="text-[11px] text-slate-800 dark:text-slate-200">Account Title: <b>{selectedSupplier.bankDetails.accountTitle}</b></p>
                    <p className="text-[11px] text-slate-800 dark:text-slate-200 font-mono">IBAN: <span className="block text-[10px] select-all bg-slate-100 dark:bg-slate-950 p-1 rounded-sm mt-0.5">{selectedSupplier.bankDetails.iban}</span></p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Box: Historical Payments ledger */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-blue-500" />
                <span>Supplier Ledger transactions</span>
              </h3>
              
              <div className="border border-slate-150 dark:border-slate-800 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 dark:bg-slate-950 text-gray-500 font-mono">
                    <tr>
                      <th className="p-3">Date</th>
                      <th className="p-3">Shift Log Description</th>
                      <th className="p-3">Milk Purchased</th>
                      <th className="p-3">Amount Paid Out</th>
                      <th className="p-3">Outstanding Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-gray-700 dark:text-slate-300">
                    <tr>
                      <td className="p-3 font-mono">2026-07-06</td>
                      <td className="p-3">Evening milk collection: 290L (Buffalo, 6.7% Fat)</td>
                      <td className="p-3 text-rose-500">₨ 46,690</td>
                      <td className="p-3">—</td>
                      <td className="p-3 font-mono">₨ 127,255</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono">2026-07-07</td>
                      <td className="p-3">Morning milk collection: 325L (Buffalo, 6.9% Fat)</td>
                      <td className="p-3 text-rose-500">₨ 53,625</td>
                      <td className="p-3">—</td>
                      <td className="p-3 font-mono font-bold text-rose-500">₨ 180,880</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>

      ) : (
        
        /* ---------------- FULL SUPPLIERS GRID ---------------- */
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          
          {/* Controls */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-3 justify-between items-center bg-slate-50/50 dark:bg-slate-950/10">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute top-3 left-3" />
              <input 
                type="text" 
                placeholder="Search suppliers by name/village..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 border border-slate-200 dark:border-slate-700 pl-9 pr-4 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:bg-slate-950 dark:text-white"
              />
            </div>
          </div>

          {/* Suppliers Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-500 font-mono text-xs uppercase bg-slate-50/40 dark:bg-slate-950/20 whitespace-nowrap">
                  <th className="p-4">Farmer / Dairy Farm</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Village Origin</th>
                  <th className="p-4 text-center">Avg Milk Fat/SNF Standards</th>
                  <th className="p-4 text-right">Avg Supply (Morning/Evening)</th>
                  <th className="p-4 text-right">Current Payable Balance</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {filteredSuppliers.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-950/20 transition-colors whitespace-nowrap">
                    <td className="p-4">
                      <div className="font-bold text-slate-900 dark:text-white">{s.name}</div>
                      <div className="text-[10px] text-gray-400 font-mono mt-0.5">ID: {s.id} • Base Source: {s.milkSource}</div>
                    </td>
                    <td className="p-4 font-mono text-gray-600 dark:text-slate-400">
                      {s.phone}
                    </td>
                    <td className="p-4">
                      <div className="text-slate-900 dark:text-white font-medium">{s.village}</div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="inline-flex items-center gap-1.5 bg-blue-500/5 text-blue-600 px-2 py-1 rounded-full font-bold font-mono">
                        {s.milkFat}% Fat / {s.snf}% SNF
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="font-bold text-slate-900 dark:text-white">{s.morningSupply}L / {s.eveningSupply}L</div>
                      <div className="text-[10px] text-gray-400 font-mono">Rs. {s.rate}/L rate</div>
                    </td>
                    <td className="p-4 text-right font-sans font-bold text-rose-500">
                      {formatCurrency(s.outstandingBalance)}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => setSelectedSuppId(s.id)}
                        className="px-2.5 py-1.5 text-[11px] font-bold bg-blue-500/10 hover:bg-blue-600 text-blue-600 dark:text-blue-400 hover:text-white border border-blue-500/10 rounded-lg transition-all cursor-pointer"
                      >
                        Farmer Ledger
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* ----------------- DIALOG MODAL: ADD SUPPLIER ----------------- */}
      {showAddModal && (
        <ModalPortal onClose={() => setShowAddModal(false)}>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs px-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-950 text-white flex justify-between items-center">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-400" />
                <span>{t("addSupplier")}</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSupplier} className="flex-1 overflow-y-auto p-6 space-y-4">
              
              {formError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs rounded-xl font-medium">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-gray-500 block">Supplier Name *</label>
                  <input 
                    type="text" 
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Chaudhary Rehmat Ali"
                    className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-gray-500 block">Phone Number *</label>
                  <input 
                    type="text" 
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="0300-8432112"
                    className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-gray-500 block">Village / Town Origin *</label>
                  <input 
                    type="text" 
                    value={formVillage}
                    onChange={(e) => setFormVillage(e.target.value)}
                    placeholder="Chak 14-GD, Kasur"
                    className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-gray-500 block">Milk Source Type</label>
                  <select 
                    value={formSource}
                    onChange={(e) => setFormSource(e.target.value as MilkType)}
                    className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white cursor-pointer"
                  >
                    {Object.values(MilkType).map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-slate-950/60 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4 animate-fadeIn">
                <p className="text-xs font-bold text-slate-900 dark:text-white border-b border-slate-250 dark:border-slate-800 pb-1 flex items-center gap-2">
                  <FlaskConical className="w-4 h-4 text-blue-500" />
                  <span>Quality Baseline & Base Rate (Per Litre)</span>
                </p>
                
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                  <div className="space-y-1 col-span-2 sm:col-span-1">
                    <label className="text-[11px] font-mono uppercase text-gray-500 block">Avg Fat %</label>
                    <input 
                      type="number" 
                      step="0.1"
                      value={formFat}
                      onChange={(e) => setFormFat(Number(e.target.value))}
                      className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white"
                    />
                  </div>
                  <div className="space-y-1 col-span-2 sm:col-span-1">
                    <label className="text-[11px] font-mono uppercase text-gray-500 block">Avg SNF %</label>
                    <input 
                      type="number" 
                      step="0.1"
                      value={formSnf}
                      onChange={(e) => setFormSnf(Number(e.target.value))}
                      className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white"
                    />
                  </div>
                  <div className="space-y-1 col-span-2 sm:col-span-1">
                    <label className="text-[11px] font-mono uppercase text-gray-500 block">Base Rate (PKR)</label>
                    <input 
                      type="number" 
                      value={formRate}
                      onChange={(e) => setFormRate(Number(e.target.value))}
                      className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white"
                    />
                  </div>
                  <div className="space-y-1 col-span-2">
                    <label className="text-[11px] font-mono uppercase text-gray-500 block">Base Morning Supply (Ltr)</label>
                    <input 
                      type="number" 
                      value={formQtyM}
                      onChange={(e) => setFormQtyM(Number(e.target.value))}
                      className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Bank Account */}
              <div className="p-4 bg-gray-50 dark:bg-slate-950/60 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
                <p className="text-xs font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-1">
                  Supplier Banking Details
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono uppercase text-gray-500 block">Bank Name</label>
                    <input 
                      type="text" 
                      value={formBank}
                      onChange={(e) => setFormBank(e.target.value)}
                      placeholder="Meezan Bank, HBL"
                      className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono uppercase text-gray-500 block">Account Title</label>
                    <input 
                      type="text" 
                      value={formAccTitle}
                      onChange={(e) => setFormAccTitle(e.target.value)}
                      placeholder="Rehmat Ali"
                      className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono uppercase text-gray-500 block">IBAN Number</label>
                    <input 
                      type="text" 
                      value={formIban}
                      onChange={(e) => setFormIban(e.target.value)}
                      placeholder="PK00MEZN..."
                      className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white"
                    />
                  </div>
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
                  Save Supplier
                </button>
              </div>

            </form>

          </div>
        </div>
        </ModalPortal>
      )}

      {/* ----------------- DIALOG MODAL: DISBURSE SUPPLIER PAYMENT ----------------- */}
      {showDisburseModal && selectedSupplier && (
        <ModalPortal onClose={() => setShowDisburseModal(false)}>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs px-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
            
            <div className="p-5 border-b border-gray-100 dark:border-slate-800 bg-slate-950 text-white flex justify-between items-center">
              <h3 className="text-base font-bold">Disburse payment to: {selectedSupplier.name}</h3>
              <button onClick={() => setShowDisburseModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDisburseSubmit} className="p-6 space-y-4">
              {disburseError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs rounded-xl font-medium">
                  {disburseError}
                </div>
              )}

              <div className="p-3.5 bg-rose-500/5 border border-rose-500/10 rounded-2xl flex justify-between items-center text-xs">
                <span className="text-gray-500 font-medium">Total Outstanding Milk Bill:</span>
                <span className="font-extrabold text-rose-500 text-sm font-sans">{formatCurrency(selectedSupplier.outstandingBalance)}</span>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase text-gray-500 block">Disbursed Amount (PKR) *</label>
                <input 
                  type="number" 
                  value={disburseAmount}
                  onChange={(e) => setDisburseAmount(Number(e.target.value))}
                  placeholder="Rs. 50,000"
                  className="w-full h-11 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-sans font-bold text-blue-600 dark:text-blue-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase text-gray-500 block">Payment Method</label>
                <select 
                  value={disburseMethod}
                  onChange={(e) => setDisburseMethod(e.target.value as PaymentMethod)}
                  className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white cursor-pointer"
                >
                  {Object.values(PaymentMethod).map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase text-gray-500 block">Transaction Reference / Bank Slip / Receipt ID</label>
                <input 
                  type="text" 
                  value={disburseRef}
                  onChange={(e) => setDisburseRef(e.target.value)}
                  placeholder="E.g. Bank Ref No, easyPaisa Cash ID"
                  className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800 pt-4 mt-4">
                <button 
                  type="button" 
                  onClick={() => setShowDisburseModal(false)}
                  className="px-4 py-2 text-xs font-semibold bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 rounded-xl transition-all shadow-md shadow-blue-500/25 cursor-pointer"
                >
                  Confirm & Reduce Outstanding
                </button>
              </div>
            </form>

          </div>
        </div>
        </ModalPortal>
      )}

      {/* EDIT SUPPLIER MODAL */}
      {showEditModal && (
        <ModalPortal onClose={() => { setShowEditModal(false); setEditingSuppId(null); resetSuppForm(); }}>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs px-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

            <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-950 text-white flex justify-between items-center">
              <h3 className="text-base font-bold"><Edit3 className="w-5 h-5 text-blue-400 inline mr-2" />Edit Supplier</h3>
              <button onClick={() => { setShowEditModal(false); setEditingSuppId(null); resetSuppForm(); }} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleEditSupplier} className="flex-1 overflow-y-auto p-6 space-y-4">
              {formError && <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs rounded-xl font-medium">{formError}</div>}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-gray-500 block">Name *</label>
                  <input type="text" value={formName} onChange={e => setFormName(e.target.value)} className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-gray-500 block">Phone *</label>
                  <input type="text" value={formPhone} onChange={e => setFormPhone(e.target.value)} className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-gray-500 block">Village *</label>
                  <input type="text" value={formVillage} onChange={e => setFormVillage(e.target.value)} className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-gray-500 block">Address</label>
                  <input type="text" value={formAddress} onChange={e => setFormAddress(e.target.value)} className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white" />
                </div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-slate-950/60 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
                <p className="text-xs font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-1">Supply Details</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-gray-500 block">Milk Source</label>
                    <select value={formSource} onChange={e => setFormSource(e.target.value as MilkType)} className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white cursor-pointer">
                      <option value={MilkType.COW}>Cow Milk</option>
                      <option value={MilkType.BUFFALO}>Buffalo Milk</option>
                      <option value={MilkType.MIXED}>Mixed Milk</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-gray-500 block">Morning Supply</label>
                    <input type="number" value={formQtyM} onChange={e => setFormQtyM(Number(e.target.value))} className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-gray-500 block">Evening Supply</label>
                    <input type="number" value={formQtyE} onChange={e => setFormQtyE(Number(e.target.value))} className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-gray-500 block">Rate/L (PKR)</label>
                    <input type="number" value={formRate} onChange={e => setFormRate(Number(e.target.value))} className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white" />
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-gray-500 block">Fat %</label>
                    <input type="number" step="0.1" value={formFat} onChange={e => setFormFat(Number(e.target.value))} className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-gray-500 block">SNF %</label>
                    <input type="number" step="0.1" value={formSnf} onChange={e => setFormSnf(Number(e.target.value))} className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white" />
                  </div>
                  <div className="space-y-1 sm:col-span-2" />
                </div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-slate-950/60 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
                <p className="text-xs font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-1">Bank Details (Optional)</p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-gray-500 block">Bank Name</label>
                    <input type="text" value={formBank} onChange={e => setFormBank(e.target.value)} placeholder="HBL" className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-gray-500 block">Account Title</label>
                    <input type="text" value={formAccTitle} onChange={e => setFormAccTitle(e.target.value)} className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-gray-500 block">IBAN</label>
                    <input type="text" value={formIban} onChange={e => setFormIban(e.target.value)} className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800 pt-4 mt-4">
                <button type="button" onClick={() => { setShowEditModal(false); setEditingSuppId(null); resetSuppForm(); }} className="px-4 py-2 text-xs font-semibold bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 rounded-xl cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-2 text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 rounded-xl transition-all shadow-md shadow-blue-500/25 cursor-pointer">Update Supplier</button>
              </div>
            </form>

          </div>
        </div>
        </ModalPortal>
      )}

    </div>
  );
};
