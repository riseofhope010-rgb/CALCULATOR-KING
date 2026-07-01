import Link from 'next/link'
import { Calculator } from 'lucide-react'

interface RelatedCalculator {
  name: string
  path: string
  description: string
}

const ALL_CALCULATORS: RelatedCalculator[] = [
  { name: 'Salary Calculator',          path: '/calculators/salary',               description: 'Calculate your take-home pay after taxes' },
  { name: 'Tax Calculator',             path: '/calculators/tax',                  description: 'Estimate your federal and state taxes' },
  { name: 'Mortgage Calculator',        path: '/calculators/mortgage',             description: 'Calculate monthly mortgage payments' },
  { name: 'Investment Calculator',      path: '/calculators/investment',           description: 'Project your investment growth' },
  { name: 'Loan Calculator',            path: '/calculators/loan',                 description: 'Calculate loan payments and interest' },
  { name: 'Retirement Calculator',      path: '/calculators/retirement',           description: 'Plan your retirement savings' },
  { name: 'Currency Converter',         path: '/calculators/currency',             description: 'Convert between world currencies' },
  { name: 'Compound Interest',          path: '/calculators/compound-interest',    description: 'See how interest compounds over time' },
  { name: 'BMI Calculator',             path: '/calculators/bmi',                  description: 'Calculate your Body Mass Index' },
  { name: 'Calorie Calculator',         path: '/calculators/calorie',              description: 'Find your daily calorie needs' },
  { name: 'Freelance Rate',             path: '/calculators/freelance-rate',       description: 'Determine your optimal hourly rate' },
  { name: 'ROI Calculator',             path: '/calculators/roi',                  description: 'Calculate return on investment' },
  { name: 'Affiliate Commission',       path: '/calculators/affiliate-commission', description: 'Estimate affiliate earnings' },
  { name: 'Cost of Living',             path: '/calculators/cost-of-living',       description: 'Compare costs between cities' },
  { name: 'Cryptocurrency',             path: '/calculators/crypto',               description: 'Calculate crypto gains and taxes' },
  { name: 'Loan EMI',                   path: '/calculators/loan-emi',             description: 'Calculate EMI for loans' },
  { name: 'Forex Calculator',           path: '/calculators/forex',                description: 'Calculate forex trading profits' },
  { name: 'Contractor Income',          path: '/calculators/contractor-income',    description: 'Compare contractor vs W2 income' },
  { name: 'Pension Calculator',         path: '/calculators/pension',              description: 'Estimate pension benefits' },
  { name: 'Profit Margin',              path: '/calculators/profit-margin',        description: 'Calculate profit margins' },
]

// Grouped by topic so related suggestions are actually relevant
const RELATED_MAP: Record<string, string[]> = {
  '/calculators/salary':               ['/calculators/tax', '/calculators/retirement', '/calculators/cost-of-living', '/calculators/contractor-income'],
  '/calculators/tax':                  ['/calculators/salary', '/calculators/retirement', '/calculators/profit-margin', '/calculators/contractor-income'],
  '/calculators/mortgage':             ['/calculators/loan', '/calculators/loan-emi', '/calculators/investment', '/calculators/cost-of-living'],
  '/calculators/investment':           ['/calculators/compound-interest', '/calculators/roi', '/calculators/retirement', '/calculators/crypto'],
  '/calculators/loan':                 ['/calculators/mortgage', '/calculators/loan-emi', '/calculators/compound-interest', '/calculators/roi'],
  '/calculators/retirement':           ['/calculators/pension', '/calculators/investment', '/calculators/salary', '/calculators/compound-interest'],
  '/calculators/compound-interest':    ['/calculators/investment', '/calculators/retirement', '/calculators/roi', '/calculators/loan'],
  '/calculators/currency':             ['/calculators/forex', '/calculators/crypto', '/calculators/cost-of-living', '/calculators/investment'],
  '/calculators/bmi':                  ['/calculators/calorie', '/calculators/cost-of-living', '/calculators/salary', '/calculators/retirement'],
  '/calculators/calorie':              ['/calculators/bmi', '/calculators/cost-of-living', '/calculators/salary', '/calculators/retirement'],
  '/calculators/freelance-rate':       ['/calculators/contractor-income', '/calculators/salary', '/calculators/tax', '/calculators/roi'],
  '/calculators/roi':                  ['/calculators/investment', '/calculators/profit-margin', '/calculators/affiliate-commission', '/calculators/compound-interest'],
  '/calculators/affiliate-commission': ['/calculators/roi', '/calculators/profit-margin', '/calculators/freelance-rate', '/calculators/crypto'],
  '/calculators/cost-of-living':       ['/calculators/salary', '/calculators/mortgage', '/calculators/currency', '/calculators/retirement'],
  '/calculators/crypto':               ['/calculators/investment', '/calculators/roi', '/calculators/currency', '/calculators/forex'],
  '/calculators/loan-emi':             ['/calculators/loan', '/calculators/mortgage', '/calculators/compound-interest', '/calculators/investment'],
  '/calculators/forex':                ['/calculators/currency', '/calculators/crypto', '/calculators/roi', '/calculators/investment'],
  '/calculators/contractor-income':    ['/calculators/freelance-rate', '/calculators/salary', '/calculators/tax', '/calculators/retirement'],
  '/calculators/pension':              ['/calculators/retirement', '/calculators/salary', '/calculators/investment', '/calculators/compound-interest'],
  '/calculators/profit-margin':        ['/calculators/roi', '/calculators/affiliate-commission', '/calculators/tax', '/calculators/investment'],
}

export default function RelatedCalculators({ currentPath }: { currentPath: string }) {
  // Strip location/role suffix so dynamic pages also get correct related links
  const basePath = '/' + currentPath.split('/').slice(1, 3).join('/')

  const relatedPaths = RELATED_MAP[basePath] ?? 
    ALL_CALCULATORS.filter(c => c.path !== basePath).slice(0, 4).map(c => c.path)

  const related = relatedPaths
    .map(path => ALL_CALCULATORS.find(c => c.path === path))
    .filter(Boolean) as RelatedCalculator[]

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Related Calculators</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {related.map((calc) => (
          <Link
            key={calc.path}
            href={calc.path}
            className="group card hover:shadow-lg transition-all duration-200"
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
