export interface ContractorInput {
  hourlyRate: number
  hoursPerWeek: number
  weeksPerYear: number
  businessExpenses: number
  healthInsurance: number
  retirementContribution: number
}

export interface ContractorResult {
  grossAnnualIncome: number
  totalExpenses: number
  netIncome: number
  monthlyIncome: number
  w2EquivalentSalary: number
  effectiveHourlyRate: number
  selfEmploymentTax: number
  estimatedTaxes: number
  savingsVsW2: number
  benefits: BenefitBreakdown
}

export interface BenefitBreakdown {
  healthInsurance: number
  retirement: number
  paidTimeOff: number
  other: number
}

export const calculateContractorIncome = (input: ContractorInput): ContractorResult => {
  const {
    hourlyRate,
    hoursPerWeek,
    weeksPerYear,
    businessExpenses,
    healthInsurance,
    retirementContribution,
  } = input

  // Calculate gross income
  const grossAnnualIncome = hourlyRate * hoursPerWeek * weeksPerYear

  // Self-employment tax (15.3% - both employee and employer portions of FICA)
  const selfEmploymentTax = grossAnnualIncome * 0.153

  // Estimated income tax (simplified - assume 22% effective rate)
  const taxableIncome = grossAnnualIncome - businessExpenses
  const estimatedTaxes = taxableIncome * 0.22

  // Total expenses
  const totalExpenses = businessExpenses + healthInsurance + retirementContribution

  // Net income after all deductions
  const netIncome = grossAnnualIncome - selfEmploymentTax - estimatedTaxes - totalExpenses

  // Monthly income
  const monthlyIncome = netIncome / 12

  // Effective hourly rate (what you actually take home per hour)
  const effectiveHourlyRate = netIncome / (hoursPerWeek * weeksPerYear)

  // W-2 equivalent (accounting for benefits typically provided by employers)
  // W-2 jobs typically add 25-30% on top of salary for benefits
  const benefitsValue = healthInsurance + retirementContribution
  const paidTimeOffValue = hourlyRate * hoursPerWeek * 2 // 2 weeks PTO value
  const w2EquivalentSalary = grossAnnualIncome + benefitsValue + paidTimeOffValue

  // Savings vs W-2 ( contractors often earn more but no benefits)
  const w2TotalComp = w2EquivalentSalary
  const savingsVsW2 = netIncome - (w2TotalComp * 0.7) // Assume 70% take-home after W2 taxes

  const benefits: BenefitBreakdown = {
    healthInsurance,
    retirement: retirementContribution,
    paidTimeOff: paidTimeOffValue,
    other: 0,
  }

  return {
    grossAnnualIncome: Math.round(grossAnnualIncome),
    totalExpenses: Math.round(totalExpenses),
    netIncome: Math.round(netIncome),
    monthlyIncome: Math.round(monthlyIncome),
    w2EquivalentSalary: Math.round(w2EquivalentSalary),
    effectiveHourlyRate: Math.round(effectiveHourlyRate * 100) / 100,
    selfEmploymentTax: Math.round(selfEmploymentTax),
    estimatedTaxes: Math.round(estimatedTaxes),
    savingsVsW2: Math.round(savingsVsW2),
    benefits,
  }
}
