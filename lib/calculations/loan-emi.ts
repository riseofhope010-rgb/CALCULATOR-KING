export interface LoanEMIInput {
  principal: number
  annualRate: number
  tenureMonths: number
}

export interface LoanEMIResult {
  emi: number
  totalInterest: number
  totalPayment: number
  interestPercentage: number
  amortizationSchedule: AmortizationEntry[]
  comparison: EMIVariation[]
}

export interface AmortizationEntry {
  month: number
  emi: number
  principal: number
  interest: number
  balance: number
}

export interface EMIVariation {
  tenure: number
  emi: number
  totalInterest: number
}

export const calculateLoanEMI = (input: LoanEMIInput): LoanEMIResult => {
  const { principal, annualRate, tenureMonths } = input

  const monthlyRate = annualRate / 100 / 12

  // EMI calculation: EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)
  let emi: number
  if (monthlyRate > 0) {
    const factor = Math.pow(1 + monthlyRate, tenureMonths)
    emi = (principal * monthlyRate * factor) / (factor - 1)
  } else {
    emi = principal / tenureMonths
  }

  const totalPayment = emi * tenureMonths
  const totalInterest = totalPayment - principal
  const interestPercentage = (totalInterest / totalPayment) * 100

  // Amortization schedule
  const amortizationSchedule: AmortizationEntry[] = []
  let balance = principal

  for (let month = 1; month <= tenureMonths; month++) {
    const interest = balance * monthlyRate
    const principalPaid = emi - interest
    balance = Math.max(0, balance - principalPaid)

    amortizationSchedule.push({
      month,
      emi: Math.round(emi * 100) / 100,
      principal: Math.round(principalPaid * 100) / 100,
      interest: Math.round(interest * 100) / 100,
      balance: Math.round(balance * 100) / 100,
    })
  }

  // EMI variations for different tenures
  const comparisonTenures = [12, 24, 36, 48, 60, 72, 84]
  const comparison: EMIVariation[] = comparisonTenures.map(tenure => {
    let variantEMI: number
    if (monthlyRate > 0) {
      const factor = Math.pow(1 + monthlyRate, tenure)
      variantEMI = (principal * monthlyRate * factor) / (factor - 1)
    } else {
      variantEMI = principal / tenure
    }
    return {
      tenure,
      emi: Math.round(variantEMI * 100) / 100,
      totalInterest: Math.round((variantEMI * tenure - principal) * 100) / 100,
    }
  })

  return {
    emi: Math.round(emi * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    totalPayment: Math.round(totalPayment * 100) / 100,
    interestPercentage: Math.round(interestPercentage * 100) / 100,
    amortizationSchedule,
    comparison,
  }
}
