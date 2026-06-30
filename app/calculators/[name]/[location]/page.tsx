import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import locationsData from '@/data/locations.json'
import rolesData from '@/data/roles.json'

const CALCULATORS = [
  { id: 'salary', name: 'Salary Calculator', category: 'Finance' },
  { id: 'tax', name: 'Tax Calculator', category: 'Finance' },
  { id: 'mortgage', name: 'Mortgage Calculator', category: 'Finance' },
  { id: 'investment', name: 'Investment Calculator', category: 'Finance' },
  { id: 'loan', name: 'Loan Calculator', category: 'Finance' },
  { id: 'retirement', name: 'Retirement Calculator', category: 'Finance' },
  { id: 'compound-interest', name: 'Compound Interest Calculator', category: 'Finance' },
  { id: 'currency', name: 'Currency Converter', category: 'Finance' },
  { id: 'bmi', name: 'BMI Calculator', category: 'Health' },
  { id: 'calorie', name: 'Calorie Calculator', category: 'Health' },
  { id: 'freelance-rate', name: 'Freelance Rate Calculator', category: 'Business' },
  { id: 'roi', name: 'ROI Calculator', category: 'Finance' },
  { id: 'affiliate-commission', name: 'Affiliate Commission Calculator', category: 'Business' },
  { id: 'cost-of-living', name: 'Cost of Living Calculator', category: 'Finance' },
  { id: 'crypto', name: 'Crypto Calculator', category: 'Finance' },
  { id: 'loan-emi', name: 'Loan EMI Calculator', category: 'Finance' },
  { id: 'forex', name: 'Forex Calculator', category: 'Finance' },
  { id: 'contractor-income', name: 'Contractor Income Calculator', category: 'Business' },
  { id: 'pension', name: 'Pension Calculator', category: 'Finance' },
  { id: 'profit-margin', name: 'Profit Margin Calculator', category: 'Business' },
]

const locations = locationsData as LocationData[]
const roles = rolesData as RoleData[]

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

interface PageParams {
  name: string
  location: string
}

export async function generateStaticParams(): Promise<PageParams[]> {
  const params: PageParams[] = []

  for (const calculator of CALCULATORS) {
    for (const location of locations) {
      params.push({
        name: calculator.id,
        location: location.id,
      })
    }
  }

  return params
}

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const resolvedParams = await params
  const { name, location } = resolvedParams

  const calculator = CALCULATORS.find(c => c.id === name)
  const locationData = locations.find(l => l.id === location)

  if (!calculator || !locationData) {
    return { title: 'Calculator Not Found' }
  }

  const locationDisplay = locationData.state
    ? `${locationData.name}${locationData.country !== 'USA' ? `, ${locationData.country}` : ''}`
    : `${locationData.name}, ${locationData.country}`

  const title = `${calculator.name} for ${locationDisplay} | CalculatorKing`
  const description = `Use our ${calculator.name.toLowerCase()} for ${locationDisplay}. Get accurate financial calculations with local tax rates and cost of living adjustments.`

  return {
    title,
    description,
    keywords: [
      calculator.name.toLowerCase(),
      locationData.name,
      locationData.country,
      'calculator',
      'finance',
      'tax calculator',
      'salary calculator',
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
      canonical: `https://calculatorking.com/calculators/${name}/${location}`,
    },
  }
}

export default async function CalculatorLocationPage({ params }: { params: Promise<PageParams> }) {
  const resolvedParams = await params
  const { name, location } = resolvedParams

  const calculator = CALCULATORS.find(c => c.id === name)
  const locationData = locations.find(l => l.id === location)

  if (!calculator || !locationData) {
    notFound()
  }

  const locationDisplay = locationData.state
    ? `${locationData.name}${locationData.country !== 'USA' ? `, ${locationData.country}` : ''}`
    : `${locationData.name}, ${locationData.country}`

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://calculatorking.com' },
      { '@type': 'ListItem', 'position': 2, 'name': 'Calculators', 'item': 'https://calculatorking.com/calculators' },
      { '@type': 'ListItem', 'position': 3, 'name': calculator.name, 'item': `https://calculatorking.com/calculators/${name}` },
      { '@type': 'ListItem', 'position': 4, 'name': locationData.name, 'item': `https://calculatorking.com/calculators/${name}/${location}` },
    ],
  }

  const rolesInLocation = roles.map(role => ({
    ...role,
    avgSalary: locationData.salaries[role.id] || 50000,
  }))

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
              <li><a href={`/calculators/${name}`} className="hover:text-primary">{calculator.name}</a></li>
              <li><span className="mx-2">/</span></li>
              <li className="text-gray-900 dark:text-white font-medium">{locationData.name}</li>
            </ol>
          </div>
        </nav>

        <section className="bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/5 dark:to-secondary/5 py-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-400 rounded-full text-sm font-medium mb-4">
              {calculator.category}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {calculator.name} for {locationDisplay}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Use our {calculator.name.toLowerCase()} tailored for {locationDisplay}. Calculate with local tax rates of {(locationData.stateTaxRate * 100).toFixed(1)}% and cost of living factors.
            </p>
          </div>
        </section>

        <section className="py-12 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Location</h3>
                <p className="text-gray-600 dark:text-gray-300">{locationDisplay}</p>
                {locationData.state && <p className="text-sm text-gray-500">State: {locationData.state}</p>}
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">State Tax Rate</h3>
                <p className="text-2xl font-bold text-primary">{(locationData.stateTaxRate * 100).toFixed(1)}%</p>
                {locationData.stateTaxRate === 0 && <p className="text-sm text-green-600">No state income tax!</p>}
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Cost of Living Index</h3>
                <p className="text-2xl font-bold text-secondary">{locationData.costOfLiving.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {calculator.name} by Role in {locationData.name}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rolesInLocation.map(role => (
                <Link
                  key={role.id}
                  href={`/calculators/${name}/${location}/${role.id}`}
                  className="block bg-white dark:bg-gray-800 rounded-xl p-5 hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{role.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{role.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Avg Salary</p>
                      <p className="font-semibold text-primary">
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: locationData.currency,
                          maximumFractionDigits: 0,
                        }).format(role.avgSalary)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 bg-gray-100 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Other Locations for {calculator.name}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {locations.filter(l => l.id !== location).slice(0, 24).map(loc => (
                <Link
                  key={loc.id}
                  href={`/calculators/${name}/${loc.id}`}
                  className="block bg-white dark:bg-gray-700 rounded-lg p-3 text-center hover:shadow-md transition-shadow"
                >
                  <span className="text-primary text-sm">{loc.name}</span>
                  {loc.state && <span className="text-gray-500 text-xs">, {loc.state}</span>}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
