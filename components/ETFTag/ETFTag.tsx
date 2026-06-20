import Badge from '@/components/Badge/Badge'
import styles from './ETFTag.module.scss'
import type { ETFHolding } from '@/types/etf'

type ETFTagProps = Pick<ETFHolding, 'ticker' | 'currentPrice' | 'avgPrice' | 'isProfit'> & {
  changePercent?: number
}

export default function ETFTag({ ticker, currentPrice, avgPrice, isProfit, changePercent }: ETFTagProps) {
  const percent =
    changePercent ?? (((currentPrice - avgPrice) / avgPrice) * 100)
  const label = `${Math.abs(percent).toFixed(1)}%`

  return (
    <div className={styles.tag}>
      <span className={`${styles.ticker} etf-ticker-code`}>{ticker}</span>
      <div className={styles.right}>
        <span className={`${styles.price} price-value`}>{currentPrice.toLocaleString()}원</span>
        <Badge label={label} variant={isProfit ? 'up' : 'down'} />
      </div>
    </div>
  )
}
