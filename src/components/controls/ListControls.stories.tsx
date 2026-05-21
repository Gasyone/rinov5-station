import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Bell, Download, Settings } from 'lucide-react'
import {
  ExpandableSearch,
  FilterIconButton,
  IconActionButton,
  SegmentedControl,
  ToolbarSelect,
} from './ListControls'

const meta = {
  title: 'Controls/ListControls',
  parameters: { layout: 'padded' },
} satisfies Meta

export default meta

type Story = StoryObj

// ── SegmentedControl ─────────────────────────────────────────

function SegmentedDemo() {
  const [value, setValue] = useState<'english' | 'math'>('english')
  return (
    <SegmentedControl
      value={value}
      options={[
        { value: 'english', label: 'English' },
        { value: 'math', label: 'Math' },
      ]}
      onValueChange={setValue}
    />
  )
}

export const Segmented: Story = { render: () => <SegmentedDemo /> }

export const SegmentedManyOptions: Story = {
  render: () => {
    function Demo() {
      const [value, setValue] = useState<'day' | 'week' | 'month' | 'year'>('week')
      return (
        <SegmentedControl
          value={value}
          options={[
            { value: 'day', label: 'Day' },
            { value: 'week', label: 'Week' },
            { value: 'month', label: 'Month' },
            { value: 'year', label: 'Year' },
          ]}
          onValueChange={setValue}
        />
      )
    }
    return <Demo />
  },
}

// ── ToolbarSelect ────────────────────────────────────────────

export const ToolbarSelectStory: Story = {
  name: 'ToolbarSelect',
  render: () => {
    function Demo() {
      const [value, setValue] = useState('all')
      return (
        <ToolbarSelect
          value={value}
          ariaLabel="Branch"
          options={[
            { value: 'all', label: 'All branches' },
            { value: 'hn', label: 'Hà Nội' },
            { value: 'hcm', label: 'Hồ Chí Minh' },
            { value: 'dn', label: 'Đà Nẵng' },
          ]}
          onValueChange={setValue}
        />
      )
    }
    return <Demo />
  },
}

// ── IconActionButton ─────────────────────────────────────────

export const IconAction: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <IconActionButton icon={Bell} label="Notifications" onClick={() => undefined} />
      <IconActionButton icon={Bell} label="Notifications" activeCount={3} onClick={() => undefined} />
      <IconActionButton icon={Settings} label="Settings" onClick={() => undefined} />
      <IconActionButton icon={Download} label="Export" disabled onClick={() => undefined} />
    </div>
  ),
}

// ── FilterIconButton ─────────────────────────────────────────

export const FilterIcon: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <FilterIconButton onClick={() => undefined} />
      <FilterIconButton count={2} onClick={() => undefined} />
      <FilterIconButton count={12} onClick={() => undefined} />
    </div>
  ),
}

// ── ExpandableSearch ─────────────────────────────────────────

function ExpandableSearchDemo({ initial = '' }: { initial?: string }) {
  const [value, setValue] = useState(initial)
  return (
    <ExpandableSearch
      value={value}
      onValueChange={setValue}
      placeholder="Search students..."
      label="Search students"
    />
  )
}

export const Expandable: Story = {
  name: 'ExpandableSearch — Collapsed',
  render: () => <ExpandableSearchDemo />,
}

export const ExpandableOpen: Story = {
  name: 'ExpandableSearch — Pre-filled',
  render: () => <ExpandableSearchDemo initial="nguyễn" />,
}

// ── Combined toolbar example ─────────────────────────────────

export const FullToolbar: Story = {
  render: () => {
    function Demo() {
      const [subject, setSubject] = useState<'english' | 'math'>('english')
      const [branch, setBranch] = useState('all')
      const [search, setSearch] = useState('')
      return (
        <div className="flex flex-wrap items-center gap-2 rounded-md border border-border bg-card p-3">
          <SegmentedControl
            value={subject}
            options={[
              { value: 'english', label: 'English' },
              { value: 'math', label: 'Math' },
            ]}
            onValueChange={setSubject}
          />
          <ToolbarSelect
            value={branch}
            ariaLabel="Branch"
            options={[
              { value: 'all', label: 'All branches' },
              { value: 'hn', label: 'Hà Nội' },
              { value: 'hcm', label: 'Hồ Chí Minh' },
            ]}
            onValueChange={setBranch}
          />
          <div className="ml-auto flex items-center gap-2">
            <ExpandableSearch value={search} onValueChange={setSearch} placeholder="Search..." />
            <FilterIconButton count={2} onClick={() => undefined} />
          </div>
        </div>
      )
    }
    return <Demo />
  },
}
