/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Shift } from "../types";
import { 
  Plus, Search, Truck, MapPin, Phone, Trash2, Calendar, Clock, 
  CheckCircle2, Sparkles, X, User2, MessageSquare, ToggleLeft 
} from "lucide-react";

interface DeliveryOrder {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  area: string;
  milkQuantity: number;
  yogurtQuantity: number;
  assignedRider: string;
  shift: Shift;
  specialInstructions: string;
  status: "Scheduled" | "Out for Delivery" | "Delivered" | "Failed";
}

export const DeliveriesView: React.FC = () => {
  const { 
    employees, formatCurrency, formatNumber, t, direction 
  } = useApp();

  // Local deliveries state for maximum stability
  const [deliveries, setDeliveries] = useState<DeliveryOrder[]>([
    { 
      id: "DROP-001", 
      customerName: "Haji Salim Akhtar", 
      phone: "0300-4441122", 
      address: "House 102, Sector B, Samanabad", 
      area: "Samanabad", 
      milkQuantity: 4, 
      yogurtQuantity: 2, 
      assignedRider: "Zubair Ahmad", 
      shift: Shift.MORNING, 
      specialInstructions: "Leave milk in the blue cooler box outside the gate", 
      status: "Delivered" 
    },
    { 
      id: "DROP-002", 
      customerName: "Prof. Tariq Jamil", 
      phone: "0321-5556677", 
      address: "Plot 12, Ghalib Road, Gulberg III", 
      area: "Gulberg", 
      milkQuantity: 6, 
      yogurtQuantity: 0, 
      assignedRider: "Kamran Shah", 
      shift: Shift.MORNING, 
      specialInstructions: "Ring bell twice, deliver to ground floor", 
      status: "Out for Delivery" 
    },
    { 
      id: "DROP-003", 
      customerName: "Mrs. Amna Bilal", 
      phone: "0313-9988112", 
      address: "Villa 45-C, Phase 5, DHA", 
      area: "DHA", 
      milkQuantity: 3, 
      yogurtQuantity: 1, 
      assignedRider: "Kamran Shah", 
      shift: Shift.MORNING, 
      specialInstructions: "Drop at security porch", 
      status: "Scheduled" 
    },
    { 
      id: "DROP-004", 
      customerName: "Zahid Tea Stall", 
      phone: "0333-1122334", 
      address: "Main Bazaar, Ichhra", 
      area: "Ichhra", 
      milkQuantity: 40, 
      yogurtQuantity: 10, 
      assignedRider: "Zubair Ahmad", 
      shift: Shift.MORNING, 
      specialInstructions: "Deliver bulk milk cans inside kitchen", 
      status: "Delivered" 
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [areaFilter, setAreaFilter] = useState("All");

  // Form Fields
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [area, setArea] = useState("Samanabad");
  const [qty, setQty] = useState<number>(2); // standard 2 Litres daily subscription
  const [yogurtQty, setYogurtQty] = useState<number>(0);
  const [rider, setRider] = useState("Unassigned");
  const [shift, setShift] = useState<Shift>(Shift.MORNING);
  const [notes, setNotes] = useState("Please drop at gate before 7 AM.");
  const [formError, setFormError] = useState("");

  // Extract active delivery boys from employees list
  const activeRiders = employees.filter(s => s.role === "Delivery Boy");

  // Add delivery order helper
  const addDeliveryOrder = (order: Omit<DeliveryOrder, "id">) => {
    const newId = `DROP-${Math.floor(Math.random() * 900) + 100}`;
    setDeliveries(prev => [{ ...order, id: newId }, ...prev]);
  };

  const updateDeliveryStatus = (id: string, status: DeliveryOrder["status"]) => {
    setDeliveries(prev => prev.map(d => d.id === id ? { ...d, status } : d));
  };

  const deleteDeliveryOrder = (id: string) => {
    setDeliveries(prev => prev.filter(d => d.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!customerName.trim() || !phone.trim() || !address.trim()) {
      setFormError("Please fill out Customer Name, Phone, and Complete Address.");
      return;
    }

    if (qty <= 0 && yogurtQty <= 0) {
      setFormError("Please specify at least 1 milk litre or 1 yogurt quantity.");
      return;
    }

    addDeliveryOrder({
      customerName,
      phone,
      address,
      area,
      milkQuantity: Number(qty),
      yogurtQuantity: Number(yogurtQty),
      assignedRider: rider === "Unassigned" ? "Kamran Shah" : rider,
      shift,
      specialInstructions: notes,
      status: "Scheduled"
    });

    setCustomerName("");
    setPhone("");
    setAddress("");
    setNotes("Please drop at gate before 7 AM.");
    setShowAddModal(false);
    alert("New subscriber delivery schedule recorded successfully!");
  };

  const filteredDeliveries = deliveries.filter(del => {
    const matchesSearch = (del.customerName || "").toLowerCase().includes((searchQuery || "").toLowerCase()) || 
                          (del.assignedRider || "").toLowerCase().includes((searchQuery || "").toLowerCase());
    const matchesArea = areaFilter === "All" || del.area === areaFilter;
    return matchesSearch && matchesArea;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Truck className="w-6 h-6 text-blue-600" />
            <span>Subscriber Logistics & Home Deliveries</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Organize early morning milk drop routes, assign delivery boys, and monitor delivery confirmations
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-md shadow-blue-500/25 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Daily Drop</span>
        </button>
      </div>

      {/* KPI stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-mono">Total Subscribed Drops</p>
            <h4 className="text-sm font-extrabold text-gray-900 dark:text-white">
              {deliveries.length} Households
            </h4>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-mono">Delivered Today</p>
            <h4 className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
              {deliveries.filter(d => d.status === "Delivered").length} Complete
            </h4>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-mono">Pending drops</p>
            <h4 className="text-sm font-extrabold text-amber-500">
              {deliveries.filter(d => d.status === "Scheduled" || d.status === "Out for Delivery").length} Active drops
            </h4>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-500 flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-mono">Coverage Zones</p>
            <h4 className="text-sm font-extrabold text-gray-900 dark:text-white">
              Samanabad, Ichhra, DHA
            </h4>
          </div>
        </div>

      </div>

      {/* Roster list */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        
        {/* Filters */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-3 justify-between items-center bg-slate-50/50 dark:bg-slate-950/10">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute top-3 left-3" />
            <input 
              type="text" 
              placeholder="Search delivery logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 border border-slate-200 dark:border-slate-700 pl-9 pr-4 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:bg-slate-950 dark:text-white"
            />
          </div>

          <select 
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
            className="h-10 border border-slate-200 dark:border-slate-700 rounded-xl text-xs px-3 bg-white dark:bg-slate-950 dark:text-white cursor-pointer"
          >
            <option value="All">All Coverage Areas</option>
            <option value="Samanabad">Samanabad</option>
            <option value="Ichhra">Ichhra</option>
            <option value="Gulberg">Gulberg</option>
            <option value="DHA">DHA Phase 5</option>
          </select>
        </div>

        {/* Deliveries Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-500 font-mono text-xs uppercase bg-slate-50/40 dark:bg-slate-950/20 whitespace-nowrap">
                <th className="p-4">Subscriber details</th>
                <th className="p-4">Sector Zone</th>
                <th className="p-4">Daily Subscription Intake</th>
                <th className="p-4">Shift & Log Timing</th>
                <th className="p-4">Assigned Delivery Rider</th>
                <th className="p-4 text-center">Rider Confirmation Status</th>
                <th className="p-4 text-center">Roster Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredDeliveries.map(del => (
                <tr key={del.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-950/20 transition-colors whitespace-nowrap">
                  <td className="p-4">
                    <div className="font-bold text-slate-900 dark:text-white">{del.customerName}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {del.id} • Tel: {del.phone}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" />
                      <span>{del.address}</span>
                    </div>
                  </td>
                  <td className="p-4 font-bold text-slate-700 dark:text-slate-300">
                    {del.area}
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-slate-900 dark:text-white">{del.milkQuantity} Litres Fresh Milk</div>
                    {del.yogurtQuantity > 0 && (
                      <div className="text-[10px] text-slate-500">{del.yogurtQuantity} Yogurt Cups daily</div>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-slate-900 dark:text-white">{del.shift}</div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <MessageSquare className="w-3 h-3 text-blue-600" />
                      <span>{del.specialInstructions}</span>
                    </div>
                  </td>
                  <td className="p-4 font-bold text-gray-900 dark:text-white">
                    {del.assignedRider}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      {del.status === "Delivered" ? (
                        <span className="inline-flex items-center gap-0.5 bg-emerald-500/10 text-emerald-500 px-2.5 py-1 rounded-full font-bold text-[10px]">
                          Delivered
                        </span>
                      ) : del.status === "Out for Delivery" ? (
                        <span className="inline-flex items-center gap-0.5 bg-amber-500/10 text-amber-500 px-2.5 py-1 rounded-full font-bold text-[10px]">
                          Out for Delivery
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-0.5 bg-gray-500/10 text-gray-500 px-2.5 py-1 rounded-full font-medium text-[10px]">
                          Scheduled
                        </span>
                      )}

                      {/* Quick confirmation triggers */}
                      {del.status !== "Delivered" && (
                        <div className="flex gap-1 mt-1">
                          <button
                            onClick={() => updateDeliveryStatus(del.id, "Out for Delivery")}
                            className="px-1.5 py-0.5 bg-amber-500/15 hover:bg-amber-500 text-amber-600 hover:text-slate-950 rounded-sm font-semibold text-[9px] cursor-pointer"
                          >
                            Set Out
                          </button>
                          <button
                            onClick={() => updateDeliveryStatus(del.id, "Delivered")}
                            className="px-1.5 py-0.5 bg-emerald-500/15 hover:bg-emerald-500 text-emerald-600 hover:text-slate-950 rounded-sm font-semibold text-[9px] cursor-pointer"
                          >
                            Deliver
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => {
                        if (confirm("Remove subscriber drop item?")) {
                          deleteDeliveryOrder(del.id);
                        }
                      }}
                      className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* ----------------- DIALOG MODAL: ADD Drop schedule ----------------- */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs px-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
            
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-950 text-white flex justify-between items-center">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-500" />
                <span>Schedule New Household Delivery Drop</span>
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-gray-500 block">Subscriber Name *</label>
                  <input 
                    type="text" 
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Chaudhary Nabeel"
                    className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-gray-500 block">Phone Contact *</label>
                  <input 
                    type="text" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0300-1122334"
                    className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-gray-500 block">Coverage Area</label>
                  <select 
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white cursor-pointer"
                  >
                    <option value="Samanabad">Samanabad</option>
                    <option value="Ichhra">Ichhra</option>
                    <option value="Gulberg">Gulberg</option>
                    <option value="DHA">DHA Phase 5</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-gray-500 block">Assigned Rider</label>
                  <select 
                    value={rider}
                    onChange={(e) => setRider(e.target.value)}
                    className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white cursor-pointer"
                  >
                    <option value="Unassigned">Assign Best Available</option>
                    {activeRiders.map(r => (
                      <option key={r.id} value={r.name}>{r.name}</option>
                    ))}
                    <option value="Zubair Ahmad">Zubair Ahmad</option>
                    <option value="Kamran Shah">Kamran Shah</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-gray-500 block">Daily Milk Volume (Litres)</label>
                  <input 
                    type="number" 
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-gray-500 block">Daily Yogurt Volume (Cups)</label>
                  <input 
                    type="number" 
                    value={yogurtQty}
                    onChange={(e) => setYogurtQty(Number(e.target.value))}
                    className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-gray-500 block">Preferred Shift</label>
                  <select 
                    value={shift}
                    onChange={(e) => setShift(e.target.value as Shift)}
                    className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white cursor-pointer"
                  >
                    <option value={Shift.MORNING}>Morning (صبح - Early 6 AM)</option>
                    <option value={Shift.EVENING}>Evening (شام - 5 PM)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-gray-500 block">Special Instructions</label>
                  <input 
                    type="text" 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="E.g., Leave with security guard"
                    className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase text-gray-500 block">House Delivery Address *</label>
                <input 
                  type="text" 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street 4, Sector B, House #14"
                  className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white"
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
                  Log Drop Schedule
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
