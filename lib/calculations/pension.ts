export interface PensionInput {
  currentAge: number
  retirementAge: number
  yearsOfService: number
  averageSalary: number // average of highest earning years
  pensionFormula: number // percent per year of service
  survivorBenefit: boolean
  COLA: boolean // Cost of Living Adjustment
}

export interface PensionResult {
  monthlyPension: number
  annualPension: number
  replacementRatio: number
  totalPensionPaid: number // over expected retirement
  yearsToRetirement: number
  vestingStatus: string
  projectedGrowth: ProjectedPension[]
  lumpSumOption: number
}

export interface ProjectedPension {
  year: number
  age: number
  yearsOfService: number
  monthlyPension: number
}

export const calculatePension = (input: PensionInput): PensionResult => {
  const { currentAge, retirementAge, yearsOfService, averageSalary, pensionFormula, survivorBenefit, COLA } = input

  const yearsToRetirement = Math.max(0, retirementAge - currentAge)

  // Final years of service at retirement
  const finalYearsOfService = yearsOfService + yearsToRetirement

  // Calculate pension (years of service * multiplier * average salary)
  const pensionMultiplier = pensionFormula / 100
  const annualPensionBase = finalYearsOfService * pensionMultiplier * averageSalary

  // Apply survivor benefit reduction (typically 10-15%)
  const survivorReduction = survivorBenefit ? 0.85 : 1
  const annualPension = annualPensionBase * survivorReduction

  const monthlyPension = annualPension / 12

  // Replacement ratio (percentage of salary replaced by pension)
  const replacementRatio = (annualPension / averageSalary) * 100

  // Vesting status
  let vestingStatus: string
  if (yearsOfService >= 10) {
    vestingStatus = 'Fully Vested'
  } else if (yearsOfService >= 5) {
    vestingStatus = 'Partially Vested'
  } else {
    vestingStatus = 'Not Vested'
  }

  // Total pension expected over retirement (assuming 20 years)
  const retirementYears = 20
  const totalPensionPaid = annualPension * retirementYears

  // Lump sum option (typically 15-20x annual pension)
  const lumpSumOption = annualPension * 16

  // Projected growth (if still working)
  const projectedGrowth: ProjectedPension[] = []
  for (let year = 0; year <= yearsToRetirement; year++) {
    const projectedYearsOfService = yearsOfService + year
    const projectedAnnualPension = projectedYearsOfService * pensionMultiplier * averageSalary * survivorReduction
    projectedGrowth.push({
      year,
      age: currentAge + year,
      yearsOfService: projectedYearsOfService,
      monthlyPension: Math.round(projectedAnnualPension / 12),
    })
  }

  return {
    monthlyPension: Math.round(monthlyPension),
    annualPension: Math.round(annualPension),
    replacementRatio: Math.round(replacementRatio * 10) / 10,
    totalPensionPaid: Math.round(totalPensionPaid),
    yearsToRetirement,
    vestingStatus,
    projectedGrowth,
    lumpSumOption: Math.round(lumpSumOption),
  }
}
