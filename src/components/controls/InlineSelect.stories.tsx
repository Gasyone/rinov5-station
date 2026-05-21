import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import { expect } from 'storybook/test'
import { InlineSelect } from './ListControls'

const LEVELS = [
  { value: '', label: 'Not set' },
  { value: 'A1', label: 'A1' },
  { value: 'A2', label: 'A2' },
  { value: 'B1', label: 'B1' },
  { value: 'B2', label: 'B2' },
]

const meta = {
  component: InlineSelect,
  tags: ['ai-generated'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof InlineSelect>

export default meta

type Story = StoryObj<typeof meta>

function Demo({ initial = '', disabled = false }: { initial?: string; disabled?: boolean }) {
  const [value, setValue] = useState(initial)
  return (
    <div className="max-w-xs">
      <InlineSelect
        value={value}
        options={LEVELS}
        onValueChange={setValue}
        disabled={disabled}
        ariaLabel="Placement level"
        placeholder="Select level"
      />
    </div>
  )
}

export const Default: Story = {
  args: { value: '', options: LEVELS, onValueChange: () => undefined },
  render: () => <Demo />,
}

export const Selected: Story = {
  args: { value: 'B1', options: LEVELS, onValueChange: () => undefined },
  render: () => <Demo initial="B1" />,
}

export const Disabled: Story = {
  args: { value: '', options: LEVELS, onValueChange: () => undefined, disabled: true },
  render: () => <Demo disabled />,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('combobox', { name: 'Placement level' })).toBeDisabled()
  },
}
