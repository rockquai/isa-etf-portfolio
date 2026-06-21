'use client'

import { useState, useTransition } from 'react'
import { saveGoalAction } from '@/app/actions/goal'
import { useToast } from '@/components/Toast/ToastContext'
import styles from './MyGoalBanner.module.scss'

type MyGoalBannerProps = {
  initialGoal: string
}

type DisplayMode = 'empty' | 'display' | 'editing'

export default function MyGoalBanner({ initialGoal }: MyGoalBannerProps) {
  const [mode, setMode] = useState<DisplayMode>(initialGoal ? 'display' : 'empty')
  const [draft, setDraft] = useState(initialGoal)
  const [saved, setSaved] = useState(initialGoal)
  const [isPending, startTransition] = useTransition()
  const { showToast } = useToast()

  function handleEdit() {
    setDraft(saved)
    setMode('editing')
  }

  function handleSave() {
    const trimmed = draft.trim()
    if (!trimmed) return

    startTransition(async () => {
      try {
        await saveGoalAction(trimmed)
        setSaved(trimmed)
        setMode('display')
        showToast('투자 다짐을 저장했어요 ✨', 'success')
      } catch {
        showToast('저장에 실패했어요. 다시 시도해 주세요.', 'error')
      }
    })
  }

  function handleCancel() {
    setDraft(saved)
    setMode(saved ? 'display' : 'empty')
  }

  if (mode === 'editing') {
    return (
      <section className={styles.wrapper} aria-label="투자 다짐 편집">
        <textarea
          className={styles.textarea}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          maxLength={100}
          rows={3}
          autoFocus
          aria-label="투자 다짐 문구 입력"
          placeholder="나만의 투자 목표를 입력해봐요 (예: 10년 후 배당으로 BTS 콘서트 가자!)"
        />
        <div className={styles.footer}>
          <span className={styles.counter}>{draft.length}/100</span>
          <div className={styles.actions}>
            <button type="button" onClick={handleCancel} className={styles.cancelBtn} aria-label="취소">
              취소
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isPending || !draft.trim()}
              className={styles.saveBtn}
              aria-label="저장"
            >
              {isPending ? '저장 중...' : '저장'}
            </button>
          </div>
        </div>
      </section>
    )
  }

  if (mode === 'display') {
    return (
      <section className={styles.wrapper} aria-label="나만의 투자 다짐">
        <p className={styles.goal}>{saved}</p>
        <button type="button" onClick={handleEdit} className={styles.editBtn} aria-label="투자 다짐 수정">
          수정
        </button>
      </section>
    )
  }

  return (
    <section className={styles.wrapper} aria-label="투자 다짐 배너">
      <p className={styles.emptyText}>
        나만의 투자 다짐을 입력해 보세요 💪 <br />
        예) 7년후 20주년 BTS 월드 투어 콘서트 위해 ETF주 사자!
      </p>
      <button type="button" onClick={handleEdit} className={styles.addBtn} aria-label="투자 다짐 추가">
        + 다짐 추가하기
      </button>
    </section>
  )
}
