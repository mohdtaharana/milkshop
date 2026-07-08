/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { translations } from "./translations";

// Components & Layout
import { Sidebar } from "./components/Sidebar";
import { Navbar } from "./components/Navbar";

// Modules / Views
import { DashboardView } from "./components/DashboardView";
import { CustomersView } from "./components/CustomersView";
import { SuppliersView } from "./components/SuppliersView";
import { CollectionView } from "./components/CollectionView";
import { InventoryView } from "./components/InventoryView";
import { DeliveryView } from "./components/DeliveryView";
import { ExpensesView } from "./components/ExpensesView";
import { StaffView } from "./components/StaffView";
import { SettingsView } from "./components/SettingsView";
import { LoginView } from "./components/LoginView";

// Loading Spinner
const LoadingScreen: React.FC = () => (
  <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-950">
    <div className="text-center space-y-4">
      <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto shadow-lg shadow-blue-500/30">
        <span className="text-white font-black text-2xl">S</span>
      </div>
      <div className="space-y-2">
        <h2 className="text-sm font-bold text-slate-800 dark:text-white">Subhanallah Milk Shop ERP</h2>
        <div className="flex items-center gap-2 justify-center">
          <div className="w-4 h-4 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-4 h-4 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-4 h-4 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
        <p className="text-xs text-slate-400">Loading data from server...</p>
      </div>
    </div>
  </div>
);

// Auth Guard
const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <LoginView />;
  return <>{children}</>;
};

// Main Layout Wrapper
const MainLayout: React.FC = () => {
  const { direction, theme, language, loading } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // RTL translation observer
  useEffect(() => {
    if (language !== "ur") return;
    const map = new Map<string, string>();
    for (const key of Object.keys(translations)) {
      const entry = translations[key];
      if (entry && entry.en && entry.ur) {
        map.set(entry.en.toLowerCase().trim(), entry.ur);
        map.set(key.toLowerCase().trim(), entry.ur);
      }
    }

    const translateText = (text: string): string => {
      const trimmed = text.trim();
      if (!trimmed) return text;
      const lowered = trimmed.toLowerCase();
      if (map.has(lowered)) return map.get(lowered)!;
      let updated = text;
      const sortedKeys = Array.from(map.keys()).sort((a, b) => b.length - a.length);
      for (const k of sortedKeys) {
        if (k.length > 2 && lowered.includes(k)) {
          const urduVal = map.get(k)!;
          const escaped = k.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
          const regex = new RegExp(`\\b${escaped}\\b`, "gi");
          const simpleRegex = new RegExp(escaped, "gi");
          const prev = updated;
          updated = updated.replace(regex, urduVal);
          if (updated === prev) updated = updated.replace(simpleRegex, urduVal);
        }
      }
      return updated;
    };

    const walk = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const parent = node.parentElement;
        if (parent && ["SCRIPT", "STYLE", "TEXTAREA"].includes(parent.tagName)) return;
        const content = node.nodeValue || "";
        if (/[\u0600-\u06FF]/.test(content)) return;
        const translated = translateText(content);
        if (translated !== content) node.nodeValue = translated;
      } else {
        for (let i = 0; i < node.childNodes.length; i++) walk(node.childNodes[i]);
      }
    };

    walk(document.body);

    const observer = new MutationObserver((mutations) => {
      observer.disconnect();
      for (const mutation of mutations) {
        if (mutation.type === "childList") {
          for (let i = 0; i < mutation.addedNodes.length; i++) walk(mutation.addedNodes[i]);
        } else if (mutation.type === "characterData") {
          walk(mutation.target);
        }
      }
      observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    });

    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, [language]);

  if (loading) return <LoadingScreen />;

  return (
    <div key={language} className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans transition-colors duration-200">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar focus:outline-hidden">
          <Routes>
            <Route path="/" element={<DashboardView />} />
            <Route path="/customers" element={<CustomersView />} />
            <Route path="/suppliers" element={<SuppliersView />} />
            <Route path="/collection" element={<CollectionView />} />
            <Route path="/inventory" element={<InventoryView />} />
            <Route path="/delivery" element={<DeliveryView />} />
            <Route path="/expenses" element={<ExpensesView />} />
            <Route path="/staff" element={<StaffView />} />
            <Route path="/settings" element={<SettingsView />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

function AppContent() {
  return (
    <AuthGuard>
      <MainLayout />
    </AuthGuard>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <AppContent />
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}
