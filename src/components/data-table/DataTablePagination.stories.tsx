import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import { expect } from 'storybook/test'
import { DataTablePagination } from './DataTablePagination'

const meta = {
  component: DataTablePagination,
  tags: ['ai-generated'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof DataTablePagination>

export default meta

type Story = StoryObj<typeof meta>

function Interactive({ total, initialPage = 1, initialSize = 20 }: { total: number; initialPage?: number; initialSize?: number }) {
  const [page, setPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialSize)
  return (
    <DataTablePagination
      page={page}
      total={total}
      pageSize={pageSize}
      onPageChange={setPage}
      onPageSizeChange={setPageSize}
    />
  )
}

export const Default: Story = {
  args: { page: 1, total: 120, pageSize: 20, onPageChange: () => undefined, onPageSizeChange: () => undefined },
  render: () => <Interactive total={120} />,
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByText('1 / 6')).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'Trang sau' }))
    await expect(canvas.getByText('2 / 6')).toBeVisible()
  },
}

export const SinglePage: Story = {
  args: { page: 1, total: 8, pageSize: 20, onPageChange: () => undefined, onPageSizeChange: () => undefined },
  render: () => <Interactive total={8} />,
}

export const Empty: Story = {
  args: { page: 1, total: 0, pageSize: 20, onPageChange: () => undefined, onPageSizeChange: () => undefined },
  render: () => <Interactive total={0} />,
}

export const ManyPages: Story = {
  args: { page: 5, total: 1500, pageSize: 20, onPageChange: () => undefined, onPageSizeChange: () => undefined },
  render: () => <Interactive total={1500} initialPage={5} />,
}
