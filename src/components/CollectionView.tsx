/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { MilkType, Shift } from "../types";
import { Plus, Search, Milk, FlaskConical, Thermometer, Truck, Calendar, Sparkles, X, CheckCircle, Clock } from "lucide-react";

export const CollectionView: React.FC = () => {
  const { 
    collections, suppliers, addCollection, deleteCollection, 
    formatCurrency, formatNumber, t, direction 
  } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Form Fields
  const [supplierId, setSupplierId] = useState("");
  const [shift, setShift] = useState<Shift>(Shift.MORNING);
  const [milkType, setMilkType] = useState<MilkType>(MilkType.BUFFALO);
  const [qty, setQty] = useState<number>(100);
  const [fat, setFat] = useState<number>(6.5);
  const [snf, setSnf] = useState<number>(8.8);
  const [temp, setTemp] = useState<number>(4.5);
  const [vehicle, setVehicle] = useState("");
  const [remarks, setRemarks] = useState("Standard shipment. Temp maintained.");
  const [formError, setFormError] = useState("");

  // Live Auto-calculator states (purely for the form visual previews!)
  const [liveRate, setLiveRate] = useState(155);
  const [liveTotal, setLiveTotal] = useState(15500);

  // Pick first supplier by default when modal opens
  useEffect(() => {
    if (suppliers.length > 0 && !supplierId) {
      setSupplierId(suppliers[0].id);
    }
  }, [suppliers, supplierId, showAddModal]);

  // Recalculate price as fat/snf/supplier changes
  useEffect(() => {
    const selectedSupp = suppliers.find(s => s.id === supplierId);
    if (selectedSupp) {
      const base = selectedSupp.rate;
      const calculated = Math.round(base * (fat + snf) / (6.0 + 8.5));
      setLiveRate(calculated);
      setLiveTotal(calculated * qty);
    }
  }, [supplierId, qty, fat, snf, suppliers]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!supplierId) {
      setFormError("Please select a supplier.");
      return;
    }

    if (qty <= 0 || fat <= 0 || snf <= 0) {
      setFormError("Quantity, Fat, and SNF must be positive values.");
      return;
    }

    const supplier = suppliers.find(s => s.id === supplierId);
    if (!supplier) return;

    addCollection({
      supplierId,
      supplierName: supplier.name,
      shift,
      milkType,
      quantity: Number(qty),
      fat: Number(fat),
      snf: Number(snf),
      remarks,
      temperature: Number(temp),
      vehicleNo: vehicle || "N/A"
    });

    // Reset Form
    setQty(100);
    setFat(6.5);
    setSnf(8.8);
    setTemp(4.5);
    setVehicle("");
    setRemarks("Standard shipment. Temp maintained.");
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Milk className="w-6 h-6 text-blue-600" />
            <span>Milk Intake & Quality Register</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Log raw milk shipments, lactometer density checks, and quality parameters
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-md shadow-blue-500/25 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t("newCollection")}</span>
        </button>
      </div>

      {/* Grid summarizing today's collection statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Milk className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-mono">Today's Total Collected</p>
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
              {formatNumber(collections.reduce((sum, c) => sum + c.quantity, 0))} Litres
            </h4>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-500 flex items-center justify-center">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-mono">Lactometer Weighted Fat</p>
            <h4 className="text-sm font-extrabold text-gray-900 dark:text-white">
              {formatNumber(collections.reduce((sum, c) => sum + (c.fat * c.quantity), 0) / (collections.reduce((sum, c) => sum + c.quantity, 0) || 1), 1)} % Average
            </h4>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-500 flex items-center justify-center">
            <Thermometer className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-mono">Intake Target Temp</p>
            <h4 className="text-sm font-extrabold text-gray-900 dark:text-white">
              4.0°C - 5.5°C (Chilled)
            </h4>
          </div>
        </div>
      </div>

      {/* Main collections list */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        
        {/* Controls */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-3 justify-between items-center bg-slate-50/50 dark:bg-slate-950/10">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute top-3 left-3" />
            <input 
              type="text" 
              placeholder="Search by supplier name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 border border-slate-200 dark:border-slate-700 pl-9 pr-4 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:bg-slate-950 dark:text-white"
            />
          </div>
        </div>

        {/* Log table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-500 font-mono text-xs uppercase bg-slate-50/40 dark:bg-slate-950/20 whitespace-nowrap">
                <th className="p-4">Supplier Name</th>
                <th className="p-4">Date & Shift</th>
                <th className="p-4">Milk Type</th>
                <th className="p-4 text-right">Intake Qty</th>
                <th className="p-4 text-center">Quality Specs</th>
                <th className="p-4 text-right">Unit Rate</th>
                <th className="p-4 text-right">Total Amount</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {collections
                .filter(c => (c.supplierName || "").toLowerCase().includes((searchQuery || "").toLowerCase()))
                .map(col => (
                  <tr key={col.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-950/20 transition-colors whitespace-nowrap">
                    <td className="p-4">
                      <div className="font-bold text-slate-900 dark:text-white">{col.supplierName}</div>
                      <div className="text-[10px] text-gray-400 font-mono mt-0.5">ID: {col.id} • Temp: {col.temperature}°C</div>
                    </td>
                    <td className="p-4">
                      <div className="text-slate-900 dark:text-white font-medium flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        <span>{col.date}</span>
                      </div>
                      <div className="text-[10px] text-gray-400 font-mono mt-0.5 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        <span>{col.shift}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-medium">{col.milkType}</span>
                    </td>
                    <td className="p-4 text-right font-bold text-slate-900 dark:text-white font-sans">
                      {col.quantity} Ltr
                    </td>
                    <td className="p-4 text-center">
                      <div className="inline-flex items-center gap-1 bg-blue-500/5 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-full font-bold font-mono text-[10px]">
                        {col.fat}% Fat / {col.snf}% SNF
                      </div>
                      <div className="text-[10px] text-gray-400 truncate max-w-xs mx-auto mt-1" title={col.remarks}>
                        {col.remarks}
                      </div>
                    </td>
                    <td className="p-4 text-right font-mono text-gray-600 dark:text-slate-400">
                      Rs. {col.rate}/L
                    </td>
                    <td className="p-4 text-right font-sans font-black text-gray-900 dark:text-white">
                      {formatCurrency(col.totalAmount)}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => {
                          if (confirm("Deregister milk intake? This will restore balances and deduct milk inventories.")) {
                            deleteCollection(col.id);
                          }
                        }}
                        className="p-1 text-rose-500 hover:bg-rose-500/10 rounded-md transition-colors cursor-pointer"
                        title="Deregister milk load"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* ----------------- DIALOG MODAL: ADD INTAKE RECORD ----------------- */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs px-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
            
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-950 text-white flex justify-between items-center">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Milk className="w-5 h-5 text-blue-400" />
                <span>Record Fresh Milk Load</span>
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

              {/* Supplier Selection */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase text-gray-500 block">Supplier / Farm Name *</label>
                <select 
                  value={supplierId}
                  onChange={(e) => setSupplierId(e.target.value)}
                  className="w-full h-11 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white cursor-pointer"
                >
                  <option value="">Choose Supplier</option>
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.village})</option>
                  ))}
                </select>
              </div>

              {/* Grid 1: Shift & Milk Type */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-gray-500 block">Active Intake Shift</label>
                  <select 
                    value={shift}
                    onChange={(e) => setShift(e.target.value as Shift)}
                    className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white cursor-pointer"
                  >
                    <option value={Shift.MORNING}>Morning (صبح)</option>
                    <option value={Shift.EVENING}>Evening (شام)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-gray-500 block">Tested Milk Category</label>
                  <select 
                    value={milkType}
                    onChange={(e) => setMilkType(e.target.value as MilkType)}
                    className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white cursor-pointer"
                  >
                    <option value={MilkType.BUFFALO}>Buffalo Milk (بھینس کا دودھ)</option>
                    <option value={MilkType.COW}>Cow Milk (گائے کا دودھ)</option>
                    <option value={MilkType.MIXED}>Mixed Milk (مکس دودھ)</option>
                  </select>
                </div>
              </div>

              {/* Grid 2: Quantity & Temperature */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-gray-500 block">Intake Volume (Litres) *</label>
                  <input 
                    type="number" 
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white font-bold text-blue-600 dark:text-blue-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-gray-500 block">Temperature Log (°C) *</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={temp}
                    onChange={(e) => setTemp(Number(e.target.value))}
                    className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white"
                  />
                </div>
              </div>

              {/* Grid 3: Fat % & SNF % (Lactometer Quality check) */}
              <div className="p-4 bg-gray-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-1">
                  <FlaskConical className="w-4 h-4 text-blue-500" />
                  <span>Tested Lactometer Reading Standards</span>
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono uppercase text-gray-500 block">Fat Percentage (%) *</label>
                    <input 
                      type="number" 
                      step="0.1"
                      value={fat}
                      onChange={(e) => setFat(Number(e.target.value))}
                      className="w-full h-10 px-3 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white font-bold font-mono text-blue-600 dark:text-blue-400"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono uppercase text-gray-500 block">Solid-Not-Fat SNF (%) *</label>
                    <input 
                      type="number" 
                      step="0.1"
                      value={snf}
                      onChange={(e) => setSnf(Number(e.target.value))}
                      className="w-full h-10 px-3 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white font-bold font-mono text-blue-600 dark:text-blue-400"
                    />
                  </div>
                </div>

                {/* Live pricing preview panel */}
                <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl flex justify-between items-center text-xs">
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase font-mono">Calculated Unit Rate</p>
                    <p className="font-extrabold text-blue-600 dark:text-blue-400 text-sm">Rs. {liveRate} / Litre</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-500 uppercase font-mono">Collection Total Bill</p>
                    <p className="font-extrabold text-blue-600 dark:text-blue-400 text-sm">{formatCurrency(liveTotal)}</p>
                  </div>
                </div>
              </div>

              {/* Grid 4: Transport and Notes */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-gray-500 block">Delivery Vehicle / Tanker #</label>
                  <input 
                    type="text" 
                    value={vehicle}
                    onChange={(e) => setVehicle(e.target.value)}
                    placeholder="E.g., LES-9921"
                    className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-gray-500 block">Remarks</label>
                  <input 
                    type="text" 
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white"
                  />
                </div>
              </div>

              {/* Buttons */}
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
                  Confirm Milk Intake
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
