import type { Meta, StoryObj } from '@storybook/react'
import DividendPipeline from './DividendPipeline'
import { MOCK_ETF_HOLDINGS } from '@/lib/mock/etf'
import { calcMonthlyDividendByHolding } from '@/lib/dividend-calculator'

const meta: Meta<typeof DividendPipeline> = {
  title: 'Dashboard/DividendPipeline',
  component: DividendPipeline,
}
export default meta

type Story = StoryObj<typeof DividendPipeline>

export const Default: Story = {
  args: { estimates: calcMonthlyDividendByHolding(MOCK_ETF_HOLDINGS) },
}

export const Empty: Story = {
  args: { estimates: [] },
}
