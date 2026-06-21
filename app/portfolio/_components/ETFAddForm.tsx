'use client'

import { useState, useRef } from 'react'
import { addETFHoldingAction } from '@/app/actions/etf'
import Button from '@/components/Button/Button'
import ETF_LIST from '@/lib/static/etf-list.json'
import styles from './ETFAddForm.module.scss'

type FormValues = {
  ticker: string
  avgPrice: string
  quantity: string
  annualDividendPerShare: string
}

type ETFItem = { name: string; code: string; category: string }

const INITIAL: FormValues = { ticker: '', avgPrice: '', quantity: '1', annualDividendPerShare: '' }
const MAX_SUGGESTIONS = 8

function formatWon(value: string): string {
  const digits = value.replace(/[^0-9]/g, '')
  return digits ? Number(digits).toLocaleString('ko-KR') : ''
}

function parseWon(value: string): number {
  return Number(value.replace(/,/g, ''))
}

type ETFAddFormProps = {
  onAdd?: (data: {
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
  const [suggestions, setSuggestions] = useState<ETFItem[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const blurTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleTickerChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setValues((prev) => ({ ...prev, ticker: value }))
    setError('')

    if (value.trim().length === 0) {
      setSuggestions([])
      return
    }

    const lower = value.toLowerCase()
    const matched = (ETF_LIST as ETFItem[])
      .filter((etf) => etf.name.toLowerCase().includes(lower) || etf.code.includes(value))
      .slice(0, MAX_SUGGESTIONS)
    setSuggestions(matched)
    setShowSuggestions(true)
  }

  function handleTickerFocus() {
    if (suggestions.length > 0) setShowSuggestions(true)
  }

  function handleTickerBlur() {
    blurTimerRef.current = setTimeout(() => setShowSuggestions(false), 150)
  }

  function handleSelectSuggestion(etf: ETFItem) {
    if (blurTimerRef.current) clearTimeout(blurTimerRef.current)
    setValues((prev) => ({ ...prev, ticker: etf.name }))
    setSuggestions([])
    setShowSuggestions(false)
  }

  function handleAvgPriceChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValues((prev) => ({ ...prev, avgPrice: formatWon(e.target.value) }))
    setError('')
  }

  function handleChange(field: keyof Omit<FormValues, 'ticker' | 'avgPrice'>) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [field]: e.target.value }))
      setError('')
    }
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()

    const avgPrice = parseWon(values.avgPrice)
    const quantity = Number(values.quantity)
    const annualDividendPerShare = Number(values.annualDividendPerShare)

    if (!values.ticker.trim()) { setError('종목명을 입력해주세요.'); return }
    if (isNaN(avgPrice) || avgPrice <= 0) { setError('올바른 평단가를 입력해주세요.'); return }
    if (isNaN(quantity) || quantity <= 0) { setError('올바른 수량을 입력해주세요.'); return }
    if (isNaN(annualDividendPerShare) || annualDividendPerShare < 0) {
      setError('올바른 연간 배당금을 입력해주세요.')
      return
    }

    const payload = { ticker: values.ticker.trim(), avgPrice, quantity, annualDividendPerShare }

    setIsLoading(true)
    try {
      await (onAdd ? onAdd(payload) : addETFHoldingAction(payload))
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
        <label className={styles.label} htmlFor="ticker">ETF 종목명/코드</label>
        <div className={styles.autocompleteWrapper}>
          <input
            id="ticker"
            type="text"
            className={styles.input}
            value={values.ticker}
            onChange={handleTickerChange}
            onFocus={handleTickerFocus}
            onBlur={handleTickerBlur}
            placeholder="예: TIGER 미국배당다우존스"
            aria-required="true"
            aria-autocomplete="list"
            aria-expanded={showSuggestions && suggestions.length > 0}
            autoComplete="off"
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul className={styles.suggestions} role="listbox" aria-label="ETF 종목 추천">
              {suggestions.map((etf) => (
                <li
                  key={etf.code + etf.name}
                  role="option"
                  className={styles.suggestionItem}
                  onMouseDown={() => handleSelectSuggestion(etf)}
                >
                  <span className={styles.suggestionName}>{etf.name}</span>
                  <span className={styles.suggestionMeta}>
                    <span className={styles.suggestionCode}>{etf.code}</span>
                    <span className={styles.suggestionCategory}>{etf.category}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="avgPrice">평단가 (원)</label>
          <input
            id="avgPrice"
            type="text"
            inputMode="numeric"
            className={styles.input}
            value={values.avgPrice}
            onChange={handleAvgPriceChange}
            placeholder="10,000"
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
