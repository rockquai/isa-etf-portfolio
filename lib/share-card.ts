import type { DividendProjection } from '@/types/etf'

export type ShareCardData = {
  projections: DividendProjection[]
  goalMessage: string
  totalPrincipal: number
  userName?: string
}

/**
 * 공유 카드 텍스트 생성 (Web Share API용)
 */
export function generateShareText(data: ShareCardData): string {
  const { projections, goalMessage, totalPrincipal } = data

  const years = projections.map((p) => `${p.year}년 후: 월 ${(p.monthlyDividend / 10000).toFixed(1)}만원`)

  const title = '💰 나의 ETF 배당 파이프라인'
  const stats = years.join(' | ')
  const message = goalMessage ? `"${goalMessage}"` : '나도 배당 투자 시작하기'
  const cta = '\n📈 나도 시작하기 → [앱 다운로드]'
  const disclaimer = '\n※ 연 5% 배당 성장률 가정 시뮬레이션'

  return [title, stats, message, cta, disclaimer].filter(Boolean).join('\n')
}

/**
 * 공유 URL 생성 (OG 메타태그용)
 * 추후 동적 렌더링 시 사용
 */
export function generateShareUrl(userId: string, token?: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://isa-portfolio.vercel.app'
  const params = new URLSearchParams({ share: userId })
  if (token) params.append('token', token)
  return `${baseUrl}/dashboard/share?${params.toString()}`
}
