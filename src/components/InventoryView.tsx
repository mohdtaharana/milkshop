/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { InventoryItem } from "../types";
import { Plus, Search, ClipboardList, AlertTriangle, ArrowUpDown, ChevronDown, CheckCircle, Flame, Hammer, X, Sparkles } from "lucide-react";

export const InventoryView: React.FC = () => {
  const { 
    inventory, addInventoryItem, updateInventoryStock, 
    formatNumber, formatCurrency, t, direction 
  } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Add Item States
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState<InventoryItem["category"]>("Milk");
  const [formUnit, setFormUnit] = useState("Litre");
  const [formStock, setFormStock] = useState<number>(100);
  const [formMin, setFormMin] = useState<number>(20);
  const [formPrice, setFormPrice] = useState<number>(180);
  const [formExpiry, setFormExpiry] = useState("");
  const [formBatch, setFormBatch] = useState("");
  const [formError, setFormError] = useState("");

  // Adjust Item States
  const [adjustQty, setAdjustQty] = useState<number>(0);
  const [adjustDamaged, setAdjustDamaged] = useState<number>(0);
  const [adjustReturned, setAdjustReturned] = useState<number>(0);

  const activeAdjustItem = inventory.find(i => i.id === showAdjustModal);

  // Submit adding product
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formName.trim() || !formUnit.trim()) {
      setFormError("Product Name and Unit are required.");
      return;
    }

    if (formStock < 0 || formMin < 0 || formPrice < 0) {
      setFormError("Numeric values cannot be negative.");
      return;
    }

    addInventoryItem({
      name: formName,
      category: formCategory,
      unit: formUnit,
      currentStock: Number(formStock),
      minStock: Number(formMin),
      pricePerUnit: Number(formPrice),
      expiryDate: formExpiry || undefined,
      batchNumber: formBatch || undefined
    });

    setFormName("");
    setFormStock(100);
    setFormMin(20);
    setFormPrice(180);
    setFormExpiry("");
    setFormBatch("");
    setShowAddModal(false);
  };

  // Submit adjusting stocks
  const handleAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showAdjustModal || !activeAdjustItem) return;

    // Call update with combined params
    updateInventoryStock(
      showAdjustModal, 
      Number(adjustQty), 
      Number(adjustDamaged), 
      Number(adjustReturned)
    );

    setAdjustQty(0);
    setAdjustDamaged(0);
    setAdjustReturned(0);
    setShowAdjustModal(null);
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = (item.name || "").toLowerCase().includes((searchQuery || "").toLowerCase());
    const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-blue-600" />
            <span>Product Catalog & Stock Ledger</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Monitor real-time cold-chain stocks, expired dairy items, and packaging bags
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-md shadow-blue-500/25 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t("addStock")}</span>
        </button>
      </div>

      {/* Grid summarizing alerts */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        
        {/* Total low stocks */}
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 font-mono uppercase">Low Stock Alerts</p>
            <h4 className="text-sm font-extrabold text-rose-500">
              {inventory.filter(i => i.currentStock <= i.minStock).length} Items Critical
            </h4>
          </div>
        </div>

        {/* Total Raw Stock */}
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 font-mono uppercase">Catalog SKU Count</p>
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
              {inventory.length} Registered Products
            </h4>
          </div>
        </div>

        {/* Total Spoilage */}
        <div className="p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl flex items-center gap-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 font-mono uppercase">Total Spoilage / Damage</p>
            <h4 className="text-sm font-extrabold text-red-500">
              {inventory.reduce((sum, i) => sum + i.damagedStock, 0)} Units Recorded
            </h4>
          </div>
        </div>

        {/* Total Returns */}
        <div className="p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl flex items-center gap-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 font-mono uppercase">Total Customer Returns</p>
            <h4 className="text-sm font-extrabold text-blue-500">
              {inventory.reduce((sum, i) => sum + i.returnedStock, 0)} Units
            </h4>
          </div>
        </div>

      </div>

      {/* Catalog lists */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        
        {/* Filters */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-3 justify-between items-center bg-slate-50/50 dark:bg-slate-950/10">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute top-3 left-3" />
            <input 
              type="text" 
              placeholder="Search product inventory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 border border-slate-200 dark:border-slate-700 pl-9 pr-4 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:bg-slate-950 dark:text-white"
            />
          </div>

          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-10 border border-slate-200 dark:border-slate-700 rounded-xl text-xs px-3 bg-white dark:bg-slate-950 dark:text-white cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="Milk">Milk (دودھ)</option>
            <option value="Yogurt">Yogurt (دہی)</option>
            <option value="Butter">Butter (مکھن)</option>
            <option value="Cream">Cream (ملائی)</option>
            <option value="Desi Ghee">Desi Ghee (دیسی گھی)</option>
            <option value="Lassi">Lassi (لسی)</option>
            <option value="Packaging">Packaging (پیکجنگ)</option>
            <option value="Cleaning">Cleaning & Sanitizers</option>
          </select>
        </div>

        {/* Catalog Table */}
        <div className="overflow-x-auto animate-fadeIn">
          <table className="w-full min-w-[950px] text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-500 font-mono text-xs uppercase bg-slate-50/40 dark:bg-slate-950/20 whitespace-nowrap">
                <th className="p-4">SKU / Product Particulars</th>
                <th className="p-4">Category</th>
                <th className="p-4 text-right">Unit Price</th>
                <th className="p-4 text-right">Current Available Stock</th>
                <th className="p-4 text-center">Stock status</th>
                <th className="p-4 text-right">Total Damaged</th>
                <th className="p-4 text-right">Total Returned</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredInventory.map(item => {
                const isLow = item.currentStock <= item.minStock;

                return (
                  <tr key={item.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-950/20 transition-colors whitespace-nowrap">
                    <td className="p-4">
                      <div className="font-bold text-slate-900 dark:text-white">{item.name}</div>
                      <div className="text-[10px] text-gray-400 font-mono mt-0.5">SKU ID: {item.id} {item.batchNumber ? `• Batch: ${item.batchNumber}` : ""}</div>
                    </td>
                    <td className="p-4">
                      <span className="font-medium text-slate-700 dark:text-slate-300">{item.category}</span>
                    </td>
                    <td className="p-4 text-right font-mono text-gray-600 dark:text-slate-400">
                      Rs. {item.pricePerUnit}/{item.unit}
                    </td>
                    <td className="p-4 text-right font-sans font-bold text-slate-900 dark:text-white">
                      {formatNumber(item.currentStock)} {item.unit}
                    </td>
                    <td className="p-4 text-center">
                      {isLow ? (
                        <span className="inline-flex items-center gap-1 bg-rose-500/10 text-rose-500 px-2.5 py-1 rounded-full font-bold text-[10px]">
                          <AlertTriangle className="w-3.5 h-3.5" /> Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-500 px-2.5 py-1 rounded-full font-bold text-[10px]">
                          Good Stock
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right text-rose-500 font-bold">
                      {item.damagedStock} {item.unit}
                    </td>
                    <td className="p-4 text-right text-blue-500 font-bold">
                      {item.returnedStock} {item.unit}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => {
                          setAdjustQty(item.currentStock);
                          setAdjustDamaged(0);
                          setAdjustReturned(0);
                          setShowAdjustModal(item.id);
                        }}
                        className="px-2.5 py-1.5 text-[11px] font-bold bg-blue-500/10 hover:bg-blue-600 text-blue-600 dark:text-blue-400 hover:text-white border border-blue-500/10 rounded-lg transition-all cursor-pointer"
                      >
                        Adjust / Audit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

      {/* ----------------- DIALOG MODAL: ADD PRODUCT CATALOG SKU ----------------- */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs px-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
            
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-950 text-white flex justify-between items-center">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-400" />
                <span>Add Product to Catalog</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddItem} className="p-6 space-y-4">
              
              {formError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs rounded-xl font-medium">
                  {formError}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase text-gray-500 block">Product Label / Name *</label>
                <input 
                  type="text" 
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Khalsa Creamy Buffalo Yogurt"
                  className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-gray-500 block">Category</label>
                  <select 
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as InventoryItem["category"])}
                    className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white cursor-pointer"
                  >
                    <option value="Milk">Milk</option>
                    <option value="Yogurt">Yogurt</option>
                    <option value="Butter">Butter</option>
                    <option value="Cream">Cream</option>
                    <option value="Desi Ghee">Desi Ghee</option>
                    <option value="Lassi">Lassi</option>
                    <option value="Packaging">Packaging</option>
                    <option value="Cleaning">Cleaning / Sanitizers</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-gray-500 block">Unit Type *</label>
                  <input 
                    type="text" 
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    placeholder="E.g. Kg, Litre, Unit, Box"
                    className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-gray-500 block">Starting Stock *</label>
                  <input 
                    type="number" 
                    value={formStock}
                    onChange={(e) => setFormStock(Number(e.target.value))}
                    className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-gray-500 block">Min stock limit *</label>
                  <input 
                    type="number" 
                    value={formMin}
                    onChange={(e) => setFormMin(Number(e.target.value))}
                    className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-gray-500 block">Price per Unit (PKR)</label>
                  <input 
                    type="number" 
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-gray-500 block">Batch Code / Number</label>
                  <input 
                    type="text" 
                    value={formBatch}
                    onChange={(e) => setFormBatch(e.target.value)}
                    placeholder="BATCH-09921"
                    className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-gray-500 block">Expiry Date</label>
                  <input 
                    type="date" 
                    value={formExpiry}
                    onChange={(e) => setFormExpiry(e.target.value)}
                    className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white"
                  />
                </div>
              </div>

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
                  Save Product Catalog
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ----------------- DIALOG MODAL: ADJUST / AUDIT STOCK ----------------- */}
      {showAdjustModal && activeAdjustItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs px-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
            
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-950 text-white flex justify-between items-center">
              <h3 className="text-base font-bold">Physical Audit: {activeAdjustItem.name}</h3>
              <button onClick={() => setShowAdjustModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdjustSubmit} className="p-6 space-y-4">
              
              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase text-gray-500 block">Actual Stock Count ({activeAdjustItem.unit}) *</label>
                <input 
                  type="number" 
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(Number(e.target.value))}
                  className="w-full h-11 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white font-bold text-blue-600 dark:text-blue-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-gray-500 block">Add Damaged / Spoiled</label>
                  <input 
                    type="number" 
                    value={adjustDamaged}
                    onChange={(e) => setAdjustDamaged(Number(e.target.value))}
                    placeholder="0"
                    className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white font-bold text-rose-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-gray-500 block">Add Customer Returned</label>
                  <input 
                    type="number" 
                    value={adjustReturned}
                    onChange={(e) => setAdjustReturned(Number(e.target.value))}
                    placeholder="0"
                    className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white font-bold text-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800 pt-4 mt-4">
                <button 
                  type="button" 
                  onClick={() => setShowAdjustModal(null)}
                  className="px-4 py-2 text-xs font-semibold bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 rounded-xl transition-all shadow-md shadow-blue-500/25 cursor-pointer"
                >
                  Confirm Adjustments
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
