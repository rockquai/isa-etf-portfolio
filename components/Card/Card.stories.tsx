import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import Card from './Card'

const meta = {
  title: 'Components/Card',
  component: Card,
  args: { children: '카드 내용입니다.' },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Clickable: Story = { args: { onClick: () => alert('클릭!') } }
export const Large: Story = { args: { padding: 'lg' } }
