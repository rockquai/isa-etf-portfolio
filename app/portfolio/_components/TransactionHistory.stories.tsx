import type { Meta, StoryObj } from '@storybook/react'
import TransactionHistory from './TransactionHistory'
import { MOCK_TRANSACTIONS } from '@/lib/mock/transactions'

const meta: Meta<typeof TransactionHistory> = {
  title: 'Portfolio/TransactionHistory',
  component: TransactionHistory,
}
export default meta

type Story = StoryObj<typeof TransactionHistory>

export const WithTransactions: Story = {
  args: { transactions: MOCK_TRANSACTIONS },
}

export const Empty: Story = {
  args: { transactions: [] },
}
