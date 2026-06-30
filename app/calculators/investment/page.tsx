'use client'

import { useState, useEffect } from 'react'
import CalculatorPageTemplate from '@/components/calculators/CalculatorPageTemplate'
import { calculateInvestment, InvestmentInput, InvestmentResult } from '@/lib/calculations/investment'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils/format'

export default function InvestmentCalculatorPage() {
  const [inputs, setInputs] = useState<InvestmentInput>({
    initialInvestment: 10000,
    monthlyContribution: 500,
    expectedReturn: 8,
    years: 20,
    inflationRate: 3,
  })
  const [results, setResults] = useState<InvestmentResult | null>(null)

  useEffect(() => {
    const calculated = calculateInvestment(inputs)
    setResults(calculated)
  }, [inputs])

  const handleInputChange = (field: keyof InvestmentInput, value: string | number) => {
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
            placeholder="8"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
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

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Inflation Rate (%)
        </label>
        <div className="relative">
          <input
            type="number"
            step="0.5"
            value={inputs.inflationRate}
            onChange={(e) => handleInputChange('inflationRate', e.target.value)}
            className="input-field pr-8"
            placeholder="3"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
        </div>
      </div>
    </div>
  )

  const resultsDisplay = results ? {
    mainResult: {
      label: 'Future Value',
      value: formatCurrency(results.futureValue),
      subtext: `${results.yearlyBreakdown.length} years of growth`,
    },
    cards: [
      { label: 'Total Contributions', value: formatCurrency(results.totalContributions), color: '#2563EB' },
      { label: 'Interest Earned', value: formatCurrency(results.interestEarned), color: '#10B981' },
      { label: 'Inflation Adjusted', value: formatCurrency(results.inflationAdjustedValue), color: '#F59E0B' },
    ],
    lineData: results.yearlyBreakdown.map(y => ({
      name: `Year ${y.year}`,
      value: y.endValue,
    })),
    barData: [
      { name: 'Initial', value: inputs.initialInvestment },
      { name: 'Contributions', value: results.totalContributions - inputs.initialInvestment },
      { name: 'Interest', value: results.interestEarned },
    ],
    tableData: {
      headers: ['Year', 'Start Value', 'Contributions', 'Interest', 'End Value'],
      rows: results.yearlyBreakdown.slice(0, 10).map(y => [
        `Year ${y.year}`,
        formatCurrency(y.startValue),
        formatCurrency(y.contributions),
        formatCurrency(y.interest),
        formatCurrency(y.endValue),
      ]),
    },
  } : null

  return (
    <CalculatorPageTemplate
      id="investment"
      name="Investment Calculator"
      description="Project your investment growth and see the power of compound interest"
      path="/calculators/investment"
      heroContent="Investing is one of the most powerful ways to build wealth over time, but it can be hard to visualize how small, consistent contributions grow into substantial sums. Our Investment Calculator shows you exactly how your money can grow through the magic of compound interest—where you earn returns not just on your original investment, but also on the accumulated returns from previous years. Whether you are planning for retirement, saving for a major purchase, or just curious about investment growth, this calculator helps you set realistic goals and understand the impact of different contribution amounts, expected returns, and time horizons."
      calculatorForm={calculatorForm}
      results={resultsDisplay || {}}
      whatNumbersMean="Your future value represents the total amount you'll have after your investment period, combining your contributions and all accumulated returns. Total contributions show what you actually put in—not what your investment earns. Interest earned is the profit—the difference between what you contributed and final value. The inflation-adjusted value shows what that money would be worth in today's dollars, helping you understand real purchasing power. The yearly breakdown shows how returns accelerate over time through compounding."
      whyItMatters="Understanding investment growth helps you set achievable financial goals and stay motivated during market fluctuations. Seeing how small monthly contributions can grow into substantial sums over decades makes it easier to prioritize saving. The inflation adjustment prevents false confidence—you need to know if your savings will actually buy what you expect. This calculator also helps compare different strategies: increasing contributions vs. seeking higher returns vs. extending your timeline."
      howToUse={[
        "Enter your initial investment amount (can be $0 if starting fresh).",
        "Input your planned monthly contribution to the investment.",
        "Set your expected annual return (historically 7-10% for stock market).",
        "Choose your investment time horizon in years.",
        "Adjust the inflation rate to see real purchasing power of your future nest egg.",
      ]}
      faqItems={[
        { question: "What is compound interest?", answer: "Compound interest is interest earned on interest. When you earn returns, those returns also generate returns in subsequent periods. Over long periods, this creates exponential growth—your money starts earning more money, which earns even more money." },
        { question: "What return rate should I expect?", answer: "Historically, the stock market (S&P 500) has returned about 10% annually before inflation, or 7% after inflation over long periods. Bonds typically return 4-6%. Your actual return depends on your asset allocation, risk tolerance, and market conditions." },
        { question: "Why does inflation matter?", answer: "Inflation erodes purchasing power over time. If inflation averages 3% annually, your money loses half its purchasing power in about 24 years. The inflation-adjusted value shows what your future savings can actually buy in today terms." },
        { question: "How important is starting early?", answer: "Time is your greatest asset. Someone investing $500/month for 20 years (starting at 25) will have more than someone investing $1,000/month for 10 years (starting at 35), assuming equal returns. The earlier start gives compound interest more time to work." },
        { question: "Should I invest more or seek higher returns?", answer: "Increasing contributions is more reliable than chasing higher returns. Moving from 8% to 10% returns increases a 20-year outcome by about 35%, but doubling your monthly contribution doubles your results. Focus on what you can control: savings rate and time horizon." },
        { question: "What about taxes on investment gains?", answer: "This calculator shows pre-tax growth. In taxable accounts, you will owe capital gains tax when you sell. Tax-advantaged accounts like 401(k)s and IRAs allow tax-deferred or tax-free growth. Consider maxing tax-advantaged accounts first." },
        { question: "How often should I invest?", answer: "Monthly investing smooths out market volatility through dollar-cost averaging. It also builds a consistent savings habit. Some prefer weekly or bi-weekly to align with their pay schedule—the key is consistency over timing." },
        { question: "What if the market crashes?", answer: "Market downturns are normal and temporary. Historically, markets have always recovered and reached new highs. Continuing to invest during downturns allows you to buy more shares at lower prices, which can actually improve long-term returns." },
      ]}
    />
  )
}
