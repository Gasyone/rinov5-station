import type { Meta, StoryObj } from '@storybook/react'
import { Copy, FileText, Lock } from 'lucide-react'
import { DataTableActions } from './DataTableActions'

const meta = {
  title: 'Shared/DataTableActions',
  component: DataTableActions,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof DataTableActions>

export default meta

type Story = StoryObj<typeof meta>

export const ViewEditDelete: Story = {
  args: {
    onView: () => undefined,
    onEdit: () => undefined,
    onDelete: () => undefined,
  },
}

export const ViewOnly: Story = {
  args: { onView: () => undefined },
}

export const WithExtraActions: Story = {
  args: {
    onView: () => undefined,
    onEdit: () => undefined,
    onDelete: () => undefined,
    extra: [
      { id: 'duplicate', label: 'Duplicate', icon: Copy, onClick: () => undefined },
      { id: 'lock', label: 'Lock', icon: Lock, onClick: () => undefined },
      {
        id: 'audit',
        label: 'View audit log',
        icon: FileText,
        onClick: () => undefined,
      },
    ],
  },
}

export const NoDelete: Story = {
  args: {
    onView: () => undefined,
    onEdit: () => undefined,
  },
}

export const InTableRow: Story = {
  args: { onView: () => undefined, onEdit: () => undefined },
  render: () => (
    <table className="w-full border-collapse">
      <tbody>
        {['Nguyễn An', 'Trần Bình', 'Lê Chi'].map((name) => (
          <tr key={name} className="border-b border-border hover:bg-muted/50">
            <td className="px-3 py-2.5 text-sm font-medium">{name}</td>
            <td className="px-3 py-2.5 text-right">
              <DataTableActions
                onView={() => alert(`View ${name}`)}
                onEdit={() => alert(`Edit ${name}`)}
                onDelete={() => alert(`Delete ${name}`)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
}
