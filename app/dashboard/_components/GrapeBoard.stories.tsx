import type { Meta, StoryObj } from '@storybook/react'
import GrapeBoard from './GrapeBoard'

const meta: Meta<typeof GrapeBoard> = {
  title: 'Dashboard/GrapeBoard',
  component: GrapeBoard,
}
export default meta

type Story = StoryObj<typeof GrapeBoard>

export const Empty: Story = {
  args: { state: { totalDays: 0, completedBoards: 0, currentBoardFill: 0 } },
}

export const Partial: Story = {
  args: { state: { totalDays: 12, completedBoards: 0, currentBoardFill: 12 } },
}

export const Complete: Story = {
  args: { state: { totalDays: 30, completedBoards: 1, currentBoardFill: 30 } },
}
