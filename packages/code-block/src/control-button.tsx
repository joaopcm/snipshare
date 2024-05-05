import React, { useCallback } from 'react'

import { useCodeEditor } from './contexts/code-editor'
import { useWebContainer } from './contexts/web-container'

export interface ControlButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const ControlButton: React.FC<ControlButtonProps> = ({
  children,
  ...props
}) => {
  const { evaluateCode, isRunning, setOutput, setIsRunning } = useCodeEditor()
  const { destroyWebContainerInstance } = useWebContainer()

  const handleStop = useCallback(() => {
    destroyWebContainerInstance()
    setOutput([])
    setIsRunning(false)
  }, [destroyWebContainerInstance, setOutput, setIsRunning])

  return (
    <button {...props} onClick={isRunning ? handleStop : evaluateCode}>
      {children}
    </button>
  )
}
