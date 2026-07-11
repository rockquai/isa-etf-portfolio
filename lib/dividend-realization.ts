export type DividendRealization = {
  emoji: string
  name: string
  count: number
}

type RealizationItem = {
  emoji: string
  name: string
  unitPrice: number
}

// 개수가 1~MAX_COUNT개로 자연스럽게 떨어지는 항목을 비싼 것부터 우선 매칭
const MAX_COUNT = 8

const REALIZATION_ITEMS: RealizationItem[] = [
  { emoji: '🍗', name: '치킨', unitPrice: 20000 },
  { emoji: '🎬', name: '영화표', unitPrice: 15000 },
  { emoji: '☕', name: '아메리카노', unitPrice: 4500 },
  { emoji: '🍙', name: '삼각김밥', unitPrice: 1800 },
]

/**
 * 이번 달 배당 추정액을 체감 가능한 물건 개수로 환산
 * 배당 = 확정 사실 기반 추정이므로 투자 조언이 아닌 단순 산수 표현
 */
export function calcDividendRealization(monthlyDividendTotal: number): DividendRealization | null {
  const cheapest = REALIZATION_ITEMS[REALIZATION_ITEMS.length - 1]

  // 가장 저렴한 항목 1개도 안 되면 과장된 환산을 보여주지 않음
  if (monthlyDividendTotal < cheapest.unitPrice) return null

  const fit = REALIZATION_ITEMS.find((item) => {
    const count = Math.floor(monthlyDividendTotal / item.unitPrice)
    return count >= 1 && count <= MAX_COUNT
  })

  const item = fit ?? cheapest
  const count = Math.floor(monthlyDividendTotal / item.unitPrice)

  return { emoji: item.emoji, name: item.name, count }
}
