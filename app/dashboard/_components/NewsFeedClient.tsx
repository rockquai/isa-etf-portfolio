'use client'

import { useState } from 'react'
import type { NewsItem } from '@/types/etf'
import styles from './NewsFeed.module.scss'

const PAGE_SIZE = 5

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

type NewsFeedClientProps = {
  allNews: NewsItem[]
  isMock: boolean
  isFiltered: boolean
}

export default function NewsFeedClient({ allNews, isMock, isFiltered }: NewsFeedClientProps) {
  const [batchIndex, setBatchIndex] = useState(0)

  const totalBatches = Math.max(1, Math.ceil(allNews.length / PAGE_SIZE))
  const currentNews = allNews.slice(batchIndex * PAGE_SIZE, (batchIndex + 1) * PAGE_SIZE)

  function handleRefresh() {
    setBatchIndex((prev) => (prev + 1) % totalBatches)
  }

  return (
    <section aria-label={isFiltered ? 'ETF 관련 뉴스' : '오늘의 경제 뉴스'}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          {isFiltered ? '📰 ETF 관련 뉴스' : '📰 오늘의 경제 뉴스'}
        </h2>
        <div className={styles.headerRight}>
          {isFiltered && !isMock && (
            <span className={styles.etfBadge} aria-label="ETF 필터 적용됨">
              ETF
            </span>
          )}
          {isMock && (
            <span className={styles.mockBadge} aria-label="Mock 데이터">
              Mock
            </span>
          )}
          {totalBatches > 1 && (
            <span className={styles.batchIndicator} aria-live="polite">
              {batchIndex + 1}/{totalBatches}
            </span>
          )}
          <button
            type="button"
            className={styles.refreshBtn}
            onClick={handleRefresh}
            aria-label="다음 뉴스 보기"
          >
            ↻
          </button>
        </div>
      </div>
      <div className={styles.list}>
        {currentNews.map((item, i) => (
          <NewsCard key={`${batchIndex}-${i}`} item={item} />
        ))}
      </div>
    </section>
  )
}
