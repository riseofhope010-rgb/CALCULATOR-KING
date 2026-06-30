import Link from 'next/link'
import { Calculator } from 'lucide-react'

interface RelatedCalculator {
  name: string
  path: string
  description: string
  icon?: string
}

interface RelatedCalculatorsProps {
  currentPath: string
}

const ALL_CALCULATORS: RelatedCalculator[] = [
  { name: 'Salary Calculator', path: '/calculators/salary', description: 'Calculate your take-home pay after taxes' },
  { name: 'Tax Calculator', path: '/calculators/tax', description: 'Estimate your federal and state taxes' },
  { name: 'Mortgage Calculator', path: '/calculators/mortgage', description: 'Calculate monthly mortgage payments' },
  { name: 'Investment Calculator', path: '/calculators/investment', description: 'Project your investment growth' },
  { name: 'Loan Calculator', path: '/calculators/loan', description: 'Calculate loan payments and interest' },
  { name: 'Retirement Calculator', path: '/calculators/retirement', description: 'Plan your retirement savings' },
  { name: 'Currency Converter', path: '/calculators/currency', description: 'Convert between world currencies' },
  { name: 'Compound Interest', path: '/calculators/compound-interest', description: 'See how interest compounds over time' },
  { name: 'BMI Calculator', path: '/calculators/bmi', description: 'Calculate your Body Mass Index' },
  { name: 'Calorie Calculator', path: '/calculators/calorie', description: 'Find your daily calorie needs' },
  { name: 'Freelance Rate', path: '/calculators/freelance-rate', description: 'Determine your optimal hourly rate' },
  { name: 'ROI Calculator', path: '/calculators/roi', description: 'Calculate return on investment' },
  { name: 'Affiliate Commission', path: '/calculators/affiliate-commission', description: 'Estimate affiliate earnings' },
  { name: 'Cost of Living', path: '/calculators/cost-of-living', description: 'Compare costs between cities' },
  { name: 'Cryptocurrency', path: '/calculators/crypto', description: 'Calculate crypto gains and taxes' },
  { name: 'Loan EMI', path: '/calculators/loan-emi', description: 'Calculate EMI for loans' },
  { name: 'Forex Calculator', path: '/calculators/forex', description: 'Calculate forex trading profits' },
  { name: 'Contractor Income', path: '/calculators/contractor-income', description: 'Compare contractor vs W2 income' },
  { name: 'Pension Calculator', path: '/calculators/pension', description: 'Estimate pension benefits' },
  { name: 'Profit Margin', path: '/calculators/profit-margin', description: 'Calculate profit margins' },
]

export default function RelatedCalculators({ currentPath }: RelatedCalculatorsProps) {
  // Get 4 related calculators excluding current one
  const related = ALL_CALCULATORS
    .filter((calc) => calc.path !== currentPath)
    .slice(0, 4)

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Related Calculators</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {related.map((calc) => (
          <Link
            key={calc.path}
            href={calc.path}
            className="group card hover:shadow-lg hover:scale-102 transition-all duration-200"
          >
            <div className="flex items-start gap-3">
              <Calculator className="w-6 h-6 text-primary flex-shrink-0 mt-1 group-hover:scale-110 transition-transform" />
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                  {calc.name}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {calc.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
