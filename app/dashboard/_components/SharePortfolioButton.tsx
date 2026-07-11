'use client'

import { useState } from 'react'
import { generateShareText } from '@/lib/share-card'
import type { DividendProjection } from '@/types/etf'
import styles from './SharePortfolioButton.module.scss'

type SharePortfolioButtonProps = {
  projections: DividendProjection[]
  goalMessage: string
  totalPrincipal: number
}

export default function SharePortfolioButton({
  projections,
  goalMessage,
  totalPrincipal,
}: SharePortfolioButtonProps) {
  const [shared, setShared] = useState(false)

  async function handleShare() {
    const text = generateShareText({ projections, goalMessage, totalPrincipal })

    if (navigator.share) {
      try {
        await navigator.share({
          title: '나의 ETF 배당 파이프라인',
          text,
        })
        setShared(true)
        setTimeout(() => setShared(false), 2000)
      } catch (err) {
        if (!(err instanceof Error) || err.name !== 'AbortError') {
          console.error('Share failed:', err)
        }
      }
    } else {
      // Fallback: clipboard copy
      try {
        await navigator.clipboard.writeText(text)
        setShared(true)
        setTimeout(() => setShared(false), 2000)
      } catch {
        console.error('Copy failed')
      }
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className={`${styles.btn} ${shared ? styles.shared : ''}`}
      aria-label="배당 파이프라인 공유하기"
    >
      {shared ? '✅ 복사됨' : '📤 공유하기'}
    </button>
  )
}
