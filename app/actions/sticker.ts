'use server'

import { createServerSupabaseClient } from '@/lib/supabase'
import { grantRoutineSticker, type StickerSource } from '@/lib/routineSticker'
import { revalidatePath } from 'next/cache'

export async function addStickerAction(source: StickerSource): Promise<{ success: boolean }> {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  await grantRoutineSticker(supabase, user.id, source)

  revalidatePath('/dashboard')
  return { success: true }
}
