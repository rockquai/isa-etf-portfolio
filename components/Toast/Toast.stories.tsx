import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ToastProvider } from './ToastContext'
import ToastContainer from './Toast'

function ToastDemo({ type }: { type: 'success' | 'error' }) {
  return (
    <ToastProvider>
      <div style={{ height: 200, position: 'relative' }}>
        <p style={{ padding: 16, color: '#6b7280' }}>토스트 미리보기</p>
        <div
          style={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            right: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 16px',
            borderRadius: 12,
            background: type === 'success' ? '#f0fff4' : '#fff5f5',
            color: type === 'success' ? '#276749' : '#c53030',
            border: `1px solid ${type === 'success' ? '#9ae6b4' : '#feb2b2'}`,
          }}
        >
          <span>{type === 'success' ? '🎉' : '⚠️'}</span>
          <span>{type === 'success' ? '🎉 오늘 1주 완료!' : '매수 기록에 실패했어요.'}</span>
        </div>
      </div>
    </ToastProvider>
  )
}

const meta = {
  title: 'Components/Toast',
  component: ToastContainer,
} satisfies Meta<typeof ToastContainer>

export default meta
type Story = StoryObj<typeof meta>

export const Success: Story = {
  render: () => <ToastDemo type="success" />,
}
export const Error: Story = {
  render: () => <ToastDemo type="error" />,
}
