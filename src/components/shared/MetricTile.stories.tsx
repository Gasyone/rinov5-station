import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect } from 'storybook/test'
import { CalendarCheck, GraduationCap, TrendingUp, Users } from 'lucide-react'
import { MetricTile } from './MetricTile'

const meta = {
  component: MetricTile,
  tags: ['ai-generated'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof MetricTile>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Active Students',
    value: 84,
    icon: GraduationCap,
  },
}

export const WithPositiveTrend: Story = {
  args: {
    label: 'Completed Orders',
    value: 230,
    icon: TrendingUp,
    trend: { value: '+18%', positive: true, description: 'this month' },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('+18%')).toBeVisible()
    await expect(canvas.getByText('this month')).toBeVisible()
  },
}

export const WithNegativeTrend: Story = {
  args: {
    label: 'Churn rate',
    value: '3.2%',
    icon: Users,
    trend: { value: '-0.4%', positive: false, description: 'vs last month' },
  },
}

export const Clickable: Story = {
  args: {
    label: "Today's Sessions",
    value: 12,
    icon: CalendarCheck,
    onClick: () => alert('Navigate to schedule'),
  },
}

export const Grid: Story = {
  args: {
    label: 'Active Students',
    value: 84,
  },
  render: () => (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <MetricTile label="Active Students" value={84} icon={GraduationCap} trend={{ value: '+12%', positive: true, description: 'this month' }} />
      <MetricTile label="Active Staff" value={42} icon={Users} trend={{ value: '+3%', positive: true }} />
      <MetricTile label="Completed Orders" value={230} icon={TrendingUp} trend={{ value: '+18%', positive: true }} />
      <MetricTile label="Today's Sessions" value={12} icon={CalendarCheck} />
    </div>
  ),
}
