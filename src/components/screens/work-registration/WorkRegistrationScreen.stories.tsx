import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'
import { WorkRegistrationScreen } from './WorkRegistrationScreen'

const meta = {
  title: 'Màn hình/Đăng ký lịch làm việc',
  component: WorkRegistrationScreen,
  tags: ['ai-generated'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="h-screen bg-background">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof WorkRegistrationScreen>

export default meta

type Story = StoryObj<typeof meta>

export const MyWeek: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Đăng ký' })).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Cả tuần' })).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Cập nhật đăng ký' })).toBeVisible()
  },
}

export const StaffList: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Lịch làm việc' }))

    await expect(await canvas.findByRole('button', { name: 'Tìm lịch nhân viên' })).toBeVisible()
  },
}

export const WarningGuide: Story = {
  play: async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Cảnh báo' }))

    const body = within(canvasElement.ownerDocument.body)
    await expect(await body.findByRole('dialog')).toBeVisible()
    await expect(body.getByText('Cảnh báo đăng ký lịch')).toBeVisible()
  },
}
