/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
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
import { SalesView } from "./components/SalesView";
import { ExpensesView } from "./components/ExpensesView";
import { StaffView } from "./components/StaffView";
import { DeliveriesView } from "./components/DeliveriesView";
import { ReportsView } from "./components/ReportsView";
import { AuditLogView } from "./components/AuditLogView";
import { SettingsView } from "./components/SettingsView";

// Main Layout Wrapper utilizing context hook states
const MainLayout: React.FC = () => {
  const { direction, theme, language } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Background translation system for Urdu language support
  useEffect(() => {
    if (language !== "ur") return;

    // Compile a direct and case-insensitive phrase mapping dictionary
    const map = new Map<string, string>();
    for (const key of Object.keys(translations)) {
      const entry = translations[key];
      if (entry && entry.en && entry.ur) {
        map.set(entry.en.toLowerCase().trim(), entry.ur);
        map.set(key.toLowerCase().trim(), entry.ur);
      }
    }

    // Translate content node text matching phrases in translations dictionary
    const translateText = (text: string): string => {
      const trimmed = text.trim();
      if (!trimmed) return text;

      const lowered = trimmed.toLowerCase();
      // Direct exact match
      if (map.has(lowered)) {
        return map.get(lowered)!;
      }

      // Substring match and replace of individual dictionary phrases
      let updated = text;
      let matched = false;
      // Sort keys from longest to shortest to translate complex sentences before individual words
      const sortedKeys = Array.from(map.keys()).sort((a, b) => b.length - a.length);
      for (const k of sortedKeys) {
        if (k.length > 2 && lowered.includes(k)) {
          const urduVal = map.get(k)!;
          // Escape regex characters
          const escaped = k.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
          const regex = new RegExp(`\\b${escaped}\\b`, "gi");
          // Fallback if boundary word matching is too restrictive
          const simpleRegex = new RegExp(escaped, "gi");
          
          const prev = updated;
          updated = updated.replace(regex, urduVal);
          if (updated === prev) {
            updated = updated.replace(simpleRegex, urduVal);
          }
          matched = true;
        }
      }
      return matched ? updated : text;
    };

    // Crawl DOM nodes recursively
    const walk = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const parent = node.parentElement;
        if (parent && ["SCRIPT", "STYLE", "TEXTAREA"].includes(parent.tagName)) return;
        
        const content = node.nodeValue || "";
        // Skip translating if already contains Urdu/Arabic characters
        if (/[\u0600-\u06FF]/.test(content)) return;

        const translated = translateText(content);
        if (translated !== content) {
          node.nodeValue = translated;
        }
      } else {
        for (let i = 0; i < node.childNodes.length; i++) {
          walk(node.childNodes[i]);
        }
      }
    };

    // Run initial scan
    walk(document.body);

    // Dynamic translation via observer
    const observer = new MutationObserver((mutations) => {
      observer.disconnect();

      for (const mutation of mutations) {
        if (mutation.type === "childList") {
          for (let i = 0; i < mutation.addedNodes.length; i++) {
            walk(mutation.addedNodes[i]);
          }
        } else if (mutation.type === "characterData") {
          walk(mutation.target);
        }
      }

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });

    return () => {
      observer.disconnect();
    };
  }, [language]);

  return (
    <div key={language} className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans transition-colors duration-200">
      
      {/* Persistent Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Core View Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Navbar */}
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        {/* Content Container with custom RTL/LTR paddings */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar focus:outline-hidden">
          <Routes>
            <Route path="/" element={<DashboardView />} />
            <Route path="/customers" element={<CustomersView />} />
            <Route path="/suppliers" element={<SuppliersView />} />
            <Route path="/collection" element={<CollectionView />} />
            <Route path="/inventory" element={<InventoryView />} />
            <Route path="/sales" element={<SalesView />} />
            <Route path="/expenses" element={<ExpensesView />} />
            <Route path="/staff" element={<StaffView />} />
            <Route path="/delivery" element={<DeliveriesView />} />
            <Route path="/payments" element={<ReportsView />} /> {/* Map ledger payments to general balance reports */}
            <Route path="/reports" element={<ReportsView />} />
            <Route path="/audit-log" element={<AuditLogView />} />
            <Route path="/settings" element={<SettingsView />} />
            
            {/* Fallback routing */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

      </div>
    </div>
  );
};

// Root Component enclosing AppProvider & Router
export default function App() {
  return (
    <AppProvider>
      <Router>
        <MainLayout />
      </Router>
    </AppProvider>
  );
}
