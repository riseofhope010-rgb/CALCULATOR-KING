'use client'

import React, { useState, useEffect } from 'react'
import CalculatorPageTemplate from '@/components/calculators/CalculatorPageTemplate'
import { calculateLoanEMI, LoanEMIInput, LoanEMIResult } from '@/lib/calculations/loan-emi'
import { formatCurrency, formatPercent } from '@/lib/utils/format'

export default function LoanEMIPage() {
  const [inputs, setInputs] = useState<LoanEMIInput>({
    principal: 500000,
    annualRate: 8.5,
    tenureMonths: 60,
  })
  const [results, setResults] = useState<LoanEMIResult | null>(null)

  useEffect(() => {
    const calculated = calculateLoanEMI(inputs)
    setResults(calculated)
  }, [inputs])

  const handleInputChange = (field: keyof LoanEMIInput, value: string | number) => {
    setInputs(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? parseFloat(value) || 0 : value,
    }))
  }

  const calculatorForm = (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Loan Amount (Principal)
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <input
            type="number"
            value={inputs.principal}
            onChange={(e) => handleInputChange('principal', e.target.value)}
            className="input-field pl-8"
            placeholder="500000"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Interest Rate (% per annum)
        </label>
        <div className="relative">
          <input
            type="number"
            step="0.1"
            value={inputs.annualRate}
            onChange={(e) => handleInputChange('annualRate', e.target.value)}
            className="input-field pr-8"
            placeholder="8.5"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Loan Tenure (months)
        </label>
        <select
          value={inputs.tenureMonths}
          onChange={(e) => handleInputChange('tenureMonths', parseInt(e.target.value))}
          className="input-field"
        >
          <option value={12}>12 months</option>
          <option value={24}>24 months</option>
          <option value={36}>36 months</option>
          <option value={48}>48 months</option>
          <option value={60}>60 months</option>
          <option value={72}>72 months</option>
          <option value={84}>84 months</option>
          <option value={120}>120 months (10 years)</option>
          <option value={180}>180 months (15 years)</option>
          <option value={240}>240 months (20 years)</option>
        </select>
      </div>
    </div>
  )

  const resultsDisplay = results ? {
    mainResult: {
      label: 'Monthly EMI',
      value: formatCurrency(results.emi),
      subtext: `Total Payment: ${formatCurrency(results.totalPayment)}`,
    },
    cards: [
      { label: 'Total Interest', value: formatCurrency(results.totalInterest), color: '#EF4444' },
      { label: 'Interest %', value: formatPercent(results.interestPercentage), color: '#F59E0B' },
    ],
    barData: [
      { name: 'Principal', value: inputs.principal },
      { name: 'Interest', value: results.totalInterest },
    ],
    tableData: {
      headers: ['Tenure', 'EMI', 'Total Interest'],
      rows: results.comparison.filter(c => [12, 24, 36, 48, 60].includes(c.tenure) || c.tenure === inputs.tenureMonths).map(c => [
        `${c.tenure} months`,
        formatCurrency(c.emi),
        formatCurrency(c.totalInterest),
      ]),
    },
  } : null

  return (
    <CalculatorPageTemplate
      id="loan-emi"
      name="Loan EMI Calculator"
      description="Calculate your Equated Monthly Installment for any loan"
      path="/calculators/loan-emi"
      heroContent="EMI (Equated Monthly Installment) is a fixed payment made by a borrower to a lender at a specified date each month. EMIs apply equally to both interest and principal each month so that over a specified period, the loan is paid off in full. Our EMI Calculator instantly shows your monthly payment, total interest, and compares different loan tenures so you can find the right balance between monthly affordability and total interest cost."
      calculatorForm={calculatorForm}
      results={resultsDisplay || {}}
      whatNumbersMean="EMI is your fixed monthly payment combining principal and interest. Total interest shows all interest paid over the loan term. Interest percentage is the portion of total payments going to interest. The comparison table shows how different tenures affect monthly payments and total interest—shorter terms mean higher EMIs but less total interest."
      whyItMatters="Understanding EMI helps you budget and compare loan options. A lower EMI seems attractive but often means paying much more interest. The comparison shows this trade-off: a 60-month loan at the same rate costs more interest than a 36-month loan. This knowledge helps you choose a term that fits your budget while minimizing total cost."
      howToUse={[
        "Enter your loan amount (principal).",
        "Input the annual interest rate.",
        "Select your desired loan tenure in months.",
        "Review your EMI and total interest costs.",
        "Compare different tenures to find your best option.",
      ]}
      faqItems={[
        { question: "What is EMI?", answer: "EMI stands for Equated Monthly Installment—a fixed payment combining principal and interest. Each payment reduces your loan balance progressively. Initially, payments go mostly toward interest; over time, more goes to principal." },
        { question: "How can I reduce my EMI?", answer: "Increase your loan tenure for lower monthly payments (but more total interest). Make a larger down payment to reduce principal. Negotiate a lower interest rate. Prepay when possible to reduce future interest." },
        { question: "Should I choose a shorter or longer tenure?", answer: "Shorter tenure = higher EMI but less total interest. Longer tenure = lower EMI but more interest. Choose based on your monthly budget. If you can afford the higher EMI, shorter is usually better." },
        { question: "What happens if I prepay?", answer: "Prepayments reduce your principal and can lower future EMIs or shorten your loan. Most lenders allow prepayment, but check for prepayment penalties. Even small extra payments save significant interest." },
        { question: "How is EMI calculated?", answer: "EMI uses the formula: EMI = P × r × (1+r)^n / ((1+r)^n - 1), where P is principal, r is monthly interest rate, and n is number of months. This ensures equal payments while fully amortizing the loan." },
        { question: "What about processing fees and other charges?", answer: "This calculator shows EMI based on principal and interest only. Processing fees, documentation charges, insurance, and other fees increase your effective cost. Add these to principal for true total cost." },
        { question: "Does EMI change over time?", answer: "For fixed-rate loans, EMI stays constant throughout the tenure. For floating-rate loans, EMI can change with interest rate changes. Fixed-rate provides payment certainty; floating can be beneficial if rates decrease." },
        { question: "What if I miss an EMI payment?", answer: "Missing payments results in late fees and potential default. It affects your credit score and may lead to repossession (for secured loans). Always contact your lender if struggling—they may offer restructuring options." },
      ]}
    />
  )
}
