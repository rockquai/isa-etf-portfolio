import type { Meta, StoryObj } from '@storybook/react'
import DividendTimeline from './DividendTimeline'
import { MOCK_ETF_HOLDINGS } from '@/lib/mock/etf'
import { calcAllProjections, getProjectionLabel } from '@/lib/dividend-calculator'

const meta: Meta<typeof DividendTimeline> = {
  title: 'Dashboard/DividendTimeline',
  component: DividendTimeline,
}
export default meta

type Story = StoryObj<typeof DividendTimeline>

const projections = calcAllProjections(MOCK_ETF_HOLDINGS)
const projectionLabel = getProjectionLabel(false, 0)

export const Default: Story = {
  args: { projections, projectionLabel },
}

export const Empty: Story = {
  args: { projections: calcAllProjections([]), projectionLabel },
}
