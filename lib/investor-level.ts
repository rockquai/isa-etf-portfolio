import type { ETFHolding } from '@/types/etf'

export type InvestorLevel = {
  level: number
  name: string
  emoji: string
  minAmount: number
  nextLevelAmount: number | null
}

type LevelTier = {
  name: string
  emoji: string
  minAmount: number
}

// 시세 변동과 무관한 누적 매수 원금(평단가×수량) 기준 — 아이디어4 "주 수" 기준 버그 재설계
const LEVEL_TIERS: LevelTier[] = [
  { name: '새싹 투자자', emoji: '🌱', minAmount: 0 },
  { name: '꾸준한 투자자', emoji: '🌿', minAmount: 100_000 },
  { name: '든든한 투자자', emoji: '🌳', minAmount: 500_000 },
  { name: '베테랑 투자자', emoji: '🌲', minAmount: 1_000_000 },
  { name: 'ISA 마스터', emoji: '🏆', minAmount: 5_000_000 },
]

/**
 * 보유 종목의 평단가×수량 합계 = 누적 매수 원금 추정치
 * (매도 미지원 앱이라 avgPrice가 곧 총 매수 원가의 가중평균)
 */
export function calcTotalPrincipal(holdings: ETFHolding[]): number {
  return holdings.reduce((sum, holding) => sum + holding.avgPrice * holding.quantity, 0)
}

export function calcInvestorLevel(totalPrincipal: number): InvestorLevel {
  let levelIndex = 0
  for (let i = 0; i < LEVEL_TIERS.length; i++) {
    if (totalPrincipal >= LEVEL_TIERS[i].minAmount) levelIndex = i
  }

  const current = LEVEL_TIERS[levelIndex]
  const next = LEVEL_TIERS[levelIndex + 1] ?? null

  return {
    level: levelIndex + 1,
    name: current.name,
    emoji: current.emoji,
    minAmount: current.minAmount,
    nextLevelAmount: next ? next.minAmount : null,
  }
}
