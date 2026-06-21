import type { ButtonHTMLAttributes } from 'react'
import styles from './Button.module.scss'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant: 'primary' | 'secondary' | 'ghost'
  size: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  ariaLabel?: string
}

export default function Button({
  children,
  variant,
  size,
  isLoading = false,
  disabled,
  ariaLabel,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      aria-label={ariaLabel}
      aria-busy={isLoading}
      className={[
        styles.btn_comm,
        styles[`btn_${variant}`],
        styles[`btn_${size}`],
        isLoading ? styles['button--loading'] : '',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {isLoading ? <span className={styles.ico_spinner} aria-hidden="true" /> : children}
    </button>
  )
}
