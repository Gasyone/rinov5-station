import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect } from 'storybook/test'
import { MainLayout } from './MainLayout'
import { useUIStore } from '@/stores/useUIStore'

const meta = {
  component: MainLayout,
  tags: ['ai-generated'],
  args: {
    children: null,
  },
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/app/calendar_class_schedule',
      },
    },
  },
} satisfies Meta<typeof MainLayout>

export default meta

type Story = StoryObj<typeof meta>

export const DashboardShell: Story = {
  render: () => {
    useUIStore.setState({ sidebarOpen: true })
    return (
      <MainLayout>
        <div className="p-6">
          <h1 className="text-xl font-semibold">Workspace</h1>
        </div>
      </MainLayout>
    )
  },
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('banner')[0]).toBeVisible()
    await expect(canvas.getByRole('heading', { name: 'Workspace' })).toBeVisible()
  },
}

export const CollapsedSidebar: Story = {
  render: () => {
    useUIStore.setState({ sidebarOpen: false })
    return (
      <MainLayout>
        <div className="p-6">
          <h1 className="text-xl font-semibold">Workspace</h1>
        </div>
      </MainLayout>
    )
  },
}
