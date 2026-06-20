import type { Meta, StoryObj } from '@storybook/react'
import BuyRecordButton from './BuyRecordButton'

const meta: Meta<typeof BuyRecordButton> = {
  title: 'Dashboard/BuyRecordButton',
  component: BuyRecordButton,
  parameters: { layout: 'padded' },
}
export default meta

type Story = StoryObj<typeof BuyRecordButton>

export const Default: Story = {
  args: {
    etfId: 'tiger-us-dividend',
    ticker: 'TIGER 미국배당다우존스',
    onSuccess: () => {},
    onRollback: () => {},
  },
}
