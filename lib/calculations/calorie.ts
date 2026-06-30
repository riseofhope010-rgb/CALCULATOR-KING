export interface CalorieInput {
  age: number
  weight: number // kg
  height: number // cm
  gender: 'male' | 'female'
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive'
  goal: 'lose' | 'maintain' | 'gain'
}

export interface CalorieResult {
  bmr: number
  tdee: number
  targetCalories: number
  proteinGrams: number
  carbsGrams: number
  fatGrams: number
  fiberGrams: number
  waterLiters: number
  mealCalories: MealCalories
  macros: Macros
}

export interface MealCalories {
  breakfast: number
  lunch: number
  dinner: number
  snacks: number
}

export interface Macros {
  protein: { grams: number; calories: number; percent: number }
  carbs: { grams: number; calories: number; percent: number }
  fat: { grams: number; calories: number; percent: number }
}

const ACTIVITY_MULTIPLIERS: Record<string, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  veryActive: 1.9,
}

export const calculateCalories = (input: CalorieInput): CalorieResult => {
  const { age, weight, height, gender, activityLevel, goal } = input

  // Calculate BMR using Mifflin-St Jeor Equation
  let bmr: number
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161
  }

  // Calculate TDEE (Total Daily Energy Expenditure)
  const activityMultiplier = ACTIVITY_MULTIPLIERS[activityLevel]
  const tdee = Math.round(bmr * activityMultiplier)

  // Adjust for goal
  let targetCalories: number
  if (goal === 'lose') {
    targetCalories = Math.round(tdee - 500) // 500 calorie deficit for ~1 lb/week loss
  } else if (goal === 'gain') {
    targetCalories = Math.round(tdee + 500) // 500 calorie surplus for ~1 lb/week gain
  } else {
    targetCalories = tdee
  }

  // Calculate macros (40/30/30 split)
  const proteinGrams = Math.round((targetCalories * 0.30) / 4)
  const carbsGrams = Math.round((targetCalories * 0.40) / 4)
  const fatGrams = Math.round((targetCalories * 0.30) / 9)

  // Fiber recommendation (14g per 1000 calories)
  const fiberGrams = Math.round(targetCalories / 1000 * 14)

  // Water recommendation (ml per kcal)
  const waterLiters = Math.round(targetCalories / 1000) + 0.5

  // Meal distribution
  const mealCalories: MealCalories = {
    breakfast: Math.round(targetCalories * 0.25),
    lunch: Math.round(targetCalories * 0.35),
    dinner: Math.round(targetCalories * 0.30),
    snacks: Math.round(targetCalories * 0.10),
  }

  const macros: Macros = {
    protein: { grams: proteinGrams, calories: proteinGrams * 4, percent: 30 },
    carbs: { grams: carbsGrams, calories: carbsGrams * 4, percent: 40 },
    fat: { grams: fatGrams, calories: fatGrams * 9, percent: 30 },
  }

  return {
    bmr: Math.round(bmr),
    tdee,
    targetCalories,
    proteinGrams,
    carbsGrams,
    fatGrams,
    fiberGrams,
    waterLiters,
    mealCalories,
    macros,
  }
}
