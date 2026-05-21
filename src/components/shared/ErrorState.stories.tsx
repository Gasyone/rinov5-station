import type { Meta, StoryObj } from '@storybook/react'
import { ErrorState } from './ErrorState'

const meta = {
  title: 'Shared/ErrorState',
  component: ErrorState,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof ErrorState>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithRetry: Story = {
  args: {
    onRetry: () => undefined,
  },
}

export const Custom: Story = {
  args: {
    title: 'Failed to load bookings',
    description: 'Connection timed out. Check your network and try again.',
    onRetry: () => undefined,
  },
}
