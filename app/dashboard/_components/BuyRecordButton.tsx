'use client'

import { useTransition } from 'react'
import { addTransactionAction } from '@/app/actions/transaction'
import Button from '@/components/Button/Button'
import { useToast } from '@/components/Toast/ToastContext'

type BuyRecordButtonProps = {
  etfId: string
  ticker: string
  onSuccess: () => void
  onRollback: () => void
}

export default function BuyRecordButton({ etfId, ticker, onSuccess, onRollback }: BuyRecordButtonProps) {
  const [isPending, startTransition] = useTransition()
  const { showToast } = useToast()

  function handleClick() {
    onSuccess()

    startTransition(async () => {
      try {
        await addTransactionAction(etfId)
        showToast(`🎉 오늘 ${ticker} 1주 완료!`, 'success')
      } catch {
        onRollback()
        showToast('매수 기록에 실패했어요. 다시 시도해 주세요.', 'error')
      }
    })
  }

  return (
    <Button
      variant="primary"
      size="lg"
      isLoading={isPending}
      onClick={handleClick}
      ariaLabel={`오늘 ${ticker} ETF 1주 매수 기록`}
      style={{ width: '100%' }}
    >
      ✅ 오늘 1주 매수 기록하기
    </Button>
  )
}
