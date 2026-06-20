import type { Meta, StoryObj } from '@storybook/react'
import AIBriefing from './AIBriefing'
import { MOCK_BRIEFING } from '@/lib/mock/briefing'

const meta: Meta<typeof AIBriefing> = {
  title: 'Dashboard/AIBriefing',
  component: AIBriefing,
  parameters: { layout: 'padded' },
}
export default meta

type Story = StoryObj<typeof AIBriefing>

export const Default: Story = {
  args: { initialBriefing: MOCK_BRIEFING },
}

export const Empty: Story = {
  args: { initialBriefing: '' },
}
