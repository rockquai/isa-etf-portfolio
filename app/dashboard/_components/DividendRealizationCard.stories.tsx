import type { Meta, StoryObj } from '@storybook/react'
import DividendRealizationCard from './DividendRealizationCard'

const meta: Meta<typeof DividendRealizationCard> = {
  title: 'Dashboard/DividendRealizationCard',
  component: DividendRealizationCard,
}
export default meta

type Story = StoryObj<typeof DividendRealizationCard>

export const Coffee: Story = {
  args: { monthlyDividendTotal: 9000 },
}

export const Chicken: Story = {
  args: { monthlyDividendTotal: 42000 },
}

export const BelowThreshold: Story = {
  args: { monthlyDividendTotal: 1200 },
}

export const Empty: Story = {
  args: { monthlyDividendTotal: 0 },
}
