export interface MortgageInput {
  homePrice: number
  downPaymentPercent: number
  downPaymentAmount: number
  loanTerm: number // years
  interestRate: number // annual percentage
  propertyTax: number // annual
  insurance: number // annual
  hoa: number // monthly
  pmi: number // annual percentage if down < 20%
}

export interface MortgageResult {
  loanAmount: number
  downPayment: number
  monthlyPrincipalInterest: number
  monthlyPropertyTax: number
  monthlyInsurance: number
  monthlyHOA: number
  monthlyPMI: number
  totalMonthlyPayment: number
  totalInterest: number
  totalPayments: number
  payoffDate: string
  amortizationSchedule: AmortizationEntry[]
}

export interface AmortizationEntry {
  month: number
  payment: number
  principal: number
  interest: number
  balance: number
}

export const calculateMortgage = (input: MortgageInput): MortgageResult => {
  const {
    homePrice,
    downPaymentPercent,
    downPaymentAmount,
    loanTerm,
    interestRate,
    propertyTax,
    insurance,
    hoa,
  } = input

  // Calculate down payment
  const downPayment = downPaymentAmount > 0 ? downPaymentAmount : (homePrice * downPaymentPercent) / 100
  const loanAmount = homePrice - downPayment

  // Monthly rate
  const monthlyRate = interestRate / 100 / 12
  const numberOfPayments = loanTerm * 12

  // Calculate monthly principal and interest payment
  let monthlyPrincipalInterest = 0
  if (monthlyRate > 0 && loanAmount > 0) {
    monthlyPrincipalInterest =
      (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
  }

  // Additional monthly costs
  const monthlyPropertyTax = propertyTax / 12
  const monthlyInsurance = insurance / 12

  // PMI if down payment < 20%
  let monthlyPMI = 0
  const actualDownPercent = (downPayment / homePrice) * 100
  if (actualDownPercent < 20 && input.pmi > 0) {
    monthlyPMI = (loanAmount * (input.pmi / 100)) / 12
  }

  const totalMonthlyPayment =
    monthlyPrincipalInterest + monthlyPropertyTax + monthlyInsurance + hoa + monthlyPMI

  // Calculate totals
  const totalPayments = monthlyPrincipalInterest * numberOfPayments
  const totalInterest = totalPayments - loanAmount

  // Generate amortization schedule
  const amortizationSchedule: AmortizationEntry[] = []
  let balance = loanAmount

  for (let month = 1; month <= numberOfPayments; month++) {
    const interestPayment = balance * monthlyRate
    const principalPayment = monthlyPrincipalInterest - interestPayment
    balance = Math.max(0, balance - principalPayment)

    amortizationSchedule.push({
      month,
      payment: monthlyPrincipalInterest,
      principal: principalPayment,
      interest: interestPayment,
      balance,
    })
  }

  // Calculate payoff date
  const payoffDate = new Date()
  payoffDate.setMonth(payoffDate.getMonth() + numberOfPayments)
  const payoffDateStr = payoffDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return {
    loanAmount,
    downPayment,
    monthlyPrincipalInterest,
    monthlyPropertyTax,
    monthlyInsurance,
    monthlyHOA: hoa,
    monthlyPMI,
    totalMonthlyPayment,
    totalInterest,
    totalPayments,
    payoffDate: payoffDateStr,
    amortizationSchedule,
  }
}
