export const formatCurrency = (value: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export const formatNumber = (value: number, decimals: number = 2): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

export const formatPercent = (value: number): string => {
  return `${value.toFixed(2)}%`
}

export const formatCompactCurrency = (value: number): string => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`
  }
  return formatCurrency(value)
}

export const parseNumber = (value: string): number => {
  const parsed = parseFloat(value.replace(/[^0-9.-]/g, ''))
  return isNaN(parsed) ? 0 : parsed
}
