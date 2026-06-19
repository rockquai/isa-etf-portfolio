import type { Metadata } from 'next'
import '@/styles/globals.scss'

export const metadata: Metadata = {
  title: '주린이 루틴 정착을 위한 ISA ETF 포트폴리오 관리 웹뷰 서비스',
  description: 'ISA 계좌 ETF 배당 포트폴리오 관리 — 목표 달성률, 배당 예측, AI 브리핑',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
