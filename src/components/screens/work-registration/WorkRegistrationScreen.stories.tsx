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
    await expect(canvas.getByRole('button', { name: 'Hôm nay' })).toBeVisible()
    await expect(canvas.getByLabelText('Chọn tất cả dòng và cột')).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Cập nhật đăng ký' })).toBeVisible()
  },
}

export const StaffList: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Nhân viên' }))

    await expect(await canvas.findByRole('button', { name: /Đăng ký lịch cho .*Sale/i })).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Tìm lịch nhân viên' })).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Lọc đăng ký nhân viên' })).toBeVisible()
  },
}

export const StaffDelegateWeek: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Nhân viên' }))
    await userEvent.click(await canvas.findByRole('button', { name: /Đăng ký lịch cho .*Sale/i }))

    await expect(await canvas.findByText(/Đang đăng ký cho .*Sale/i)).toBeVisible()
    await expect(canvas.getByLabelText('Chọn tất cả dòng và cột')).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Cập nhật đăng ký' })).toBeVisible()
  },
}

export const CenterOverview: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Trung tâm' }))

    await expect(await canvas.findByText('Trung tâm có đăng ký')).toBeVisible()
    await expect(canvas.getByText('Giờ đăng ký trong tuần')).toBeVisible()
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
