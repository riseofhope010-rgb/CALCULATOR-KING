import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import locationsData from '@/data/locations.json'

const CALCULATORS = [
  { id: 'salary', name: 'Salary Calculator', category: 'Finance', description: 'Calculate your take-home pay after federal, state, and FICA taxes' },
  { id: 'tax', name: 'Tax Calculator', category: 'Finance', description: 'Estimate your tax liability and potential refund' },
  { id: 'mortgage', name: 'Mortgage Calculator', category: 'Finance', description: 'Calculate monthly mortgage payments with taxes and insurance' },
  { id: 'investment', name: 'Investment Calculator', category: 'Finance', description: 'Project your investment growth over time' },
  { id: 'loan', name: 'Loan Calculator', category: 'Finance', description: 'Calculate loan payments and total interest' },
  { id: 'retirement', name: 'Retirement Calculator', category: 'Finance', description: 'Plan your retirement savings and withdrawals' },
  { id: 'compound-interest', name: 'Compound Interest Calculator', category: 'Finance', description: 'See how compound interest grows your money' },
  { id: 'currency', name: 'Currency Converter', category: 'Finance', description: 'Convert between major world currencies' },
  { id: 'bmi', name: 'BMI Calculator', category: 'Health', description: 'Calculate your Body Mass Index and health metrics' },
  { id: 'calorie', name: 'Calorie Calculator', category: 'Health', description: 'Calculate daily calorie needs and macros' },
  { id: 'freelance-rate', name: 'Freelance Rate Calculator', category: 'Business', description: 'Calculate optimal hourly and project rates' },
  { id: 'roi', name: 'ROI Calculator', category: 'Finance', description: 'Calculate return on investment metrics' },
  { id: 'affiliate-commission', name: 'Affiliate Commission Calculator', category: 'Business', description: 'Estimate affiliate marketing earnings' },
  { id: 'cost-of-living', name: 'Cost of Living Calculator', category: 'Finance', description: 'Compare cost of living between cities' },
  { id: 'crypto', name: 'Crypto Calculator', category: 'Finance', description: 'Calculate crypto gains and taxes' },
  { id: 'loan-emi', name: 'Loan EMI Calculator', category: 'Finance', description: 'Calculate EMI for loans' },
  { id: 'forex', name: 'Forex Calculator', category: 'Finance', description: 'Calculate forex trading profits and margins' },
  { id: 'contractor-income', name: 'Contractor Income Calculator', category: 'Business', description: 'Calculate contractor net income after taxes' },
  { id: 'pension', name: 'Pension Calculator', category: 'Finance', description: 'Estimate pension benefits at retirement' },
  { id: 'profit-margin', name: 'Profit Margin Calculator', category: 'Business', description: 'Calculate gross, operating, and net margins' },
]

const locations = locationsData as LocationData[]

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

interface PageParams {
  name: string
}

export async function generateStaticParams(): Promise<PageParams[]> {
  return CALCULATORS.map(calc => ({ name: calc.id }))
}

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const resolvedParams = await params
  const { name } = resolvedParams

  const calculator = CALCULATORS.find(c => c.id === name)

  if (!calculator) {
    return { title: 'Calculator Not Found' }
  }

  const title = `${calculator.name} | CalculatorKing`
  const description = `${calculator.description}. Free online ${calculator.name.toLowerCase()} with instant results.`

  return {
    title,
    description,
    keywords: [
      calculator.name.toLowerCase(),
      'online calculator',
      'free calculator',
      calculator.category.toLowerCase(),
    ],
    openGraph: {
      title,
      description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `https://calculatorking.com/calculators/${name}`,
    },
  }
}

export default async function CalculatorNamePage({ params }: { params: Promise<PageParams> }) {
  const resolvedParams = await params
  const { name } = resolvedParams

  const calculator = CALCULATORS.find(c => c.id === name)

  if (!calculator) {
    notFound()
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://calculatorking.com' },
      { '@type': 'ListItem', 'position': 2, 'name': 'Calculators', 'item': 'https://calculatorking.com/calculators' },
      { '@type': 'ListItem', 'position': 3, 'name': calculator.name, 'item': `https://calculatorking.com/calculators/${name}` },
    ],
  }

  // Group locations by country
  const locationsByCountry: Record<string, LocationData[]> = {}
  locations.forEach(loc => {
    if (!locationsByCountry[loc.country]) {
      locationsByCountry[loc.country] = []
    }
    locationsByCountry[loc.country].push(loc)
  })

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <li><a href="/" className="hover:text-primary">Home</a></li>
              <li><span className="mx-2">/</span></li>
              <li><a href="/calculators" className="hover:text-primary">Calculators</a></li>
              <li><span className="mx-2">/</span></li>
              <li className="text-gray-900 dark:text-white font-medium">{calculator.name}</li>
            </ol>
          </div>
        </nav>

        <section className="bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/5 dark:to-secondary/5 py-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-400 rounded-full text-sm font-medium mb-4">
              {calculator.category}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {calculator.name} by Location
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {calculator.description}. Select a location below for calculations tailored to local tax rates and economic factors.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Select a Location
            </h2>

            {Object.entries(locationsByCountry).map(([country, locs]) => (
              <div key={country} className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {country}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {locs.map(loc => (
                    <Link
                      key={loc.id}
                      href={`/calculators/${name}/${loc.id}`}
                      className="block bg-white dark:bg-gray-800 rounded-lg p-3 text-center hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
                    >
                      <span className="text-primary text-sm font-medium">{loc.name}</span>
                      {loc.state && <span className="text-gray-500 text-xs block">{loc.state}</span>}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="py-12 bg-gray-100 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Other Calculators
            </h2>
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
              {CALCULATORS.filter(c => c.id !== name).map(calc => (
                <Link
                  key={calc.id}
                  href={`/calculators/${calc.id}`}
                  className="block bg-white dark:bg-gray-700 rounded-xl p-4 hover:shadow-lg transition-shadow"
                >
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium mb-2 ${
                    calc.category === 'Finance' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                    calc.category === 'Health' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                    'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                  }`}>
                    {calc.category}
                  </span>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{calc.name}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
