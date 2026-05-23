import type { ExerciseType, LoggedExercise } from "./types";

export const EXERCISE_MET: Record<ExerciseType, number> = {
  yuruyus: 4.0,
  kosu: 8.5,
  pilates: 3.0,
};

export const DEFAULT_MINUTES: Record<ExerciseType, number> = {
  yuruyus: 30,
  kosu: 25,
  pilates: 45,
};

export function calculateExerciseCalories(
  type: ExerciseType,
  minutes: number,
  weightKg: number
): number {
  const met = EXERCISE_MET[type];
  return Math.round(met * weightKg * (minutes / 60));
}

export function createExercise(
  type: ExerciseType,
  minutes: number,
  weightKg: number
): LoggedExercise {
  return {
    id: crypto.randomUUID(),
    type,
    minutes,
    caloriesBurned: calculateExerciseCalories(type, minutes, weightKg),
  };
}

export function updateExerciseMinutes(
  exercise: LoggedExercise,
  minutes: number,
  weightKg: number
): LoggedExercise {
  const safeMinutes = Math.max(5, Math.min(180, minutes));
  return {
    ...exercise,
    minutes: safeMinutes,
    caloriesBurned: calculateExerciseCalories(exercise.type, safeMinutes, weightKg),
  };
}

export function sumExerciseCalories(exercises: LoggedExercise[]): number {
  return exercises.reduce((sum, e) => sum + e.caloriesBurned, 0);
}
