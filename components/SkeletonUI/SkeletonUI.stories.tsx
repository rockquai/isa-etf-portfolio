import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import SkeletonUI from './SkeletonUI'

const meta = {
  title: 'Components/SkeletonUI',
  component: SkeletonUI,
} satisfies Meta<typeof SkeletonUI>

export default meta
type Story = StoryObj<typeof meta>

export const Text: Story = { args: { width: '200px', height: '16px' } }
export const Card: Story = { args: { width: '100%', height: '80px', borderRadius: '12px' } }
export const Circle: Story = { args: { width: '40px', height: '40px', borderRadius: '50%' } }
