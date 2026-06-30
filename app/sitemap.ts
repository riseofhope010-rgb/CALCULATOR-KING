import { MetadataRoute } from 'next'
import locationsData from '@/data/locations.json'
import rolesData from '@/data/roles.json'

const CALCULATORS = [
  { id: 'salary', name: 'Salary Calculator', priority: 0.9 },
  { id: 'tax', name: 'Tax Calculator', priority: 0.9 },
  { id: 'mortgage', name: 'Mortgage Calculator', priority: 0.9 },
  { id: 'investment', name: 'Investment Calculator', priority: 0.8 },
  { id: 'loan', name: 'Loan Calculator', priority: 0.8 },
  { id: 'retirement', name: 'Retirement Calculator', priority: 0.8 },
  { id: 'compound-interest', name: 'Compound Interest Calculator', priority: 0.7 },
  { id: 'currency', name: 'Currency Converter', priority: 0.7 },
  { id: 'bmi', name: 'BMI Calculator', priority: 0.8 },
  { id: 'calorie', name: 'Calorie Calculator', priority: 0.7 },
  { id: 'freelance-rate', name: 'Freelance Rate Calculator', priority: 0.7 },
  { id: 'roi', name: 'ROI Calculator', priority: 0.7 },
  { id: 'affiliate-commission', name: 'Affiliate Commission Calculator', priority: 0.6 },
  { id: 'cost-of-living', name: 'Cost of Living Calculator', priority: 0.8 },
  { id: 'crypto', name: 'Crypto Calculator', priority: 0.7 },
  { id: 'loan-emi', name: 'Loan EMI Calculator', priority: 0.7 },
  { id: 'forex', name: 'Forex Calculator', priority: 0.6 },
  { id: 'contractor-income', name: 'Contractor Income Calculator', priority: 0.7 },
  { id: 'pension', name: 'Pension Calculator', priority: 0.7 },
  { id: 'profit-margin', name: 'Profit Margin Calculator', priority: 0.7 },
]

const locations = locationsData as LocationData[]
const roles = rolesData as RoleData[]

interface LocationData {
  id: string
  name: string
  country: string
}

interface RoleData {
  id: string
  name: string
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://calculatorking.com'
  const sitemapEntries: MetadataRoute.Sitemap = []

  // Homepage
  sitemapEntries.push({
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1,
  })

  // Calculators index page
  sitemapEntries.push({
    url: `${baseUrl}/calculators`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  })

  // Individual calculator pages (from Phase 1 - static routes)
  CALCULATORS.forEach(calc => {
    sitemapEntries.push({
      url: `${baseUrl}/calculators/${calc.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: calc.priority,
    })
  })

  // Calculator + Location aggregator pages
  CALCULATORS.forEach(calc => {
    locations.forEach(location => {
      sitemapEntries.push({
        url: `${baseUrl}/calculators/${calc.id}/${location.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: calc.priority * 0.8,
      })
    })
  })

  // Calculator + Location + Role pages (full programmatic SEO)
  CALCULATORS.forEach(calc => {
    locations.forEach(location => {
      roles.forEach(role => {
        sitemapEntries.push({
          url: `${baseUrl}/calculators/${calc.id}/${location.id}/${role.id}`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: calc.priority * 0.6,
        })
      })
    })
  })

  return sitemapEntries
}
