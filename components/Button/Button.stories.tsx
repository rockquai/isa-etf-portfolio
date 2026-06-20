import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import Button from './Button'

const meta = {
  title: 'Components/Button',
  component: Button,
  args: { children: '버튼', variant: 'primary', size: 'md' },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = { args: { variant: 'primary' } }
export const Secondary: Story = { args: { variant: 'secondary' } }
export const Ghost: Story = { args: { variant: 'ghost' } }
export const Loading: Story = { args: { isLoading: true } }
export const Disabled: Story = { args: { disabled: true } }
export const Large: Story = { args: { size: 'lg', children: '1주 매수 기록하기' } }
