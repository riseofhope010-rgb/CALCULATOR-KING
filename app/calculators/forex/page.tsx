'use client'

import React, { useState, useEffect } from 'react'
import CalculatorPageTemplate from '@/components/calculators/CalculatorPageTemplate'
import { calculateForex, ForexInput, ForexResult } from '@/lib/calculations/forex'
import { formatCurrency, formatNumber } from '@/lib/utils/format'
import { FOREX_PAIRS } from '@/lib/constants'

export default function ForexCalculatorPage() {
  const [inputs, setInputs] = useState<ForexInput>({
    pair: 'EUR/USD',
    tradeSize: 1,
    lotType: 'standard',
    entryPrice: 1.0850,
    exitPrice: 1.0950,
    direction: 'long',
  })
  const [results, setResults] = useState<ForexResult | null>(null)

  useEffect(() => {
    const calculated = calculateForex(inputs)
    setResults(calculated)
  }, [inputs])

  const handleInputChange = (field: keyof ForexInput, value: string | number) => {
    setInputs(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const calculatorForm = (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Currency Pair
        </label>
        <select
          value={inputs.pair}
          onChange={(e) => handleInputChange('pair', e.target.value)}
          className="input-field"
        >
          {FOREX_PAIRS.map(pair => (
            <option key={pair.pair} value={pair.pair}>{pair.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Lot Type
        </label>
        <div className="flex rounded-lg border-2 border-gray-300 dark:border-gray-600 overflow-hidden">
          <button
            className={`flex-1 py-2 px-3 text-sm font-medium transition-colors ${
              inputs.lotType === 'standard'
                ? 'bg-primary text-white'
                : 'bg-white dark:bg-dark-surface text-gray-700 dark:text-gray-300'
            }`}
            onClick={() => handleInputChange('lotType', 'standard')}
          >
            Standard (100K)
          </button>
          <button
            className={`flex-1 py-2 px-3 text-sm font-medium transition-colors ${
              inputs.lotType === 'mini'
                ? 'bg-primary text-white'
                : 'bg-white dark:bg-dark-surface text-gray-700 dark:text-gray-300'
            }`}
            onClick={() => handleInputChange('lotType', 'mini')}
          >
            Mini (10K)
          </button>
          <button
            className={`flex-1 py-2 px-3 text-sm font-medium transition-colors ${
              inputs.lotType === 'micro'
                ? 'bg-primary text-white'
                : 'bg-white dark:bg-dark-surface text-gray-700 dark:text-gray-300'
            }`}
            onClick={() => handleInputChange('lotType', 'micro')}
          >
            Micro (1K)
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Number of Lots
        </label>
        <input
          type="number"
          step="0.1"
          value={inputs.tradeSize}
          onChange={(e) => handleInputChange('tradeSize', parseFloat(e.target.value) || 0)}
          className="input-field"
          placeholder="1"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Entry Price
          </label>
          <input
            type="number"
            step="0.0001"
            value={inputs.entryPrice}
            onChange={(e) => handleInputChange('entryPrice', parseFloat(e.target.value) || 0)}
            className="input-field"
            placeholder="1.0850"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Exit Price
          </label>
          <input
            type="number"
            step="0.0001"
            value={inputs.exitPrice}
            onChange={(e) => handleInputChange('exitPrice', parseFloat(e.target.value) || 0)}
            className="input-field"
            placeholder="1.0950"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Trade Direction
        </label>
        <div className="flex rounded-lg border-2 border-gray-300 dark:border-gray-600 overflow-hidden">
          <button
            className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
              inputs.direction === 'long'
                ? 'bg-green-500 text-white'
                : 'bg-white dark:bg-dark-surface text-gray-700 dark:text-gray-300'
            }`}
            onClick={() => handleInputChange('direction', 'long')}
          >
            Long (Buy)
          </button>
          <button
            className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
              inputs.direction === 'short'
                ? 'bg-red-500 text-white'
                : 'bg-white dark:bg-dark-surface text-gray-700 dark:text-gray-300'
            }`}
            onClick={() => handleInputChange('direction', 'short')}
          >
            Short (Sell)
          </button>
        </div>
      </div>
    </div>
  )

  const resultsDisplay = results ? {
    mainResult: {
      label: 'Profit/Loss',
      value: formatCurrency(Math.abs(results.profitOrLoss)),
      subtext: results.profitOrLoss >= 0 ? 'Profit' : 'Loss',
    },
    cards: [
      { label: 'Total Pips', value: results.totalPips, color: results.profitOrLoss >= 0 ? '#10B981' : '#EF4444' },
      { label: 'Pip Value', value: formatCurrency(results.pipValue), color: '#2563EB' },
      { label: 'Margin Req.', value: formatCurrency(results.marginRequired), color: '#F59E0B' },
    ],
    barData: [
      { name: 'Entry', value: inputs.entryPrice },
      { name: 'Exit', value: inputs.exitPrice },
      { name: 'Breakeven', value: results.breakEvenPrice },
    ],
  } : null

  return (
    <CalculatorPageTemplate
      id="forex"
      name="Forex Calculator"
      description="Calculate potential profit or loss for forex trades"
      path="/calculators/forex"
      heroContent="Forex trading involves complex calculations for position size, pip value, and potential profit or loss. Our Forex Calculator simplifies these calculations, helping traders quickly evaluate trade setups before executing. Whether you're evaluating potential trades, planning position sizing, or analyzing past trades, this calculator provides the key metrics—pip value, margin requirements, and profit/loss in your account currency."
      calculatorForm={calculatorForm}
      results={resultsDisplay || {}}
      whatNumbersMean="Profit/Loss shows your actual gain or loss in currency terms. Total pips is the distance between entry and exit, multiplied by direction. Pip value tells you what each pip movement is worth in your account currency. Margin required is the collateral needed to open the position based on leverage. Break-even price accounts for spread costs."
      whyItMatters="Risk management in forex requires knowing exactly what you stand to gain or lose per trade. Pip value varies by currency pair and lot size—standardizing this knowledge helps maintain consistent risk across trades. Understanding margin requirements prevents margin calls and forced liquidation. This calculator provides essential information for proper position sizing."
      howToUse={[
        "Select your currency pair from the major pairs.",
        "Choose your lot size (standard, mini, or micro).",
        "Enter the number of lots you want to trade.",
        "Input your entry and target exit prices.",
        "Specify long or short direction to see your potential profit.",
      ]}
      faqItems={[
        { question: "What is a pip in forex?", answer: "A pip (percentage in point) is typically the fourth decimal place in most currency pairs. For pairs with JPY, it is the second decimal. Pip value depends on lot size and currency pair. A pip is the standard unit for measuring price movement in forex." },
        { question: "What lot size should I trade?", answer: "Risk 1-2% of your account per trade. For a $10,000 account, that's $100-200 risk max. Calculate lot size based on stop-loss distance and pip value. New traders should consider micro lots until consistently profitable." },
        { question: "What is leverage in forex?", answer: "Leverage allows controlling larger positions with less capital. 100:1 leverage means $1,000 controls $100,000. While leverage increases potential profit, it equally increases risk. High leverage is dangerous for inexperienced traders." },
        { question: "How much margin do I need?", answer: "Margin = Position Size / Leverage. With 100:1 leverage, a standard lot ($100,000) requires $1,000 margin. Margin is your collateral—it is locked while the position is open. Insufficient margin triggers a margin call." },
        { question: "What is spread in forex?", answer: "Spread is the difference between bid and ask prices—the cost of trading. Major pairs typically have 1-3 pip spreads. Lower spreads mean lower trading costs. The calculator accounts for spread in break-even calculations." },
        { question: "How do I calculate position size?", answer: "Position Size = (Account Risk) / (Stop Loss in Pips × Pip Value). For 1% risk on $10,000 with a 50-pip stop, risk $100 divided by (50 × $10 per pip for standard) = 0.02 standard lots or 2 mini lots." },
        { question: "What are the best currency pairs for beginners?", answer: "Start with major pairs like EUR/USD, GBP/USD—they have tight spreads and good liquidity. Avoid exotic pairs with higher spreads and volatility. Trade 1-2 pairs initially to learn their behavior." },
        { question: "How do I manage risk in forex?", answer: "Always use stop-losses. Risk 1-2% per trade maximum. Maintain positive risk-reward ratios (target > risk). Don't over-leverage. Keep a trading journal. Trade with a plan, not emotions." },
      ]}
    />
  )
}
