'use client'

import React, { useState, useEffect } from 'react'
import CalculatorPageTemplate from '@/components/calculators/CalculatorPageTemplate'
import { calculatePension, PensionInput, PensionResult } from '@/lib/calculations/pension'
import { formatCurrency, formatPercent } from '@/lib/utils/format'

export default function PensionCalculatorPage() {
  const [inputs, setInputs] = useState<PensionInput>({
    currentAge: 55,
    retirementAge: 65,
    yearsOfService: 20,
    averageSalary: 80000,
    pensionFormula: 1.5,
    survivorBenefit: false,
    COLA: true,
  })
  const [results, setResults] = useState<PensionResult | null>(null)

  useEffect(() => {
    const calculated = calculatePension(inputs)
    setResults(calculated)
  }, [inputs])

  const handleInputChange = (field: keyof PensionInput, value: string | number | boolean) => {
    setInputs(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? parseFloat(value) || 0 : value,
    }))
  }

  const calculatorForm = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Current Age
          </label>
          <input
            type="number"
            value={inputs.currentAge}
            onChange={(e) => handleInputChange('currentAge', e.target.value)}
            className="input-field"
            placeholder="55"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Retirement Age
          </label>
          <input
            type="number"
            value={inputs.retirementAge}
            onChange={(e) => handleInputChange('retirementAge', e.target.value)}
            className="input-field"
            placeholder="65"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Years of Service (to date)
        </label>
        <input
          type="number"
          value={inputs.yearsOfService}
          onChange={(e) => handleInputChange('yearsOfService', e.target.value)}
          className="input-field"
          placeholder="20"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Average High Salary
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <input
            type="number"
            value={inputs.averageSalary}
            onChange={(e) => handleInputChange('averageSalary', e.target.value)}
            className="input-field pl-8"
            placeholder="80000"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">Usually highest 3-5 years average</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Pension Multiplier (% per year of service)
        </label>
        <div className="relative">
          <input
            type="number"
            step="0.1"
            value={inputs.pensionFormula}
            onChange={(e) => handleInputChange('pensionFormula', e.target.value)}
            className="input-field pr-8"
            placeholder="1.5"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">Typical: 1.5-2.5% per year</p>
      </div>

      <div className="space-y-3">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={inputs.survivorBenefit}
            onChange={(e) => handleInputChange('survivorBenefit', e.target.checked)}
            className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Include Survivor Benefit (reduces pension ~15%)
          </span>
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={inputs.COLA}
            onChange={(e) => handleInputChange('COLA', e.target.checked)}
            className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Cost of Living Adjustment (COLA)
          </span>
        </label>
      </div>
    </div>
  )

  const resultsDisplay = results ? {
    mainResult: {
      label: 'Monthly Pension',
      value: formatCurrency(results.monthlyPension),
      subtext: `${formatCurrency(results.annualPension)}/year`,
    },
    cards: [
      { label: 'Replacement Ratio', value: formatPercent(results.replacementRatio), color: '#2563EB' },
      { label: 'Years to Retirement', value: `${results.yearsToRetirement}`, color: '#F59E0B' },
      { label: 'Vesting Status', value: results.vestingStatus, color: '#10B981' },
    ],
    lineData: results.projectedGrowth.map(p => ({
      name: `Age ${p.age}`,
      value: p.monthlyPension,
    })),
    tableData: {
      headers: ['Age', 'Years Service', 'Monthly Pension'],
      rows: results.projectedGrowth.slice(0, Math.min(10, results.projectedGrowth.length)).map(p => [
        p.age,
        p.yearsOfService,
        formatCurrency(p.monthlyPension),
      ]),
    },
  } : null

  return (
    <CalculatorPageTemplate
      id="pension"
      name="Pension Calculator"
      description="Estimate your pension benefits at retirement"
      path="/calculators/pension"
      heroContent="Pensions remain one of the most valuable retirement benefits, providing guaranteed income for life. However, understanding your actual pension benefit can be complex due to varying formulas, vesting rules, and early retirement reductions. Our Pension Calculator helps you estimate your monthly pension based on your years of service, salary, and plan formula. It also shows projected growth if you continue working and calculates your replacement ratio to help you plan additional retirement savings."
      calculatorForm={calculatorForm}
      results={resultsDisplay || {}}
      whatNumbersMean="Monthly pension is your estimated lifetime benefit at retirement. Annual pension is the yearly amount. Replacement ratio shows what percentage of your working salary the pension replaces—a key retirement planning metric. Vesting status indicates your right to benefits. Years to retirement helps plan other savings. The growth projection shows how staying longer increases your benefit."
      whyItMatters="Pension planning is crucial for retirement security. Understanding your projected benefit helps you determine if additional savings (401k, IRA) are needed. Most financial advisors recommend 70-80% income replacement—pensions rarely provide enough alone. This calculator helps you see the value of additional service years and make informed decisions about early retirement options."
      howToUse={[
        "Enter your current age and planned retirement age.",
        "Input your years of service completed so far.",
        "Enter your average high salary (typically highest 3-5 years).",
        "Set your plan's multiplier (check your plan documents).",
        "Include survivor benefit option if you want coverage for your spouse.",
      ]}
      faqItems={[
        { question: "How is pension calculated?", answer: "Most defined benefit pensions use a formula: Years of Service × Multiplier × Average Salary. For example, 30 years × 1.5% × $80,000 = $36,000 annual pension. Some plans use final salary, others average highest years." },
        { question: "What is vesting?", answer: "Vesting means you have earned the right to your pension. Plans typically require 5-7 years for full vesting. If you leave before vesting, you may lose pension benefits. Vested benefits are yours even if you leave the employer." },
        { question: "What is a survivor benefit?", answer: "A survivor (joint and survivor) benefit provides continued payments to your spouse after your death. It typically reduces your monthly pension by 10-15% but ensures your spouse receives a percentage (often 50-75%) of your benefit." },
        { question: "What is a typical pension multiplier?", answer: "Multipliers vary widely: private sector often 1.0-1.5%, public sector (teachers, police, government) often 2.0-2.5%. Higher multipliers mean larger pensions but are less common in today's landscape." },
        { question: "How does early retirement affect my pension?", answer: "Early retirement usually reduces your benefit. Plans often apply reduction factors for each year before normal retirement age (typically 65). A 5% reduction per year early equals 25% less at age 60 versus age 65." },
        { question: "Should I take a lump sum or monthly pension?", answer: "This depends on many factors: your health, other income, investment ability, spouse needs, and inflation concerns. Lump sums offer flexibility but transfer investment risk to you. Monthly payments guarantee lifetime income but may not keep pace with inflation." },
        { question: "How does COLA work?", answer: "Cost of Living Adjustments increase your pension annually with inflation. Not all plans offer COLA—those that do typically use CPI increases. Without COLA, inflation erodes your purchasing power over time." },
        { question: "What if I change jobs?", answer: "Vested pensions remain yours. Options: leave it with the employer (they will pay at retirement), roll to an IRA (if lump sum offered), or transfer to new employer's plan (rare). Leaving it in place usually means waiting until retirement age to collect." },
      ]}
    />
  )
}
