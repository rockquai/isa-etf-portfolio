'use client'

import { useState } from 'react'
import { MOCK_ETF_HOLDINGS } from '@/lib/mock/etf'
import { MOCK_TRANSACTIONS } from '@/lib/mock/transactions'
import type { ETFHolding } from '@/types/etf'
import ETFPieChart from './_components/ETFPieChart'
import ETFTag from '@/components/ETFTag/ETFTag'
import TransactionHistory from './_components/TransactionHistory'
import ETFAddForm from './_components/ETFAddForm'
import styles from './page.module.scss'

export default function PortfolioPage() {
  const [holdings, setHoldings] = useState<ETFHolding[]>(MOCK_ETF_HOLDINGS)

  async function handleAddETF(data: {
    ticker: string
    avgPrice: number
    quantity: number
    annualDividendPerShare: number
  }) {
    const newHolding: ETFHolding = {
      id: `etf-${Date.now()}`,
      ...data,
      currentPrice: data.avgPrice,
      dividendGrowthRate: 0.05,
      isProfit: false,
    }
    setHoldings((prev) => [...prev, newHolding])
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

      <ETFAddForm onAdd={handleAddETF} />

      <TransactionHistory transactions={MOCK_TRANSACTIONS} />
    </main>
  )
}
