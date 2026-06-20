import type { HTMLAttributes } from 'react'
import styles from './Card.module.scss'

type CardProps = HTMLAttributes<HTMLDivElement> & {
  padding?: 'sm' | 'md' | 'lg'
  onClick?: () => void
}

export default function Card({
  children,
  padding = 'md',
  onClick,
  className,
  ...props
}: CardProps) {
  return (
    <div
      {...props}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
      className={[
        styles.card,
        styles[`card--${padding}`],
        onClick ? styles['card--clickable'] : '',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
}
