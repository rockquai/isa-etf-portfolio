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
        styles.button,
        styles[`button--${variant}`],
        styles[`button--${size}`],
        isLoading ? styles['button--loading'] : '',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {isLoading ? <span className={styles.spinner} aria-hidden="true" /> : children}
    </button>
  )
}
