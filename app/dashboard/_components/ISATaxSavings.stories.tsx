import type { Meta, StoryObj } from '@storybook/react'
import ISATaxSavings from './ISATaxSavings'

const meta: Meta<typeof ISATaxSavings> = {
  title: 'Dashboard/ISATaxSavings',
  component: ISATaxSavings,
}
export default meta

type Story = StoryObj<typeof ISATaxSavings>

export const Default: Story = {
  args: { taxSavings: 47320 },
}

export const HighSavings: Story = {
  args: { taxSavings: 312000 },
}

export const Empty: Story = {
  args: { taxSavings: 0 },
}
