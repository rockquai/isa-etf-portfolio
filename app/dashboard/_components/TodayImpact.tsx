import type { DividendProjection } from '@/types/etf'
import styles from './TodayImpact.module.scss'

const YEARS = [3, 5, 10, 20] as const

type TodayImpactProps = {
  currentProjections: DividendProjection[]
  plusOneProjections: DividendProjection[]
  ticker: string
}

export default function TodayImpact({ currentProjections, plusOneProjections, ticker }: TodayImpactProps) {
  return (
    <section className={styles.wrapper} aria-label="오늘 1주 매수 시 배당 증가">
      <h3 className={styles.title}>
        🛒 오늘 {ticker} 1주 매수하면?
      </h3>
      <div className={styles.rows}>
        {YEARS.map((year) => {
          const cur = currentProjections.find((p) => p.year === year)
          const plus = plusOneProjections.find((p) => p.year === year)
          const diff = (plus?.monthlyDividend ?? 0) - (cur?.monthlyDividend ?? 0)
          return (
            <div key={year} className={styles.row}>
              <span className={styles.label}>{year}년 후 월 배당</span>
              <span className={`${styles.diff} dividend-value`}>+{Math.round(diff).toLocaleString()}원 ↑</span>
            </div>
          )
        })}
      </div>
      <p className={styles.disclaimer}>
        ※ 위 예측은 현재 배당률과 연 5% 성장률을 가정한 시뮬레이션이며,<br />
        실제 배당금과 다를 수 있습니다. 본 앱은 투자 권유를 하지 않습니다.
      </p>
    </section>
  )
}
