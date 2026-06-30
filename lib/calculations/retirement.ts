export interface RetirementInput {
  currentAge: number
  retirementAge: number
  currentSavings: number
  monthlyContribution: number
  expectedReturn: number // annual percentage
  socialSecurity: number // expected monthly SS benefit
  retirementExpenses: number // expected monthly expenses in retirement
}

export interface RetirementResult {
  yearsToRetirement: number
  totalContributions: number
  projectedSavings: number
  monthlyIncomeAtRetirement: number
  yearsSavingsWillLast: number
  socialSecurityIncome: number
  totalMonthlyRetirement: number
  shortfallOrSurplus: number
  yearlyBreakdown: YearlyBreakdown[]
}

export interface YearlyBreakdown {
  year: number
  age: number
  contributions: number
  interest: number
  balance: number
}

export const calculateRetirement = (input: RetirementInput): RetirementResult => {
  const {
    currentAge,
    retirementAge,
    currentSavings,
    monthlyContribution,
    expectedReturn,
    socialSecurity,
    retirementExpenses,
  } = input

  const yearsToRetirement = Math.max(0, retirementAge - currentAge)
  const annualRate = expectedReturn / 100
  const monthlyRate = annualRate / 12
  const totalMonths = yearsToRetirement * 12

  // Calculate projected savings at retirement
  let projectedSavings = currentSavings
  if (monthlyRate > 0) {
    const pvGrowth = currentSavings * Math.pow(1 + monthlyRate, totalMonths)
    const pmtGrowth =
      monthlyContribution * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate)
    projectedSavings = pvGrowth + pmtGrowth
  } else {
    projectedSavings = currentSavings + monthlyContribution * totalMonths
  }

  const totalContributions = monthlyContribution * totalMonths

  // Monthly income from savings using 4% rule (safe withdrawal rate)
  const monthlyIncomeFromSavings = projectedSavings * 0.04 / 12
  const totalMonthlyRetirement = monthlyIncomeFromSavings + socialSecurity

  // Calculate how long savings will last
  const annualWithdrawal = retirementExpenses * 12 - socialSecurity * 12
  let remainingSavings = projectedSavings
  let yearsSavingsWillLast = 0

  while (remainingSavings > 0 && yearsSavingsWillLast < 50) {
    yearsSavingsWillLast++
    remainingSavings = remainingSavings * (1 + annualRate) - annualWithdrawal
  }
  yearsSavingsWillLast = Math.min(yearsSavingsWillLast, 50)

  // Shortfall or surplus
  const shortfallOrSurplus = totalMonthlyRetirement - retirementExpenses

  // Yearly breakdown
  const yearlyBreakdown: YearlyBreakdown[] = []
  let balance = currentSavings

  for (let year = 1; year <= yearsToRetirement; year++) {
    const yearlyContribution = monthlyContribution * 12
    const interest = balance * annualRate
    balance = balance + yearlyContribution + interest

    yearlyBreakdown.push({
      year,
      age: currentAge + year,
      contributions: yearlyContribution,
      interest,
      balance,
    })
  }

  return {
    yearsToRetirement,
    totalContributions,
    projectedSavings,
    monthlyIncomeAtRetirement: monthlyIncomeFromSavings,
    yearsSavingsWillLast,
    socialSecurityIncome: socialSecurity,
    totalMonthlyRetirement,
    shortfallOrSurplus,
    yearlyBreakdown,
  }
}
