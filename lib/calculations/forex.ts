export interface ForexInput {
  pair: string // e.g., "EUR/USD"
  tradeSize: number // lot size (standard = 100,000, mini = 10,000, micro = 1,000)
  lotType: 'standard' | 'mini' | 'micro'
  entryPrice: number
  exitPrice: number
  direction: 'long' | 'short'
}

export interface ForexResult {
  pipValue: number
  pipDifference: number
  totalPips: number
  profitOrLoss: number
  profitOrLossPercent: number
  marginRequired: number
  riskRewardRatio: number
  leverage: number
  spread: number
  breakEvenPrice: number
}

const LOT_SIZES = {
  standard: 100000,
  mini: 10000,
  micro: 1000,
}

const LEVERAGE_OPTIONS = {
  standard: 100,
  mini: 50,
  micro: 20,
}

export const calculateForex = (input: ForexInput): ForexResult => {
  const { pair, tradeSize, lotType, entryPrice, exitPrice, direction } = input

  const baseLotSize = LOT_SIZES[lotType]
  const actualSize = tradeSize * baseLotSize

  // Calculate pip value
  // For pairs where USD is the quote currency (like EUR/USD), 1 pip = 0.0001
  const pipDecimal = pair.includes('JPY') ? 0.01 : 0.0001

  // Pip value depends on the pair and account currency
  // Simplified: assuming USD account
  let pipValue = actualSize * pipDecimal
  if (!pair.includes('USD')) {
    pipValue = pipValue / exitPrice // Convert to USD equivalent
  }

  // Calculate pip difference
  let pipDifference: number
  if (direction === 'long') {
    pipDifference = (exitPrice - entryPrice) / pipDecimal
  } else {
    pipDifference = (entryPrice - exitPrice) / pipDecimal
  }

  const totalPips = Math.round(pipDifference)

  // Profit/Loss
  const profitOrLoss = Math.abs(pipDifference) * pipValue
  const isProfit = direction === 'long' ? exitPrice > entryPrice : exitPrice < entryPrice

  const actualProfit = isProfit ? profitOrLoss : -profitOrLoss

  // Margin required
  const leverage = LEVERAGE_OPTIONS[lotType]
  const marginRequired = actualSize / leverage

  // Profit percentage
  const profitOrLossPercent = (actualProfit / marginRequired) * 100

  // Risk/Reward ratio
  const riskRewardRatio = Math.abs(pipDifference) > 0 ? Math.abs(pipDifference) : 0

  // Spread (simplified - assume 2 pips typical spread)
  const spread = 2 * pipValue

  // Break even
  const breakEvenPrice = direction === 'long'
    ? entryPrice + (pipDecimal * 2) // Account for spread
    : entryPrice - (pipDecimal * 2)

  return {
    pipValue: Math.round(pipValue * 100) / 100,
    pipDifference: Math.round(pipDifference * 10) / 10,
    totalPips,
    profitOrLoss: Math.round(actualProfit * 100) / 100,
    profitOrLossPercent: Math.round(profitOrLossPercent * 100) / 100,
    marginRequired: Math.round(marginRequired * 100) / 100,
    riskRewardRatio: Math.round(riskRewardRatio * 100) / 100,
    leverage,
    spread: Math.round(spread * 100) / 100,
    breakEvenPrice: Math.round(breakEvenPrice * 100000) / 100000,
  }
}
