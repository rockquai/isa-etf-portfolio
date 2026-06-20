'use client'

import { Component, type ReactNode } from 'react'
import styles from './ErrorBoundary.module.scss'

type Props = {
  children: ReactNode
  fallback?: ReactNode
}

type State = { hasError: boolean }

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    console.error('[ErrorBoundary]', error)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className={styles.fallback} role="alert">
            <span className={styles.icon}>⚠️</span>
            <p className={styles.msg}>불러오지 못했어요. 잠시 후 다시 시도해 주세요.</p>
          </div>
        )
      )
    }
    return this.props.children
  }
}
