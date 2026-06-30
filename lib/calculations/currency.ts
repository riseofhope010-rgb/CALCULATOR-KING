// Exchange rates (approximate, base USD)
const EXCHANGE_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.50,
  CAD: 1.36,
  AUD: 1.52,
  CHF: 0.88,
  CNY: 7.24,
  INR: 83.12,
  MXN: 17.15,
  BRL: 4.97,
  KRW: 1320.50,
  SGD: 1.35,
  HKD: 7.82,
  NOK: 10.65,
  SEK: 10.42,
  DKK: 6.87,
  NZD: 1.64,
  ZAR: 18.65,
  RUB: 92.50,
  TRY: 32.15,
  PLN: 3.98,
  THB: 35.85,
  IDR: 15850,
  MYR: 4.72,
  PHP: 56.25,
  TWD: 32.10,
  AED: 3.67,
  SAR: 3.75,
  ILS: 3.65,
  CLP: 890.50,
  EGP: 30.90,
  VND: 24750,
  PKR: 278.50,
  BDT: 110.25,
  NGN: 1550,
  UAH: 37.50,
  CZK: 22.65,
  RON: 4.58,
  HUF: 355.50,
  CRC: 535.50,
}

export interface CurrencyInput {
  amount: number
  fromCurrency: string
  toCurrency: string
}

export interface CurrencyResult {
  originalAmount: number
  fromCurrency: string
  toCurrency: string
  convertedAmount: number
  exchangeRate: number
  inverseRate: number
  timestamp: string
}

export const getCurrencyList = (): string[] => {
  return Object.keys(EXCHANGE_RATES)
}

export const convertCurrency = (input: CurrencyInput): CurrencyResult => {
  const { amount, fromCurrency, toCurrency } = input

  const fromRate = EXCHANGE_RATES[fromCurrency] || 1
  const toRate = EXCHANGE_RATES[toCurrency] || 1

  // Convert to USD first, then to target currency
  const usdAmount = amount / fromRate
  const convertedAmount = usdAmount * toRate

  // Exchange rate (to per from)
  const exchangeRate = toRate / fromRate

  // Inverse rate
  const inverseRate = fromRate / toRate

  return {
    originalAmount: amount,
    fromCurrency,
    toCurrency,
    convertedAmount,
    exchangeRate,
    inverseRate,
    timestamp: new Date().toISOString(),
  }
}
