export interface ROIInput {
  initialInvestment: number
  finalValue: number
  investmentPeriod: number // in years
}

export interface ROIResult {
  roi: number // simple ROI percentage
  annualizedROI: number // CAGR
  totalGain: number
  percentGain: number
  averageAnnualGain: number
  performance: string
}

export const calculateROI = (input: ROIInput): ROIResult => {
  const { initialInvestment, finalValue, investmentPeriod } = input

  // Total gain/loss
  const totalGain = finalValue - initialInvestment

  // Simple ROI: (Final Value - Initial Value) / Initial Value * 100
  const roi = (totalGain / initialInvestment) * 100

  // Annualized ROI (CAGR): (Final Value / Initial Value)^(1/n) - 1
  const annualizedROI =
    investmentPeriod > 0
      ? (Math.pow(finalValue / initialInvestment, 1 / investmentPeriod) - 1) * 100
      : 0

  // Percentage gain
  const percentGain = (totalGain / initialInvestment) * 100

  // Average annual gain
  const averageAnnualGain = investmentPeriod > 0 ? totalGain / investmentPeriod : 0

  // Performance assessment
  let performance: string
  if (annualizedROI >= 10) {
    performance = 'Excellent - Beating market average'
  } else if (annualizedROI >= 7) {
    performance = 'Good - Matching historical S&P 500 returns'
  } else if (annualizedROI >= 4) {
    performance = 'Moderate - Below market but positive'
  } else if (annualizedROI >= 0) {
    performance = 'Low - Minimal returns'
  } else {
    performance = 'Negative - Investment lost value'
  }

  return {
    roi: Math.round(roi * 100) / 100,
    annualizedROI: Math.round(annualizedROI * 100) / 100,
    totalGain: Math.round(totalGain * 100) / 100,
    percentGain: Math.round(percentGain * 100) / 100,
    averageAnnualGain: Math.round(averageAnnualGain * 100) / 100,
    performance,
  }
}
