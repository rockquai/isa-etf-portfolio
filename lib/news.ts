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

const RSS_URL = process.env.HANKYUNG_RSS_URL ?? 'https://www.hankyung.com/feed/economy'

export async function fetchNews(): Promise<{ data: NewsItem[]; isMock: boolean }> {
  try {
    const feed = await parser.parseURL(RSS_URL)
    const data: NewsItem[] = feed.items.slice(0, 25).map((item) => ({
      title: item.title ?? '',
      link: item.link ?? '#',
      pubDate: item.pubDate ?? new Date().toISOString(),
    }))
    return { data, isMock: false }
  } catch (error) {
    console.error('RSS fetch failed, using mock fallback:', error)
    return { data: MOCK_NEWS, isMock: true }
  }
}
