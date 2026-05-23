"use client";

import { useState } from "react";
import type { FoodItem, LoggedFood, MealType } from "@/lib/types";
import { MEAL_LABELS, MEAL_TIMES } from "@/lib/types";
import { getFoodsByCategory, scaleFood } from "@/lib/mealDatabase";

interface AddFoodModalProps {
  mealType: MealType;
  customFoods: FoodItem[];
  onAdd: (food: LoggedFood) => void;
  onSaveCustomFood: (food: FoodItem) => void;
  onRemoveCustomFood: (id: string) => void;
  onClose: () => void;
}

export function AddFoodModal({
  mealType,
  customFoods,
  onAdd,
  onSaveCustomFood,
  onRemoveCustomFood,
  onClose,
}: AddFoodModalProps) {
  const [tab, setTab] = useState<"preset" | "custom">("preset");
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [grams, setGrams] = useState("");
  const [customName, setCustomName] = useState("");
  const [customCal, setCustomCal] = useState("");
  const [customProtein, setCustomProtein] = useState("");
  const [customFat, setCustomFat] = useState("");
  const [customCarbs, setCustomCarbs] = useState("");

  const presets = getFoodsByCategory(mealType, customFoods);
  const myPresets = presets.filter((f) => f.id.startsWith("custom-"));

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

  function getCustomValues() {
    return {
      name: customName.trim(),
      grams: parseFloat(grams) || 100,
      calories: parseFloat(customCal) || 0,
      protein: parseFloat(customProtein) || 0,
      fat: parseFloat(customFat) || 0,
      carbs: parseFloat(customCarbs) || 0,
    };
  }

  function handleCustomAdd(saveToPreset: boolean) {
    if (!customName.trim()) return;
    const { name, grams: g, calories, protein, fat, carbs } = getCustomValues();

    onAdd({
      id: crypto.randomUUID(),
      name,
      mealType,
      grams: g,
      calories,
      protein,
      fat,
      carbs,
      eaten: true,
    });

    if (saveToPreset) {
      onSaveCustomFood({
        id: `custom-${crypto.randomUUID()}`,
        name,
        category: mealType,
        defaultGrams: g,
        unit: "g",
        calories,
        protein,
        fat,
        carbs,
      });
    }

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
              {myPresets.length > 0 && (
                <p className="text-xs font-medium text-emerald-600">Kaydettiğin yemekler</p>
              )}
              {presets.map((food) => {
                const isMine = food.id.startsWith("custom-");
                return (
                  <div key={food.id} className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedFood(food);
                        setGrams(String(food.defaultGrams));
                      }}
                      className={`min-w-0 flex-1 rounded-xl border p-3 text-left transition-all ${
                        selectedFood?.id === food.id
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-zinc-100 hover:border-zinc-200"
                      }`}
                    >
                      <p className="font-medium text-zinc-900">
                        {food.name}
                        {isMine && (
                          <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                            Senin
                          </span>
                        )}
                      </p>
                      <p className="mt-0.5 text-xs text-zinc-500">
                        {food.defaultGrams}g · {food.calories} kcal · P:{food.protein}g Y:{food.fat}g K:{food.carbs}g
                      </p>
                    </button>
                    {isMine && (
                      <button
                        onClick={() => onRemoveCustomFood(food.id)}
                        className="shrink-0 rounded-xl border border-zinc-200 px-3 text-zinc-400 hover:border-red-200 hover:text-red-500"
                        aria-label="Hazır menüden sil"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                );
              })}
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
          {tab === "preset" ? (
            <button
              onClick={handlePresetAdd}
              disabled={!selectedFood}
              className="w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-40"
            >
              Bugüne Ekle
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleCustomAdd(false)}
                disabled={!customName.trim()}
                className="w-full rounded-xl border-2 border-emerald-600 py-3 font-semibold text-emerald-700 transition-colors hover:bg-emerald-50 disabled:opacity-40"
              >
                Bugüne Ekle
              </button>
              <button
                onClick={() => handleCustomAdd(true)}
                disabled={!customName.trim()}
                className="w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-40"
              >
                Hazır Menüye de Ekle
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
