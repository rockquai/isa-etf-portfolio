import Link from 'next/link'

export default function NotFound() {
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
      <span style={{ fontSize: '48px' }}>📭</span>
      <h2 style={{ fontSize: '18px', fontWeight: 700 }}>페이지를 찾을 수 없어요</h2>
      <p style={{ fontSize: '14px', color: '#6b7280' }}>
        주소를 다시 확인해 주세요.
      </p>
      <Link
        href="/dashboard"
        style={{
          minHeight: '44px',
          display: 'inline-flex',
          alignItems: 'center',
          padding: '0 24px',
          borderRadius: '8px',
          background: '#e53e3e',
          color: '#fff',
          textDecoration: 'none',
          fontSize: '14px',
          fontWeight: 500,
        }}
      >
        홈으로 돌아가기
      </Link>
    </main>
  )
}
