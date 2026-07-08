/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { 
  Menu, Sun, Moon, Languages, Bell, ShieldCheck, 
  Search, Sliders, CheckCircle2, User, ChevronDown, Check, LogOut, X, Landmark, AlertTriangle
} from "lucide-react";

interface NavbarProps {
  onMenuClick: () => void;
  onSearchChange?: (val: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick, onSearchChange }) => {
  const { 
    language, setLanguage, 
    theme, setTheme, 
    role, setRole, 
    currentUser, 
    notifications, clearNotification, clearAllNotifications,
    t, direction
  } = useApp();

  const [searchVal, setSearchVal] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchVal(val);
    if (onSearchChange) onSearchChange(val);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-8 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors duration-200">
      
      {/* Left items (Menu trigger + Search) */}
      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={onMenuClick}
          className="p-2 text-gray-600 hover:text-gray-900 dark:text-slate-300 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search */}
        <div className="relative max-w-md w-full hidden md:block">
          <div className={`absolute inset-y-0 flex items-center pointer-events-none text-gray-400
            ${direction === "rtl" ? "left-3" : "left-3"}
          `}>
            <Search className="w-4 h-4 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={searchVal}
            onChange={handleSearch}
            className={`w-full h-10 border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-950/40 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 dark:text-white dark:placeholder-slate-400 focus:outline-hidden transition-all rounded-full
              ${direction === "rtl" ? "pr-10 pl-4" : "pl-10 pr-4"}
            `}
          />
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        
        {/* Role Switcher */}
        <div className="relative flex items-center mr-1">
          <button
            onClick={() => setRole(role === "Admin" ? "User" : "Admin")}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
            title={t("roleSwitch")}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">{role === "Admin" ? `${t("admin")} Mode` : `${t("user")} Mode`}</span>
          </button>
        </div>

        {/* Language Switcher */}
        <button
          onClick={() => setLanguage(language === "en" ? "ur" : "en")}
          className="p-2 text-gray-600 hover:text-gray-900 dark:text-slate-300 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-all font-sans font-bold text-xs flex items-center gap-1 cursor-pointer"
          title={t("language")}
        >
          <Languages className="w-4 h-4 text-blue-600" />
          <span>{language === "en" ? "اردو" : "English"}</span>
        </button>

        {/* Theme Switcher */}
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="p-2 text-gray-600 hover:text-gray-900 dark:text-slate-300 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
          title={t("theme")}
        >
          {theme === "light" ? (
            <Moon className="w-4 h-4 text-slate-700" />
          ) : (
            <Sun className="w-4 h-4 text-amber-400" />
          )}
        </button>

        {/* Notifications Dropdown Container */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-gray-600 hover:text-gray-900 dark:text-slate-300 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-all relative cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className={`absolute z-50 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 shadow-2xl py-2 transition-all duration-200
              ${direction === "rtl" ? "left-0" : "right-0"}
            `}>
              <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-blue-600" />
                  {t("notifications")}
                </span>
                {unreadCount > 0 && (
                  <button 
                    onClick={clearAllNotifications}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:hover:text-blue-400"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-slate-800">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-gray-400 dark:text-slate-500">
                    No new alerts
                  </div>
                ) : (
                  notifications.map((not) => (
                    <div 
                      key={not.id} 
                      className={`p-3 text-xs flex gap-2.5 hover:bg-gray-50 dark:hover:bg-slate-900 transition-colors
                        ${not.read ? "opacity-60" : "bg-blue-500/5"}
                      `}
                    >
                      <div className="mt-0.5">
                        {not.type === "danger" ? (
                           <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                        ) : not.type === "warning" ? (
                           <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                        ) : (
                           <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 dark:text-white truncate">{not.title}</p>
                        <p className="text-gray-600 dark:text-slate-300 mt-0.5 text-[11px] leading-relaxed">{not.message}</p>
                        <span className="text-[9px] font-mono text-gray-400 mt-1 block">
                          {new Date(not.date).toLocaleTimeString()}
                        </span>
                      </div>
                      {!not.read && (
                        <button
                          onClick={() => clearNotification(not.id)}
                          className="self-center p-1 text-gray-400 hover:text-blue-500 rounded-full"
                          title="Mark read"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-1.5 p-1 text-gray-600 hover:text-gray-900 dark:text-slate-300 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold font-mono text-xs flex items-center justify-center">
              {currentUser.avatar}
            </div>
            <ChevronDown className="w-3.5 h-3.5 hidden sm:inline" />
          </button>

          {showProfileMenu && (
            <div className={`absolute z-50 mt-2 w-48 rounded-xl bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-800 shadow-2xl py-1 transition-all duration-200
              ${direction === "rtl" ? "left-0" : "right-0"}
            `}>
              <div className="px-4 py-2 border-b border-gray-100 dark:border-slate-800">
                <p className="text-xs font-bold text-gray-900 dark:text-white">{currentUser.name}</p>
                <p className="text-[10px] font-mono text-gray-400 capitalize">{(role || "").toLowerCase()}</p>
              </div>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  setRole(role === "Admin" ? "User" : "Admin");
                }}
                className="w-full text-left px-4 py-2 text-xs text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-900 flex items-center gap-2"
              >
                <Sliders className="w-3.5 h-3.5 text-blue-600" />
                <span>{t("roleSwitch")}</span>
              </button>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  alert("Logged out successfully! (Mock Action)");
                }}
                className="w-full text-left px-4 py-2 text-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 flex items-center gap-2 border-t border-gray-100 dark:border-slate-800 mt-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t("logout")}</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
