'use client'

import { useEffect, useState } from 'react'
import styles from './GoalGauge.module.scss'

type GoalGaugeProps = {
  percentage: number
  goalAmount: number
  currentMonthlyDividend: number
}

export default function GoalGauge({ percentage, goalAmount, currentMonthlyDividend }: GoalGaugeProps) {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const id = requestAnimationFrame(() => setWidth(Math.min(percentage, 100)))
    return () => cancelAnimationFrame(id)
  }, [percentage])

  const remaining = Math.max(0, goalAmount - currentMonthlyDividend)

  return (
    <section className={styles.wrapper} aria-label="목표 달성률">
      <div className={styles.header}>
        <span className={styles.title}>📅 나의 배당 파이프라인</span>
        <span className={styles.percent}>{Math.round(percentage)}% 달성</span>
      </div>
      <div
        className={styles.track}
        role="progressbar"
        aria-valuenow={Math.round(percentage)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`목표 달성률 ${Math.round(percentage)}%`}
      >
        <div className={styles.fill} style={{ width: `${width}%` }} />
      </div>
      {remaining > 0 && (
        <p className={styles.remaining}>
          월 {goalAmount.toLocaleString()}원 목표까지{' '}
          <span className={`${styles.amount} dividend-value`}>
            {remaining.toLocaleString()}원
          </span>{' '}
          남았어요
        </p>
      )}
      {remaining === 0 && (
        <p className={styles.achieved}>🏆 월 배당 목표 달성!</p>
      )}
    </section>
  )
}
