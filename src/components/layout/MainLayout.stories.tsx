import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect } from 'storybook/test'
import { MainLayout } from './MainLayout'
import { DashboardScreen } from '@/components/screens/DashboardScreen'
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
        <DashboardScreen />
      </MainLayout>
    )
  },
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('banner')[0]).toBeVisible()
    await expect(canvas.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
  },
}

export const CollapsedSidebar: Story = {
  render: () => {
    useUIStore.setState({ sidebarOpen: false })
    return (
      <MainLayout>
        <DashboardScreen />
      </MainLayout>
    )
  },
}
