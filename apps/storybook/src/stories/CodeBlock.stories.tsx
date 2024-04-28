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
    initialCode: `/**
* This code relies on the \`process\` object, which is a Node.js-specific
* feature that provides information about the current process,
* and \`process.pid\`, which returns the ID of the current process.
*/
if (typeof process !== 'undefined') {
  console.log(process.pid);
}
`,
  },
}
