import React, { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iOS);

    // Already installed? hide
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setDismissed(true);
      return;
    }
    if (iOS && (window.navigator as any).standalone) {
      setDismissed(true);
      return;
    }

    // Listen for beforeinstallprompt (Chrome/Android/Desktop)
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // iOS doesn't have beforeinstallprompt, so show manually
    if (iOS) {
      setShowBanner(true);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setDismissed(true);
    setDeferredPrompt(null);
    setShowBanner(false);
  };

  if (dismissed || !showBanner) return null;

  // Help screen (iOS instructions or generic help)
  if (showHelp) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-[60] max-w-md mx-auto">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-5">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Install Milk Shop</h3>
            <button onClick={() => { setShowHelp(false); setDismissed(true); }} className="text-slate-400 hover:text-slate-600 cursor-pointer"><X className="w-4 h-4" /></button>
          </div>
          {isIOS ? (
            <ol className="text-xs text-gray-600 dark:text-slate-400 space-y-2 list-decimal list-inside">
              <li>Tap the <strong>Share</strong> button <span className="text-lg">⎙</span> in Safari</li>
              <li>Scroll down and tap <strong>Add to Home Screen</strong></li>
              <li>Tap <strong>Add</strong> in the top right</li>
            </ol>
          ) : (
            <ol className="text-xs text-gray-600 dark:text-slate-400 space-y-2 list-decimal list-inside">
              <li>Open Chrome menu (⋮)</li>
              <li>Tap <strong>Add to Home Screen</strong> or <strong>Install App</strong></li>
            </ol>
          )}
        </div>
      </div>
    );
  }

  // Main install banner
  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
            <Download className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <div className="text-sm font-bold text-gray-900 dark:text-white">Install Milk Shop</div>
            <div className="text-[11px] text-gray-500">Open like a real app</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setDismissed(true)} className="p-2 text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
          {deferredPrompt ? (
            <button onClick={handleInstall} className="px-4 py-2 text-xs font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all cursor-pointer">
              Install
            </button>
          ) : (
            <button onClick={() => setShowHelp(true)} className="px-4 py-2 text-xs font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-600 transition-all cursor-pointer">
              How to Install →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
