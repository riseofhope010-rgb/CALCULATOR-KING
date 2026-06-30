export interface CompoundInterestInput {
  principal: number
  annualRate: number // percentage
  years: number
  compoundFrequency: 'daily' | 'monthly' | 'quarterly' | 'annually'
  monthlyContribution?: number
}

export interface CompoundInterestResult {
  principal: number
  finalBalance: number
  totalInterest: number
  totalContributions: number
  effectiveRate: number
  yearlyBreakdown: YearlyBreakdown[]
}

export interface YearlyBreakdown {
  year: number
  startBalance: number
  contributions: number
  interest: number
  endBalance: number
}

const FREQUENCY_MAP: Record<string, number> = {
  daily: 365,
  monthly: 12,
  quarterly: 4,
  annually: 1,
}

export const calculateCompoundInterest = (input: CompoundInterestInput): CompoundInterestResult => {
  const { principal, annualRate, years, compoundFrequency, monthlyContribution = 0 } = input

  const n = FREQUENCY_MAP[compoundFrequency]
  const r = annualRate / 100

  // Compound interest formula: A = P(1 + r/n)^(nt)
  let finalBalance = principal * Math.pow(1 + r / n, n * years)

  // Add monthly contributions with compound interest
  const totalContributions = monthlyContribution * 12 * years
  if (monthlyContribution > 0) {
    const ratePerCompound = r / n
    const totalPeriods = n * years
    const contributionGrowth = monthlyContribution * n * ((Math.pow(1 + ratePerCompound, totalPeriods) - 1) / ratePerCompound)
    finalBalance += contributionGrowth
  }

  const totalInterest = finalBalance - principal - totalContributions

  // Effective annual rate
  const effectiveRate = (Math.pow(1 + r / n, n) - 1) * 100

  // Yearly breakdown
  const yearlyBreakdown: YearlyBreakdown[] = []
  let balance = principal

  for (let year = 1; year <= years; year++) {
    const startBalance = balance
    const yearlyContributions = monthlyContribution * 12
    const yearlyInterest =
      balance * Math.pow(1 + r / n, n) - balance +
      yearlyContributions * ((Math.pow(1 + r / n, n) - 1) / (r / n)) / n

    balance = balance * Math.pow(1 + r / n, n) + yearlyContributions + yearlyContributions * ((Math.pow(1 + r / n, n) - 1) / (r / n)) / n

    yearlyBreakdown.push({
      year,
      startBalance,
      contributions: yearlyContributions,
      interest: yearlyInterest,
      endBalance: balance,
    })
  }

  // Use the precise final balance from formula
  if (yearlyBreakdown.length > 0) {
    yearlyBreakdown[yearlyBreakdown.length - 1].endBalance = finalBalance
  }

  return {
    principal,
    finalBalance,
    totalInterest,
    totalContributions,
    effectiveRate,
    yearlyBreakdown,
  }
}
