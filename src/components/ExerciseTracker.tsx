"use client";

import type { ExerciseType } from "@/lib/types";
import { EXERCISE_LABELS } from "@/lib/types";

const EXERCISE_ICONS: Record<ExerciseType, string> = {
  yuruyus: "🚶",
  kosu: "🏃",
  pilates: "🧘",
};

interface ExerciseTrackerProps {
  active: ExerciseType[];
  onToggle: (type: ExerciseType) => void;
}

export function ExerciseTracker({ active, onToggle }: ExerciseTrackerProps) {
  return (
    <section className="rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm">
      <h3 className="mb-3 font-semibold text-zinc-900">🏋️ Egzersiz</h3>
      <div className="grid grid-cols-3 gap-2">
        {(Object.keys(EXERCISE_LABELS) as ExerciseType[]).map((type) => {
          const isActive = active.includes(type);
          return (
            <button
              key={type}
              onClick={() => onToggle(type)}
              className={`flex flex-col items-center gap-1 rounded-xl border-2 py-3 transition-all ${
                isActive
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                  : "border-zinc-100 bg-zinc-50 text-zinc-500 hover:border-zinc-200"
              }`}
            >
              <span className="text-xl">{EXERCISE_ICONS[type]}</span>
              <span className="text-xs font-medium">{EXERCISE_LABELS[type]}</span>
              {isActive && <span className="text-xs text-emerald-600">✓ Yaptım</span>}
            </button>
          );
        })}
      </div>
    </section>
  );
}
