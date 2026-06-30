'use client'

import { useState, useEffect } from 'react'
import CalculatorPageTemplate from '@/components/calculators/CalculatorPageTemplate'
import { calculateSalary, SalaryInput, SalaryResult } from '@/lib/calculations/salary'
import { formatCurrency, formatPercent } from '@/lib/utils/format'
import { US_STATES, FILING_STATUSES } from '@/lib/constants'

export default function SalaryCalculatorPage() {
  const [inputs, setInputs] = useState<SalaryInput>({
    grossSalary: 75000,
    state: 'CA',
    filingStatus: 'single',
    dependents: 0,
    retirement401k: 0,
  })
  const [results, setResults] = useState<SalaryResult | null>(null)

  useEffect(() => {
    const calculated = calculateSalary(inputs)
    setResults(calculated)
  }, [inputs])

  const handleInputChange = (field: keyof SalaryInput, value: string | number) => {
    setInputs(prev => ({
      ...prev,
      [field]: typeof value === 'string' && field !== 'state' && field !== 'filingStatus'
        ? parseFloat(value) || 0
        : value,
    }))
  }

  const calculatorForm = (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Gross Annual Salary
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <input
            type="number"
            value={inputs.grossSalary}
            onChange={(e) => handleInputChange('grossSalary', e.target.value)}
            className="input-field pl-8"
            placeholder="75000"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          State
        </label>
        <select
          value={inputs.state}
          onChange={(e) => handleInputChange('state', e.target.value)}
          className="input-field"
        >
          {US_STATES.map(state => (
            <option key={state.code} value={state.code}>{state.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Filing Status
        </label>
        <select
          value={inputs.filingStatus}
          onChange={(e) => handleInputChange('filingStatus', e.target.value as 'single' | 'married' | 'headOfHousehold')}
          className="input-field"
        >
          {FILING_STATUSES.map(status => (
            <option key={status.value} value={status.value}>{status.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          401(k) Contribution
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <input
            type="number"
            value={inputs.retirement401k}
            onChange={(e) => handleInputChange('retirement401k', e.target.value)}
            className="input-field pl-8"
            placeholder="0"
          />
        </div>
      </div>
    </div>
  )

  const resultsDisplay = results ? {
    mainResult: {
      label: 'Net Monthly Take-Home',
      value: formatCurrency(results.netMonthly),
      subtext: `${formatCurrency(results.netAnnual)} annually`,
    },
    cards: [
      { label: 'Federal Tax', value: formatCurrency(results.federalTax), color: '#EF4444' },
      { label: 'State Tax', value: formatCurrency(results.stateTax), color: '#F59E0B' },
      { label: 'Social Security', value: formatCurrency(results.socialSecurity), color: '#8B5CF6' },
      { label: 'Medicare', value: formatCurrency(results.medicare), color: '#EC4899' },
    ],
    pieData: [
      { name: 'Net Income', value: results.netAnnual, color: '#10B981' },
      { name: 'Federal Tax', value: results.federalTax, color: '#EF4444' },
      { name: 'State Tax', value: results.stateTax, color: '#F59E0B' },
      { name: 'Social Security', value: results.socialSecurity, color: '#8B5CF6' },
      { name: 'Medicare', value: results.medicare, color: '#EC4899' },
    ],
    barData: [
      { name: 'Monthly', value: results.netMonthly },
      { name: 'Bi-Weekly', value: results.netBiweekly },
    ],
    tableData: {
      headers: ['Category', 'Annual', 'Monthly'],
      rows: [
        ['Gross Salary', formatCurrency(results.grossAnnual), formatCurrency(results.grossMonthly)],
        ['Federal Tax', formatCurrency(results.federalTax), formatCurrency(results.federalTax / 12)],
        ['State Tax', formatCurrency(results.stateTax), formatCurrency(results.stateTax / 12)],
        ['Social Security', formatCurrency(results.socialSecurity), formatCurrency(results.socialSecurity / 12)],
        ['Medicare', formatCurrency(results.medicare), formatCurrency(results.medicare / 12)],
        ['Total Deductions', formatCurrency(results.totalDeductions), formatCurrency(results.totalDeductions / 12)],
        ['Net Income', formatCurrency(results.netAnnual), formatCurrency(results.netMonthly)],
      ],
    },
  } : null

  return (
    <CalculatorPageTemplate
      id="salary"
      name="Salary Calculator"
      description="Calculate your take-home pay after federal, state, and FICA taxes"
      path="/calculators/salary"
      heroContent="Understanding your true take-home pay is crucial for budgeting and financial planning. Many employees are surprised to see how much of their gross salary goes to taxes and deductions. Our Salary Calculator helps you see exactly where your money goes by breaking down federal income tax, state tax, Social Security, Medicare, and other deductions from your paycheck. Whether you're negotiating a new job offer, considering a move to a different state, or simply want to understand your current compensation better, this calculator provides accurate estimates based on current 2024 tax rates and regulations. Enter your gross salary and see your actual monthly and annual take-home pay instantly."
      calculatorForm={calculatorForm}
      results={resultsDisplay || {}}
      whatNumbersMean="Your net income represents the money you actually receive after all mandatory deductions. Federal income tax is calculated using progressive tax brackets, meaning higher earners pay a higher percentage on their last dollars earned. State tax varies significantly by location—some states like Texas and Florida have no state income tax, while others like California have rates over 9%. Social Security tax is 6.2% of your wages up to $168,600, while Medicare is 1.45% with no income limit. Your effective tax rate shows what percentage of your total income goes to taxes, which is often lower than people expect due to deductions and the progressive nature of tax brackets."
      whyItMatters="Knowing your true take-home pay enables smarter financial decisions. When evaluating job offers, you need to compare net salaries, not just gross figures—especially across different states with varying tax rates. Understanding your tax withholding helps you avoid surprises at tax time and adjust your W-4 if needed. This knowledge also helps with budgeting since you'll know exactly how much money hits your bank account each pay period. For those considering 401(k) contributions, you can see how pre-tax deductions reduce your taxable income and potentially lower your overall tax burden."
      howToUse={[
        "Enter your gross annual salary (the total amount before any deductions).",
        "Select your state of residence from the dropdown menu.",
        "Choose your tax filing status based on your marital situation.",
        "Enter any 401(k) or retirement contributions you plan to make.",
        "Review the detailed breakdown showing all deductions and your net pay.",
      ]}
      faqItems={[
        { question: 'How is federal income tax calculated?', answer: 'Federal income tax uses a progressive bracket system where different portions of your income are taxed at different rates. For 2024, single filers pay 10% on the first $11,600, 12% on income from $11,601 to $47,150, 22% up to $100,525, 24% up to $191,950, 32% up to $241,725, 35% up to $609,350, and 37% on income above that. The standard deduction of $14,600 (single) reduces your taxable income.' },
        { question: 'What is FICA tax?', answer: 'FICA stands for Federal Insurance Contributions Act, which funds Social Security and Medicare. Employees pay 6.2% for Social Security (wage base limit of $168,600 in 2024) and 1.45% for Medicare with no wage limit. Employers match these contributions, bringing the total to 15.3% of wages.' },
        { question: 'Why do I pay different state taxes?', answer: 'Each state sets its own income tax rates and brackets. Some states like Texas, Florida, and Washington have no state income tax. Others like California and New York have progressive rates reaching over 10%. Your state tax affects your overall take-home pay significantly.' },
        { question: 'How does 401(k) contribution affect my taxes?', answer: 'Traditional 401(k) contributions are made pre-tax, reducing your taxable income. For example, contributing $10,000 to your 401(k) could save you $2,200 in federal taxes if you are in the 22% bracket. This reduces your current tax bill while building retirement savings.' },
        { question: 'What is the difference between gross and net salary?', answer: 'Gross salary is your total earnings before any deductions. Net salary (take-home pay) is what remains after federal tax, state tax, Social Security, Medicare, and any other deductions like health insurance or retirement contributions are subtracted.' },
        { question: 'Are these calculations accurate for my situation?', answer: 'These calculations provide a solid estimate based on 2024 tax rates and standard deductions. Actual taxes may vary based on itemized deductions, tax credits, additional income sources, and other factors. Always consult a tax professional for personalized advice.' },
        { question: 'What is an effective tax rate?', answer: 'Your effective tax rate is the total tax you pay divided by your gross income. This is often lower than your marginal (highest bracket) rate because of progressive brackets and deductions. It shows your true overall tax burden as a percentage.' },
        { question: 'How often should I recalculate my salary breakdown?', answer: 'Recalculate whenever you have a significant life change: new job, salary raise, relocation to a different state, marriage, or changes to retirement contributions. Also review annually when tax rates and brackets are updated.' },
      ]}
    />
  )
}
