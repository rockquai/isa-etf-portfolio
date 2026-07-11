import type { ETFHolding } from '@/types/etf'
import { calcAnnualDividendTotal } from '@/lib/dividend-calculator'

// 일반계좌 배당소득세 원천징수율 (ISA는 비과세 · 분리과세 혜택)
export const GENERAL_ACCOUNT_WITHHOLDING_RATE = 0.154

// Pro 티어 월 구독료 (docs/01_PLANNING.md 기준)
export const PRO_MONTHLY_PRICE = 4900

/**
 * ISA 계좌 절세액 추정치 = 연간 배당금 추정 합계 × 일반계좌 원천징수율
 * (실제 세금 신고·정산액이 아닌 참고용 추정치)
 */
export function calcIsaTaxSavings(holdings: ETFHolding[]): number {
  return Math.round(calcAnnualDividendTotal(holdings) * GENERAL_ACCOUNT_WITHHOLDING_RATE)
}

export function calcProCoverageMonths(taxSavings: number): number {
  return Math.floor(taxSavings / PRO_MONTHLY_PRICE)
}
