import type { ExerciseType, LoggedExercise } from "./types";

/** Compendium of PA: orta tempoda yürüyüş ~3.5 MET, ~1.34 m/s (4.8 km/h) */
const WALKING_MET = 3.5;
const WALKING_SPEED_MPS = 1.34;
const STEP_LENGTH_FACTOR = 0.414;

export const EXERCISE_MET: Record<ExerciseType, number> = {
  yuruyus: WALKING_MET,
  kosu: 8.5,
  pilates: 3.0,
};

export const DEFAULT_MINUTES: Record<Exclude<ExerciseType, "yuruyus">, number> = {
  kosu: 25,
  pilates: 45,
};

export const DEFAULT_STEPS = 5000;

/**
 * Adım → kalori (ACSM / Compendium MET formülü).
 * Adım uzunluğu: boy × 0.414 m
 * Kalori = süre(dk) × MET × 3.5 × kilo(kg) / 200
 */
export function calculateWalkingCaloriesFromSteps(
  steps: number,
  weightKg: number,
  heightCm: number
): number {
  const stepLengthM = (heightCm / 100) * STEP_LENGTH_FACTOR;
  const distanceM = steps * stepLengthM;
  const timeMin = distanceM / WALKING_SPEED_MPS / 60;
  return Math.round((timeMin * WALKING_MET * 3.5 * weightKg) / 200);
}

export function getCaloriesPerStep(weightKg: number, heightCm: number): number {
  return calculateWalkingCaloriesFromSteps(1000, weightKg, heightCm) / 1000;
}

function stepsFromMinutes(minutes: number, heightCm: number): number {
  const stepLengthM = (heightCm / 100) * STEP_LENGTH_FACTOR;
  const cadenceStepsPerMin = WALKING_SPEED_MPS / stepLengthM;
  return Math.round(minutes * cadenceStepsPerMin);
}

export function calculateExerciseCalories(
  type: ExerciseType,
  value: number,
  weightKg: number,
  heightCm: number
): number {
  if (type === "yuruyus") {
    return calculateWalkingCaloriesFromSteps(value, weightKg, heightCm);
  }
  const met = EXERCISE_MET[type];
  return Math.round(met * weightKg * (value / 60));
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
  const minutes = DEFAULT_MINUTES[type];
  return {
    id: crypto.randomUUID(),
    type,
    minutes,
    caloriesBurned: calculateExerciseCalories(type, minutes, weightKg, heightCm),
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

export function updateExerciseMinutes(
  exercise: LoggedExercise,
  minutes: number,
  weightKg: number,
  heightCm: number
): LoggedExercise {
  const safeMinutes = Math.max(5, Math.min(180, minutes));
  return {
    ...exercise,
    minutes: safeMinutes,
    caloriesBurned: calculateExerciseCalories(
      exercise.type,
      safeMinutes,
      weightKg,
      heightCm
    ),
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
  const minutes = exercise.minutes ?? DEFAULT_MINUTES[exercise.type];
  return {
    ...exercise,
    minutes,
    caloriesBurned: calculateExerciseCalories(exercise.type, minutes, weightKg, heightCm),
  };
}

export function sumExerciseCalories(exercises: LoggedExercise[]): number {
  return exercises.reduce((sum, e) => sum + e.caloriesBurned, 0);
}
