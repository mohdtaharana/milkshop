/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { 
  Settings, User, Moon, Sun, Languages, Landmark, Percent, 
  CheckCircle2, Bell, Shield, Sparkles, MessageSquare 
} from "lucide-react";

export const SettingsView: React.FC = () => {
  const { 
    currentRole, setRole, theme, toggleTheme, language, setLanguage, t, direction 
  } = useApp();

  // Settings Forms
  const [shopName, setShopName] = useState("Subhanallah Milk Shop");
  const [shopPhone, setShopPhone] = useState("0300-1234567");
  const [shopAddress, setShopAddress] = useState("Main Bazaar Samanabad, Lahore");
  const [easyPaisa, setEasyPaisa] = useState("0300-1234567");
  const [tax, setTax] = useState(0);
  const [greeting, setGreeting] = useState("JAZAKALLAH KHAYRAN FOR YOUR VISIT!");

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    alert("System specifications stored successfully! Rules synchronized.");
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-blue-600" />
          <span>System Configurations & ERP Control Center</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Establish global retail parameters, base milk pricing baselines, and multi-user role constraints
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Fast Toggles */}
        <div className="space-y-4 md:col-span-1">
          
          {/* Quick Language Swap */}
          <div className="bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
              <Languages className="w-4 h-4 text-blue-600" />
              <span>Language Select</span>
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <button
                onClick={() => setLanguage("en")}
                className={`h-10 rounded-xl transition-all border cursor-pointer ${
                  language === "en" 
                    ? "bg-blue-600 border-blue-600 text-white shadow-xs" 
                    : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50/50"
                }`}
              >
                English (Default)
              </button>
              <button
                onClick={() => setLanguage("ur")}
                className={`h-10 rounded-xl transition-all border cursor-pointer ${
                  language === "ur" 
                    ? "bg-blue-600 border-blue-600 text-white shadow-xs" 
                    : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50/50"
                }`}
              >
                اردو (Urdu RTL)
              </button>
            </div>
          </div>

          {/* Theme Selector */}
          <div className="bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
              {theme === "dark" ? <Sun className="w-4 h-4 text-blue-600" /> : <Moon className="w-4 h-4 text-blue-600" />}
              <span>Aesthetic Theme</span>
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <button
                onClick={() => { if (theme === "dark") toggleTheme(); }}
                className={`h-10 rounded-xl transition-all border cursor-pointer ${
                  theme === "light" 
                    ? "bg-blue-600 border-blue-600 text-white" 
                    : "border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-slate-50/50"
                }`}
              >
                <div className="flex items-center justify-center gap-1.5">
                  <Sun className="w-3.5 h-3.5" />
                  <span>Light Mode</span>
                </div>
              </button>
              <button
                onClick={() => { if (theme === "light") toggleTheme(); }}
                className={`h-10 rounded-xl transition-all border cursor-pointer ${
                  theme === "dark" 
                    ? "bg-blue-600 border-blue-600 text-white" 
                    : "border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-slate-50/50"
                }`}
              >
                <div className="flex items-center justify-center gap-1.5">
                  <Moon className="w-3.5 h-3.5" />
                  <span>Dark Slate</span>
                </div>
              </button>
            </div>
          </div>

          {/* User Roles System */}
          <div className="bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-600" />
              <span>Security Access Role</span>
            </h3>
            <p className="text-[10px] text-slate-400 mt-1">Users mode restricts invoice deletion or roster salary edits.</p>
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <button
                onClick={() => setRole("Admin")}
                className={`h-10 rounded-xl transition-all border cursor-pointer ${
                  currentRole === "Admin" 
                    ? "bg-blue-600 border-blue-600 text-white" 
                    : "border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-slate-50/50"
                }`}
              >
                Admin (مالک)
              </button>
              <button
                onClick={() => setRole("User")}
                className={`h-10 rounded-xl transition-all border cursor-pointer ${
                  currentRole === "User" 
                    ? "bg-blue-600 border-blue-600 text-white" 
                    : "border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-slate-50/50"
                }`}
              >
                User (ملازم)
              </button>
            </div>
          </div>

        </div>

        {/* Right Column (2-Grid): General Business Parameters Form */}
        <div className="md:col-span-2">
          
          <div className="bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
            
            <form onSubmit={handleSaveSettings} className="space-y-4">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2 mb-4">
                <Landmark className="w-4 h-4 text-blue-600" />
                <span>Shop Profile & Billing Defaults</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-gray-500 block">Registered Shop Name</label>
                  <input 
                    type="text" 
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-gray-500 block">Shop Contact Number</label>
                  <input 
                    type="text" 
                    value={shopPhone}
                    onChange={(e) => setShopPhone(e.target.value)}
                    className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase text-gray-500 block">Store Address (Thermal Receipt Print)</label>
                <input 
                  type="text" 
                  value={shopAddress}
                  onChange={(e) => setShopAddress(e.target.value)}
                  className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-gray-500 block">EasyPaisa Payout Number</label>
                  <input 
                    type="text" 
                    value={easyPaisa}
                    onChange={(e) => setEasyPaisa(e.target.value)}
                    className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-gray-500 block">Standard Sales Tax (%)</label>
                  <input 
                    type="number" 
                    value={tax}
                    onChange={(e) => setTax(Number(e.target.value))}
                    className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase text-gray-500 block">Custom Receipt Greeting / Blessing</label>
                <input 
                  type="text" 
                  value={greeting}
                  onChange={(e) => setGreeting(e.target.value)}
                  className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:text-white font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full h-11 text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 rounded-xl transition-all shadow-md shadow-blue-500/25 cursor-pointer"
              >
                Apply ERP Specifications
              </button>

            </form>

          </div>

        </div>

      </div>

    </div>
  );
};
