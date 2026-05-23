import type { LoggedExercise } from "./types";

/** Koşu veya pilates günlerinde ek protein (kas onarımı) */
export const WORKOUT_PROTEIN_BONUS = 12;

export const PROTEIN_WARNING_THRESHOLD = 80;

export function hasWorkoutDay(exercises: LoggedExercise[]): boolean {
  return exercises.some((e) => e.type === "kosu" || e.type === "pilates");
}

export function getDailyProteinTarget(
  baseProtein: number,
  exercises: LoggedExercise[]
): number {
  return hasWorkoutDay(exercises)
    ? baseProtein + WORKOUT_PROTEIN_BONUS
    : baseProtein;
}
