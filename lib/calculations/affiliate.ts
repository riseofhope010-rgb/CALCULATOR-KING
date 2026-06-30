export interface AffiliateInput {
  monthlyVisitors: number
  conversionRate: number // percentage
  averageOrderValue: number
  commissionRate: number // percentage
  clickThroughRate: number // percentage for affiliate links
}

export interface AffiliateResult {
  monthlyClicks: number
  monthlyConversions: number
  monthlyRevenue: number
  annualRevenue: number
  revenuePerVisitor: number
  revenuePerClick: number
  conversionNeeded: number // to reach specific income goal
  projectedGrowth: ProjectedGrowth[]
}

export interface ProjectedGrowth {
  month: number
  visitors: number
  conversions: number
  revenue: number
}

export const calculateAffiliate = (input: AffiliateInput): AffiliateResult => {
  const { monthlyVisitors, conversionRate, averageOrderValue, commissionRate, clickThroughRate } = input

  // Calculate monthly clicks on affiliate links
  const monthlyClicks = monthlyVisitors * (clickThroughRate / 100)

  // Calculate monthly conversions from clicks
  const monthlyConversions = monthlyClicks * (conversionRate / 100)

  // Calculate monthly revenue
  const monthlyRevenue = monthlyConversions * averageOrderValue * (commissionRate / 100)

  // Annual revenue
  const annualRevenue = monthlyRevenue * 12

  // Revenue per visitor and per click
  const revenuePerVisitor = monthlyVisitors > 0 ? monthlyRevenue / monthlyVisitors : 0
  const revenuePerClick = monthlyClicks > 0 ? monthlyRevenue / monthlyClicks : 0

  // Conversions needed for income goals (e.g., $5000/month)
  const targetIncome = 5000
  const conversionNeeded =
    (targetIncome / (averageOrderValue * (commissionRate / 100))) || 0

  // Projected growth (assuming 10% monthly growth)
  const projectedGrowth: ProjectedGrowth[] = []
  let currentVisitors = monthlyVisitors
  for (let month = 1; month <= 12; month++) {
    const clicks = currentVisitors * (clickThroughRate / 100)
    const conversions = clicks * (conversionRate / 100)
    const revenue = conversions * averageOrderValue * (commissionRate / 100)

    projectedGrowth.push({
      month,
      visitors: Math.round(currentVisitors),
      conversions: Math.round(conversions),
      revenue: Math.round(revenue),
    })

    currentVisitors *= 1.1 // 10% growth
  }

  return {
    monthlyClicks: Math.round(monthlyClicks),
    monthlyConversions: Math.round(monthlyConversions),
    monthlyRevenue: Math.round(monthlyRevenue * 100) / 100,
    annualRevenue: Math.round(annualRevenue),
    revenuePerVisitor: Math.round(revenuePerVisitor * 1000) / 1000,
    revenuePerClick: Math.round(revenuePerClick * 100) / 100,
    conversionNeeded: Math.round(conversionNeeded),
    projectedGrowth,
  }
}
