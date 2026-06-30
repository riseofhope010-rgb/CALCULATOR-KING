// 2024 Federal Tax Brackets for Single Filers
const SINGLE_BRACKETS = [
  { min: 0, max: 11600, rate: 0.10 },
  { min: 11600, max: 47150, rate: 0.12 },
  { min: 47150, max: 100525, rate: 0.22 },
  { min: 100525, max: 191950, rate: 0.24 },
  { min: 191950, max: 241725, rate: 0.32 },
  { min: 241725, max: 609350, rate: 0.35 },
  { min: 609350, max: Infinity, rate: 0.37 },
]

// 2024 Federal Tax Brackets for Married Filing Jointly
const MARRIED_BRACKETS = [
  { min: 0, max: 23200, rate: 0.10 },
  { min: 23200, max: 94300, rate: 0.12 },
  { min: 94300, max: 201050, rate: 0.22 },
  { min: 201050, max: 383900, rate: 0.24 },
  { min: 383900, max: 483450, rate: 0.32 },
  { min: 483450, max: 731200, rate: 0.35 },
  { min: 731200, max: Infinity, rate: 0.37 },
]

// Standard Deductions 2024
const STANDARD_DEDUCTIONS = {
  single: 14600,
  married: 29200,
  headOfHousehold: 21900,
}

// State Tax Rates (simplified average)
const STATE_TAX_RATES: Record<string, number> = {
  AL: 0.05, AK: 0, AZ: 0.025, AR: 0.047, CA: 0.093, CO: 0.044, CT: 0.05,
  DE: 0.066, FL: 0, GA: 0.055, HI: 0.11, ID: 0.058, IL: 0.0495, IN: 0.0305,
  IA: 0.06, KS: 0.057, KY: 0.045, LA: 0.0425, ME: 0.0715, MD: 0.0575,
  MA: 0.05, MI: 0.0425, MN: 0.0985, MS: 0.05, MO: 0.048, MT: 0.059,
  NE: 0.0664, NV: 0, NH: 0, NJ: 0.1075, NM: 0.059, NY: 0.0882, NC: 0.0475,
  ND: 0.029, OH: 0.04, OK: 0.0475, OR: 0.099, PA: 0.0307, RI: 0.0599,
  SC: 0.064, SD: 0, TN: 0, TX: 0, UT: 0.0465, VT: 0.0875, VA: 0.0575,
  WA: 0, WV: 0.055, WI: 0.0765, WY: 0, DC: 0.0875,
}

export interface SalaryInput {
  grossSalary: number
  state: string
  filingStatus: 'single' | 'married' | 'headOfHousehold'
  dependents: number
  retirement401k: number
}

export interface SalaryResult {
  grossAnnual: number
  grossMonthly: number
  federalTax: number
  stateTax: number
  socialSecurity: number
  medicare: number
  totalDeductions: number
  netAnnual: number
  netMonthly: number
  netBiweekly: number
  effectiveTaxRate: number
  taxableIncome: number
}

export const calculateSalary = (input: SalaryInput): SalaryResult => {
  const { grossSalary, state, filingStatus, retirement401k } = input

  // Get standard deduction
  const standardDeduction = STANDARD_DEDUCTIONS[filingStatus]

  // Calculate taxable income after 401k and standard deduction
  const taxableIncome = Math.max(0, grossSalary - retirement401k - standardDeduction)

  // Get appropriate tax brackets
  const brackets = filingStatus === 'married' ? MARRIED_BRACKETS : SINGLE_BRACKETS

  // Calculate federal tax
  let federalTax = 0
  let remainingIncome = taxableIncome

  for (const bracket of brackets) {
    if (remainingIncome <= 0) break
    const taxableAtRate = Math.min(remainingIncome, bracket.max - bracket.min)
    federalTax += taxableAtRate * bracket.rate
    remainingIncome -= taxableAtRate
  }

  // Calculate FICA
  const socialSecurityWages = Math.min(grossSalary, 168600)
  const socialSecurity = socialSecurityWages * 0.062
  const medicare = grossSalary * 0.0145

  // Calculate state tax
  const stateRate = STATE_TAX_RATES[state] || 0
  const stateTax = taxableIncome * stateRate

  // Total deductions
  const totalDeductions = federalTax + stateTax + socialSecurity + medicare

  // Net income
  const netAnnual = grossSalary - totalDeductions
  const netMonthly = netAnnual / 12
  const netBiweekly = netAnnual / 26

  const effectiveTaxRate = grossSalary > 0 ? (totalDeductions / grossSalary) * 100 : 0

  return {
    grossAnnual: grossSalary,
    grossMonthly: grossSalary / 12,
    federalTax,
    stateTax,
    socialSecurity,
    medicare,
    totalDeductions,
    netAnnual,
    netMonthly,
    netBiweekly,
    effectiveTaxRate,
    taxableIncome,
  }
}
