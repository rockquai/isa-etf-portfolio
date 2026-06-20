'use server'

import { createServerSupabaseClient } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export async function addTransactionAction(etfId: string): Promise<{ success: boolean }> {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  // 현재 보유 수량과 평단가 조회
  const { data: holding, error: holdingError } = await supabase
    .from('etf_holdings')
    .select('avg_price, quantity, current_price')
    .eq('id', etfId)
    .eq('user_id', user.id)
    .single()

  if (holdingError || !holding) throw new Error('ETF holding not found')

  const price = holding.current_price ?? holding.avg_price
  const newAvgPrice =
    (holding.avg_price * holding.quantity + price * 1) / (holding.quantity + 1)

  const [txResult] = await Promise.all([
    supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        etf_id: etfId,
        price,
        quantity: 1,
        date: new Date().toISOString().slice(0, 10),
        is_profit: price >= holding.avg_price,
      })
      .select()
      .single(),
    supabase
      .from('etf_holdings')
      .update({
        avg_price: Math.round(newAvgPrice * 100) / 100,
        quantity: holding.quantity + 1,
        current_price: price,
      })
      .eq('id', etfId)
      .eq('user_id', user.id),
  ])

  if (txResult.error) throw new Error(txResult.error.message)

  revalidatePath('/dashboard')
  revalidatePath('/portfolio')
  return { success: true }
}
