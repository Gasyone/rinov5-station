import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import { expect } from 'storybook/test'
import { BranchSelect } from './ListControls'

const BRANCHES = ['Chi nhánh Hà Nội', 'Chi nhánh Hồ Chí Minh', 'Chi nhánh Đà Nẵng']

const meta = {
  component: BranchSelect,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof BranchSelect>

export default meta

type Story = StoryObj<typeof meta>

function Demo({ initial = 'all' as string }) {
  const [value, setValue] = useState(initial)
  return (
    <BranchSelect
      value={value}
      branches={BRANCHES}
      onValueChange={setValue}
      className="h-9 min-w-52"
    />
  )
}

export const Default: Story = {
  args: { value: 'all', branches: BRANCHES, onValueChange: () => undefined },
  render: () => <Demo />,
}

export const Preselected: Story = {
  args: { value: 'Chi nhánh Hà Nội', branches: BRANCHES, onValueChange: () => undefined },
  render: () => <Demo initial="Chi nhánh Hà Nội" />,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('combobox', { name: 'Trung tâm' })).toHaveTextContent('Chi nhánh Hà Nội')
  },
}

export const CustomAllLabel: Story = {
  args: {
    value: 'all',
    branches: BRANCHES,
    onValueChange: () => undefined,
    allLabel: 'Tất cả cơ sở',
  },
  render: () => {
    function Custom() {
      const [value, setValue] = useState('all')
      return (
        <BranchSelect
          value={value}
          branches={BRANCHES}
          allLabel="Tất cả cơ sở"
          ariaLabel="Cơ sở"
          onValueChange={setValue}
          className="h-9 min-w-52"
        />
      )
    }
    return <Custom />
  },
}
