'use client'

import { useState, useEffect } from 'react'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils/format'

interface DynamicCalculatorProps {
  calculatorId: string
  defaultSalary: number
  locationData: {
    id: string
    name: string
    state: string | null
    country: string
    currency: string
    stateTaxRate: number
    costOfLiving: number
  }
  roleData: {
    id: string
    name: string
    category: string
    description: string
  }
  locationId: string
  roleId: string
}

// Calculators that deal with money (show currency symbol, salary context, currency-formatted results)
const FINANCIAL_CALCULATORS = new Set([
  'salary', 'tax', 'mortgage', 'investment', 'compound-interest', 'loan', 'loan-emi',
  'retirement', 'currency', 'freelance-rate', 'roi', 'affiliate-commission',
  'cost-of-living', 'crypto', 'forex', 'contractor-income', 'pension', 'profit-margin',
])

// Health calculators use physical units (kg, cm) and have nothing to do with salary/currency
const HEALTH_CALCULATORS = new Set(['bmi', 'calorie'])

export default function GenericCalculatorDynamic({
  calculatorId,
  defaultSalary,
  locationData,
  roleData,
}: DynamicCalculatorProps) {
  const isFinancial = FINANCIAL_CALCULATORS.has(calculatorId)
  const isHealth = HEALTH_CALCULATORS.has(calculatorId)

  // For health calculators, start from a sensible default weight (70kg) instead of a salary figure
  const [inputValue, setInputValue] = useState(isHealth ? 70 : defaultSalary)
  const [heightCm, setHeightCm] = useState(170)
  const [results, setResults] = useState<Record<string, number | string>>({})

  useEffect(() => {
    const calculated = calculateResults(calculatorId, inputValue, locationData, heightCm)
    setResults(calculated)
  }, [calculatorId, inputValue, heightCm, locationData])

  const getInputLabel = () => {
    switch (calculatorId) {
      case 'salary':
      case 'tax':
        return 'Gross Annual Income'
      case 'mortgage':
        return 'Home Price'
      case 'investment':
      case 'compound-interest':
        return 'Initial Investment'
      case 'loan':
      case 'loan-emi':
        return 'Loan Amount'
      case 'retirement':
        return 'Current Savings'
      case 'currency':
        return 'Amount to Convert'
      case 'bmi':
        return 'Weight (kg)'
      case 'calorie':
        return 'Current Weight (kg)'
      case 'freelance-rate':
        return 'Desired Annual Income'
      case 'roi':
        return 'Initial Investment'
      case 'affiliate-commission':
        return 'Monthly Clicks'
      case 'cost-of-living':
        return 'Current Salary'
      case 'crypto':
        return 'Investment Amount'
      case 'forex':
        return 'Trade Amount'
      case 'contractor-income':
        return 'Annual Revenue'
      case 'pension':
        return 'Years of Service'
      case 'profit-margin':
        return 'Revenue'
      default:
        return 'Amount'
    }
  }

  const getResultLabel = () => {
    switch (calculatorId) {
      case 'salary':
        return 'Net Monthly Pay'
      case 'tax':
        return 'Take-Home Pay'
      case 'mortgage':
        return 'Monthly Payment'
      case 'investment':
      case 'compound-interest':
        return 'Future Value'
      case 'loan':
      case 'loan-emi':
        return 'Monthly Payment'
      case 'retirement':
        return 'Projected Savings'
      case 'currency':
        return 'Converted Amount'
      case 'bmi':
        return 'Your BMI'
      case 'calorie':
        return 'Daily Calories'
      case 'freelance-rate':
        return 'Hourly Rate'
      case 'roi':
        return 'Return on Investment'
      case 'affiliate-commission':
        return 'Monthly Revenue'
      case 'cost-of-living':
        return 'Equivalent Salary'
      case 'crypto':
        return 'Current Value'
      case 'forex':
        return 'Profit/Loss'
      case 'contractor-income':
        return 'Net Income'
      case 'pension':
        return 'Monthly Pension'
      case 'profit-margin':
        return 'Net Profit Margin'
      default:
        return 'Result'
    }
  }

  const formatResult = (value: number): string => {
    if (isFinancial) {
      if (['roi', 'profit-margin'].includes(calculatorId)) {
        return formatPercent(value)
      }
      if (calculatorId === 'affiliate-commission') {
        return formatNumber(value)
      }
      return formatCurrency(value, locationData.currency)
    }
    if (calculatorId === 'calorie') {
      return `${formatNumber(value, 0)} kcal`
    }
    return formatNumber(value, 2)
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {getInputLabel()}{isFinancial ? ` (${locationData.currency})` : ''}
            </label>
            <div className="relative">
              {isFinancial && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  {locationData.currency === 'USD' ? '$' : locationData.currency}
                </span>
              )}
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(parseFloat(e.target.value) || 0)}
                className={`input-field w-full ${isFinancial ? 'pl-8' : ''}`}
              />
            </div>
          </div>

          {calculatorId === 'bmi' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Height (cm)
              </label>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(parseFloat(e.target.value) || 0)}
                className="input-field w-full"
              />
            </div>
          )}

          {isFinancial && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {roleData.name} average in {locationData.name}: {formatCurrency(defaultSalary, locationData.currency)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                State tax rate: {(locationData.stateTaxRate * 100).toFixed(1)}%
              </p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-primary/10 dark:bg-primary/20 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">{getResultLabel()}</p>
            <p className="text-2xl font-bold text-primary">
              {formatResult(results.mainResult as number || 0)}
            </p>
            {results.secondaryResult !== undefined && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {results.secondaryLabel}: {formatResult(results.secondaryResult as number)}
              </p>
            )}
          </div>
          {Object.keys(results).filter(k => k !== 'mainResult' && k !== 'secondaryResult' && k !== 'secondaryLabel').length > 0 && (
            <div className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(results)
                .filter(([key]) => key !== 'mainResult' && key !== 'secondaryResult' && key !== 'secondaryLabel')
                .slice(0, 4)
                .map(([key, value]) => (
                  <div key={key} className="bg-gray-50 dark:bg-gray-700 rounded p-2">
                    <span className="text-gray-600 dark:text-gray-400 text-xs">{key}</span>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {typeof value === 'number' ? formatResult(value) : value}
                    </p>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function calculateResults(calculatorId: string, inputValue: number, locationData: { stateTaxRate: number; costOfLiving: number }, heightCm: number = 170): Record<string, number | string> {
  switch (calculatorId) {
    case 'salary':
      const salaryNet = inputValue * (1 - 0.22 - locationData.stateTaxRate - 0.0765)
      return {
        mainResult: salaryNet / 12,
        secondaryResult: salaryNet,
        secondaryLabel: 'Annual',
        'Federal Tax': inputValue * 0.22,
        'State Tax': inputValue * locationData.stateTaxRate,
        'FICA': inputValue * 0.0765,
      }
    case 'tax':
      const taxTakeHome = inputValue * (1 - 0.15 - locationData.stateTaxRate)
      return {
        mainResult: taxTakeHome,
        'Effective Rate': (1 - taxTakeHome / inputValue) * 100,
        'Federal Tax': inputValue * 0.15,
        'State Tax': inputValue * locationData.stateTaxRate,
      }
    case 'mortgage':
      const monthlyRate = 0.0065
      const monthlyPayment = inputValue * monthlyRate * Math.pow(1 + monthlyRate, 360) / (Math.pow(1 + monthlyRate, 360) - 1)
      return {
        mainResult: monthlyPayment,
        secondaryResult: monthlyPayment * 360 - inputValue,
        secondaryLabel: 'Total Interest',
        'Down Payment': inputValue * 0.20,
        'Loan Amount': inputValue * 0.80,
      }
    case 'investment':
    case 'compound-interest':
      const futureValue = inputValue * Math.pow(1.08, 10)
      return {
        mainResult: futureValue,
        secondaryResult: futureValue - inputValue,
        secondaryLabel: 'Total Gain',
        'Growth Rate': 8,
        'Years': 10,
      }
    case 'loan':
    case 'loan-emi':
      const loanRate = 0.0075
      const emi = inputValue * loanRate * Math.pow(1 + loanRate, 60) / (Math.pow(1 + loanRate, 60) - 1)
      return {
        mainResult: emi,
        secondaryResult: emi * 60 - inputValue,
        secondaryLabel: 'Total Interest',
        'Rate': 9,
        'Term (months)': 60,
      }
    case 'retirement':
      const retirementValue = inputValue * Math.pow(1.07, 30)
      return {
        mainResult: retirementValue,
        secondaryResult: retirementValue * 0.04 / 12,
        secondaryLabel: 'Monthly Withdrawal',
        'Years to Retire': 30,
        'Safe Withdrawal': 4,
      }
    case 'currency':
      return {
        mainResult: inputValue * 0.85,
        secondaryResult: 0.85,
        secondaryLabel: 'Exchange Rate',
        'Base': 'EUR',
      }
    case 'bmi':
      const heightM = heightCm / 100
      const bmi = inputValue / (heightM * heightM)
      const category = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese'
      return {
        mainResult: bmi,
        'Category': category,
        'Height (cm)': heightCm,
      }
    case 'calorie':
      const bmr = 10 * inputValue + 6.25 * 175 - 5 * 30 + 5
      return {
        mainResult: bmr * 1.55,
        secondaryResult: bmr,
        secondaryLabel: 'BMR',
        'Activity': 'Moderate',
      }
    case 'freelance-rate':
      const hourly = inputValue / 2080 * 1.3
      return {
        mainResult: hourly,
        secondaryResult: hourly * 8,
        secondaryLabel: 'Daily Rate',
        'Billable Hours': 1500,
      }
    case 'roi':
      const roi = (inputValue * 1.15 - inputValue) / inputValue * 100
      return {
        mainResult: roi,
        'Gain': inputValue * 0.15,
        'Holding Period': '1 year',
      }
    case 'affiliate-commission':
      const revenue = inputValue * 0.05 * 0.02 * 50
      return {
        mainResult: revenue,
        secondaryResult: revenue * 12,
        secondaryLabel: 'Annual',
        'Conversion Rate': 2,
        'Avg Order': 50,
      }
    case 'cost-of-living':
      const equivalent = inputValue * (locationData.costOfLiving / 50000)
      return {
        mainResult: equivalent,
        secondaryResult: (equivalent / inputValue - 1) * 100,
        secondaryLabel: 'Difference',
        'COL Index': locationData.costOfLiving,
        'Base': 50000,
      }
    case 'crypto':
      const cryptoValue = inputValue * 1.5
      return {
        mainResult: cryptoValue,
        secondaryResult: cryptoValue - inputValue,
        secondaryLabel: 'Gain/Loss',
        'Change': 50,
      }
    case 'forex':
      return {
        mainResult: inputValue * 0.002,
        secondaryResult: 20,
        secondaryLabel: 'Pips',
        'Leverage': '1:100',
      }
    case 'contractor-income':
      const netIncome = inputValue * (1 - 0.153 - 0.15)
      return {
        mainResult: netIncome,
        secondaryResult: netIncome / 2000,
        secondaryLabel: 'Hourly Equivalent',
        'Self-Employment Tax': 15.3,
      }
    case 'pension':
      const pension = inputValue * 0.02 * 75000
      return {
        mainResult: pension / 12,
        secondaryResult: pension,
        secondaryLabel: 'Annual Pension',
        'Multiplier': 2,
        'Avg Salary': 75000,
      }
    case 'profit-margin':
      const margin = ((inputValue - inputValue * 0.6) / inputValue) * 100
      return {
        mainResult: margin,
        secondaryResult: inputValue * 0.4,
        secondaryLabel: 'Gross Profit',
        'COGS': inputValue * 0.6,
        'Operating': inputValue * 0.1,
      }
    default:
      return {
        mainResult: inputValue,
      }
  }
}
