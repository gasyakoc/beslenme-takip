"use client";

import { useState } from "react";
import type { LoggedFood, MealType } from "@/lib/types";
import { MEAL_LABELS, MEAL_TIMES } from "@/lib/types";
import { AddFoodModal } from "./AddFoodModal";

interface MealSectionProps {
  mealType: MealType;
  meals: LoggedFood[];
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onAdd: (food: LoggedFood) => void;
}

export function MealSection({
  mealType,
  meals,
  onToggle,
  onRemove,
  onAdd,
}: MealSectionProps) {
  const [showAdd, setShowAdd] = useState(false);
  const mealItems = meals.filter((m) => m.mealType === mealType);
  const eaten = mealItems.filter((m) => m.eaten);
  const totalCal = eaten.reduce((s, m) => s + m.calories, 0);

  return (
    <section className="rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-zinc-900">{MEAL_LABELS[mealType]}</h3>
          <p className="text-xs text-zinc-400">{MEAL_TIMES[mealType]}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-emerald-600">{totalCal} kcal</p>
          <button
            onClick={() => setShowAdd(true)}
            className="text-xs font-medium text-emerald-600 hover:text-emerald-700"
          >
            + Ekle
          </button>
        </div>
      </div>

      {mealItems.length === 0 ? (
        <p className="py-2 text-center text-sm text-zinc-400">Henüz yemek eklenmedi</p>
      ) : (
        <ul className="space-y-2">
          {mealItems.map((item) => (
            <li
              key={item.id}
              className={`flex items-center gap-3 rounded-xl border p-3 transition-all ${
                item.eaten
                  ? "border-emerald-100 bg-emerald-50/50"
                  : "border-zinc-100 bg-zinc-50/50 opacity-60"
              }`}
            >
              <button
                onClick={() => onToggle(item.id)}
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                  item.eaten
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : "border-zinc-300 bg-white"
                }`}
                aria-label={item.eaten ? "Yemedim olarak işaretle" : "Yedim olarak işaretle"}
              >
                {item.eaten && "✓"}
              </button>
              <div className="min-w-0 flex-1">
                <p className={`truncate text-sm font-medium ${item.eaten ? "text-zinc-900" : "text-zinc-500 line-through"}`}>
                  {item.name}
                </p>
                <p className="text-xs text-zinc-400">
                  {item.grams}g · {item.calories} kcal · P:{item.protein} Y:{item.fat} K:{item.carbs}
                </p>
              </div>
              <button
                onClick={() => onRemove(item.id)}
                className="shrink-0 rounded-lg p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-500"
                aria-label="Sil"
              >
                🗑
              </button>
            </li>
          ))}
        </ul>
      )}

      {showAdd && (
        <AddFoodModal
          mealType={mealType}
          onAdd={onAdd}
          onClose={() => setShowAdd(false)}
        />
      )}
    </section>
  );
}
