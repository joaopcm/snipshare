import React from 'react'

import { useCodeEditor } from './contexts/code-editor'

export interface OutputDisplayProps
  extends React.ButtonHTMLAttributes<HTMLDivElement> {}

export const OutputDisplay: React.FC<OutputDisplayProps> = (props) => {
  const { output } = useCodeEditor()

  return (
    <div
      style={{ fontFamily: 'monospace', fontSize: '0.9em', color: 'green' }}
      {...props}
    >
      {output.map((line, index) => (
        <div
          key={`${line}-${index}`}
          dangerouslySetInnerHTML={{ __html: line }}
        />
      ))}
    </div>
  )
}
