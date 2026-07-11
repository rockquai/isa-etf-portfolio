import { calcProCoverageMonths, GENERAL_ACCOUNT_WITHHOLDING_RATE } from '@/lib/isa-tax'
import styles from './ISATaxSavings.module.scss'

type ISATaxSavingsProps = {
  taxSavings: number
}

export default function ISATaxSavings({ taxSavings }: ISATaxSavingsProps) {
  const proCoverageMonths = calcProCoverageMonths(taxSavings)
  const withholdingPercent = Math.round(GENERAL_ACCOUNT_WITHHOLDING_RATE * 1000) / 10

  return (
    <section aria-label="ISA 절세 카운터" className={styles.wrapper}>
      <p className={styles.title}>💰 ISA로 아낀 세금 (연간 추정)</p>
      <p className={styles.amount}>{taxSavings.toLocaleString('ko-KR')}원</p>
      <p className={styles.desc}>
        일반계좌였다면 배당소득세 {withholdingPercent}% 원천징수, ISA는 비과세·분리과세 혜택
      </p>

      {proCoverageMonths >= 1 && (
        <p className={styles.cta}>이 금액이면 Pro 구독 {proCoverageMonths}개월을 커버할 수 있어요</p>
      )}

      <p className={styles.assumption}>※ 보유 종목 기준 연간 배당 추정치에 적용한 값이에요</p>
    </section>
  )
}
