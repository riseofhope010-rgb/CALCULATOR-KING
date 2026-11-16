import { MetadataRoute } from 'next'
import locationsData from '@/data/locations.json'
import rolesData from '@/data/roles.json'

// Phase 2: Google already crawled and indexed ~10K location/role pages, so the
// sitemap now lists the full site — every hub, location and role page.
const CALCULATORS = [
  { id: 'salary',               priority: 0.9 },
  { id: 'tax',                  priority: 0.9 },
  { id: 'mortgage',             priority: 0.9 },
  { id: 'bmi',                  priority: 0.9 },
  { id: 'investment',           priority: 0.8 },
  { id: 'loan',                 priority: 0.8 },
  { id: 'retirement',           priority: 0.8 },
  { id: 'cost-of-living',       priority: 0.8 },
  { id: 'compound-interest',    priority: 0.7 },
  { id: 'currency',             priority: 0.7 },
  { id: 'calorie',              priority: 0.7 },
  { id: 'freelance-rate',       priority: 0.7 },
  { id: 'roi',                  priority: 0.7 },
  { id: 'crypto',               priority: 0.7 },
  { id: 'loan-emi',             priority: 0.7 },
  { id: 'contractor-income',    priority: 0.7 },
  { id: 'pension',              priority: 0.7 },
  { id: 'affiliate-commission', priority: 0.6 },
  { id: 'forex',                priority: 0.6 },
  { id: 'profit-margin',        priority: 0.6 },
]

const locations = locationsData as { id: string }[]
const roles = rolesData as { id: string }[]

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://calculatorking.vercel.app'
  const now = new Date()

  const entries: MetadataRoute.Sitemap = [
    // Homepage — highest priority
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    // All calculators index
    {
      url: `${baseUrl}/calculators`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    // 20 core calculator hub pages
    ...CALCULATORS.map(calc => ({
      url: `${baseUrl}/calculators/${calc.id}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: calc.priority,
    })),
  ]

  // Location pages (20 calculators x 75 locations) + role pages
  // (20 x 75 x 15) — the pages Google is already indexing.
  for (const calc of CALCULATORS) {
    for (const location of locations) {
      entries.push({
        url: `${baseUrl}/calculators/${calc.id}/${location.id}`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      })
      for (const role of roles) {
        entries.push({
          url: `${baseUrl}/calculators/${calc.id}/${location.id}/${role.id}`,
          lastModified: now,
          changeFrequency: 'monthly' as const,
          priority: 0.5,
        })
      }
    }
  }

  return entries
}
