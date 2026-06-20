import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import ErrorBoundary from './ErrorBoundary'

const meta = {
  title: 'Components/ErrorBoundary',
  component: ErrorBoundary,
} satisfies Meta<typeof ErrorBoundary>

export default meta
type Story = StoryObj<typeof meta>

export const Normal: Story = {
  args: { children: <p>정상 콘텐츠</p> },
}

export const ErrorState: Story = {
  args: {
    fallback: (
      <div style={{ padding: 24, textAlign: 'center', color: '#6b7280' }}>
        ⚠️ 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
      </div>
    ),
    children: <p>정상 콘텐츠</p>,
  },
}
