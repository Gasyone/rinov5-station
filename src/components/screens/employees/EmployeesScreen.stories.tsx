import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect } from 'storybook/test'
import { EmployeesScreen } from './EmployeesScreen'

const meta = {
  component: EmployeesScreen,
  tags: ['ai-generated'],
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div className="h-screen bg-background">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof EmployeesScreen>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'New employee' })).toBeVisible()
    await expect(canvas.getByLabelText('Search employees')).toBeInTheDocument()
  },
}
