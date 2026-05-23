"use client";

import type { AppData } from "@/lib/types";
import { computeWeeklyStats } from "@/lib/weeklyStats";

interface WeeklySummaryProps {
  data: AppData;
}

export function WeeklySummary({ data }: WeeklySummaryProps) {
  const stats = computeWeeklyStats(data);
  const maxCal = Math.max(...stats.days.map((d) => d.calories), data.targets.calories, 1);

  const dayLabels = stats.days.map((d) => {
    const date = new Date(d.date + "T12:00:00");
    return date.toLocaleDateString("tr-TR", { weekday: "short" });
  });

  return (
    <section className="rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm">
      <h3 className="mb-3 font-semibold text-zinc-900">📊 Haftalık Özet</h3>

      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <div className="rounded-xl bg-zinc-50 p-3 text-center">
          <p className="text-lg font-bold text-zinc-900">{stats.avgCalories}</p>
          <p className="text-[10px] text-zinc-500">Ort. kalori/gün</p>
        </div>
        <div className="rounded-xl bg-emerald-50 p-3 text-center">
          <p className="text-lg font-bold text-emerald-700">{stats.avgProtein}g</p>
          <p className="text-[10px] text-zinc-500">Ort. protein/gün</p>
        </div>
        <div className="rounded-xl bg-blue-50 p-3 text-center">
          <p className="text-lg font-bold text-blue-700">
            {stats.daysOnTarget}/{stats.daysWithData || 7}
          </p>
          <p className="text-[10px] text-zinc-500">Hedefe uygun gün</p>
        </div>
        <div className="rounded-xl bg-amber-50 p-3 text-center">
          <p className="text-lg font-bold text-amber-700">
            {stats.weightChange != null
              ? `${stats.weightChange > 0 ? "+" : ""}${stats.weightChange.toFixed(1)}`
              : "—"}
          </p>
          <p className="text-[10px] text-zinc-500">Kilo değişimi (hafta)</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="mb-2 text-xs font-medium text-zinc-500">Günlük kalori</p>
        <div className="flex h-24 items-end gap-1">
          {stats.days.map((d, i) => {
            const h = d.hasData ? (d.calories / maxCal) * 100 : 4;
            return (
              <div key={d.date} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className={`w-full rounded-t-md transition-all ${
                    d.onTarget ? "bg-emerald-400" : d.hasData ? "bg-amber-400" : "bg-zinc-100"
                  }`}
                  style={{ height: `${Math.max(h, 4)}%` }}
                  title={`${d.calories} kcal`}
                />
                <span className="text-[9px] text-zinc-400">{dayLabels[i]}</span>
              </div>
            );
          })}
        </div>
        <div className="mt-1 flex justify-between text-[10px] text-zinc-400">
          <span>Hedef: ~{data.targets.calories} kcal</span>
          <span className="flex gap-2">
            <span className="text-emerald-600">● Uygun</span>
            <span className="text-amber-500">● Dikkat</span>
          </span>
        </div>
      </div>

      {stats.weightTrend.length > 1 && (
        <div>
          <p className="mb-2 text-xs font-medium text-zinc-500">Kilo trendi</p>
          <div className="flex h-16 items-end gap-1">
            {(() => {
              const weights = stats.weightTrend;
              const minW = Math.min(...weights.map((w) => w.weight)) - 0.5;
              const maxW = Math.max(...weights.map((w) => w.weight)) + 0.5;
              const range = maxW - minW || 1;
              return weights.map((entry) => {
                const h = ((entry.weight - minW) / range) * 100;
                return (
                  <div key={entry.date} className="flex flex-1 flex-col items-center gap-0.5">
                    <div
                      className="w-full rounded-t-md bg-violet-400"
                      style={{ height: `${Math.max(h, 8)}%` }}
                    />
                    <span className="text-[8px] text-zinc-400">
                      {entry.date.slice(8)}
                    </span>
                  </div>
                );
              });
            })()}
          </div>
          {stats.weightEnd != null && (
            <p className="mt-1 text-center text-xs text-zinc-500">
              Güncel: <strong>{stats.weightEnd} kg</strong>
              {data.profile.targetWeight && (
                <span> · Hedef: {data.profile.targetWeight} kg</span>
              )}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
