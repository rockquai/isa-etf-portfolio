import { fetchMorningVideo } from '@/lib/youtube'
import styles from './MorningBriefingVideo.module.scss'

export default async function MorningBriefingVideo() {
  const video = await fetchMorningVideo()

  if (!video) return null

  const pubDate = video.pubDate
    ? new Date(video.pubDate).toLocaleDateString('ko-KR', {
        timeZone: 'Asia/Seoul',
        month: 'long',
        day: 'numeric',
      })
    : ''

  return (
    <section aria-label="오늘의 한경 모닝 브리핑">
      <div className={styles.header}>
        <h2 className={styles.title}>📺 한경 모닝 브리핑</h2>
        {video.isToday ? (
          <span className={styles.todayBadge}>오늘</span>
        ) : (
          <span className={styles.dateBadge}>{pubDate}</span>
        )}
      </div>

      <a
        href={video.link}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.card}
        aria-label={`YouTube에서 보기: ${video.title}`}
      >
        <div className={styles.thumbnailWrap}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={video.thumbnail}
            alt={video.title}
            className={styles.thumbnail}
            width={320}
            height={180}
          />
          <div className={styles.playOverlay} aria-hidden="true">▶</div>
        </div>
        <p className={styles.videoTitle}>{video.title}</p>
      </a>
    </section>
  )
}
