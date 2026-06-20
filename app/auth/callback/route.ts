import { createServerSupabaseClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createServerSupabaseClient()
    const { data: { session } } = await supabase.auth.exchangeCodeForSession(code)

    if (session?.user) {
      // 최초 로그인 시 user_settings 레코드 생성 (이미 존재하면 무시)
      await supabase
        .from('user_settings')
        .upsert({ user_id: session.user.id }, { onConflict: 'user_id', ignoreDuplicates: true })
    }
  }

  return NextResponse.redirect(new URL('/dashboard', request.url))
}
