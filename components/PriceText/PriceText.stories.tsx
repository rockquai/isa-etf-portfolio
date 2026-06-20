import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import PriceText from './PriceText'

const meta = {
  title: 'Components/PriceText',
  component: PriceText,
} satisfies Meta<typeof PriceText>

export default meta
type Story = StoryObj<typeof meta>

export const Profit: Story = { args: { value: 12000, isProfit: true } }
export const Loss: Story = { args: { value: 5000, isProfit: false } }
export const NoSign: Story = { args: { value: 80000, isProfit: true, showSign: false } }
