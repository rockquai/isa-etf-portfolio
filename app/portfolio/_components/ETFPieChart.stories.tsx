import type { Meta, StoryObj } from '@storybook/react'
import ETFPieChart from './ETFPieChart'
import { MOCK_ETF_HOLDINGS } from '@/lib/mock/etf'

const meta: Meta<typeof ETFPieChart> = {
  title: 'Portfolio/ETFPieChart',
  component: ETFPieChart,
  parameters: { layout: 'padded' },
}
export default meta

type Story = StoryObj<typeof ETFPieChart>

export const Default: Story = {
  args: { holdings: MOCK_ETF_HOLDINGS },
}

export const SingleHolding: Story = {
  args: { holdings: [MOCK_ETF_HOLDINGS[0]] },
}

export const Empty: Story = {
  args: { holdings: [] },
}
