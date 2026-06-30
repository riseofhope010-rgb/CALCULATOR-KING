export interface BMIInput {
  weight: number
  height: number
  unit: 'metric' | 'imperial'
}

export interface BMIResult {
  bmi: number
  category: string
  healthyWeightRange: { min: number; max: number }
  weightToLose: number
  healthRisk: string
  interpretation: string
}

export const calculateBMI = (input: BMIInput): BMIResult => {
  const { weight, height, unit } = input

  // Calculate BMI
  let bmi: number
  let heightM: number
  let weightKg: number

  if (unit === 'metric') {
    heightM = height / 100 // cm to m
    weightKg = weight
    bmi = weightKg / (heightM * heightM)
  } else {
    // Imperial: BMI = (weight in lbs * 703) / (height in inches)^2
    bmi = (weight / (height * height)) * 703
    heightM = height * 0.0254 // inches to meters
    weightKg = weight * 0.453592 // lbs to kg
  }

  // Determine category
  let category: string
  let healthRisk: string

  if (bmi < 18.5) {
    category = 'Underweight'
    healthRisk = 'Malnutrition, osteoporosis, anemia, weakened immune system'
  } else if (bmi < 25) {
    category = 'Normal Weight'
    healthRisk = 'Low risk (healthy range)'
  } else if (bmi < 30) {
    category = 'Overweight'
    healthRisk = 'Moderate risk of heart disease, high blood pressure, stroke, diabetes'
  } else if (bmi < 35) {
    category = 'Obese Class I'
    healthRisk = 'High risk of heart disease, high blood pressure, stroke, diabetes'
  } else if (bmi < 40) {
    category = 'Obese Class II'
    healthRisk = 'Very high risk of heart disease, high blood pressure, stroke, diabetes'
  } else {
    category = 'Obese Class III'
    healthRisk = 'Extremely high risk of heart disease, stroke, diabetes, sleep apnea'
  }

  // Calculate healthy weight range (BMI 18.5-24.9)
  const healthyWeightMin = 18.5 * heightM * heightM
  const healthyWeightMax = 24.9 * heightM * heightM

  // Weight to lose/gain for healthy BMI
  let weightToLose = 0
  if (unit === 'metric') {
    const targetWeight = bmi > 24.9 ? healthyWeightMax : bmi < 18.5 ? healthyWeightMin : weightKg
    weightToLose = weightKg - targetWeight
  } else {
    const targetWeightLbs = bmi > 24.9 ? healthyWeightMax / 0.453592 : bmi < 18.5 ? healthyWeightMin / 0.453592 : weight
    weightToLose = weight - targetWeightLbs
  }

  // Interpretation
  const interpretation = getInterpretation(bmi, category)

  return {
    bmi: Math.round(bmi * 10) / 10,
    category,
    healthyWeightRange: {
      min: Math.round(healthyWeightMin * 10) / 10,
      max: Math.round(healthyWeightMax * 10) / 10,
    },
    weightToLose: Math.round(weightToLose * 10) / 10,
    healthRisk,
    interpretation,
  }
}

const getInterpretation = (bmi: number, category: string): string => {
  if (bmi < 18.5) {
    return `Your BMI of ${bmi.toFixed(1)} indicates you are underweight. Being underweight can weaken your immune system and increase the risk of nutritional deficiencies. Consider consulting a healthcare provider to develop a healthy weight gain plan.`
  } else if (bmi < 25) {
    return `Your BMI of ${bmi.toFixed(1)} is in the healthy weight range. Maintaining a healthy weight reduces your risk of serious health conditions like heart disease, type 2 diabetes, and certain cancers.`
  } else if (bmi < 30) {
    return `Your BMI of ${bmi.toFixed(1)} indicates you are overweight. Excess weight can increase your risk of health problems. Making lifestyle changes like improved diet and regular exercise can help you reach a healthier weight.`
  } else {
    return `Your BMI of ${bmi.toFixed(1)} indicates obesity, which significantly increases health risks. It's important to work with healthcare professionals to develop a comprehensive weight management plan.`
  }
}
