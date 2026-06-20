import styles from './SkeletonUI.module.scss'

type SkeletonProps = {
  width?: string
  height?: string
  borderRadius?: string
}

export default function SkeletonUI({
  width = '100%',
  height = '16px',
  borderRadius = '4px',
}: SkeletonProps) {
  return (
    <span
      className={styles.skeleton}
      style={{ width, height, borderRadius }}
      aria-hidden="true"
    />
  )
}
