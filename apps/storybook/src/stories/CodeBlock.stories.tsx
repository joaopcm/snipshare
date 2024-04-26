import { CodeEditorProvider, WebContainerProvider } from '@snipshare/code-block'
import type { Meta, StoryObj } from '@storybook/react'

import { MyCodeBlock } from '@/components/my-code-block'

const meta = {
  title: 'SnipShare/CodeBlock',
  component: MyCodeBlock,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <WebContainerProvider>
        <CodeEditorProvider>
          <div className="flex h-screen items-center justify-center bg-[#27272A] p-10">
            <Story />
          </div>
        </CodeEditorProvider>
      </WebContainerProvider>
    ),
  ],
} satisfies Meta<typeof MyCodeBlock>

export default meta

type Story = StoryObj<typeof MyCodeBlock>

export const Default: Story = {
  args: {
    styled: true,
    readOnly: false,
    initialCode: 'console.log("Hello, world!")',
  },
}
