import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Milk, Eye, EyeOff, LogIn } from "lucide-react";

export const LoginView: React.FC = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username || !password) { setError("Please enter username and password"); return; }
    setLoading(true);
    const err = await login(username, password);
    setLoading(false);
    if (err) setError(err);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto shadow-lg shadow-blue-500/30 mb-4">
              <Milk className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-lg font-black text-white">Subhanallah Milk Shop</h1>
            <p className="text-xs text-slate-400 mt-1">ERP Billing Terminal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl font-medium text-center">
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-slate-400 block tracking-widest">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full h-11 px-4 border border-white/10 rounded-xl text-sm bg-white/5 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                autoFocus
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-slate-400 block tracking-widest">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full h-11 px-4 pr-11 border border-white/10 rounded-xl text-sm bg-white/5 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Sign In to Terminal
                </span>
              )}
            </button>
          </form>

          <p className="text-[10px] text-slate-500 text-center mt-6">
            Default: admin / admin
          </p>
        </div>
      </div>
    </div>
  );
};
