'use client'

import { useState, useTransition, useRef, useEffect } from 'react'
import { MOCK_BRIEFING } from '@/lib/mock/briefing'
import styles from './AIBriefing.module.scss'

type Status = 'idle' | 'summarizing' | 'briefing' | 'done' | 'error' | 'limit_exceeded'

const STATUS_MSG: Record<Status, string> = {
  idle: '',
  summarizing: '뉴스 분석 중...',
  briefing: '브리핑 생성 중...',
  done: '',
  error: 'AI 브리핑을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.',
  limit_exceeded:
    '이번 달 무료 제공 횟수(5회)를 모두 사용했어요. 다음 달 1일에 자동으로 초기화됩니다.',
}

const TOOLTIP_TEXT =
  "AI 브리핑은 월 5회 무료 제공됩니다. '새로 받기' 버튼을 누를 때마다 1회가 차감되며, 매월 1일에 자동으로 초기화됩니다."

const SAMPLE_TOOLTIP_TEXT =
  '현재는 AI 미연동 상태로 미리 작성된 샘플 브리핑이 표시됩니다. 실제 뉴스·보유 종목이 반영되지 않습니다.'

type AIBriefingProps = {
  initialBriefing?: string
}

export default function AIBriefing({ initialBriefing = MOCK_BRIEFING }: AIBriefingProps) {
  const [briefing, setBriefing] = useState(initialBriefing)
  const [isSample, setIsSample] = useState(true)
  const [status, setStatus] = useState<Status>('done')
  const [isPending, startTransition] = useTransition()
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!tooltipOpen) return
    function handleOutsideClick(e: MouseEvent) {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
        setTooltipOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [tooltipOpen])

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

        if (res.status === 429) {
          setStatus('limit_exceeded')
          return
        }
        if (!res.ok) throw new Error('API error')
        const data = await res.json()
        setBriefing(data.result)
        setIsSample(data.tier !== 'ai')
        setStatus('done')
      } catch {
        setStatus('error')
      }
    })
  }

  const isLimitExceeded = status === 'limit_exceeded'

  return (
    <section className={styles.wrapper} aria-label="AI 브리핑">
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <h2 className={styles.title}>🤖 AI 브리핑(월 5회 무료 제공)</h2>
          {isSample && <span className={styles.sampleBadge}>샘플 브리핑</span>}
          <time className={styles.date} dateTime={new Date().toISOString().slice(0, 10)}>
            {new Date().toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          <div className={styles.infoWrapper} ref={tooltipRef}>
            <button
              type="button"
              className={styles.infoBtn}
              onClick={() => setTooltipOpen((prev) => !prev)}
              aria-label="AI 브리핑 이용 안내"
              aria-expanded={tooltipOpen}
            >
              ⓘ
            </button>
            {tooltipOpen && (
              <div className={styles.tooltip} role="tooltip">
                {isSample ? `${SAMPLE_TOOLTIP_TEXT} ${TOOLTIP_TEXT}` : TOOLTIP_TEXT}
              </div>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={isPending || isLimitExceeded}
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

      {status === 'error' && (
        <p className={styles.errorMsg} role="alert">
          {STATUS_MSG.error}
        </p>
      )}
      {status === 'limit_exceeded' && (
        <p className={styles.limitMsg} role="alert">
          {STATUS_MSG.limit_exceeded}
        </p>
      )}
      {status !== 'error' && status !== 'limit_exceeded' && (
        <p className={`${styles.briefing} news-content`}>{briefing}</p>
      )}
    </section>
  )
}
