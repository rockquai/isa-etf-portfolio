'use client'

import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import styles from './page.module.scss'

export default function SettingsPage() {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>⚙️ 설정</h1>

      <section className={styles.section} aria-label="계정 설정">
        <h2 className={styles.sectionTitle}>계정</h2>
        <div className={styles.card}>
          <div className={styles.item}>
            <span className={styles.label}>현재 플랜</span>
            <span className={styles.value}>Free</span>
          </div>
          <div className={styles.item}>
            <span className={styles.label}>AI 브리핑</span>
            <span className={styles.value}>월 5회 (Free 기준)</span>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-label="앱 정보">
        <h2 className={styles.sectionTitle}>앱 정보</h2>
        <div className={styles.card}>
          <div className={styles.item}>
            <span className={styles.label}>버전</span>
            <span className={styles.value}>0.1.0</span>
          </div>
          <div className={styles.item}>
            <span className={styles.label}>면책 고지</span>
            <span className={styles.valueSmall}>
              본 앱은 투자 정보 제공 목적으로 제공되며, 투자 권유가 아닙니다. 투자 결정은 본인 책임입니다.
            </span>
          </div>
        </div>
      </section>

      <button
        type="button"
        onClick={handleLogout}
        className={styles.logoutBtn}
        aria-label="로그아웃"
      >
        로그아웃
      </button>
    </main>
  )
}
