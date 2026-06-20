import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { generateETFBriefing } from '@/lib/llm-chain'

export const maxDuration = 60

const FREE_MONTHLY_LIMIT = 5

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { newsItems, holdings } = await req.json()

  const { data: settings } = await supabase
    .from('user_settings')
    .select('user_tier, ai_call_count, ai_call_reset_at')
    .eq('user_id', user.id)
    .single()

  const userTier = settings?.user_tier ?? 'free'
  const callCount = settings?.ai_call_count ?? 0

  const isNewMonth =
    !settings?.ai_call_reset_at ||
    new Date(settings.ai_call_reset_at) <
      new Date(new Date().getFullYear(), new Date().getMonth(), 1)

  if (isNewMonth) {
    await supabase
      .from('user_settings')
      .upsert({ user_id: user.id, ai_call_count: 0, ai_call_reset_at: new Date().toISOString() })
  } else if (userTier === 'free' && callCount >= FREE_MONTHLY_LIMIT) {
    return NextResponse.json(
      {
        error: 'FREE_LIMIT_EXCEEDED',
        message: `무료 플랜은 월 ${FREE_MONTHLY_LIMIT}회까지 이용 가능합니다.`,
        remaining: 0,
      },
      { status: 429 },
    )
  }

  const result = await generateETFBriefing(newsItems, holdings, userTier)

  await supabase
    .from('user_settings')
    .upsert({ user_id: user.id, ai_call_count: callCount + 1 })

  return NextResponse.json(result)
}
