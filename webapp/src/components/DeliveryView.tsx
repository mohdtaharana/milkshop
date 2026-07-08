import React, { useState, useEffect, useCallback } from "react";
import { useApp } from "../context/AppContext";
import { ModalPortal } from "./ModalPortal";
import { DeliveryCustomer, DeliveryRecord, DeliveryPayment } from "../types";
import {
  Plus, Search, User2, MapPin, Phone, Clock, Droplets,
  Trash2, X, DollarSign, Wallet, Eye, CheckCircle2, XCircle,
  CreditCard, CalendarDays, List
} from "lucide-react";

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

function currentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export const DeliveryView: React.FC = () => {
  const {
    deliveryCustomers, deliveryRecords, deliveryPayments,
    addDeliveryCustomer, updateDeliveryCustomer, deleteDeliveryCustomer,
    addDeliveryRecord, updateDeliveryRecord, addDeliveryPayment,
    fetchDeliveryRecords, fetchDeliveryPayments,
    formatCurrency, formatNumber, t, direction
  } = useApp();

  const [selectedCustId, setSelectedCustId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDelCustId, setEditingDelCustId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [recordMonth, setRecordMonth] = useState(currentMonth());

  // Add form state
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formAltPhone, setFormAltPhone] = useState("");
  const [formColony, setFormColony] = useState("");
  const [formStreet, setFormStreet] = useState("");
  const [formSector, setFormSector] = useState("");
  const [formHouseNo, setFormHouseNo] = useState("");
  const [formAddressLine, setFormAddressLine] = useState("");
  const [formQty, setFormQty] = useState(1);
  const [formDeliveryTime, setFormDeliveryTime] = useState("Morning");
  const [formRate, setFormRate] = useState(190);
  const [formBillType, setFormBillType] = useState<"per_litre" | "fixed_monthly">("per_litre");
  const [formMonthlyFee, setFormMonthlyFee] = useState(0);
  const [formAdvance, setFormAdvance] = useState(0);
  const [formNotes, setFormNotes] = useState("");
  const [formError, setFormError] = useState("");

  // Payment form state
  const [payAmount, setPayAmount] = useState(0);
  const [payMonth, setPayMonth] = useState(currentMonth());
  const [payMethod, setPayMethod] = useState("Cash");
  const [payRef, setPayRef] = useState("");
  const [payError, setPayError] = useState("");

  const selectedCust = deliveryCustomers.find(c => c.id === selectedCustId);
  const custRecords = deliveryRecords.filter(r => r.customerId === selectedCustId);
  const custPayments = deliveryPayments.filter(p => p.customerId === selectedCustId);

  // Load records/payments when selecting a customer or changing month
  useEffect(() => {
    if (selectedCustId) {
      fetchDeliveryRecords(selectedCustId, recordMonth);
      fetchDeliveryPayments(selectedCustId);
    }
  }, [selectedCustId, recordMonth, fetchDeliveryRecords, fetchDeliveryPayments]);

  // Filter customers
  const filtered = deliveryCustomers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery) ||
    (c.colony || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Add customer handler
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!formName.trim() || !formPhone.trim()) {
      setFormError("Name and Phone are required");
      return;
    }
    try {
      await addDeliveryCustomer({
        name: formName, phone: formPhone, altPhone: formAltPhone || undefined,
        colony: formColony || undefined, street: formStreet || undefined,
        sector: formSector || undefined, houseNo: formHouseNo || undefined,
        addressLine: formAddressLine || undefined,
        milkQuantity: formQty, deliveryTime: formDeliveryTime,
        monthlyRate: formRate, billType: formBillType,
        monthlyFee: formBillType === "fixed_monthly" ? formMonthlyFee : 0,
        pendingBalance: formAdvance > 0 ? -formAdvance : 0,
        notes: formNotes || undefined, status: "Active",
      });
      setShowAddModal(false);
      resetForm();
    } catch (err: any) {
      setFormError(err.message || "Failed to save customer. Check console for details.");
      console.error("Add delivery customer error:", err);
    }
  };

  const resetForm = () => {
    setFormName(""); setFormPhone(""); setFormAltPhone("");
    setFormColony(""); setFormStreet(""); setFormSector("");
    setFormHouseNo(""); setFormAddressLine("");
    setFormQty(1); setFormDeliveryTime("Morning");
    setFormRate(190); setFormBillType("per_litre");
    setFormMonthlyFee(0); setFormAdvance(0); setFormNotes("");
    setFormError("");
  };

  // Edit customer handler
  const handleEditDelCust = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!editingDelCustId) return;
    if (!formName.trim() || !formPhone.trim()) {
      setFormError("Name and Phone are required");
      return;
    }
    try {
      await updateDeliveryCustomer(editingDelCustId, {
        name: formName, phone: formPhone, altPhone: formAltPhone || undefined,
        colony: formColony || undefined, street: formStreet || undefined,
        sector: formSector || undefined, houseNo: formHouseNo || undefined,
        addressLine: formAddressLine || undefined,
        milkQuantity: formQty, deliveryTime: formDeliveryTime,
        monthlyRate: formRate, billType: formBillType,
        monthlyFee: formBillType === "fixed_monthly" ? formMonthlyFee : 0,
        notes: formNotes || undefined,
      });
      setShowEditModal(false);
      setEditingDelCustId(null);
    } catch (err: any) {
      setFormError(err.message || "Failed to update");
      console.error("Edit delivery customer error:", err);
    }
  };

  const openEditDelCust = (cust: DeliveryCustomer) => {
    setFormName(cust.name); setFormPhone(cust.phone); setFormAltPhone(cust.altPhone || "");
    setFormColony(cust.colony || ""); setFormStreet(cust.street || "");
    setFormSector(cust.sector || ""); setFormHouseNo(cust.houseNo || "");
    setFormAddressLine(cust.addressLine || "");
    setFormQty(cust.milkQuantity); setFormDeliveryTime(cust.deliveryTime);
    setFormRate(cust.monthlyRate); setFormBillType(cust.billType);
    setFormMonthlyFee(cust.monthlyFee); setFormAdvance(0); setFormNotes(cust.notes || "");
    setEditingDelCustId(cust.id);
    setShowEditModal(true);
  };

  // Toggle delivery record for a date
  const toggleRecord = useCallback(async (date: string, currentRecord?: DeliveryRecord) => {
    if (!selectedCustId) return;
    try {
      if (currentRecord) {
        await updateDeliveryRecord(currentRecord.id, {
          delivered: !currentRecord.delivered,
          quantity: !currentRecord.delivered ? (selectedCust?.milkQuantity || 1) : 0,
        });
      } else {
        await addDeliveryRecord({
          customerId: selectedCustId, date,
          delivered: true, quantity: selectedCust?.milkQuantity || 1,
        });
      }
      fetchDeliveryRecords(selectedCustId, recordMonth);
    } catch (err) {
      console.error("Toggle record error:", err);
    }
  }, [selectedCustId, selectedCust, recordMonth, addDeliveryRecord, updateDeliveryRecord, fetchDeliveryRecords]);

  // Pay handler
  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setPayError("");
    if (!selectedCustId || payAmount <= 0) {
      setPayError("Amount must be greater than 0");
      return;
    }
    try {
      await addDeliveryPayment({
        customerId: selectedCustId, amount: payAmount,
        month: payMonth, paymentMethod: payMethod,
        paymentDate: todayStr(), notes: payRef || undefined,
      });
      setPayAmount(0); setPayRef("");
      setShowPayModal(false);
      fetchDeliveryPayments(selectedCustId);
    } catch (err: any) {
      setPayError(err.message || "Payment failed");
    }
  };

  // Calculate month stats
  const monthDeliveries = custRecords.filter(r => r.delivered);
  const monthTotalQty = monthDeliveries.reduce((s, r) => s + (r.quantity || 0), 0);
  const monthBillAmount = selectedCust?.billType === "fixed_monthly"
    ? (selectedCust.monthlyFee || 0)
    : monthTotalQty * (selectedCust?.monthlyRate || 0);

  const selectedYear = parseInt(recordMonth.split('-')[0]);
  const selectedMonth = parseInt(recordMonth.split('-')[1]) - 1;
  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);

  // Generate date strings for the month
  const datesInMonth = Array.from({ length: daysInMonth }, (_, i) => {
    const d = new Date(selectedYear, selectedMonth, i + 1);
    return d.toISOString().split('T')[0];
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Droplets className="w-6 h-6 text-blue-600" />
            <span>Monthly Delivery Customers</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Track daily milk deliveries and monthly billing
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-md shadow-blue-500/25 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Customer</span>
        </button>
      </div>

      {/* Main Body */}
      {selectedCust ? (
        /* ---------------- DETAIL VIEW ---------------- */
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-slate-950 p-4 lg:p-6 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-base">
                {selectedCust.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-lg font-bold">{selectedCust.name}</h2>
                <p className="text-xs text-slate-400">{selectedCust.phone} {selectedCust.altPhone ? `• ${selectedCust.altPhone}` : ""}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => openEditDelCust(selectedCust)}
                className="px-3 py-1.5 text-xs font-semibold bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-lg flex items-center gap-1 cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={() => setShowPayModal(true)}
                className="px-3.5 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/25"
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>Receive Payment</span>
              </button>
              <button
                onClick={() => {
                  if (confirm("Delete this customer and all records?")) {
                    deleteDeliveryCustomer(selectedCust.id);
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

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-4 lg:p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
            <div className="p-3 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl">
              <p className="text-[10px] text-gray-500 font-mono uppercase">Pending Balance</p>
              <p className={`text-lg font-black mt-1 ${selectedCust.pendingBalance > 0 ? "text-rose-500" : "text-emerald-500"}`}>
                {formatCurrency(selectedCust.pendingBalance)}
              </p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl">
              <p className="text-[10px] text-gray-500 font-mono uppercase">Monthly Bill</p>
              <p className="text-lg font-black text-slate-900 dark:text-white mt-1">{formatCurrency(monthBillAmount)}</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl">
              <p className="text-[10px] text-gray-500 font-mono uppercase">This Month Delivered</p>
              <p className="text-lg font-black text-blue-600 mt-1">{monthDeliveries.length} / {daysInMonth} days</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl">
              <p className="text-[10px] text-gray-500 font-mono uppercase">Total Qty (Month)</p>
              <p className="text-lg font-black text-slate-900 dark:text-white mt-1">{formatNumber(monthTotalQty)} L</p>
            </div>
          </div>

          {/* Profile + Records */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 p-4 lg:p-6">
            {/* Left: Profile */}
            <div className="space-y-4 lg:col-span-1 lg:border-r border-slate-100 dark:border-slate-800 lg:pr-6">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">Address & Details</h3>
              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Phone className="w-4 h-4 text-blue-500 shrink-0" />
                  <span className="break-words">Phone: <b className="text-slate-900 dark:text-white">{selectedCust.phone}</b></span>
                </div>
                {selectedCust.altPhone && (
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Phone className="w-4 h-4 text-blue-500 shrink-0" />
                    <span className="break-words">Alt: <b className="text-slate-900 dark:text-white">{selectedCust.altPhone}</b></span>
                  </div>
                )}
                {selectedCust.houseNo && (
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
                    <span className="break-words">House: <b className="text-slate-900 dark:text-white">{selectedCust.houseNo}</b></span>
                  </div>
                )}
                {selectedCust.colony && (
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>Colony: <b className="text-slate-900 dark:text-white">{selectedCust.colony}</b></span>
                  </div>
                )}
                {selectedCust.street && (
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>Street: <b className="text-slate-900 dark:text-white">{selectedCust.street}</b></span>
                  </div>
                )}
                {selectedCust.sector && (
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>Sector: <b className="text-slate-900 dark:text-white">{selectedCust.sector}</b></span>
                  </div>
                )}
                {selectedCust.addressLine && (
                  <div className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                    <MapPin className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                    <span className="break-words">Address: <b className="text-slate-900 dark:text-white">{selectedCust.addressLine}</b></span>
                  </div>
                )}
                <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl space-y-1.5">
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Delivery Settings</p>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300">
                    Time: <span className="font-bold text-blue-600">{selectedCust.deliveryTime}</span>
                  </p>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300">
                    Quantity: <span className="font-bold">{selectedCust.milkQuantity}L/day</span>
                  </p>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300">
                    Rate: <span className="font-bold">Rs. {selectedCust.monthlyRate}/L</span>
                  </p>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300">
                    Billing: <span className="font-bold capitalize">{selectedCust.billType === "fixed_monthly" ? `Fixed Rs. ${selectedCust.monthlyFee}/month` : "Per Litre"}</span>
                  </p>
                </div>
                {selectedCust.notes && (
                  <div className="p-3 bg-amber-500/5 border border-amber-500/15 text-amber-600 dark:text-amber-400 rounded-xl text-[11px]">
                    <b>Notes:</b> {selectedCust.notes}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Daily Records */}
            <div className="lg:col-span-2 space-y-4">
              {/* Month selector */}
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-blue-500" />
                  <span>Daily Delivery Records</span>
                </h3>
                <input
                  type="month"
                  value={recordMonth}
                  onChange={(e) => setRecordMonth(e.target.value)}
                  className="h-9 px-3 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-950 dark:text-white cursor-pointer"
                />
              </div>

              {/* Records Grid */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                {datesInMonth.length === 0 ? (
                  <p className="text-center py-8 text-slate-400 text-xs">No data</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-1 p-2">
                    {datesInMonth.map(date => {
                      const record = custRecords.find(r => r.date === date);
                      const isDelivered = record?.delivered || false;
                      const isToday = date === todayStr();
                      const isFuture = date > todayStr();
                      const dayNum = new Date(date).getDate();
                      return (
                        <button
                          key={date}
                          onClick={isFuture ? undefined : () => toggleRecord(date, record)}
                          disabled={isFuture}
                          className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-xs transition-all
                            ${isFuture ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}
                            ${isToday ? "ring-2 ring-blue-500" : ""}
                            ${isDelivered
                              ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300"
                              : isFuture
                                ? "bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-600"
                                : "bg-slate-50 dark:bg-slate-950/30 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400"
                            }
                            ${isFuture ? "" : "hover:scale-105 active:scale-95"}
                          `}
                        >
                          <span className="text-[10px] font-bold">{dayNum}</span>
                          {isDelivered ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <XCircle className={`w-4 h-4 ${isFuture ? "text-slate-300 dark:text-slate-700" : "text-slate-300 dark:text-slate-600"}`} />
                          )}
                          {record?.quantity && isDelivered ? (
                            <span className="text-[9px] font-mono">{record.quantity}L</span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Payment History */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 flex justify-between items-center">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Wallet className="w-3.5 h-3.5 text-blue-500" />
                    <span>Payment History</span>
                  </h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left min-w-[400px]">
                    <thead className="bg-gray-50 dark:bg-slate-950 text-gray-500 font-mono">
                      <tr>
                        <th className="p-3">Date</th>
                        <th className="p-3">Month</th>
                        <th className="p-3 text-right">Amount</th>
                        <th className="p-3">Method</th>
                        <th className="p-3">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-gray-700 dark:text-slate-300">
                      {custPayments.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-6 text-center text-slate-400">No payments recorded</td>
                        </tr>
                      ) : (
                        custPayments.map(p => (
                          <tr key={p.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-950/20">
                            <td className="p-3 font-mono">{p.paymentDate}</td>
                            <td className="p-3 font-mono">{p.month}</td>
                            <td className="p-3 text-right font-mono font-bold text-emerald-500">{formatCurrency(p.amount)}</td>
                            <td className="p-3">{p.paymentMethod}</td>
                            <td className="p-3 text-slate-400">{p.notes || "—"}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ---------------- LIST VIEW ---------------- */
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute top-3 left-3" />
              <input
                type="text"
                placeholder="Search by name, phone, colony..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 border border-slate-200 dark:border-slate-700 pl-9 pr-4 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:bg-slate-950 dark:text-white"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-500 font-mono text-xs uppercase bg-slate-50/40 dark:bg-slate-950/20 whitespace-nowrap">
                  <th className="p-4">Name</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Colony / Area</th>
                  <th className="p-4 text-center">Qty (L)</th>
                  <th className="p-4 text-center">Time</th>
                  <th className="p-4 text-right">Pending</th>
                  <th className="p-4 text-center">{t("actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-slate-400">No delivery customers found</td>
                  </tr>
                ) : (
                  filtered.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-950/20 transition-colors whitespace-nowrap">
                      <td className="p-4">
                        <div className="font-bold text-slate-900 dark:text-white">{c.name}</div>
                        <div className="text-[10px] text-gray-400">{c.houseNo ? `House ${c.houseNo}` : ""}{c.colony ? `, ${c.colony}` : ""}</div>
                      </td>
                      <td className="p-4 font-mono text-slate-600 dark:text-slate-400">{c.phone}</td>
                      <td className="p-4 text-slate-600 dark:text-slate-400">{(c.colony || c.sector || c.street) ? [c.colony, c.sector, c.street].filter(Boolean).join(", ") : "—"}</td>
                      <td className="p-4 text-center font-bold text-slate-900 dark:text-white">{c.milkQuantity}L</td>
                      <td className="p-4 text-center text-slate-600 dark:text-slate-400">{c.deliveryTime}</td>
                      <td className="p-4 text-right">
                        <span className={`font-black font-sans ${c.pendingBalance > 0 ? "text-rose-500" : c.pendingBalance < 0 ? "text-emerald-500" : "text-gray-400"}`}>
                          {c.pendingBalance > 0 ? formatCurrency(c.pendingBalance) : c.pendingBalance < 0 ? `${formatCurrency(Math.abs(c.pendingBalance))} Adv` : "Clear"}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => setSelectedCustId(c.id)}
                          className="px-2.5 py-1.5 text-[11px] font-bold bg-blue-500/10 hover:bg-blue-600 text-blue-600 dark:text-blue-400 hover:text-white border border-blue-500/10 rounded-lg transition-all cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 inline mr-1" />
                          Details
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

      {/* ADD CUSTOMER MODAL */}
      {showAddModal && (
        <ModalPortal onClose={() => { setShowAddModal(false); resetForm(); }}>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs px-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-950 text-white flex justify-between items-center">
                <h3 className="text-base font-bold flex items-center gap-2">
                  <Plus className="w-5 h-5 text-blue-450" />
                  <span>Add Delivery Customer</span>
                </h3>
                <button onClick={() => { setShowAddModal(false); resetForm(); }} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAdd} className="flex-1 overflow-y-auto p-6 space-y-4">
                {formError && <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs rounded-xl font-medium">{formError}</div>}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono uppercase text-gray-500 block">Name *</label>
                    <input type="text" value={formName} onChange={e => setFormName(e.target.value)} placeholder="Full name" className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono uppercase text-gray-500 block">Alt Phone</label>
                    <input type="text" value={formAltPhone} onChange={e => setFormAltPhone(e.target.value)} placeholder="Alternative contact" className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-gray-500 block">Phone *</label>
                  <input type="text" value={formPhone} onChange={e => setFormPhone(e.target.value)} placeholder="0300-1234567" className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white" />
                </div>

                <div className="p-4 bg-gray-50 dark:bg-slate-950/60 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
                  <p className="text-xs font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-1">Address Details</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-gray-500 block">House No</label>
                      <input type="text" value={formHouseNo} onChange={e => setFormHouseNo(e.target.value)} placeholder="24" className="w-full h-9 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-gray-500 block">Street</label>
                      <input type="text" value={formStreet} onChange={e => setFormStreet(e.target.value)} placeholder="Street 2" className="w-full h-9 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-gray-500 block">Sector</label>
                      <input type="text" value={formSector} onChange={e => setFormSector(e.target.value)} placeholder="Sector A" className="w-full h-9 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-gray-500 block">Colony</label>
                      <input type="text" value={formColony} onChange={e => setFormColony(e.target.value)} placeholder="Samanabad" className="w-full h-9 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono uppercase text-gray-500 block">Full Address Line</label>
                    <input type="text" value={formAddressLine} onChange={e => setFormAddressLine(e.target.value)} placeholder="House 24, Street 2, Samanabad, Lahore" className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white" />
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-slate-950/60 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
                  <p className="text-xs font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-1">Delivery & Billing</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-gray-500 block">Qty (L/day)</label>
                      <input type="number" value={formQty} onChange={e => setFormQty(Number(e.target.value))} className="w-full h-9 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-gray-500 block">Delivery Time</label>
                      <select value={formDeliveryTime} onChange={e => setFormDeliveryTime(e.target.value)} className="w-full h-9 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white cursor-pointer">
                        <option value="Morning">Morning</option>
                        <option value="Evening">Evening</option>
                        <option value="Both">Both</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-gray-500 block">Rate/L (PKR)</label>
                      <input type="number" value={formRate} onChange={e => setFormRate(Number(e.target.value))} className="w-full h-9 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-gray-500 block">Opening Advance</label>
                      <input type="number" value={formAdvance} onChange={e => setFormAdvance(Number(e.target.value))} className="w-full h-9 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-gray-500 block">Bill Type</label>
                      <select value={formBillType} onChange={e => setFormBillType(e.target.value as "per_litre" | "fixed_monthly")} className="w-full h-9 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white cursor-pointer">
                        <option value="per_litre">Per Litre</option>
                        <option value="fixed_monthly">Fixed Monthly</option>
                      </select>
                    </div>
                    {formBillType === "fixed_monthly" && (
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase text-gray-500 block">Monthly Fee (PKR)</label>
                        <input type="number" value={formMonthlyFee} onChange={e => setFormMonthlyFee(Number(e.target.value))} className="w-full h-9 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-gray-500 block">Notes</label>
                  <textarea value={formNotes} onChange={e => setFormNotes(e.target.value)} rows={2} className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white" />
                </div>

                <div className="flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800 pt-4 mt-4">
                  <button type="button" onClick={() => { setShowAddModal(false); resetForm(); }} className="px-4 py-2 text-xs font-semibold bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 rounded-xl cursor-pointer">Cancel</button>
                  <button type="submit" className="px-4 py-2 text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 rounded-xl transition-all shadow-md shadow-blue-500/25 cursor-pointer">Save Customer</button>
                </div>
              </form>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* EDIT CUSTOMER MODAL */}
      {showEditModal && (
        <ModalPortal onClose={() => { setShowEditModal(false); setEditingDelCustId(null); resetForm(); }}>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs px-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-950 text-white flex justify-between items-center">
                <h3 className="text-base font-bold">Edit Delivery Customer</h3>
                <button onClick={() => { setShowEditModal(false); setEditingDelCustId(null); resetForm(); }} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleEditDelCust} className="flex-1 overflow-y-auto p-6 space-y-4">
                {formError && <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs rounded-xl font-medium">{formError}</div>}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono uppercase text-gray-500 block">Name *</label>
                    <input type="text" value={formName} onChange={e => setFormName(e.target.value)} placeholder="Full name" className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono uppercase text-gray-500 block">Alt Phone</label>
                    <input type="text" value={formAltPhone} onChange={e => setFormAltPhone(e.target.value)} placeholder="Alternative contact" className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-gray-500 block">Phone *</label>
                  <input type="text" value={formPhone} onChange={e => setFormPhone(e.target.value)} placeholder="0300-1234567" className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white" />
                </div>

                <div className="p-4 bg-gray-50 dark:bg-slate-950/60 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
                  <p className="text-xs font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-1">Address Details</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-gray-500 block">House No</label>
                      <input type="text" value={formHouseNo} onChange={e => setFormHouseNo(e.target.value)} className="w-full h-9 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-gray-500 block">Street</label>
                      <input type="text" value={formStreet} onChange={e => setFormStreet(e.target.value)} className="w-full h-9 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-gray-500 block">Sector</label>
                      <input type="text" value={formSector} onChange={e => setFormSector(e.target.value)} className="w-full h-9 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-gray-500 block">Colony</label>
                      <input type="text" value={formColony} onChange={e => setFormColony(e.target.value)} className="w-full h-9 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono uppercase text-gray-500 block">Full Address Line</label>
                    <input type="text" value={formAddressLine} onChange={e => setFormAddressLine(e.target.value)} className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white" />
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-slate-950/60 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
                  <p className="text-xs font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-1">Delivery & Billing</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-gray-500 block">Qty (L/day)</label>
                      <input type="number" value={formQty} onChange={e => setFormQty(Number(e.target.value))} className="w-full h-9 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-gray-500 block">Delivery Time</label>
                      <select value={formDeliveryTime} onChange={e => setFormDeliveryTime(e.target.value)} className="w-full h-9 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white cursor-pointer">
                        <option value="Morning">Morning</option>
                        <option value="Evening">Evening</option>
                        <option value="Both">Both</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-gray-500 block">Rate/L (PKR)</label>
                      <input type="number" value={formRate} onChange={e => setFormRate(Number(e.target.value))} className="w-full h-9 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-gray-500 block">Bill Type</label>
                      <select value={formBillType} onChange={e => setFormBillType(e.target.value as "per_litre" | "fixed_monthly")} className="w-full h-9 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white cursor-pointer">
                        <option value="per_litre">Per Litre</option>
                        <option value="fixed_monthly">Fixed Monthly</option>
                      </select>
                    </div>
                  </div>
                  {formBillType === "fixed_monthly" && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-gray-500 block">Monthly Fee (PKR)</label>
                      <input type="number" value={formMonthlyFee} onChange={e => setFormMonthlyFee(Number(e.target.value))} className="w-full h-9 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white" />
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-gray-500 block">Notes</label>
                  <textarea value={formNotes} onChange={e => setFormNotes(e.target.value)} rows={2} className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white" />
                </div>

                <div className="flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800 pt-4 mt-4">
                  <button type="button" onClick={() => { setShowEditModal(false); setEditingDelCustId(null); resetForm(); }} className="px-4 py-2 text-xs font-semibold bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 rounded-xl cursor-pointer">Cancel</button>
                  <button type="submit" className="px-4 py-2 text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 rounded-xl transition-all shadow-md shadow-blue-500/25 cursor-pointer">Update Customer</button>
                </div>
              </form>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* PAYMENT MODAL */}
      {showPayModal && selectedCust && (
        <ModalPortal onClose={() => setShowPayModal(false)}>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs px-4">
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-5 border-b border-gray-100 dark:border-slate-800 bg-slate-950 text-white flex justify-between items-center">
                <h3 className="text-base font-bold">Record Payment: {selectedCust.name}</h3>
                <button onClick={() => setShowPayModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handlePay} className="p-6 space-y-4">
                {payError && <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs rounded-xl font-medium">{payError}</div>}
                <div className="p-3.5 bg-rose-500/5 border border-rose-500/10 rounded-2xl flex justify-between items-center text-xs">
                  <span className="text-gray-500">Pending Balance:</span>
                  <span className="font-extrabold text-rose-500 text-sm">{formatCurrency(selectedCust.pendingBalance)}</span>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-gray-500 block">Amount (PKR) *</label>
                  <input type="number" value={payAmount} onChange={e => setPayAmount(Number(e.target.value))} placeholder="e.g. 5000" className="w-full h-11 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white font-bold" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono uppercase text-gray-500 block">Month</label>
                    <input type="month" value={payMonth} onChange={e => setPayMonth(e.target.value)} className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white cursor-pointer" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono uppercase text-gray-500 block">Method</label>
                    <select value={payMethod} onChange={e => setPayMethod(e.target.value)} className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white cursor-pointer">
                      <option value="Cash">Cash</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="JazzCash">JazzCash</option>
                      <option value="EasyPaisa">EasyPaisa</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-gray-500 block">Reference / Notes</label>
                  <input type="text" value={payRef} onChange={e => setPayRef(e.target.value)} placeholder="Optional ref" className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white" />
                </div>
                <div className="flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800 pt-4">
                  <button type="button" onClick={() => setShowPayModal(false)} className="px-4 py-2 text-xs font-semibold bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 rounded-xl cursor-pointer">Cancel</button>
                  <button type="submit" className="px-4 py-2 text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-600 rounded-xl transition-all shadow-md shadow-emerald-500/25 cursor-pointer">Record Payment</button>
                </div>
              </form>
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  );
};
