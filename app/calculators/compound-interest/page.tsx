'use client'

import React, { useState, useEffect } from 'react'
import CalculatorPageTemplate from '@/components/calculators/CalculatorPageTemplate'
import { calculateCompoundInterest, CompoundInterestInput, CompoundInterestResult } from '@/lib/calculations/compound-interest'
import { formatCurrency, formatPercent } from '@/lib/utils/format'

export default function CompoundInterestPage() {
  const [inputs, setInputs] = useState<CompoundInterestInput>({
    principal: 10000,
    annualRate: 7,
    years: 20,
    compoundFrequency: 'monthly',
    monthlyContribution: 200,
  })
  const [results, setResults] = useState<CompoundInterestResult | null>(null)

  useEffect(() => {
    const calculated = calculateCompoundInterest(inputs)
    setResults(calculated)
  }, [inputs])

  const handleInputChange = (field: keyof CompoundInterestInput, value: string | number) => {
    setInputs(prev => ({
      ...prev,
      [field]: typeof value === 'string' && field !== 'compoundFrequency'
        ? parseFloat(value) || 0
        : value,
    }))
  }

  const calculatorForm = (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Initial Principal
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <input
            type="number"
            value={inputs.principal}
            onChange={(e) => handleInputChange('principal', e.target.value)}
            className="input-field pl-8"
            placeholder="10000"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Annual Interest Rate (%)
        </label>
        <div className="relative">
          <input
            type="number"
            step="0.1"
            value={inputs.annualRate}
            onChange={(e) => handleInputChange('annualRate', e.target.value)}
            className="input-field pr-8"
            placeholder="7"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Compound Frequency
        </label>
        <select
          value={inputs.compoundFrequency}
          onChange={(e) => handleInputChange('compoundFrequency', e.target.value as 'daily' | 'monthly' | 'quarterly' | 'annually')}
          className="input-field"
        >
          <option value="daily">Daily</option>
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="annually">Annually</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Monthly Contribution (Optional)
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <input
            type="number"
            value={inputs.monthlyContribution}
            onChange={(e) => handleInputChange('monthlyContribution', e.target.value)}
            className="input-field pl-8"
            placeholder="200"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Investment Period (years)
        </label>
        <input
          type="number"
          value={inputs.years}
          onChange={(e) => handleInputChange('years', e.target.value)}
          className="input-field"
          placeholder="20"
        />
      </div>
    </div>
  )

  const resultsDisplay = results ? {
    mainResult: {
      label: 'Final Balance',
      value: formatCurrency(results.finalBalance),
      subtext: `Effective Rate: ${formatPercent(results.effectiveRate)}`,
    },
    cards: [
      { label: 'Principal', value: formatCurrency(results.principal), color: '#2563EB' },
      { label: 'Contributions', value: formatCurrency(results.totalContributions), color: '#F59E0B' },
      { label: 'Interest Earned', value: formatCurrency(results.totalInterest), color: '#10B981' },
    ],
    lineData: results.yearlyBreakdown ? results.yearlyBreakdown.map(y => ({
      name: `Year ${y.year}`,
      value: y.endBalance,
    })) : [],
    barData: [
      { name: 'Principal', value: results.principal },
      { name: 'Contributions', value: results.totalContributions },
      { name: 'Interest', value: results.totalInterest },
    ],
    tableData: {
      headers: ['Year', 'Start', 'Contributions', 'Interest', 'End'],
      rows: results.yearlyBreakdown ? results.yearlyBreakdown.slice(0, 10).map(y => [
        `Year ${y.year}`,
        formatCurrency(y.startBalance),
        formatCurrency(y.contributions),
        formatCurrency(y.interest),
        formatCurrency(y.endBalance),
      ]) : [],
    },
  } : null

  return (
    <CalculatorPageTemplate
      id="compound-interest"
      name="Compound Interest Calculator"
      description="See how compound interest grows your money over time"
      path="/calculators/compound-interest"
      heroContent="Albert Einstein reportedly called compound interest the 'eighth wonder of the world'—and for good reason. Compound interest is the mathematical force that turns modest savings into substantial wealth over time. Unlike simple interest, which only earns returns on your principal, compound interest earns returns on your returns, creating exponential growth. This calculator shows you exactly how powerful compounding can be, helping you visualize how different rates, frequencies, and time horizons affect your wealth building."
      calculatorForm={calculatorForm}
      results={resultsDisplay || {}}
      whatNumbersMean="Your final balance shows the total after compound growth—including your original principal, any contributions, and all accumulated interest. The effective rate shows what your annual return really is after accounting for compounding frequency—more frequent compounding means a higher effective rate. Total interest represents pure profit: everything you earned beyond what you put in. The yearly breakdown reveals how growth accelerates over time."
      whyItMatters="Understanding compound interest is fundamental to all long-term investing and saving decisions. It explains why starting early is so valuable—more time for compounding means exponentially more growth. It shows why high-yield savings accounts matter over traditional ones. Most importantly, it demonstrates that contributions in early years are worth far more than later ones because they have longer to compound."
      howToUse={[
        "Enter your initial investment amount (principal).",
        "Set the annual interest rate you expect to earn.",
        "Choose how often interest compounds—more frequent is better.",
        "Optionally add monthly contributions to see their impact.",
        "Set your time horizon and see how wealth grows exponentially.",
      ]}
      faqItems={[
        { question: 'What is compound interest vs simple interest?', answer: 'Simple interest calculates returns only on your original principal. Compound interest calculates returns on both principal AND accumulated interest. Over long periods, this difference becomes dramatic—$10,000 at 7% for 30 years yields $76,123 with compounding vs just $16,000 with simple interest.' },
        { question: 'How does compounding frequency matter?', answer: 'More frequent compounding means more growth. Daily compounding beats monthly, which beats annually. However, the difference shrinks at higher frequencies—a 7% rate becomes 7.25% effective with daily compounding. Still, over decades, this adds up.' },
        { question: 'Why is starting early so important?', answer: 'Time amplifies compound growth. $10,000 invested at age 25 grows to $76,000 by 55 (at 7%). Start at 35 and you only have $38,000. That 10-year head start nearly doubles your outcome because the early years have longest time to compound.' },
        { question: 'What is the Rule of 72?', answer: 'The Rule of 72 estimates how long it takes money to double: divide 72 by your rate. At 7%, money doubles in about 10.3 years. At 10%, it takes 7.2 years. This is a quick mental math tool for understanding compound growth.' },
        { question: 'How does the effective annual rate work?', answer: 'The effective annual rate (EAR) shows your true annual return including compound effects. A 6% rate compounded daily yields about 6.18% EAR. APY on savings accounts is an effective rate—the actual return you receive.' },
        { question: 'Should I focus on rate or time?', answer: 'Both matter, but time gives more predictable results. Higher rates require either more risk or better investments—things you can't fully control. Time simply requires patience. If you can't increase your rate, maximize your time by starting now.' },
        { question: 'What about compound interest on loans?', answer: 'Compound interest works against you with loans. Credit cards compound daily, which is why debt grows so fast. Understanding this explains why paying off high-interest debt is essentially a guaranteed high-return investment.' },
        { question: 'How can I maximize compound interest?', answer: 'Start as early as possible, contribute regularly, seek reasonable returns without excessive risk, minimize withdrawals, and choose accounts/situations with frequent compounding. The combination of regular contributions plus time is powerful.' },
      ]}
    />
  )
}
