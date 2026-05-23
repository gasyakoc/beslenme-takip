import type { ExerciseType, LoggedExercise, RunningPace } from "./types";

/**
 * Kalori formülü (ACSM / Compendium of Physical Activities):
 * kcal = süre(dk) × MET × 3.5 × kilo(kg) / 200
 *
 * Kaynak: Ainsworth et al. 2011 Compendium of Physical Activities,
 * Med Sci Sports Exerc. 2011;43(8):1575-1581
 */

const STEP_LENGTH_FACTOR = 0.414;

/** Yürüyüş: orta tempo ~3.5 MET, ~4.8 km/h (Compendium walking ~3.0–4.0) */
const WALKING_MET = 3.5;
const WALKING_SPEED_KMH = 4.8;

/** Koşu tempoları — Compendium kodları */
export const RUNNING_PACE: Record<
  RunningPace,
  { met: number; speedKmh: number; label: string; code: string }
> = {
  jog: {
    met: 7.0,
    speedKmh: 8.0,
    label: "Hafif (jogging)",
    code: "12020",
  },
  moderate: {
    met: 9.8,
    speedKmh: 9.7,
    label: "Orta (6 mph)",
    code: "12050",
  },
  fast: {
    met: 11.8,
    speedKmh: 12.9,
    label: "Hızlı (8 mph)",
    code: "12090",
  },
};

/** Pilates — Compendium 02105 */
export const PILATES_MET = 3.0;
export const PILATES_CODE = "02105";

export const DEFAULT_STEPS = 5000;
export const DEFAULT_DISTANCE_KM = 3;
export const DEFAULT_PILATES_MINUTES = 45;

function metCalories(met: number, minutes: number, weightKg: number): number {
  return Math.round((minutes * met * 3.5 * weightKg) / 200);
}

export function calculateWalkingCaloriesFromSteps(
  steps: number,
  weightKg: number,
  heightCm: number
): number {
  const stepLengthKm = (heightCm / 100) * STEP_LENGTH_FACTOR / 1000;
  const distanceKm = steps * stepLengthKm;
  const timeMin = (distanceKm / WALKING_SPEED_KMH) * 60;
  return metCalories(WALKING_MET, timeMin, weightKg);
}

export function getCaloriesPerStep(weightKg: number, heightCm: number): number {
  return calculateWalkingCaloriesFromSteps(1000, weightKg, heightCm) / 1000;
}

export function calculateRunningCalories(
  distanceKm: number,
  pace: RunningPace,
  weightKg: number
): number {
  const { met, speedKmh } = RUNNING_PACE[pace];
  const timeMin = (distanceKm / speedKmh) * 60;
  return metCalories(met, timeMin, weightKg);
}

export function getCaloriesPerKmRunning(
  pace: RunningPace,
  weightKg: number
): number {
  return calculateRunningCalories(1, pace, weightKg);
}

export function calculatePilatesCalories(
  minutes: number,
  weightKg: number
): number {
  return metCalories(PILATES_MET, minutes, weightKg);
}

function stepsFromMinutes(minutes: number, heightCm: number): number {
  const stepLengthM = (heightCm / 100) * STEP_LENGTH_FACTOR;
  const speedMps = (WALKING_SPEED_KMH * 1000) / 3600;
  return Math.round(minutes * (speedMps / stepLengthM));
}

function kmFromMinutes(minutes: number, pace: RunningPace): number {
  return (minutes / 60) * RUNNING_PACE[pace].speedKmh;
}

export function createExercise(
  type: ExerciseType,
  weightKg: number,
  heightCm: number
): LoggedExercise {
  if (type === "yuruyus") {
    const steps = DEFAULT_STEPS;
    return {
      id: crypto.randomUUID(),
      type,
      steps,
      caloriesBurned: calculateWalkingCaloriesFromSteps(steps, weightKg, heightCm),
    };
  }
  if (type === "kosu") {
    const runningPace: RunningPace = "moderate";
    const distanceKm = DEFAULT_DISTANCE_KM;
    return {
      id: crypto.randomUUID(),
      type,
      distanceKm,
      runningPace,
      caloriesBurned: calculateRunningCalories(distanceKm, runningPace, weightKg),
    };
  }
  const minutes = DEFAULT_PILATES_MINUTES;
  return {
    id: crypto.randomUUID(),
    type: "pilates",
    minutes,
    caloriesBurned: calculatePilatesCalories(minutes, weightKg),
  };
}

export function updateExerciseSteps(
  exercise: LoggedExercise,
  steps: number,
  weightKg: number,
  heightCm: number
): LoggedExercise {
  const safeSteps = Math.max(500, Math.min(50000, Math.round(steps / 500) * 500));
  return {
    ...exercise,
    steps: safeSteps,
    caloriesBurned: calculateWalkingCaloriesFromSteps(safeSteps, weightKg, heightCm),
  };
}

export function updateExerciseDistance(
  exercise: LoggedExercise,
  distanceKm: number,
  weightKg: number
): LoggedExercise {
  const pace = exercise.runningPace ?? "moderate";
  const safeKm = Math.max(0.5, Math.min(42, Math.round(distanceKm * 2) / 2));
  return {
    ...exercise,
    distanceKm: safeKm,
    runningPace: pace,
    caloriesBurned: calculateRunningCalories(safeKm, pace, weightKg),
  };
}

export function updateExerciseRunningPace(
  exercise: LoggedExercise,
  pace: RunningPace,
  weightKg: number
): LoggedExercise {
  const km = exercise.distanceKm ?? DEFAULT_DISTANCE_KM;
  return {
    ...exercise,
    runningPace: pace,
    distanceKm: km,
    caloriesBurned: calculateRunningCalories(km, pace, weightKg),
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
    caloriesBurned: calculatePilatesCalories(safeMinutes, weightKg),
  };
}

export function migrateLegacyExercise(
  exercise: LoggedExercise,
  weightKg: number,
  heightCm: number
): LoggedExercise {
  if (exercise.type === "yuruyus") {
    if (exercise.steps != null) {
      return {
        ...exercise,
        caloriesBurned: calculateWalkingCaloriesFromSteps(
          exercise.steps,
          weightKg,
          heightCm
        ),
      };
    }
    const steps = exercise.minutes
      ? stepsFromMinutes(exercise.minutes, heightCm)
      : DEFAULT_STEPS;
    return {
      id: exercise.id,
      type: "yuruyus",
      steps,
      caloriesBurned: calculateWalkingCaloriesFromSteps(steps, weightKg, heightCm),
    };
  }

  if (exercise.type === "kosu") {
    if (exercise.distanceKm != null && exercise.runningPace) {
      return {
        ...exercise,
        caloriesBurned: calculateRunningCalories(
          exercise.distanceKm,
          exercise.runningPace,
          weightKg
        ),
      };
    }
    const pace: RunningPace = exercise.runningPace ?? "moderate";
    const km =
      exercise.distanceKm ??
      (exercise.minutes ? kmFromMinutes(exercise.minutes, pace) : DEFAULT_DISTANCE_KM);
    return {
      id: exercise.id,
      type: "kosu",
      distanceKm: km,
      runningPace: pace,
      caloriesBurned: calculateRunningCalories(km, pace, weightKg),
    };
  }

  const minutes = exercise.minutes ?? DEFAULT_PILATES_MINUTES;
  return {
    ...exercise,
    type: "pilates",
    minutes,
    caloriesBurned: calculatePilatesCalories(minutes, weightKg),
  };
}

export function sumExerciseCalories(exercises: LoggedExercise[]): number {
  return exercises.reduce((sum, e) => sum + e.caloriesBurned, 0);
}
