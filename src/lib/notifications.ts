const PREFS_KEY = "burnbite-notifications";
const SENT_KEY = "burnbite-notifications-sent";

interface NotificationPrefs {
  enabled: boolean;
}

interface SentLog {
  [key: string]: string;
}

export function getNotificationPrefs(): NotificationPrefs {
  if (typeof window === "undefined") return { enabled: false };
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    return raw ? (JSON.parse(raw) as NotificationPrefs) : { enabled: false };
  } catch {
    return { enabled: false };
  }
}

export function setNotificationPrefs(prefs: NotificationPrefs): void {
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}

function getSentLog(): SentLog {
  try {
    const raw = localStorage.getItem(SENT_KEY);
    return raw ? (JSON.parse(raw) as SentLog) : {};
  } catch {
    return {};
  }
}

function markSent(key: string): void {
  const log = getSentLog();
  log[key] = new Date().toISOString();
  localStorage.setItem(SENT_KEY, JSON.stringify(log));
}

function wasSentToday(key: string): boolean {
  const log = getSentLog();
  const ts = log[key];
  if (!ts) return false;
  return ts.slice(0, 10) === new Date().toISOString().slice(0, 10);
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return false;
  }
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const result = await Notification.requestPermission();
  return result === "granted";
}

export async function enableNotifications(): Promise<boolean> {
  const granted = await requestNotificationPermission();
  if (granted) {
    setNotificationPrefs({ enabled: true });
    if ("serviceWorker" in navigator) {
      try {
        await navigator.serviceWorker.register("/sw.js");
      } catch {
        /* SW optional */
      }
    }
  }
  return granted;
}

export function sendNotification(title: string, body: string, tag: string): void {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  if (!getNotificationPrefs().enabled) return;

  try {
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.showNotification(title, { body, tag, icon: "/icon-192.png" });
      });
    } else {
      new Notification(title, { body, tag, icon: "/icon-192.png" });
    }
  } catch {
    /* ignore */
  }
}

export function notifyWaterRemaining(remainingMl: number): void {
  const key = `water-${new Date().getHours()}`;
  if (wasSentToday(key)) return;
  const liters = (remainingMl / 1000).toFixed(1);
  sendNotification(
    "BurnBite — Su hatırlatması 💧",
    `Hedefe ${liters}L kaldı. Bir bardak su içmeyi unutma!`,
    key
  );
  markSent(key);
}

export function notifyProteinLow(current: number, target: number): void {
  const key = "protein-evening";
  if (wasSentToday(key)) return;
  sendNotification(
    "BurnBite — Protein düşük 🥩",
    `Bugün ${Math.round(current)}g protein aldın (hedef ≥${target}g). Akşam öğününe protein ekle!`,
    key
  );
  markSent(key);
}

export function areNotificationsEnabled(): boolean {
  return (
    getNotificationPrefs().enabled &&
    typeof window !== "undefined" &&
    "Notification" in window &&
    Notification.permission === "granted"
  );
}
