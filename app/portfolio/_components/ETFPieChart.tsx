'use client'

import { useState } from 'react'
import type { ETFHolding } from '@/types/etf'
import styles from './ETFPieChart.module.scss'

const SLICE_COLORS = [
  'var(--color-chart-1)',
  'var(--color-chart-2)',
  'var(--color-chart-3)',
  'var(--color-chart-4)',
  'var(--color-chart-5)',
]

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function describeArc(cx: number, cy: number, r: number, start: number, end: number) {
  const s = polarToCartesian(cx, cy, r, start)
  const e = polarToCartesian(cx, cy, r, end)
  const largeArc = end - start > 180 ? 1 : 0
  return `M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 1 ${e.x} ${e.y} Z`
}

type Slice = ETFHolding & { ratio: number; startAngle: number; angle: number }

type ETFPieChartProps = {
  holdings: ETFHolding[]
}

export default function ETFPieChart({ holdings }: ETFPieChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  if (holdings.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyText}>아직 종목이 없어요</p>
        <a href="/portfolio" className={styles.emptyLink}>
          첫 ETF 추가하기 →
        </a>
      </div>
    )
  }

  const total = holdings.reduce((sum, h) => sum + h.quantity * h.avgPrice, 0)
  if (total === 0) return null

  let cumulative = 0
  const slices: Slice[] = holdings.map((h) => {
    const ratio = (h.quantity * h.avgPrice) / total
    const slice = { ...h, ratio, startAngle: cumulative, angle: ratio * 360 }
    cumulative += slice.angle
    return slice
  })

  return (
    <div className={styles.wrapper}>
      <svg viewBox="0 0 200 200" className={styles.chart} aria-label="ETF 포트폴리오 비중 차트">
        {slices.map((slice, i) => (
          <path
            key={slice.ticker}
            d={describeArc(100, 100, 90, slice.startAngle, slice.startAngle + slice.angle)}
            fill={SLICE_COLORS[i % SLICE_COLORS.length]}
            opacity={activeIndex === null || activeIndex === i ? 1 : 0.4}
            className={styles.slice}
            onClick={() => setActiveIndex(i === activeIndex ? null : i)}
            aria-label={`${slice.ticker} ${Math.round(slice.ratio * 100)}%`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setActiveIndex(i === activeIndex ? null : i)}
          />
        ))}
      </svg>

      {activeIndex !== null && (
        <div className={styles.detail} aria-live="polite">
          <span className={`${styles.ticker} etf-ticker-code`}>
            {slices[activeIndex].ticker}
          </span>
          <span className={styles.ratio}>
            {Math.round(slices[activeIndex].ratio * 100)}%
          </span>
        </div>
      )}

      <div className={styles.legend}>
        {slices.map((slice, i) => (
          <div key={slice.ticker} className={styles.legendItem}>
            <span
              className={styles.legendDot}
              style={{ background: SLICE_COLORS[i % SLICE_COLORS.length] }}
              aria-hidden="true"
            />
            <span className={`${styles.legendTicker} etf-ticker-code`}>{slice.ticker}</span>
            <span className={styles.legendRatio}>{Math.round(slice.ratio * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
