import { USER_PROFILE, USER_TARGETS } from "./profile";
import type { AppData, DayLog, LoggedFood } from "./types";

const STORAGE_KEY = "beslenme-takip-v1";

function emptyDay(): DayLog {
  return { meals: [], waterMl: 0, exercises: [] };
}

export function getDefaultAppData(): AppData {
  return {
    profile: USER_PROFILE,
    targets: USER_TARGETS,
    days: {},
    weightLog: [{ date: new Date().toISOString().slice(0, 10), weight: USER_PROFILE.currentWeight }],
  };
}

export function loadAppData(): AppData {
  if (typeof window === "undefined") return getDefaultAppData();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultAppData();
    const parsed = JSON.parse(raw) as AppData;
    return {
      ...getDefaultAppData(),
      ...parsed,
      profile: USER_PROFILE,
      targets: USER_TARGETS,
    };
  } catch {
    return getDefaultAppData();
  }
}

export function saveAppData(data: AppData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getDayLog(data: AppData, date: string): DayLog {
  return data.days[date] ?? emptyDay();
}

export function updateDayLog(
  data: AppData,
  date: string,
  updater: (day: DayLog) => DayLog
): AppData {
  const current = getDayLog(data, date);
  return {
    ...data,
    days: { ...data.days, [date]: updater(current) },
  };
}

export function sumEatenMeals(meals: LoggedFood[]) {
  return meals
    .filter((m) => m.eaten)
    .reduce(
      (acc, m) => ({
        calories: acc.calories + m.calories,
        protein: acc.protein + m.protein,
        fat: acc.fat + m.fat,
        carbs: acc.carbs + m.carbs,
      }),
      { calories: 0, protein: 0, fat: 0, carbs: 0 }
    );
}

export function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function formatDisplayDate(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString("tr-TR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function addDays(dateStr: string, days: number): string {
  const date = new Date(dateStr + "T12:00:00");
  date.setDate(date.getDate() + days);
  return formatDate(date);
}
