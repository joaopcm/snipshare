import { WebContainer } from '@webcontainer/api'
import React, {
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react'

export interface WebContainerContextType {
  getWebContainerInstance: () => Promise<WebContainer>
  destroyWebContainerInstance: () => void
}

export const WebContainerContext = React.createContext<
  WebContainerContextType | undefined
>(undefined)

export type SetOutput = Dispatch<SetStateAction<string[]>>

export interface WebContainerProviderProps extends PropsWithChildren {}

export const WebContainerProvider: React.FC<WebContainerProviderProps> = ({
  children,
}) => {
  const webContainerRef = useRef<WebContainer>()

  const getWebContainerInstance = useCallback(async () => {
    if (!webContainerRef.current) {
      const instance = await WebContainer.boot()
      webContainerRef.current = instance
      return instance
    }
    return webContainerRef.current
  }, [])

  const destroyWebContainerInstance = useCallback(() => {
    webContainerRef.current?.teardown()
    webContainerRef.current = undefined
  }, [])

  useEffect(() => {
    return () => {
      destroyWebContainerInstance()
    }
  }, [destroyWebContainerInstance])

  return (
    <WebContainerContext.Provider
      value={{
        getWebContainerInstance,
        destroyWebContainerInstance,
      }}
    >
      {children}
    </WebContainerContext.Provider>
  )
}

export const useWebContainer = () => {
  const context = useContext(WebContainerContext)
  if (!context) {
    throw new Error(
      'useWebContainer hook must be used within a WebContainerProvider',
    )
  }
  return context
}
