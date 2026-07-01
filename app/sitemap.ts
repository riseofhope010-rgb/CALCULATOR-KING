import { MetadataRoute } from 'next'

// Phase 1: Only submit core calculator pages to Google.
// Once these rank, we'll add location/role pages in batches (Phase 2).
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

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://calculatorking.vercel.app'
  const now = new Date()

  return [
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
    // 20 core calculator pages only
    ...CALCULATORS.map(calc => ({
      url: `${baseUrl}/calculators/${calc.id}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: calc.priority,
    })),
  ]
}
