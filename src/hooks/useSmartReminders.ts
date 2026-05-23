"use client";

import { useEffect } from "react";
import { getDailyProteinTarget, PROTEIN_WARNING_THRESHOLD } from "@/lib/dailyTargets";
import {
  areNotificationsEnabled,
  notifyProteinLow,
  notifyWaterRemaining,
} from "@/lib/notifications";
import type { AppData } from "@/lib/types";
import { formatDate, getDayLog, sumEatenMeals } from "@/lib/storage";

/** Su kontrol saatleri; hedefin altındaysa bildirim */
const WATER_CHECK_HOURS = [14, 17, 20];
const PROTEIN_CHECK_HOUR = 20;

export function useSmartReminders(data: AppData | null) {
  useEffect(() => {
    if (!data || !areNotificationsEnabled()) return;

    function check() {
      const now = new Date();
      const hour = now.getHours();
      const today = formatDate(now);
      const day = getDayLog(data!, today);
      const totals = sumEatenMeals(day.meals);
      const proteinTarget = getDailyProteinTarget(
        data!.targets.protein,
        day.exercises
      );
      const waterTarget = data!.targets.waterMl;
      const waterRemaining = Math.max(0, waterTarget - day.waterMl);

      if (WATER_CHECK_HOURS.includes(hour) && waterRemaining > 300) {
        const expectedPct = hour === 14 ? 0.4 : hour === 17 ? 0.65 : 0.85;
        if (day.waterMl < waterTarget * expectedPct) {
          notifyWaterRemaining(waterRemaining);
        }
      }

      if (hour >= PROTEIN_CHECK_HOUR && totals.protein < PROTEIN_WARNING_THRESHOLD) {
        notifyProteinLow(totals.protein, proteinTarget);
      }
    }

    check();
    const id = setInterval(check, 60_000);
    return () => clearInterval(id);
  }, [data]);
}
