'use client'

import { List, useListRef } from 'react-window'
import type { Transaction } from '@/types/etf'
import { MOCK_ETF_HOLDINGS } from '@/lib/mock/etf'
import styles from './TransactionHistory.module.scss'

// react-window v2: RowProps는 커스텀 props만 (index/style/ariaAttributes는 제외)
type RowCustomProps = {
  transactions: Transaction[]
}

function TransactionRow({
  index,
  style,
  ariaAttributes,
  transactions,
}: {
  index: number
  style: React.CSSProperties
  ariaAttributes: { 'aria-posinset': number; 'aria-setsize': number; role: 'listitem' }
} & RowCustomProps) {
  const tx = transactions[index]
  const etf = MOCK_ETF_HOLDINGS.find((h) => h.id === tx.etfId)

  return (
    <div style={style} {...ariaAttributes} className={styles.row}>
      <div className={styles.left}>
        <span className={`${styles.ticker} etf-ticker-code`}>{etf?.ticker ?? tx.etfId}</span>
        <time className={styles.date}>{tx.date}</time>
      </div>
      <div className={styles.right}>
        <span className={`${styles.price} price-value`}>{tx.price.toLocaleString()}원</span>
        <span className={[styles.badge, tx.isProfit ? styles['badge--up'] : styles['badge--down']].join(' ')}>
          {tx.isProfit ? '수익' : '손실'}
        </span>
      </div>
    </div>
  )
}

type TransactionHistoryProps = {
  transactions: Transaction[]
}

export default function TransactionHistory({ transactions }: TransactionHistoryProps) {
  const listRef = useListRef(null)

  if (transactions.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyText}>아직 거래 내역이 없어요</p>
        <p className={styles.emptyHint}>첫 ETF 1주를 매수 기록해보세요 📈</p>
      </div>
    )
  }

  return (
    <section aria-label="거래 내역">
      <h2 className={styles.title}>📋 거래 내역</h2>
      <div style={{ height: 400 }}>
        <List
          rowComponent={TransactionRow}
          rowCount={transactions.length}
          rowHeight={60}
          listRef={listRef}
          rowProps={{ transactions }}
          className={styles.list}
        />
      </div>
    </section>
  )
}
