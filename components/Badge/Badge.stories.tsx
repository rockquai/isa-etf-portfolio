import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import Badge from './Badge'

const meta = {
  title: 'Components/Badge',
  component: Badge,
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Up: Story = { args: { label: '+2.3%', variant: 'up' } }
export const Down: Story = { args: { label: '-1.8%', variant: 'down' } }
export const Neutral: Story = { args: { label: '0.0%', variant: 'neutral' } }
