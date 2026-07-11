import { calcInvestorLevel } from '@/lib/investor-level'
import styles from './LevelBadge.module.scss'

type LevelBadgeProps = {
  totalPrincipal: number
}

export default function LevelBadge({ totalPrincipal }: LevelBadgeProps) {
  const { level, name, emoji, minAmount, nextLevelAmount } = calcInvestorLevel(totalPrincipal)

  const progressPercent = nextLevelAmount
    ? Math.min(
        Math.round(((totalPrincipal - minAmount) / (nextLevelAmount - minAmount)) * 100),
        100,
      )
    : 100

  const remaining = nextLevelAmount ? nextLevelAmount - totalPrincipal : 0

  return (
    <section aria-label="투자자 레벨" className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.badge}>
          {emoji} Lv.{level} {name}
        </span>
        <span className={styles.amount}>{totalPrincipal.toLocaleString('ko-KR')}원</span>
      </div>

      <div
        className={styles.track}
        role="progressbar"
        aria-valuenow={progressPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={
          nextLevelAmount
            ? `다음 레벨까지 ${remaining.toLocaleString('ko-KR')}원 남음`
            : '최고 레벨 달성'
        }
      >
        <div className={styles.fill} style={{ width: `${progressPercent}%` }} />
      </div>

      <p className={styles.desc}>
        {nextLevelAmount
          ? `다음 레벨까지 ${remaining.toLocaleString('ko-KR')}원`
          : '최고 레벨을 달성했어요 🎉'}
      </p>
    </section>
  )
}
