'use server'

import { createServerSupabaseClient } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export async function saveGoalAction(message: string): Promise<{ success: boolean }> {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const trimmed = message.trim().slice(0, 100)

  const { error } = await supabase
    .from('user_settings')
    .upsert({ user_id: user.id, goal_message: trimmed })

  if (error) throw new Error(error.message)

  revalidatePath('/dashboard')
  return { success: true }
}
