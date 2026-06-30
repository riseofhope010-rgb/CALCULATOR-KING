'use client'

import React, { useState, useEffect } from 'react'
import CalculatorPageTemplate from '@/components/calculators/CalculatorPageTemplate'
import { calculateProfitMargin, ProfitMarginInput, ProfitMarginResult } from '@/lib/calculations/profit-margin'
import { formatCurrency, formatPercent } from '@/lib/utils/format'

export default function ProfitMarginPage() {
  const [inputs, setInputs] = useState<ProfitMarginInput>({
    revenue: 500000,
    cogs: 200000,
    operatingExpenses: 150000,
    otherExpenses: 10000,
    interestExpense: 15000,
    taxRate: 25,
  })
  const [results, setResults] = useState<ProfitMarginResult | null>(null)

  useEffect(() => {
    const calculated = calculateProfitMargin(inputs)
    setResults(calculated)
  }, [inputs])

  const handleInputChange = (field: keyof ProfitMarginInput, value: string | number) => {
    setInputs(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? parseFloat(value) || 0 : value,
    }))
  }

  const calculatorForm = (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Total Revenue
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <input
            type="number"
            value={inputs.revenue}
            onChange={(e) => handleInputChange('revenue', e.target.value)}
            className="input-field pl-8"
            placeholder="500000"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Cost of Goods Sold (COGS)
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <input
            type="number"
            value={inputs.cogs}
            onChange={(e) => handleInputChange('cogs', e.target.value)}
            className="input-field pl-8"
            placeholder="200000"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Operating Expenses
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <input
            type="number"
            value={inputs.operatingExpenses}
            onChange={(e) => handleInputChange('operatingExpenses', e.target.value)}
            className="input-field pl-8"
            placeholder="150000"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Other Expenses
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              value={inputs.otherExpenses}
              onChange={(e) => handleInputChange('otherExpenses', e.target.value)}
              className="input-field pl-8"
              placeholder="10000"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Interest Expense
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              value={inputs.interestExpense}
              onChange={(e) => handleInputChange('interestExpense', e.target.value)}
              className="input-field pl-8"
              placeholder="15000"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Tax Rate (%)
        </label>
        <div className="relative">
          <input
            type="number"
            value={inputs.taxRate}
            onChange={(e) => handleInputChange('taxRate', e.target.value)}
            className="input-field pr-8"
            placeholder="25"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
        </div>
      </div>
    </div>
  )

  const resultsDisplay = results ? {
    mainResult: {
      label: 'Net Profit Margin',
      value: formatPercent(results.netProfitMargin),
      subtext: `Net Income: ${formatCurrency(results.netIncome)}`,
    },
    cards: [
      { label: 'Gross Margin', value: formatPercent(results.grossProfitMargin), color: '#2563EB' },
      { label: 'Operating Margin', value: formatPercent(results.operatingMargin), color: '#F59E0B' },
      { label: 'Markup', value: formatPercent(results.markup), color: '#10B981' },
    ],
    barData: [
      { name: 'Revenue', value: inputs.revenue },
      { name: 'COGS', value: inputs.cogs },
      { name: 'OpEx', value: inputs.operatingExpenses },
      { name: 'Net', value: results.netIncome },
    ],
    tableData: {
      headers: ['Metric', 'Amount', 'Margin'],
      rows: [
        ['Revenue', formatCurrency(inputs.revenue), '100%'],
        ['Cost of Goods Sold', formatCurrency(inputs.cogs), formatPercent((inputs.cogs / inputs.revenue) * 100)],
        ['Gross Profit', formatCurrency(results.grossProfit), formatPercent(results.grossProfitMargin)],
        ['Operating Expenses', formatCurrency(inputs.operatingExpenses), formatPercent((inputs.operatingExpenses / inputs.revenue) * 100)],
        ['Operating Income', formatCurrency(results.operatingIncome), formatPercent(results.operatingMargin)],
        ['Interest & Other', formatCurrency(inputs.interestExpense + inputs.otherExpenses), '-'],
        ['Pre-Tax Income', formatCurrency(results.earningsBeforeTax), '-'],
        ['Taxes', formatCurrency(results.earningsBeforeTax * (inputs.taxRate / 100)), '-'],
        ['Net Income', formatCurrency(results.netIncome), formatPercent(results.netProfitMargin)],
      ],
    },
  } : null

  return (
    <CalculatorPageTemplate
      id="profit-margin"
      name="Profit Margin Calculator"
      description="Analyze business profitability with detailed margin breakdowns"
      path="/calculators/profit-margin"
      heroContent="Profit margins are fundamental metrics for understanding business health and making informed decisions. Whether you're evaluating a business opportunity, analyzing company performance, or managing your own enterprise, understanding gross, operating, and net profit margins reveals where money is made—and lost. Our Profit Margin Calculator provides a comprehensive breakdown, showing how each cost layer affects your bottom line and highlighting where efficiency improvements would have the most impact."
      calculatorForm={calculatorForm}
      results={resultsDisplay || {}}
      whatNumbersMean="Gross profit margin shows profitability before operating expenses—primarily reflects pricing power and production efficiency. Operating margin shows profitability from core business activities after all operational costs. Net profit margin is the final percentage that reaches owners—affected by interest, taxes, and all other factors. Markup shows how much you add to costs to determine price—different perspective on gross margin."
      whyItMatters="Margin analysis reveals business efficiency and competitive position. Declining margins may indicate pricing pressure, rising costs, or inefficiency. Comparing margins to industry benchmarks shows competitive position. Understanding each margin layer helps identify improvement opportunities—whether to raise prices, reduce COGS, or cut operating expenses."
      howToUse={[
        "Enter your total revenue or sales amount.",
        "Input cost of goods sold (direct production/purchase costs).",
        "Add operating expenses (salaries, rent, marketing, etc).",
        "Include other expenses and interest payments.",
        "Set the tax rate to see true net profit.",
      ]}
      faqItems={[
        { question: 'What is the difference between gross and net margin?', answer: 'Gross margin shows profit after direct costs (COGS) only. Net margin shows final profit after ALL expenses: operating costs, interest, and taxes. Gross reflects product/service profitability; net reflects overall business profitability.' },
        { question: 'What is a good profit margin?', answer: 'It varies by industry. Software companies often achieve 20-40% net margins. Retail typically sees 2-5%. Restaurants 3-6%. Manufacturing 5-10%. Compare to industry averages—being significantly above or below signals something important.' },
        { question: 'Margin vs markup—what is the difference?', answer: 'Margin is profit divided by revenue (selling price). Markup is profit divided by cost. A 50% margin equals a 100% markup. Confusing these leads to pricing errors. Margin is standard for financial analysis; markup is common for pricing.' },
        { question: 'How can I improve my margins?', answer: 'Increase prices, reduce COGS through better sourcing or efficiency, automate processes to cut operating expenses, renegotiate vendor contracts, eliminate low-margin products, or shift sales mix toward higher-margin offerings.' },
        { question: 'What is operating leverage?', answer: 'Operating leverage shows how fixed costs affect profit sensitivity. High fixed costs mean revenue changes have bigger profit impact. When revenue grows, high-leverage businesses see profit grow faster but suffer more in downturns.' },
        { question: 'Why do margins vary by industry?', answer: 'Competition intensity, capital requirements, product differentiation, and market power drive margin variation. Commodity products compete on price—low margins. Differentiated products can command premium—higher margins. Barriers to entry also affect competitive pressure on margins.' },
        { question: 'Should I focus on gross or net margin?', answer: 'Gross margin reveals product/service viability—core offering efficiency. Net margin reveals overall business sustainability. Both matter: strong gross with weak net suggests overhead problems. Weak gross suggests fundamental issues with offering or market.' },
        { question: 'How do I calculate break-even?', answer: 'Break-even revenue = Fixed Costs / Gross Margin %. If fixed costs are $100,000 and gross margin is 40%, break-even is $250,000 in revenue. Below this, you lose money. Above, you profit.' },
      ]}
    />
  )
}
