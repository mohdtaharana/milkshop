/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { 
  LayoutDashboard, Users, Truck, Milk, ClipboardList, 
  Receipt, Landmark, Settings, 
  UserSquare2, Sparkles, UserCheck
} from "lucide-react";
import { motion } from "motion/react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { t, language, direction, role, currentUser } = useApp();
  const location = useLocation();

  // Menu Definition
  const menuItems = [
    { 
      path: "/", 
      label: "dashboard", 
      icon: LayoutDashboard,
      roles: ["Admin", "User"]
    },
    { 
      path: "/customers", 
      label: "customers", 
      icon: Users,
      roles: ["Admin", "User"]
    },
    { 
      path: "/suppliers", 
      label: "suppliers", 
      icon: UserSquare2,
      roles: ["Admin"]
    },
    { 
      path: "/collection", 
      label: "milkCollection", 
      icon: Milk,
      roles: ["Admin", "User"]
    },
    { 
      path: "/inventory", 
      label: "inventory", 
      icon: ClipboardList,
      roles: ["Admin", "User"]
    },
    { 
      path: "/delivery", 
      label: "delivery", 
      icon: Truck,
      roles: ["Admin", "User"]
    },
    { 
      path: "/expenses", 
      label: "expenses", 
      icon: Landmark,
      roles: ["Admin"]
    },
    { 
      path: "/staff", 
      label: "staff", 
      icon: UserCheck,
      roles: ["Admin"]
    },
    { 
      path: "/settings", 
      label: "settings", 
      icon: Settings,
      roles: ["Admin", "User"]
    }
  ];

  // Filter based on active role
  const allowedItems = menuItems.filter(item => item.roles.includes(role));

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 z-50 flex flex-col w-64 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 shadow-xl lg:shadow-none transition-all duration-300 lg:static
          ${direction === "rtl" ? "right-0 border-l border-slate-200 dark:border-slate-800" : "left-0 border-r border-slate-200 dark:border-slate-800"}
          ${isOpen ? "translate-x-0" : direction === "rtl" ? "translate-x-full lg:translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Brand Title Block */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950">
          <Link to="/" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 shadow-md">
              <span className="font-sans text-xl font-bold text-white">S</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 leading-none mb-1">
                Management
              </span>
              <span className="font-sans text-sm font-black text-blue-900 dark:text-blue-400 uppercase leading-none">
                {t("appName")}
              </span>
            </div>
          </Link>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 text-slate-400 rounded-md lg:hidden hover:bg-slate-100 hover:text-slate-900"
          >
            ✕
          </button>
        </div>

        {/* Current Operator Profile Tag */}
        <div className="mx-4 my-4 p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/60 dark:border-slate-800 flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-700 dark:text-blue-400 font-mono text-xs font-semibold">
              {currentUser.avatar}
            </div>
            <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-950" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{currentUser.name}</p>
            <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
              <Sparkles className="w-3 h-3 text-blue-500" />
              {role === "Admin" ? t("admin") : t("user")}
            </p>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          {allowedItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group relative
                  ${isActive 
                    ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 font-bold shadow-xs" 
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/60 hover:text-slate-900 dark:hover:text-slate-100"
                  }
                `}
              >
                <div className="flex items-center w-full">
                  <IconComponent 
                    className={`w-5 h-5 flex-shrink-0
                      ${direction === "rtl" ? "ml-3" : "mr-3"}
                      ${isActive ? "text-blue-700 dark:text-blue-400" : "text-slate-400 group-hover:text-blue-500 dark:group-hover:text-blue-400"}
                    `} 
                  />
                  <span className="truncate">{t(item.label)}</span>
                </div>

                {/* Left/Right active indicator bar */}
                {isActive && (
                  <motion.div 
                    layoutId="activeSideIndicator"
                    className={`absolute inset-y-3 w-1 bg-blue-600 dark:bg-blue-500 rounded-full
                      ${direction === "rtl" ? "left-2" : "right-2"}
                    `}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer branding */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 text-[10px] font-mono text-slate-400 text-center flex flex-col gap-1">
          <div>© {new Date().getFullYear()} SUBHANALLAH MILK SHOP</div>
          <div className="text-blue-500/40">REGISTER DIGITIZATION V1.0</div>
        </div>
      </aside>
    </>
  );
};
