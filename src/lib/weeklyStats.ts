import { getDailyProteinTarget } from "./dailyTargets";
import type { AppData } from "./types";
import { addDays, formatDate, getDayLog, sumEatenMeals, sumExerciseCalories } from "./storage";

export interface DayStat {
  date: string;
  calories: number;
  protein: number;
  targetCalories: number;
  targetProtein: number;
  onTarget: boolean;
  hasData: boolean;
}

export interface WeeklyStats {
  days: DayStat[];
  avgCalories: number;
  avgProtein: number;
  daysOnTarget: number;
  daysWithData: number;
  weightStart: number | null;
  weightEnd: number | null;
  weightChange: number | null;
  weightTrend: { date: string; weight: number }[];
}

function isDayOnTarget(
  data: AppData,
  date: string,
  totals: ReturnType<typeof sumEatenMeals>,
  burned: number,
  targetProtein: number
): boolean {
  const targetCal = data.targets.calories + burned;
  return (
    totals.calories > 0 &&
    totals.calories <= targetCal + 50 &&
    totals.protein >= targetProtein * 0.85
  );
}

export function computeWeeklyStats(
  data: AppData,
  endDate: string = formatDate(new Date())
): WeeklyStats {
  const days: DayStat[] = [];

  for (let i = 6; i >= 0; i--) {
    const date = addDays(endDate, -i);
    const day = getDayLog(data, date);
    const totals = sumEatenMeals(day.meals);
    const burned = sumExerciseCalories(day.exercises);
    const targetProtein = getDailyProteinTarget(
      data.targets.protein,
      day.exercises
    );
    const hasData = day.meals.some((m) => m.eaten);

    days.push({
      date,
      calories: Math.round(totals.calories),
      protein: Math.round(totals.protein),
      targetCalories: data.targets.calories + burned,
      targetProtein,
      onTarget: isDayOnTarget(data, date, totals, burned, targetProtein),
      hasData,
    });
  }

  const withData = days.filter((d) => d.hasData);
  const avgCalories =
    withData.length > 0
      ? Math.round(withData.reduce((s, d) => s + d.calories, 0) / withData.length)
      : 0;
  const avgProtein =
    withData.length > 0
      ? Math.round(withData.reduce((s, d) => s + d.protein, 0) / withData.length)
      : 0;
  const daysOnTarget = days.filter((d) => d.onTarget).length;

  const weekStart = days[0]?.date;
  const weekEnd = days[6]?.date;
  const weightsInWeek = data.weightLog
    .filter((w) => w.date >= weekStart && w.date <= weekEnd)
    .sort((a, b) => a.date.localeCompare(b.date));

  const recentWeights = [...data.weightLog]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-8);

  const weightStart = weightsInWeek[0]?.weight ?? recentWeights[0]?.weight ?? null;
  const weightEnd =
    weightsInWeek[weightsInWeek.length - 1]?.weight ??
    recentWeights[recentWeights.length - 1]?.weight ??
    null;

  return {
    days,
    avgCalories,
    avgProtein,
    daysOnTarget,
    daysWithData: withData.length,
    weightStart,
    weightEnd,
    weightChange:
      weightStart != null && weightEnd != null ? weightEnd - weightStart : null,
    weightTrend: recentWeights,
  };
}
