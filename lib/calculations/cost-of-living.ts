// Cost of Living Index data (NYC = 100)
const COST_OF_LIVING_INDEX: Record<string, number> = {
  'New York, NY': 187.2,
  'San Francisco, CA': 169.5,
  'Honolulu, HI': 164.3,
  'Washington, DC': 148.3,
  'Boston, MA': 143.2,
  'San Jose, CA': 139.1,
  'Seattle, WA': 135.8,
  'Los Angeles, CA': 133.2,
  'San Diego, CA': 127.4,
  'Miami, FL': 125.6,
  'Chicago, IL': 107.5,
  'Denver, CO': 105.3,
  'Portland, OR': 103.8,
  'Atlanta, GA': 101.2,
  'Phoenix, AZ': 98.4,
  'Dallas, TX': 96.8,
  'Houston, TX': 95.3,
  'Austin, TX': 102.1,
  'Philadelphia, PA': 103.5,
  'Minneapolis, MN': 99.2,
  'Detroit, MI': 87.3,
  'Cleveland, OH': 84.6,
  'Pittsburgh, PA': 89.4,
  'Charlotte, NC': 94.8,
  'Nashville, TN': 98.3,
  'Orlando, FL': 97.5,
  'Tampa, FL': 95.6,
  'Las Vegas, NV': 99.1,
  'Salt Lake City, UT': 92.4,
  'Kansas City, MO': 88.7,
}

export interface CostOfLivingInput {
  currentCity: string
  targetCity: string
  currentSalary: number
}

export interface CostOfLivingResult {
  currentIndex: number
  targetIndex: number
  indexRatio: number
  equivalentSalary: number
  salaryDifference: number
  percentDifference: number
  breakdown: CostBreakdown
  affordableCities: string[]
}

export interface CostBreakdown {
  housing: { current: number; target: number }
  groceries: { current: number; target: number }
  transportation: { current: number; target: number }
  utilities: { current: number; target: number }
  healthcare: { current: number; target: number }
}

export const getCityList = (): string[] => {
  return Object.keys(COST_OF_LIVING_INDEX)
}

export const calculateCostOfLiving = (input: CostOfLivingInput): CostOfLivingResult => {
  const { currentCity, targetCity, currentSalary } = input

  const currentIndex = COST_OF_LIVING_INDEX[currentCity] || 100
  const targetIndex = COST_OF_LIVING_INDEX[targetCity] || 100

  // Calculate ratio
  const indexRatio = targetIndex / currentIndex

  // Equivalent salary needed in target city
  const equivalentSalary = Math.round(currentSalary * indexRatio)

  // Difference
  const salaryDifference = equivalentSalary - currentSalary
  const percentDifference = ((indexRatio - 1) * 100)

  // Breakdown estimates (percentage of overall index for each category)
  const housingWeight = 0.3
  const groceriesWeight = 0.15
  const transportationWeight = 0.12
  const utilitiesWeight = 0.1
  const healthcareWeight = 0.08

  const breakdown: CostBreakdown = {
    housing: {
      current: Math.round(currentSalary * housingWeight),
      target: Math.round(equivalentSalary * housingWeight * (targetIndex / currentIndex)),
    },
    groceries: {
      current: Math.round(currentSalary * groceriesWeight),
      target: Math.round(equivalentSalary * groceriesWeight * (targetIndex / currentIndex)),
    },
    transportation: {
      current: Math.round(currentSalary * transportationWeight),
      target: Math.round(equivalentSalary * transportationWeight * (targetIndex / currentIndex)),
    },
    utilities: {
      current: Math.round(currentSalary * utilitiesWeight),
      target: Math.round(equivalentSalary * utilitiesWeight * (targetIndex / currentIndex)),
    },
    healthcare: {
      current: Math.round(currentSalary * healthcareWeight),
      target: Math.round(equivalentSalary * healthcareWeight * (targetIndex / currentIndex)),
    },
  }

  // Recommend more affordable cities if current is expensive
  const affordableCities = Object.entries(COST_OF_LIVING_INDEX)
    .filter(([_, index]) => index < currentIndex)
    .sort((a, b) => a[1] - b[1])
    .slice(0, 5)
    .map(([city]) => city)

  return {
    currentIndex,
    targetIndex,
    indexRatio,
    equivalentSalary,
    salaryDifference,
    percentDifference: Math.round(percentDifference * 10) / 10,
    breakdown,
    affordableCities,
  }
}
