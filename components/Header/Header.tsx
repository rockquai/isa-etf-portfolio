import { createServerSupabaseClient } from '@/lib/supabase'
import './Header.scss'

export default async function Header() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <header className="doc-header">
      {user?.email && (
        <p className="txt_user">{user.email}</p>
      )}
    </header>
  )
}
