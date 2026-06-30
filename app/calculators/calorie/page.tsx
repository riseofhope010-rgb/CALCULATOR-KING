'use client'

import React, { useState, useEffect } from 'react'
import CalculatorPageTemplate from '@/components/calculators/CalculatorPageTemplate'
import { calculateCalories, CalorieInput, CalorieResult } from '@/lib/calculations/calorie'
import { formatNumber } from '@/lib/utils/format'

export default function CalorieCalculatorPage() {
  const [inputs, setInputs] = useState<CalorieInput>({
    age: 30,
    weight: 70,
    height: 175,
    gender: 'male',
    activityLevel: 'moderate',
    goal: 'maintain',
  })
  const [results, setResults] = useState<CalorieResult | null>(null)

  useEffect(() => {
    const calculated = calculateCalories(inputs)
    setResults(calculated)
  }, [inputs])

  const handleInputChange = (field: keyof CalorieInput, value: string | number) => {
    setInputs(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const calculatorForm = (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Gender
        </label>
        <div className="flex rounded-lg border-2 border-gray-300 dark:border-gray-600 overflow-hidden">
          <button
            className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
              inputs.gender === 'male'
                ? 'bg-primary text-white'
                : 'bg-white dark:bg-dark-surface text-gray-700 dark:text-gray-300'
            }`}
            onClick={() => handleInputChange('gender', 'male')}
          >
            Male
          </button>
          <button
            className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
              inputs.gender === 'female'
                ? 'bg-primary text-white'
                : 'bg-white dark:bg-dark-surface text-gray-700 dark:text-gray-300'
            }`}
            onClick={() => handleInputChange('gender', 'female')}
          >
            Female
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Age
          </label>
          <input
            type="number"
            value={inputs.age}
            onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
            className="input-field"
            placeholder="30"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Weight (kg)
          </label>
          <input
            type="number"
            value={inputs.weight}
            onChange={(e) => handleInputChange('weight', parseInt(e.target.value) || 0)}
            className="input-field"
            placeholder="70"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Height (cm)
        </label>
        <input
          type="number"
          value={inputs.height}
          onChange={(e) => handleInputChange('height', parseInt(e.target.value) || 0)}
          className="input-field"
          placeholder="175"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Activity Level
        </label>
        <select
          value={inputs.activityLevel}
          onChange={(e) => handleInputChange('activityLevel', e.target.value as CalorieInput['activityLevel'])}
          className="input-field"
        >
          <option value="sedentary">Sedentary (little exercise)</option>
          <option value="light">Lightly Active (1-3 days/week)</option>
          <option value="moderate">Moderately Active (3-5 days/week)</option>
          <option value="active">Very Active (6-7 days/week)</option>
          <option value="veryActive">Extra Active (physical job)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Goal
        </label>
        <select
          value={inputs.goal}
          onChange={(e) => handleInputChange('goal', e.target.value as CalorieInput['goal'])}
          className="input-field"
        >
          <option value="lose">Lose Weight</option>
          <option value="maintain">Maintain Weight</option>
          <option value="gain">Gain Weight</option>
        </select>
      </div>
    </div>
  )

  const resultsDisplay = results ? {
    mainResult: {
      label: 'Daily Calories',
      value: results.targetCalories,
      subtext: `${inputs.goal === 'lose' ? '500 calorie deficit for ~1 lb/week weight loss' : inputs.goal === 'gain' ? '500 calorie surplus for ~1 lb/week weight gain' : 'To maintain current weight'}`,
    },
    cards: [
      { label: 'BMR', value: `${results.bmr} cal`, color: '#2563EB' },
      { label: 'Maintenance', value: `${results.tdee} cal`, color: '#10B981' },
      { label: 'Daily Protein', value: `${results.proteinGrams}g`, color: '#F59E0B' },
    ],
    barData: [
      { name: 'Calories', value: results.targetCalories },
      { name: 'TDEE', value: results.tdee },
      { name: 'BMR', value: results.bmr },
    ],
    tableData: {
      headers: ['Nutrient', 'Grams', 'Calories', '%'],
      rows: [
        ['Protein', `${results.macros.protein.grams}g`, `${results.macros.protein.calories}`, `${results.macros.protein.percent}%`],
        ['Carbs', `${results.macros.carbs.grams}g`, `${results.macros.carbs.calories}`, `${results.macros.carbs.percent}%`],
        ['Fat', `${results.macros.fat.grams}g`, `${results.macros.fat.calories}`, `${results.macros.fat.percent}%`],
      ],
    },
  } : null

  return (
    <CalculatorPageTemplate
      id="calorie"
      name="Calorie Calculator"
      description="Calculate your daily calorie needs and macros for your goals"
      path="/calculators/calorie"
      heroContent="Understanding your daily calorie needs is the foundation of any nutrition plan—whether you want to lose weight, build muscle, or maintain your current physique. Our Calorie Calculator uses the scientifically-validated Mifflin-St Jeor equation to calculate your Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE). Beyond just calories, it provides a balanced macronutrient breakdown showing how much protein, carbohydrates, and fat you need, plus guidance on meal distribution and hydration."
      calculatorForm={calculatorForm}
      results={resultsDisplay || {}}
      whatNumbersMean="BMR (Basal Metabolic Rate) shows how many calories your body burns at complete rest—keeping your heart beating, lungs breathing, and organs functioning. TDEE adds activity calories to show your total daily burn. Target calories adjust for your goal—500 below TDEE for weight loss, or 500 above for gain. Macros show how to distribute calories: protein for muscle repair, carbs for energy, fat for hormone function."
      whyItMatters="Calorie awareness prevents both overeating and undereating—both harmful to your health and goals. Knowing your numbers helps you make informed food choices rather than guessing. The macro breakdown ensures you're not just hitting calorie targets but getting the right nutrients for your body composition goals. This knowledge is essential whether you're trying to lose fat, build muscle, or optimize performance."
      howToUse={[
        "Select your biological gender (affects BMR calculation).",
        "Enter your age, weight, and height.",
        "Choose your typical activity level for the week.",
        "Set your goal: lose, maintain, or gain weight.",
        "Use the calorie and macro targets to plan your meals.",
      ]}
      faqItems={[
        { question: "What is BMR?", answer: "Basal Metabolic Rate is the calories your body burns at complete rest maintaining vital functions like breathing and heartbeat. It accounts for about 60-75% of total daily calories. BMR varies by age, size, gender, and muscle mass." },
        { question: "How accurate is this calculator?", answer: "The Mifflin-St Jeor equation used here is one of the most accurate BMR formulas. However, metabolism varies individually by up to 10-15%. Use these numbers as a starting point and adjust based on real-world results over 2-4 weeks." },
        { question: "Why 500 calorie deficit for weight loss?", answer: "A 500 calorie daily deficit equals 3,500 calories weekly—approximately 1 pound of fat. This is a sustainable rate that minimizes muscle loss and metabolic adaptation while making compliance easier." },
        { question: "What about macronutrients?", answer: "The calculator shows a 40/30/30 split: 40% carbs for energy, 30% protein for muscle repair, 30% fat for hormone function. This balance works well for most general fitness goals. Athletes may need different ratios." },
        { question: "Should I track calories every day?", answer: "Tracking can be helpful initially to understand portion sizes and food values. Over time, many people can maintain awareness without daily tracking. Consider tracking periodically or for specific goals rather than indefinitely." },
        { question: "What if I am not losing weight at these calories?", answer: "Metabolism varies, and NEAT (Non-Exercise Activity Thermogenesis) can differ significantly. If not losing after 2-3 weeks, reduce by 200-300 calories. If losing too fast, add 200-300. Monitor and adjust based on results." },
        { question: "How important is meal timing?", answer: "Total daily calories and macros matter most. Meal timing can help with hunger management and training performance but doesn't significantly affect weight loss. The suggested meal distribution is a starting framework." },
        { question: "What about water intake?", answer: "Hydration is important for metabolism, performance, and health. The calculator suggests water based on your calories. Thirst is generally an adequate guide, but aim for pale yellow urine color as a hydration indicator." },
      ]}
    />
  )
}
