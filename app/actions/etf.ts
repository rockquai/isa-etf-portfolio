'use server'

import { createServerSupabaseClient } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export async function addETFHoldingAction(data: {
  ticker: string
  avgPrice: number
  quantity: number
  annualDividendPerShare: number
}): Promise<{ success: boolean }> {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase.from('etf_holdings').insert({
    user_id: user.id,
    ticker: data.ticker,
    avg_price: data.avgPrice,
    current_price: data.avgPrice,
    quantity: data.quantity,
    annual_dividend_per_share: data.annualDividendPerShare,
  })

  if (error) throw new Error(error.message)

  revalidatePath('/portfolio')
  return { success: true }
}
