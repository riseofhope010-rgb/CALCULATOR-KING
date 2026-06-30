'use client'

import { useState, useEffect } from 'react'
import { calculateSalary, SalaryInput, SalaryResult } from '@/lib/calculations/salary'
import { formatCurrency, formatPercent } from '@/lib/utils/format'
import ResultsDisplay from '@/components/shared/ResultsDisplay'

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

export default function SalaryCalculatorDynamic({
  defaultSalary,
  locationData,
  roleData,
}: DynamicCalculatorProps) {
  const [inputs, setInputs] = useState<SalaryInput>({
    grossSalary: defaultSalary,
    state: locationData.state || 'CA',
    filingStatus: 'single',
    dependents: 0,
    retirement401k: 0,
  })
  const [results, setResults] = useState<SalaryResult | null>(null)

  useEffect(() => {
    const calculated = calculateSalary(inputs)
    setResults(calculated)
  }, [inputs])

  const handleInputChange = (field: keyof SalaryInput, value: string | number) => {
    setInputs(prev => ({
      ...prev,
      [field]: typeof value === 'string' && field !== 'state' && field !== 'filingStatus'
        ? parseFloat(value) || 0
        : value,
    }))
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Gross Annual Salary ({locationData.currency})
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                {locationData.currency === 'USD' ? '$' : locationData.currency}
              </span>
              <input
                type="number"
                value={inputs.grossSalary}
                onChange={(e) => handleInputChange('grossSalary', e.target.value)}
                className="input-field pl-8 w-full"
              />
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {roleData.name} average in {locationData.name}: {formatCurrency(defaultSalary, locationData.currency)}
            </p>
          </div>
        </div>

        {results && (
          <div className="space-y-4">
            <div className="bg-primary/10 dark:bg-primary/20 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Take-Home</p>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(results.netMonthly, locationData.currency)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatCurrency(results.netAnnual, locationData.currency)} annually
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
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded p-2">
                <span className="text-gray-600 dark:text-gray-400">Social Security</span>
                <p className="font-semibold text-purple-600">{formatCurrency(results.socialSecurity, locationData.currency)}</p>
              </div>
              <div className="bg-pink-50 dark:bg-pink-900/20 rounded p-2">
                <span className="text-gray-600 dark:text-gray-400">Medicare</span>
                <p className="font-semibold text-pink-600">{formatCurrency(results.medicare, locationData.currency)}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
