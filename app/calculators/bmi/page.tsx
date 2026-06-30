'use client'

import React, { useState, useEffect } from 'react'
import CalculatorPageTemplate from '@/components/calculators/CalculatorPageTemplate'
import { calculateBMI, BMIInput, BMIResult } from '@/lib/calculations/bmi'
import { formatNumber } from '@/lib/utils/format'

export default function BMICalculatorPage() {
  const [inputs, setInputs] = useState<BMIInput>({
    weight: 70,
    height: 175,
    unit: 'metric',
  })
  const [results, setResults] = useState<BMIResult | null>(null)

  useEffect(() => {
    const calculated = calculateBMI(inputs)
    setResults(calculated)
  }, [inputs])

  const handleInputChange = (field: keyof BMIInput, value: string | number) => {
    setInputs(prev => ({
      ...prev,
      [field]: typeof value === 'string' && field !== 'unit'
        ? parseFloat(value) || 0
        : value,
    }))
  }

  const calculatorForm = (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Unit System
        </label>
        <div className="flex rounded-lg border-2 border-gray-300 dark:border-gray-600 overflow-hidden">
          <button
            className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
              inputs.unit === 'metric'
                ? 'bg-primary text-white'
                : 'bg-white dark:bg-dark-surface text-gray-700 dark:text-gray-300'
            }`}
            onClick={() => handleInputChange('unit', 'metric')}
          >
            Metric (kg/cm)
          </button>
          <button
            className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
              inputs.unit === 'imperial'
                ? 'bg-primary text-white'
                : 'bg-white dark:bg-dark-surface text-gray-700 dark:text-gray-300'
            }`}
            onClick={() => handleInputChange('unit', 'imperial')}
          >
            Imperial (lb/in)
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Weight ({inputs.unit === 'metric' ? 'kg' : 'lbs'})
        </label>
        <div className="relative">
          <input
            type="number"
            value={inputs.weight}
            onChange={(e) => handleInputChange('weight', e.target.value)}
            className="input-field"
            placeholder={inputs.unit === 'metric' ? '70' : '154'}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Height ({inputs.unit === 'metric' ? 'cm' : 'inches'})
        </label>
        <input
          type="number"
          value={inputs.height}
          onChange={(e) => handleInputChange('height', e.target.value)}
          className="input-field"
          placeholder={inputs.unit === 'metric' ? '175' : '69'}
        />
      </div>
    </div>
  )

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Underweight': return '#F59E0B'
      case 'Normal Weight': return '#10B981'
      case 'Overweight': return '#F97316'
      default: return '#EF4444'
    }
  }

  const resultsDisplay = results ? {
    mainResult: {
      label: 'Your BMI',
      value: results.bmi,
      subtext: results.category,
    },
    cards: [
      { label: 'Category', value: results.category, color: getCategoryColor(results.category) },
      { label: 'Healthy Range', value: `${results.healthyWeightRange.min} - ${results.healthyWeightRange.max} kg`, color: '#2563EB' },
      { label: 'Weight to Adjust', value: `${results.weightToLose} kg`, color: results.weightToLose > 0 ? '#EF4444' : '#10B981' },
    ],
    barData: [
      { name: 'BMI', value: results.bmi },
      { name: 'Normal Min', value: 18.5 },
      { name: 'Normal Max', value: 24.9 },
    ],
  } : null

  return (
    <CalculatorPageTemplate
      id="bmi"
      name="BMI Calculator"
      description="Calculate your Body Mass Index and understand your weight category"
      path="/calculators/bmi"
      heroContent="Body Mass Index (BMI) is a widely used screening tool that uses your height and weight to estimate whether you're underweight, normal weight, overweight, or obese. While BMI has limitations—it doesn't distinguish between muscle and fat mass—it remains a useful starting point for understanding your weight in relation to your height. Our BMI Calculator instantly computes your BMI and provides context about what the number means for your health category, along with your healthy weight range and guidance on next steps."
      calculatorForm={calculatorForm}
      results={resultsDisplay || {}}
      whatNumbersMean="Your BMI is calculated using the formula: weight divided by height squared. For metric measurements, that is kg/(m)^2. The resulting number places you in a category: Underweight (<18.5), Normal (18.5-24.9), Overweight (25-29.9), or Obese (30+). The healthy weight range shows what you would weigh at BMI 18.5 and 24.9 for your height. Weight to adjust shows how much you need to gain or lose to reach a healthy BMI."
      whyItMatters="BMI is a screening tool, not a diagnosis, but it signals potential health risks. Higher BMI categories correlate with increased risk of heart disease, type 2 diabetes, certain cancers, and other conditions. Low BMI can indicate malnutrition, weakened immune function, or other health issues. Understanding your category helps you make informed decisions about diet, exercise, and whether to consult a healthcare provider."
      howToUse={[
        "Choose metric (kilograms/centimeters) or imperial (pounds/inches).",
        "Enter your current weight.",
        "Enter your height.",
        "View your BMI and category instantly.",
        "Use the healthy weight range as a realistic target.",
      ]}
      faqItems={[
        { question: 'What is a healthy BMI?', answer: 'A healthy BMI falls between 18.5 and 24.9. Below 18.5 is considered underweight, 25-29.9 is overweight, and 30+ is obese. These ranges are based on statistical correlations between BMI and health risks in large populations.' },
        { question: 'Is BMI accurate for everyone?', answer: 'BMI has limitations. It can overestimate body fat in athletes and muscular individuals (muscle weighs more than fat), and underestimate it in older persons who have lost muscle mass. Consider body composition testing for a more complete picture.' },
        { question: 'What health risks are associated with high BMI?', answer: 'Higher BMI increases the risk of type 2 diabetes, heart disease, stroke, certain cancers, sleep apnea, osteoarthritis, and fatty liver disease. Each increase in BMI category typically increases health risk.' },
        { question: 'What if my BMI is too low?', answer: 'Very low BMI (underweight) may indicate nutritional deficiencies, weakened immune system, bone loss, fertility issues, or other health concerns. Consult a healthcare provider if your BMI is below 18.5.' },
        { question: 'How can I improve my BMI?', answer: 'Gradual, sustainable changes work best. Combine a balanced diet with regular physical activity. Aim to create a modest calorie deficit for weight loss or surplus for weight gain. Consult a healthcare provider for personalized guidance.' },
        { question: 'Does BMI apply to children?', answer: 'For children and teens (2-19 years), BMI is interpreted differently based on age and sex using growth charts. A child's BMI percentile indicates how they compare to peers. Use pediatric BMI calculators for accurate assessment.' },
        { question: 'What about waist circumference?', answer: 'Waist circumference complements BMI by measuring abdominal fat—a key health risk indicator. A waist over 40 inches for men or 35 inches for women indicates higher risk, even with normal BMI.' },
        { question: 'How often should I check my BMI?', answer: 'Check periodically when working on weight management—perhaps monthly. Daily fluctuations are normal and not meaningful. Focus on trends over time rather than single measurements.' },
      ]}
    />
  )
}
