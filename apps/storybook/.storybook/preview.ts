import type { Preview } from "@storybook/react";
import { withWebContainer } from "./decorators";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        // color: /(background|color)$/i,
        // date: /Date$/i,
      },
    },
  },
};

export default preview;
