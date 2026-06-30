'use client'

import { useState, useEffect } from 'react'
import { formatCurrency, formatPercent } from '@/lib/utils/format'

interface DynamicCalculatorProps {
  defaultSalary: number
  locationData: {
    id: string
    name: string
    state: string | null
    country: string
    currency: string
    stateTaxRate: number
  }
  roleData: {
    id: string
    name: string
    category: string
  }
  locationId: string
  roleId: string
}

export default function TaxCalculatorDynamic({
  defaultSalary,
  locationData,
}: DynamicCalculatorProps) {
  const [grossIncome, setGrossIncome] = useState(defaultSalary)
  const [results, setResults] = useState({
    grossIncome: defaultSalary,
    federalTax: 0,
    stateTax: 0,
    totalTax: 0,
    effectiveRate: 0,
    takeHome: 0,
  })

  useEffect(() => {
    // Simplified tax calculation
    const federalTax = calculateFederalTax(grossIncome)
    const stateTax = grossIncome * locationData.stateTaxRate
    const totalTax = federalTax + stateTax
    const takeHome = grossIncome - totalTax
    const effectiveRate = totalTax / grossIncome

    setResults({
      grossIncome,
      federalTax,
      stateTax,
      totalTax,
      effectiveRate,
      takeHome,
    })
  }, [grossIncome, locationData.stateTaxRate])

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Gross Income ({locationData.currency})
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                {locationData.currency === 'USD' ? '$' : locationData.currency}
              </span>
              <input
                type="number"
                value={grossIncome}
                onChange={(e) => setGrossIncome(parseFloat(e.target.value) || 0)}
                className="input-field pl-8 w-full"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-primary/10 dark:bg-primary/20 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Take-Home Pay</p>
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(results.takeHome, locationData.currency)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Effective Rate: {formatPercent(results.effectiveRate)}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-red-50 dark:bg-red-900/20 rounded p-2">
              <span className="text-gray-600 dark:text-gray-400">Federal Tax</span>
              <p className="font-semibold text-red-600">{formatCurrency(results.federalTax, locationData.currency)}</p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded p-2">
              <span className="text-gray-600 dark:text-gray-400">State Tax</span>
              <p className="font-semibold text-orange-600">{formatCurrency(results.stateTax, locationData.currency)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function calculateFederalTax(income: number): number {
  const brackets = [
    { min: 0, max: 11600, rate: 0.10 },
    { min: 11600, max: 47150, rate: 0.12 },
    { min: 47150, max: 100525, rate: 0.22 },
    { min: 100525, max: 191950, rate: 0.24 },
    { min: 191950, max: 241725, rate: 0.32 },
    { min: 241725, max: 609350, rate: 0.35 },
    { min: 609350, max: Infinity, rate: 0.37 },
  ]

  let tax = 0
  let remaining = income - 14600 // Standard deduction for single filer

  for (const bracket of brackets) {
    if (remaining <= 0) break
    const taxable = Math.min(remaining, bracket.max - bracket.min)
    tax += taxable * bracket.rate
    remaining -= taxable
  }

  return tax
}
