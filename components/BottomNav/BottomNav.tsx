'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './BottomNav.module.scss'

const NAV_ITEMS = [
  { href: '/dashboard', label: '홈', icon: '' },
  { href: '/portfolio', label: '포트폴리오', icon: '' },
  { href: '/settings', label: '설정', icon: '' },
] as const

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className={`${styles.nav} tab-bar`} aria-label="하단 탭 메뉴">
      {NAV_ITEMS.map(({ href, label, icon }) => {
        const isActive = pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className={[styles.item, isActive ? styles['item--active'] : ''].filter(Boolean).join(' ')}
            aria-label={label}
            aria-current={isActive ? 'page' : undefined}
          >
            <span className={styles.icon} aria-hidden="true">{icon}</span>
            <span className={styles.label}>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
