export interface InvestmentInput {
  initialInvestment: number
  monthlyContribution: number
  expectedReturn: number // annual percentage
  years: number
  inflationRate: number // annual percentage
}

export interface InvestmentResult {
  futureValue: number
  totalContributions: number
  interestEarned: number
  inflationAdjustedValue: number
  yearlyBreakdown: YearlyBreakdown[]
}

export interface YearlyBreakdown {
  year: number
  startValue: number
  contributions: number
  interest: number
  endValue: number
}

export const calculateInvestment = (input: InvestmentInput): InvestmentResult => {
  const { initialInvestment, monthlyContribution, expectedReturn, years, inflationRate } = input

  const annualRate = expectedReturn / 100
  const monthlyRate = annualRate / 12
  const totalMonths = years * 12

  // Future Value formula: FV = PV(1+r)^n + PMT × [((1+r)^n - 1) / r]
  let futureValue = initialInvestment

  if (monthlyRate > 0) {
    const pvGrowth = initialInvestment * Math.pow(1 + monthlyRate, totalMonths)
    const pmtGrowth =
      monthlyContribution * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate)
    futureValue = pvGrowth + pmtGrowth
  } else {
    futureValue = initialInvestment + monthlyContribution * totalMonths
  }

  const totalContributions = initialInvestment + monthlyContribution * totalMonths
  const interestEarned = futureValue - totalContributions

  // Inflation adjusted value
  const totalInflationFactor = Math.pow(1 + inflationRate / 100, years)
  const inflationAdjustedValue = futureValue / totalInflationFactor

  // Generate yearly breakdown
  const yearlyBreakdown: YearlyBreakdown[] = []
  let currentValue = initialInvestment
  const yearlyContribution = monthlyContribution * 12

  for (let year = 1; year <= years; year++) {
    const startValue = currentValue
    const yearlyInterest = currentValue * annualRate + yearlyContribution * (annualRate / 2)
    currentValue = currentValue * (1 + annualRate) + yearlyContribution

    yearlyBreakdown.push({
      year,
      startValue,
      contributions: yearlyContribution,
      interest: yearlyInterest,
      endValue: currentValue,
    })
  }

  return {
    futureValue,
    totalContributions,
    interestEarned,
    inflationAdjustedValue,
    yearlyBreakdown,
  }
}
