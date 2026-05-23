"use client";

import type { ExerciseType, LoggedExercise } from "@/lib/types";
import { EXERCISE_LABELS } from "@/lib/types";
import {
  createExercise,
  getCaloriesPerStep,
  sumExerciseCalories,
  updateExerciseMinutes,
  updateExerciseSteps,
} from "@/lib/exercises";

const EXERCISE_ICONS: Record<ExerciseType, string> = {
  yuruyus: "🚶",
  kosu: "🏃",
  pilates: "🧘",
};

interface ExerciseTrackerProps {
  exercises: LoggedExercise[];
  weightKg: number;
  heightCm: number;
  onAdd: (exercise: LoggedExercise) => void;
  onUpdate: (exercise: LoggedExercise) => void;
  onRemove: (id: string) => void;
}

export function ExerciseTracker({
  exercises,
  weightKg,
  heightCm,
  onAdd,
  onUpdate,
  onRemove,
}: ExerciseTrackerProps) {
  const totalBurned = sumExerciseCalories(exercises);
  const activeTypes = new Set(exercises.map((e) => e.type));
  const calPerStep = getCaloriesPerStep(weightKg, heightCm);

  function handleAdd(type: ExerciseType) {
    if (activeTypes.has(type)) return;
    onAdd(createExercise(type, weightKg, heightCm));
  }

  return (
    <section className="rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold text-zinc-900">🏋️ Egzersiz</h3>
        {totalBurned > 0 && (
          <span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-semibold text-orange-700">
            −{totalBurned} kcal yakıldı
          </span>
        )}
      </div>

      <div className="mb-3 grid grid-cols-3 gap-2">
        {(Object.keys(EXERCISE_LABELS) as ExerciseType[]).map((type) => {
          const isActive = activeTypes.has(type);
          return (
            <button
              key={type}
              onClick={() => handleAdd(type)}
              disabled={isActive}
              className={`flex flex-col items-center gap-1 rounded-xl border-2 py-3 transition-all ${
                isActive
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700 opacity-60"
                  : "border-zinc-100 bg-zinc-50 text-zinc-500 hover:border-emerald-200 hover:bg-emerald-50/50"
              }`}
            >
              <span className="text-xl">{EXERCISE_ICONS[type]}</span>
              <span className="text-xs font-medium">{EXERCISE_LABELS[type]}</span>
              {!isActive && (
                <span className="text-[10px] text-zinc-400">+ Ekle</span>
              )}
            </button>
          );
        })}
      </div>

      {exercises.length > 0 && (
        <ul className="space-y-2">
          {exercises.map((exercise) => (
            <li
              key={exercise.id}
              className="rounded-xl border border-orange-100 bg-orange-50/50 p-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>{EXERCISE_ICONS[exercise.type]}</span>
                  <div>
                    <p className="text-sm font-medium text-zinc-900">
                      {EXERCISE_LABELS[exercise.type]}
                    </p>
                    <p className="text-xs font-semibold text-orange-600">
                      −{exercise.caloriesBurned} kcal
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onRemove(exercise.id)}
                  className="rounded-lg p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-500"
                  aria-label="Sil"
                >
                  ✕
                </button>
              </div>

              {exercise.type === "yuruyus" ? (
                <div className="mt-2">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs text-zinc-500">Adım</span>
                    <span className="text-[10px] text-zinc-400">
                      ~{calPerStep.toFixed(3)} kcal/adım
                    </span>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() =>
                        onUpdate(
                          updateExerciseSteps(
                            exercise,
                            (exercise.steps ?? 0) - 500,
                            weightKg,
                            heightCm
                          )
                        )
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white text-sm font-medium hover:bg-zinc-50"
                    >
                      −
                    </button>
                    <span className="w-16 text-center text-sm font-semibold tabular-nums">
                      {(exercise.steps ?? 0).toLocaleString("tr-TR")}
                    </span>
                    <button
                      onClick={() =>
                        onUpdate(
                          updateExerciseSteps(
                            exercise,
                            (exercise.steps ?? 0) + 500,
                            weightKg,
                            heightCm
                          )
                        )
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white text-sm font-medium hover:bg-zinc-50"
                    >
                      +
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-zinc-500">Süre (dk)</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        onUpdate(
                          updateExerciseMinutes(
                            exercise,
                            (exercise.minutes ?? 0) - 5,
                            weightKg,
                            heightCm
                          )
                        )
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white text-sm font-medium hover:bg-zinc-50"
                    >
                      −
                    </button>
                    <span className="w-10 text-center text-sm font-semibold tabular-nums">
                      {exercise.minutes}
                    </span>
                    <button
                      onClick={() =>
                        onUpdate(
                          updateExerciseMinutes(
                            exercise,
                            (exercise.minutes ?? 0) + 5,
                            weightKg,
                            heightCm
                          )
                        )
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white text-sm font-medium hover:bg-zinc-50"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
