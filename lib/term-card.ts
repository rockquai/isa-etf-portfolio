import { createAdminClient } from '@/lib/supabase'
import { getKstDateString } from '@/lib/getKstDate'
import { generateTermCard, type GeneratedTermCard } from '@/lib/llm-chain'
import { MOCK_TERM_CARD } from '@/lib/mock/term-card'

export type TermCardData = GeneratedTermCard

/**
 * 오늘(KST) 용어 카드를 조회하고 없으면 생성해 term_cards에 캐싱
 * 전체 사용자 공용 콘텐츠라 user_id 없이 서비스 롤(admin client)로 기록
 */
export async function getTodayTermCard(): Promise<TermCardData> {
  const admin = createAdminClient()
  const today = getKstDateString()

  const { data: existing } = await admin
    .from('term_cards')
    .select('term, explanation')
    .eq('term_date', today)
    .maybeSingle()

  if (existing) return existing

  const generated = await generateTermCard()
  if (!generated) return MOCK_TERM_CARD

  const { data: inserted, error } = await admin
    .from('term_cards')
    .upsert({ term_date: today, ...generated }, { onConflict: 'term_date', ignoreDuplicates: true })
    .select('term, explanation')
    .maybeSingle()

  if (error) {
    console.error('term_cards insert failed:', error.message)
    return generated
  }

  if (inserted) return inserted

  // ignoreDuplicates로 인해 동시 요청 중 먼저 들어온 값이 있으면 그 값을 재조회
  const { data: winner } = await admin
    .from('term_cards')
    .select('term, explanation')
    .eq('term_date', today)
    .maybeSingle()

  return winner ?? generated
}
