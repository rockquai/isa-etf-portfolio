import type { Meta, StoryObj } from '@storybook/react'
import GoalGauge from './GoalGauge'

const meta: Meta<typeof GoalGauge> = {
  title: 'Dashboard/GoalGauge',
  component: GoalGauge,
}
export default meta

type Story = StoryObj<typeof GoalGauge>

export const Zero: Story = {
  args: { percentage: 0, goalAmount: 500000, currentMonthlyDividend: 0 },
}

export const HalfWay: Story = {
  args: { percentage: 50, goalAmount: 500000, currentMonthlyDividend: 250000 },
}

export const NearGoal: Story = {
  args: { percentage: 87, goalAmount: 500000, currentMonthlyDividend: 435000 },
}

export const Achieved: Story = {
  args: { percentage: 100, goalAmount: 500000, currentMonthlyDividend: 500000 },
}
