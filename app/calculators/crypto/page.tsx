'use client'

import React, { useState, useEffect } from 'react'
import CalculatorPageTemplate from '@/components/calculators/CalculatorPageTemplate'
import { calculateCrypto, getCryptoList, CryptoInput, CryptoResult } from '@/lib/calculations/crypto'
import { formatCurrency, formatPercent } from '@/lib/utils/format'

export default function CryptoCalculatorPage() {
  const cryptos = getCryptoList()
  const [inputs, setInputs] = useState<CryptoInput>({
    cryptocurrency: 'bitcoin',
    amount: 1,
    purchasePrice: 30000,
    currentPrice: 62000,
  })
  const [results, setResults] = useState<CryptoResult | null>(null)

  useEffect(() => {
    const calculated = calculateCrypto(inputs)
    setResults(calculated)
  }, [inputs])

  const handleInputChange = (field: keyof CryptoInput, value: string | number) => {
    setInputs(prev => ({
      ...prev,
      [field]: typeof value === 'string' && field !== 'cryptocurrency'
        ? parseFloat(value) || 0
        : value,
    }))
  }

  const calculatorForm = (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Cryptocurrency
        </label>
        <select
          value={inputs.cryptocurrency}
          onChange={(e) => handleInputChange('cryptocurrency', e.target.value)}
          className="input-field"
        >
          <option value="bitcoin">Bitcoin (BTC)</option>
          <option value="ethereum">Ethereum (ETH)</option>
          <option value="solana">Solana (SOL)</option>
          <option value="cardano">Cardano (ADA)</option>
          <option value="xrp">XRP</option>
          <option value="polkadot">Polkadot (DOT)</option>
          <option value="dogecoin">Dogecoin (DOGE)</option>
          <option value="avalanche">Avalanche (AVAX)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Amount Held
        </label>
        <input
          type="number"
          step="0.001"
          value={inputs.amount}
          onChange={(e) => handleInputChange('amount', e.target.value)}
          className="input-field"
          placeholder="1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Purchase Price (per coin)
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <input
            type="number"
            value={inputs.purchasePrice}
            onChange={(e) => handleInputChange('purchasePrice', e.target.value)}
            className="input-field pl-8"
            placeholder="30000"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Current Price (per coin)
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <input
            type="number"
            value={inputs.currentPrice}
            onChange={(e) => handleInputChange('currentPrice', e.target.value)}
            className="input-field pl-8"
            placeholder="62000"
          />
        </div>
      </div>
    </div>
  )

  const resultsDisplay = results ? {
    mainResult: {
      label: 'Current Value',
      value: formatCurrency(results.currentValue),
      subtext: `${results.gainOrLoss >= 0 ? '+' : ''}${formatCurrency(results.gainOrLoss)} (${formatPercent(results.gainOrLossPercent)})`,
    },
    cards: [
      { label: 'Initial Value', value: formatCurrency(results.initialValue), color: '#2563EB' },
      { label: 'Gain/Loss', value: formatCurrency(results.gainOrLoss), color: results.gainOrLoss >= 0 ? '#10B981' : '#EF4444' },
      { label: 'Est. Tax', value: formatCurrency(results.estimatedTax), color: '#F59E0B' },
    ],
    barData: results.priceTargets.slice(0, 4).map(t => ({
      name: `+${t.gainPercent}%`,
      value: t.value,
    })),
  } : null

  return (
    <CalculatorPageTemplate
      id="crypto"
      name="Cryptocurrency Calculator"
      description="Calculate your crypto gains, losses, and potential tax obligations"
      path="/calculators/crypto"
      heroContent="Cryptocurrency investments can generate significant gains—or losses—making it crucial to track your true performance and understand potential tax implications. Our Cryptocurrency Calculator shows your current portfolio value, total gain or loss, and estimates your tax liability if you were to sell. Unlike traditional investments, crypto trades frequently and across many platforms, making gain calculations complex. This calculator simplifies the process so you know exactly where you stand."
      calculatorForm={calculatorForm}
      results={resultsDisplay || {}}
      whatNumbersMean="Current value shows what your holdings are worth at current prices. Initial value is what you paid. Gain or loss is the difference—positive means profit, negative means loss. The percentage shows relative performance. Estimated tax assumes long-term capital gains rates (15% typical) if held over 1 year; short-term rates would be higher. The tax estimate helps you plan for potential tax liability."
      whyItMatters="Understanding your crypto gains helps with financial planning and tax preparation. Crypto gains are taxable events—you owe taxes on profits when you sell or exchange. The calculator estimates this liability so you can set aside funds. It also shows price targets to help evaluate when to take profits or whether to continue holding."
      howToUse={[
        "Select your cryptocurrency from the dropdown.",
        "Enter the amount you hold.",
        "Input your purchase price per coin.",
        "Enter the current market price.",
        "Review gains, losses, and estimated tax implications.",
      ]}
      faqItems={[
        { question: 'How are crypto gains taxed?', answer: 'In the US, crypto is taxed as property. Short-term gains (held under 1 year) are taxed as ordinary income (10-37%). Long-term gains (over 1 year) are taxed at 0%, 15%, or 20% depending on your income bracket. Each trade or sale is a taxable event.' },
        { question: 'What about crypto losses?', answer: 'Crypto losses offset gains, reducing your tax bill. You can claim up to $3,000 in net losses against ordinary income per year. Excess losses carry forward. Harvesting losses before year-end is a common tax strategy.' },
        { question: 'How do I track cost basis?', answer: 'Cost basis is what you paid plus fees. For multiple purchases, use specific identification (you choose which coins to sell) or average cost. Keep detailed records of all purchases, trades, and transfers for accurate calculations.' },
        { question: 'What about crypto-to-crypto trades?', answer: 'Swapping one crypto for another is a taxable event—you realize gains on the first coin even though you didn't cash to fiat. Track each trade for cost basis and gain/loss. Many exchanges provide transaction history for tax reporting.' },
        { question: 'Are airdrops and staking rewards taxable?', answer: 'Yes, airdrops and staking rewards are taxable as ordinary income when received, based on fair market value. Your cost basis becomes the value when received. Later sale triggers capital gains on price changes.' },
        { question: 'What is the wash sale rule?', answer: 'The wash sale rule currently applies to stocks, not crypto (though this may change). You can sell crypto at a loss and immediately repurchase, unlike stocks where you must wait 30 days. However, stay aware of potential regulatory changes.' },
        { question: 'Do I need to report crypto if I didn't sell?', answer: 'You don't pay taxes on unrealized gains, but may need to report holdings depending on amounts and jurisdiction. FBAR reporting may apply. Check current requirements—crypto tax rules continue evolving.' },
        { question: 'What if I lost my crypto records?', answer: 'Many exchanges provide historical data. Blockchain explorers show public transactions. If records are incomplete, you may have to use estimated amounts or average prices, which could raise audit concerns. Always backup transaction records.' },
      ]}
    />
  )
}
