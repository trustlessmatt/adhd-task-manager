"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function PWAProvider({ children }: { children: React.ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("SW registered: ", registration);
        })
        .catch((registrationError) => {
          console.log("SW registration failed: ", registrationError);
        });
    }

    // Handle install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Handle app installed
    window.addEventListener("appinstalled", () => {
      console.log("PWA was installed");
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("User accepted the install prompt");
    } else {
      console.log("User dismissed the install prompt");
    }

    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  return (
    <>
      {children}
      {showInstallPrompt && (
        <div className="fixed bottom-4 left-4 right-4 z-50 bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-semibold">Install App</h3>
              <p className="text-gray-300 text-sm">
                Install this app for a better experience
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowInstallPrompt(false)}
                className="px-3 py-1 text-gray-400 hover:text-white text-sm"
              >
                Dismiss
              </button>
              <button
                onClick={handleInstallClick}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
              >
                Install
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
