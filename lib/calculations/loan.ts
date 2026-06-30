export interface LoanInput {
  loanAmount: number
  interestRate: number // annual percentage
  loanTerm: number // months
}

export interface LoanResult {
  monthlyPayment: number
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

export const calculateLoan = (input: LoanInput): LoanResult => {
  const { loanAmount, interestRate, loanTerm } = input

  const monthlyRate = interestRate / 100 / 12
  const numberOfPayments = loanTerm

  // Calculate monthly payment using the loan payment formula
  // M = P [r(1+r)^n] / [(1+r)^n-1]
  let monthlyPayment = 0

  if (monthlyRate > 0 && loanAmount > 0) {
    monthlyPayment =
      (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
  } else if (loanAmount > 0 && numberOfPayments > 0) {
    monthlyPayment = loanAmount / numberOfPayments
  }

  const totalPayments = monthlyPayment * numberOfPayments
  const totalInterest = totalPayments - loanAmount

  // Generate amortization schedule
  const amortizationSchedule: AmortizationEntry[] = []
  let balance = loanAmount

  for (let month = 1; month <= numberOfPayments; month++) {
    const interestPayment = balance * monthlyRate
    const principalPayment = monthlyPayment - interestPayment
    balance = Math.max(0, balance - principalPayment)

    amortizationSchedule.push({
      month,
      payment: monthlyPayment,
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
    monthlyPayment,
    totalInterest,
    totalPayments,
    payoffDate: payoffDateStr,
    amortizationSchedule,
  }
}

export const calculateEMI = (principal: number, annualRate: number, months: number): number => {
  const monthlyRate = annualRate / 100 / 12
  if (monthlyRate === 0) return principal / months

  return (
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1)
  )
}
