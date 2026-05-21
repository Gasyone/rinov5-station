import type { Meta, StoryObj } from '@storybook/react'
import { Mail, User } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FieldLabel, InfoField, Panel } from './FieldLabel'

const meta = {
  title: 'Shared/FieldLabel & Friends',
  parameters: { layout: 'padded' },
} satisfies Meta

export default meta

type Story = StoryObj

export const Basic: Story = {
  render: () => (
    <div className="grid max-w-sm gap-3">
      <FieldLabel label="Full name">
        <Input placeholder="Nguyễn Văn A" />
      </FieldLabel>
      <FieldLabel label="Email" required description="We never share your email.">
        <Input type="email" placeholder="you@example.com" />
      </FieldLabel>
      <FieldLabel label="Phone" error="Invalid phone number format">
        <Input defaultValue="abc123" />
      </FieldLabel>
    </div>
  ),
}

export const InfoFieldStory: Story = {
  name: 'InfoField (read-only)',
  render: () => (
    <div className="grid max-w-2xl grid-cols-2 gap-x-8 gap-y-4 rounded-md border border-border p-4">
      <InfoField label="Student" value="Nguyễn An" supporting="PER-001" />
      <InfoField label="Program" value="IELTS Foundation" />
      <InfoField label="Schedule" value="08:30 · 2026-05-20" valueClassName="text-primary" />
      <InfoField label="Branch" value="Hà Nội" supporting="Room A12" />
    </div>
  ),
}

export const PanelStory: Story = {
  name: 'Panel (Detail Page section)',
  render: () => (
    <div className="max-w-md rounded-md border border-border p-4">
      <Panel
        title="Account"
        icon={<User className="h-4 w-4" />}
        actions={<Button size="sm" variant="ghost">Edit</Button>}
      >
        <div className="space-y-2">
          <InfoField label="Email" value="admin@rinoedu.vn" />
          <InfoField label="Role" value="Administrator" />
        </div>
      </Panel>
    </div>
  ),
}

export const Composed: Story = {
  render: () => (
    <div className="max-w-md space-y-6 rounded-md border border-border p-4">
      <Panel title="Contact" icon={<Mail className="h-4 w-4" />}>
        <div className="grid gap-3">
          <FieldLabel label="Email" required>
            <Input defaultValue="user@example.com" />
          </FieldLabel>
          <FieldLabel label="Phone">
            <Input defaultValue="0901234567" />
          </FieldLabel>
        </div>
      </Panel>
    </div>
  ),
}
