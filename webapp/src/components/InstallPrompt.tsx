import React, { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [showIOSHelp, setShowIOSHelp] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iOS);

    // Already installed? hide banner
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
      setIsInstallable(true);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // For iOS or if beforeinstallprompt never fires, still show after 3s
    const timeout = setTimeout(() => {
      if (!dismissed && !deferredPrompt) {
        setIsInstallable(true);
      }
    }, 3000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      clearTimeout(timeout);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDismissed(true);
    }
    setDeferredPrompt(null);
  };

  if (dismissed || !isInstallable) return null;

  // iOS: show instructions after tapping banner
  if (isIOS) {
    if (showIOSHelp) {
      return (
        <div className="fixed bottom-4 left-4 right-4 z-[60] max-w-md mx-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-5">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Install Milk Shop</h3>
              <button onClick={() => { setShowIOSHelp(false); setDismissed(true); }} className="text-slate-400 hover:text-slate-600 cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <ol className="text-xs text-gray-600 dark:text-slate-400 space-y-2 list-decimal list-inside">
              <li>Tap the <strong>Share</strong> button <span className="text-lg">⎙</span> in Safari</li>
              <li>Scroll down and tap <strong>Add to Home Screen</strong></li>
              <li>Tap <strong>Add</strong> in the top right</li>
            </ol>
          </div>
        </div>
      );
    }

    return (
      <button
        onClick={() => setShowIOSHelp(true)}
        className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
            <Download className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <div className="text-sm font-bold text-gray-900 dark:text-white">Install App</div>
            <div className="text-[11px] text-gray-500">Add to Home Screen for best experience</div>
          </div>
        </div>
        <div className="text-blue-500 text-xs font-bold">Show how →</div>
      </button>
    );
  }

  // Android / Desktop install banner
  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
            <Download className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <div className="text-sm font-bold text-gray-900 dark:text-white">Install Milk Shop</div>
            <div className="text-[11px] text-gray-500">Install app for quick access</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDismissed(true)}
            className="p-2 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          <button
            onClick={handleInstall}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              deferredPrompt
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
            }`}
          >
            {deferredPrompt ? "Install" : "Not Available"}
          </button>
        </div>
      </div>
    </div>
  );
};
