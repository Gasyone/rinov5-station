import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect } from 'storybook/test'
import { MoreVertical, Pencil, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeader } from './PageHeader'

const meta = {
  component: PageHeader,
  tags: ['ai-generated'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof PageHeader>

export default meta

type Story = StoryObj<typeof meta>

export const Simple: Story = {
  args: {
    title: 'Students',
    description: 'Manage all enrolled students across branches.',
  },
}

export const WithStatusAndCode: Story = {
  args: {
    title: 'Nguyễn An',
    description: 'IELTS Foundation · Enrolled 2026-01-10',
    code: 'PER-001',
    status: 'active',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('PER-001')).toBeVisible()
    await expect(canvas.getByRole('status')).toHaveTextContent('Active')
  },
}

export const DetailPage: Story = {
  args: {
    title: 'Booking E0042',
    description: 'IELTS Foundation · Scheduled 2026-05-20 08:30',
    code: 'E0042',
    status: 'checkin',
    statusLabel: 'Đã check-in',
    showBackButton: true,
    actions: (
      <>
        <Button variant="outline" size="sm">
          <Pencil className="h-4 w-4" />
          Edit
        </Button>
        <Button size="sm">
          <Save className="h-4 w-4" />
          Save
        </Button>
        <Button variant="ghost" size="icon-sm" aria-label="More actions">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </>
    ),
  },
}

export const NoBack: Story = {
  args: {
    title: 'Dashboard',
    description: 'Overview of today’s activities',
  },
}
