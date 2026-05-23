export type MealType = "kahvalti" | "ogle" | "aksam" | "ara1" | "ara2";

export type ExerciseType = "yuruyus" | "kosu" | "pilates";

/** 2011 Compendium of Physical Activities — koşu hız kodları */
export type RunningPace = "jog" | "moderate" | "fast";

export interface MacroNutrients {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

export interface FoodItem extends MacroNutrients {
  id: string;
  name: string;
  category: MealType | "genel";
  defaultGrams: number;
  unit: string;
}

export interface LoggedFood extends MacroNutrients {
  id: string;
  foodId?: string;
  name: string;
  mealType: MealType;
  grams: number;
  eaten: boolean;
}

export interface LoggedExercise {
  id: string;
  type: ExerciseType;
  steps?: number;
  distanceKm?: number;
  runningPace?: RunningPace;
  minutes?: number;
  caloriesBurned: number;
}

export interface DayLog {
  meals: LoggedFood[];
  waterMl: number;
  exercises: LoggedExercise[];
}

export interface WeightEntry {
  date: string;
  weight: number;
}

export interface UserTargets extends MacroNutrients {
  waterMl: number;
  tdee: number;
}

export interface UserProfile {
  name: string;
  age: number;
  heightCm: number;
  currentWeight: number;
  targetWeight: number;
  activityLevel: "light";
}

export interface AppData {
  profile: UserProfile;
  targets: UserTargets;
  days: Record<string, DayLog>;
  weightLog: WeightEntry[];
  customFoods: FoodItem[];
}

export const MEAL_LABELS: Record<MealType, string> = {
  kahvalti: "Kahvaltı / Brunch",
  ogle: "Öğle Yemeği",
  aksam: "Akşam Yemeği",
  ara1: "Ara Öğün 1",
  ara2: "Ara Öğün 2",
};

export const MEAL_TIMES: Record<MealType, string> = {
  kahvalti: "~12:00",
  ogle: "~15:00",
  aksam: "~20:00",
  ara1: "~17:00",
  ara2: "~23:00",
};

export const EXERCISE_LABELS: Record<ExerciseType, string> = {
  yuruyus: "Yürüyüş",
  kosu: "Koşu",
  pilates: "Pilates",
};
