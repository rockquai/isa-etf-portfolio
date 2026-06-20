import { fetchNews } from '@/lib/news'
import type { NewsItem } from '@/types/etf'
import styles from './NewsFeed.module.scss'

function NewsCard({ item }: { item: NewsItem }) {
  const date = new Date(item.pubDate).toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric',
  })

  return (
    <article className={styles.newsCard}>
      <a
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.newsLink} news-content`}
        aria-label={item.title}
      >
        <p className={styles.newsTitle}>{item.title}</p>
        <time className={styles.newsDate} dateTime={item.pubDate}>
          {date}
        </time>
      </a>
    </article>
  )
}

export default async function NewsFeed() {
  const { data: news, isMock } = await fetchNews()

  return (
    <section aria-label="오늘의 경제 뉴스">
      <div className={styles.header}>
        <h2 className={styles.title}>📰 오늘의 경제 뉴스</h2>
        {isMock && (
          <span className={styles.mockBadge} aria-label="Mock 데이터">
            Mock
          </span>
        )}
      </div>
      <div className={styles.list}>
        {news.map((item, i) => (
          <NewsCard key={i} item={item} />
        ))}
      </div>
    </section>
  )
}
