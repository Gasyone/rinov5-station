import type { Meta, StoryObj } from '@storybook/react'
import { EntityCell } from './EntityCell'

const meta = {
  title: 'Shared/EntityCell',
  component: EntityCell,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof EntityCell>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { name: 'Nguyễn Văn An', supporting: 'PER-001' },
}

export const WithLongName: Story = {
  args: {
    name: 'Phạm Văn Giảng Dạy Tiếng Anh Quốc Tế',
    supporting: 'STAFF-E003',
  },
  render: (args) => (
    <div className="max-w-xs">
      <EntityCell {...args} />
    </div>
  ),
}

export const WithCustomInitials: Story = {
  args: {
    name: 'Trần Thị Sale',
    supporting: 'sale1@demo.com',
    initials: 'TS',
  },
}

export const Interactive: Story = {
  args: {
    name: 'Lê Thị Chăm Sóc',
    supporting: 'CSM',
    onClick: () => alert('Clicked'),
  },
}

export const InTableRow: Story = {
  args: { name: 'Hoàng Em', supporting: 'PER-005' },
  render: () => (
    <table className="w-full border-collapse">
      <tbody>
        {['Nguyễn An', 'Trần Bình', 'Lê Chi'].map((name, idx) => (
          <tr key={name} className="border-b border-border">
            <td className="px-3 py-2.5">
              <EntityCell name={name} supporting={`PER-${String(idx + 1).padStart(3, '0')}`} />
            </td>
            <td className="px-3 py-2.5 text-sm text-muted-foreground">user@example.com</td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
}
