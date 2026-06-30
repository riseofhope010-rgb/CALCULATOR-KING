export interface FreelanceInput {
  desiredAnnualIncome: number
  billableHoursPerWeek: number
  weeksPerYear: number
  expenses: number // annual business expenses
  taxRate: number // estimated tax rate percentage
}

export interface FreelanceResult {
  hourlyRate: number
  dailyRate: number
  weeklyRate: number
  monthlyRate: number
  grossRevenue: number
  netIncome: number
  taxes: number
  effectiveHourly: number
  projectRateLow: number
  projectRateMid: number
  projectRateHigh: number
}

export const calculateFreelanceRate = (input: FreelanceInput): FreelanceResult => {
  const { desiredAnnualIncome, billableHoursPerWeek, weeksPerYear, expenses, taxRate } = input

  const totalBillableHours = billableHoursPerWeek * weeksPerYear

  // Calculate required gross income before taxes and expenses
  const grossNeeded = (desiredAnnualIncome + expenses) / (1 - taxRate / 100)

  // Hourly rate
  const hourlyRate = totalBillableHours > 0 ? grossNeeded / totalBillableHours : 0

  // Other rates
  const dailyRate = hourlyRate * 8
  const weeklyRate = hourlyRate * billableHoursPerWeek
  const monthlyRate = weeklyRate * 4.33

  // Project rates (estimate based on project complexity)
  const projectRateLow = hourlyRate * 10 // Small projects (~10 hours)
  const projectRateMid = hourlyRate * 40 // Medium projects (~40 hours)
  const projectRateHigh = hourlyRate * 100 // Large projects (~100 hours)

  // Calculations for display
  const grossRevenue = hourlyRate * totalBillableHours
  const taxes = grossRevenue * (taxRate / 100)
  const netIncome = grossRevenue - taxes - expenses

  const effectiveHourly = netIncome / totalBillableHours

  return {
    hourlyRate: Math.round(hourlyRate * 100) / 100,
    dailyRate: Math.round(dailyRate * 100) / 100,
    weeklyRate: Math.round(weeklyRate * 100) / 100,
    monthlyRate: Math.round(monthlyRate * 100) / 100,
    grossRevenue: Math.round(grossRevenue),
    netIncome: Math.round(netIncome),
    taxes: Math.round(taxes),
    effectiveHourly: Math.round(effectiveHourly * 100) / 100,
    projectRateLow: Math.round(projectRateLow),
    projectRateMid: Math.round(projectRateMid),
    projectRateHigh: Math.round(projectRateHigh),
  }
}
