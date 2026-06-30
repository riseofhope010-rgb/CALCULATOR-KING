'use client'

import React, { useState, useEffect } from 'react'
import CalculatorPageTemplate from '@/components/calculators/CalculatorPageTemplate'
import { calculateCostOfLiving, getCityList, CostOfLivingInput, CostOfLivingResult } from '@/lib/calculations/cost-of-living'
import { formatCurrency, formatPercent } from '@/lib/utils/format'

export default function CostOfLivingPage() {
  const cities = getCityList()
  const [inputs, setInputs] = useState<CostOfLivingInput>({
    currentCity: 'New York, NY',
    targetCity: 'Austin, TX',
    currentSalary: 100000,
  })
  const [results, setResults] = useState<CostOfLivingResult | null>(null)

  useEffect(() => {
    const calculated = calculateCostOfLiving(inputs)
    setResults(calculated)
  }, [inputs])

  const handleInputChange = (field: keyof CostOfLivingInput, value: string | number) => {
    setInputs(prev => ({
      ...prev,
      [field]: typeof value === 'string' && field !== 'currentCity' && field !== 'targetCity'
        ? parseFloat(value) || 0
        : value,
    }))
  }

  const calculatorForm = (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Current City
        </label>
        <select
          value={inputs.currentCity}
          onChange={(e) => handleInputChange('currentCity', e.target.value)}
          className="input-field"
        >
          {cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Target City
        </label>
        <select
          value={inputs.targetCity}
          onChange={(e) => handleInputChange('targetCity', e.target.value)}
          className="input-field"
        >
          {cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Current Salary
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <input
            type="number"
            value={inputs.currentSalary}
            onChange={(e) => handleInputChange('currentSalary', e.target.value)}
            className="input-field pl-8"
            placeholder="100000"
          />
        </div>
      </div>
    </div>
  )

  const resultsDisplay = results ? {
    mainResult: {
      label: 'Equivalent Salary Needed',
      value: formatCurrency(results.equivalentSalary),
      subtext: `${results.percentDifference > 0 ? '+' : ''}${formatPercent(results.percentDifference)} difference`,
    },
    cards: [
      { label: 'Current Index', value: results.currentIndex.toFixed(1), color: '#2563EB' },
      { label: 'Target Index', value: results.targetIndex.toFixed(1), color: '#F59E0B' },
      { label: 'Difference', value: formatCurrency(Math.abs(results.salaryDifference)), color: '#10B981' },
    ],
    barData: [
      { name: 'Current', value: inputs.currentSalary },
      { name: 'Equivalent', value: results.equivalentSalary },
    ],
  } : null

  return (
    <CalculatorPageTemplate
      id="cost-of-living"
      name="Cost of Living Calculator"
      description="Compare living costs and salary needs between cities"
      path="/calculators/cost-of-living"
      heroContent="Considering a move to a new city? One of the most important factors in relocation decisions is understanding how far your salary will go in a different location. A higher salary in an expensive city might actually mean less purchasing power than a lower salary somewhere affordable. Our Cost of Living Calculator compares expenses across major US cities and shows you exactly what salary you'd need to maintain your standard of living. Whether you're evaluating job offers in different cities, planning a strategic relocation, or just curious about regional differences, this calculator provides the data you need."
      calculatorForm={calculatorForm}
      results={resultsDisplay || {}}
      whatNumbersMean="The equivalent salary shows what you need to earn in the target city to match your current purchasing power. Cost of living index compares cities to a national baseline—if your city is 120, it's 20% more expensive than average. The percentage difference shows how much more or less expensive the target city is. Housing, transportation, and other categories have varying costs across locations."
      whyItMatters="Salary comparison without cost-of-living adjustment leads to poor decisions. A $20,000 raise to move from Austin to San Francisco might actually be a pay cut when you account for housing costs. Conversely, moving from NYC to Nashville could significantly increase your lifestyle even at the same salary. This information is essential for negotiating relocation packages and making informed career decisions."
      howToUse={[
        "Select your current city from the dropdown.",
        "Choose the city you're considering for relocation.",
        "Enter your current salary.",
        "See the equivalent salary needed to maintain your lifestyle.",
      ]}
      faqItems={[
        { question: "How is the cost of living index calculated?", answer: "The index considers housing, groceries, transportation, utilities, healthcare, and other goods and services. Values are normalized with 100 as the national average. NYC at 187.2 means living there costs 87.2% more than the US average." },
        { question: "Does this include taxes?", answer: "The index primarily reflects consumer costs and doesn't fully capture state income taxes, property taxes, and sales taxes. Consider these separately when evaluating locations. States like Texas have no income tax but higher property taxes." },
        { question: "What about housing?", answer: "Housing is typically the largest component (about 30% of the index). The calculator shows housing cost comparisons separately. In many cities, housing alone can make living costs 2-3x higher than elsewhere." },
        { question: "Should I negotiate cost-of-living adjustments?", answer: "When relocating for a job, always negotiate. Many companies offer cost-of-living adjustments or relocation packages. Show them this calculation—legitimate employers understand that equivalent salaries maintain purchasing power." },
        { question: "How accurate are these comparisons?", answer: "Indices provide good general comparisons but individual circumstances vary. Your lifestyle, housing choices, family size, and spending habits all affect real costs. Use these as guidance, then research specific costs relevant to you." },
        { question: "What about quality of life factors?", answer: "Cost is just one factor. Consider climate, culture, proximity to family, job market, schools, healthcare, and activities. A cheaper city isn't better if it doesn't match your lifestyle preferences or life goals." },
        { question: "Are suburban areas included?", answer: "This calculator focuses on major metropolitan areas. Suburbs typically cost 10-30% less than city centers for housing, but commuting costs may increase. Research specific neighborhoods for accurate comparisons." },
        { question: "How often is cost of living data updated?", answer: "Indices are updated annually based on economic data. Real-time costs vary with market conditions, especially housing. For major decisions, verify current local prices for your specific situation." },
      ]}
    />
  )
}
