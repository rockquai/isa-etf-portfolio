import type { Meta, StoryObj } from '@storybook/react'
import LevelBadge from './LevelBadge'

const meta: Meta<typeof LevelBadge> = {
  title: 'Dashboard/LevelBadge',
  component: LevelBadge,
}
export default meta

type Story = StoryObj<typeof LevelBadge>

export const Sprout: Story = {
  args: { totalPrincipal: 30000 },
}

export const Steady: Story = {
  args: { totalPrincipal: 320000 },
}

export const Reliable: Story = {
  args: { totalPrincipal: 800000 },
}

export const MaxLevel: Story = {
  args: { totalPrincipal: 8_000_000 },
}
