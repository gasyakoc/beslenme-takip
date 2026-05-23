"use client";

import type { AppData } from "@/lib/types";
import { formatDisplayDate, sumEatenMeals } from "@/lib/storage";

interface HistoryViewProps {
  data: AppData;
  onSelectDate: (date: string) => void;
}

export function HistoryView({ data, onSelectDate }: HistoryViewProps) {
  const dates = Object.keys(data.days).sort((a, b) => b.localeCompare(a));

  if (dates.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-100 bg-white p-8 text-center shadow-sm">
        <p className="text-zinc-400">Henüz geçmiş kayıt yok</p>
        <p className="mt-1 text-xs text-zinc-400">Yemek ekledikçe burada görünecek</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {dates.map((date) => {
        const day = data.days[date];
        const totals = sumEatenMeals(day.meals);
        const target = data.targets.calories;
        const pct = Math.round((totals.calories / target) * 100);
        const onTarget =
          totals.calories <= target + 50 &&
          totals.protein >= data.targets.protein * 0.85;

        return (
          <button
            key={date}
            onClick={() => onSelectDate(date)}
            className="w-full rounded-2xl border border-zinc-100 bg-white p-4 text-left shadow-sm transition-colors hover:border-emerald-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-zinc-900">{formatDisplayDate(date)}</p>
                <p className="text-xs text-zinc-400">
                  {day.meals.filter((m) => m.eaten).length} yemek · {day.exercises.length} egzersiz · {(day.waterMl / 1000).toFixed(1)}L su
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-zinc-900">{Math.round(totals.calories)} kcal</p>
                <p className={`text-xs font-medium ${onTarget ? "text-emerald-600" : "text-amber-600"}`}>
                  {onTarget ? "✓ Hedefe uygun" : `%${pct} kalori`}
                </p>
              </div>
            </div>
            <div className="mt-2 flex gap-2 text-xs text-zinc-500">
              <span>P: {Math.round(totals.protein)}g</span>
              <span>Y: {Math.round(totals.fat)}g</span>
              <span>K: {Math.round(totals.carbs)}g</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
