import { Suspense } from 'react'

// 빌드 시점이 아닌 요청 시점에 렌더링 (RSS fetch, Supabase 인증 등 런타임 의존)
export const dynamic = 'force-dynamic'
import { createServerSupabaseClient } from '@/lib/supabase'
import { MOCK_ETF_HOLDINGS } from '@/lib/mock/etf'
import { MOCK_BRIEFING } from '@/lib/mock/briefing'
import {
  calcAllProjections,
  calcMonthlyDividendByHolding,
  calcMonthlyDividendTotal,
  getProjectionLabel,
} from '@/lib/dividend-calculator'
import { calcIsaTaxSavings } from '@/lib/isa-tax'
import { getGrapeBoardState, type GrapeBoardState } from '@/lib/routineSticker'
import type { ETFHolding } from '@/types/etf'
import MyGoalBanner from './_components/MyGoalBanner'
import DividendTimeline from './_components/DividendTimeline'
import DividendPipeline from './_components/DividendPipeline'
import DividendRealizationCard from './_components/DividendRealizationCard'
import ISATaxSavings from './_components/ISATaxSavings'
import GrapeBoard from './_components/GrapeBoard'
import TodayImpact from './_components/TodayImpact'
import NewsFeed from './_components/NewsFeed'
import MorningBriefingVideo from './_components/MorningBriefingVideo'
import AIBriefing from './_components/AIBriefing'
import DashboardInteractive from './_components/DashboardInteractive'
import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary'
import SkeletonUI from '@/components/SkeletonUI/SkeletonUI'
import styles from './page.module.scss'

const GOAL_AMOUNT = 500000 // 월 50만원 목표

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let holdings: ETFHolding[] = MOCK_ETF_HOLDINGS // 데이터 없을 때 Mock 폴백
  let goalMessage = ''
  let grapeBoardState: GrapeBoardState = { totalDays: 0, completedBoards: 0, currentBoardFill: 0 }

  if (user) {
    const [holdingsResult, settingsResult, grapeBoard] = await Promise.all([
      supabase.from('etf_holdings').select('*').eq('user_id', user.id).order('created_at'),
      supabase.from('user_settings').select('goal_message').eq('user_id', user.id).single(),
      getGrapeBoardState(supabase, user.id),
    ])

    if (holdingsResult.data && holdingsResult.data.length > 0) {
      holdings = holdingsResult.data.map((row) => ({
        id: row.id,
        ticker: row.ticker,
        avgPrice: Number(row.avg_price),
        currentPrice: Number(row.current_price ?? row.avg_price),
        quantity: row.quantity,
        annualDividendPerShare: Number(row.annual_dividend_per_share),
        dividendGrowthRate: Number(row.dividend_growth_rate),
        isProfit: row.is_profit ?? false,
      }))
    }

    goalMessage = settingsResult.data?.goal_message ?? ''
    grapeBoardState = grapeBoard
  }

  const projections = calcAllProjections(holdings)
  const plusOneProjections = calcAllProjections(holdings, false, 1)
  const projectionLabel = getProjectionLabel(false, 0)
  const monthlyDividendEstimates = calcMonthlyDividendByHolding(holdings)
  const monthlyDividendTotal = calcMonthlyDividendTotal(holdings)
  const isaTaxSavings = calcIsaTaxSavings(holdings)

  const currentMonthlyDividend = projections[0]?.monthlyDividend ?? 0
  const percentage = Math.min((currentMonthlyDividend / GOAL_AMOUNT) * 100, 100)
  const firstHolding = holdings[0] ?? null

  const todayStr = new Date().toLocaleDateString('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  })

  return (
    <main className={styles.main}>
      <section className={styles.header}>
        <div className={styles.greetingRow}>
          <p className={styles.greeting}>둥근 해 미친 거 또 떴네!☀️</p>
          <span className={styles.date}>{todayStr}</span>
        </div>
        <p className={styles.subGreeting}>
          오늘도 충동구매 대신,<br />
          택배 기다리는 재미 대신,<br />
          수익률 기다리는 재미를 담아보세요!
        </p>
      </section>

      <MyGoalBanner initialGoal={goalMessage} />

      <DividendTimeline projections={projections} projectionLabel={projectionLabel} />

      <DividendPipeline estimates={monthlyDividendEstimates} />

      <DividendRealizationCard monthlyDividendTotal={monthlyDividendTotal} />

      <ISATaxSavings taxSavings={isaTaxSavings} />

      <GrapeBoard state={grapeBoardState} />

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

      <AIBriefing initialBriefing={MOCK_BRIEFING} />

      <ErrorBoundary>
        <Suspense fallback={<SkeletonUI height="220px" borderRadius="12px" />}>
          <MorningBriefingVideo />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary>
        <Suspense fallback={<SkeletonUI height="120px" borderRadius="12px" />}>
          <NewsFeed />
        </Suspense>
      </ErrorBoundary>
    </main>
  )
}
