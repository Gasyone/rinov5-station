import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { StatusTiles, type StatusTile } from './StatusTiles'

type DemoId = 'all' | 'active' | 'pending' | 'locked' | 'failed'

const tiles: StatusTile<DemoId>[] = [
  { id: 'all', label: 'All', count: 120, semantic: 'neutral' },
  { id: 'active', label: 'Active', count: 84, status: 'active' },
  { id: 'pending', label: 'Pending', count: 22, status: 'pending' },
  { id: 'locked', label: 'Locked', count: 9, status: 'locked' },
  { id: 'failed', label: 'Failed', count: 5, status: 'failed' },
]

function Interactive({ initial = 'all' as DemoId }) {
  const [active, setActive] = useState<DemoId>(initial)
  return <StatusTiles tiles={tiles} activeId={active} onSelect={setActive} />
}

const meta = {
  title: 'Shared/StatusTiles',
  component: StatusTiles,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof StatusTiles<DemoId>>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { tiles, activeId: 'all', onSelect: () => undefined },
  render: () => <Interactive />,
}

export const PreSelected: Story = {
  args: { tiles, activeId: 'pending', onSelect: () => undefined },
  render: () => <Interactive initial="pending" />,
}
