'use client'

import React, { useState, useEffect } from 'react'
import CalculatorPageTemplate from '@/components/calculators/CalculatorPageTemplate'
import { calculateContractorIncome, ContractorInput, ContractorResult } from '@/lib/calculations/contractor'
import { formatCurrency, formatPercent } from '@/lib/utils/format'

export default function ContractorIncomePage() {
  const [inputs, setInputs] = useState<ContractorInput>({
    hourlyRate: 85,
    hoursPerWeek: 40,
    weeksPerYear: 48,
    businessExpenses: 8000,
    healthInsurance: 12000,
    retirementContribution: 10000,
  })
  const [results, setResults] = useState<ContractorResult | null>(null)

  useEffect(() => {
    const calculated = calculateContractorIncome(inputs)
    setResults(calculated)
  }, [inputs])

  const handleInputChange = (field: keyof ContractorInput, value: string | number) => {
    setInputs(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? parseFloat(value) || 0 : value,
    }))
  }

  const calculatorForm = (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Hourly Rate
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <input
            type="number"
            value={inputs.hourlyRate}
            onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
            className="input-field pl-8"
            placeholder="85"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Hours/Week
          </label>
          <input
            type="number"
            value={inputs.hoursPerWeek}
            onChange={(e) => handleInputChange('hoursPerWeek', e.target.value)}
            className="input-field"
            placeholder="40"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Weeks/Year
          </label>
          <input
            type="number"
            value={inputs.weeksPerYear}
            onChange={(e) => handleInputChange('weeksPerYear', e.target.value)}
            className="input-field"
            placeholder="48"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Annual Business Expenses
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <input
            type="number"
            value={inputs.businessExpenses}
            onChange={(e) => handleInputChange('businessExpenses', e.target.value)}
            className="input-field pl-8"
            placeholder="8000"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">Equipment, software, professional services</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Health Insurance (Annual)
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <input
            type="number"
            value={inputs.healthInsurance}
            onChange={(e) => handleInputChange('healthInsurance', e.target.value)}
            className="input-field pl-8"
            placeholder="12000"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Retirement Contribution
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <input
            type="number"
            value={inputs.retirementContribution}
            onChange={(e) => handleInputChange('retirementContribution', e.target.value)}
            className="input-field pl-8"
            placeholder="10000"
          />
        </div>
      </div>
    </div>
  )

  const resultsDisplay = results ? {
    mainResult: {
      label: 'Net Annual Income',
      value: formatCurrency(results.netIncome),
      subtext: `${formatCurrency(results.monthlyIncome)}/month`,
    },
    cards: [
      { label: 'Gross Revenue', value: formatCurrency(results.grossAnnualIncome), color: '#2563EB' },
      { label: 'W-2 Equivalent', value: formatCurrency(results.w2EquivalentSalary), color: '#10B981' },
      { label: 'Eff. Hourly', value: `$${results.effectiveHourlyRate}`, color: '#F59E0B' },
    ],
    barData: [
      { name: 'Gross', value: results.grossAnnualIncome },
      { name: 'Net', value: results.netIncome },
      { name: 'W-2 Equiv.', value: results.w2EquivalentSalary },
    ],
    tableData: {
      headers: ['Item', 'Annual'],
      rows: [
        ['Gross Revenue', formatCurrency(results.grossAnnualIncome)],
        ['Self-Employment Tax', formatCurrency(results.selfEmploymentTax)],
        ['Estimated Income Tax', formatCurrency(results.estimatedTaxes)],
        ['Business Expenses', formatCurrency(inputs.businessExpenses)],
        ['Health Insurance', formatCurrency(results.benefits.healthInsurance)],
        ['Retirement', formatCurrency(results.benefits.retirement)],
        ['Total Deductions', formatCurrency(results.totalExpenses)],
        ['Net Income', formatCurrency(results.netIncome)],
      ],
    },
  } : null

  return (
    <CalculatorPageTemplate
      id="contractor-income"
      name="Contractor Income Calculator"
      description="Compare 1099 contractor income to W-2 employment"
      path="/calculators/contractor-income"
      heroContent="The decision between contractor (1099) and employee (W-2) work involves complex financial trade-offs. Contractors typically earn higher hourly rates but must cover self-employment taxes, health insurance, retirement, and business expenses. Our Contractor Income Calculator provides a complete picture, showing your true net income and comparing it to an equivalent W-2 salary."
      calculatorForm={calculatorForm}
      results={resultsDisplay || {}}
      whatNumbersMean="Gross revenue is your total earnings before any deductions. Self-employment tax covers both employer and employee portions of FICA. Net income is what you actually keep after all taxes and expenses. W-2 equivalent shows what salary would provide a similar total compensation package including typical employer benefits."
      whyItMatters="Many people choose contracting without understanding the true costs. Self-employment tax alone is 15.3%. Health insurance for a family can exceed $1,000/month. Understanding these numbers helps you set rates that actually compensate for these expenses."
      howToUse={[
        "Enter your contracted hourly rate.",
        "Input realistic billable hours per week and weeks per year.",
        "Estimate your annual business expenses (software, equipment, etc).",
        "Add your health insurance costs.",
        "Include retirement contributions to compare fully.",
      ]}
  faqItems={[
        { question: "What is self-employment tax?", answer: "Self-employment tax covers both employer and employee portions of Social Security (12.4%) and Medicare (2.9%)—total 15.3%. W-2 employees pay half (7.65%), employers pay the other half. As a contractor, you pay both." },
        { question: "Why is my effective hourly rate lower?", answer: "Effective rate accounts for unpaid time (admin, marketing, training), taxes, and expenses. If you bill $100/hr but only 30 of 40 hours are billable, that's effectively $75/hr. Add taxes and expenses, and effective rate drops further." },
        { question: "What benefits do W-2 employees get?", answer: "Employers typically provide: health insurance (often 80%+ paid), retirement matching, paid time off, sick leave, disability insurance, life insurance, and professional development. W-2 also have unemployment insurance and workers comp." },
        { question: "How much higher should my contractor rate be?", answer: "A rule of thumb: add 30-50% to a W-2 salary's equivalent hourly rate (salary / 2080). This covers self-employment tax (15.3%), benefits (20-30%), and risk premium. For $100K salary, target $70-80/hr minimum as contractor." },
        { question: "Can I deduct business expenses?", answer: "Yes, business expenses reduce taxable income: home office, equipment, software, professional development, travel, marketing. Keep detailed records. Health insurance premiums are also deductible above the line." },
        { question: "What about retirement as a contractor?", answer: "Contractors can use SEP-IRA (up to 25% income, capped), Solo 401(k) (up to $66,000 in 2023), or SIMPLE IRA. These often offer higher limits than W-2 401(k)s. Plan for this in your rate calculations." },
        { question: "Is it better to be W-2 or 1099?", answer: "It depends on your situation. W-2 offers stability, benefits, and less admin. 1099 offers flexibility, higher gross earning potential, and autonomy. Consider your risk tolerance, family situation, health insurance needs, and career goals." },
        { question: "How do I handle taxes quarterly?", answer: "Contractors must make quarterly estimated tax payments. Calculate annual expected tax, divide by 4, and pay by due dates (April, June, September, January). Underpayment can result in penalties. Budget 30% of income for taxes." },
      ]}
    />
  )
}
