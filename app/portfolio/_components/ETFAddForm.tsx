'use client'

import { useState } from 'react'
import Button from '@/components/Button/Button'
import styles from './ETFAddForm.module.scss'

type FormValues = {
  ticker: string
  avgPrice: string
  quantity: string
  annualDividendPerShare: string
}

const INITIAL: FormValues = { ticker: '', avgPrice: '', quantity: '1', annualDividendPerShare: '' }

type ETFAddFormProps = {
  onAdd: (data: {
    ticker: string
    avgPrice: number
    quantity: number
    annualDividendPerShare: number
  }) => Promise<void>
}

export default function ETFAddForm({ onAdd }: ETFAddFormProps) {
  const [values, setValues] = useState<FormValues>(INITIAL)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  function handleChange(field: keyof FormValues) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [field]: e.target.value }))
      setError('')
    }
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()

    const avgPrice = Number(values.avgPrice)
    const quantity = Number(values.quantity)
    const annualDividendPerShare = Number(values.annualDividendPerShare)

    if (!values.ticker.trim()) { setError('종목명을 입력해주세요.'); return }
    if (isNaN(avgPrice) || avgPrice <= 0) { setError('올바른 평단가를 입력해주세요.'); return }
    if (isNaN(quantity) || quantity <= 0) { setError('올바른 수량을 입력해주세요.'); return }
    if (isNaN(annualDividendPerShare) || annualDividendPerShare < 0) {
      setError('올바른 연간 배당금을 입력해주세요.')
      return
    }

    setIsLoading(true)
    try {
      await onAdd({
        ticker: values.ticker.trim(),
        avgPrice,
        quantity,
        annualDividendPerShare,
      })
      setValues(INITIAL)
    } catch {
      setError('저장에 실패했어요. 다시 시도해 주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      <h3 className={styles.title}>+ ETF 종목 추가</h3>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="ticker">종목명</label>
        <input
          id="ticker"
          type="text"
          className={styles.input}
          value={values.ticker}
          onChange={handleChange('ticker')}
          placeholder="예: TIGER 미국배당다우존스"
          aria-required="true"
        />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="avgPrice">평단가 (원)</label>
          <input
            id="avgPrice"
            type="number"
            className={styles.input}
            value={values.avgPrice}
            onChange={handleChange('avgPrice')}
            placeholder="10000"
            min="1"
            aria-required="true"
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="quantity">수량 (주)</label>
          <input
            id="quantity"
            type="number"
            className={styles.input}
            value={values.quantity}
            onChange={handleChange('quantity')}
            placeholder="1"
            min="1"
            aria-required="true"
          />
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="dividendPerShare">1주당 연간 배당금 (원)</label>
        <input
          id="dividendPerShare"
          type="number"
          className={styles.input}
          value={values.annualDividendPerShare}
          onChange={handleChange('annualDividendPerShare')}
          placeholder="480"
          min="0"
          aria-required="true"
        />
      </div>

      {error && (
        <p className={styles.error} role="alert">{error}</p>
      )}

      <Button
        type="submit"
        variant="primary"
        size="md"
        isLoading={isLoading}
        style={{ width: '100%' }}
        ariaLabel="ETF 종목 추가"
      >
        종목 추가하기
      </Button>
    </form>
  )
}
