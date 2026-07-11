import { MOCK_TERM_CARD } from '@/lib/mock/term-card'

export type TermCardData = {
  term: string
  explanation: string
}

/**
 * 오늘 날짜 기반으로 배열에서 용어 카드 선택
 * Mock 데이터만 사용 (AI 생성 제외)
 */
export async function getTodayTermCard(): Promise<TermCardData> {
  const today = new Date()
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
  const index = dayOfYear % MOCK_TERM_CARD.length

  const card = MOCK_TERM_CARD[index]
  return {
    term: card.term,
    explanation: card.explanation,
  }
}
