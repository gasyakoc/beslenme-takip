"use client";

import { useState } from "react";
import type { WeightEntry } from "@/lib/types";

interface WeightTrackerProps {
  entries: WeightEntry[];
  targetWeight: number;
  onAdd: (weight: number) => void;
}

export function WeightTracker({ entries, targetWeight, onAdd }: WeightTrackerProps) {
  const [weight, setWeight] = useState("");
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  const latest = sorted[sorted.length - 1];
  const first = sorted[0];
  const lost = first && latest ? first.weight - latest.weight : 0;
  const remaining = latest ? latest.weight - targetWeight : 0;

  const maxW = Math.max(...sorted.map((e) => e.weight), targetWeight + 2);
  const minW = Math.min(...sorted.map((e) => e.weight), targetWeight - 2);
  const range = maxW - minW || 1;

  return (
    <section className="rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm">
      <h3 className="mb-1 font-semibold text-zinc-900">⚖️ Kilo Takibi</h3>
      <p className="mb-4 text-xs text-zinc-500">Haftalık tartımını kaydet</p>

      <div className="mb-4 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-zinc-50 p-3">
          <p className="text-lg font-bold text-zinc-900">{latest?.weight ?? "—"}</p>
          <p className="text-xs text-zinc-500">Güncel (kg)</p>
        </div>
        <div className="rounded-xl bg-emerald-50 p-3">
          <p className="text-lg font-bold text-emerald-700">{lost > 0 ? `−${lost.toFixed(1)}` : "0"}</p>
          <p className="text-xs text-zinc-500">Verilen (kg)</p>
        </div>
        <div className="rounded-xl bg-amber-50 p-3">
          <p className="text-lg font-bold text-amber-700">{remaining > 0 ? remaining.toFixed(1) : "🎯"}</p>
          <p className="text-xs text-zinc-500">Hedefe kalan</p>
        </div>
      </div>

      {sorted.length > 1 && (
        <div className="mb-4 flex h-24 items-end gap-1">
          {sorted.slice(-8).map((entry) => {
            const h = ((entry.weight - minW) / range) * 100;
            return (
              <div key={entry.date} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-md bg-emerald-400 transition-all"
                  style={{ height: `${Math.max(h, 8)}%` }}
                />
                <span className="text-[9px] text-zinc-400">
                  {entry.date.slice(5).replace("-", "/")}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="number"
          step="0.1"
          placeholder="Kilo (kg)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="flex-1 rounded-xl border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
        />
        <button
          onClick={() => {
            const w = parseFloat(weight);
            if (w > 0) {
              onAdd(w);
              setWeight("");
            }
          }}
          className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Kaydet
        </button>
      </div>

      <ul className="mt-3 max-h-32 space-y-1 overflow-y-auto">
        {[...sorted].reverse().map((entry) => (
          <li key={entry.date} className="flex justify-between text-xs text-zinc-500">
            <span>{new Date(entry.date + "T12:00:00").toLocaleDateString("tr-TR")}</span>
            <span className="font-medium text-zinc-700">{entry.weight} kg</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
