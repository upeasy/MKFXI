"use client";

import { useState, useEffect } from "react";
import { WifiOff, Wifi } from "lucide-react";

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineMessage(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineMessage(true);
    };

    // Set initial state
    setIsOnline(navigator.onLine);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showOfflineMessage) {
    return null;
  }

  return (
    <div className="fixed top-20 left-4 right-4 md:left-auto md:right-4 md:max-w-sm bg-amber-50 border border-amber-200 rounded-lg p-3 z-50 animate-in slide-in-from-top-2">
      <div className="flex items-center gap-2">
        <WifiOff className="w-5 h-5 text-amber-600" />
        <div>
          <p className="text-sm font-medium text-amber-800">You're offline</p>
          <p className="text-xs text-amber-700">
            The app will continue to work with cached content
          </p>
        </div>
      </div>
    </div>
  );
}