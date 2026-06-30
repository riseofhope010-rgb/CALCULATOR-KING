'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'

// Use generic calculator for all types
const GenericCalculator = dynamic(() => import('@/components/calculators/GenericCalculatorDynamic'), { ssr: false })

interface LocationData {
  id: string
  name: string
  state: string | null
  country: string
  currency: string
  language: string
  stateTaxRate: number
  costOfLiving: number
  salaries: Record<string, number>
}

interface RoleData {
  id: string
  name: string
  category: string
  description: string
  avgExperience: string
  education: string
  skills: string[]
  keywords: string[]
}

interface CalculatorClientWrapperProps {
  calculatorId: string
  locationId: string
  roleId: string
  defaultSalary: number
  locationData: LocationData
  roleData: RoleData
}

export default function CalculatorClientWrapper({
  calculatorId,
  locationId,
  roleId,
  defaultSalary,
  locationData,
  roleData,
}: CalculatorClientWrapperProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {roleData.name} Calculator
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Adjusted for {locationData.name}{locationData.state ? `, ${locationData.state}` : ''}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 dark:text-gray-400">Default Salary</div>
            <div className="text-lg font-semibold text-primary">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: locationData.currency,
                maximumFractionDigits: 0,
              }).format(defaultSalary)}
            </div>
          </div>
        </div>
        <GenericCalculator
          calculatorId={calculatorId}
          defaultSalary={defaultSalary}
          locationData={locationData}
          roleData={roleData}
          locationId={locationId}
          roleId={roleId}
        />
      </div>
    </div>
  )
}
