import styles from './PriceText.module.scss'

type PriceTextProps = {
  value: number
  isProfit: boolean
  showSign?: boolean
}

export default function PriceText({ value, isProfit, showSign = true }: PriceTextProps) {
  return (
    <span className={[styles.price, isProfit ? styles.up : styles.down].join(' ')}>
      {showSign && (isProfit ? '+' : '-')}
      {Math.abs(value).toLocaleString()}원
    </span>
  )
}
