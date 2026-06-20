'use client'

import { useState, useTransition } from 'react'
import { MOCK_BRIEFING } from '@/lib/mock/briefing'
import styles from './AIBriefing.module.scss'

type Status = 'idle' | 'summarizing' | 'briefing' | 'done' | 'error'

const STATUS_MSG: Record<Status, string> = {
  idle: '',
  summarizing: '뉴스 분석 중...',
  briefing: '브리핑 생성 중...',
  done: '',
  error: 'AI 브리핑을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.',
}

type AIBriefingProps = {
  initialBriefing?: string
}

export default function AIBriefing({ initialBriefing = MOCK_BRIEFING }: AIBriefingProps) {
  const [briefing, setBriefing] = useState(initialBriefing)
  const [status, setStatus] = useState<Status>('done')
  const [isPending, startTransition] = useTransition()

  function handleRefresh() {
    startTransition(async () => {
      setStatus('summarizing')
      try {
        await new Promise((r) => setTimeout(r, 500))
        setStatus('briefing')

        const res = await fetch('/api/ai-briefing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ newsItems: [], holdings: [] }),
        })

        if (!res.ok) throw new Error('API error')
        const data = await res.json()
        setBriefing(data.result)
        setStatus('done')
      } catch {
        setStatus('error')
      }
    })
  }

  return (
    <section className={styles.wrapper} aria-label="AI 브리핑">
      <div className={styles.header}>
        <h2 className={styles.title}>🤖 AI 브리핑</h2>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={isPending}
          className={styles.refreshBtn}
          aria-label="AI 브리핑 새로 받기"
        >
          {isPending ? '생성 중...' : '새로 받기'}
        </button>
      </div>

      {isPending && status !== 'done' && (
        <p className={styles.statusMsg} role="status" aria-live="polite">
          {STATUS_MSG[status]}
        </p>
      )}

      {status === 'error' ? (
        <p className={styles.errorMsg} role="alert">{STATUS_MSG.error}</p>
      ) : (
        <p className={`${styles.briefing} news-content`}>{briefing}</p>
      )}
    </section>
  )
}
