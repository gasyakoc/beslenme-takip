import type { UserProfile, UserTargets } from "./types";

export const USER_PROFILE: UserProfile = {
  name: "Gasya",
  age: 24,
  heightCm: 162,
  currentWeight: 55,
  targetWeight: 48,
  activityLevel: "light",
};

function calculateBmr(profile: UserProfile): number {
  const { currentWeight, heightCm, age } = profile;
  return 10 * currentWeight + 6.25 * heightCm - 5 * age - 161;
}

function calculateTdee(profile: UserProfile): number {
  const bmr = calculateBmr(profile);
  const multipliers = { light: 1.375 };
  return Math.round(bmr * multipliers[profile.activityLevel]);
}

export function calculateTargets(profile: UserProfile): UserTargets {
  const tdee = calculateTdee(profile);
  const calories = Math.round(tdee - 400);
  const protein = Math.round(profile.currentWeight * 1.8);
  const fat = Math.round((calories * 0.3) / 9);
  const carbs = Math.round((calories - protein * 4 - fat * 9) / 4);

  return {
    tdee,
    calories,
    protein,
    fat,
    carbs,
    waterMl: 2500,
  };
}

export const USER_TARGETS = calculateTargets(USER_PROFILE);
