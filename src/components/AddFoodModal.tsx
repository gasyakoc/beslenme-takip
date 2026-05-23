"use client";

import { useState } from "react";
import type { FoodItem, LoggedFood, MealType } from "@/lib/types";
import { MEAL_LABELS, MEAL_TIMES } from "@/lib/types";
import { FOOD_DATABASE, getFoodsByCategory, scaleFood } from "@/lib/mealDatabase";

interface AddFoodModalProps {
  mealType: MealType;
  onAdd: (food: LoggedFood) => void;
  onClose: () => void;
}

export function AddFoodModal({ mealType, onAdd, onClose }: AddFoodModalProps) {
  const [tab, setTab] = useState<"preset" | "custom">("preset");
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [grams, setGrams] = useState("");
  const [customName, setCustomName] = useState("");
  const [customCal, setCustomCal] = useState("");
  const [customProtein, setCustomProtein] = useState("");
  const [customFat, setCustomFat] = useState("");
  const [customCarbs, setCustomCarbs] = useState("");

  const presets = getFoodsByCategory(mealType);

  function handlePresetAdd() {
    if (!selectedFood) return;
    const g = parseFloat(grams) || selectedFood.defaultGrams;
    const scaled = scaleFood(selectedFood, g);
    onAdd({
      id: crypto.randomUUID(),
      foodId: selectedFood.id,
      name: selectedFood.name,
      mealType,
      grams: g,
      calories: scaled.calories,
      protein: scaled.protein,
      fat: scaled.fat,
      carbs: scaled.carbs,
      eaten: true,
    });
    onClose();
  }

  function handleCustomAdd() {
    if (!customName.trim()) return;
    onAdd({
      id: crypto.randomUUID(),
      name: customName.trim(),
      mealType,
      grams: parseFloat(grams) || 100,
      calories: parseFloat(customCal) || 0,
      protein: parseFloat(customProtein) || 0,
      fat: parseFloat(customFat) || 0,
      carbs: parseFloat(customCarbs) || 0,
      eaten: true,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div className="max-h-[85vh] w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3">
          <div>
            <h3 className="font-semibold text-zinc-900">{MEAL_LABELS[mealType]}</h3>
            <p className="text-xs text-zinc-500">{MEAL_TIMES[mealType]}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-zinc-400 hover:bg-zinc-100"
            aria-label="Kapat"
          >
            ✕
          </button>
        </div>

        <div className="flex border-b border-zinc-100">
          {(["preset", "custom"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                tab === t
                  ? "border-b-2 border-emerald-500 text-emerald-700"
                  : "text-zinc-500"
              }`}
            >
              {t === "preset" ? "Hazır Menü" : "Kendi Yemeğim"}
            </button>
          ))}
        </div>

        <div className="max-h-[50vh] overflow-y-auto p-4">
          {tab === "preset" ? (
            <div className="space-y-2">
              {presets.map((food) => (
                <button
                  key={food.id}
                  onClick={() => {
                    setSelectedFood(food);
                    setGrams(String(food.defaultGrams));
                  }}
                  className={`w-full rounded-xl border p-3 text-left transition-all ${
                    selectedFood?.id === food.id
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-zinc-100 hover:border-zinc-200"
                  }`}
                >
                  <p className="font-medium text-zinc-900">{food.name}</p>
                  <p className="mt-0.5 text-xs text-zinc-500">
                    {food.defaultGrams}g · {food.calories} kcal · P:{food.protein}g Y:{food.fat}g K:{food.carbs}g
                  </p>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Yemek adı"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
              />
              <div className="grid grid-cols-2 gap-2">
                <input type="number" placeholder="Kalori" value={customCal} onChange={(e) => setCustomCal(e.target.value)} className="rounded-xl border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500" />
                <input type="number" placeholder="Gram" value={grams} onChange={(e) => setGrams(e.target.value)} className="rounded-xl border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500" />
                <input type="number" placeholder="Protein (g)" value={customProtein} onChange={(e) => setCustomProtein(e.target.value)} className="rounded-xl border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500" />
                <input type="number" placeholder="Yağ (g)" value={customFat} onChange={(e) => setCustomFat(e.target.value)} className="rounded-xl border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500" />
                <input type="number" placeholder="Karbonhidrat (g)" value={customCarbs} onChange={(e) => setCustomCarbs(e.target.value)} className="col-span-2 rounded-xl border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500" />
              </div>
            </div>
          )}
        </div>

        {tab === "preset" && selectedFood && (
          <div className="border-t border-zinc-100 px-4 py-3">
            <label className="mb-1 block text-xs font-medium text-zinc-500">
              Porsiyon (gram)
            </label>
            <input
              type="number"
              value={grams}
              onChange={(e) => setGrams(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
            />
            {selectedFood && (
              <p className="mt-2 text-xs text-zinc-500">
                Tahmini: {scaleFood(selectedFood, parseFloat(grams) || selectedFood.defaultGrams).calories} kcal
              </p>
            )}
          </div>
        )}

        <div className="border-t border-zinc-100 p-4">
          <button
            onClick={tab === "preset" ? handlePresetAdd : handleCustomAdd}
            disabled={tab === "preset" ? !selectedFood : !customName.trim()}
            className="w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-40"
          >
            Ekle
          </button>
        </div>
      </div>
    </div>
  );
}

export { FOOD_DATABASE };
