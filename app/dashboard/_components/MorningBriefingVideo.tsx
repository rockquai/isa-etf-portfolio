import { fetchMorningVideo } from '@/lib/youtube'
import MorningBriefingVideoPlayer from './MorningBriefingVideoPlayer'
import styles from './MorningBriefingVideo.module.scss'

export default async function MorningBriefingVideo() {
  const video = await fetchMorningVideo()

  if (!video) return null

  const pubDate = video.pubDate
    ? new Date(video.pubDate).toLocaleDateString('ko-KR', {
        timeZone: 'Asia/Seoul',
        year: 'numeric',
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

      <div className={styles.card}>
        <MorningBriefingVideoPlayer
          videoId={video.videoId}
          title={video.title}
          thumbnail={video.thumbnail}
        />
        <p className={styles.videoTitle}>{video.title}</p>
      </div>
    </section>
  )
}
