'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100dvh',
        padding: '24px',
        gap: '16px',
        textAlign: 'center',
      }}
    >
      <span style={{ fontSize: '48px' }}>⚠️</span>
      <h2 style={{ fontSize: '18px', fontWeight: 700 }}>오류가 발생했어요</h2>
      <p style={{ fontSize: '14px', color: '#6b7280' }}>
        잠시 후 다시 시도해 주세요.
      </p>
      <button
        onClick={reset}
        style={{
          minHeight: '44px',
          padding: '0 24px',
          borderRadius: '8px',
          background: '#e53e3e',
          color: '#fff',
          border: 'none',
          fontSize: '14px',
          fontWeight: 500,
          cursor: 'pointer',
        }}
      >
        다시 시도
      </button>
    </main>
  )
}
