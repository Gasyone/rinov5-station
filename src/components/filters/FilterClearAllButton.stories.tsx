import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect } from 'storybook/test'
import { FilterClearAllButton } from './FilterClearAllButton'

const meta = {
  component: FilterClearAllButton,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof FilterClearAllButton>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { onClick: () => undefined },
}

export const Disabled: Story = {
  args: { disabled: true, onClick: () => undefined },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button')).toBeDisabled()
  },
}

export const CustomLabel: Story = {
  args: { label: 'Đặt lại bộ lọc', onClick: () => undefined },
}
