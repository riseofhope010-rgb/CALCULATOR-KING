import Link from 'next/link'
import { Calculator } from 'lucide-react'

const ALL_CALCULATORS = [
  { name: 'Salary Calculator', path: '/calculators/salary', category: 'Income', description: 'Calculate your take-home pay after taxes' },
  { name: 'Tax Calculator', path: '/calculators/tax', category: 'Taxes', description: 'Estimate federal and state income taxes' },
  { name: 'Mortgage Calculator', path: '/calculators/mortgage', category: 'Real Estate', description: 'Calculate monthly mortgage payments' },
  { name: 'Investment Calculator', path: '/calculators/investment', category: 'Investing', description: 'Project your investment growth' },
  { name: 'Loan Calculator', path: '/calculators/loan', category: 'Loans', description: 'Calculate loan payments and interest' },
  { name: 'Retirement Calculator', path: '/calculators/retirement', category: 'Retirement', description: 'Plan your retirement savings' },
  { name: 'Currency Converter', path: '/calculators/currency', category: 'Finance', description: 'Convert between 30+ currencies' },
  { name: 'Compound Interest', path: '/calculators/compound-interest', category: 'Investing', description: 'See the power of compound growth' },
  { name: 'BMI Calculator', path: '/calculators/bmi', category: 'Health', description: 'Calculate your Body Mass Index' },
  { name: 'Calorie Calculator', path: '/calculators/calorie', category: 'Health', description: 'Find your daily calorie needs' },
  { name: 'Freelance Rate', path: '/calculators/freelance-rate', category: 'Income', description: 'Determine your optimal hourly rate' },
  { name: 'ROI Calculator', path: '/calculators/roi', category: 'Investing', description: 'Calculate return on investment' },
  { name: 'Affiliate Commission', path: '/calculators/affiliate-commission', category: 'Income', description: 'Estimate affiliate earnings' },
  { name: 'Cost of Living', path: '/calculators/cost-of-living', category: 'Finance', description: 'Compare costs between cities' },
  { name: 'Cryptocurrency', path: '/calculators/crypto', category: 'Crypto', description: 'Calculate crypto gains and taxes' },
  { name: 'Loan EMI', path: '/calculators/loan-emi', category: 'Loans', description: 'Calculate EMI for loans' },
  { name: 'Forex Calculator', path: '/calculators/forex', category: 'Trading', description: 'Calculate forex trading profits' },
  { name: 'Contractor Income', path: '/calculators/contractor-income', category: 'Income', description: 'Compare contractor vs W2 income' },
  { name: 'Pension Calculator', path: '/calculators/pension', category: 'Retirement', description: 'Estimate pension benefits' },
  { name: 'Profit Margin', path: '/calculators/profit-margin', category: 'Business', description: 'Calculate business profit margins' },
]

const CATEGORIES = [...new Set(ALL_CALCULATORS.map(c => c.category))]

export default function CalculatorsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            All Calculators
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Browse our complete collection of free, professional calculators for all your financial needs.
          </p>
        </div>

        {/* Calculators Grid by Category */}
        {CATEGORIES.map((category) => {
          const calculators = ALL_CALCULATORS.filter(c => c.category === category)
          return (
            <div key={category} className="mb-10">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="bg-primary text-white px-3 py-1 rounded-full text-sm">
                  {category}
                </span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {calculators.map((calc) => (
                  <Link
                    key={calc.path}
                    href={calc.path}
                    className="group card hover:shadow-lg hover:scale-102 transition-all duration-200"
                  >
                    <div className="flex items-start gap-3">
                      <Calculator className="w-6 h-6 text-primary flex-shrink-0 mt-1 group-hover:scale-110 transition-transform" />
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                          {calc.name}
                        </h3>
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
        })}

        {/* Stats */}
        <div className="mt-12 card bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary/10 dark:to-blue/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-primary">20+</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">Calculators</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">Free</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">Forever</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">Real-time</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">Updates</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">100%</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">Accurate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
