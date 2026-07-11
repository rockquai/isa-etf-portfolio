import type { ETFHolding, DividendProjection, MonthlyDividendEstimate } from '@/types/etf'

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

/**
 * 현재 보유 수량 기준 연간 배당금 합계 추정치 (성장률 미반영)
 */
export function calcAnnualDividendTotal(holdings: ETFHolding[]): number {
  return holdings.reduce(
    (sum, holding) => sum + holding.annualDividendPerShare * holding.quantity,
    0,
  )
}

/**
 * 실제 입금 이력이 아닌, 현재 보유 수량 기준 이번 달 배당 파이프라인 추정치
 * annualDividendPerShare × quantity ÷ 12 (성장률 미반영, 순수 현재 보유 기준)
 */
export function calcMonthlyDividendByHolding(holdings: ETFHolding[]): MonthlyDividendEstimate[] {
  return holdings
    .map((holding) => ({
      ticker: holding.ticker,
      monthlyDividend: Math.round((holding.annualDividendPerShare * holding.quantity) / 12),
    }))
    .filter((estimate) => estimate.monthlyDividend > 0)
    .sort((a, b) => b.monthlyDividend - a.monthlyDividend)
}
