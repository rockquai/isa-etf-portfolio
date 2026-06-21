'use client'

import { useState } from 'react'
import styles from './MorningBriefingVideo.module.scss'

type MorningBriefingVideoPlayerProps = {
  videoId: string
  title: string
  thumbnail: string
}

export default function MorningBriefingVideoPlayer({
  videoId,
  title,
  thumbnail,
}: MorningBriefingVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  if (isPlaying) {
    return (
      <div className={styles.iframeWrap}>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className={styles.iframe}
        />
      </div>
    )
  }

  return (
    <button
      type="button"
      className={styles.thumbnailBtn}
      onClick={() => setIsPlaying(true)}
      aria-label={`영상 재생: ${title}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={thumbnail}
        alt={title}
        className={styles.thumbnail}
        width={320}
        height={180}
      />
      <div className={styles.playOverlay} aria-hidden="true">▶</div>
    </button>
  )
}
