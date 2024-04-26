import type { Meta, StoryObj } from "@storybook/react";
import {
  WebContainerProvider,
  CodeEditorProvider,
  CodeBlock,
  useCodeEditor,
} from "@snipshare/code-block";

const MyCodeBlock = () => {
  const { isRunning } = useCodeEditor();

  return (
    <div>
      <h1>My Code Block</h1>
      <CodeBlock.Editor />
      <CodeBlock.ControlButton>
        {isRunning ? "Stop" : "Run"}
      </CodeBlock.ControlButton>
      <CodeBlock.OutputDisplay />
    </div>
  );
};

const meta = {
  title: "SnipShare/CodeBlock",
  component: MyCodeBlock,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <WebContainerProvider>
        <CodeEditorProvider>
          <Story />
        </CodeEditorProvider>
      </WebContainerProvider>
    ),
  ],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unstyled: Story = {
  args: {},
};

export const Styled: Story = {
  args: {},
};
