'use client'

import { useState, useEffect } from 'react'
import CalculatorPageTemplate from '@/components/calculators/CalculatorPageTemplate'
import { calculateLoan, LoanInput, LoanResult } from '@/lib/calculations/loan'
import { formatCurrency } from '@/lib/utils/format'

export default function LoanCalculatorPage() {
  const [inputs, setInputs] = useState<LoanInput>({
    loanAmount: 25000,
    interestRate: 7.5,
    loanTerm: 60,
  })
  const [results, setResults] = useState<LoanResult | null>(null)

  useEffect(() => {
    const calculated = calculateLoan(inputs)
    setResults(calculated)
  }, [inputs])

  const handleInputChange = (field: keyof LoanInput, value: string | number) => {
    setInputs(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? parseFloat(value) || 0 : value,
    }))
  }

  const calculatorForm = (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Loan Amount
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <input
            type="number"
            value={inputs.loanAmount}
            onChange={(e) => handleInputChange('loanAmount', e.target.value)}
            className="input-field pl-8"
            placeholder="25000"
          />
        </div>
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
            placeholder="7.5"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Loan Term (months)
        </label>
        <select
          value={inputs.loanTerm}
          onChange={(e) => handleInputChange('loanTerm', parseInt(e.target.value))}
          className="input-field"
        >
          <option value={12}>12 months (1 year)</option>
          <option value={24}>24 months (2 years)</option>
          <option value={36}>36 months (3 years)</option>
          <option value={48}>48 months (4 years)</option>
          <option value={60}>60 months (5 years)</option>
          <option value={72}>72 months (6 years)</option>
          <option value={84}>84 months (7 years)</option>
        </select>
      </div>
    </div>
  )

  const resultsDisplay = results ? {
    mainResult: {
      label: 'Monthly Payment',
      value: formatCurrency(results.monthlyPayment),
      subtext: `Payoff: ${results.payoffDate}`,
    },
    cards: [
      { label: 'Total Interest', value: formatCurrency(results.totalInterest), color: '#EF4444' },
      { label: 'Total Payments', value: formatCurrency(results.totalPayments), color: '#2563EB' },
    ],
    pieData: [
      { name: 'Principal', value: inputs.loanAmount, color: '#2563EB' },
      { name: 'Interest', value: results.totalInterest, color: '#EF4444' },
    ],
    tableData: {
      headers: ['Month', 'Payment', 'Principal', 'Interest', 'Balance'],
      rows: results.amortizationSchedule.filter((_, i) => i % 12 === 0).slice(0, 8).map(a => [
        `Month ${a.month}`,
        formatCurrency(a.payment),
        formatCurrency(a.principal),
        formatCurrency(a.interest),
        formatCurrency(a.balance),
      ]),
    },
  } : null

  return (
    <CalculatorPageTemplate
      id="loan"
      name="Loan Calculator"
      description="Calculate monthly loan payments and see total interest costs"
      path="/calculators/loan"
      heroContent="Whether you're financing a car, consolidating debt, or taking out a personal loan, understanding your monthly payment and total interest cost is essential for making informed borrowing decisions. Our Loan Calculator provides detailed payment breakdowns and amortization schedules so you can see exactly how each payment reduces your principal and how much interest you'll pay over the life of the loan. This transparency helps you compare loan offers, decide between different term lengths, and understand the true cost of borrowing."
      calculatorForm={calculatorForm}
      results={resultsDisplay || {}}
      whatNumbersMean="Your monthly payment is the fixed amount you'll pay each month to repay the loan over the specified term. Total payments include all monthly payments combined, while total interest represents the cost of borrowing—the difference between what you borrowed and what you'll pay back. Early payments go more toward interest than principal, but as the loan progresses, more of each payment reduces your principal balance."
      whyItMatters="Understanding loan costs helps you make better borrowing decisions. Shorter terms have higher payments but significantly less interest. A longer term may seem more affordable monthly, but you could pay thousands more in interest. Seeing the amortization schedule reveals how early extra payments can dramatically reduce total interest since you're paying down principal while the balance is highest."
      howToUse={[
        "Enter the total amount you want to borrow.",
        "Input the annual interest rate offered by the lender.",
        "Select the loan term in months.",
        "Review your monthly payment and total interest cost.",
        "Compare different terms to find the right balance of monthly payment and total cost.",
      ]}
      faqItems={[
        { question: 'How is my monthly payment calculated?', answer: 'Loan payments use a formula that ensures the loan is paid off exactly at the end of the term. Each payment covers the interest accrued that month, with the remainder going to principal. The formula accounts for the loan amount, interest rate, and number of payments.' },
        { question: 'Should I choose a shorter or longer loan term?', answer: 'Shorter terms mean higher monthly payments but significantly less total interest. Longer terms lower payments but cost more overall. Choose based on your monthly budget and total cost priorities. If you can afford the higher payment, shorter is usually better.' },
        { question: 'Can I pay off my loan early?', answer: 'Most loans can be paid off early, saving interest. Some loans have prepayment penalties, so check your loan agreement. Extra payments reduce principal, which reduces future interest and pays off the loan faster.' },
        { question: 'What is amortization?', answer: 'Amortization is the process of spreading a loan into fixed payments. Early payments are mostly interest; later payments are mostly principal. The amortization schedule shows how each payment splits between interest and principal over the loan term.' },
        { question: 'How do I compare loan offers?', answer: 'Compare APR (Annual Percentage Rate) which includes both the interest rate and fees. Also compare total interest paid, monthly payment, and any prepayment penalties. The lowest monthly payment is not always the best deal.' },
        { question: 'What credit score do I need for a loan?', answer: 'Requirements vary by lender and loan type. Generally, scores above 720 get the best rates. Scores below 660 may face higher rates or denial. Check your credit before applying and consider improving it first if needed.' },
        { question: 'Is it better to make extra payments?', answer: 'Extra payments early in the loan have the most impact, reducing principal when interest costs are highest. Specify extra payments go toward principal, not future payments. Even small extra amounts save significant interest over the loan life.' },
        { question: 'What is the difference between APR and interest rate?', answer: 'The interest rate is the cost of borrowing the principal. APR includes the interest rate plus fees and other costs, giving a more complete picture of total borrowing cost. Always compare APRs when shopping for loans.' },
      ]}
    />
  )
}
