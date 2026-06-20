import type { ETFHolding, DividendProjection } from '@/types/etf'

const PROJECTION_YEARS = [3, 5, 10, 20] as const

export function calcDividendProjection(
  holdings: ETFHolding[],
  yearsToProject: 3 | 5 | 10 | 20,
  dailyPurchase: boolean = false,
  monthlyPurchaseShares: number = 0,
): DividendProjection {
  if (holdings.length === 0) {
    return { year: yearsToProject, annualDividend: 0, monthlyDividend: 0, totalShares: 0 }
  }

  let totalAnnualDividend = 0
  let totalShares = 0

  for (const holding of holdings) {
    const { quantity, annualDividendPerShare, dividendGrowthRate } = holding

    if (!isFinite(quantity) || !isFinite(annualDividendPerShare) || !isFinite(dividendGrowthRate)) {
      continue
    }

    const growthFactor = Math.pow(1 + dividendGrowthRate, yearsToProject)
    const projectedDividendPerShare = annualDividendPerShare * growthFactor

    let projectedQuantity = quantity
    if (dailyPurchase) {
      projectedQuantity += 365 * yearsToProject
    } else if (monthlyPurchaseShares > 0) {
      projectedQuantity += monthlyPurchaseShares * 12 * yearsToProject
    }

    totalAnnualDividend += projectedDividendPerShare * projectedQuantity
    totalShares += projectedQuantity
  }

  return {
    year: yearsToProject,
    annualDividend: Math.round(totalAnnualDividend),
    monthlyDividend: Math.round(totalAnnualDividend / 12),
    totalShares,
  }
}

export function calcAllProjections(
  holdings: ETFHolding[],
  dailyPurchase: boolean = false,
  monthlyPurchaseShares: number = 0,
): DividendProjection[] {
  return PROJECTION_YEARS.map((year) =>
    calcDividendProjection(holdings, year, dailyPurchase, monthlyPurchaseShares),
  )
}

export function getProjectionLabel(
  dailyPurchase: boolean,
  monthlyPurchaseShares: number,
): string {
  if (dailyPurchase) return '연 5% 성장률 · 매일 1주 매수 시뮬레이션'
  if (monthlyPurchaseShares > 0) return `연 5% 성장률 · 월 ${monthlyPurchaseShares}주 매수 시뮬레이션`
  return '연 5% 성장률 · 현재 보유 기준 시뮬레이션'
}
