import styles from './Badge.module.scss'

type BadgeProps = {
  label: string
  variant: 'up' | 'down' | 'neutral'
}

export default function Badge({ label, variant }: BadgeProps) {
  return (
    <span className={[styles.badge, styles[`badge--${variant}`]].join(' ')}>
      {variant === 'up' && '▲ '}
      {variant === 'down' && '▼ '}
      {label}
    </span>
  )
}
