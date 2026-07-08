import React from "react";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import { Menu, RefreshCw, Moon, Sun, Loader2, LogOut } from "lucide-react";

interface NavbarProps {
  onMenuClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { 
    t, currentUser, role, theme, setTheme, loading, refreshAll
  } = useApp();
  const { user: authUser, logout } = useAuth();

  return (
    <header className="flex items-center justify-between px-4 md:px-6 h-14 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex-shrink-0 z-30">
      
      {/* Left: Hamburger + Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all lg:hidden cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden sm:flex items-center gap-1.5">
          <span className="text-xs text-slate-400 font-mono">
            {new Date().toLocaleDateString("en-PK", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })}
          </span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">

        {/* Refresh */}
        <button
          onClick={refreshAll}
          disabled={loading}
          className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 transition-all cursor-pointer disabled:opacity-50"
          title="Refresh data from server"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 transition-all cursor-pointer"
        >
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* User Badge */}
        <div className="hidden md:flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800 ml-1">
          <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-700 dark:text-blue-400 font-mono text-[10px] font-bold">
            {authUser?.displayName?.charAt(0)?.toUpperCase() || currentUser.avatar}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-none">{authUser?.displayName || currentUser.name}</span>
            <span className="text-[9px] text-slate-400 mt-0.5">{authUser?.role || role}</span>
          </div>
          <button
            onClick={logout}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all cursor-pointer"
            title="Sign out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </header>
  );
};
