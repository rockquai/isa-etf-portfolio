'use client'

import { useState } from 'react'
import GoalGauge from './GoalGauge'
import BuyRecordButton from './BuyRecordButton'
import type { ETFHolding } from '@/types/etf'

type DashboardInteractiveProps = {
  initialPercentage: number
  goalAmount: number
  currentMonthlyDividend: number
  firstHolding: ETFHolding | null
}

export default function DashboardInteractive({
  initialPercentage,
  goalAmount,
  currentMonthlyDividend,
  firstHolding,
}: DashboardInteractiveProps) {
  const [percentage, setPercentage] = useState(initialPercentage)
  const [dividend, setDividend] = useState(currentMonthlyDividend)

  function handleSuccess() {
    // 낙관적 업데이트: 배당금 증가분 즉시 반영
    const estimatedIncrease = firstHolding
      ? firstHolding.annualDividendPerShare / 12
      : 100
    const newDividend = dividend + estimatedIncrease
    setDividend(newDividend)
    setPercentage(Math.min((newDividend / goalAmount) * 100, 100))
  }

  function handleRollback() {
    setDividend(currentMonthlyDividend)
    setPercentage(initialPercentage)
  }

  return (
    <>
      <GoalGauge
        percentage={percentage}
        goalAmount={goalAmount}
        currentMonthlyDividend={dividend}
      />
      {firstHolding && (
        <BuyRecordButton
          etfId={firstHolding.id}
          ticker={firstHolding.ticker}
          onSuccess={handleSuccess}
          onRollback={handleRollback}
        />
      )}
    </>
  )
}
