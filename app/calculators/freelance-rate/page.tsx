'use client'

import React, { useState, useEffect } from 'react'
import CalculatorPageTemplate from '@/components/calculators/CalculatorPageTemplate'
import { calculateFreelanceRate, FreelanceInput, FreelanceResult } from '@/lib/calculations/freelance-rate'
import { formatCurrency, formatNumber } from '@/lib/utils/format'

export default function FreelanceRatePage() {
  const [inputs, setInputs] = useState<FreelanceInput>({
    desiredAnnualIncome: 120000,
    billableHoursPerWeek: 30,
    weeksPerYear: 48,
    expenses: 15000,
    taxRate: 30,
  })
  const [results, setResults] = useState<FreelanceResult | null>(null)

  useEffect(() => {
    const calculated = calculateFreelanceRate(inputs)
    setResults(calculated)
  }, [inputs])

  const handleInputChange = (field: keyof FreelanceInput, value: string | number) => {
    setInputs(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? parseFloat(value) || 0 : value,
    }))
  }

  const calculatorForm = (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Desired Annual Income (Take-Home)
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <input
            type="number"
            value={inputs.desiredAnnualIncome}
            onChange={(e) => handleInputChange('desiredAnnualIncome', e.target.value)}
            className="input-field pl-8"
            placeholder="120000"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Billable Hours Per Week
        </label>
        <input
          type="number"
          value={inputs.billableHoursPerWeek}
          onChange={(e) => handleInputChange('billableHoursPerWeek', e.target.value)}
          className="input-field"
          placeholder="30"
        />
        <p className="text-xs text-gray-500 mt-1">Remember: not all hours are billable</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Working Weeks Per Year
        </label>
        <input
          type="number"
          value={inputs.weeksPerYear}
          onChange={(e) => handleInputChange('weeksPerYear', e.target.value)}
          className="input-field"
          placeholder="48"
        />
        <p className="text-xs text-gray-500 mt-1">Account for vacation, sick days, holidays</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Annual Business Expenses
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <input
            type="number"
            value={inputs.expenses}
            onChange={(e) => handleInputChange('expenses', e.target.value)}
            className="input-field pl-8"
            placeholder="15000"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Estimated Tax Rate (%)
        </label>
        <div className="relative">
          <input
            type="number"
            value={inputs.taxRate}
            onChange={(e) => handleInputChange('taxRate', e.target.value)}
            className="input-field pr-8"
            placeholder="30"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">Include self-employment tax + income tax</p>
      </div>
    </div>
  )

  const resultsDisplay = results ? {
    mainResult: {
      label: 'Hourly Rate',
      value: `$${results.hourlyRate}`,
      subtext: `Monthly revenue: ${formatCurrency(results.monthlyRate)}`,
    },
    cards: [
      { label: 'Daily Rate', value: `$${results.dailyRate}`, color: '#2563EB' },
      { label: 'Weekly Rate', value: `$${results.weeklyRate}`, color: '#F59E0B' },
      { label: 'Eff. Hourly', value: `$${results.effectiveHourly}`, color: '#10B981' },
    ],
    barData: [
      { name: 'Hourly', value: results.hourlyRate },
      { name: 'Daily', value: results.dailyRate / 8 },
      { name: 'Effective', value: results.effectiveHourly },
    ],
    tableData: {
      headers: ['Rate Type', 'Amount'],
      rows: [
        ['Hourly Rate', `$${results.hourlyRate}`],
        ['Daily Rate (8hrs)', `$${results.dailyRate}`],
        ['Weekly Rate', `$${results.weeklyRate}`],
        ['Monthly Rate', formatCurrency(results.monthlyRate)],
        ['Small Project (~10hrs)', formatCurrency(results.projectRateLow)],
        ['Medium Project (~40hrs)', formatCurrency(results.projectRateMid)],
        ['Large Project (~100hrs)', formatCurrency(results.projectRateHigh)],
      ],
    },
  } : null

  return (
    <CalculatorPageTemplate
      id="freelance-rate"
      name="Freelance Rate Calculator"
      description="Calculate your optimal hourly rate based on income goals and expenses"
      path="/calculators/freelance-rate"
      heroContent="One of the most challenging aspects of freelancing is setting your rates. Charge too little and you can't sustain your business; charge too much and you might lose opportunities. Our Freelance Rate Calculator takes the guesswork out of pricing by considering your desired income, billable hours, expenses, and tax obligations. It shows you exactly what to charge per hour, per day, and per project to meet your financial goals while accounting for the realities of self-employment."
      calculatorForm={calculatorForm}
      results={resultsDisplay || {}}
      whatNumbersMean="The hourly rate is what you must charge to meet your income goal after taxes and expenses. Daily and weekly rates help for project pricing. Effective hourly rate shows what you actually earn per hour after expenses and taxes. Project rates provide starting points for small, medium, and large projects. Remember: not all working hours are billable—you'll spend time on admin, marketing, and non-paid work."
      whyItMatters="Properly calculated rates ensure your freelance business is sustainable. Many freelancers undercharge because they don't account for self-employment taxes (15.3%), business expenses, health insurance, and non-billable time. This calculator accounts for all these factors, showing you the true rate needed to achieve your income goals while running a viable business."
      howToUse={[
        "Enter your desired take-home annual income.",
        "Estimate your realistic billable hours per week (not total hours).",
        "Account for vacation, holidays, and sick days in working weeks.",
        "Add up your annual business expenses (software, equipment, etc).",
        "Include self-employment tax plus income tax in your estimated tax rate.",
      ]}
      faqItems={[
        { question: "Why are billable hours less than total hours?", answer: "Freelancers spend 20-40% of time on non-billable work: marketing, admin, bookkeeping, professional development. If you work 40 hours, expect 25-32 billable. This is normal and must be priced into your rate." },
        { question: "What is self-employment tax?", answer: "Self-employment tax covers both employer and employee portions of Social Security and Medicare at 15.3% (combined). W-2 employees pay half, employers pay half. You pay both portions as a freelancer." },
        { question: "How do I estimate business expenses?", answer: "Include software subscriptions, equipment, professional development, home office costs, marketing, insurance, accounting, and office supplies. Track actual expenses—many freelancers underestimate by 50% or more." },
        { question: "Should I charge hourly or by project?", answer: "Project billing often earns more than hourly because you capture efficiency gains. However, hourly protects against scope creep. Consider value-based pricing for strategic work—the rate should reflect value to client, not just your time." },
        { question: "How do I know if my rate is competitive?", answer: "Research rates on platforms like Upwork, Glassdoor, and industry surveys. Your rate should cover costs while being competitive. Don't compete solely on price—compete on value, expertise, and results." },
        { question: "When should I raise my rates?", answer: "Raise rates when: consistently fully booked, skills and experience grow, clients say yes too easily, or annually with inflation. Most freelancers should raise rates 10-20% annually until reaching market ceiling." },
        { question: "What if clients think my rate is too high?", answer: "Explain the value you provide. If they can't afford the market rate, they may not be an ideal client. Alternatively, offer smaller scopes or different deliverables rather than discounting your rate." },
        { question: "Should I have a minimum project rate?", answer: "Yes. Small projects have proportionally more admin overhead. A 2-hour project with 1 hour of admin should bill minimum at your hourly rate. Many freelancers set minimums of $500-$1,000." },
      ]}
    />
  )
}
