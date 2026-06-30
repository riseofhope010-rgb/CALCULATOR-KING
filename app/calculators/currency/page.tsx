'use client'

import { useState, useEffect } from 'react'
import CalculatorPageTemplate from '@/components/calculators/CalculatorPageTemplate'
import { convertCurrency, getCurrencyList, CurrencyInput, CurrencyResult } from '@/lib/calculations/currency'
import { formatCurrency, formatNumber } from '@/lib/utils/format'

const CURRENCY_NAMES: Record<string, string> = {
  USD: 'US Dollar', EUR: 'Euro', GBP: 'British Pound', JPY: 'Japanese Yen',
  CAD: 'Canadian Dollar', AUD: 'Australian Dollar', CHF: 'Swiss Franc',
  CNY: 'Chinese Yuan', INR: 'Indian Rupee', MXN: 'Mexican Peso',
  BRL: 'Brazilian Real', KRW: 'South Korean Won', SGD: 'Singapore Dollar',
  HKD: 'Hong Kong Dollar', NZD: 'New Zealand Dollar',
}

export default function CurrencyConverterPage() {
  const currencies = getCurrencyList()
  const [inputs, setInputs] = useState<CurrencyInput>({
    amount: 1000,
    fromCurrency: 'USD',
    toCurrency: 'EUR',
  })
  const [results, setResults] = useState<CurrencyResult | null>(null)

  useEffect(() => {
    const converted = convertCurrency(inputs)
    setResults(converted)
  }, [inputs])

  const handleInputChange = (field: keyof CurrencyInput, value: string | number) => {
    setInputs(prev => ({
      ...prev,
      [field]: typeof value === 'string' && field !== 'fromCurrency' && field !== 'toCurrency'
        ? parseFloat(value) || 0
        : value,
    }))
  }

  const swapCurrencies = () => {
    setInputs(prev => ({
      ...prev,
      fromCurrency: prev.toCurrency,
      toCurrency: prev.fromCurrency,
    }))
  }

  const calculatorForm = (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Amount
        </label>
        <input
          type="number"
          value={inputs.amount}
          onChange={(e) => handleInputChange('amount', e.target.value)}
          className="input-field"
          placeholder="1000"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          From Currency
        </label>
        <select
          value={inputs.fromCurrency}
          onChange={(e) => handleInputChange('fromCurrency', e.target.value)}
          className="input-field"
        >
          {currencies.map(code => (
            <option key={code} value={code}>{code} - {CURRENCY_NAMES[code]}</option>
          ))}
        </select>
      </div>

      <button
        onClick={swapCurrencies}
        className="w-full flex items-center justify-center gap-2 py-2 text-primary hover:bg-primary/5 rounded-lg transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
        Swap Currencies
      </button>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          To Currency
        </label>
        <select
          value={inputs.toCurrency}
          onChange={(e) => handleInputChange('toCurrency', e.target.value)}
          className="input-field"
        >
          {currencies.map(code => (
            <option key={code} value={code}>{code} - {CURRENCY_NAMES[code]}</option>
          ))}
        </select>
      </div>
    </div>
  )

  const resultsDisplay = results ? {
    mainResult: {
      label: `${formatNumber(results.originalAmount)} ${results.fromCurrency} =`,
      value: `${formatNumber(results.convertedAmount)} ${results.toCurrency}`,
      subtext: `1 ${results.fromCurrency} = ${formatNumber(results.exchangeRate)} ${results.toCurrency}`,
    },
    cards: [
      { label: 'Exchange Rate', value: formatNumber(results.exchangeRate), color: '#2563EB' },
      { label: 'Inverse Rate', value: formatNumber(results.inverseRate), color: '#10B981' },
    ],
  } : null

  return (
    <CalculatorPageTemplate
      id="currency"
      name="Currency Converter"
      description="Convert between world currencies with live exchange rates"
      path="/calculators/currency"
      heroContent="In our interconnected global economy, currency conversion is essential for travelers, international shoppers, freelancers working with global clients, investors, and anyone dealing with multiple currencies. Our Currency Converter provides instant conversions between 30+ major world currencies using current exchange rates. Whether you're planning a trip abroad, purchasing from international retailers, or simply curious about how much your money is worth in another currency, this tool gives you accurate conversions with both the current rate and its inverse."
      calculatorForm={calculatorForm}
      results={resultsDisplay || {}}
      whatNumbersMean="The converted amount shows how much your money is worth in the target currency based on current exchange rates. The exchange rate tells you how much of the target currency one unit of your source currency buys. The inverse rate shows the opposite—how much source currency you would need to buy one unit of target currency. These rates fluctuate constantly based on market conditions."
      whyItMatters="Understanding currency values helps you make informed decisions about international purchases, travel budgets, and global investments. When planning travel, knowing the exchange rate helps you budget properly and identify when you're getting fair rates for currency exchanges. For online shopping, you can compare prices in different countries. Investors need to consider currency effects on international investments."
      howToUse={[
        "Enter the amount you want to convert.",
        "Select the currency you're converting from.",
        "Click swap if you want to reverse the conversion.",
        "Select the target currency you want to convert to.",
        "See the instant result with current exchange rate and its inverse.",
      ]}
      faqItems={[
        { question: 'How accurate are these exchange rates?', answer: 'Rates are based on current market data and updated regularly. Actual rates when exchanging money may differ due to bank spreads, fees, and real-time fluctuations. For precise transactions, always check with your bank or exchange service.' },
        { question: 'Why do exchange rates change?', answer: 'Exchange rates fluctuate based on supply and demand, economic indicators, interest rates, inflation, political stability, and market speculation. Major economic events or announcements can cause significant rate movements.' },
        { question: 'What is the best way to exchange currency?', answer: 'For travel, use credit cards with no foreign transaction fees for the best rates. ATM withdrawals usually offer good rates. Avoid airport exchange kiosks—they often have the worst rates and highest fees.' },
        { question: 'What are foreign transaction fees?', answer: 'Many credit cards charge 3% for foreign transactions. Some cards have no foreign transaction fees. Always check your card terms before traveling or making international purchases.' },
        { question: 'Should I pay in local currency or my home currency?', answer: 'When given the choice while traveling, pay in local currency. Paying in your home currency through dynamic currency conversion typically results in worse rates and extra fees.' },
        { question: 'How do currency effects impact investments?', answer: 'International investments gain or lose value when currencies change. A weak dollar benefits US investors in foreign assets, while a strong dollar hurts those returns. Consider currency-hedged funds if concerned about exchange rate risk.' },
        { question: 'What is currency arbitrage?', answer: 'Currency arbitrage is buying currency in one market and selling in another to profit from price differences. This is typically done by large financial institutions with sophisticated trading systems, not individual investors.' },
        { question: 'How do forward contracts work for currency?', answer: 'Forward contracts let you lock in an exchange rate for a future date, protecting against rate changes. Businesses use these to hedge currency risk on international transactions. Individuals can access similar tools through some banks.' },
      ]}
    />
  )
}
