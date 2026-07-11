/**
 * KST(Asia/Seoul) 기준 오늘 날짜를 'YYYY-MM-DD' 형식으로 반환
 * Vercel 서버리스는 UTC로 동작하므로, 단순 new Date().toISOString().slice(0, 10)은
 * KST 00:00~08:59 구간에서 전날 날짜를 반환하는 버그가 있음
 */
export function getKstDateString(date: Date = new Date()): string {
  return date.toLocaleDateString('en-CA', { timeZone: 'Asia/Seoul' })
}
