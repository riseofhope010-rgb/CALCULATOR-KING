'use client'

import { useState, useEffect } from 'react'
import CalculatorPageTemplate from '@/components/calculators/CalculatorPageTemplate'
import { calculateRetirement, RetirementInput, RetirementResult } from '@/lib/calculations/retirement'
import { formatCurrency } from '@/lib/utils/format'

export default function RetirementCalculatorPage() {
  const [inputs, setInputs] = useState<RetirementInput>({
    currentAge: 35,
    retirementAge: 65,
    currentSavings: 50000,
    monthlyContribution: 500,
    expectedReturn: 7,
    socialSecurity: 2000,
    retirementExpenses: 5000,
  })
  const [results, setResults] = useState<RetirementResult | null>(null)

  useEffect(() => {
    const calculated = calculateRetirement(inputs)
    setResults(calculated)
  }, [inputs])

  const handleInputChange = (field: keyof RetirementInput, value: string | number) => {
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
            placeholder="35"
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
          Current Retirement Savings
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <input
            type="number"
            value={inputs.currentSavings}
            onChange={(e) => handleInputChange('currentSavings', e.target.value)}
            className="input-field pl-8"
            placeholder="50000"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Monthly Contribution
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <input
            type="number"
            value={inputs.monthlyContribution}
            onChange={(e) => handleInputChange('monthlyContribution', e.target.value)}
            className="input-field pl-8"
            placeholder="500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Expected Annual Return (%)
        </label>
        <div className="relative">
          <input
            type="number"
            step="0.5"
            value={inputs.expectedReturn}
            onChange={(e) => handleInputChange('expectedReturn', e.target.value)}
            className="input-field pr-8"
            placeholder="7"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Expected Monthly Social Security
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <input
            type="number"
            value={inputs.socialSecurity}
            onChange={(e) => handleInputChange('socialSecurity', e.target.value)}
            className="input-field pl-8"
            placeholder="2000"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Expected Monthly Expenses in Retirement
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <input
            type="number"
            value={inputs.retirementExpenses}
            onChange={(e) => handleInputChange('retirementExpenses', e.target.value)}
            className="input-field pl-8"
            placeholder="5000"
          />
        </div>
      </div>
    </div>
  )

  const resultsDisplay = results ? {
    mainResult: {
      label: 'Projected Retirement Savings',
      value: formatCurrency(results.projectedSavings),
      subtext: `At age ${inputs.retirementAge}`,
    },
    cards: [
      { label: 'Years to Retirement', value: results.yearsToRetirement, color: '#2563EB' },
      { label: 'Monthly Retirement Income', value: formatCurrency(results.totalMonthlyRetirement), color: '#10B981' },
      { label: 'Years Savings Last', value: results.yearsSavingsWillLast, color: '#F59E0B' },
    ],
    lineData: results.yearlyBreakdown.map(y => ({
      name: `Age ${y.age}`,
      value: y.balance,
    })),
    barData: [
      { name: 'Starting', value: inputs.currentSavings },
      { name: 'Contributions', value: results.totalContributions },
      { name: 'Growth', value: results.projectedSavings - inputs.currentSavings - results.totalContributions },
    ],
  } : null

  return (
    <CalculatorPageTemplate
      id="retirement"
      name="Retirement Calculator"
      description="Plan your retirement savings and see if you're on track"
      path="/calculators/retirement"
      heroContent="Planning for retirement can feel overwhelming, but understanding whether you're on track is essential for financial security in your later years. Our Retirement Calculator helps you project how much you'll have saved by retirement age, what monthly income that provides, and whether it will last through your retirement years. By considering your current savings, planned contributions, expected returns, Social Security benefits, and projected expenses, this calculator gives you a realistic picture of your retirement readiness and helps identify if adjustments are needed."
      calculatorForm={calculatorForm}
      results={resultsDisplay || {}}
      whatNumbersMean="Your projected savings shows what you'll have accumulated by retirement based on your inputs. Monthly retirement income comes from two sources: your savings (using the 4% safe withdrawal rule) plus Social Security. Years savings will last estimates how long your money will cover expenses—infinite means your income exceeds expenses; a finite number indicates you may outlive your savings. A shortfall signals your income won't cover expected expenses."
      whyItMatters="Retirement planning is about ensuring you can maintain your lifestyle when you no longer work. Many people underestimate how much they need or overestimate how long their savings will last. Understanding your trajectory now gives you time to adjust—increase contributions, delay retirement, reduce planned expenses, or optimize investments. The earlier you identify a gap, the easier it is to close with small adjustments."
      howToUse={[
        "Enter your current age and target retirement age.",
        "Input your total current retirement savings across all accounts.",
        "Specify how much you contribute monthly to retirement accounts.",
        "Set your expected investment return (7% is historically reasonable for stocks).",
        "Add expected Social Security and monthly expenses to see if savings will last.",
      ]}
      faqItems={[
        { question: 'What is the 4% withdrawal rule?', answer: 'The 4% rule suggests withdrawing 4% of your portfolio in your first year of retirement, then adjusting for inflation annually. Historically, this has provided a high probability of savings lasting 30 years. However, many experts now suggest 3-3.5% for greater safety.' },
        { question: 'How much do I need to retire?', answer: 'A common guideline is 10-12x your final salary. For a $100,000 income, that is $1-1.2 million. However, your actual need depends on expenses, lifestyle, healthcare costs, location, and other income sources like Social Security or pensions.' },
        { question: 'When should I start saving for retirement?', answer: 'As early as possible. Due to compound interest, starting at 25 versus 35 can mean hundreds of thousands more by retirement. Even small amounts early grow significantly over decades. Time is more valuable than amount when starting out.' },
        { question: 'How does Social Security factor in?', answer: 'Social Security replaces about 40% of pre-retirement income for average earners. Benefits depend on your earnings history and age when you claim—waiting until 70 increases benefits by 76% compared to claiming at 62. Plan to bridge the gap between expenses and Social Security with savings.' },
        { question: 'What if I have a gap between income and expenses?', answer: 'Options include: save more now, work longer, reduce retirement expenses, delay Social Security for higher benefits, optimize investment returns, or consider part-time work in early retirement. Small adjustments now can have big impacts over time.' },
        { question: 'Should I include my home in retirement calculations?', answer: 'Your home is an asset but not easily converted to income. Options include downsizing, reverse mortgage, or rental income. For most calculations, focus on liquid savings and consider home equity as a backup or legacy asset.' },
        { question: 'What about healthcare costs?', answer: 'Healthcare is often the largest retirement expense. Medicare covers most costs after 65, but you will still pay premiums, deductibles, and things Medicare does not cover. Budget $300,000+ per couple for healthcare in retirement, more if health is poor.' },
        { question: 'How often should I check my retirement progress?', answer: 'Review annually and after major life changes. Rebalance investments periodically. As you approach retirement, start planning income strategies and tax optimization. Regular monitoring keeps you on track and identifies problems early.' },
      ]}
    />
  )
}
