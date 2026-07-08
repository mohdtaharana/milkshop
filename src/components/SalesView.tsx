/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { PaymentMethod, InvoiceProduct } from "../types";
import { 
  Plus, Search, Receipt, CheckCircle, Clock, Trash2, Printer, 
  X, Sparkles, FileText, ShoppingCart, Tag, Percent, ArrowUpRight 
} from "lucide-react";

export const SalesView: React.FC = () => {
  const { 
    invoices, customers, inventory, addInvoice, cancelInvoice, 
    formatCurrency, formatNumber, t, direction 
  } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Create Invoice POS Cart States
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [cart, setCart] = useState<InvoiceProduct[]>([]);
  const [discount, setDiscount] = useState<number>(0);
  const [taxRate, setTaxRate] = useState<number>(0); // e.g. Punjab Sales Tax %
  const [extraCharges, setExtraCharges] = useState<number>(0); // delivery fees
  const [paid, setPaid] = useState<number>(0);
  const [payMethod, setPayMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
  const [formError, setFormError] = useState("");

  // Add Item to cart fields
  const [selectedProdId, setSelectedProdId] = useState("");
  const [selectedProdQty, setSelectedProdQty] = useState<number>(1);

  // Quick helper to fetch selected product details
  const activeProduct = inventory.find(i => i.id === selectedProdId);

  // Add to cart action
  const handleAddToCart = () => {
    if (!selectedProdId || selectedProdQty <= 0) return;
    const prod = inventory.find(i => i.id === selectedProdId);
    if (!prod) return;

    // Check if product exists in cart
    const existingIdx = cart.findIndex(item => item.productId === selectedProdId);
    if (existingIdx > -1) {
      const updated = [...cart];
      updated[existingIdx].quantity += Number(selectedProdQty);
      updated[existingIdx].amount = updated[existingIdx].quantity * updated[existingIdx].rate;
      setCart(updated);
    } else {
      setCart(prev => [
        ...prev,
        {
          productId: prod.id,
          name: prod.name,
          quantity: Number(selectedProdQty),
          unit: prod.unit,
          rate: prod.pricePerUnit,
          amount: Number(selectedProdQty) * prod.pricePerUnit
        }
      ]);
    }

    // Reset item picker
    setSelectedProdId("");
    setSelectedProdQty(1);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.productId !== id));
  };

  // Calculate cart sums
  const cartSubtotal = cart.reduce((sum, item) => sum + item.amount, 0);
  const calculatedTax = Math.round(cartSubtotal * (taxRate / 100));
  const cartNetTotal = cartSubtotal - discount + calculatedTax + extraCharges;

  // Submit invoice
  const handleInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!selectedCustomerId) {
      setFormError("Please select a customer (choose Walk-in if not registered).");
      return;
    }

    if (cart.length === 0) {
      setFormError("Please add at least one product to the cart.");
      return;
    }

    // Determine milk quantity if any milk SKU is included
    const milkQty = cart
      .filter(item => (item.name || "").toLowerCase().includes("milk"))
      .reduce((sum, item) => sum + item.quantity, 0);

    addInvoice({
      customerId: selectedCustomerId,
      products: cart,
      milkQuantity: milkQty,
      rate: cart.find(item => (item.name || "").toLowerCase().includes("milk"))?.rate || 0,
      discount: Number(discount),
      tax: calculatedTax,
      extraCharges: Number(extraCharges),
      paid: Number(paid),
      paymentMethod: payMethod
    });

    // Reset cart states
    setCart([]);
    setDiscount(0);
    setTaxRate(0);
    setExtraCharges(0);
    setPaid(0);
    setSelectedCustomerId("");
    setShowAddModal(false);
    alert(t("successRecord"));
  };

  const activeInvoice = invoices.find(inv => inv.id === selectedInvoiceId);

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Receipt className="w-6 h-6 text-blue-600" />
            <span>Retail Billing & POS Terminal</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Process on-the-spot cash sales, home delivery subscriptions, and print commercial receipts
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-md shadow-blue-500/25 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t("newInvoice")}</span>
        </button>
      </div>

      {/* Main Billing Table List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        
        {/* Search */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-3 justify-between items-center bg-slate-50/50 dark:bg-slate-950/10">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute top-3 left-3" />
            <input 
              type="text" 
              placeholder="Search invoices by customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 border border-slate-200 dark:border-slate-700 pl-9 pr-4 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:bg-slate-950 dark:text-white"
            />
          </div>
        </div>

        {/* Invoice list table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-left">
            <thead>
              <tr className="border-b border-gray-100 dark:border-slate-800 text-gray-500 font-mono text-xs uppercase bg-gray-50/40 dark:bg-slate-950/20 whitespace-nowrap">
                <th className="p-4">Invoice Code / Bill Date</th>
                <th className="p-4">Linked Customer Account</th>
                <th className="p-4 text-right">Items Sold</th>
                <th className="p-4 text-center">Settlement Method</th>
                <th className="p-4 text-right">Total Net Bill</th>
                <th className="p-4 text-right">Ledger Credit (Paid)</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Receipt Print</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-xs">
              {invoices
                .filter(inv => (inv.customerName || "").toLowerCase().includes((searchQuery || "").toLowerCase()))
                .map(inv => {
                  const itemsCount = inv.products.reduce((sum, p) => sum + p.quantity, 0);

                  return (
                    <tr key={inv.id} className="hover:bg-gray-50/40 dark:hover:bg-slate-950/20 transition-colors whitespace-nowrap">
                      <td className="p-4">
                        <div className="font-bold text-gray-900 dark:text-white">{inv.invoiceNumber}</div>
                        <div className="text-[10px] text-gray-400 font-mono mt-0.5">{inv.date}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-gray-950 dark:text-slate-100">{inv.customerName}</div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="font-semibold text-gray-900 dark:text-white">{itemsCount} units</div>
                        <div className="text-[10px] text-gray-400 font-mono">
                          {inv.products.map(p => `${p.quantity}${p.unit} ${p.name}`).join(", ").substring(0, 30)}...
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className="font-bold text-gray-700 dark:text-slate-300 font-mono bg-slate-100 dark:bg-slate-950 px-2 py-0.5 rounded-sm">
                          {inv.paymentMethod}
                        </span>
                      </td>
                      <td className="p-4 text-right font-bold text-gray-900 dark:text-white">
                        {formatCurrency(inv.total)}
                      </td>
                      <td className="p-4 text-right font-sans font-bold text-emerald-500">
                        {formatCurrency(inv.paid)}
                      </td>
                      <td className="p-4 text-center">
                        {inv.status === "Paid" ? (
                          <span className="inline-flex items-center gap-0.5 bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full font-bold text-[10px]">
                            Paid
                          </span>
                        ) : inv.status === "Partially Paid" ? (
                          <span className="inline-flex items-center gap-0.5 bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full font-bold text-[10px]">
                            Partially Paid
                          </span>
                        ) : inv.status === "Cancelled" ? (
                          <span className="inline-flex items-center gap-0.5 bg-gray-500/10 text-gray-400 px-2 py-0.5 rounded-full font-medium text-[10px]">
                            Cancelled
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-0.5 bg-rose-500/10 text-rose-500 px-2 py-0.5 rounded-full font-bold text-[10px]">
                            Unpaid / Khata
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setSelectedInvoiceId(inv.id)}
                            className="p-1 text-blue-600 hover:bg-blue-500/10 rounded-md transition-colors cursor-pointer"
                            title="Receipt Preview"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          {inv.status !== "Cancelled" && (
                            <button
                              onClick={() => {
                                if (confirm("Cancel this bill invoice? Stocks will be reverted and customer balances updated.")) {
                                  cancelInvoice(inv.id);
                                }
                              }}
                              className="p-1 text-rose-500 hover:bg-rose-500/10 rounded-md transition-colors cursor-pointer"
                              title="Cancel invoice"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

      </div>

      {/* ----------------- POS DIALOG MODAL: CREATE INVOICE ----------------- */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs px-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            
            <div className="p-4 bg-slate-950 text-white flex justify-between items-center border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-black flex items-center gap-2 uppercase tracking-wide">
                <ShoppingCart className="w-5 h-5 text-blue-500" />
                <span>{t("billingInterface")}</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
              
              {/* Left Column (8-Grid): Items Picker and Cart List */}
              <div className="lg:col-span-7 p-6 overflow-y-auto space-y-4 border-r border-slate-100 dark:border-slate-800 flex flex-col h-full">
                
                {formError && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs rounded-xl font-medium">
                    {formError}
                  </div>
                )}

                {/* Customer selection */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-500 block">{t("selectCustomer")} *</label>
                  <select 
                    value={selectedCustomerId}
                    onChange={(e) => {
                      setSelectedCustomerId(e.target.value);
                      // Auto-apply custom rate if milk is purchased later
                    }}
                    className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 dark:text-white focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="">-- Choose Account --</option>
                    <option value="WALK-IN">Walk-in Cash Customer (لاہور مکس گاہک)</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.phone} • {c.area})</option>
                    ))}
                  </select>
                </div>

                {/* Picker Section */}
                <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 rounded-2xl space-y-3">
                  <p className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-wider">Pick Product Menu</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <select
                      value={selectedProdId}
                      onChange={(e) => setSelectedProdId(e.target.value)}
                      className="col-span-2 h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-900 dark:text-white cursor-pointer"
                    >
                      <option value="">-- Choose Product --</option>
                      {inventory.map(item => (
                        <option key={item.id} value={item.id}>
                          {item.name} ({item.currentStock}{item.unit} left • Rs.{item.pricePerUnit})
                        </option>
                      ))}
                    </select>

                    <input 
                      type="number" 
                      min="1"
                      value={selectedProdQty}
                      onChange={(e) => setSelectedProdQty(Number(e.target.value))}
                      placeholder="Qty"
                      className="h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-900 dark:text-white font-bold"
                    />
                  </div>

                  {activeProduct && (
                    <div className="text-[10px] text-slate-500">
                      Product Total: <b className="text-slate-900 dark:text-white">Rs. {selectedProdQty * activeProduct.pricePerUnit} PKR</b>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="w-full h-9 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Active Basket</span>
                  </button>
                </div>

                {/* Cart list table */}
                <div className="flex-1 flex flex-col min-h-[150px]">
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono mb-2">Selected Basket Products</p>
                  
                  <div className="border border-gray-100 dark:border-slate-800 rounded-xl overflow-hidden flex-1 overflow-y-auto max-h-[220px]">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-gray-50 dark:bg-slate-950 text-gray-500">
                        <tr>
                          <th className="p-2.5">Product</th>
                          <th className="p-2.5 text-right">Rate</th>
                          <th className="p-2.5 text-center">Qty</th>
                          <th className="p-2.5 text-right">Sum Total</th>
                          <th className="p-2.5 text-center">Delete</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                        {cart.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="text-center py-8 text-gray-400">
                              Active basket is currently empty. Add products.
                            </td>
                          </tr>
                        ) : (
                          cart.map(item => (
                            <tr key={item.productId}>
                              <td className="p-2.5 font-bold text-gray-900 dark:text-white">{item.name}</td>
                              <td className="p-2.5 text-right text-gray-500 font-mono">Rs. {item.rate}</td>
                              <td className="p-2.5 text-center font-bold">{item.quantity} {item.unit}</td>
                              <td className="p-2.5 text-right font-bold text-gray-900 dark:text-white font-mono">Rs. {item.amount}</td>
                              <td className="p-2.5 text-center">
                                <button 
                                  onClick={() => removeFromCart(item.productId)}
                                  className="text-rose-500 p-0.5 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded"
                                >
                                  ✕
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

              {/* Right Column (4-Grid): Billing Parameters and Submit */}
              <form onSubmit={handleInvoiceSubmit} className="lg:col-span-5 p-6 bg-slate-50 dark:bg-slate-950/60 overflow-y-auto space-y-4 flex flex-col h-full justify-between">
                
                <div className="space-y-3 flex-1">
                  <p className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-1.5 flex items-center gap-1">
                    <Percent className="w-4 h-4 text-blue-600" />
                    <span>Summary Ledger Details</span>
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-gray-500 block">Discount (Rs.)</label>
                      <input 
                        type="number" 
                        value={discount}
                        onChange={(e) => setDiscount(Number(e.target.value))}
                        className="w-full h-10 px-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-900 dark:text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-gray-500 block">Sales Tax Rate (%)</label>
                      <input 
                        type="number" 
                        value={taxRate}
                        onChange={(e) => setTaxRate(Number(e.target.value))}
                        placeholder="e.g. 5%"
                        className="w-full h-10 px-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-gray-500 block">Extra Delivery Fee</label>
                      <input 
                        type="number" 
                        value={extraCharges}
                        onChange={(e) => setExtraCharges(Number(e.target.value))}
                        className="w-full h-10 px-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-900 dark:text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-gray-500 block">Settlement Method</label>
                      <select 
                        value={payMethod}
                        onChange={(e) => setPayMethod(e.target.value as PaymentMethod)}
                        className="w-full h-10 px-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-900 dark:text-white cursor-pointer"
                      >
                        {Object.values(PaymentMethod).map(m => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Calculations breakdown list */}
                  <div className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Cart Total:</span>
                      <span className="font-bold">Rs. {cartSubtotal}</span>
                    </div>
                    <div className="flex justify-between text-rose-500">
                      <span>Discount (Deducted):</span>
                      <span>- Rs. {discount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Punjab Sales Tax ({taxRate}%):</span>
                      <span>+ Rs. {calculatedTax}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee:</span>
                      <span>+ Rs. {extraCharges}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-100 dark:border-slate-800 pt-1.5 text-sm font-black text-slate-900 dark:text-white">
                      <span>Net Total Payable:</span>
                      <span className="text-blue-600 dark:text-blue-400">Rs. {cartNetTotal}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-500 block">Received Payment Amount *</label>
                    <input 
                      type="number" 
                      value={paid}
                      onChange={(e) => setPaid(Number(e.target.value))}
                      className="w-full h-11 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-white dark:bg-slate-900 dark:text-white font-sans font-extrabold text-blue-600 dark:text-blue-400"
                    />
                  </div>

                  {/* Khata remaining warning */}
                  {cartNetTotal - paid > 0 && (
                    <div className="p-3 bg-amber-500/5 border border-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] rounded-xl font-bold">
                      Pending balance of Rs. {cartNetTotal - paid} will be charged to customer khata debt!
                    </div>
                  )}

                </div>

                {/* Confirm actions */}
                <div className="flex gap-2 border-t border-slate-100 dark:border-slate-800 pt-4 mt-4">
                  <button 
                    type="button" 
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 h-10 text-xs font-semibold bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="flex-2 h-10 text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 rounded-xl transition-all shadow-md shadow-blue-500/25 cursor-pointer"
                  >
                    Generate Invoice
                  </button>
                </div>

              </form>

            </div>

          </div>
        </div>
      )}

      {/* ----------------- DIALOG RECEIPT: THERMAL PREVIEW ----------------- */}
      {selectedInvoiceId && activeInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs px-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden">
            
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-950 text-white flex justify-between items-center">
              <h3 className="text-xs font-bold tracking-wide uppercase font-mono">Thermal Printer Slip</h3>
              <button onClick={() => setSelectedInvoiceId(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-950 font-mono text-[11px] text-gray-800 dark:text-slate-300 select-none">
              
              <div className="text-center space-y-1 mb-4 border-b border-dashed border-gray-300 dark:border-slate-700 pb-3">
                <h4 className="text-sm font-black tracking-widest text-slate-900 dark:text-white">SUBHANALLAH MILK SHOP</h4>
                <p>Main Bazaar Samanabad, Lahore</p>
                <p>Phone: 0300-1234567</p>
                <p className="text-[10px] text-gray-400 mt-2">BILL INVOICE RECEIPT</p>
              </div>

              <div className="space-y-1 mb-4 border-b border-dashed border-gray-300 dark:border-slate-700 pb-3">
                <p>INV NO: <b>{activeInvoice.invoiceNumber}</b></p>
                <p>DATE  : {activeInvoice.date}</p>
                <p>ACC   : {activeInvoice.customerName}</p>
                <p>METHOD: {activeInvoice.paymentMethod}</p>
              </div>

              {/* Products list */}
              <div className="space-y-2 mb-4 border-b border-dashed border-gray-300 dark:border-slate-700 pb-3">
                <div className="flex justify-between text-gray-500 font-bold border-b border-slate-100 dark:border-slate-800 pb-1">
                  <span>ITEM</span>
                  <span className="text-right">SUM</span>
                </div>
                {activeInvoice.products.map(p => (
                  <div key={p.productId} className="flex justify-between">
                    <div>
                      <span>{p.name}</span>
                      <span className="block text-[10px] text-gray-500">{p.quantity} x Rs.{p.rate}</span>
                    </div>
                    <span className="font-bold">Rs.{p.amount}</span>
                  </div>
                ))}
              </div>

              {/* Calculations */}
              <div className="space-y-1.5 mb-4 border-b border-dashed border-gray-300 dark:border-slate-700 pb-3 text-right">
                <p>Discount: <b className="text-rose-500">- Rs.{activeInvoice.discount}</b></p>
                <p>Punjab Sales Tax: <b>+ Rs.{activeInvoice.tax}</b></p>
                <p>Delivery Fees: <b>+ Rs.{activeInvoice.extraCharges}</b></p>
                <p className="text-xs font-black text-slate-950 dark:text-white pt-1">NET TOTAL: <span className="text-blue-600 dark:text-blue-400">Rs.{activeInvoice.total}</span></p>
                <p className="text-xs font-black text-emerald-600">CASH PAID: <span>Rs.{activeInvoice.paid}</span></p>
                <p className="text-xs font-black text-rose-500">LEDGER DEBT: <span>Rs.{activeInvoice.remaining}</span></p>
              </div>

              <div className="text-center space-y-1">
                <p className="font-bold">JAZAKALLAH KHAYRAN FOR YOUR VISIT!</p>
                <p className="text-[10px] text-gray-400">Software designed by Subhanallah ERP Platform</p>
              </div>

            </div>

            <div className="p-4 bg-gray-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button 
                onClick={() => {
                  alert("Executing simulated print spooler... Done!");
                  setSelectedInvoiceId(null);
                }}
                className="w-full h-10 text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Execute Printing</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
