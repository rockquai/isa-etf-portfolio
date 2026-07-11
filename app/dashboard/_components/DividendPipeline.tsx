import type { MonthlyDividendEstimate } from '@/types/etf'
import styles from './DividendPipeline.module.scss'

type DividendPipelineProps = {
  estimates: MonthlyDividendEstimate[]
}

export default function DividendPipeline({ estimates }: DividendPipelineProps) {
  const total = estimates.reduce((sum, estimate) => sum + estimate.monthlyDividend, 0)

  return (
    <section aria-label="이번 달 배당 파이프라인" className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>💧 이번 달 배당 파이프라인</h2>
        <span className={styles.total}>{total.toLocaleString('ko-KR')}원</span>
      </div>

      {estimates.length === 0 ? (
        <p className={styles.empty}>보유 종목에 배당 정보가 없어요</p>
      ) : (
        <ul className={styles.list}>
          {estimates.map((estimate) => (
            <li key={estimate.ticker} className={styles.item}>
              <span className={styles.ticker}>{estimate.ticker}</span>
              <span className={styles.amount}>
                {estimate.monthlyDividend.toLocaleString('ko-KR')}원
              </span>
            </li>
          ))}
        </ul>
      )}

      <p className={styles.assumption}>※ 보유 수량 기준 추정치이며 실제 입금액과 다를 수 있어요</p>
    </section>
  )
}
