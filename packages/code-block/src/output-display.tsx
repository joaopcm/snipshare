import React from 'react'

import { useCodeEditor } from './contexts/code-editor'

export interface OutputDisplayProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const OutputDisplay: React.FC<OutputDisplayProps> = (props) => {
  const { output } = useCodeEditor()

  return (
    <div style={{ fontFamily: 'monospace', fontSize: '0.9em' }} {...props}>
      {output.map((line, index) => (
        <div key={index} dangerouslySetInnerHTML={{ __html: line }} />
      ))}
    </div>
  )
}
