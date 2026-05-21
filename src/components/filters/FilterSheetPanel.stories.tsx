import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'
import { Button } from '@/components/ui/button'
import { FilterSheetPanel, type FilterSection } from './FilterSheetPanel'

const baseSections: FilterSection[] = [
  {
    id: 'school',
    title: 'School',
    options: [
      { value: 'rino-hanoi', label: 'Rino Hanoi', count: 12, checked: true },
      { value: 'rino-saigon', label: 'Rino Saigon', count: 18 },
      { value: 'rino-danang', label: 'Rino Danang', count: 7 },
    ],
  },
  {
    id: 'status',
    title: 'Status',
    options: [
      { value: 'booked', label: 'Assessment booked', count: 8 },
      { value: 'assessing', label: 'Assessing', count: 6, checked: true },
      { value: 'completed', label: 'Completed', count: 15 },
    ],
  },
]

const meta = {
  component: FilterSheetPanel,
  tags: ['ai-generated'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof FilterSheetPanel>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    open: true,
    sections: baseSections,
    onOpenChange: () => undefined,
    onToggle: () => undefined,
    onClearAll: () => undefined,
  },
  render: function FilterSheetPanelStory() {
    const [open, setOpen] = useState(true)
    const [sections, setSections] = useState(baseSections)

    return (
      <div className="min-h-96 w-80">
        <Button onClick={() => setOpen(true)}>Open filters</Button>
        <FilterSheetPanel
          open={open}
          onOpenChange={setOpen}
          sections={sections}
          onToggle={(sectionId, value) => {
            setSections((current) =>
              current.map((section) =>
                section.id === sectionId
                  ? {
                      ...section,
                      options: section.options.map((option) =>
                        option.value === value ? { ...option, checked: !option.checked } : option
                      ),
                    }
                  : section
              )
            )
          }}
          onClearAll={() => {
            setSections((current) =>
              current.map((section) => ({
                ...section,
                options: section.options.map((option) => ({ ...option, checked: false })),
              }))
            )
          }}
        />
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    await expect(await body.findByRole('dialog')).toBeVisible()
    await expect(body.getByText('Rino Hanoi')).toBeVisible()
    await expect(body.getByText('Assessing')).toBeVisible()
  },
}
