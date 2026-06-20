import { Suspense } from 'react'
import { MOCK_ETF_HOLDINGS } from '@/lib/mock/etf'
import { MOCK_BRIEFING } from '@/lib/mock/briefing'
import { calcAllProjections, getProjectionLabel } from '@/lib/dividend-calculator'
import MyGoalBanner from './_components/MyGoalBanner'
import DividendTimeline from './_components/DividendTimeline'
import TodayImpact from './_components/TodayImpact'
import NewsFeed from './_components/NewsFeed'
import AIBriefing from './_components/AIBriefing'
import DashboardInteractive from './_components/DashboardInteractive'
import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary'
import SkeletonUI from '@/components/SkeletonUI/SkeletonUI'
import styles from './page.module.scss'

const GOAL_AMOUNT = 500000 // 월 50만원 목표

export default async function DashboardPage() {
  // 실제로는 Supabase에서 사용자 데이터 조회
  const holdings = MOCK_ETF_HOLDINGS
  const goalMessage = ''

  const projections = calcAllProjections(holdings)
  const plusOneProjections = calcAllProjections(holdings, false, 1)
  const projectionLabel = getProjectionLabel(false, 0)

  const currentMonthlyDividend = projections[0]?.monthlyDividend ?? 0
  const percentage = Math.min((currentMonthlyDividend / GOAL_AMOUNT) * 100, 100)
  const firstHolding = holdings[0] ?? null

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <p className={styles.greeting}>좋은 아침이에요 ☀️</p>
        <p className={styles.subGreeting}>오늘도 장바구니 대신 ETF 장바구니 채워봐요.</p>
      </header>

      <MyGoalBanner initialGoal={goalMessage} />

      <DividendTimeline projections={projections} projectionLabel={projectionLabel} />

      <DashboardInteractive
        initialPercentage={percentage}
        goalAmount={GOAL_AMOUNT}
        currentMonthlyDividend={currentMonthlyDividend}
        firstHolding={firstHolding}
      />

      {firstHolding && (
        <TodayImpact
          currentProjections={projections}
          plusOneProjections={plusOneProjections}
          ticker={firstHolding.ticker}
        />
      )}

      <ErrorBoundary>
        <Suspense fallback={<SkeletonUI height="120px" borderRadius="12px" />}>
          <NewsFeed />
        </Suspense>
      </ErrorBoundary>

      <AIBriefing initialBriefing={MOCK_BRIEFING} />
    </main>
  )
}
