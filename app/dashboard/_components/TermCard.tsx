import { getTodayTermCard } from '@/lib/term-card'
import styles from './TermCard.module.scss'

export default async function TermCard() {
  const { term, explanation } = await getTodayTermCard()

  return (
    <section aria-label="오늘의 용어" className={styles.wrapper}>
      <p className={styles.label}>📖 오늘의 용어</p>
      <p className={styles.term}>{term}</p>
      <p className={styles.explanation}>{explanation}</p>
    </section>
  )
}
