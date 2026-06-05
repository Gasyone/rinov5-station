import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import { SubjectSelect, SubjectSegmentedControl } from './ListControls'

const SUBJECTS = ['Tiếng Anh', 'Toán tư duy', 'STEM Robotics']

const meta = {
  component: SubjectSelect,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof SubjectSelect>

export default meta

type Story = StoryObj<typeof meta>

export const Toolbar: Story = {
  args: { value: 'all', subjects: SUBJECTS, onValueChange: () => undefined },
  render: () => {
    function Demo() {
      const [value, setValue] = useState('all')
      return (
        <SubjectSelect
          value={value}
          subjects={SUBJECTS}
          onValueChange={setValue}
          className="h-9 min-w-52"
        />
      )
    }
    return <Demo />
  },
}

export const Inline: Story = {
  args: {
    value: '',
    subjects: SUBJECTS,
    variant: 'inline',
    includeAll: false,
    onValueChange: () => undefined,
  },
  render: () => {
    function Demo() {
      const [value, setValue] = useState('')
      return (
        <SubjectSelect
          value={value}
          subjects={SUBJECTS}
          variant="inline"
          includeAll={false}
          onValueChange={setValue}
          className="h-9 min-w-52 border-solid"
        />
      )
    }
    return <Demo />
  },
}

export const Segmented: Story = {
  args: { value: 'english', subjects: ['english', 'math'], onValueChange: () => undefined },
  render: () => {
    function Demo() {
      const [value, setValue] = useState<'english' | 'math'>('english')
      return (
        <SubjectSegmentedControl
          value={value}
          subjects={['english', 'math'] as const}
          getLabel={(subject) => (subject === 'english' ? 'Tiếng Anh' : 'Toán')}
          onValueChange={setValue}
        />
      )
    }
    return <Demo />
  },
}
