import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import { expect, within } from 'storybook/test'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from './ConfirmDialog'

const meta = {
  component: ConfirmDialog,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof ConfirmDialog>

export default meta

type Story = StoryObj<typeof meta>

function Demo({
  variant = 'default',
  title,
  description,
  confirmLabel,
  delayMs = 600,
}: {
  variant?: 'default' | 'destructive'
  title: string
  description?: string
  confirmLabel?: string
  delayMs?: number
}) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button
        variant={variant === 'destructive' ? 'destructive' : 'default'}
        onClick={() => setOpen(true)}
      >
        {confirmLabel ?? title}
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={title}
        description={description}
        confirmLabel={confirmLabel}
        variant={variant}
        onConfirm={async () => {
          await new Promise((r) => setTimeout(r, delayMs))
        }}
      />
    </>
  )
}

export const Default: Story = {
  args: {
    open: false,
    onOpenChange: () => undefined,
    title: 'Apply changes?',
    onConfirm: () => undefined,
  },
  render: () => (
    <Demo
      title="Apply changes?"
      description="This will update the booking record in the demo data set."
    />
  ),
  play: async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Apply changes?' }))
    const body = within(canvasElement.ownerDocument.body)
    await expect(await body.findByRole('alertdialog')).toBeVisible()
    await expect(body.getByText('This will update the booking record in the demo data set.')).toBeVisible()
  },
}

export const DeleteStudent: Story = {
  args: {
    open: false,
    onOpenChange: () => undefined,
    title: 'Delete student?',
    onConfirm: () => undefined,
  },
  render: () => (
    <Demo
      variant="destructive"
      title="Delete this student?"
      description="The record will be permanently removed. This action cannot be undone."
      confirmLabel="Delete"
    />
  ),
}

export const CancelOrder: Story = {
  args: {
    open: false,
    onOpenChange: () => undefined,
    title: 'Cancel order?',
    onConfirm: () => undefined,
  },
  render: () => (
    <Demo
      variant="destructive"
      title="Cancel order ORD-2026001?"
      description="The order moves to Cancelled. Already-paid invoices will need a manual refund."
      confirmLabel="Cancel order"
    />
  ),
}

export const LockAccount: Story = {
  args: {
    open: false,
    onOpenChange: () => undefined,
    title: 'Lock account?',
    onConfirm: () => undefined,
  },
  render: () => (
    <Demo
      variant="destructive"
      title="Lock user@example.com?"
      description="The user will not be able to sign in until you unlock the account."
      confirmLabel="Lock account"
    />
  ),
}

export const SlowConfirm: Story = {
  args: {
    open: false,
    onOpenChange: () => undefined,
    title: 'Sync to ERP?',
    onConfirm: () => undefined,
  },
  render: () => (
    <Demo
      title="Sync to ERP?"
      description="This sample uses a 2 second delay so you can see the loading state."
      confirmLabel="Sync now"
      delayMs={2000}
    />
  ),
}
