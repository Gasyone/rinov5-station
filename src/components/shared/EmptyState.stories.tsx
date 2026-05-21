import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect } from 'storybook/test'
import { UsersRound } from 'lucide-react'
import { EmptyState } from './EmptyState'

const meta = {
  component: EmptyState,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof EmptyState>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithDescription: Story = {
  args: {
    title: 'No students found',
    description: 'Try adjusting your search or filter criteria.',
  },
}

export const WithAction: Story = {
  args: {
    title: 'No bookings yet',
    description: 'Create your first booking to get started.',
    action: { label: 'Create booking', onClick: () => undefined },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Create booking' })).toBeEnabled()
  },
}

export const CustomIcon: Story = {
  args: {
    icon: <UsersRound className="h-7 w-7 text-muted-foreground" />,
    title: 'No team members',
    description: 'Invite colleagues to collaborate.',
  },
}
