import type { Meta, StoryObj } from '@storybook/react'
import TodayImpact from './TodayImpact'
import { MOCK_ETF_HOLDINGS } from '@/lib/mock/etf'
import { calcAllProjections } from '@/lib/dividend-calculator'

const meta: Meta<typeof TodayImpact> = {
  title: 'Dashboard/TodayImpact',
  component: TodayImpact,
}
export default meta

type Story = StoryObj<typeof TodayImpact>

const current = calcAllProjections(MOCK_ETF_HOLDINGS)
const plusOne = calcAllProjections(MOCK_ETF_HOLDINGS, false, 1)

export const Default: Story = {
  args: {
    currentProjections: current,
    plusOneProjections: plusOne,
    ticker: 'TIGER 미국배당다우존스',
  },
}
