# Unstyled, composable, flexible, and performant React component for executing Node.js code directly in the browser.

### Interactive code block component for React 💻 by [@jopcmelo](https://twitter.com/jopcmelo)

https://github.com/joaopcm/nodepad/assets/58827242/f0bd2b7d-3b3f-4dbf-86a8-9739108e93b7

## Usage

```bash
npm install @snipshare/code-block
```

Then, import the component.

```diff
+'use client'
+import { CodeBlock, CodeEditorProvider, WebContainerProvider, useCodeEditor } from '@snipshare/code-block'

function MyComponent() {
  return (
+    // Only instantiate a single WebContainerProvider in your web app
+    <WebContainerProvider>

+      // If you want to have multiple code blocks in your web app, each instance has its own CodeEditorProvider
+      <CodeEditorProvider>
        <div>
+          <CodeBlock.Editor />
+          <CodeBlock.ControlButton>
+            {isRunning ? "Stop running" : "Run code"}
+          </CodeBlock.ControlButton>
+          <CodeBlock.OutputDisplay />
        </div>
+      </CodeEditorProvider>
+    </WebContainerProvider>
  );
}

```

## Default example

The example below uses [TailwindCSS](https://tailwindcss.com/docs/installation) and [@shadcn/ui](https://ui.shadcn.com/docs/installation):

```tsx
import { CodeBlock, useCodeEditor } from '@snipshare/code-block'
import { Loader2, RocketIcon } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

import { buttonVariants } from './ui/button'

export const MyCodeBlock: React.FC = () => {
  const { isRunning, output, code } = useCodeEditor()
  const editorColumnRef = useRef<HTMLDivElement>(null)
  const [terminalHeight, setTerminalHeight] = useState<string>('auto')

  useEffect(() => {
    if (!editorColumnRef.current) return
    setTerminalHeight(`${editorColumnRef.current.clientHeight}px`)
  }, [editorColumnRef, code])

  return (
    <div className="flex min-h-[600px] flex-1 gap-4">
      <div className="flex flex-1 flex-col gap-4" ref={editorColumnRef}>
        <div className="bg-primary flex flex-1 overflow-y-scroll rounded-3xl border border-zinc-700 p-8 shadow-inner">
          <CodeBlock.Editor className="bg-primary flex-1 text-base font-medium tracking-wide text-zinc-100" />
        </div>

        <CodeBlock.ControlButton
          className={cn(
            buttonVariants({
              variant: isRunning ? 'destructive' : 'default',
              size: 'lg',
            }),
            'rounded-3xl'
          )}
        >
          {isRunning ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RocketIcon className="mr-2 h-4 w-4" />
          )}

          {isRunning ? 'Stop running' : 'Run code'}
        </CodeBlock.ControlButton>
      </div>

      <div
        className="flex w-1/3 flex-col overflow-auto whitespace-pre rounded-3xl bg-black p-4 font-mono text-xs text-zinc-400"
        style={{
          maxHeight: terminalHeight,
          overflow: 'auto',
        }}
      >
        {output.map((line, index) => (
          <span
            key={`${line}-${index}`}
            dangerouslySetInnerHTML={{ __html: line }}
            className="block"
          />
        ))}
      </div>
    </div>
  )
}
```

## How it works

Currently, there's no way to run Node.js code directly in the browser easily. This component uses the [WebContainer API](https://webcontainers.io/)
under the hoods to run Node.js code in the browser. It takes care of all the communication with the workers, streams,
and outputs for you so you don't have to.

## Features

This is the most complete and powerful code snippet component on the web. It's fully composable, flexible, and performant.

<details>
<summary>Smart dependency installation</summary>

This component uses [pnpm](https://pnpm.io/) to install dependencies. It automatically detects your dependencies and
installs them.

You can use both `import` and `require` statements in your code snippets.

</details>

<details>
<summary>Smart versioning dependency installation</summary>

You can specify which version of a package you want to install by adding a comment right after the package import
statement. For example:

```ts
import Fastify from 'fastify' // 4.10.2
```

And it'll install that exact version.

If no version is specified, it'll install the latest version by default.

If the package doesn't exist, it'll throw an error when you run the code snippet.
</details>

<details>
<summary>TypeScript support</summary>

By default, all the code snippets are stored as TypeScript files. When you run the code snippet, it automatically builds
your file into JavaScript and executes it.

It means you don't have to use TypeScript in your code snippets, but you're free to use it if you want.

</details>

<details>
<summary>Composable architecture</summary>

You choose how you want to build and customize your own code block component. From `@snipshare/code-block`, you can
directly import the components by themselves, or you can use the helper hooks to build your own, from scratch.

With the `useWebContainer` hook, you get access to the web container instance, allowing you to retrieve it or destroy it.

Also, with the `useCodeEditor` hook, you get access to the code editor instance, allowing you to interact with it by:

- Calling `setCode` to set the code in the editor;
- Reading `code` to get the code in the editor;
- Calling `setOutput` to set the output in the terminal;
- Reading `output` to get the output in the terminal;
- Reading `isRunning` to check if the code is being executed; and
- Calling `evaluateCode` to programmatically execute the code.
</details>

<details>
<summary>Run an Node.js API directly from your browser</summary>

As this component uses the Web Containers API under the hood, you can run Node.js API directly from your browser.
It means that if you try out to run the following code, you'll instantiate a new API:

```ts
import Fastify from 'fastify';

const fastify = Fastify({ logger: true });

fastify.get('/', async (request, reply) => {
  return { greeting: 'Hello World' };
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    console.log(`server listening on ${
      fastify
        .server
        .address()
        .port
    }`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
```

And you'll see in the terminal that the component has identified an API being running on port 3000,
logging out a message with the API URL.

Unfortunately, the Web Containers API doesn't allow you to access the generated URL in a different browser window. If
you want to head over there, you'll need to insert the generated URL into a `iframe` element, as it's recommended [here](https://webcontainers.io/guides/quickstart#_4-preview).

Once the API is updated and fixes this issue, you'll be able to open the generated URL and see the API in action.
</details>

## API Reference

> 🟡 **Warning!**
> 
> In order to use this component, you need to configure COOP/COEP headers in your web app. See how to configure them
> [here](https://webcontainers.io/guides/configuring-headers#configuring-headers).
>
> If you're using Next.js, you can easily configure these headers in your `next.config.ts` file. Check it out [here](https://gist.github.com/joaopcm/1233ea2f1e6821252ff159d4fec123f2).

### Using this component in a Next.js app

### `CodeBlock.Editor`

This is the code editor instance. This component uses the `useCodeEditor` hook to manage the code snippet internally.

### Props

```ts
import type { TextareaCodeEditorProps } from '@uiw/react-textarea-code-editor'

type LimitedTextareaCodeEditorProps = Omit<
  TextareaCodeEditorProps,
  'lang' | 'language' | 'value' | 'onChange' | 'spellCheck' | 'disabled'
>

export interface CodeEditorProps extends LimitedTextareaCodeEditorProps {
  // Whether the code editor is read-only.
  readOnly?: boolean

  // The initial code to be executed. If not provided, the code will be empty by default.
  initialCode?: string
}
```

### `CodeBlock.ControlButton`

This is the button that controls the code execution. You can run or stop the code execution.

It uses the `useCodeEditor` hook to control different states internally, like when the code snippet is running or not, storing the output from the streams, etc.

Also, it's using the `useWebContainer` hook to get access to the web container instance and be able to destroy it whenever you interrupt the code execution.

It's a simple, native HTML button. You can use it in any way you want.

### Props

```ts
export interface ControlButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}
```

### `CodeBlock.OutputDisplay`

This is the output display of the code execution. It uses the `useCodeEditor` hook to manage the output internally.

This component will print out all the messages from the code execution, including:
- Dependencies installation messages;
- Error messages;
- Output messages;
- Logs messages;
- and more.

It's a simple, native HTML div element. It loops through all the output messages and renders them as HTML elements.

### Props

```ts
export interface OutputDisplayProps
  extends React.HTMLAttributes<HTMLDivElement> {}
```

## Caveats
<details>
<summary>It's locked to the Node.js 18.18.0</summary>

If you need to run some code that relies on newer Node.js versions, you will not be able to use this component, unfortunately.

The Web Containers API is well-maintained and has been receiving some great updates in the past few years. It means that at some point, the Node.js version in the API might be updated.
</details>

<details>
<summary>No support for multiple code snippets execution</summary>

Unfortunately, the Web Containers API does not allow you to run multiple code snippets at the same time. You will need to run each code snippet one at a time, or else your web container will be destroyed and booted again for each code snippet.

Note that it doesn't mean you cannot instantiate multiple code snippets at the same time. It just means that the code snippets should be executed one after the other.
</details>