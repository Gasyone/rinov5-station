import type { Meta, StoryObj } from '@storybook/react'
import { DataTableFrame } from './DataTableFrame'

const wideRows = Array.from({ length: 12 }, (_, rowIndex) =>
  Array.from({ length: 12 }, (_, columnIndex) => `R${rowIndex + 1} C${columnIndex + 1}`)
)

const meta = {
  title: 'Data Table/DataTableFrame',
  component: DataTableFrame,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    children: null,
  },
} satisfies Meta<typeof DataTableFrame>

export default meta

type Story = StoryObj<typeof meta>

export const WithFooterScrollbar: Story = {
  args: {
    className: 'm-6 h-96',
    children: (
      <table className="min-w-[1200px] text-sm">
        <thead className="bg-muted/50">
          <tr>
            {Array.from({ length: 12 }, (_, index) => (
              <th key={index} className="px-4 py-3 text-left font-semibold">
                Column {index + 1}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {wideRows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-t border-border">
              {row.map((cell) => (
                <td key={cell} className="px-4 py-3">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    ),
    footer: (
      <div className="flex items-center justify-between px-4 py-3 text-sm text-muted-foreground">
        <span>Showing 12 rows</span>
        <span>Page 1 of 1</span>
      </div>
    ),
  },
}
