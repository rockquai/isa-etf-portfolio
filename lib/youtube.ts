import Parser from 'rss-parser'

export type YoutubeVideoItem = {
  title: string
  videoId: string
  link: string
  thumbnail: string
  pubDate: string
  isToday: boolean
}

const PLAYLIST_RSS_URL =
  'https://www.youtube.com/feeds/videos.xml?playlist_id=PLVups02-DZEWWyOMyk4jjGaWJ_0o1N1iO'

const parser = new Parser({
  timeout: 5000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; ETF-Portfolio-Bot/1.0)',
  },
  customFields: {
    item: [['yt:videoId', 'videoId']],
  },
})

export async function fetchMorningVideo(): Promise<YoutubeVideoItem | null> {
  try {
    const feed = await parser.parseURL(PLAYLIST_RSS_URL)
    if (!feed.items.length) return null

    // 오늘 날짜를 YYYYMMDD 형식으로 (제목에서 매칭: "| 20260619🌞")
    const seoulDate = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Seoul' })
    const todayKey = seoulDate.replace(/-/g, '') // "20260619"

    const todayVideo = feed.items.find((item) => item.title?.includes(todayKey))
    const target = todayVideo ?? feed.items[0]

    if (!target) return null

    // rss-parser custom field 또는 link에서 videoId 추출
    const videoId: string =
      (target as unknown as Record<string, string>).videoId ||
      new URL(target.link ?? '').searchParams.get('v') ||
      ''

    if (!videoId) return null

    return {
      title: target.title ?? '',
      videoId,
      link: `https://www.youtube.com/watch?v=${videoId}`,
      thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      pubDate: target.pubDate ?? target.isoDate ?? '',
      isToday: !!todayVideo,
    }
  } catch (error) {
    console.error('YouTube RSS fetch failed:', error)
    return null
  }
}
