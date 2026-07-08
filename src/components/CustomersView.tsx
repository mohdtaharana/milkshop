/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Customer, CustomerType, PaymentMethod } from "../types";
import { 
  Plus, Search, SlidersHorizontal, User2, MapPin, Phone, CreditCard, 
  Trash2, Edit3, X, Eye, DollarSign, Wallet, FileSpreadsheet, CheckCircle2 
} from "lucide-react";

export const CustomersView: React.FC = () => {
  const { 
    customers, addCustomer, updateCustomer, deleteCustomer, 
    addPayment, formatCurrency, formatNumber, t, direction, routes 
  } = useApp();

  // Navigation sub-states
  const [selectedCustId, setSelectedCustId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [areaFilter, setAreaFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Add customer form state
  const [formName, setFormName] = useState("");
  const [formFather, setFormFather] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formAltPhone, setFormAltPhone] = useState("");
  const [formAddress, setFormAddress] = useState("");
  const [formArea, setFormArea] = useState("");
  const [formCity, setFormCity] = useState("Lahore");
  const [formCnic, setFormCnic] = useState("");
  const [formType, setFormType] = useState<CustomerType>(CustomerType.RESIDENTIAL);
  const [formQtyM, setFormQtyM] = useState<number>(2);
  const [formQtyE, setFormQtyE] = useState<number>(2);
  const [formRate, setFormRate] = useState<number>(190);
  const [formCreditLimit, setFormCreditLimit] = useState<number>(20000);
  const [formAdvance, setFormAdvance] = useState<number>(0);
  const [formRoute, setFormRoute] = useState("ROUTE-01");
  const [formNotes, setFormNotes] = useState("");
  const [formError, setFormError] = useState("");

  // Payment form state
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMethod, setPayMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
  const [payRef, setPayRef] = useState("");
  const [payError, setPayError] = useState("");

  const selectedCustomer = customers.find(c => c.id === selectedCustId);

  // Form submit handler
  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    // Simple validation
    if (!formName.trim() || !formPhone.trim() || !formAddress.trim() || !formArea.trim()) {
      setFormError("Please fill out all mandatory fields: Name, Phone, Address, Area.");
      return;
    }

    if (formPhone.length < 10) {
      setFormError("Phone number must be at least 10 characters long.");
      return;
    }

    addCustomer({
      name: formName,
      fatherName: formFather || "N/A",
      phone: formPhone,
      altPhone: formAltPhone,
      address: formAddress,
      area: formArea,
      city: formCity,
      cnic: formCnic || "N/A",
      type: formType,
      dailyQtyMorning: Number(formQtyM),
      dailyQtyEvening: Number(formQtyE),
      rate: Number(formRate),
      advancePayment: Number(formAdvance),
      creditLimit: Number(formCreditLimit),
      deliveryAddress: formAddress,
      deliveryRouteId: formRoute,
      status: "Active",
      notes: formNotes
    });

    // Reset Form
    setFormName("");
    setFormFather("");
    setFormPhone("");
    setFormAltPhone("");
    setFormAddress("");
    setFormArea("");
    setFormCnic("");
    setFormQtyM(2);
    setFormQtyE(2);
    setFormRate(190);
    setFormCreditLimit(20000);
    setFormAdvance(0);
    setFormNotes("");
    setShowAddModal(false);
  };

  // Payment submit handler
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPayError("");

    if (!selectedCustId || !selectedCustomer) return;

    if (payAmount <= 0) {
      setPayError("Payment amount must be greater than 0.");
      return;
    }

    addPayment({
      type: "Customer Payment",
      partyId: selectedCustId,
      partyName: selectedCustomer.name,
      amount: Number(payAmount),
      paymentMethod: payMethod,
      referenceNo: payRef || "MANUAL-PAY"
    });

    setPayAmount(0);
    setPayRef("");
    setShowPayModal(false);
    alert(t("successRecord"));
  };

  // Extract unique areas for filtering
  const uniqueAreas = Array.from(new Set(customers.map(c => c.area)));

  // Filtered list
  const filteredCustomers = customers.filter(cust => {
    const matchesSearch = 
      (cust.name || "").toLowerCase().includes((searchQuery || "").toLowerCase()) ||
      (cust.phone || "").includes(searchQuery || "") ||
      (cust.area || "").toLowerCase().includes((searchQuery || "").toLowerCase()) ||
      (cust.fatherName && cust.fatherName.toLowerCase().includes((searchQuery || "").toLowerCase()));

    const matchesType = typeFilter === "All" || cust.type === typeFilter;
    const matchesArea = areaFilter === "All" || cust.area === areaFilter;
    const matchesStatus = statusFilter === "All" || cust.status === statusFilter;

    return matchesSearch && matchesType && matchesArea && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <User2 className="w-6 h-6 text-blue-600" />
            <span>{t("customerList")}</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Digitised Khata Ledger records and delivery quantities
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-md shadow-blue-500/25 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t("addCustomer")}</span>
        </button>
      </div>

      {/* Main Body: If customer ledger is selected, show Ledger details, otherwise show Table */}
      {selectedCustomer ? (
        
        /* ---------------- CUSTOMER LEDGER DETAIL VIEW ---------------- */
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          {/* Cover Header */}
          <div className="bg-slate-950 p-6 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-base">
                {selectedCustomer.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <span>{selectedCustomer.name}</span>
                  <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full font-mono uppercase">
                    {selectedCustomer.type}
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Father's Name: <span className="text-slate-200 font-medium">{selectedCustomer.fatherName}</span> • CNIC: <span className="text-slate-200 font-mono">{selectedCustomer.cnic}</span>
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setShowPayModal(true)}
                className="px-3.5 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-500/25"
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>Receive Payment</span>
              </button>
              <button 
                onClick={() => {
                  if (confirm("Are you sure you want to delete this customer?")) {
                    deleteCustomer(selectedCustomer.id);
                    setSelectedCustId(null);
                  }
                }}
                className="px-3 py-1.5 text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t("delete")}</span>
              </button>
              <button 
                onClick={() => setSelectedCustId(null)}
                className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer"
              >
                {t("backToList")}
              </button>
            </div>
          </div>

          {/* Quick Stats Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
            <div className="p-3 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl flex items-center gap-3">
              <Wallet className="w-8 h-8 text-blue-500 flex-shrink-0" />
              <div>
                <p className="text-[10px] text-gray-500 font-mono uppercase">{t("balance")}</p>
                <h4 className={`text-base font-black ${selectedCustomer.remainingBalance > 0 ? "text-rose-500" : "text-emerald-500"}`}>
                  {formatCurrency(selectedCustomer.remainingBalance)}
                </h4>
              </div>
            </div>

            <div className="p-3 bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-xl flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-blue-500 flex-shrink-0" />
              <div>
                <p className="text-[10px] text-gray-500 font-mono uppercase">Est. Monthly Bill</p>
                <h4 className="text-base font-black text-gray-900 dark:text-white">
                  {formatCurrency(selectedCustomer.monthlyBillEstimate)}
                </h4>
              </div>
            </div>

            <div className="p-3 bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-xl flex items-center gap-3">
              <Eye className="w-8 h-8 text-purple-500 flex-shrink-0" />
              <div>
                <p className="text-[10px] text-gray-500 font-mono uppercase">Daily Quota (M/E)</p>
                <h4 className="text-base font-black text-gray-900 dark:text-white">
                  {selectedCustomer.dailyQtyMorning}L / {selectedCustomer.dailyQtyEvening}L
                </h4>
              </div>
            </div>

            <div className="p-3 bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-xl flex items-center gap-3">
              <CreditCard className="w-8 h-8 text-amber-500 flex-shrink-0" />
              <div>
                <p className="text-[10px] text-gray-500 font-mono uppercase">Rate Applied</p>
                <h4 className="text-base font-black text-gray-900 dark:text-white">
                  Rs. {selectedCustomer.rate}/L
                </h4>
              </div>
            </div>
          </div>

          {/* Ledger Core Profile Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            
            {/* Left Column: Contact and Route Details */}
            <div className="space-y-4 lg:col-span-1 border-r border-slate-100 dark:border-slate-800 pr-0 lg:pr-6">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">Customer Profile</h3>
              
              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Phone className="w-4 h-4 text-blue-500" />
                  <span>Phone: <b className="text-slate-900 dark:text-white">{selectedCustomer.phone}</b></span>
                </div>
                {selectedCustomer.altPhone && (
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Phone className="w-4 h-4 text-blue-500" />
                    <span>Alt Phone: <b className="text-slate-900 dark:text-white">{selectedCustomer.altPhone}</b></span>
                  </div>
                )}
                <div className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                  <MapPin className="w-4 h-4 text-blue-500 mt-0.5" />
                  <span>Address: <b className="text-slate-900 dark:text-white">{selectedCustomer.address}</b></span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <span>Area: <b className="text-slate-900 dark:text-white">{selectedCustomer.area}, {selectedCustomer.city}</b></span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl space-y-1.5">
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Delivery Metadata</p>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300">Route Code: <span className="font-bold">{selectedCustomer.deliveryRouteId}</span></p>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300">Credit Limit: <span className="font-bold text-rose-500">{formatCurrency(selectedCustomer.creditLimit)}</span></p>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300">Last Payment: <span className="font-mono font-bold">{selectedCustomer.lastPaymentDate || "Never"}</span></p>
                </div>
                {selectedCustomer.notes && (
                  <div className="p-3 bg-amber-500/5 border border-amber-500/15 text-amber-600 dark:text-amber-400 rounded-xl text-[11px]">
                    <b>Special Notes:</b> {selectedCustomer.notes}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Transaction Ledger Logs */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-blue-500" />
                <span>Ledger Statement logs</span>
              </h3>

              {/* Ledger logs (Mocked) */}
              <div className="border border-slate-150 dark:border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-gray-50 dark:bg-slate-950 text-gray-500 font-mono">
                    <tr>
                      <th className="p-3">Date</th>
                      <th className="p-3">Description</th>
                      <th className="p-3">Debit (Billing)</th>
                      <th className="p-3">Credit (Received)</th>
                      <th className="p-3">Running Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-gray-700 dark:text-slate-300">
                    <tr>
                      <td className="p-3 font-mono">2026-07-01</td>
                      <td className="p-3">Opening balance forward</td>
                      <td className="p-3">₨ 15,000</td>
                      <td className="p-3">—</td>
                      <td className="p-3 font-mono">₨ 15,000</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono">2026-07-02</td>
                      <td className="p-3">Payment received (Ref LESCO/Cash)</td>
                      <td className="p-3">—</td>
                      <td className="p-3 text-emerald-500">₨ 10,000</td>
                      <td className="p-3 font-mono">₨ 5,000</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono">2026-07-07</td>
                      <td className="p-3">Invoice Billing (SUB-INV-10201)</td>
                      <td className="p-3 text-rose-500">₨ 44,550</td>
                      <td className="p-3">—</td>
                      <td className="p-3 font-mono font-bold">₨ 49,550</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono">2026-07-07</td>
                      <td className="p-3">Cash installment received</td>
                      <td className="p-3">—</td>
                      <td className="p-3 text-emerald-500">₨ 40,000</td>
                      <td className="p-3 font-mono font-bold text-rose-500">₨ 9,550</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>

      ) : (

        /* ---------------- CUSTOMER DATABASE DATAGRID ---------------- */
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          
          {/* Controls bar */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-3 justify-between items-center bg-slate-50/50 dark:bg-slate-950/10">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute top-3 left-3" />
              <input 
                type="text" 
                placeholder="Search customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 border border-slate-200 dark:border-slate-700 pl-9 pr-4 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:bg-slate-950 dark:text-white"
              />
            </div>

            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <select 
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="h-10 border border-slate-200 dark:border-slate-700 rounded-xl text-xs px-3 dark:bg-slate-950 dark:text-white cursor-pointer"
              >
                <option value="All">All Types</option>
                {Object.values(CustomerType).map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>

              <select 
                value={areaFilter}
                onChange={(e) => setAreaFilter(e.target.value)}
                className="h-10 border border-slate-200 dark:border-slate-700 rounded-xl text-xs px-3 dark:bg-slate-950 dark:text-white cursor-pointer"
              >
                <option value="All">All Areas</option>
                {uniqueAreas.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-500 font-mono text-xs uppercase bg-slate-50/40 dark:bg-slate-950/20 whitespace-nowrap">
                  <th className="p-4">{t("customerName")}</th>
                  <th className="p-4">{t("phone")}</th>
                  <th className="p-4">Area & Route</th>
                  <th className="p-4 text-right">Daily Morning / Evening Quotas</th>
                  <th className="p-4 text-right">Current Ledger Khata Balance</th>
                  <th className="p-4 text-center">{t("actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-400">
                      No customer records found matching filter.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map(cust => (
                    <tr key={cust.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-950/20 transition-colors whitespace-nowrap">
                      <td className="p-4">
                        <div className="font-bold text-slate-900 dark:text-white">{cust.name}</div>
                        <div className="text-[10px] text-gray-400 font-mono mt-0.5">{cust.type} • Father: {cust.fatherName}</div>
                      </td>
                      <td className="p-4 font-mono text-slate-600 dark:text-slate-400">
                        {cust.phone}
                      </td>
                      <td className="p-4">
                        <div className="text-slate-900 dark:text-white font-medium">{cust.area}</div>
                        <div className="text-[10px] text-blue-500 font-mono mt-0.5">Route ID: {cust.deliveryRouteId}</div>
                      </td>
                      <td className="p-4 text-right">
                        <span className="font-bold text-slate-900 dark:text-white">{cust.dailyQtyMorning}L</span> morning / <span className="font-bold text-slate-900 dark:text-white">{cust.dailyQtyEvening}L</span> evening
                        <div className="text-[10px] text-gray-400 font-mono">Rs. {cust.rate}/L rate</div>
                      </td>
                      <td className="p-4 text-right">
                        <div className={`font-black font-sans ${cust.remainingBalance > 0 ? "text-rose-500" : cust.remainingBalance < 0 ? "text-emerald-500" : "text-gray-400"}`}>
                           {cust.remainingBalance > 0 ? `+${formatCurrency(cust.remainingBalance)}` : cust.remainingBalance < 0 ? `${formatCurrency(cust.remainingBalance)} (Adv)` : "Balanced"}
                        </div>
                        <div className="text-[9px] text-gray-400 font-mono">Limit: Rs. {cust.creditLimit}</div>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => setSelectedCustId(cust.id)}
                          className="px-2.5 py-1.5 text-[11px] font-bold bg-blue-500/10 hover:bg-blue-600 text-blue-600 dark:text-blue-400 hover:text-white border border-blue-500/10 rounded-lg transition-all cursor-pointer"
                        >
                          Ledger Khata
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>

      )}

      {/* ----------------- DIALOG MODAL: ADD CUSTOMER ----------------- */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs px-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-950 text-white flex justify-between items-center">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-450" />
                <span>{t("addCustomer")}</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleAddCustomer} className="flex-1 overflow-y-auto p-6 space-y-4">
              
              {formError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs rounded-xl font-medium">
                  {formError}
                </div>
              )}

              {/* Grid 1: Name and Father's Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-gray-500 block">Customer Name *</label>
                  <input 
                    type="text" 
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Muhammad Ali"
                    className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-gray-500 block">Father Name</label>
                  <input 
                    type="text" 
                    value={formFather}
                    onChange={(e) => setFormFather(e.target.value)}
                    placeholder="Tariq Butt"
                    className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white"
                  />
                </div>
              </div>

              {/* Grid 2: Contacts and CNIC */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-gray-500 block">Phone Number *</label>
                  <input 
                    type="text" 
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="0300-1234567"
                    className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-gray-500 block">Alternative Phone</label>
                  <input 
                    type="text" 
                    value={formAltPhone}
                    onChange={(e) => setFormAltPhone(e.target.value)}
                    placeholder="0321-7654321"
                    className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-gray-500 block">CNIC Number</label>
                  <input 
                    type="text" 
                    value={formCnic}
                    onChange={(e) => setFormCnic(e.target.value)}
                    placeholder="35202-1234567-9"
                    className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white"
                  />
                </div>
              </div>

              {/* Grid 3: Area and Address */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11px] font-mono uppercase text-gray-500 block">Address *</label>
                  <input 
                    type="text" 
                    value={formAddress}
                    onChange={(e) => setFormAddress(e.target.value)}
                    placeholder="House 24, Street 2, Samanabad"
                    className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-gray-500 block">Area / Mohallah *</label>
                  <input 
                    type="text" 
                    value={formArea}
                    onChange={(e) => setFormArea(e.target.value)}
                    placeholder="Samanabad"
                    className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white"
                  />
                </div>
              </div>

              {/* Grid 4: Business Parameters & Daily milk requirements */}
              <div className="p-4 bg-gray-50 dark:bg-slate-950/60 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
                <p className="text-xs font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-1">
                  Business Contract Parameters
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono uppercase text-gray-500 block">Customer Type</label>
                    <select 
                      value={formType}
                      onChange={(e) => setFormType(e.target.value as CustomerType)}
                      className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white cursor-pointer"
                    >
                      {Object.values(CustomerType).map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono uppercase text-gray-500 block">Delivery Route</label>
                    <select 
                      value={formRoute}
                      onChange={(e) => setFormRoute(e.target.value)}
                      className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white cursor-pointer"
                    >
                      {routes.map(r => (
                        <option key={r.id} value={r.id}>{r.routeName}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono uppercase text-gray-500 block">Rate per Litre (PKR)</label>
                    <input 
                      type="number" 
                      value={formRate}
                      onChange={(e) => setFormRate(Number(e.target.value))}
                      className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono uppercase text-gray-500 block">Morning Qty (Ltr)</label>
                    <input 
                      type="number" 
                      value={formQtyM}
                      onChange={(e) => setFormQtyM(Number(e.target.value))}
                      className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono uppercase text-gray-500 block">Evening Qty (Ltr)</label>
                    <input 
                      type="number" 
                      value={formQtyE}
                      onChange={(e) => setFormQtyE(Number(e.target.value))}
                      className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono uppercase text-gray-500 block">Credit Limit (PKR)</label>
                    <input 
                      type="number" 
                      value={formCreditLimit}
                      onChange={(e) => setFormCreditLimit(Number(e.target.value))}
                      className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono uppercase text-gray-500 block">Opening Advance (PKR)</label>
                    <input 
                      type="number" 
                      value={formAdvance}
                      onChange={(e) => setFormAdvance(Number(e.target.value))}
                      className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase text-gray-500 block">Special delivery notes / remarks</label>
                <textarea 
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="E.g., Requires delivery exactly before 7:00 AM."
                  rows={2}
                  className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white"
                />
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
                  Save Customer
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ----------------- DIALOG MODAL: RECEIVE PAYMENT ----------------- */}
      {showPayModal && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs px-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
            
            <div className="p-5 border-b border-gray-100 dark:border-slate-800 bg-slate-950 text-white flex justify-between items-center">
              <h3 className="text-base font-bold">Clear Khata Balance: {selectedCustomer.name}</h3>
              <button onClick={() => setShowPayModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePaymentSubmit} className="p-6 space-y-4">
              {payError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs rounded-xl font-medium">
                  {payError}
                </div>
              )}

              <div className="p-3.5 bg-rose-500/5 border border-rose-500/10 rounded-2xl flex justify-between items-center text-xs">
                <span className="text-gray-500 font-medium">Receivable Khata Balance:</span>
                <span className="font-extrabold text-rose-500 text-sm font-sans">{formatCurrency(selectedCustomer.remainingBalance)}</span>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase text-gray-500 block">Received Amount (PKR) *</label>
                <input 
                  type="number" 
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  placeholder="Rs. 5,000"
                  className="w-full h-11 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white font-sans font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase text-gray-500 block">Payment Method</label>
                <select 
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as PaymentMethod)}
                  className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white cursor-pointer"
                >
                  {Object.values(PaymentMethod).map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase text-gray-500 block">Reference No / Bank Slip ID</label>
                <input 
                  type="text" 
                  value={payRef}
                  onChange={(e) => setPayRef(e.target.value)}
                  placeholder="E.g. JazzCash RefID, Chq #22101"
                  className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800 pt-4 mt-4">
                <button 
                  type="button" 
                  onClick={() => setShowPayModal(false)}
                  className="px-4 py-2 text-xs font-semibold bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-600 rounded-xl transition-all shadow-md shadow-emerald-500/25 cursor-pointer"
                >
                  Confirm & Clear Khata
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
