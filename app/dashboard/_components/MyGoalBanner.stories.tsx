import type { Meta, StoryObj } from '@storybook/react'
import MyGoalBanner from './MyGoalBanner'

const meta: Meta<typeof MyGoalBanner> = {
  title: 'Dashboard/MyGoalBanner',
  component: MyGoalBanner,
  parameters: { layout: 'padded' },
}
export default meta

type Story = StoryObj<typeof MyGoalBanner>

export const Empty: Story = {
  args: { initialGoal: '' },
}

export const WithGoal: Story = {
  args: { initialGoal: '커피 한 잔씩 아끼고 ETF 하나씩 모으자!' },
}
