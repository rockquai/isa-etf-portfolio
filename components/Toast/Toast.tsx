'use client'

import { useToast } from './ToastContext'
import styles from './Toast.module.scss'

export default function ToastContainer() {
  const { toasts, removeToast } = useToast()

  return (
    <div className={styles.container} aria-live="polite" aria-atomic="false">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={[styles.toast, styles[`toast--${toast.type}`]].join(' ')}
          role="status"
        >
          <span className={styles.icon}>{toast.type === 'success' ? '🎉' : '⚠️'}</span>
          <span className={styles.message}>{toast.message}</span>
          <button
            type="button"
            className={styles.close}
            onClick={() => removeToast(toast.id)}
            aria-label="알림 닫기"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}
