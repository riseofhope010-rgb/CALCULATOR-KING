import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import CalculatorClientWrapper from './CalculatorClientWrapper'
import locationsData from '@/data/locations.json'
import rolesData from '@/data/roles.json'

// All calculator names
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
  role: string
}

// Generate static params for all calculator/location/role combinations
export async function generateStaticParams(): Promise<PageParams[]> {
  const params: PageParams[] = []

  for (const calculator of CALCULATORS) {
    for (const location of locations) {
      for (const role of roles) {
        params.push({
          name: calculator.id,
          location: location.id,
          role: role.id,
        })
      }
    }
  }

  return params
}

// Generate unique metadata for each page
export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const resolvedParams = await params
  const { name, location, role } = resolvedParams

  const calculator = CALCULATORS.find(c => c.id === name)
  const locationData = locations.find(l => l.id === location)
  const roleData = roles.find(r => r.id === role)

  if (!calculator || !locationData || !roleData) {
    return { title: 'Calculator Not Found' }
  }

  const locationDisplay = locationData.state
    ? `${locationData.name}${locationData.country !== 'USA' ? `, ${locationData.country}` : ''}`
    : `${locationData.name}, ${locationData.country}`

  const title = `${roleData.name} ${calculator.name} in ${locationDisplay} | CalculatorKing`
  const description = `Calculate ${roleData.name.toLowerCase()} earnings and financial projections in ${locationDisplay}. Get accurate ${calculator.name.toLowerCase()} results tailored for ${roleData.name.toLowerCase()}s with ${roleData.avgExperience} experience.`

  return {
    title,
    description,
    keywords: [
      roleData.name.toLowerCase(),
      calculator.name.toLowerCase(),
      locationData.name,
      locationData.country,
      'calculator',
      'salary',
      'tax',
      'finance',
      ...roleData.keywords,
    ],
    openGraph: {
      title,
      description,
      type: 'website',
      locale: locationData.language === 'en' ? 'en_US' : locationData.language,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `https://calculatorking.com/calculators/${name}/${location}/${role}`,
    },
  }
}

// Breadcrumb schema
function generateBreadcrumbSchema(name: string, location: string, role: string, locationData: LocationData, roleData: RoleData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': 'https://calculatorking.com',
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Calculators',
        'item': 'https://calculatorking.com/calculators',
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': CALCULATORS.find(c => c.id === name)?.name || 'Calculator',
        'item': `https://calculatorking.com/calculators/${name}`,
      },
      {
        '@type': 'ListItem',
        'position': 4,
        'name': locationData.name,
        'item': `https://calculatorking.com/calculators/${name}/${location}`,
      },
      {
        '@type': 'ListItem',
        'position': 5,
        'name': roleData.name,
        'item': `https://calculatorking.com/calculators/${name}/${location}/${role}`,
      },
    ],
  }
}

// Main page component
export default async function CalculatorLocationRolePage({ params }: { params: Promise<PageParams> }) {
  const resolvedParams = await params
  const { name, location, role } = resolvedParams

  const calculator = CALCULATORS.find(c => c.id === name)
  const locationData = locations.find(l => l.id === location)
  const roleData = roles.find(r => r.id === role)

  if (!calculator || !locationData || !roleData) {
    notFound()
  }

  const locationDisplay = locationData.state
    ? `${locationData.name}${locationData.country !== 'USA' ? `, ${locationData.country}` : ''}`
    : `${locationData.name}, ${locationData.country}`

  // Get salary data for this role in this location
  const avgSalary = locationData.salaries[role] || 75000
  const costOfLiving = locationData.costOfLiving

  // Generate intro paragraph
  const introParagraph = `As a ${roleData.name.toLowerCase()} in ${locationDisplay}, understanding your financial position is crucial. The average annual salary for a ${roleData.name.toLowerCase()} in ${locationDisplay} is approximately ${formatSalary(avgSalary, locationData.currency)}, with a cost of living index that ${costOfLiving > 50000 ? 'reflects a higher cost metropolitan area' : 'offers more affordable living'}. Use our ${calculator.name.toLowerCase()} to get personalized financial projections based on your specific situation.`

  // Generate related locations (same country, different cities)
  const relatedLocations = locations
    .filter(l => l.country === locationData.country && l.id !== location)
    .slice(0, 4)

  // Generate related roles (same category, different roles)
  const relatedRoles = roles
    .filter(r => r.category === roleData.category && r.id !== role)
    .slice(0, 4)

  const breadcrumbSchema = generateBreadcrumbSchema(name, location, role, locationData, roleData)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Breadcrumb Navigation */}
        <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <li><a href="/" className="hover:text-primary">Home</a></li>
              <li><span className="mx-2">/</span></li>
              <li><a href="/calculators" className="hover:text-primary">Calculators</a></li>
              <li><span className="mx-2">/</span></li>
              <li><a href={`/calculators/${name}`} className="hover:text-primary">{calculator.name}</a></li>
              <li><span className="mx-2">/</span></li>
              <li><a href={`/calculators/${name}/${location}`} className="hover:text-primary">{locationData.name}</a></li>
              <li><span className="mx-2">/</span></li>
              <li className="text-gray-900 dark:text-white font-medium">{roleData.name}</li>
            </ol>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/5 dark:to-secondary/5 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center">
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-400 rounded-full text-sm font-medium mb-4">
                {roleData.category} in {locationDisplay}
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                {roleData.name} {calculator.name} for {locationDisplay}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                {introParagraph}
              </p>
            </div>
          </div>
        </section>

        {/* Calculator Wrapper */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            <CalculatorClientWrapper
              calculatorId={name}
              locationId={location}
              roleId={role}
              defaultSalary={avgSalary}
              locationData={locationData}
              roleData={roleData}
            />
          </div>
        </section>

        {/* Location & Role Info */}
        <section className="py-12 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Role Information */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  About {roleData.name}s in {locationDisplay}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {roleData.description}
                </p>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li><strong>Average Experience:</strong> {roleData.avgExperience}</li>
                  <li><strong>Education:</strong> {roleData.education}</li>
                  <li><strong>Category:</strong> {roleData.category}</li>
                </ul>
                <div className="mt-4">
                  <strong className="text-gray-900 dark:text-white">Key Skills:</strong>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {roleData.skills.map(skill => (
                      <span key={skill} className="px-2 py-1 bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-400 rounded text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Working in {locationDisplay}
                </h2>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li><strong>Country:</strong> {locationData.country}</li>
                  {locationData.state && <li><strong>State/Province:</strong> {locationData.state}</li>}
                  <li><strong>Currency:</strong> {locationData.currency}</li>
                  <li><strong>State Tax Rate:</strong> {(locationData.stateTaxRate * 100).toFixed(1)}%</li>
                  <li><strong>Cost of Living Index:</strong> {locationData.costOfLiving.toLocaleString()}</li>
                </ul>
                <p className="text-gray-600 dark:text-gray-300 mt-4">
                  {locationData.stateTaxRate === 0
                    ? `${locationDisplay} has no state income tax, allowing residents to keep more of their earnings.`
                    : `${locationDisplay} has a ${(locationData.stateTaxRate * 100).toFixed(1)}% state tax rate that affects take-home pay.`
                  }
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Related Links */}
        <section className="py-12 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Related Roles */}
              {relatedRoles.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    {roleData.category} Calculators in {locationDisplay}
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    {relatedRoles.map(r => (
                      <a
                        key={r.id}
                        href={`/calculators/${name}/${location}/${r.id}`}
                        className="block p-3 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <span className="text-primary font-medium">{r.name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Locations */}
              {relatedLocations.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    {roleData.name} {calculator.name} in Other Locations
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    {relatedLocations.map(l => (
                      <a
                        key={l.id}
                        href={`/calculators/${name}/${l.id}/${role}`}
                        className="block p-3 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <span className="text-primary font-medium">{l.name}</span>
                        {l.state && <span className="text-gray-500 text-sm">, {l.state}</span>}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

// Helper function to format salary based on currency
function formatSalary(amount: number, currency: string): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  })
  return formatter.format(amount)
}
