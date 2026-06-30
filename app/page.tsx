import Link from 'next/link'
import { Calculator, TrendingUp, DollarSign, PiggyBank, Percent, BarChart3, Wallet, CreditCard, Building, Coins } from 'lucide-react'

const FEATURED_CALCULATORS = [
  {
    name: 'Salary Calculator',
    path: '/calculators/salary',
    description: 'Calculate your take-home pay after federal tax, state tax, and FICA deductions.',
    icon: DollarSign,
    color: 'bg-green-500',
  },
  {
    name: 'Mortgage Calculator',
    path: '/calculators/mortgage',
    description: 'Estimate your monthly mortgage payments including taxes and insurance.',
    icon: Building,
    color: 'bg-blue-500',
  },
  {
    name: 'Investment Calculator',
    path: '/calculators/investment',
    description: 'Project your investment growth and see the power of compound interest.',
    icon: TrendingUp,
    color: 'bg-purple-500',
  },
  {
    name: 'Tax Calculator',
    path: '/calculators/tax',
    description: 'Estimate your federal and state income taxes for the tax year.',
    icon: Percent,
    color: 'bg-red-500',
  },
]

const ALL_CALCULATORS = [
  { name: 'Salary Calculator', path: '/calculators/salary', category: 'Income', description: 'Calculate net take-home pay' },
  { name: 'Tax Calculator', path: '/calculators/tax', category: 'Taxes', description: 'Federal and state tax estimation' },
  { name: 'Mortgage Calculator', path: '/calculators/mortgage', category: 'Real Estate', description: 'Monthly mortgage payments' },
  { name: 'Investment Calculator', path: '/calculators/investment', category: 'Investing', description: 'Future value projections' },
  { name: 'Loan Calculator', path: '/calculators/loan', category: 'Loans', description: 'Personal loan payments' },
  { name: 'Retirement Calculator', path: '/calculators/retirement', category: 'Retirement', description: 'Retirement savings planning' },
  { name: 'Currency Converter', path: '/calculators/currency', category: 'Finance', description: 'Convert world currencies' },
  { name: 'Compound Interest', path: '/calculators/compound-interest', category: 'Investing', description: 'See compound growth' },
  { name: 'BMI Calculator', path: '/calculators/bmi', category: 'Health', description: 'Body Mass Index calculation' },
  { name: 'Calorie Calculator', path: '/calculators/calorie', category: 'Health', description: 'Daily calorie needs' },
  { name: 'Freelance Rate', path: '/calculators/freelance-rate', category: 'Income', description: 'Set your hourly rate' },
  { name: 'ROI Calculator', path: '/calculators/roi', category: 'Investing', description: 'Return on investment' },
  { name: 'Affiliate Commission', path: '/calculators/affiliate-commission', category: 'Income', description: 'Estimate affiliate earnings' },
  { name: 'Cost of Living', path: '/calculators/cost-of-living', category: 'Finance', description: 'Compare city costs' },
  { name: 'Cryptocurrency', path: '/calculators/crypto', category: 'Crypto', description: 'Crypto gains and taxes' },
  { name: 'Loan EMI', path: '/calculators/loan-emi', category: 'Loans', description: 'EMI payment calculator' },
  { name: 'Forex Calculator', path: '/calculators/forex', category: 'Trading', description: 'Forex trading profit/loss' },
  { name: 'Contractor Income', path: '/calculators/contractor-income', category: 'Income', description: 'Contractor vs W2 income' },
  { name: 'Pension Calculator', path: '/calculators/pension', category: 'Retirement', description: 'Pension benefits estimation' },
  { name: 'Profit Margin', path: '/calculators/profit-margin', category: 'Business', description: 'Business profit margins' },
]

const CATEGORIES = ['Income', 'Taxes', 'Real Estate', 'Investing', 'Loans', 'Retirement', 'Finance', 'Health', 'Crypto', 'Trading', 'Business']

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Calculate Your Finances
              <br />
              <span className="text-secondary">Like a Pro</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-100 max-w-3xl mx-auto mb-8">
              Free, professional calculators for salary, mortgage, investment, taxes, and more.
              Make informed financial decisions with accurate calculations.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/calculators" className="btn-primary bg-white text-primary hover:bg-gray-100">
                Browse All Calculators
              </Link>
              <Link href="/calculators/salary" className="btn-secondary border-white text-white hover:bg-white/10">
                Try Salary Calculator
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold">20+</div>
              <div className="text-primary-200 text-sm">Calculators</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold">100%</div>
              <div className="text-primary-200 text-sm">Free</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold">Real-time</div>
              <div className="text-primary-200 text-sm">Calculations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold">PDF</div>
              <div className="text-primary-200 text-sm">Export</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Calculators */}
      <section className="py-16 bg-white dark:bg-dark-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Calculators
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our most popular financial calculators, trusted by thousands of users for accurate calculations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURED_CALCULATORS.map((calc) => (
              <Link
                key={calc.path}
                href={calc.path}
                className="group card hover:shadow-xl hover:scale-102 transition-all duration-300"
              >
                <div className={`w-14 h-14 ${calc.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <calc.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                  {calc.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {calc.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* All Calculators Grid */}
      <section className="py-16 bg-gray-50 dark:bg-dark-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              All Calculators
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Browse our complete collection of professional calculators.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {ALL_CALCULATORS.map((calc) => (
              <Link
                key={calc.path}
                href={calc.path}
                className="group bg-white dark:bg-dark-bg rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-start gap-3">
                  <Calculator className="w-6 h-6 text-primary flex-shrink-0 mt-1 group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="text-xs font-medium text-primary bg-primary-50 dark:bg-primary/20 px-2 py-0.5 rounded-full">
                      {calc.category}
                    </span>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mt-1 group-hover:text-primary transition-colors">
                      {calc.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {calc.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why CalculatorKing */}
      <section className="py-16 bg-white dark:bg-dark-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Why CalculatorKing?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Accurate Calculations
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Using current tax rates and financial formulas to ensure precise results.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Completely Free
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                No sign-up required. No hidden fees. Just free, professional calculators.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <PiggyBank className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Visual Results
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Interactive charts and detailed breakdowns help you understand your numbers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Start Calculating Today
          </h2>
          <p className="text-primary-100 mb-8">
            Join thousands of users making smarter financial decisions with CalculatorKing.
          </p>
          <Link href="/calculators" className="btn-primary bg-white text-primary hover:bg-gray-100">
            Explore All Calculators
          </Link>
        </div>
      </section>
    </div>
  )
}
