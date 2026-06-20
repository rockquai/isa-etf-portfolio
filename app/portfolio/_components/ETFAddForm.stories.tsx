import type { Meta, StoryObj } from '@storybook/react'
import ETFAddForm from './ETFAddForm'

const meta: Meta<typeof ETFAddForm> = {
  title: 'Portfolio/ETFAddForm',
  component: ETFAddForm,
  parameters: { layout: 'padded' },
}
export default meta

type Story = StoryObj<typeof ETFAddForm>

export const Default: Story = {
  args: {
    onAdd: async () => {},
  },
}
