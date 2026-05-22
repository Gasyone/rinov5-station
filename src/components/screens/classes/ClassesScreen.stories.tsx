import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ClassesScreen } from './ClassesScreen'

const meta = {
  component: ClassesScreen,
  tags: ['ai-generated'],
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div className="h-screen bg-background">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ClassesScreen>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
