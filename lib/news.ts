import Parser from 'rss-parser'
import type { NewsItem } from '@/types/etf'
import { MOCK_NEWS } from '@/lib/mock/news'

const parser = new Parser({
  timeout: 5000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; ETF-Portfolio-Bot/1.0)',
    Accept: 'application/rss+xml, application/xml, text/xml',
  },
})

const RSS_FEEDS = [
  'https://kr.investing.com/rss/news_25.rss',
  'https://www.mk.co.kr/rss/50200011/',
]

const ETF_KEYWORDS = [
  'ETF', '상장지수', 'TIGER', 'KODEX', 'RISE', 'ACE', 'KINDEX', 'HANARO',
  'S&P500', 'S&P 500', '나스닥', 'NASDAQ', '배당', 'ISA', '리츠', 'REIT',
  '인덱스펀드', '패시브', '액티브ETF',
]

const MIN_ETF_NEWS = 3
const MAX_NEWS = 25

function isEtfRelated(title: string): boolean {
  const upper = title.toUpperCase()
  return ETF_KEYWORDS.some((kw) => upper.includes(kw.toUpperCase()))
}

export async function fetchNews(): Promise<{ data: NewsItem[]; isMock: boolean; isFiltered: boolean }> {
  try {
    const results = await Promise.allSettled(RSS_FEEDS.map((url) => parser.parseURL(url)))

    const allItems: NewsItem[] = results
      .flatMap((r) => (r.status === 'fulfilled' ? r.value.items : []))
      .map((item) => ({
        title: item.title ?? '',
        link: item.link ?? '#',
        pubDate: item.pubDate ?? new Date().toISOString(),
      }))

    // 중복 제거 (link 기준)
    const seen = new Set<string>()
    const unique = allItems.filter((item) => {
      if (seen.has(item.link)) return false
      seen.add(item.link)
      return true
    })

    const filtered = unique.filter((item) => isEtfRelated(item.title))

    if (filtered.length >= MIN_ETF_NEWS) {
      return { data: filtered.slice(0, MAX_NEWS), isMock: false, isFiltered: true }
    }

    // ETF 관련 기사가 부족하면 일반 경제 뉴스로 폴백
    return { data: unique.slice(0, MAX_NEWS), isMock: false, isFiltered: false }
  } catch (error) {
    console.error('RSS fetch failed, using mock fallback:', error)
    return { data: MOCK_NEWS, isMock: true, isFiltered: true }
  }
}
