import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect } from 'storybook/test'
import { BranchesScreen } from './BranchesScreen'

const meta = {
  component: BranchesScreen,
  tags: ['ai-generated'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof BranchesScreen>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Tất cả cơ sở')).toBeVisible()
    await expect(canvas.getByText('RinoEdu Linh Đàm')).toBeVisible()
    await expect(canvas.getByText('Thêm cơ sở mới')).toBeVisible()
  },
}
