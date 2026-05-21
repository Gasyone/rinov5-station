import type { Meta, StoryObj } from '@storybook/react'
import { ModuleLoadingSkeleton } from './ModuleLoadingSkeleton'

const meta = {
  title: 'Shared/ModuleLoadingSkeleton',
  component: ModuleLoadingSkeleton,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ModuleLoadingSkeleton>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const FewRows: Story = {
  args: { rows: 3, columns: 4 },
}

export const NoToolbar: Story = {
  args: { showToolbar: false, rows: 5 },
}
