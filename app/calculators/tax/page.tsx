'use client'

import { useState, useEffect } from 'react'
import CalculatorPageTemplate from '@/components/calculators/CalculatorPageTemplate'
import { calculateTax, TaxInput, TaxResult } from '@/lib/calculations/tax'
import { formatCurrency, formatPercent } from '@/lib/utils/format'
import { US_STATES, FILING_STATUSES } from '@/lib/constants'

export default function TaxCalculatorPage() {
  const [inputs, setInputs] = useState<TaxInput>({
    annualIncome: 75000,
    state: 'CA',
    filingStatus: 'single',
    itemizedDeductions: 0,
    taxCredits: 0,
  })
  const [results, setResults] = useState<TaxResult | null>(null)

  useEffect(() => {
    const calculated = calculateTax(inputs)
    setResults(calculated)
  }, [inputs])

  const handleInputChange = (field: keyof TaxInput, value: string | number) => {
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
          Annual Income
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <input
            type="number"
            value={inputs.annualIncome}
            onChange={(e) => handleInputChange('annualIncome', e.target.value)}
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
          Itemized Deductions (if greater than standard)
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <input
            type="number"
            value={inputs.itemizedDeductions}
            onChange={(e) => handleInputChange('itemizedDeductions', e.target.value)}
            className="input-field pl-8"
            placeholder="0"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Tax Credits
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <input
            type="number"
            value={inputs.taxCredits}
            onChange={(e) => handleInputChange('taxCredits', e.target.value)}
            className="input-field pl-8"
            placeholder="0"
          />
        </div>
      </div>
    </div>
  )

  const resultsDisplay = results ? {
    mainResult: {
      label: 'Total Tax Owed',
      value: formatCurrency(results.totalTax),
      subtext: `Effective Rate: ${formatPercent(results.effectiveRate)}`,
    },
    cards: [
      { label: 'Federal Tax', value: formatCurrency(results.federalTax), color: '#EF4444' },
      { label: 'State Tax', value: formatCurrency(results.stateTax), color: '#F59E0B' },
      { label: 'Take Home', value: formatCurrency(results.takeHome), color: '#10B981' },
      { label: 'Taxable Income', value: formatCurrency(results.taxableIncome), color: '#2563EB' },
    ],
    pieData: [
      { name: 'Take Home', value: results.takeHome, color: '#10B981' },
      { name: 'Federal Tax', value: results.federalTax, color: '#EF4444' },
      { name: 'State Tax', value: results.stateTax, color: '#F59E0B' },
    ],
    barData: [
      { name: 'Gross Income', value: results.grossIncome },
      { name: 'Taxable Income', value: results.taxableIncome },
      { name: 'Take Home', value: results.takeHome },
    ],
    tableData: {
      headers: ['Item', 'Amount'],
      rows: [
        ['Gross Income', formatCurrency(results.grossIncome)],
        ['Standard Deduction', formatCurrency(results.standardDeduction)],
        ['Itemized Deductions', formatCurrency(results.itemizedDeductions)],
        ['Used Deduction', formatCurrency(results.usedDeduction)],
        ['Taxable Income', formatCurrency(results.taxableIncome)],
        ['Federal Tax', formatCurrency(results.federalTax)],
        ['State Tax', formatCurrency(results.stateTax)],
        ['Tax Credits', formatCurrency(results.taxCredits)],
        ['Total Tax', formatCurrency(results.totalTax)],
        ['Take Home Pay', formatCurrency(results.takeHome)],
      ],
    },
  } : null

  return (
    <CalculatorPageTemplate
      id="tax"
      name="Tax Calculator"
      description="Estimate your federal and state income taxes"
      path="/calculators/tax"
      heroContent="Tax planning is essential for financial success, yet many people don't fully understand their tax obligations until they file. Our Tax Calculator helps you estimate your federal and state income taxes before tax season arrives, giving you time to make strategic decisions about deductions, credits, and withholding. Whether you're self-employed needing to make quarterly estimated payments, an employee who wants to check their withholding, or simply curious about your tax burden, this calculator provides accurate estimates using 2024 tax brackets and standard deductions. Understanding your taxes empowers you to make smarter financial choices throughout the year."
      calculatorForm={calculatorForm}
      results={resultsDisplay || {}}
      whatNumbersMean="Your taxable income is what remains after subtracting deductions from your gross income. The calculator automatically compares your itemized deductions to the standard deduction and uses the larger one. Federal tax is calculated using progressive brackets where each portion of income is taxed at a different rate. State tax varies by your location—some states have no income tax while others have rates exceeding 10%. Tax credits directly reduce your tax bill dollar-for-dollar, making them more valuable than deductions. Your effective tax rate shows your true overall tax burden as a percentage of gross income."
      whyItMatters="Understanding your tax liability helps you avoid surprises at tax time and plan for year-end tax strategies. If you're significantly under-withholding, you may owe a large payment plus penalties. If you're over-withholding, you're giving the government an interest-free loan. For self-employed individuals, accurate tax estimates are crucial for quarterly payments and avoiding underpayment penalties. This calculator helps you visualize how different financial decisions—affect your tax outcome."
      howToUse={[
        "Enter your total expected annual income from all sources.",
        "Select your state of residence for accurate state tax estimates.",
        "Choose your filing status based on your marital situation.",
        "Enter itemized deductions if they exceed the standard deduction.",
        "Add any tax credits you expect to claim and review your total tax.",
      ]}
      faqItems={[
        { question: "What is the standard deduction for 2024?", answer: "For 2024, the standard deduction is $14,600 for single filers, $29,200 for married couples filing jointly, and $21,900 for heads of household. This amount is automatically subtracted from your income before taxes are calculated." },
        { question: "Should I itemize or take the standard deduction?", answer: "Itemize if your total itemized deductions (mortgage interest, charitable donations, state/local taxes up to $10,000, medical expenses over 7.5% of AGI) exceed the standard deduction. Otherwise, taking the standard deduction saves time and often results in lower taxes." },
        { question: "What are tax credits vs deductions?", answer: "Tax credits directly reduce your tax bill dollar-for-dollar, making them more valuable. A $1,000 credit saves you $1,000 in taxes. Deductions reduce your taxable income, so a $1,000 deduction saves you $220 if you are in the 22% bracket." },
        { question: "How do tax brackets work?", answer: "The US uses progressive tax brackets where each portion of income is taxed at different rates. If you are in the 22% bracket, you do not pay 22% on all income—only on income within that bracket range. Income below is taxed at 10% and 12%." },
        { question: "When should I adjust my W-4 withholding?", answer: "Review your withholding whenever you have a major life change: marriage, divorce, new child, home purchase, or significant income change. The IRS recommends checking your withholding annually to avoid surprise tax bills or large refunds." },
        { question: "Are estimated tax payments required?", answer: "Self-employed individuals and those with significant non-wage income generally must make quarterly estimated tax payments if they expect to owe $1,000 or more at tax time. Each payment should cover roughly 25% of your expected annual tax." },
        { question: "What deductions can self-employed people claim?", answer: "Self-employed taxpayers can deduct business expenses, health insurance premiums, half of self-employment tax, and retirement plan contributions. These deductions can significantly reduce taxable income." },
        { question: "Can I reduce my tax liability legally?", answer: "Yes, through legitimate strategies: maximizing retirement contributions (401k, IRA), using FSAs/HSAs for medical expenses, harvesting tax losses, donating to charity, and taking all eligible credits and deductions." },
      ]}
    />
  )
}
