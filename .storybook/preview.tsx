import type { Preview } from '@storybook/nextjs-vite'
import MockDate from 'mockdate'
import { initialize, mswLoader } from 'msw-storybook-addon'
import { Toaster } from '../src/components/ui/sonner'
import { TooltipProvider } from '../src/components/ui/tooltip'
import '../src/app/globals.css'
import { mswHandlers } from './msw-handlers'

initialize({ onUnhandledRequest: 'bypass' })

const preview: Preview = {
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
        <Toaster richColors closeButton position="top-right" />
      </TooltipProvider>
    ),
  ],
  loaders: [mswLoader],
  parameters: {
    nextjs: {
      appDirectory: true,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    msw: {
      handlers: mswHandlers,
    },
  },
  async beforeEach() {
    localStorage.setItem(
      'rinov5-ui',
      JSON.stringify({
        state: {
          theme: 'light',
          locale: 'vi',
        },
        version: 0,
      })
    )
    localStorage.setItem(
      'rinov5-auth',
      JSON.stringify({
        state: {
          isAuthenticated: true,
          user: {
            id: 'demo-user',
            name: 'Admin Demo',
            email: 'admin@demo.com',
            role: 'admin',
          },
        },
        version: 0,
      })
    )
    MockDate.set('2026-05-18T12:00:00+07:00')
  },
}

export default preview
