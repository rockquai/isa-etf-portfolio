import { calcDividendRealization } from '@/lib/dividend-realization'
import styles from './DividendRealizationCard.module.scss'

type DividendRealizationCardProps = {
  monthlyDividendTotal: number
}

export default function DividendRealizationCard({ monthlyDividendTotal }: DividendRealizationCardProps) {
  const realization = calcDividendRealization(monthlyDividendTotal)

  return (
    <section aria-label="배당 실물화" className={styles.wrapper}>
      {realization ? (
        <>
          <p className={styles.text}>
            이번 달 배당 {monthlyDividendTotal.toLocaleString('ko-KR')}원 ={' '}
            <strong className={styles.highlight}>
              {realization.name} {realization.count}개
            </strong>
          </p>
          <p className={styles.emojis} aria-hidden="true">
            {realization.emoji.repeat(realization.count)}
          </p>
          <p className={styles.assumption}>※ 보유 수량 기준 추정치를 체감하기 쉽게 환산한 값이에요</p>
        </>
      ) : (
        <p className={styles.empty}>이번 달 배당 추정치가 아직 없어요</p>
      )}
    </section>
  )
}
