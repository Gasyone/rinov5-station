import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect } from 'storybook/test'
import { StatusBadge } from './StatusBadge'

const meta = {
  component: StatusBadge,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof StatusBadge>

export default meta

type Story = StoryObj<typeof meta>

export const Active: Story = {
  args: { status: 'active' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('status')).toHaveTextContent('Active')
  },
}
export const Pending: Story = { args: { status: 'pending' } }
export const Failed: Story = { args: { status: 'failed' } }
export const Cancelled: Story = { args: { status: 'cancelled' } }
export const Completed: Story = { args: { status: 'completed' } }
export const Merged: Story = { args: { status: 'merged' } }
export const WithDot: Story = { args: { status: 'active', withDot: true } }
export const CustomLabel: Story = {
  args: { status: 'started_assessment', label: 'In Progress', withDot: true },
}

export const CssCheck: Story = {
  args: { status: 'active' },
  play: async ({ canvas }) => {
    const badge = canvas.getByRole('status')
    await expect(getComputedStyle(badge).backgroundColor).toBe('oklch(0.979 0.021 166.113)')
  },
}

export const AllSemantics: Story = {
  args: { status: 'active' },
  render: () => (
    <div className="flex flex-wrap gap-2">
      {[
        'active',
        'pending',
        'locked',
        'deactivated',
        'in_progress',
        'completed',
        'failed',
        'cancelled',
        'merged',
        'seconded',
      ].map((status) => (
        <StatusBadge key={status} status={status} withDot />
      ))}
    </div>
  ),
}
