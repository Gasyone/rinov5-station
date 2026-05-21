import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect } from 'storybook/test'
import { CalendarClassScheduleScreen } from './CalendarClassScheduleScreen'

const meta = {
  component: CalendarClassScheduleScreen,
  tags: ['ai-generated'],
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div className="h-screen bg-background">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CalendarClassScheduleScreen>

export default meta

type Story = StoryObj<typeof meta>

export const Week: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Hôm nay' })).toBeVisible()
    await expect(canvas.getByLabelText('Tìm lớp học')).toBeInTheDocument()
  },
}
