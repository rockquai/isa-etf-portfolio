import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import ETFTag from './ETFTag'

const meta = {
  title: 'Components/ETFTag',
  component: ETFTag,
} satisfies Meta<typeof ETFTag>

export default meta
type Story = StoryObj<typeof meta>

export const Profit: Story = {
  args: { ticker: 'TIGER 미국배당다우존스', currentPrice: 10250, avgPrice: 9800, isProfit: true },
}
export const Loss: Story = {
  args: { ticker: 'TIGER 미국MSCI리츠', currentPrice: 4350, avgPrice: 4800, isProfit: false },
}
