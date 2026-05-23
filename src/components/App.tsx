"use client";

import { useCallback, useEffect, useState } from "react";
import type { AppData, FoodItem, LoggedExercise, LoggedFood, MealType } from "@/lib/types";
import {
  addDays,
  formatDate,
  formatDisplayDate,
  getDayLog,
  loadAppData,
  saveAppData,
  sumEatenMeals,
  sumExerciseCalories,
  updateDayLog,
} from "@/lib/storage";
import { getDailyProteinTarget, hasWorkoutDay } from "@/lib/dailyTargets";
import { useSmartReminders } from "@/hooks/useSmartReminders";
import { CalorieRing, MacroProgress } from "./MacroProgress";
import { MealSection } from "./MealSection";
import { WaterTracker } from "./WaterTracker";
import { ExerciseTracker } from "./ExerciseTracker";
import { WeightTracker } from "./WeightTracker";
import { HistoryView } from "./HistoryView";
import { NotificationBanner } from "./NotificationBanner";

type Tab = "bugun" | "gecmis" | "kilo";

const MEAL_ORDER: MealType[] = ["kahvalti", "ogle", "aksam", "ara1", "ara2"];

export function App() {
  const [data, setData] = useState<AppData | null>(null);
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [tab, setTab] = useState<Tab>("bugun");

  useEffect(() => {
    setData(loadAppData());
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  const persist = useCallback((next: AppData) => {
    setData(next);
    saveAppData(next);
  }, []);

  useSmartReminders(data);

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
          <p className="text-sm text-zinc-500">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  const appData = data;
  const day = getDayLog(appData, selectedDate);
  const totals = sumEatenMeals(day.meals);
  const burned = sumExerciseCalories(day.exercises);
  const { targets, profile } = appData;
  const proteinTarget = getDailyProteinTarget(targets.protein, day.exercises);
  const adjustedCalorieTarget = targets.calories + burned;
  const isToday = selectedDate === formatDate(new Date());
  const proteinOk = totals.protein >= proteinTarget * 0.9;
  const calorieOk = totals.calories <= adjustedCalorieTarget + 50;
  const workoutDay = hasWorkoutDay(day.exercises);

  function updateDay(updater: (d: typeof day) => typeof day) {
    persist(updateDayLog(appData, selectedDate, updater));
  }

  function handleAddFood(food: LoggedFood) {
    updateDay((d) => ({ ...d, meals: [...d.meals, food] }));
  }

  function handleToggleMeal(id: string) {
    updateDay((d) => ({
      ...d,
      meals: d.meals.map((m) => (m.id === id ? { ...m, eaten: !m.eaten } : m)),
    }));
  }

  function handleRemoveMeal(id: string) {
    updateDay((d) => ({ ...d, meals: d.meals.filter((m) => m.id !== id) }));
  }

  function handleWater(ml: number) {
    updateDay((d) => ({ ...d, waterMl: Math.max(0, d.waterMl + ml) }));
  }

  function handleAddExercise(exercise: LoggedExercise) {
    updateDay((d) => ({ ...d, exercises: [...d.exercises, exercise] }));
  }

  function handleUpdateExercise(exercise: LoggedExercise) {
    updateDay((d) => ({
      ...d,
      exercises: d.exercises.map((e) => (e.id === exercise.id ? exercise : e)),
    }));
  }

  function handleRemoveExercise(id: string) {
    updateDay((d) => ({
      ...d,
      exercises: d.exercises.filter((e) => e.id !== id),
    }));
  }

  function handleSaveCustomFood(food: FoodItem) {
    persist({
      ...appData,
      customFoods: [...appData.customFoods, food],
    });
  }

  function handleRemoveCustomFood(id: string) {
    persist({
      ...appData,
      customFoods: appData.customFoods.filter((f) => f.id !== id),
    });
  }

  function handleAddWeight(weight: number) {
    const today = formatDate(new Date());
    const existing = appData.weightLog.findIndex((e) => e.date === today);
    const weightLog =
      existing >= 0
        ? appData.weightLog.map((e, i) => (i === existing ? { date: today, weight } : e))
        : [...appData.weightLog, { date: today, weight }];
    persist({ ...appData, weightLog });
  }

  return (
    <div className="mx-auto min-h-screen max-w-lg bg-zinc-50 pb-24">
      <header className="sticky top-0 z-40 border-b border-zinc-100 bg-white/90 px-4 py-4 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-zinc-900">BurnBite</h1>
            <p className="text-xs text-zinc-500">
              Hedef: {profile.targetWeight} kg · {targets.calories} kcal/gün
            </p>
          </div>
          {proteinOk && calorieOk && totals.calories > 0 && (
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
              ✓ Uygun
            </span>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <button
            onClick={() => setSelectedDate(addDays(selectedDate, -1))}
            className="rounded-lg px-2 py-1 text-zinc-500 hover:bg-zinc-100"
          >
            ←
          </button>
          <button
            onClick={() => {
              setSelectedDate(formatDate(new Date()));
              setTab("bugun");
            }}
            className="text-sm font-medium text-zinc-700"
          >
            {isToday ? "Bugün" : formatDisplayDate(selectedDate)}
          </button>
          <button
            onClick={() => setSelectedDate(addDays(selectedDate, 1))}
            disabled={selectedDate >= formatDate(new Date())}
            className="rounded-lg px-2 py-1 text-zinc-500 hover:bg-zinc-100 disabled:opacity-30"
          >
            →
          </button>
        </div>
      </header>

      <main className="space-y-4 p-4">
        {tab === "bugun" && (
          <>
            <NotificationBanner />

            <section className="rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-4">
                <CalorieRing
                  current={totals.calories}
                  target={targets.calories}
                  burned={burned}
                />
                <div className="flex-1 space-y-3">
                  <div>
                    <MacroProgress label="Protein" current={totals.protein} target={proteinTarget} unit="g" color="#10b981" />
                    {workoutDay && (
                      <p className="mt-0.5 text-[10px] text-emerald-600">
                        🏋️ Antrenman günü +{proteinTarget - targets.protein}g protein hedefi
                      </p>
                    )}
                  </div>
                  <MacroProgress label="Yağ" current={totals.fat} target={targets.fat} unit="g" color="#f59e0b" />
                  <MacroProgress label="Karbonhidrat" current={totals.carbs} target={targets.carbs} unit="g" color="#3b82f6" />
                </div>
              </div>
              {burned > 0 && (
                <div className="mt-3 flex justify-center gap-4 rounded-xl bg-orange-50 py-2 text-xs">
                  <span className="text-zinc-600">
                    Alınan: <strong>{Math.round(totals.calories)}</strong>
                  </span>
                  <span className="text-orange-600">
                    Yakılan: <strong>−{burned}</strong>
                  </span>
                  <span className="text-emerald-600">
                    Net: <strong>{Math.round(totals.calories - burned)}</strong>
                  </span>
                </div>
              )}
            </section>

            {MEAL_ORDER.map((mealType) => (
              <MealSection
                key={mealType}
                mealType={mealType}
                meals={day.meals}
                customFoods={appData.customFoods}
                onToggle={handleToggleMeal}
                onRemove={handleRemoveMeal}
                onAdd={handleAddFood}
                onSaveCustomFood={handleSaveCustomFood}
                onRemoveCustomFood={handleRemoveCustomFood}
              />
            ))}

            <WaterTracker
              currentMl={day.waterMl}
              targetMl={targets.waterMl}
              onAdd={handleWater}
            />

            <ExerciseTracker
              exercises={day.exercises}
              weightKg={profile.currentWeight}
              heightCm={profile.heightCm}
              onAdd={handleAddExercise}
              onUpdate={handleUpdateExercise}
              onRemove={handleRemoveExercise}
            />
          </>
        )}

        {tab === "gecmis" && (
          <HistoryView
            data={appData}
            onSelectDate={(date) => {
              setSelectedDate(date);
              setTab("bugun");
            }}
          />
        )}

        {tab === "kilo" && (
          <WeightTracker
            entries={appData.weightLog}
            targetWeight={profile.targetWeight}
            onAdd={handleAddWeight}
          />
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-100 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg">
          {(
            [
              { id: "bugun" as Tab, label: "Bugün", icon: "📋" },
              { id: "gecmis" as Tab, label: "Geçmiş", icon: "📅" },
              { id: "kilo" as Tab, label: "Kilo", icon: "⚖️" },
            ] as const
          ).map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex flex-1 flex-col items-center gap-0.5 py-3 text-xs font-medium transition-colors ${
                tab === id ? "text-emerald-600" : "text-zinc-400"
              }`}
            >
              <span className="text-lg">{icon}</span>
              {label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
