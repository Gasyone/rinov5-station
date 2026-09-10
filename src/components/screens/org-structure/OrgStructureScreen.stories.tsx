import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect } from 'storybook/test'
import { OrgStructureScreen } from './OrgStructureScreen'

const meta = {
  component: OrgStructureScreen,
  tags: ['ai-generated'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof OrgStructureScreen>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Tên đơn vị & Mã')).toBeVisible()
    await expect(canvas.getByText('Tạo đơn vị mới')).toBeVisible()
    await expect(canvas.getByText('Hội đồng Quản trị & Ban Tổng Giám đốc')).toBeVisible()
  },
}
