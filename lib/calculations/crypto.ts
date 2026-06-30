export interface CryptoInput {
  cryptocurrency: string
  amount: number
  purchasePrice: number
  currentPrice: number
  sellPrice?: number
}

export interface CryptoResult {
  currentValue: number
  initialValue: number
  gainOrLoss: number
  gainOrLossPercent: number
  shortTermCapitalGains: number
  longTermCapitalGains: number
  estimatedTax: number
  holdingPeriod: string
  profitPerCoin: number
  breakEvenPrice: number
  priceTargets: PriceTarget[]
}

export interface PriceTarget {
  targetPrice: number
  value: number
  gain: number
  gainPercent: number
}

const CRYPTO_DATA: Record<string, { name: string; symbol: string }> = {
  bitcoin: { name: 'Bitcoin', symbol: 'BTC' },
  ethereum: { name: 'Ethereum', symbol: 'ETH' },
  solana: { name: 'Solana', symbol: 'SOL' },
  cardano: { name: 'Cardano', symbol: 'ADA' },
  xrp: { name: 'XRP', symbol: 'XRP' },
  polkadot: { name: 'Polkadot', symbol: 'DOT' },
  dogecoin: { name: 'Dogecoin', symbol: 'DOGE' },
  avalanche: { name: 'Avalanche', symbol: 'AVAX' },
}

export const getCryptoList = () => Object.keys(CRYPTO_DATA)

export const calculateCrypto = (input: CryptoInput): CryptoResult => {
  const { cryptocurrency, amount, purchasePrice, currentPrice, sellPrice } = input

  const initialValue = amount * purchasePrice
  const currentValue = amount * (sellPrice || currentPrice)

  const gainOrLoss = currentValue - initialValue
  const gainOrLossPercent = initialValue > 0 ? (gainOrLoss / initialValue) * 100 : 0

  const profitPerCoin = (sellPrice || currentPrice) - purchasePrice

  // Tax calculations (assuming US tax rates)
  // Short-term gains (< 1 year): taxed as ordinary income
  // Long-term gains (> 1 year): 0%, 15%, or 20% depending on income
  let shortTermCapitalGains = 0
  let longTermCapitalGains = 0
  let estimatedTax = 0
  let holdingPeriod = 'Unknown'

  if (gainOrLoss > 0) {
    // Assume long-term for tax estimate
    longTermCapitalGains = gainOrLoss
    estimatedTax = gainOrLoss * 0.15 // 15% long-term capital gains rate (simplified)
    holdingPeriod = 'Long-term (>1 year)'
  }

  const breakEvenPrice = purchasePrice

  // Price targets
  const priceTargets: PriceTarget[] = [
    { targetPrice: purchasePrice * 1.25, value: 0, gain: 0, gainPercent: 25 },
    { targetPrice: purchasePrice * 1.5, value: 0, gain: 0, gainPercent: 50 },
    { targetPrice: purchasePrice * 2, value: 0, gain: 0, gainPercent: 100 },
    { targetPrice: purchasePrice * 3, value: 0, gain: 0, gainPercent: 200 },
  ].map(target => ({
    ...target,
    value: amount * target.targetPrice,
    gain: amount * target.targetPrice - initialValue,
  }))

  return {
    currentValue: Math.round(currentValue * 100) / 100,
    initialValue: Math.round(initialValue * 100) / 100,
    gainOrLoss: Math.round(gainOrLoss * 100) / 100,
    gainOrLossPercent: Math.round(gainOrLossPercent * 100) / 100,
    shortTermCapitalGains: Math.round(shortTermCapitalGains * 100) / 100,
    longTermCapitalGains: Math.round(longTermCapitalGains * 100) / 100,
    estimatedTax: Math.round(estimatedTax),
    holdingPeriod,
    profitPerCoin: Math.round(profitPerCoin * 100) / 100,
    breakEvenPrice: Math.round(breakEvenPrice * 100) / 100,
    priceTargets,
  }
}
