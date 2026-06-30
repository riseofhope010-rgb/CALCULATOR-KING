'use client'

import { useState, useEffect } from 'react'
import CalculatorPageTemplate from '@/components/calculators/CalculatorPageTemplate'
import { calculateMortgage, MortgageInput, MortgageResult } from '@/lib/calculations/mortgage'
import { formatCurrency } from '@/lib/utils/format'

export default function MortgageCalculatorPage() {
  const [inputs, setInputs] = useState<MortgageInput>({
    homePrice: 450000,
    downPaymentPercent: 20,
    downPaymentAmount: 0,
    loanTerm: 30,
    interestRate: 6.5,
    propertyTax: 5400,
    insurance: 1800,
    hoa: 0,
    pmi: 0,
  })
  const [results, setResults] = useState<MortgageResult | null>(null)

  useEffect(() => {
    const calculated = calculateMortgage(inputs)
    setResults(calculated)
  }, [inputs])

  const handleInputChange = (field: keyof MortgageInput, value: string | number) => {
    setInputs(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? parseFloat(value) || 0 : value,
    }))
  }

  const calculatorForm = (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Home Price
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <input
            type="number"
            value={inputs.homePrice}
            onChange={(e) => handleInputChange('homePrice', e.target.value)}
            className="input-field pl-8"
            placeholder="450000"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Down Payment (%)
        </label>
        <div className="relative">
          <input
            type="number"
            value={inputs.downPaymentPercent}
            onChange={(e) => handleInputChange('downPaymentPercent', e.target.value)}
            className="input-field pr-8"
            placeholder="20"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Loan Term (years)
        </label>
        <select
          value={inputs.loanTerm}
          onChange={(e) => handleInputChange('loanTerm', parseInt(e.target.value))}
          className="input-field"
        >
          <option value={15}>15 Years</option>
          <option value={20}>20 Years</option>
          <option value={30}>30 Years</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Interest Rate (%)
        </label>
        <div className="relative">
          <input
            type="number"
            step="0.1"
            value={inputs.interestRate}
            onChange={(e) => handleInputChange('interestRate', e.target.value)}
            className="input-field pr-8"
            placeholder="6.5"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Annual Property Tax
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <input
            type="number"
            value={inputs.propertyTax}
            onChange={(e) => handleInputChange('propertyTax', e.target.value)}
            className="input-field pl-8"
            placeholder="5400"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Annual Home Insurance
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <input
            type="number"
            value={inputs.insurance}
            onChange={(e) => handleInputChange('insurance', e.target.value)}
            className="input-field pl-8"
            placeholder="1800"
          />
        </div>
      </div>
    </div>
  )

  const resultsDisplay = results ? {
    mainResult: {
      label: 'Total Monthly Payment',
      value: formatCurrency(results.totalMonthlyPayment),
      subtext: `Principal & Interest: ${formatCurrency(results.monthlyPrincipalInterest)}`,
    },
    cards: [
      { label: 'Loan Amount', value: formatCurrency(results.loanAmount), color: '#2563EB' },
      { label: 'Down Payment', value: formatCurrency(results.downPayment), color: '#10B981' },
      { label: 'Total Interest', value: formatCurrency(results.totalInterest), color: '#EF4444' },
      { label: 'Payoff Date', value: results.payoffDate, color: '#8B5CF6' },
    ],
    pieData: [
      { name: 'Principal', value: results.loanAmount, color: '#2563EB' },
      { name: 'Interest', value: results.totalInterest, color: '#EF4444' },
      { name: 'Property Tax', value: results.monthlyPropertyTax * 12 * (inputs.loanTerm || 30), color: '#F59E0B' },
      { name: 'Insurance', value: results.monthlyInsurance * 12 * (inputs.loanTerm || 30), color: '#10B981' },
    ],
    barData: [
      { name: 'Principal+Interest', value: results.monthlyPrincipalInterest },
      { name: 'Property Tax', value: results.monthlyPropertyTax },
      { name: 'Insurance', value: results.monthlyInsurance },
      { name: 'HOA', value: results.monthlyHOA },
    ],
    tableData: {
      headers: ['Payment Breakdown', 'Monthly', 'Annual'],
      rows: [
        ['Principal & Interest', formatCurrency(results.monthlyPrincipalInterest), formatCurrency(results.monthlyPrincipalInterest * 12)],
        ['Property Tax', formatCurrency(results.monthlyPropertyTax), formatCurrency(results.monthlyPropertyTax * 12)],
        ['Insurance', formatCurrency(results.monthlyInsurance), formatCurrency(results.monthlyInsurance * 12)],
        ['HOA', formatCurrency(results.monthlyHOA), formatCurrency(results.monthlyHOA * 12)],
        ['Total', formatCurrency(results.totalMonthlyPayment), formatCurrency(results.totalMonthlyPayment * 12)],
      ],
    },
  } : null

  return (
    <CalculatorPageTemplate
      id="mortgage"
      name="Mortgage Calculator"
      description="Calculate monthly mortgage payments including taxes and insurance"
      path="/calculators/mortgage"
      heroContent="Buying a home is one of the largest financial decisions most people make. Understanding your monthly mortgage payment goes far beyond just the loan amount and interest rate—it includes property taxes, homeowner's insurance, and possibly HOA fees and PMI. Our Mortgage Calculator provides a complete picture of your monthly housing costs, showing how different down payments, interest rates, and loan terms affect your budget. Whether you're a first-time homebuyer trying to determine how much house you can afford, or a homeowner considering refinancing, this calculator helps you make informed decisions with realistic cost estimates."
      calculatorForm={calculatorForm}
      results={resultsDisplay || {}}
      whatNumbersMean="Your monthly payment consists of PITI: Principal (the amount going toward your loan balance), Interest (the cost of borrowing), Taxes (property taxes), and Insurance (homeowner's coverage). Principal and interest together form your core mortgage payment based on your loan amount, rate, and term. Property taxes vary by location—typically 1-3% of home value annually. Insurance protects your investment against damage and liability. If your down payment is less than 20%, you may pay PMI until you reach 20% equity."
      whyItMatters="Understanding your total monthly housing cost is crucial for budgeting and financial planning. Many first-time buyers focus only on the principal and interest payment, then are surprised by the additional costs. Knowing your true monthly obligation helps you determine how much house you can afford without being 'house poor'—spending so much on housing you can't afford other necessities or savings. This knowledge also helps when comparing different loan options or deciding between renting and buying."
      howToUse={[
        "Enter the home price you are considering.",
        "Specify your down payment percentage (affects PMI requirement).",
        "Select loan term—shorter terms have higher payments but less interest.",
        "Enter estimated interest rate and annual property tax.",
        "Add insurance and HOA costs to see your complete monthly payment.",
      ]}
      faqItems={[
        { question: "What is PMI and when do I need it?", answer: "Private Mortgage Insurance (PMI) is required when your down payment is less than 20%. It protects the lender if you default. PMI typically costs 0.5-1% of the loan annually and can be removed once you reach 20% equity. Some loans allow you to avoid PMI with a smaller down payment by accepting a higher interest rate." },
        { question: "How much should my down payment be?", answer: "20% down is ideal to avoid PMI and get the best rates. However, many loans allow 3-5% down for first-time buyers. Consider your overall financial picture—keeping some savings for emergencies may be more important than a large down payment." },
        { question: "Should I choose a 15 or 30 year mortgage?", answer: "A 15-year mortgage has higher monthly payments but significantly less total interest and lower rates. A 30-year mortgage offers lower monthly payments and more flexibility—you can always make extra payments. Choose based on your budget and financial goals." },
        { question: "What are closing costs beyond the down payment?", answer: "Expect 2-5% of the home price in closing costs: appraisal, title insurance, loan origination fees, prepaid taxes and insurance, and recording fees. Some sellers may contribute toward closing costs in negotiations." },
        { question: "How do property taxes work?", answer: "Property taxes are set by local governments and fund schools, services, and infrastructure. Rates vary significantly by location, typically 1-3% of assessed value annually. Taxes may increase over time as property values rise." },
        { question: "What does homeowners insurance cover?", answer: "Homeowners insurance covers damage to your home and belongings from fire, storms, theft, and liability if someone is injured on your property. Lenders require coverage at least equal to the loan amount. Annual premiums typically range from 0.3-1% of home value." },
        { question: "Can I afford this monthly payment?", answer: "A common guideline is that total housing costs should not exceed 28% of gross income. However, consider your complete budget: other debts, savings goals, lifestyle, and emergency fund needs. Use our salary calculator to understand your true take-home pay." },
        { question: "When should I refinance my mortgage?", answer: "Consider refinancing when rates are at least 0.75-1% lower than your current rate. Calculate break-even time: if closing costs are $5,000 and you save $200/month, you break even in 25 months. Also consider refinancing to remove PMI or change loan terms." },
      ]}
    />
  )
}
