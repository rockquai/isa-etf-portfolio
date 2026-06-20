import type { DividendProjection } from '@/types/etf'
import styles from './DividendTimeline.module.scss'

const YEARS = [3, 5, 10, 20] as const

type DividendTimelineProps = {
  projections: DividendProjection[]
  projectionLabel: string
}

export default function DividendTimeline({ projections, projectionLabel }: DividendTimelineProps) {
  return (
    <section aria-label="배당 예측 타임라인">
      <div className={styles.timeline}>
        {YEARS.map((year) => {
          const p = projections.find((proj) => proj.year === year)
          const monthly = p ? Math.round(p.monthlyDividend / 10000) : 0
          return (
            <div key={year} className={styles.card}>
              <span className={styles.year}>{year}년 후</span>
              <span className={`${styles.amount} dividend-value`}>
                월 {monthly}만원
              </span>
            </div>
          )
        })}
      </div>
      <p className={styles.assumption}>※ {projectionLabel}</p>
    </section>
  )
}
