'use client'

import React, { useState, useEffect } from 'react'
import CalculatorPageTemplate from '@/components/calculators/CalculatorPageTemplate'
import { calculateROI, ROIInput, ROIResult } from '@/lib/calculations/roi'
import { formatCurrency, formatPercent, formatNumber } from '@/lib/utils/format'

export default function ROICalculatorPage() {
  const [inputs, setInputs] = useState<ROIInput>({
    initialInvestment: 10000,
    finalValue: 15000,
    investmentPeriod: 3,
  })
  const [results, setResults] = useState<ROIResult | null>(null)

  useEffect(() => {
    const calculated = calculateROI(inputs)
    setResults(calculated)
  }, [inputs])

  const handleInputChange = (field: keyof ROIInput, value: string | number) => {
    setInputs(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? parseFloat(value) || 0 : value,
    }))
  }

  const calculatorForm = (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Initial Investment
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <input
            type="number"
            value={inputs.initialInvestment}
            onChange={(e) => handleInputChange('initialInvestment', e.target.value)}
            className="input-field pl-8"
            placeholder="10000"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Final Value
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <input
            type="number"
            value={inputs.finalValue}
            onChange={(e) => handleInputChange('finalValue', e.target.value)}
            className="input-field pl-8"
            placeholder="15000"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Investment Period (years)
        </label>
        <input
          type="number"
          value={inputs.investmentPeriod}
          onChange={(e) => handleInputChange('investmentPeriod', e.target.value)}
          className="input-field"
          placeholder="3"
        />
      </div>
    </div>
  )

  const resultsDisplay = results ? {
    mainResult: {
      label: 'Annualized ROI (CAGR)',
      value: formatPercent(results.annualizedROI),
      subtext: results.performance,
    },
    cards: [
      { label: 'Total ROI', value: formatPercent(results.roi), color: results.roi >= 0 ? '#10B981' : '#EF4444' },
      { label: 'Total Gain', value: formatCurrency(results.totalGain), color: '#2563EB' },
      { label: 'Annual Gain', value: formatCurrency(results.averageAnnualGain), color: '#F59E0B' },
    ],
    barData: [
      { name: 'Initial', value: inputs.initialInvestment },
      { name: 'Final', value: inputs.finalValue },
      { name: 'Gain', value: results.totalGain },
    ],
    tableData: {
      headers: ['Metric', 'Value'],
      rows: [
        ['Initial Investment', formatCurrency(inputs.initialInvestment)],
        ['Final Value', formatCurrency(inputs.finalValue)],
        ['Total Gain/Loss', formatCurrency(results.totalGain)],
        ['Simple ROI', formatPercent(results.roi)],
        ['Annualized ROI (CAGR)', formatPercent(results.annualizedROI)],
        ['Average Annual Gain', formatCurrency(results.averageAnnualGain)],
        ['Performance', results.performance],
      ],
    },
  } : null

  return (
    <CalculatorPageTemplate
      id="roi"
      name="ROI Calculator"
      description="Calculate return on investment with simple and annualized rates"
      path="/calculators/roi"
      heroContent="Understanding return on investment (ROI) is essential for evaluating any investment decision, from stocks and real estate to business projects. Our ROI Calculator provides both simple ROI (total return) and annualized ROI (CAGR), which accounts for time—a critical distinction when comparing investments of different durations. A 50% return over 10 years is very different from 50% over 1 year. This calculator helps you make apples-to-apples comparisons and understand true investment performance."
      calculatorForm={calculatorForm}
      results={resultsDisplay || {}}
      whatNumbersMean="Simple ROI shows total percentage gain or loss without considering time—useful for quick comparisons but misleading across different periods. Annualized ROI (CAGR—Compound Annual Growth Rate) shows what yearly return would produce your final result, enabling fair comparisons. A positive CAGR above 7% typically beats inflation and the overall stock market average, representing solid performance."
      whyItMatters="ROI analysis helps you evaluate past investments, compare opportunities, and make better decisions. If your investment returned 30% but took 5 years, that is only 5.4% annually—maybe not worth the risk. Conversely, a 100% return over 2 years is 41% annually—excellent performance. Annualized returns enable meaningful comparisons across different investments and time periods."
      howToUse={[
        "Enter your initial investment amount.",
        "Enter the current or final value of the investment.",
        "Specify the investment period in years.",
        "Review both simple ROI and annualized ROI for the full picture.",
        "Compare to benchmarks like stock market returns or inflation.",
      ]}
      faqItems={[
        { question: "What is the difference between ROI and CAGR?", answer: "ROI (Return on Investment) shows total percentage gain or loss. CAGR (Compound Annual Growth Rate) annualizes that return, showing what yearly rate produced your result. A 100% ROI over 10 years is ~7.2% CAGR. CAGR enables comparison between investments of different durations." },
        { question: "What is a good ROI?", answer: "Context matters. The stock market historically returns about 7% annually after inflation. Real estate often targets 8-12% annually. Business investments may target 15-25%. Compare to alternatives and consider risk—higher potential returns come with higher risk." },
        { question: "Should I consider inflation?", answer: "Yes for long-term analysis. If your investment returns 5% annually but inflation is 3%, your real return is only 2%. Our calculator shows nominal returns. Subtract inflation rate for real returns, especially for periods over 5 years." },
        { question: "What about taxes on investment gains?", answer: "This calculator shows pre-tax returns. Long-term capital gains are taxed at 0%, 15%, or 20% depending on income. Short-term gains (under 1 year) are taxed as ordinary income. Consider after-tax returns when comparing taxable vs tax-advantaged accounts." },
        { question: "How do I calculate ROI with dividends?", answer: "Include dividends in your final value. If you invested $10,000, it is now worth $11,000, and you received $500 in dividends, use $11,500 as final value. Total return includes both price appreciation and income." },
        { question: "What if I have multiple investments at different times?", answer: "For multiple contributions, use our Investment Calculator instead. Simple ROI works best for a single initial amount. Weighted average cost basis can help if you added money at different prices." },
        { question: "How do I compare different investment options?", answer: "Use CAGR for fair comparison across different time periods. Also consider: risk level, liquidity, tax treatment, management fees, and your overall portfolio. Higher returns typically require accepting higher risk." },
        { question: "Can ROI be negative?", answer: "Yes, negative ROI indicates a loss. If you invested $10,000 and it us now worth $8,000, your ROI is -20%. Annualized ROI would show -10.6% per year if held for 2 years." },
      ]}
    />
  )
}
