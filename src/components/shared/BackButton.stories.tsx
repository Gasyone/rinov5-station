import type { Meta, StoryObj } from '@storybook/react'
import { BackButton } from './BackButton'

const meta = {
  title: 'Shared/BackButton',
  component: BackButton,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof BackButton>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const CustomLabel: Story = {
  args: { label: 'Quay lại danh sách' },
}

export const CustomHandler: Story = {
  args: {
    label: 'Custom handler',
    onClick: () => alert('Custom navigation'),
  },
}
