'use client'

import { useState, useEffect } from 'react'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils/format'
import { calculateROI } from '@/lib/calculations/roi'
import { calculateSalary } from '@/lib/calculations/salary'
import { calculateTax } from '@/lib/calculations/tax'
import { calculateMortgage } from '@/lib/calculations/mortgage'
import { calculateInvestment } from '@/lib/calculations/investment'
import { calculateCompoundInterest } from '@/lib/calculations/compound-interest'
import { calculateLoan } from '@/lib/calculations/loan'
import { calculateLoanEMI } from '@/lib/calculations/loan-emi'
import { calculateRetirement } from '@/lib/calculations/retirement'
import { convertCurrency } from '@/lib/calculations/currency'
import { calculateBMI } from '@/lib/calculations/bmi'
import { calculateCalories } from '@/lib/calculations/calorie'
import { calculateFreelanceRate } from '@/lib/calculations/freelance-rate'
import { calculateAffiliate } from '@/lib/calculations/affiliate'
import { calculateCrypto } from '@/lib/calculations/crypto'
import { calculateForex } from '@/lib/calculations/forex'
import { calculateContractorIncome } from '@/lib/calculations/contractor'
import { calculatePension } from '@/lib/calculations/pension'
import { calculateProfitMargin } from '@/lib/calculations/profit-margin'

interface DynamicCalculatorProps {
  calculatorId: string
  defaultSalary: number
  locationData: {
    id: string
    name: string
    state: string | null
    country: string
    currency: string
    stateTaxRate: number
    costOfLiving: number
  }
  roleData: {
    id: string
    name: string
    category: string
    description: string
  }
  locationId: string
  roleId: string
}

// Calculators that deal with money (show currency symbol, salary context, currency-formatted results)
const FINANCIAL_CALCULATORS = new Set([
  'salary', 'tax', 'mortgage', 'investment', 'compound-interest', 'loan', 'loan-emi',
  'retirement', 'currency', 'freelance-rate', 'roi', 'affiliate-commission',
  'cost-of-living', 'crypto', 'forex', 'contractor-income', 'pension', 'profit-margin',
])

// Calculators whose INPUT field is a count/duration, not a money amount,
// even though the calculator itself is otherwise financial (e.g. pension uses
// "Years of Service", affiliate-commission uses "Monthly Clicks")
const NON_CURRENCY_INPUT = new Set(['affiliate-commission', 'pension'])

// Health calculators use physical units (kg, cm) and have nothing to do with salary/currency
const HEALTH_CALCULATORS = new Set(['bmi', 'calorie'])

// Currency symbol for the input prefix (R$ for BRL, $ for USD, € for EUR, ...).
// The old code printed the raw code ("BRL", clipped to "BR" on the page) instead.
const getCurrencySymbol = (currency: string): string => {
  try {
    const part = new Intl.NumberFormat('en-US', { style: 'currency', currency })
      .formatToParts(0)
      .find(p => p.type === 'currency')
    return part ? part.value : currency
  } catch {
    return currency
  }
}

// Extra inputs some calculators need beyond the single main input.
// Defaults keep the old first impression (same numbers the page showed before)
// while the math behind them is now the real lib, not a hardcoded formula.
interface ExtraInputDef {
  key: string
  label: string
  defaultValue: number | ((defaultSalary: number) => number)
  isCurrency?: boolean
}

const EXTRA_INPUTS: Record<string, ExtraInputDef[]> = {
  mortgage: [
    { key: 'rate', label: 'Interest Rate (%)', defaultValue: 7.8 },
    { key: 'termYears', label: 'Loan Term (years)', defaultValue: 30 },
  ],
  investment: [
    { key: 'returnPct', label: 'Expected Return (%)', defaultValue: 8 },
    { key: 'years', label: 'Investment Period (years)', defaultValue: 10 },
  ],
  'compound-interest': [
    { key: 'rate', label: 'Annual Rate (%)', defaultValue: 8 },
    { key: 'years', label: 'Years', defaultValue: 10 },
  ],
  loan: [
    { key: 'rate', label: 'Interest Rate (%)', defaultValue: 9 },
    { key: 'termMonths', label: 'Loan Term (months)', defaultValue: 60 },
  ],
  'loan-emi': [
    { key: 'rate', label: 'Annual Rate (%)', defaultValue: 9 },
    { key: 'tenureMonths', label: 'Tenure (months)', defaultValue: 60 },
  ],
  retirement: [
    { key: 'returnPct', label: 'Expected Return (%)', defaultValue: 7 },
    { key: 'monthlyContribution', label: 'Monthly Contribution', defaultValue: 0, isCurrency: true },
  ],
  crypto: [
    { key: 'buyPrice', label: 'Purchase Price (per coin)', defaultValue: 100, isCurrency: true },
    { key: 'currentPrice', label: 'Current Price (per coin)', defaultValue: 100, isCurrency: true },
  ],
  forex: [
    { key: 'entryPrice', label: 'Entry Price', defaultValue: 1.085 },
    { key: 'exitPrice', label: 'Exit Price', defaultValue: 1.087 },
  ],
  roi: [
    { key: 'finalValue', label: 'Final Value', defaultValue: (s: number) => s * 1.15, isCurrency: true },
    { key: 'periodYears', label: 'Investment Period (years)', defaultValue: 1 },
  ],
}

export default function GenericCalculatorDynamic({
  calculatorId,
  defaultSalary,
  locationData,
  roleData,
}: DynamicCalculatorProps) {
  const isFinancial = FINANCIAL_CALCULATORS.has(calculatorId)
  const isHealth = HEALTH_CALCULATORS.has(calculatorId)
  const showCurrencyOnInput = isFinancial && !NON_CURRENCY_INPUT.has(calculatorId)

  // For health calculators, start from a sensible default weight (70kg) instead of a salary figure.
  // For non-currency financial inputs (years, click counts), use a sensible default instead of a salary number.
  const getDefaultInputValue = () => {
    if (isHealth) return 70
    if (calculatorId === 'pension') return 10 // years of service
    if (calculatorId === 'affiliate-commission') return 10000 // monthly clicks
    return defaultSalary
  }
  const [inputValue, setInputValue] = useState(getDefaultInputValue())
  const [heightCm, setHeightCm] = useState(170)
  // Extra inputs for this calculator (rate, term, prices, ...), initialised from
  // the config defaults above.
  const [extras, setExtras] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {}
    for (const def of EXTRA_INPUTS[calculatorId] ?? []) {
      init[def.key] = typeof def.defaultValue === 'function' ? def.defaultValue(defaultSalary) : def.defaultValue
    }
    return init
  })
  const [results, setResults] = useState<Record<string, number | string>>({})

  useEffect(() => {
    const calculated = calculateResults(calculatorId, inputValue, locationData, heightCm, extras, defaultSalary)
    setResults(calculated)
  }, [calculatorId, inputValue, heightCm, locationData, extras, defaultSalary])

  const getInputLabel = () => {
    switch (calculatorId) {
      case 'salary':
      case 'tax':
        return 'Gross Annual Income'
      case 'mortgage':
        return 'Home Price'
      case 'investment':
      case 'compound-interest':
        return 'Initial Investment'
      case 'loan':
      case 'loan-emi':
        return 'Loan Amount'
      case 'retirement':
        return 'Current Savings'
      case 'currency':
        return 'Amount to Convert'
      case 'bmi':
        return 'Weight (kg)'
      case 'calorie':
        return 'Current Weight (kg)'
      case 'freelance-rate':
        return 'Desired Annual Income'
      case 'roi':
        return 'Initial Investment'
      case 'affiliate-commission':
        return 'Monthly Clicks'
      case 'cost-of-living':
        return 'Current Salary'
      case 'crypto':
        return 'Investment Amount'
      case 'forex':
        return 'Trade Amount'
      case 'contractor-income':
        return 'Annual Revenue'
      case 'pension':
        return 'Years of Service'
      case 'profit-margin':
        return 'Revenue'
      default:
        return 'Amount'
    }
  }

  const getResultLabel = () => {
    switch (calculatorId) {
      case 'salary':
        return 'Net Monthly Pay'
      case 'tax':
        return 'Take-Home Pay'
      case 'mortgage':
        return 'Monthly Payment'
      case 'investment':
      case 'compound-interest':
        return 'Future Value'
      case 'loan':
      case 'loan-emi':
        return 'Monthly Payment'
      case 'retirement':
        return 'Projected Savings'
      case 'currency':
        return 'Converted Amount'
      case 'bmi':
        return 'Your BMI'
      case 'calorie':
        return 'Daily Calories'
      case 'freelance-rate':
        return 'Hourly Rate'
      case 'roi':
        return 'Return on Investment'
      case 'affiliate-commission':
        return 'Monthly Revenue'
      case 'cost-of-living':
        return 'Equivalent Salary'
      case 'crypto':
        return 'Current Value'
      case 'forex':
        return 'Profit/Loss'
      case 'contractor-income':
        return 'Net Income'
      case 'pension':
        return 'Monthly Pension'
      case 'profit-margin':
        return 'Net Profit Margin'
      default:
        return 'Result'
    }
  }

  const formatResult = (value: number): string => {
    if (isFinancial) {
      if (['roi', 'profit-margin'].includes(calculatorId)) {
        return formatPercent(value)
      }
      if (calculatorId === 'currency') {
        // The converted amount is in the TARGET currency, not the location's.
        return formatCurrency(value, locationData.currency === 'USD' ? 'EUR' : 'USD')
      }
      return formatCurrency(value, locationData.currency)
    }
    if (calculatorId === 'calorie') {
      return `${formatNumber(value, 0)} kcal`
    }
    return formatNumber(value, 2)
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {getInputLabel()}{showCurrencyOnInput ? ` (${locationData.currency})` : ''}
            </label>
            <div className="relative">
              {showCurrencyOnInput && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  {getCurrencySymbol(locationData.currency)}
                </span>
              )}
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(parseFloat(e.target.value) || 0)}
                className={`input-field w-full ${showCurrencyOnInput ? 'pl-8' : ''}`}
              />
            </div>
          </div>

          {(calculatorId === 'bmi' || calculatorId === 'calorie') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Height (cm)
              </label>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(parseFloat(e.target.value) || 0)}
                className="input-field w-full"
              />
            </div>
          )}

          {(EXTRA_INPUTS[calculatorId] ?? []).map((def) => {
            const defValue = typeof def.defaultValue === 'function' ? def.defaultValue(defaultSalary) : def.defaultValue
            return (
              <div key={def.key}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {def.label}{def.isCurrency ? ` (${locationData.currency})` : ''}
                </label>
                <div className="relative">
                  {def.isCurrency && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      {getCurrencySymbol(locationData.currency)}
                    </span>
                  )}
                  <input
                    type="number"
                    step="any"
                    value={extras[def.key] ?? defValue}
                    onChange={(e) => setExtras((prev) => ({ ...prev, [def.key]: parseFloat(e.target.value) || 0 }))}
                    className={`input-field w-full ${def.isCurrency ? 'pl-8' : ''}`}
                  />
                </div>
              </div>
            )
          })}

          {isFinancial && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {roleData.name} average in {locationData.name}: {formatCurrency(defaultSalary, locationData.currency)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                State tax rate: {(locationData.stateTaxRate * 100).toFixed(1)}%
              </p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-primary/10 dark:bg-primary/20 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">{getResultLabel()}</p>
            <p className="text-2xl font-bold text-primary">
              {formatResult(results.mainResult as number || 0)}
            </p>
            {results.secondaryResult !== undefined && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {results.secondaryLabel}: {formatResult(results.secondaryResult as number)}
              </p>
            )}
          </div>
          {Object.keys(results).filter(k => k !== 'mainResult' && k !== 'secondaryResult' && k !== 'secondaryLabel').length > 0 && (
            <div className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(results)
                .filter(([key]) => key !== 'mainResult' && key !== 'secondaryResult' && key !== 'secondaryLabel')
                .slice(0, 4)
                .map(([key, value]) => (
                  <div key={key} className="bg-gray-50 dark:bg-gray-700 rounded p-2">
                    <span className="text-gray-600 dark:text-gray-400 text-xs">{key}</span>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {typeof value === 'number' ? formatResult(value) : value}
                    </p>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function calculateResults(calculatorId: string, inputValue: number, locationData: { state: string | null; stateTaxRate: number; costOfLiving: number; currency: string }, heightCm: number = 170, extras: Record<string, number> = {}, defaultSalary: number = 0): Record<string, number | string> {
  switch (calculatorId) {
    case 'salary': {
      // Real 2024 federal brackets + FICA from the lib; state tax uses the
      // location's own rate (the same rate shown in the info box above).
      const r = calculateSalary({ grossSalary: inputValue, state: '', filingStatus: 'single', dependents: 0, retirement401k: 0 })
      const stateTax = r.taxableIncome * locationData.stateTaxRate
      const netAnnual = inputValue - (r.federalTax + stateTax + r.socialSecurity + r.medicare)
      return {
        mainResult: netAnnual / 12,
        secondaryResult: netAnnual,
        secondaryLabel: 'Annual',
        'Federal Tax': formatCurrency(r.federalTax, locationData.currency),
        'State Tax': formatCurrency(stateTax, locationData.currency),
        'FICA': formatCurrency(r.socialSecurity + r.medicare, locationData.currency),
        'Effective Rate': formatPercent(inputValue > 0 ? ((inputValue - netAnnual) / inputValue) * 100 : 0),
      }
    }
    case 'tax': {
      const r = calculateTax({ annualIncome: inputValue, state: '', filingStatus: 'single', itemizedDeductions: 0, taxCredits: 0 })
      const stateTax = r.taxableIncome * locationData.stateTaxRate
      const totalTax = r.federalTax + stateTax
      return {
        mainResult: inputValue - totalTax,
        secondaryResult: totalTax,
        secondaryLabel: 'Total Tax',
        'Federal Tax': formatCurrency(r.federalTax, locationData.currency),
        'State Tax': formatCurrency(stateTax, locationData.currency),
        'Effective Rate': formatPercent(inputValue > 0 ? (totalTax / inputValue) * 100 : 0),
      }
    }
    case 'mortgage': {
      const r = calculateMortgage({
        homePrice: inputValue,
        downPaymentPercent: 20,
        downPaymentAmount: 0,
        loanTerm: extras['termYears'] ?? 30,
        interestRate: extras['rate'] ?? 7.8,
        propertyTax: 0,
        insurance: 0,
        hoa: 0,
        pmi: 0,
      })
      return {
        mainResult: r.totalMonthlyPayment,
        secondaryResult: r.totalInterest,
        secondaryLabel: 'Total Interest',
        'Principal & Interest': formatCurrency(r.monthlyPrincipalInterest, locationData.currency),
        'Down Payment': formatCurrency(r.downPayment, locationData.currency),
        'Loan Amount': formatCurrency(r.loanAmount, locationData.currency),
      }
    }
    case 'investment': {
      const r = calculateInvestment({
        initialInvestment: inputValue,
        monthlyContribution: 0,
        expectedReturn: extras['returnPct'] ?? 8,
        years: extras['years'] ?? 10,
        inflationRate: 0,
      })
      return {
        mainResult: r.futureValue,
        secondaryResult: r.interestEarned,
        secondaryLabel: 'Total Gain',
        'Contributions': formatCurrency(r.totalContributions, locationData.currency),
      }
    }
    case 'compound-interest': {
      const r = calculateCompoundInterest({
        principal: inputValue,
        annualRate: extras['rate'] ?? 8,
        years: extras['years'] ?? 10,
        compoundFrequency: 'annually',
      })
      return {
        mainResult: r.finalBalance,
        secondaryResult: r.totalInterest,
        secondaryLabel: 'Total Interest',
        'Effective Rate': formatPercent(r.effectiveRate),
      }
    }
    case 'loan': {
      const r = calculateLoan({
        loanAmount: inputValue,
        interestRate: extras['rate'] ?? 9,
        loanTerm: extras['termMonths'] ?? 60,
      })
      return {
        mainResult: r.monthlyPayment,
        secondaryResult: r.totalInterest,
        secondaryLabel: 'Total Interest',
        'Total Payments': formatCurrency(r.totalPayments, locationData.currency),
      }
    }
    case 'loan-emi': {
      const r = calculateLoanEMI({
        principal: inputValue,
        annualRate: extras['rate'] ?? 9,
        tenureMonths: extras['tenureMonths'] ?? 60,
      })
      return {
        mainResult: r.emi,
        secondaryResult: r.totalInterest,
        secondaryLabel: 'Total Interest',
        'Total Payment': formatCurrency(r.totalPayment, locationData.currency),
        'Interest': formatPercent(r.interestPercentage),
      }
    }
    case 'retirement': {
      const r = calculateRetirement({
        currentAge: 35,
        retirementAge: 65,
        currentSavings: inputValue,
        monthlyContribution: extras['monthlyContribution'] ?? 0,
        expectedReturn: extras['returnPct'] ?? 7,
        socialSecurity: 0,
        retirementExpenses: 0,
      })
      return {
        mainResult: r.projectedSavings,
        secondaryResult: r.monthlyIncomeAtRetirement,
        secondaryLabel: 'Monthly Income',
        'Years to Retire': `${r.yearsToRetirement} years`,
      }
    }
    case 'currency': {
      // Real conversion from the lib's rate table (location currency -> USD,
      // or -> EUR when the location already uses USD). The old code just did x0.85.
      const target = locationData.currency === 'USD' ? 'EUR' : 'USD'
      const r = convertCurrency({ amount: inputValue, fromCurrency: locationData.currency, toCurrency: target })
      return {
        mainResult: r.convertedAmount,
        'Exchange Rate': `1 ${locationData.currency} = ${r.exchangeRate.toFixed(4)} ${target}`,
        'Converted To': target,
      }
    }
    case 'bmi': {
      const r = calculateBMI({ weight: inputValue, height: heightCm, unit: 'metric' })
      return {
        mainResult: r.bmi,
        'Category': r.category,
        'Healthy Range': `${r.healthyWeightRange.min} – ${r.healthyWeightRange.max} kg`,
      }
    }
    case 'calorie': {
      const r = calculateCalories({ age: 30, weight: inputValue, height: heightCm, gender: 'male', activityLevel: 'moderate', goal: 'maintain' })
      return {
        mainResult: r.targetCalories,
        secondaryResult: r.tdee,
        secondaryLabel: 'TDEE',
        'Protein': `${r.proteinGrams} g`,
        'Carbs': `${r.carbsGrams} g`,
        'Fat': `${r.fatGrams} g`,
      }
    }
    case 'freelance-rate': {
      // 40 billable hours x 52 weeks; the location's tax rate is now actually
      // used (before it was only displayed, never applied).
      const r = calculateFreelanceRate({
        desiredAnnualIncome: inputValue,
        billableHoursPerWeek: 40,
        weeksPerYear: 52,
        expenses: 0,
        taxRate: locationData.stateTaxRate * 100,
      })
      return {
        mainResult: r.hourlyRate,
        secondaryResult: r.dailyRate,
        secondaryLabel: 'Daily Rate',
        'Billable Hours': '2,080 hours',
        'Weekly Rate': formatCurrency(r.weeklyRate, locationData.currency),
        'Monthly Rate': formatCurrency(r.monthlyRate, locationData.currency),
      }
    }
    case 'roi': {
      // Real ROI from lib/calculations: simple ROI + annualised (CAGR) + gain + performance.
      // Money amounts are pre-formatted as strings so the renderer does not
      // treat them as percentages (the old code showed Gain as "1500.00%").
      const result = calculateROI({
        initialInvestment: inputValue,
        finalValue: extras['finalValue'] ?? inputValue,
        investmentPeriod: extras['periodYears'] ?? 1,
      })
      return {
        mainResult: result.roi,
        secondaryResult: result.annualizedROI,
        secondaryLabel: 'Annualized ROI',
        'Total Gain': formatCurrency(result.totalGain, locationData.currency),
        'Performance': result.performance,
      }
    }
    case 'affiliate-commission': {
      // Input is monthly CLICKS; with a 5% click-through rate that means
      // clicks / 0.05 visitors. Defaults reproduce the old 500 revenue.
      const r = calculateAffiliate({
        monthlyVisitors: inputValue / 0.05,
        conversionRate: 2,
        averageOrderValue: 50,
        commissionRate: 5,
        clickThroughRate: 5,
      })
      return {
        mainResult: r.monthlyRevenue,
        secondaryResult: r.annualRevenue,
        secondaryLabel: 'Annual',
        'Monthly Clicks': formatNumber(inputValue, 0),
        'Conversions': formatNumber(r.monthlyConversions, 0),
      }
    }
    case 'cost-of-living': {
      const equivalent = inputValue * (locationData.costOfLiving / 50000)
      const diff = equivalent - inputValue
      return {
        mainResult: equivalent,
        secondaryResult: diff,
        secondaryLabel: 'Difference',
        'Cost of Living': formatCurrency(locationData.costOfLiving, locationData.currency),
        'Change': formatPercent(inputValue > 0 ? (diff / inputValue) * 100 : 0),
      }
    }
    case 'crypto': {
      // No invented prices: the visitor enters the real buy and current price
      // per coin (defaults are equal, so gain is 0 until they change them).
      const buy = extras['buyPrice'] ?? 100
      const current = extras['currentPrice'] ?? 100
      const coins = buy > 0 ? inputValue / buy : 0
      const r = calculateCrypto({ cryptocurrency: 'bitcoin', amount: coins, purchasePrice: buy, currentPrice: current })
      return {
        mainResult: r.currentValue,
        secondaryResult: r.gainOrLoss,
        secondaryLabel: 'Gain/Loss',
        'Gain/Loss %': formatPercent(r.gainOrLossPercent),
        'Est. Tax': formatCurrency(r.estimatedTax, locationData.currency),
      }
    }
    case 'forex': {
      // EUR/USD, micro lots: input / 1000 micro lots. Defaults (1.0850 -> 1.0870
      // = 20 pips) reproduce the old profit number, now from real pip math.
      const r = calculateForex({
        pair: 'EUR/USD',
        tradeSize: inputValue / 1000,
        lotType: 'micro',
        entryPrice: extras['entryPrice'] ?? 1.085,
        exitPrice: extras['exitPrice'] ?? 1.087,
        direction: 'long',
      })
      return {
        mainResult: r.profitOrLoss,
        secondaryResult: r.marginRequired,
        secondaryLabel: 'Margin Required',
        'Pips': `${r.totalPips} pips`,
        'Leverage': `1:${r.leverage}`,
      }
    }
    case 'contractor-income': {
      const r = calculateContractorIncome({
        hourlyRate: inputValue / 2080,
        hoursPerWeek: 40,
        weeksPerYear: 52,
        businessExpenses: 0,
        healthInsurance: 0,
        retirementContribution: 0,
      })
      return {
        mainResult: r.netIncome,
        secondaryResult: r.monthlyIncome,
        secondaryLabel: 'Monthly',
        'Self-Employment Tax': formatCurrency(r.selfEmploymentTax, locationData.currency),
        'Effective Hourly': formatCurrency(r.effectiveHourlyRate, locationData.currency),
      }
    }
    case 'pension': {
      // Uses the role's real average salary for this location (before it was
      // a hardcoded 75,000 for every role, everywhere).
      const r = calculatePension({
        currentAge: 40,
        retirementAge: 65,
        yearsOfService: inputValue,
        averageSalary: defaultSalary,
        pensionFormula: 2,
        survivorBenefit: false,
        COLA: false,
      })
      return {
        mainResult: r.monthlyPension,
        secondaryResult: r.annualPension,
        secondaryLabel: 'Annual Pension',
        'Replacement Ratio': formatPercent(r.replacementRatio),
        'Vesting': r.vestingStatus,
      }
    }
    case 'profit-margin': {
      const r = calculateProfitMargin({
        revenue: inputValue,
        cogs: inputValue * 0.6,
        operatingExpenses: inputValue * 0.1,
        otherExpenses: 0,
        interestExpense: 0,
        taxRate: locationData.stateTaxRate * 100,
      })
      return {
        mainResult: r.netProfitMargin,
        secondaryResult: r.grossProfitMargin,
        secondaryLabel: 'Gross Margin',
        'Net Income': formatCurrency(r.netIncome, locationData.currency),
        'Gross Profit': formatCurrency(r.grossProfit, locationData.currency),
      }
    }
    default:
      return {
        mainResult: inputValue,
      }
  }
}
