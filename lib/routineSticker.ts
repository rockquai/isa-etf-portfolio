import type { createServerSupabaseClient } from '@/lib/supabase'
import { getKstDateString } from '@/lib/getKstDate'

export type StickerSource = 'news_read' | 'briefing_view' | 'buy_record' | 'watch_day'

export type GrapeBoardState = {
  totalDays: number
  completedBoards: number
  currentBoardFill: number
}

export const GRAPE_BOARD_SIZE = 30

type SupabaseServerClient = Awaited<ReturnType<typeof createServerSupabaseClient>>

/**
 * 오늘 날짜(KST) + source 기준으로 루틴 스티커를 부여
 * UNIQUE(user_id, sticker_date, source) 제약에 기대어 중복 호출은 무시(멱등)
 */
export async function grantRoutineSticker(
  supabase: SupabaseServerClient,
  userId: string,
  source: StickerSource,
): Promise<void> {
  const { error } = await supabase.from('routine_stickers').upsert(
    { user_id: userId, sticker_date: getKstDateString(), source },
    { onConflict: 'user_id,sticker_date,source', ignoreDuplicates: true },
  )

  if (error) throw new Error(error.message)

  await grantBoardRewardIfCompleted(supabase, userId)
}

/**
 * 루틴 스티커가 찍힌 고유 날짜 수를 기준으로 판 진행 상태를 계산
 * (하루에 여러 source로 스티커를 받아도 '하루 1알'로 집계)
 */
export async function getGrapeBoardState(
  supabase: SupabaseServerClient,
  userId: string,
): Promise<GrapeBoardState> {
  const { data, error } = await supabase
    .from('routine_stickers')
    .select('sticker_date')
    .eq('user_id', userId)

  if (error) throw new Error(error.message)

  const totalDays = new Set((data ?? []).map((row) => row.sticker_date)).size

  return {
    totalDays,
    completedBoards: Math.floor(totalDays / GRAPE_BOARD_SIZE),
    // 30일째에는 다음 판으로 넘어가기 전, 꽉 찬 30/30을 보여줌 (롤링 판)
    currentBoardFill: totalDays === 0 ? 0 : ((totalDays - 1) % GRAPE_BOARD_SIZE) + 1,
  }
}

/**
 * 판(30알)이 막 완성됐다면 배지 보상을 지급
 * sticker_board_rewards의 UNIQUE(user_id, board_no) 제약으로 중복 지급 방지
 */
async function grantBoardRewardIfCompleted(
  supabase: SupabaseServerClient,
  userId: string,
): Promise<void> {
  const { totalDays } = await getGrapeBoardState(supabase, userId)
  if (totalDays === 0 || totalDays % GRAPE_BOARD_SIZE !== 0) return

  const boardNo = totalDays / GRAPE_BOARD_SIZE

  const { error } = await supabase
    .from('sticker_board_rewards')
    .upsert({ user_id: userId, board_no: boardNo }, { onConflict: 'user_id,board_no', ignoreDuplicates: true })

  if (error) throw new Error(error.message)
}
