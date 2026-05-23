"use client";

import { useEffect, useState } from "react";
import {
  areNotificationsEnabled,
  enableNotifications,
  getNotificationPrefs,
} from "@/lib/notifications";

export function NotificationBanner() {
  const [visible, setVisible] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const prefs = getNotificationPrefs();
    setEnabled(areNotificationsEnabled());
    setVisible(!prefs.enabled && typeof window !== "undefined" && "Notification" in window);
  }, []);

  if (!visible && !enabled) return null;

  async function handleEnable() {
    const ok = await enableNotifications();
    if (ok) {
      setEnabled(true);
      setVisible(false);
    }
  }

  if (enabled) {
    return (
      <p className="rounded-xl bg-blue-50 px-3 py-2 text-center text-[11px] text-blue-700">
        🔔 Bildirimler açık — su ve protein hatırlatmaları aktif
      </p>
    );
  }

  return (
    <div className="rounded-xl border border-blue-100 bg-blue-50/80 p-3">
      <p className="text-xs text-zinc-700">
        Su ve akşam protein hatırlatmaları için bildirimleri aç
      </p>
      <button
        onClick={handleEnable}
        className="mt-2 w-full rounded-lg bg-blue-600 py-2 text-xs font-semibold text-white hover:bg-blue-700"
      >
        Bildirimleri Aç
      </button>
    </div>
  );
}
