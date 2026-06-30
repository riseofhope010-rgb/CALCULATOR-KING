export interface ProfitMarginInput {
  revenue: number
  cogs: number // Cost of Goods Sold
  operatingExpenses: number
  otherExpenses: number
  interestExpense: number
  taxRate: number
}

export interface ProfitMarginResult {
  grossProfit: number
  grossProfitMargin: number
  operatingIncome: number
  operatingMargin: number
  netIncome: number
  netProfitMargin: number
  earningsBeforeTax: number
  earningsAfterTax: number
  returnOnRevenue: number
  markup: number
  breakEvenRevenue: number
}

export const calculateProfitMargin = (input: ProfitMarginInput): ProfitMarginResult => {
  const { revenue, cogs, operatingExpenses, otherExpenses, interestExpense, taxRate } = input

  // Gross Profit
  const grossProfit = revenue - cogs
  const grossProfitMargin = (grossProfit / revenue) * 100

  // Operating Income (EBIT)
  const operatingIncome = grossProfit - operatingExpenses
  const operatingMargin = (operatingIncome / revenue) * 100

  // Earnings Before Tax (EBT)
  const earningsBeforeTax = operatingIncome - otherExpenses - interestExpense

  // Tax
  const taxAmount = Math.max(0, earningsBeforeTax) * (taxRate / 100)

  // Net Income
  const netIncome = earningsBeforeTax - taxAmount
  const netProfitMargin = (netIncome / revenue) * 100

  // Return on Revenue
  const returnOnRevenue = (netIncome / revenue) * 100

  // Markup (how much above cost)
  const markup = (grossProfit / cogs) * 100

  // Break-even revenue (where profit = 0)
  const totalFixedCosts = operatingExpenses + otherExpenses + interestExpense
  const contributionMargin = revenue > 0 ? grossProfit / revenue : 0
  const breakEvenRevenue = contributionMargin > 0 ? totalFixedCosts / contributionMargin : 0

  return {
    grossProfit: Math.round(grossProfit * 100) / 100,
    grossProfitMargin: Math.round(grossProfitMargin * 100) / 100,
    operatingIncome: Math.round(operatingIncome * 100) / 100,
    operatingMargin: Math.round(operatingMargin * 100) / 100,
    netIncome: Math.round(netIncome * 100) / 100,
    netProfitMargin: Math.round(netProfitMargin * 100) / 100,
    earningsBeforeTax: Math.round(earningsBeforeTax * 100) / 100,
    earningsAfterTax: Math.round(netIncome * 100) / 100,
    returnOnRevenue: Math.round(returnOnRevenue * 100) / 100,
    markup: Math.round(markup * 100) / 100,
    breakEvenRevenue: Math.round(breakEvenRevenue),
  }
}
