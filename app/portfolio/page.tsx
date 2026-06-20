import { createServerSupabaseClient } from '@/lib/supabase'
import { MOCK_TRANSACTIONS } from '@/lib/mock/transactions'
import type { ETFHolding } from '@/types/etf'
import ETFPieChart from './_components/ETFPieChart'
import ETFTag from '@/components/ETFTag/ETFTag'
import TransactionHistory from './_components/TransactionHistory'
import ETFAddForm from './_components/ETFAddForm'
import styles from './page.module.scss'

export const dynamic = 'force-dynamic'

export default async function PortfolioPage() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let holdings: ETFHolding[] = []

  if (user) {
    const { data } = await supabase
      .from('etf_holdings')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at')

    if (data) {
      holdings = data.map((row) => ({
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
  }

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>📊 내 포트폴리오</h1>

      <section aria-label="ETF 비중 차트">
        <ETFPieChart holdings={holdings} />
      </section>

      <section aria-label="보유 종목 목록">
        <h2 className={styles.sectionTitle}>보유 종목</h2>
        {holdings.length === 0 ? (
          <p className={styles.emptyText}>아직 종목이 없어요. 첫 ETF를 추가해보세요!</p>
        ) : (
          <div className={styles.holdingList}>
            {holdings.map((h) => (
              <ETFTag
                key={h.id}
                ticker={h.ticker}
                currentPrice={h.currentPrice}
                avgPrice={h.avgPrice}
                isProfit={h.isProfit}
              />
            ))}
          </div>
        )}
      </section>

      <ETFAddForm />

      <TransactionHistory transactions={MOCK_TRANSACTIONS} />
    </main>
  )
}
