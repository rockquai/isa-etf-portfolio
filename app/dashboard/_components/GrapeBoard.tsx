import { GRAPE_BOARD_SIZE, type GrapeBoardState } from '@/lib/routineSticker'
import styles from './GrapeBoard.module.scss'

type GrapeBoardProps = {
  state: GrapeBoardState
}

export default function GrapeBoard({ state }: GrapeBoardProps) {
  const { completedBoards, currentBoardFill } = state
  const dots = Array.from({ length: GRAPE_BOARD_SIZE }, (_, i) => i < currentBoardFill)

  return (
    <section aria-label="포도알 스티커" className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>🍇 오늘의 포도알</h2>
        {completedBoards > 0 && (
          <span className={styles.badge}>완성한 판 {completedBoards}개 🏅</span>
        )}
      </div>

      <div
        className={styles.grid}
        role="progressbar"
        aria-valuenow={currentBoardFill}
        aria-valuemin={0}
        aria-valuemax={GRAPE_BOARD_SIZE}
        aria-label={`이번 달 포도알 ${currentBoardFill}/${GRAPE_BOARD_SIZE}`}
      >
        {dots.map((filled, i) => (
          <span key={i} className={filled ? styles.dotFilled : styles.dotEmpty} aria-hidden="true" />
        ))}
      </div>

      <p className={styles.desc}>
        뉴스 읽기·브리핑 확인·매수 기록으로 포도알을 모아보세요. 매수 안 한 날도 지켜본 날로 인정돼요.
      </p>
    </section>
  )
}
