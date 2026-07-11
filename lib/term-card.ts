import { MOCK_TERM_CARD } from '@/lib/mock/term-card'

export type TermCardData = typeof MOCK_TERM_CARD

/**
 * Mock 데이터만 반환 (AI 생성 제외)
 * 추후 AI 기능 추가 시 여기서 관리
 */
export async function getTodayTermCard(): Promise<TermCardData> {
  return MOCK_TERM_CARD
}
