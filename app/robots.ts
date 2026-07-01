import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://calculatorking.vercel.app'

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/calculators',
          '/calculators/salary',
          '/calculators/tax',
          '/calculators/mortgage',
          '/calculators/investment',
          '/calculators/loan',
          '/calculators/retirement',
          '/calculators/compound-interest',
          '/calculators/currency',
          '/calculators/bmi',
          '/calculators/calorie',
          '/calculators/freelance-rate',
          '/calculators/roi',
          '/calculators/affiliate-commission',
          '/calculators/cost-of-living',
          '/calculators/crypto',
          '/calculators/loan-emi',
          '/calculators/forex',
          '/calculators/contractor-income',
          '/calculators/pension',
          '/calculators/profit-margin',
        ],
        // Block all programmatic location/role pages until the core pages rank
        disallow: [
          '/calculators/salary/',
          '/calculators/tax/',
          '/calculators/mortgage/',
          '/calculators/investment/',
          '/calculators/loan/',
          '/calculators/retirement/',
          '/calculators/compound-interest/',
          '/calculators/currency/',
          '/calculators/bmi/',
          '/calculators/calorie/',
          '/calculators/freelance-rate/',
          '/calculators/roi/',
          '/calculators/affiliate-commission/',
          '/calculators/cost-of-living/',
          '/calculators/crypto/',
          '/calculators/loan-emi/',
          '/calculators/forex/',
          '/calculators/contractor-income/',
          '/calculators/pension/',
          '/calculators/profit-margin/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
