import type { Meta, StoryObj } from '@storybook/react'
import { HeaderBrand } from './HeaderBrand'

const meta = {
  title: 'Layout/HeaderBrand',
  component: HeaderBrand,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof HeaderBrand>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const InDarkSurface: Story = {
  render: () => (
    <div className="rounded-lg bg-foreground p-4">
      <HeaderBrand />
    </div>
  ),
}
